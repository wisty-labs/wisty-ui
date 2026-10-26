# Datetime picker

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/datetime-picker](https://ui.wisty.ai/datetime-picker) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks a date and a time, typed or chosen from a calendar and a list. Holds a local date and time, like a Date/Time field.

```bash
npx shadcn@latest add @wisty/datetime-picker
```

## Examples

- `default` (Event start): An event's start: a date typed or picked from the calendar, and a time typed or picked from the list, under one label.
- `edit` (Edit a saved value): A saved start shown in both halves, controlled with `value` and `onValueChange`, and submitted as one value with `name`.
- `min-max` (Min and max): A callback window with `min` and `max`: days outside are disabled, and on the first and last day the time list starts and stops at their times.
- `states` (States): A required field showing the error on the half `onValueChange` names, a `disabled` one and a `readOnly` one.
- `dialog` (In a dialog): An event's start in a modal dialog: Escape closes the calendar or the time list first, then the dialog.

## When to use

- People enter a date and a time in one field, like an event's start, a callback or an appointment.
- The value is a Salesforce Date/Time field, set by a person reading their own clock. The datetime picker holds it as a local date and time, `"YYYY-MM-DDTHH:MM"`, and the app turns it into an instant in its time zone.
- People type each half or pick it: a date from the calendar, a time from the list.
- Only a window is allowed, like the next three business days. Pass `min` and `max` as dates and times.
- It replaces `lightning-input` with `type="datetime"`.

## When not to use

- The value is a day, like a close date. Use Date picker.
- The value is a time of day with no date, like a store's opening time. Use Time picker.
- People pick a range, like an event's start and end. Use two datetime pickers, each bounding the other with `min` and `max`.
- The date and time are only read. Show them with Output field, which formats an instant in a time zone.

## Usage

```tsx
import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
} from "@/components/wisty/datetime-picker"
```

```text
DateTimePicker
├── DateTimePickerDate
└── DateTimePickerTime
```

The field's label is a `FieldLegend` in a `FieldSet`. Pass its `id` as the picker's `aria-labelledby`, and the inputs are named "Start Date" and "Start Time" after it and their own labels:

```tsx
<FieldSet>
  <FieldLegend variant="label" id="start-label">
    Start
  </FieldLegend>
  <DateTimePicker aria-labelledby="start-label">
    <DateTimePickerDate />
    <DateTimePickerTime />
  </DateTimePicker>
</FieldSet>
```

`onValueChange` gets the date and time once both halves hold one the field accepts. Until then it gets `null`, and its details name the half that's `missing`, or the half that's `invalid` with the `error`. In a form, `name` submits one value, `"YYYY-MM-DDTHH:MM"`.

The value has no time zone. Turn it into an instant, the shape Salesforce stores and Output field shows, with the zone the person is in, and back:

```tsx
import {
  dateTimeToInstant,
  instantToDateTime,
} from "@/components/wisty/datetime-picker"
```

```tsx
const start = instantToDateTime("2026-06-18T13:00:00.000Z", {
  timeZone: "America/New_York",
})
// "2026-06-18T09:00"

const startDateTime = dateTimeToInstant(start, {
  timeZone: "America/New_York",
})
// "2026-06-18T13:00:00.000Z"
```

## Rules

- Keep the value a local `"YYYY-MM-DDTHH:MM"` string. Never pass an instant (`"…Z"`, a `Date`, a timestamp): convert it with `instantToDateTime` in the time zone the person reads their clock in, and convert back with `dateTimeToInstant` in the same zone.
- Put `DateTimePickerDate` before `DateTimePickerTime`, so the tab order runs date, calendar, time.
- A time the clock skips when it goes forward becomes the time after the gap, and a time it shows twice when it goes back is the first. Say so where it matters, like a 2:30 AM appointment.
- Disabled, the datetime picker submits nothing with a form, as a disabled input doesn't.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `DateTimePicker` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `DateTimePickerDate` | [DatePickerInput](https://ui.wisty.ai/date-picker#api-DatePickerInput) |
| `DateTimePickerTime` | [TimePickerInput](https://ui.wisty.ai/time-picker#api-TimePickerInput) |

### DateTimePicker

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value`? | `string \| null` |  | A local date and time, "YYYY-MM-DDTHH:MM", never an instant; null when a half is empty or invalid. |
| `defaultValue`? | `string \| null` | `null` |  |
| `onValueChange`? | `( value: string \| null, details: DateTimePickerChangeDetails ) => void` |  | Called when either half changes; the value is null until both are accepted, details say which isn't. |
| `min`? | `string` |  | The earliest date and time, as "YYYY-MM-DDTHH:MM". |
| `max`? | `string` |  | The latest date and time, as "YYYY-MM-DDTHH:MM". |
| `locale`? | `string` | `"en-US"` | Formats and reads both halves. |
| `dateStyle`? | `"short" \| "medium" \| "long"` | `"medium"` | How the date shows, as the date picker's. |
| `timeStyle`? | `"short" \| "medium"` | `"short"` | How the time shows, as the time picker's: "medium" adds seconds. |
| `step`? | `number` |  | Minutes between the times in the time list. |
| `today`? | `string` |  | The day the calendar marks as today, as "YYYY-MM-DD". |
| `name`? | `string` |  | Submits the value with a form, from a hidden input. |
| `required`? | `boolean` | `false` |  |
| `disabled`? | `boolean` | `false` |  |
| `readOnly`? | `boolean` | `false` |  |
| `dateLabel`? | `React.ReactNode` | `"Date"` | The date input's label, shown above it. |
| `timeLabel`? | `React.ReactNode` | `"Time"` | The time input's label, shown above it. |

### instantToDateTime

An instant as a local date and time on a time zone's clock, "YYYY-MM-DDTHH:MM" (with `seconds`, "YYYY-MM-DDTHH:MM:SS"). Null for something that isn't an instant.

| Parameter | Type | Default |
| --- | --- | --- |
| `instant` | `string \| number \| Date` |  |
| `__1` | `{ timeZone: string; seconds?: boolean }` |  |

Returns `string | null`.

### dateTimeToInstant

A local date and time on a time zone's clock as an instant, an ISO string in UTC. A time the clock shows twice is the first; a time it skips moves forward by the gap. Null for a value that isn't a real date and time, like "2026-02-30T10:00".

| Parameter | Type | Default |
| --- | --- | --- |
| `value` | `string` |  |
| `__1` | `{ timeZone: string }` |  |

Returns `string | null`.

### DateTimePickerError

```ts
type DateTimePickerError = "format" | "min" | "max"
```

### DateTimePickerPart

```ts
type DateTimePickerPart = "date" | "time"
```

### DateTimePickerChangeDetails

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `date` | `string \| null` |  | The date half, as "YYYY-MM-DD", or null when it's empty or invalid. |
| `time` | `string \| null` |  | The time half, as "HH:MM" or "HH:MM:SS", or null when it's empty or invalid. |
| `missing`? | `DateTimePickerPart` |  | The empty half, when the other holds a value. |
| `error`? | `DateTimePickerError` |  | Why a half isn't accepted: unreadable text, or a date and time outside min or max. |
| `invalid`? | `DateTimePickerPart` |  | The half the error is in. |

## SLDS mapping

The datetime picker is SLDS's datetime picker as `lightning-input` draws it: a compound form element (`slds-form-element_compound`), whose legend is the page's `FieldSet` and `FieldLegend`, and a row of two form elements (`slds-form-element__row`). `DateTimePickerDate` is the date picker's form element with its label, and `DateTimePickerTime` the timepicker's (`slds-timepicker`).

Known gaps:

- SLDS swaps in the phone's own date and time input on mobile. The datetime picker keeps its two fields.
- The halves sit side by side at every width; SLDS's small container wraps them.
- The labels the halves add ("Date", "Time") are English unless you pass `dateLabel` and `timeLabel`.

## Keyboard interactions

| Keys           | Action                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Tab, Shift+Tab | Move from the date field to the calendar button to the time field.                                             |
| Down Arrow     | In the date field, opens the calendar. In the time field, opens the list and moves through the times.          |
| Enter          | In the date field, reads the typed date. In the time field, picks the highlighted time or reads the typed one. |
| Escape         | Closes the calendar or the time list. Inside a modal dialog, the first Escape closes only them.                |

The calendar and the time list keep the date picker's and the time picker's other keys.

## Accessibility

- Pass `aria-labelledby` with the legend's `id`, or `aria-label` with the field's label, so each input's name starts with the field's.
- For an error you decide, like an empty required field, set `aria-invalid` and `aria-describedby` on `DateTimePickerDate` or `DateTimePickerTime`, the half it's about, or both. The halves set `aria-invalid` themselves for text they can't read and values out of range.
- In Cosmos dark the error text is about 4.3:1, below WCAG AA's 4.5:1. SLDS's own stylesheet does the same.

## Example code

### Event start

An event's start: a date typed or picked from the calendar, and a time typed or picked from the list, under one label.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
} from "@/components/wisty/datetime-picker"

export default function DateTimePickerDefault() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label" id={id}>
        Start
      </FieldLegend>
      <DateTimePicker aria-labelledby={id} today="2026-06-10">
        <DateTimePickerDate />
        <DateTimePickerTime />
      </DateTimePicker>
    </FieldSet>
  )
}
```

### Edit a saved value

A saved start shown in both halves, controlled with `value` and `onValueChange`, and submitted as one value with `name`.

```tsx
"use client"

import { useId, useState } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
} from "@/components/wisty/datetime-picker"

export default function DateTimePickerEdit() {
  const id = useId()
  const [start, setStart] = useState<string | null>("2026-06-18T09:30")

  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label" id={id}>
        Start
      </FieldLegend>
      <DateTimePicker
        aria-labelledby={id}
        name="StartDateTime"
        value={start}
        onValueChange={setStart}
        today="2026-06-10"
      >
        <DateTimePickerDate />
        <DateTimePickerTime />
      </DateTimePicker>
    </FieldSet>
  )
}
```

### Min and max

A callback window with `min` and `max`: days outside are disabled, and on the first and last day the time list starts and stops at their times.

```tsx
import { useId } from "react"

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
} from "@/components/wisty/datetime-picker"

export default function DateTimePickerMinMax() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label" id={id}>
        Callback
      </FieldLegend>
      <DateTimePicker
        aria-labelledby={id}
        min="2026-06-10T09:00"
        max="2026-06-12T17:00"
        step={30}
        today="2026-06-10"
      >
        <DateTimePickerDate aria-describedby={`${id}-help`} />
        <DateTimePickerTime aria-describedby={`${id}-help`} />
      </DateTimePicker>
      <FieldDescription id={`${id}-help`}>
        From 9:00 AM today to 5:00 PM on Friday.
      </FieldDescription>
    </FieldSet>
  )
}
```

### States

A required field showing the error on the half `onValueChange` names, a `disabled` one and a `readOnly` one.

```tsx
"use client"

import { useId, useState } from "react"

import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
  type DateTimePickerPart,
} from "@/components/wisty/datetime-picker"

const messages = {
  required: "Complete this field.",
  format: "Your entry does not match the allowed format.",
}

export default function DateTimePickerStates() {
  const id = useId()
  const [error, setError] = useState<
    { message: string; part?: DateTimePickerPart } | undefined
  >({ message: messages.required })

  return (
    <FieldGroup className="max-w-md">
      <FieldSet data-invalid={error !== undefined}>
        <FieldLegend variant="label" id={`${id}-start`}>
          <abbr
            title="required"
            className="me-0.5 text-destructive no-underline"
          >
            *
          </abbr>
          Start
        </FieldLegend>
        <DateTimePicker
          aria-labelledby={`${id}-start`}
          required
          today="2026-06-10"
          onValueChange={(value, details) => {
            if (details.error) {
              setError({ message: messages.format, part: details.invalid })
            } else if (!value) {
              setError({ message: messages.required, part: details.missing })
            } else {
              setError(undefined)
            }
          }}
        >
          <DateTimePickerDate
            aria-invalid={error !== undefined && error.part !== "time"}
            aria-describedby={error ? `${id}-start-error` : undefined}
          />
          <DateTimePickerTime
            aria-invalid={error !== undefined && error.part !== "date"}
            aria-describedby={error ? `${id}-start-error` : undefined}
          />
        </DateTimePicker>
        {error ? (
          <FieldError id={`${id}-start-error`}>{error.message}</FieldError>
        ) : null}
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-created`}>
          Created
        </FieldLegend>
        <DateTimePicker
          aria-labelledby={`${id}-created`}
          defaultValue="2026-06-02T14:15"
          disabled
        >
          <DateTimePickerDate />
          <DateTimePickerTime />
        </DateTimePicker>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-end`}>
          End
        </FieldLegend>
        <DateTimePicker
          aria-labelledby={`${id}-end`}
          defaultValue="2026-06-18T10:30"
          readOnly
        >
          <DateTimePickerDate />
          <DateTimePickerTime />
        </DateTimePicker>
      </FieldSet>
    </FieldGroup>
  )
}
```

### In a dialog

An event's start in a modal dialog: Escape closes the calendar or the time list first, then the dialog.

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
import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
} from "@/components/wisty/datetime-picker"

export default function DateTimePickerDialog() {
  const id = useId()

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        New event
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New event</DialogTitle>
          <DialogDescription>
            The event is added to the record&apos;s activity.
          </DialogDescription>
        </DialogHeader>
        <FieldSet>
          <FieldLegend variant="label" id={id}>
            Start
          </FieldLegend>
          <DateTimePicker aria-labelledby={id} today="2026-06-10">
            <DateTimePickerDate />
            <DateTimePickerTime />
          </DateTimePicker>
        </FieldSet>
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
