# Time picker

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/time-picker](https://ui.wisty.ai/time-picker) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks a time of day, typed in the field or chosen from a list of times. Holds a time with no date, like a Time field.

```bash
npx shadcn@latest add @wisty/time-picker
```

## Examples

- `default` (Start time): An event's start time typed in the field or picked from the times every 15 minutes under it.
- `step-and-bounds` (Step and bounds): Business hours only: the list runs from `min` to `max` every 30 minutes with `step`, and a typed time outside them is an error.
- `seconds` (Seconds): A time with seconds, shown, typed and reported as "HH:MM:SS" with `timeStyle="medium"`.
- `locale` (Locale): German on the 24-hour clock, from `locale`: the field and the list show 14:30, and typing reads it.
- `states` (States): A required field showing the error `onValueChange` reports, a `disabled` one and a `readOnly` one holding a time.
- `dialog` (In a dialog): A call time in a modal dialog: the list opens over it, and Escape closes the list first, then the dialog.

## When to use

- People enter a time of day in a form, like an event's start time or a preferred call time.
- People type the time or pick it from a list of times under the field, every 15 minutes by default. The field shows it in the locale's style, "9:30 PM" in en-US and "21:30" in de-DE.
- The value is a time with no date and no time zone, like a Salesforce Time field. The time picker holds it as `"HH:MM"`, or `"HH:MM:SS"` with seconds.
- Only some times are allowed, like business hours. Pass `min` and `max`.
- It replaces `lightning-input` with `type="time"`.

## When not to use

- The value is a date and a time, like a Salesforce Date/Time field. Use Datetime picker.
- The value is a day. Use Date picker.
- People only type the time and don't need a list. Use Input with `type="time"`, which also gives phones their own time wheel.
- The time is a duration, like a call's length in minutes. Use Number input.
- The time is only read. Show it as text.

## Usage

```tsx
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"
```

```text
TimePicker
├── TimePickerInput
└── TimePickerContent
    └── TimePickerList
        └── TimePickerItem
```

`TimePicker` holds the value, the typed text and the list's state; the other parts only draw. `TimePickerList` renders a `TimePickerItem` for each time on its own, so most fields stop at the list. `onValueChange` gets the time, or `null` with the reason when the text isn't a time the field accepts:

```tsx
"use client"

import { useState } from "react"

import { type TimePickerError } from "@/components/wisty/time-picker"
```

```tsx
export function StartTime() {
  const [startTime, setStartTime] = useState<string | null>(null)
  const [error, setError] = useState<TimePickerError>()

  return (
    <TimePicker
      name="StartTime"
      value={startTime}
      onValueChange={(value, details) => {
        setStartTime(value)
        setError(details.error)
      }}
    >
      <TimePickerInput aria-label="Start time" />
      <TimePickerContent>
        <TimePickerList />
      </TimePickerContent>
    </TimePicker>
  )
}
```

`error` is `"format"` for text it can't read, and `"min"` or `"max"` for a time outside the bounds. In a form, `name` submits the time as `"HH:MM"`, 24-hour. The field reads the locale's style, 24-hour times ("21:30"), AM or PM in a word or a letter ("9:30p", "9pm"), an hour alone ("9") and digits with no separator ("930", "2130"). To accept other text, like "noon", pass your own `parse`.

## Rules

- Keep the value a `"HH:MM"` or `"HH:MM:SS"` string, 24-hour and zero-padded. A `Date` carries a day and a time zone that a time of day doesn't have.
- A `value` that isn't a time, like `"9:00"`, shows as it is with a `"format"` error. One outside `min` and `max` shows with its error. Neither is moved into range, submitted with a form, or reported through `onValueChange`.
- Changing `locale` or `timeStyle` shows the value again in the new style. Text typed and not yet read is replaced.
- Disabled, the time picker submits nothing with a form, as a disabled input doesn't.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `TimePicker` |  |
| `TimePickerInput` | [ComboboxInput](https://ui.wisty.ai/combobox#api-ComboboxInput) |
| `TimePickerContent` | [ComboboxContent](https://ui.wisty.ai/combobox#api-ComboboxContent) |
| `TimePickerList` | [ComboboxList](https://ui.wisty.ai/combobox#api-ComboboxList) |
| `TimePickerItem` | [ComboboxItem](https://ui.wisty.ai/combobox#api-ComboboxItem) |

### TimePicker

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value`? | `string \| null` |  | The time of day as 24-hour "HH:MM", or null when the field is empty or its text isn't a time. |
| `defaultValue`? | `string \| null` | `null` | The time at first, when uncontrolled. |
| `onValueChange`? | `( value: string \| null, details: TimePickerChangeDetails ) => void` |  | Called with the new time, or null and the reason the text isn't one. |
| `min`? | `string` |  | The earliest time people can pick or type, as "HH:MM" or "HH:MM:SS"; the list starts here. |
| `max`? | `string` |  | The latest time people can pick or type, as "HH:MM" or "HH:MM:SS". |
| `step`? | `number` | `15` | Minutes between the times in the list. Typed times aren't rounded to it. |
| `locale`? | `string` | `"en-US"` | Formats and reads times, and sets the 12- or 24-hour clock. |
| `timeStyle`? | `TimePickerStyle` | `"short"` | "medium" shows seconds, and takes and reports "HH:MM:SS". |
| `parse`? | `TimePickerParse` | `parseTime` | Reads typed text into "HH:MM" or "HH:MM:SS", or null when it isn't a time. |
| `name`? | `string` |  | Submits the value with a form, from a hidden input. |
| `required`? | `boolean` | `false` | Required with a form. |
| `disabled`? | `boolean` | `false` | Disables the field and its list. |
| `readOnly`? | `boolean` | `false` | Shows the time without the list; it can't be changed. |
| `children`? | `React.ReactNode` |  | The input and the list. |

### TimePickerItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | The time, as "HH:MM" or "HH:MM:SS". |

### parseTime

Reads a typed time, in the locale's style or not: "9:30p" and "2130" are "21:30", "9" is "09:00". Returns "HH:MM:SS" with `seconds`, and null when the text isn't a time.

| Parameter | Type | Default |
| --- | --- | --- |
| `text` | `string` |  |
| `__1` | `{ locale: string; seconds: boolean }` |  |

Returns `string | null`.

### TimePickerError

```ts
type TimePickerError = "format" | "min" | "max"
```

### TimePickerChangeDetails

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` |  | The field's text when the value changed. |
| `error`? | `TimePickerError` |  | Why the text isn't a time the field accepts. Unset when it is. |

### TimePickerParse

```ts
type TimePickerParse = (
  text: string,
  options: { locale: string; seconds: boolean }
) => string | null
```

### TimePickerStyle

```ts
type TimePickerStyle = "short" | "medium"
```

## SLDS mapping

The time picker is SLDS's timepicker as `lightning-input` draws it: the autocomplete combobox with `slds-timepicker` on the form element. `TimePickerInput` is `slds-combobox__input` with the decorative clock icon on the right (`slds-input__icon_right`, `utility:clock`). `TimePickerContent` is the fluid dropdown under the field (`slds-dropdown slds-dropdown_fluid`), `TimePickerList` its `slds-listbox`, and `TimePickerItem` a plain option (`slds-listbox__option_plain`) with the check on the selected time (`slds-is-selected`).

Known gaps:

- SLDS swaps in the phone's own time input on mobile. The time picker keeps its field and list.
- The clock icon is lucide's, where SLDS draws `utility:clock`.
- The field's error text ("Enter a valid time.", "Value must be … or later.") is English. Times, AM and PM follow `locale`.

## Keyboard interactions

| Keys                 | Action                                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Typing               | Narrows the list to the times that start with the text, and opens it when one does.                                                       |
| Down Arrow, Up Arrow | Open the list on the picked time, or the first, and move through the times.                                                               |
| Enter                | Picks the highlighted time. With none highlighted, reads the typed text, or with nothing typed, opens or closes the list.                 |
| Escape               | Closes the list and keeps the field's text. Inside a modal dialog, the first Escape closes only the list, and the next closes the dialog. |
| Tab                  | Reads the typed text and moves on. Leaving the field does the same.                                                                       |

A click in the field opens the list on the picked time, and focus stays in the field to type.

## Accessibility

- Name the field with a `FieldLabel` whose `htmlFor` is `TimePickerInput`'s `id`, or pass `aria-label` to it.
- For an error you decide, like an empty required field, set `aria-invalid` on `TimePickerInput` and point `aria-describedby` at the message. The time picker sets `aria-invalid` itself, and the input's validity, for text it can't read and times outside `min` and `max`.
- While the list is open, the rest of the page is hidden from screen readers, the field's label included. The input keeps its name.
- In Cosmos dark the error text is about 4.3:1, below WCAG AA's 4.5:1. SLDS's own stylesheet does the same.

## Performance

- The list renders every time in it: 96 at the default 15 minutes. A `step` of a minute makes 1,440; keep it at 5 or more, or narrow it with `min` and `max`.

## Example code

### Start time

An event's start time typed in the field or picked from the times every 15 minutes under it.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"

export default function TimePickerDefault() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Start Time</FieldLabel>
      <TimePicker defaultValue="09:00">
        <TimePickerInput id={id} placeholder="Select a time..." />
        <TimePickerContent>
          <TimePickerList />
        </TimePickerContent>
      </TimePicker>
    </Field>
  )
}
```

### Step and bounds

Business hours only: the list runs from `min` to `max` every 30 minutes with `step`, and a typed time outside them is an error.

```tsx
import { useId } from "react"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"

export default function TimePickerStepAndBounds() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Preferred Call Time</FieldLabel>
      <TimePicker min="08:00" max="18:00" step={30}>
        <TimePickerInput
          id={id}
          placeholder="Select a time..."
          aria-describedby={`${id}-help`}
        />
        <TimePickerContent>
          <TimePickerList />
        </TimePickerContent>
      </TimePicker>
      <FieldDescription id={`${id}-help`}>
        Business hours, 8:00 AM to 6:00 PM.
      </FieldDescription>
    </Field>
  )
}
```

### Seconds

A time with seconds, shown, typed and reported as "HH:MM:SS" with `timeStyle="medium"`.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"

export default function TimePickerSeconds() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Call Started</FieldLabel>
      <TimePicker defaultValue="14:05:30" timeStyle="medium">
        <TimePickerInput id={id} placeholder="Select a time..." />
        <TimePickerContent>
          <TimePickerList />
        </TimePickerContent>
      </TimePicker>
    </Field>
  )
}
```

### Locale

German on the 24-hour clock, from `locale`: the field and the list show 14:30, and typing reads it.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"

export default function TimePickerLocale() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Start Time</FieldLabel>
      <TimePicker defaultValue="14:30" locale="de-DE">
        <TimePickerInput id={id} placeholder="Select a time..." />
        <TimePickerContent>
          <TimePickerList />
        </TimePickerContent>
      </TimePicker>
    </Field>
  )
}
```

### States

A required field showing the error `onValueChange` reports, a `disabled` one and a `readOnly` one holding a time.

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
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
  type TimePickerError,
} from "@/components/wisty/time-picker"

const messages: Record<TimePickerError | "required", string> = {
  required: "Complete this field.",
  format: "Enter a valid time.",
  min: "Value must be 8:00 AM or later.",
  max: "Value must be 6:00 PM or earlier.",
}

export default function TimePickerStates() {
  const id = useId()
  const [error, setError] = useState<keyof typeof messages | undefined>(
    "required"
  )

  return (
    <FieldGroup className="max-w-xs">
      <Field data-invalid={error !== undefined}>
        <FieldLabel htmlFor={`${id}-start`}>
          <span>
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
            Start Time
          </span>
        </FieldLabel>
        <TimePicker
          required
          min="08:00"
          max="18:00"
          onValueChange={(value, details) =>
            setError(details.error ?? (value ? undefined : "required"))
          }
        >
          <TimePickerInput
            id={`${id}-start`}
            placeholder="Select a time..."
            aria-invalid={error !== undefined}
            aria-describedby={error ? `${id}-start-error` : undefined}
          />
          <TimePickerContent>
            <TimePickerList />
          </TimePickerContent>
        </TimePicker>
        {error ? (
          <FieldError id={`${id}-start-error`}>{messages[error]}</FieldError>
        ) : null}
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-end`}>End Time</FieldLabel>
        <TimePicker defaultValue="10:30" disabled>
          <TimePickerInput id={`${id}-end`} />
        </TimePicker>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-reminder`}>Reminder Time</FieldLabel>
        <TimePicker defaultValue="08:45" readOnly>
          <TimePickerInput id={`${id}-reminder`} />
        </TimePicker>
      </Field>
    </FieldGroup>
  )
}
```

### In a dialog

A call time in a modal dialog: the list opens over it, and Escape closes the list first, then the dialog.

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
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"

export default function TimePickerDialog() {
  const id = useId()

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Log a call
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a call</DialogTitle>
          <DialogDescription>
            The call is added to the record&apos;s activity.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor={id}>Call Time</FieldLabel>
          <TimePicker>
            <TimePickerInput id={id} placeholder="Select a time..." />
            <TimePickerContent>
              <TimePickerList />
            </TimePickerContent>
          </TimePicker>
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
