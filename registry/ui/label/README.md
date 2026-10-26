# Label

This page shows the Radix version. Base UI projects get [registry/base/ui/label.tsx](../../base/ui/label.tsx), and [ui.wisty.ai/label](https://ui.wisty.ai/label) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Names a form control.

```bash
npx shadcn@latest add @wisty/label
```

## Examples

- `default` (Account fields): Account name above its input, linked by `htmlFor`, and Phone with a red asterisk and `required` on its input.
- `with-control` (Beside a checkbox or switch): Labels placed after a `Checkbox` and a `Switch` take the regular weight and, beside the switch, a lighter color.

## When to use

- A form control needs a visible name: an input, a select, a textarea.
- You lay out a control and its label yourself, outside a Field, like a checkbox with its label beside it.

## When not to use

- The field has help text or an error. Use `FieldLabel` inside a Field, which spaces them.
- A group of controls needs one name, like a set of checkboxes. Use `FieldSet` with a `FieldLegend`.
- The text names a section, not a control. Use a heading.

## Usage

```tsx
import { Label } from "@/components/ui/label"
```

```tsx
<Label htmlFor="account-name">Account name</Label>
```

A Label placed after a checkbox, radio or switch, as its sibling, takes the regular weight those labels have, as the Beside a checkbox or switch example shows.

## Rules

- Label is a flex row with a gap, so put the asterisk and the text in one `span`, as the Account fields example does. As separate children they sit apart.
- Don't restyle the label's size, weight or color. They come from the theme, and change beside a checkbox, radio or switch.

## API reference

### Label

Also takes every [Radix Label.Root](https://www.radix-ui.com/primitives/docs/components/label#root) prop.

## SLDS mapping

Label is `slds-form-element__label`. After a checkbox or radio it's SLDS's checkbox label, and after a switch SLDS's toggle label. A required asterisk is `slds-required`. Like SLDS, it doesn't dim beside a disabled control.

Known gaps:

- SLDS's label has padding above it inside a form element. Label doesn't, so it lines up anywhere; `FieldLabel` adds it.

## Accessibility

- Set `htmlFor` to the control's `id`, or wrap the control in the label. Otherwise the label names nothing.
- The asterisk alone doesn't tell assistive tech a field is required. Set `required` on the control too, as the Account fields example does.

## Example code

### Account fields

Account name above its input, linked by `htmlFor`, and Phone with a red asterisk and `required` on its input.

```tsx
import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LabelDefault() {
  const id = useId()

  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1">
        <Label htmlFor={`${id}-name`}>Account name</Label>
        <Input id={`${id}-name`} placeholder="Acme Corporation" />
      </div>
      <div className="grid gap-1">
        <Label htmlFor={`${id}-phone`}>
          <span>
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
            Phone
          </span>
        </Label>
        <Input id={`${id}-phone`} type="tel" required />
      </div>
    </div>
  )
}
```

### Beside a checkbox or switch

Labels placed after a `Checkbox` and a `Switch` take the regular weight and, beside the switch, a lighter color.

```tsx
import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function LabelWithControl() {
  const id = useId()

  return (
    <div className="grid w-full max-w-sm gap-2">
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-opt-out`} defaultChecked />
        <Label htmlFor={`${id}-opt-out`}>Email Opt Out</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id={`${id}-active`} defaultChecked />
        <Label htmlFor={`${id}-active`}>Active</Label>
      </div>
    </div>
  )
}
```
