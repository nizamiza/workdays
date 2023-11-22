import { assertEquals } from "assert";
import { getWorkDaysForDateRange } from "./main.ts";

const SLOVAK_PUBLIC_HOLIDAY_ICAL_URL =
  "https://calendar.google.com/calendar/ical/en.slovak%23holiday%40group.v.calendar.google.com/public/basic.ics";

Deno.test({
  name: "basic ical test",
  async fn() {
    const workDays = await getWorkDaysForDateRange({
      holidaysIcalUrl: SLOVAK_PUBLIC_HOLIDAY_ICAL_URL,
      startDate: new Date("2023-11-01"),
    });

    const expectedWorkDays = [
      "02",
      "03",
      "06",
      "07",
      "08",
      "09",
      "10",
      "13",
      "14",
      "15",
      "16",
      "20",
      "21",
      "22",
      "23",
      "24",
      "27",
      "28",
      "29",
      "30",
    ].map((date) => new Date(`2023-11-${date}`));

    assertEquals(workDays, expectedWorkDays);
  },
});
