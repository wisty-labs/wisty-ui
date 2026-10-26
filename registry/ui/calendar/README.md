# Calendar

This page shows the Radix version. Base UI projects get [registry/base/ui/calendar.tsx](../../base/ui/calendar.tsx), and [ui.wisty.ai/calendar](https://ui.wisty.ai/calendar) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a month of days to pick a date or a range.

```bash
npx shadcn@latest add @wisty/calendar
```

## Examples

- `default` (Close date): The 18th selected with `mode="single"`, today marked, and days from the months either side.
- `year-picklist` (Year picklist): The month between the arrows and a year picklist, set with `captionLayout="dropdown-years"`, `startMonth` and `endMonth`.
- `range` (Range): A five-day reporting period, the 9th to the 13th, picked with `mode="range"`, with its ends marked.
- `disabled` (Disabled days): Days before today and weekends turned off with `disabled` matchers, as when booking an onsite visit.

## When to use

- People pick a date and seeing the month helps, like a close date near today or a day of the week.
- People pick a range of days, like a trip or a reporting period, as the Range example shows.
- Inside a Popover under a date field, as the grid of a date picker.

## When not to use

- People type a date they already know, like a birth date. Use Input with a format hint.
- The date is years away. Use `captionLayout="dropdown"` so people jump by month and year, or Input.
- People pick a time too. Pair the calendar with a time field.

## Usage

In a form, put the calendar in a `FieldSet` with a `FieldLegend variant="label"`, so the month sits in a group named by the field's label. Point the fieldset's `aria-describedby` at the help text: the calendar's root takes `aria-labelledby` but not `aria-describedby`.

```tsx
"use client"

import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"

export function CloseDate() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <FieldSet className="w-fit" aria-describedby="close-date-help">
      <FieldLegend variant="label">Close Date</FieldLegend>
      <Calendar mode="single" selected={date} onSelect={setDate} />
      <FieldDescription id="close-date-help">
        The quarter ends on June 30.
      </FieldDescription>
    </FieldSet>
  )
}
```

`CalendarDayButton` is the day cell Calendar renders. To change what a day shows, pass your own `DayButton` in `components` and render `CalendarDayButton` inside it, so the day keeps its states.

## Rules

- With `captionLayout="dropdown"` or `"dropdown-years"`, set `startMonth` and `endMonth`, so the picklists list a sensible range.
- Don't restyle the day colors with classes. They come from the theme tokens through the cell's state, and a class pins one look into every theme.
- For a date field, put the calendar in a `PopoverContent` with `className="w-auto p-0"`, opened from a Button that shows the date.

## API reference

| Part | Built on |
| --- | --- |
| `Calendar` | [DayPicker](https://daypicker.dev/api/type-aliases/DayPickerProps) |
| `CalendarDayButton` | [DayPicker DayButton](https://daypicker.dev/api/type-aliases/DayPickerProps) |

### Calendar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `buttonVariant`? | `"link" \| "default" \| "destructive" \| "success" \| "outline" \| "secondary" \| "ghost" \| "outline-brand" \| "destructive-text" \| "inverse" \| null` | `"ghost"` |  |
| `captionLayout`? | `"label" \| "dropdown" \| "dropdown-months" \| "dropdown-years"` | `"label"` | Show dropdowns to navigate between months or years. |
| `showOutsideDays`? | `boolean` | `true` | Show the outside days (days falling in the next or the previous month). |

### CalendarDayButton

| Prop | Type | Default |
| --- | --- | --- |
| `locale`? | `Partial<Locale>` |  |

## SLDS mapping

Calendar is the grid of SLDS 2's `slds-datepicker`, drawn with react-day-picker. The arrows are `slds-button_icon-container` buttons and the weekday headers are SLDS's column headers. Each day is `slds-day`: today is `slds-is-today`, a selected day `slds-is-selected`, a range `slds-is-selected-multi`, and a disabled day `slds-disabled-text`.

Known gaps:

- Weekdays are two letters (Su, Mo). SLDS shows three (Sun, Mon): pass `formatters={{ formatWeekdayName: (date) => date.toLocaleString("en", { weekday: "short" }) }}`.
- SLDS puts the year picklist after the arrows. Here the picklists sit between them.
- SLDS's Today link under the grid isn't part of the calendar. Add a `link` Button below it if you need one.
- Icons are lucide's, not SLDS's utility icons.

## Keyboard interactions

The grid is one tab stop: Tab lands on the selected day, or today.

| Keys                     | Action                                                    |
| ------------------------ | --------------------------------------------------------- |
| Arrow keys               | Move focus a day or a week, crossing into the next month. |
| Home, End                | Move focus to the first or last day of the week.          |
| Page Up, Page Down       | Move focus a month back or forward.                       |
| Shift+Page Up, Page Down | Move focus a year back or forward.                        |
| Enter or Space           | Selects the focused day.                                  |

## Accessibility

- Name the calendar with the field it fills, as Usage shows. On its own the grid is named by the month and year alone.
- The arrows and picklists are named in English ("Go to the Next Month"). Pass `labels` to translate them, with `locale` for the day and month names.
- In Lightning Blue, today is Salesforce's own pair, the link color on the light brand blue, at 3.67:1. It fails AA, and Salesforce's stylesheet fails the same way.

## Responsive behavior

- The calendar has a fixed width and doesn't shrink. Put it in a Popover on small screens, or let its container scroll.
- With `numberOfMonths`, months sit side by side from the `md` breakpoint and stack below it.
- A six-week month is one row taller than a five-week one. Pass `fixedWeeks` to keep the height steady.

## Example code

### Close date

The 18th selected with `mode="single"`, today marked, and days from the months either side.

```tsx
"use client"

import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"

export default function CalendarDefault() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 18))

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 5)}
      today={new Date(2026, 5, 10)}
    />
  )
}
```

### Year picklist

The month between the arrows and a year picklist, set with `captionLayout="dropdown-years"`, `startMonth` and `endMonth`.

```tsx
"use client"

import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"

export default function CalendarYearPicklist() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 18))

  return (
    <Calendar
      mode="single"
      captionLayout="dropdown-years"
      startMonth={new Date(2020, 0)}
      endMonth={new Date(2030, 11)}
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 5)}
      today={new Date(2026, 5, 10)}
    />
  )
}
```

### Range

A five-day reporting period, the 9th to the 13th, picked with `mode="range"`, with its ends marked.

```tsx
"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 5, 9),
    to: new Date(2026, 5, 13),
  })

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={new Date(2026, 5)}
      today={new Date(2026, 5, 10)}
    />
  )
}
```

### Disabled days

Days before today and weekends turned off with `disabled` matchers, as when booking an onsite visit.

```tsx
"use client"

import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"

export default function CalendarDisabled() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 16))

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      disabled={[{ before: new Date(2026, 5, 10) }, { dayOfWeek: [0, 6] }]}
      defaultMonth={new Date(2026, 5)}
      today={new Date(2026, 5, 10)}
    />
  )
}
```
