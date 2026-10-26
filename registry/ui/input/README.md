# Input

This page shows the Radix version. Base UI projects get [registry/base/ui/input.tsx](../../base/ui/input.tsx), and [ui.wisty.ai/input](https://ui.wisty.ai/input) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Takes a single line of text.

```bash
npx shadcn@latest add @wisty/input
```

## Examples

- `default` (Email): A labelled email field, with `type="email"` for the email keyboard on phones and `autoComplete="email"` for autofill.
- `states` (States): An email with `aria-invalid` and its error, a `disabled` owner, and a `readOnly` account number without a frame.

## When to use

- You need one line of text from someone: a name, an email address, a phone number, an account number. It's the text field of a Lightning input.
- You want the browser's own input types (`email`, `tel`, `url`, `number`, `search`, `password`) with no extra JavaScript.

## When not to use

- The answer runs longer than a line, like a description or a comment. Use Textarea.
- People pick from a fixed set of options. Use Select or Native select, or Radio group when a few options should stay visible.
- People search for a record, such as an account owner. Use Lookup. Don't build one from an Input and a floating list.
- The choice is yes or no. Use Checkbox or Switch.
- You show a value nobody edits on that page. Use plain text. Keep `readOnly` for values that belong to a form and still submit.
- The field needs icons, text or buttons inside it. Use Input group.

## Usage

Outside a form, a search field with an `aria-label` is the smallest use:

```tsx
import { Input } from "@/components/ui/input"
```

```tsx
<Input type="search" aria-label="Search accounts" placeholder="Search" />
```

In a form, put it in a Field with a `FieldLabel`, as the Email example shows. For an error, set `aria-invalid` on the Input, `data-invalid` on the `Field` and the message in a `FieldError`, as the States example shows.

## Rules

- Native validation (`required`, `pattern`, `type="email"`) doesn't trigger the error style. Set `aria-invalid` from your own validation state, after submit or on blur. Only `true` gets the error style; don't fake it with `className`.
- Don't combine `aria-invalid` with `readOnly` or `disabled`. People can't fix those fields, and the styles collide.
- Leave height, radius, border and colors to the tokens. Use `className` for layout, like width and margins.
- Don't put icons or buttons inside the field with absolute positioning. They cover the text; Input group has room for them.

## API reference

### Input

Also takes every [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) prop.

## SLDS mapping

Input is `slds-input`. `readOnly` drops the frame and the start padding, as `.slds-input[readonly]` does, so the value lines up under its label.

Known gaps:

- SLDS wraps the field in `slds-form-element` with its label, control and help text, and puts `slds-has-error` on the wrapper. Here that's a Field, with `aria-invalid` on the input.
- Not ported: icons (`slds-input-has-icon`), fixed addons, the counter and `slds-input_bare`. Icons and addons are Input group.

## Accessibility

- Give every field a visible label linked with `htmlFor` and `id`. A placeholder isn't a label: it disappears as soon as someone types. Use `aria-label` only where there's no room for visible text, like a search field in a toolbar.
- For an error, set `aria-invalid` and point `aria-describedby` at the message. Say what to fix in that text; the red frame alone doesn't.
- Set `type` and `autoComplete` to match the data, so phones show the right keyboard and browsers can fill the field in.
- A read-only field stays in the tab order and submits with the form. A disabled field leaves the tab order and doesn't submit, so say nearby why it's off.
- In Cosmos dark, text in an invalid field is about 4.3:1 against its background, below AA. Salesforce's own stylesheet fails the same way.

## Responsive behavior

- The field fills its container and can shrink inside flex and grid rows. Set the width on the parent, as the examples' `max-w-sm` does.
- On touch screens the text is larger, so iOS Safari doesn't zoom in on focus. Don't set a smaller text size on it.

## Example code

### Email

A labelled email field, with `type="email"` for the email keyboard on phones and `autoComplete="email"` for autofill.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function InputDefault() {
  const id = useId()

  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
      <Input
        id={`${id}-email`}
        type="email"
        autoComplete="email"
        placeholder="rose.gonzalez@edgecomm.example"
      />
    </Field>
  )
}
```

### States

An email with `aria-invalid` and its error, a `disabled` owner, and a `readOnly` account number without a frame.

```tsx
import { useId } from "react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function InputStates() {
  const id = useId()

  return (
    <FieldGroup className="w-full max-w-sm">
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
        <Input
          id={`${id}-email`}
          type="email"
          defaultValue="not-an-email"
          aria-invalid="true"
          aria-describedby={`${id}-email-error`}
        />
        <FieldError id={`${id}-email-error`}>
          Enter a valid email address.
        </FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-owner`}>Owner</FieldLabel>
        <Input id={`${id}-owner`} defaultValue="Sarah Chen" disabled />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-number`}>Account number</FieldLabel>
        <Input id={`${id}-number`} defaultValue="CD-451796" readOnly />
      </Field>
    </FieldGroup>
  )
}
```
