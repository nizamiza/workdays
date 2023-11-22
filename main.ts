import dayjs from "npm:dayjs@1.11.10";
import ical from "npm:node-ical@0.16.1";

export type PublicHoliday = {
  date: Date;
  name: string;
};

export type DateArg = Parameters<typeof dayjs>[0];

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type GetWorkDaysForDateRangeParameters = {
  /**
   * URL of Public holidays ICalendar. E.g. Slovak public holidays calendar:
   * ```plain
   * https://calendar.google.com/calendar/ical/en.slovak%23holiday%40group.v.calendar.google.com/public/basic.ics
   * ```
   */
  holidaysIcalUrl: string;
  /**
   * Starting date for the period, inclusive.
   */
  startDate: DateArg;
  /**
   * Ending date for the period, inclusive. By default, end of `startDate`'s
   * month is used.
   */
  endDate?: DateArg;
  /**
   * Week day numbers to be treated as business (work) days. Values from
   * 0 (Sunday) to 6 (Saturday) are expected. Defaults to:
   * ```typescript
   * [1, 2, 3, 4, 5]
   * ```
   */
  businessDays?: WeekDay[];
};

export const DEFAULT_BUSINESS_DAYS: WeekDay[] = [1, 2, 3, 4, 5];

/**
 * Checks whether the given date value is a business (work) day.
 */
export function isBusinessDay(businessDays: WeekDay[], value: DateArg) {
  return businessDays.includes(dayjs(value).day() as WeekDay);
}

/**
 * Retrieves list of work days for the specified parameters.
 */
export async function getWorkDaysForDateRange({
  holidaysIcalUrl,
  startDate,
  endDate = dayjs(startDate).endOf("month"),
  businessDays = DEFAULT_BUSINESS_DAYS,
}: GetWorkDaysForDateRangeParameters): Promise<Date[]> {
  const holidays = await fetchPublicHolidays(holidaysIcalUrl);

  const isHoliday = (value: DateArg) => {
    return Boolean(
      holidays.find((holiday) => dayjs(holiday.date).isSame(value, "date"))
    );
  };

  let currentDay = dayjs(startDate);
  const end = dayjs(endDate);

  const workDays: Date[] = [];

  while (true) {
    if (!isHoliday(currentDay) && isBusinessDay(businessDays, currentDay)) {
      workDays.push(currentDay.clone().toDate());
    }

    currentDay = currentDay.add(1, "day");

    if (currentDay.isAfter(end)) {
      break;
    }
  }

  return workDays;
}

/**
 * Fetches list of public holidays for the given ICalendar URL.
 */
export function fetchPublicHolidays(url: string): Promise<PublicHoliday[]> {
  return new Promise((resolve, reject) => {
    ical.fromURL(url, {}, (error, data) => {
      if (error) {
        console.error(error);
        reject(error);
      }

      const holidays: PublicHoliday[] = [];

      for (const key in data) {
        const event = data[key];

        if (event.type !== "VEVENT") {
          continue;
        }

        if (!/public holiday/i.test(event.description)) {
          continue;
        }

        holidays.push({
          date: event.start,
          name: event.summary,
        });
      }

      resolve(holidays);
    });
  });
}
