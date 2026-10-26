# Textarea

This page shows the Radix version. Base UI projects get [registry/base/ui/textarea.tsx](../../base/ui/textarea.tsx), and [ui.wisty.ai/textarea](https://ui.wisty.ai/textarea) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Takes text over several lines, like a description or a comment.

```bash
npx shadcn@latest add @wisty/textarea
```

## Examples

- `default` (Case description): A labelled description field that grows as you type.
- `states` (States): An escalation reason with its error from `aria-invalid`, `disabled` internal notes and a `readOnly` resolution.

## When to use

- People type text that may run over several lines, like a case description, a comment or notes.
- The text has no fixed format.

## When not to use

- The value fits on one line, like a name or an email address. Use Input.
- People pick from known values. Use Select or Combobox.
- The field needs a count or a send button inside its frame. Use Input group with `InputGroupTextarea`.

## Usage

Label it with a `FieldLabel` inside a Field, or a Label linked through `htmlFor`.

```tsx
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
```

```tsx
<div className="grid gap-1">
  <Label htmlFor="comments">Internal comments</Label>
  <Textarea id="comments" name="comments" />
</div>
```

It starts two lines tall and grows with its text. For a taller start, use a `min-h-*` class, not `rows`: browsers that grow the field ignore `rows`.

## Rules

- Show errors with `aria-invalid`. Don't add border or color classes.

## API reference

### Textarea

Also takes every [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea) prop.

## SLDS mapping

`Textarea` is `slds-textarea`, with the input's frame and colors.

Known gaps:

- SLDS's textarea stays at its `rows` height. This one grows with its text. For a fixed height, add `field-sizing-fixed` and set `rows`.

## Accessibility

- Name it with a visible label. A placeholder isn't a label.
- Point `aria-describedby` at help text or an error message, and say in the error how to fix the value.
- Use `readOnly`, not `disabled`, for text people should read or copy. A disabled textarea leaves the tab order and doesn't submit.

## Responsive behavior

- It fills its container's width and grows with its text, which pushes the layout below it down. Set a `max-h-*` class to cap it; past that it scrolls.
- Browsers without `field-sizing` keep it two lines tall, scrolling. People can still drag it taller.
- On touch screens the text is larger, so iOS Safari doesn't zoom in on focus. Don't set a smaller text size on it.

## Example code

### Case description

A labelled description field that grows as you type.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaDefault() {
  const id = useId()

  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor={`${id}-description`}>Description</FieldLabel>
      <Textarea id={`${id}-description`} placeholder="Describe the issue" />
    </Field>
  )
}
```

### States

An escalation reason with its error from `aria-invalid`, `disabled` internal notes and a `readOnly` resolution.

```tsx
import { useId } from "react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaStates() {
  const id = useId()

  return (
    <FieldGroup className="max-w-sm">
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-reason`}>Reason for escalation</FieldLabel>
        <Textarea
          id={`${id}-reason`}
          aria-invalid="true"
          aria-describedby={`${id}-reason-error`}
        />
        <FieldError id={`${id}-reason-error`}>
          Enter a reason for the escalation.
        </FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-notes`}>Internal notes</FieldLabel>
        <Textarea
          id={`${id}-notes`}
          defaultValue="Waiting on the customer's reply."
          disabled
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-resolution`}>Resolution</FieldLabel>
        <Textarea
          id={`${id}-resolution`}
          defaultValue="Replaced the faulty router and confirmed the connection."
          readOnly
        />
      </Field>
    </FieldGroup>
  )
}
```
