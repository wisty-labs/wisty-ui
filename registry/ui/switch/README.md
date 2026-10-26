# Switch

This page shows the Radix version. Base UI projects get [registry/base/ui/switch.tsx](../../base/ui/switch.tsx), and [ui.wisty.ai/switch](https://ui.wisty.ai/switch) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Turns a setting on or off at once.

```bash
npx shadcn@latest add @wisty/switch
```

## Examples

- `default` (Case notifications): Two settings that apply at once, one off and one on, under a legend.
- `states` (States): Every state SLDS draws: off, on, disabled, and disabled and on.
- `sizes` (Sizes): The default size and the small one, set with `size="sm"`, both on.

## When to use

- For a setting that turns on or off and takes effect at once, like "Email me when a case I own closes".
- For a row in a settings list that enables a feature.
- In place of Lightning's checkbox toggle.

## When not to use

- The choice applies only when people save the form. Use Checkbox.
- People pick one of several options. Use Radio Group or Select.
- A toolbar button stays pressed, like Bold. Use Toggle.

## Usage

Give every `Switch` a label: a `Label` with `htmlFor` set to the switch's `id`, or a `Field` with `orientation="horizontal"`, as the Case notifications example shows. The change applies at once, so save from `onCheckedChange`.

```tsx
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
```

```tsx
<div className="flex items-center gap-2">
  <Switch id="out-of-office" />
  <Label htmlFor="out-of-office">Out of office</Label>
</div>
```

## Rules

- Use it only for a change that applies at once. A switch in a form people save reads as "already done" and misleads.
- Never override the track's colors or size with utility classes. The tokens carry each theme; `size="sm"` is the only size change.

## API reference

### Switch

| Prop | Type | Default |
| --- | --- | --- |
| `size`? | `"sm" \| "default"` | `"default"` |

Also takes every [Radix Switch.Root](https://www.radix-ui.com/primitives/docs/components/switch#root) prop.

## SLDS mapping

`Switch` is the faux track of `slds-checkbox_toggle` (`slds-checkbox_faux`). The track draws the thumb and SLDS's check mark itself, and a `Label` beside it is the toggle's label.

Known gaps:

- SLDS shows "Enabled" or "Disabled" under its toggle. Switch has no part for that text; add it beside the label when you need it.

## Accessibility

- Name every switch with a visible label. The thumb and check mark are decoration; the state is in `aria-checked`.
- A disabled switch can't take focus. Say why the setting is unavailable in nearby text.

## Motion

- The track color fades over 0.2s. The thumb doesn't slide, so it jumps to the other end.
- The fade runs with reduced motion too.

## Responsive behavior

- The track keeps its width in a flex row, so a long label wraps beside it instead of squeezing it.

## Example code

### Case notifications

Two settings that apply at once, one off and one on, under a legend.

```tsx
import { useId } from "react"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export default function SwitchDefault() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend variant="label">Email me when</FieldLegend>
      <FieldGroup>
        <Field orientation="horizontal">
          <Switch id={`${id}-closed`} />
          <FieldLabel htmlFor={`${id}-closed`}>A case I own closes</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch id={`${id}-comment`} defaultChecked />
          <FieldLabel htmlFor={`${id}-comment`}>
            A customer comments on my case
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
```

### States

Every state SLDS draws: off, on, disabled, and disabled and on.

```tsx
import { useId } from "react"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

const states: Array<{ label: string; checked: boolean; disabled?: boolean }> = [
  { label: "Off", checked: false },
  { label: "On", checked: true },
  { label: "Disabled", checked: false, disabled: true },
  { label: "Disabled and on", checked: true, disabled: true },
]

export default function SwitchStates() {
  const id = useId()

  return (
    <FieldGroup className="w-full max-w-sm">
      {states.map((state, index) => (
        <Field key={state.label} orientation="horizontal">
          <Switch
            id={`${id}-${index}`}
            defaultChecked={state.checked}
            disabled={state.disabled}
          />
          <FieldLabel htmlFor={`${id}-${index}`}>{state.label}</FieldLabel>
        </Field>
      ))}
    </FieldGroup>
  )
}
```

### Sizes

The default size and the small one, set with `size="sm"`, both on.

```tsx
import { useId } from "react"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export default function SwitchSizes() {
  const id = useId()

  return (
    <FieldGroup className="w-full max-w-sm">
      <Field orientation="horizontal">
        <Switch id={`${id}-default`} defaultChecked />
        <FieldLabel htmlFor={`${id}-default`}>Default</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id={`${id}-sm`} size="sm" defaultChecked />
        <FieldLabel htmlFor={`${id}-sm`}>Small</FieldLabel>
      </Field>
    </FieldGroup>
  )
}
```
