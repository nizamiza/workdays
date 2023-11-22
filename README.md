# Work Days

## Overview

The `work_days` module is a Deno module designed to calculate workdays within a specified date range, excluding public holidays. It utilizes the [dayjs](https://day.js.org/) library for date manipulation and [node-ical](https://www.npmjs.com/package/node-ical) for parsing iCalendar files containing public holiday information.

## Usage

Import it into your project via URL:
```typescript
import { getWorkDaysForDateRange } from "https://deno.land/x/work_days/mod.ts"
```

### Example

```typescript
import { getWorkDaysForDateRange } from "work_days";

const SLOVAK_PUBLIC_HOLIDAY_ICAL_URL =
  "https://calendar.google.com/calendar/ical/en.slovak%23holiday%40group.v.calendar.google.com/public/basic.ics";

const workDays = await getWorkDaysForDateRange({
  holidaysIcalUrl: SLOVAK_PUBLIC_HOLIDAY_ICAL_URL,
  startDate: new Date("2023-11-01"),
});

console.log(workDays);
```

## API

### Types

#### `PublicHoliday`

- `date: Date`: The date of the public holiday.
- `name: string`: The name of the public holiday.

#### `WeekDay`

A numeric representation of a week day (0 to 6, where 0 is Sunday and 6 is Saturday).

#### `GetWorkDaysForDateRangeParameters`

- `holidaysIcalUrl: string`: URL of the public holidays iCalendar file.
- `startDate: DateArg`: Starting date for the period (inclusive).
- `endDate?: DateArg`: Ending date for the period (inclusive). Defaults to the end of the `startDate` month.
- `businessDays?: WeekDay[]`: Week day numbers treated as business (work) days. Defaults to Monday to Friday.

### Functions

#### `isBusinessDay(businessDays: WeekDay[], value: DateArg): boolean`

Checks whether the given date is a business (work) day.

#### `getWorkDaysForDateRange(params: GetWorkDaysForDateRangeParameters): Promise<Date[]>`

Retrieves a list of work days for the specified parameters, excluding public holidays.

#### `fetchPublicHolidays(url: string): Promise<PublicHoliday[]>`

Fetches a list of public holidays from the provided iCalendar URL.

## Testing

The module includes a test file ([`main_test.ts`](./main_test.ts)) using Deno's built-in testing framework. Run tests with the following command:

```bash
deno test --allow-read --allow-net --allow-env
```

## License

This module is licensed under the [MIT License](./LICENSE).
