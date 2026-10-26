# Input group

This page shows the Radix version. Base UI projects get [registry/base/ui/input-group.tsx](../../base/ui/input-group.tsx), and [ui.wisty.ai/input-group](https://ui.wisty.ai/input-group) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Puts icons, text or buttons inside an input or textarea.

```bash
npx shadcn@latest add @wisty/input-group
```

## Examples

- `default` (Website): A labelled URL field with a globe icon at the start, and an `InputGroupButton` that opens the site in an addon with `align="inline-end"`.
- `text` (Text): Fixed text in an `InputGroupText` before and after the input.
- `button` (Buttons): A copy `InputGroupButton` with `size="icon-xs"` on a read-only link, and a text Apply button inside a promo code field.
- `textarea` (Textarea): A count and a send button below an `InputGroupTextarea`, in an addon with `align="block-end"`.
- `states` (States): One field with `aria-invalid` and an error, and one `disabled`, both set on `InputGroupInput`.

## When to use

- An input needs an icon inside it, like a search field with a magnifying glass.
- An input needs fixed text before or after the value, like `https://` or `USD`.
- An input needs a button inside it, like clear, copy or show password.
- A textarea needs a row of actions below the text, like a count and a send button.

## When not to use

- A plain field with no icon, text or button. Use Input or Textarea.
- People pick from suggestions as they type. Use Combobox, or Lookup for records.
- Several separate controls sit side by side. Use Button group or a flex row.

## Usage

```text
InputGroup
├── InputGroupInput
└── InputGroupAddon
    ├── InputGroupText
    └── InputGroupButton
```

`InputGroup` is the field. Put an `InputGroupInput` or `InputGroupTextarea` in it, then the addons. An addon's `align` sets where it shows, before or after the control or on a row above or below it, whatever its place in the markup.

```tsx
import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
```

```tsx
<InputGroup>
  <InputGroupInput type="search" aria-label="Search accounts" />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

Clicking an addon outside a button focuses an `InputGroupInput`, but not a textarea. A click on a button keeps focus there, so a button that hides itself, like Clear shown only while there's text, should move focus back to the input first.

## Rules

- Use `InputGroupInput` and `InputGroupTextarea` inside a group, never `Input` or `Textarea`. The group reads its state from them.
- Put icons straight into `InputGroupAddon` and actions into `InputGroupButton`. Wrap text in an `InputGroupText` inside the addon: bare text takes the icon color.
- Set `aria-invalid` and `disabled` on the control, not on the group.

## API reference

| Part | Built on |
| --- | --- |
| `InputGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `InputGroupAddon` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `InputGroupButton` | [Button](https://ui.wisty.ai/button#api-Button) |
| `InputGroupText` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `InputGroupInput` | [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) |
| `InputGroupTextarea` | [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea) |

### InputGroupAddon

| Prop | Type | Default |
| --- | --- | --- |
| `align`? | `"inline-start" \| "inline-end" \| "block-start" \| "block-end"` | `"inline-start"` |

### InputGroupButton

| Prop | Type | Default |
| --- | --- | --- |
| `size`? | `"xs" \| "sm" \| "icon-xs" \| "icon-sm"` | `"xs"` |
| `type`? | `"button" \| "submit" \| "reset"` | `"button"` |
| `variant`? | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link" \| "outline-brand" \| "destructive-text" \| "success" \| "inverse"` | `"ghost"` |

## SLDS mapping

`InputGroup` is an SLDS input with icons, `slds-input-has-icon`, with its frame and states read from the control inside. Addon icons are `slds-input__icon`, and `InputGroupText` is SLDS's fixed text, `slds-form-element__addon`.

Known gaps:

- SLDS puts fixed text outside the field, beside it. Here it sits inside.
- SLDS has no rows above or below a control. Block addons follow SLDS's spacing, not a blueprint.

## Accessibility

- Name the control with a visible label. Fixed text isn't part of its name, so repeat `https://` or `USD` in the label or help text when people need it.
- Give an icon button an `aria-label`, like "Clear".
- Tab follows the markup, not `align`. A button in an `inline-start` or `block-start` addon placed after the control shows first but takes focus after it, so put that addon before the control.
- `InputGroupButton` doesn't submit a form. Set `type="submit"` on the one that should.
- In Cosmos dark, text in an invalid field is about 4.3:1 against its background, below AA. Salesforce's own stylesheet fails the same way.

## Responsive behavior

- The control takes the room left after the addons, so long fixed text squeezes the value. Set the width on the parent.

## Example code

### Website

A labelled URL field with a globe icon at the start, and an `InputGroupButton` that opens the site in an addon with `align="inline-end"`.

```tsx
import { useId } from "react"
import { ExternalLinkIcon, GlobeIcon } from "lucide-react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupDefault() {
  const id = useId()

  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor={`${id}-website`}>Website</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={`${id}-website`}
          type="url"
          defaultValue="https://acme.example"
        />
        <InputGroupAddon>
          <GlobeIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Open website">
            <ExternalLinkIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
```

### Text

Fixed text in an `InputGroupText` before and after the input.

```tsx
import { useId } from "react"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export default function InputGroupTextExample() {
  const id = useId()

  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor={`${id}-website`}>Website</FieldLabel>
        <InputGroup>
          <InputGroupInput id={`${id}-website`} placeholder="acme" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-amount`}>Amount</FieldLabel>
        <InputGroup>
          <InputGroupInput id={`${id}-amount`} defaultValue="1,250.00" />
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}
```

### Buttons

A copy `InputGroupButton` with `size="icon-xs"` on a read-only link, and a text Apply button inside a promo code field.

```tsx
import { useId } from "react"
import { CopyIcon } from "lucide-react"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupButtonExample() {
  const id = useId()

  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor={`${id}-link`}>Invite link</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={`${id}-link`}
            defaultValue="https://acme.example/invite/7f3a"
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy link">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-promo`}>Promo code</FieldLabel>
        <InputGroup>
          <InputGroupInput id={`${id}-promo`} defaultValue="SPRING26" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Apply</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}
```

### Textarea

A count and a send button below an `InputGroupTextarea`, in an addon with `align="block-end"`.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export default function InputGroupTextareaExample() {
  const id = useId()

  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor={`${id}-reply`}>Reply</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id={`${id}-reply`}
          placeholder="Write a reply to the customer"
        />
        <InputGroupAddon align="block-end">
          <InputGroupText>0 of 280</InputGroupText>
          <InputGroupButton variant="default" size="sm" className="ms-auto">
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
```

### States

One field with `aria-invalid` and an error, and one `disabled`, both set on `InputGroupInput`.

```tsx
import { useId } from "react"
import { MailIcon } from "lucide-react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupStates() {
  const id = useId()

  return (
    <FieldGroup className="max-w-sm">
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={`${id}-email`}
            type="email"
            defaultValue="ada@acme"
            aria-invalid="true"
            aria-describedby={`${id}-email-error`}
          />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldError id={`${id}-email-error`}>
          Enter a valid email address.
        </FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-owner`}>Owner email</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={`${id}-owner`}
            defaultValue="ada@acme.example"
            disabled
          />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}
```
