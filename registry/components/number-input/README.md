# Number input

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/number-input](https://ui.wisty.ai/number-input) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Enters a quantity, an amount or a percent in the locale's number format. Leave out the minus and plus buttons for a number nobody steps.

```bash
npx shadcn@latest add @wisty/number-input
```

## Examples

- `default` (Quantity): A product's quantity, typed or stepped by one with the buttons or the arrow keys, never below its `min` of 1.
- `bounds` (Min and max): A probability from 0 to 100 in steps of 5, set with `min`, `max` and `step`, with the increment button disabled at 100.
- `currency` (Amount): An amount with no buttons and a $ addon, in two decimals with `fractionDigits`, grouped when the field is left and plain while it's focused.
- `percent` (Percent): A discount held as the fraction 0.15 and shown as 15 before a % addon, converted with `toPercentage` and `toFraction`.
- `locale` (Locale): A weight in German, set with `locale`: the field shows and reads 1.234,5, and a form gets 1234.5.
- `states` (States): A required quantity showing the error `onValueChange` reports, a `disabled` discount, and a `readOnly` count with no buttons.

## When to use

- People enter a whole or decimal number and often nudge it up or down, like a quantity, a probability or a number of seats.
- People type an amount or a percent, like an Opportunity's Amount or a Discount. Leave out the buttons, and put the `$` or `%` in an `InputGroupAddon` beside the field. The field shows `125,000.00` when it's left and `125000` while it's focused, and reads shortcuts like `75k`.
- The number has bounds people shouldn't cross, like a quantity of at least 1 or a percent from 0 to 100. Pass `min` and `max`.
- The field shows and reads the locale's format, like 1.234,5 in German, and a form still gets a plain number. Pass `locale`.
- It replaces a `lightning-input` with `type="number"`, with or without a `formatter` of `currency` or `percent`.

## When not to use

- People pick a value from a range by feel, like a discount from 0 to 50%. Use Slider.
- The digits aren't a quantity, like a phone number, an account number or a postal code. Use Input.
- You're building a whole record form. Use the record form block, whose number fields read typed numbers with this `parseNumber`.
- The number is only read. Show it as text.

## Usage

```tsx
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputIncrement,
} from "@/components/wisty/number-input"
```

```text
NumberInput
├── NumberInputDecrement
├── NumberInputField
└── NumberInputIncrement
```

`NumberInput` holds the value, the typed text and the bounds; the other parts only draw. Leave out `NumberInputDecrement` and `NumberInputIncrement` for an amount or a percent: the text then starts at the field's edge, and an `InputGroupAddon` from Input group holds the sign. The arrow keys still step the value. Put it in a `Field` and give `NumberInputField` the label's `id`. `onValueChange` gets the number, or `null` with the reason when the text isn't a number the field accepts. `details.source` says whether it was typed or stepped:

```tsx
"use client"

import { useState } from "react"

import { type NumberInputError } from "@/components/wisty/number-input"
```

```tsx
export function Quantity() {
  const [quantity, setQuantity] = useState<number | null>(1)
  const [error, setError] = useState<NumberInputError>()

  return (
    <NumberInput
      name="Quantity"
      min={1}
      value={quantity}
      onValueChange={(value, details) => {
        setQuantity(value)
        setError(details.error)
      }}
    >
      <NumberInputDecrement />
      <NumberInputField aria-label="Quantity" />
      <NumberInputIncrement />
    </NumberInput>
  )
}
```

`error` is `"format"` for text that isn't a number, and `"min"` or `"max"` for a number outside the bounds. In a form, `name` submits the number as plain digits with a `.` decimal, like `"1234.5"`, whatever the locale.

The field reads numbers in the locale's separators and digits: `1,234.5` in en-US, `1.234,5` in de-DE, `−1 234,5` in sv-SE, `١٬٢٣٤٫٥` in ar-EG, with either minus sign. Text that isn't a number is a `"format"` error, like `12abc`, or `1.5` in de-DE, where `.` groups thousands and a group of one digit is a typo. The field also reads `lightning-input`'s shortcuts, `k`, `m`, `b` and `t` for thousands, millions, billions and trillions (`1.5k` is 1500), and exponents (`2e2` is 200). `parseNumber(text, locale)` is exported for the same reading elsewhere: `null` for empty text, `undefined` for text that isn't a number. It reads shortcuts and exponents only with `{ shortcuts: true }` as its third argument.

A percent is a fraction in a record, 0.6 for 60%, as Output field shows it, and the field shows the percentage. Convert at the field with `toPercentage` and `toFraction`, which keep 0.07 at 7, not 7.000000000000001, as the Percent example does.

## Rules

- Keep the value a number or `null`. An empty field is `null`, never 0.
- Keep a percent a fraction in your state, and give `min`, `max` and `step` as percentages. Put the `%` in an addon after the field, or "(%)" in the label of a counter.
- A typed number outside `min` and `max` isn't clamped: the value is `null` with a `"min"` or `"max"` error, and the field keeps the number so people can fix it. The buttons and keys never step past a bound.
- A typed number off the step grid is kept as typed, like 7 with a `step` of 5. The next step lands on the grid, at 10 or 5.
- With `fractionDigits`, a typed number rounds to those digits, so the value is what the field shows.
- Focused, the field shows the number without grouping, `125000` for `125,000.00`, so people edit digits, not separators. Text with an error stays as typed.
- Disabled, the number input submits nothing with a form, as a disabled input doesn't.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `NumberInput` | [InputGroup](https://ui.wisty.ai/input-group#api-InputGroup) |
| `NumberInputField` | [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) |
| `NumberInputDecrement` | [InputGroupButton](https://ui.wisty.ai/input-group#api-InputGroupButton) |
| `NumberInputIncrement` | [InputGroupButton](https://ui.wisty.ai/input-group#api-InputGroupButton) |

### NumberInput

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value`? | `number \| null` |  | The number, or null when the field is empty or its text isn't one it accepts. |
| `defaultValue`? | `number \| null` | `null` | The number at first, when uncontrolled. |
| `onValueChange`? | `( value: number \| null, details: NumberInputChangeDetails ) => void` |  | Called with the new number, or null and the reason the text isn't one. |
| `min`? | `number` |  | The smallest number people can step to or type. |
| `max`? | `number` |  | The largest number people can step to or type. |
| `step`? | `number` | `1` | A step's size. Steps land on multiples of it, counted from `min` or 0. |
| `locale`? | `string` | `"en-US"` | Formats and reads numbers. |
| `fractionDigits`? | `number` |  | Digits after the decimal point: typed numbers round to them, and the field shows them. |
| `name`? | `string` |  | Submits the value as a plain number ("1234.5") with a form, from a hidden input. |
| `required`? | `boolean` | `false` | Required with a form. |
| `disabled`? | `boolean` | `false` | Disables the field and its buttons. |
| `readOnly`? | `boolean` | `false` | Shows the number without the buttons; it can't be changed. |

### parseNumber

Reads a typed number in the locale's separators and digits: "1.234,5" in de-DE is 1234.5. Null for empty text, undefined for text that isn't a number, like "1.5" in de-DE, where a group of one digit is a typo.

| Parameter | Type | Default |
| --- | --- | --- |
| `text` | `string` |  |
| `locale`? | `string` | `"en-US"` |
| `__2`? | `{ /** When true, also reads the shortcuts 1.5k, 2m, 3b and 4t, and exponents like 2e2. */ shortcuts?: boolean }` | `{}` |

Returns `number | null | undefined`.

### toPercentage

A percent as the field shows it, from the fraction a record holds: 0.07 is 7, not the 7.000000000000001 that multiplying gives.

| Parameter | Type | Default |
| --- | --- | --- |
| `fraction` | `number` |  |

Returns `number`.

### toFraction

A typed percentage as the fraction a record holds: 7 is 0.07.

| Parameter | Type | Default |
| --- | --- | --- |
| `percentage` | `number` |  |

Returns `number`.

### NumberInputError

```ts
type NumberInputError = "format" | "min" | "max"
```

### NumberInputChangeDetails

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `"type" \| "step"` |  | Typed and committed (blur or Enter), or stepped (buttons and keys). |
| `text` | `string` |  | The field's text when the value changed. |
| `error`? | `NumberInputError` |  | Why the text isn't a number the field accepts. Unset when it is. |

## SLDS mapping

The number input is SLDS's counter. `NumberInput` is the form element's control, `NumberInputField` is `slds-input slds-input_counter` (centered text), and `NumberInputDecrement` and `NumberInputIncrement` are the small icon buttons inside it (`slds-button_icon-small` with `slds-input__button_decrement` and `slds-input__button_increment`). Without the buttons, `NumberInputField` is a plain `slds-input` with its text at the start, as `lightning-input` draws a number, and a `$` or `%` addon is SLDS's fixed text (`slds-input-has-fixed-addon`). Read-only, it's a read-only `slds-input` with no buttons, as SLDS draws it.

Known gaps:

- The buttons' icons are lucide's circled minus and plus, where SLDS draws `utility:ban` and `utility:new`.
- The `$` or `%` sits in an addon inside the field's border, where SLDS draws fixed text outside it. `lightning-input`'s `formatter` draws it in the text instead (`$123.45`), and picks the symbol and its side from the org's currency and locale. Here the page puts the symbol where the locale does: `$` before in en-US, `€` after in de-DE.
- The buttons' names ("Decrement counter", "Increment counter") are English. Numbers follow `locale`.

## Keyboard interactions

| Keys                 | Action                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| Up Arrow, Down Arrow | Step up or down by `step`, to the next multiple of it.                                                          |
| Shift+Up, Shift+Down | Step by ten steps.                                                                                              |
| Page Up, Page Down   | Step by ten steps.                                                                                              |
| Home, End            | Go to `min` or `max`, when set.                                                                                 |
| Enter                | Reads the typed text and shows it in the locale's format, or marks it invalid. Leaving the field does the same. |

The buttons aren't in the tab order: the arrow keys do what they do.

## Accessibility

- Name the field with a `FieldLabel` whose `htmlFor` is `NumberInputField`'s `id`, or pass `aria-label` to it. The buttons take their own `aria-label`; give them the field's name when a form has several number inputs, like "Increase Quantity".
- The field is a spin button: a screen reader hears its name, the number in the locale's format, and the bounds.
- A `$` or `%` addon isn't part of the field's name or value. When the unit isn't clear from the label, say it there, like "Amount (EUR)".
- For an error you decide, like an empty required field, set `aria-invalid` on `NumberInputField` and point `aria-describedby` at the message. The number input sets `aria-invalid` itself, and the input's validity, for text it can't read and numbers outside `min` and `max`.
- In Cosmos dark, text in an invalid field is about 4.3:1, below WCAG AA's 4.5:1. SLDS's own stylesheet does the same.

## Example code

### Quantity

A product's quantity, typed or stepped by one with the buttons or the arrow keys, never below its `min` of 1.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputIncrement,
} from "@/components/wisty/number-input"

export default function NumberInputDefault() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Quantity</FieldLabel>
      <NumberInput defaultValue={10} min={1}>
        <NumberInputDecrement />
        <NumberInputField id={id} />
        <NumberInputIncrement />
      </NumberInput>
    </Field>
  )
}
```

### Min and max

A probability from 0 to 100 in steps of 5, set with `min`, `max` and `step`, with the increment button disabled at 100.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputIncrement,
} from "@/components/wisty/number-input"

export default function NumberInputBounds() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Probability (%)</FieldLabel>
      <NumberInput defaultValue={100} min={0} max={100} step={5}>
        <NumberInputDecrement />
        <NumberInputField id={id} />
        <NumberInputIncrement />
      </NumberInput>
    </Field>
  )
}
```

### Amount

An amount with no buttons and a $ addon, in two decimals with `fractionDigits`, grouped when the field is left and plain while it's focused.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import { NumberInput, NumberInputField } from "@/components/wisty/number-input"

export default function NumberInputCurrency() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Amount</FieldLabel>
      <NumberInput
        defaultValue={125000}
        min={0}
        fractionDigits={2}
        locale="en-US"
      >
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <NumberInputField id={id} />
      </NumberInput>
    </Field>
  )
}
```

### Percent

A discount held as the fraction 0.15 and shown as 15 before a % addon, converted with `toPercentage` and `toFraction`.

```tsx
"use client"

import { useId, useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group"
import {
  NumberInput,
  NumberInputField,
  toFraction,
  toPercentage,
} from "@/components/wisty/number-input"

export default function NumberInputPercent() {
  const id = useId()
  const [discount, setDiscount] = useState<number | null>(0.15)

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Discount</FieldLabel>
      <NumberInput
        min={0}
        max={100}
        locale="en-US"
        value={discount === null ? null : toPercentage(discount)}
        onValueChange={(value) =>
          setDiscount(value === null ? null : toFraction(value))
        }
      >
        <NumberInputField id={id} />
        <InputGroupAddon align="inline-end">
          <InputGroupText>%</InputGroupText>
        </InputGroupAddon>
      </NumberInput>
    </Field>
  )
}
```

### Locale

A weight in German, set with `locale`: the field shows and reads 1.234,5, and a form gets 1234.5.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputIncrement,
} from "@/components/wisty/number-input"

export default function NumberInputLocale() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Gewicht (kg)</FieldLabel>
      <NumberInput defaultValue={1234.5} min={0} step={0.5} locale="de-DE">
        <NumberInputDecrement />
        <NumberInputField id={id} />
        <NumberInputIncrement />
      </NumberInput>
    </Field>
  )
}
```

### States

A required quantity showing the error `onValueChange` reports, a `disabled` discount, and a `readOnly` count with no buttons.

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
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputIncrement,
  type NumberInputError,
} from "@/components/wisty/number-input"

const messages: Record<NumberInputError | "required", string> = {
  required: "Complete this field.",
  format: "Enter a valid value.",
  min: "Value must be greater than or equal to 1.",
  max: "Value must be less than or equal to 999.",
}

export default function NumberInputStates() {
  const id = useId()
  const [error, setError] = useState<keyof typeof messages | undefined>(
    "required"
  )

  return (
    <FieldGroup className="max-w-xs">
      <Field data-invalid={error !== undefined}>
        <FieldLabel htmlFor={`${id}-quantity`}>
          <span>
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
            Quantity
          </span>
        </FieldLabel>
        <NumberInput
          required
          min={1}
          max={999}
          onValueChange={(value, details) =>
            setError(details.error ?? (value === null ? "required" : undefined))
          }
        >
          <NumberInputDecrement />
          <NumberInputField
            id={`${id}-quantity`}
            aria-invalid={error !== undefined}
            aria-describedby={error ? `${id}-quantity-error` : undefined}
          />
          <NumberInputIncrement />
        </NumberInput>
        {error ? (
          <FieldError id={`${id}-quantity-error`}>{messages[error]}</FieldError>
        ) : null}
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-discount`}>Discount (%)</FieldLabel>
        <NumberInput defaultValue={15} min={0} max={100} disabled>
          <NumberInputDecrement />
          <NumberInputField id={`${id}-discount`} />
          <NumberInputIncrement />
        </NumberInput>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-seats`}>Seats</FieldLabel>
        <NumberInput defaultValue={250} readOnly>
          <NumberInputDecrement />
          <NumberInputField id={`${id}-seats`} />
          <NumberInputIncrement />
        </NumberInput>
      </Field>
    </FieldGroup>
  )
}
```
