import { Dayjs } from "npm:dayjs@1.11.10";

type Period = "day" | "month";

type FormatDateRangeParameters = {
  startDate: Dayjs;
  endDate: Dayjs;
  format?: string;
  combine?: Period[];
  forceCombine?: Period[];
  combinedFormats?: { [Key in Period]: string };
  separator?: string;
};

export const DEFAULT_DATE_FORMAT = "MMM DD" as const;

export function formatDateRange({
  startDate,
  endDate,
  combine = ["day", "month"],
  forceCombine = [],
  combinedFormats = {
    day: "MMM DD",
    month: "MMMM YYYY",
  },
  format = DEFAULT_DATE_FORMAT,
  separator = " - ",
}: FormatDateRangeParameters) {
  if (
    forceCombine.includes("day") ||
    (combine.includes("day") && startDate.isSame(endDate, "day"))
  ) {
    return startDate.format(combinedFormats.day || format);
  }

  const startDateIsStartOfMonth = startDate
    .startOf("month")
    .isSame(startDate, "day");

  const endDateIsEndOfMonth = endDate.endOf("month").isSame(endDate, "day");

  if (
    forceCombine.includes("month") ||
    (combine.includes("month") &&
      startDateIsStartOfMonth &&
      endDateIsEndOfMonth)
  ) {
    return startDate.format(combinedFormats.month || format);
  }

  return `${startDate.format(format)}${separator}${endDate.format(format)}`;
}
