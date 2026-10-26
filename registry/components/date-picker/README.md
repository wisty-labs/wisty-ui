# Date picker

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/date-picker](https://ui.wisty.ai/date-picker) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks a day, typed in the field or chosen from a calendar under it. Holds a day with no time, like a Date field.

```bash
npx shadcn@latest add @wisty/date-picker
```

## Examples

- `default` (Close date): A close date typed in the field or picked from the calendar under it, shown as Jun 18, 2026 in the default medium `dateStyle`.
- `min-max` (Min and max): Days outside `min` and `max` are disabled, the year picklist stops at their years, and a typed day outside them is an error.
- `states` (States): A required field showing the error `onValueChange` reports (empty or bad text), and a `disabled` one holding a date.
- `reporting-period` (Reporting period): Two date pickers for a period, each bounding the other with `min` and `max`: there's no range picker.
- `dialog` (In a dialog): A due date in a modal dialog: the calendar opens over it, and Escape closes the calendar first, then the dialog.

## When to use

- People enter one day in a form, like a close date, a due date or a birthday.
- People type the date or pick it from a calendar under the field. The field shows it in the locale's style, "Jun 18, 2026" by default, and `dateStyle` changes it.
- The value is a day with no time and no time zone, like a Salesforce Date field. The date picker holds it as `"YYYY-MM-DD"`.
- Some days can't be picked, like dates before today. Pass `min` and `max`.
- It replaces `lightning-input` with `type="date"`.

## When not to use

- The value is a date and a time, like a Salesforce Date/Time field. The date picker holds a day only.
- People pick a range, like a reporting period. Use two date pickers, each bounding the other with `min` and `max`, as the reporting period example does.
- The calendar is always on the page, not in a field. Use Calendar.
- A button opens the calendar, as in Salesforce's React template. Compose Calendar in a Popover. People type in the date picker's field.
- The date is only read. Show it as text.

## Usage

```tsx
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
} from "@/components/wisty/date-picker"
```

```text
DatePicker
├── DatePickerControl
│   ├── DatePickerInput
│   └── DatePickerTrigger
└── DatePickerContent
    ├── DatePickerCalendar
    └── DatePickerToday
```

`DatePicker` holds the value, the typed text and the calendar's state; the other parts only draw. `onValueChange` gets the day, or `null` with the reason when the text isn't a date the field accepts. Keep the reason to show a message:

```tsx
"use client"

import { useState } from "react"

import { type DatePickerError } from "@/components/wisty/date-picker"
```

```tsx
export function CloseDate() {
  const [closeDate, setCloseDate] = useState<string | null>(null)
  const [error, setError] = useState<DatePickerError>()

  return (
    <DatePicker
      name="CloseDate"
      value={closeDate}
      onValueChange={(value, details) => {
        setCloseDate(value)
        setError(details.error)
      }}
    >
      <DatePickerControl>
        <DatePickerInput aria-label="Close date" />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerCalendar />
        <DatePickerToday />
      </DatePickerContent>
    </DatePicker>
  )
}
```

The field reads `"YYYY-MM-DD"`, the locale's numeric order (10/12/2026 in en-US) and a month name with a day and a year (Oct 12, 2026; Sept works too), in the locale's own digits; a two-digit year is in the 2000s. `error` is `"format"` for text it can't read, and `"min"` or `"max"` for a day outside the bounds. In a form, `name` submits the day as `"YYYY-MM-DD"`. To accept other text, like "next Friday", pass your own `parse`.

In Radix projects, the calendar's popover is still built on `@base-ui/react`, so installing Date picker adds that package beside `radix-ui`. The two work side by side.

## Rules

- Keep the value a `"YYYY-MM-DD"` string. A `Date` or a timestamp can land on the day before in another time zone.
- Pass a `value` that names a real day. One that doesn't, like `"2023-02-29"`, shows as it is with a `"format"` error, selects nothing in the calendar and submits nothing; it's never rolled to the next day, and `onValueChange` isn't called for it.
- Changing `locale` or `dateStyle` shows the value again in the new style. Text typed and not yet committed is replaced, never read in the new locale.
- Disabled, the date picker submits nothing with a form, as a disabled input doesn't.
- Keep `DatePickerInput` and `DatePickerTrigger` inside `DatePickerControl`, and `DatePickerCalendar` inside `DatePickerContent`: the calendar opens under the control, and the root wires them together.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `DatePicker` |  |
| `DatePickerControl` | [InputGroup](https://ui.wisty.ai/input-group#api-InputGroup) |
| `DatePickerInput` | [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) |
| `DatePickerTrigger` | [InputGroupButton](https://ui.wisty.ai/input-group#api-InputGroupButton) |
| `DatePickerContent` | [Base UI Popover.Popup](https://base-ui.com/react/components/popover#popup) |
| `DatePickerCalendar` | [Calendar](https://ui.wisty.ai/calendar#api-Calendar) |
| `DatePickerToday` | [Button](https://ui.wisty.ai/button#api-Button) |

### DatePicker

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value`? | `string \| null` |  | The day, as "YYYY-MM-DD", or null when the field is empty or its text isn't accepted. |
| `defaultValue`? | `string \| null` | `null` |  |
| `onValueChange`? | `( value: string \| null, details: DatePickerChangeDetails ) => void` |  |  |
| `min`? | `string` |  | The earliest day people can pick or type, as "YYYY-MM-DD". |
| `max`? | `string` |  | The latest day people can pick or type, as "YYYY-MM-DD". |
| `today`? | `string` |  | The day the calendar marks as today, as "YYYY-MM-DD". Default the browser's date. |
| `locale`? | `string` | `"en-US"` | Formats and reads dates. |
| `dateStyle`? | `"short" \| "medium" \| "long"` | `"medium"` | How the field shows the date. |
| `parse`? | `DatePickerParse` | `parseDate` | Reads typed text into "YYYY-MM-DD", or null when it isn't a date. |
| `name`? | `string` |  | Submits the value as "YYYY-MM-DD" with a form, from a hidden input. |
| `required`? | `boolean` | `false` |  |
| `disabled`? | `boolean` | `false` |  |
| `readOnly`? | `boolean` | `false` |  |

### DatePickerCalendar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `captionLayout`? | `"label" \| "dropdown" \| "dropdown-months" \| "dropdown-years"` | `"dropdown-years"` | Show dropdowns to navigate between months or years. |

### DatePickerToday

| Prop | Type | Default |
| --- | --- | --- |
| `children`? | `ReactNode` | `"Today"` |

### parseDate

Reads a typed date: "YYYY-MM-DD", the locale's numeric order, or a month name (cut short too) with a day and a year, in the locale's digits. A two-digit year is in the 2000s. Returns "YYYY-MM-DD", or null when it isn't a date.

| Parameter | Type | Default |
| --- | --- | --- |
| `text` | `string` |  |
| `__1` | `{ locale: string }` |  |

Returns `string | null`.

### DatePickerError

```ts
type DatePickerError = "format" | "min" | "max"
```

### DatePickerChangeDetails

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` |  | The field's text when the value changed. |
| `error`? | `DatePickerError` |  | Why the text isn't a date the field accepts. Unset when it is. |

### DatePickerParse

```ts
type DatePickerParse = (
  text: string,
  options: { locale: string }
) => string | null
```

## SLDS mapping

The date picker is SLDS's datepicker as `lightning-input` draws it. `DatePickerControl` is the form element's control with an icon on the right (`slds-input-has-icon_right`), `DatePickerInput` is `slds-input`, and `DatePickerTrigger` is the icon button inside it (`slds-input__icon_right`). `DatePickerContent` is `slds-datepicker` in a dropdown under the field's start edge (`slds-dropdown slds-dropdown_left`). `DatePickerCalendar` draws its header (`slds-datepicker__filter`: the month between the arrows, then the year picklist) and its grid (`slds-datepicker__month`). `DatePickerToday` is the Today link (`slds-text-link`).

Known gaps:

- SLDS swaps in the phone's own date input on mobile. The date picker keeps its field and calendar.
- No "date format visible" help under the field.
- The calendar opens right under the field, over help or error text. SLDS opens it under the whole form element.
- The year picklist's arrow is a chevron, where SLDS draws two arrows, and the calendar icon is lucide's, where SLDS draws `utility:event`.
- The text the date picker adds ("Select a date", "Today", "today" and "selected" in each day's name) is English. Month and weekday names follow `locale`.

## Keyboard interactions

| Keys                                | Action                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Enter or Space on the calendar icon | Opens the calendar with focus on the picked day, or today.                                                    |
| Down Arrow in the field             | Opens the calendar the same way.                                                                              |
| Enter in the field                  | Reads the typed text and shows it in the field's style, or marks it invalid. Leaving the field does the same. |
| Arrow keys                          | Move a day, or a week.                                                                                        |
| Home, End                           | Move to the start or end of the week.                                                                         |
| Page Up, Page Down                  | Move a month. With Shift, a year.                                                                             |
| Enter or Space on a day             | Picks it, closes the calendar and returns focus to the field.                                                 |
| Tab, Shift+Tab                      | Move between the arrows, the year picklist, the days and Today. Focus stays in the calendar.                  |
| Escape                              | Closes the calendar and returns focus to the field. Inside a modal dialog, the first Escape closes only it.   |

A click in the field opens the calendar and keeps focus there, so people can type.

## Accessibility

- Name the field with a `FieldLabel` whose `htmlFor` is `DatePickerInput`'s `id`, or pass `aria-label` to it.
- For an error you decide, like an empty required field, set `aria-invalid` on `DatePickerInput` and point `aria-describedby` at the message. The date picker sets `aria-invalid` itself, and the input's validity, for text it can't read, days outside `min` and `max`, and a `value` that isn't a day.
- In Lightning Blue, today's day in the calendar is 3.67:1, and in Cosmos dark the error text is about 4.3:1, both below WCAG AA's 4.5:1. SLDS's own stylesheet does the same.

## Responsive behavior

- The field fills its parent's width. Set the width on the parent or the Field.
- The calendar is 280px wide. It opens below the field, or above when there's no room below, and never beside it.

## Example code

### Close date

A close date typed in the field or picked from the calendar under it, shown as Jun 18, 2026 in the default medium `dateStyle`.

```tsx
"use client"

import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
} from "@/components/wisty/date-picker"

export default function DatePickerDefault() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Close date</FieldLabel>
      <DatePicker defaultValue="2026-06-18" today="2026-06-10">
        <DatePickerControl>
          <DatePickerInput id={id} />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerCalendar />
          <DatePickerToday />
        </DatePickerContent>
      </DatePicker>
    </Field>
  )
}
```

### Min and max

Days outside `min` and `max` are disabled, the year picklist stops at their years, and a typed day outside them is an error.

```tsx
import { useId } from "react"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
} from "@/components/wisty/date-picker"

export default function DatePickerMinMax() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Follow-up date</FieldLabel>
      <DatePicker min="2026-06-10" max="2026-06-30" today="2026-06-10">
        <DatePickerControl>
          <DatePickerInput id={id} aria-describedby={`${id}-help`} />
          <DatePickerTrigger />
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerCalendar />
          <DatePickerToday />
        </DatePickerContent>
      </DatePicker>
      <FieldDescription id={`${id}-help`}>
        From today to the end of the quarter.
      </FieldDescription>
    </Field>
  )
}
```

### States

A required field showing the error `onValueChange` reports (empty or bad text), and a `disabled` one holding a date.

```tsx
"use client"

import { useId, useState } from "react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
} from "@/components/wisty/date-picker"

const messages = {
  required: "Complete this field.",
  format: "Your entry does not match the allowed format MMM d, yyyy.",
  min: "Value must be Jun 10, 2026 or later.",
  max: "Value must be Jun 30, 2026 or earlier.",
}

export default function DatePickerStates() {
  const id = useId()
  const [error, setError] = useState<keyof typeof messages | undefined>(
    "required"
  )

  return (
    <FieldGroup className="max-w-xs">
      <Field data-invalid={error !== undefined}>
        <FieldLabel htmlFor={`${id}-close`}>
          <span>
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
            Close date
          </span>
        </FieldLabel>
        <DatePicker
          required
          today="2026-06-10"
          onValueChange={(value, details) =>
            setError(details.error ?? (value ? undefined : "required"))
          }
        >
          <DatePickerControl>
            <DatePickerInput
              id={`${id}-close`}
              aria-invalid={error !== undefined}
              aria-describedby={error ? `${id}-close-error` : undefined}
            />
            <DatePickerTrigger />
          </DatePickerControl>
          <DatePickerContent>
            <DatePickerCalendar />
            <DatePickerToday />
          </DatePickerContent>
        </DatePicker>
        {error ? (
          <FieldError id={`${id}-close-error`}>{messages[error]}</FieldError>
        ) : null}
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-end`}>Contract end date</FieldLabel>
        <DatePicker defaultValue="2027-03-31" disabled>
          <DatePickerControl>
            <DatePickerInput id={`${id}-end`} />
            <DatePickerTrigger />
          </DatePickerControl>
        </DatePicker>
      </Field>
    </FieldGroup>
  )
}
```

### Reporting period

Two date pickers for a period, each bounding the other with `min` and `max`: there's no range picker.

```tsx
"use client"

import { useId, useState } from "react"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
} from "@/components/wisty/date-picker"

export default function DatePickerReportingPeriod() {
  const id = useId()
  const [start, setStart] = useState<string | null>("2026-04-01")
  const [end, setEnd] = useState<string | null>("2026-06-30")

  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend>Reporting period</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${id}-start`}>Start date</FieldLabel>
          <DatePicker
            value={start}
            onValueChange={setStart}
            max={end ?? undefined}
            today="2026-06-10"
          >
            <DatePickerControl>
              <DatePickerInput id={`${id}-start`} />
              <DatePickerTrigger />
            </DatePickerControl>
            <DatePickerContent>
              <DatePickerCalendar />
              <DatePickerToday />
            </DatePickerContent>
          </DatePicker>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-end`}>End date</FieldLabel>
          <DatePicker
            value={end}
            onValueChange={setEnd}
            min={start ?? undefined}
            today="2026-06-10"
          >
            <DatePickerControl>
              <DatePickerInput id={`${id}-end`} />
              <DatePickerTrigger />
            </DatePickerControl>
            <DatePickerContent>
              <DatePickerCalendar />
              <DatePickerToday />
            </DatePickerContent>
          </DatePicker>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
```

### In a dialog

A due date in a modal dialog: the calendar opens over it, and Escape closes the calendar first, then the dialog.

```tsx
"use client"

import { useId } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
} from "@/components/wisty/date-picker"

export default function DatePickerDialog() {
  const id = useId()

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        New task
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>
            The task is added to the record&apos;s activity.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor={id}>Due date</FieldLabel>
          <DatePicker today="2026-06-10">
            <DatePickerControl>
              <DatePickerInput id={id} />
              <DatePickerTrigger />
            </DatePickerControl>
            <DatePickerContent>
              <DatePickerCalendar />
              <DatePickerToday />
            </DatePickerContent>
          </DatePicker>
        </Field>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```
