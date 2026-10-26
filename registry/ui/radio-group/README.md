# Radio group

This page shows the Radix version. Base UI projects get [registry/base/ui/radio-group.tsx](../../base/ui/radio-group.tsx), and [ui.wisty.ai/radio-group](https://ui.wisty.ai/radio-group) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks exactly one option from a short list that stays visible.

```bash
npx shadcn@latest add @wisty/radio-group
```

## Examples

- `default` (Email notifications): Three options under a `FieldLegend` that names the group through `aria-labelledby`, the middle one checked, and arrow keys move the choice.
- `states` (States): Enabled, disabled and invalid groups of two, each with one checked, set with `disabled` and `aria-invalid` on `RadioGroupItem`.

## When to use

- People pick exactly one option from a short list, like how often to get notifications.
- Every option should stay visible, so people can compare them before they choose.

## When not to use

- People can pick any number of options. Use Checkbox.
- The choice turns one thing on or off. Use Checkbox, or Switch when it applies at once.
- More than about seven options, or space is tight. Use Select, or Combobox for a searchable list. For a row of numbers, like 0 to 10, use Linear scale.
- The options read as a segmented control in a toolbar, like Day, Week and Month. Use Toggle group.

## Usage

Give each `RadioGroupItem` a `value` and an `id`, with a `Label` after it that points at the `id`. Name the group.

```tsx
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
```

```tsx
<RadioGroup defaultValue="phone" aria-label="Preferred contact method">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="phone" id="contact-phone" />
    <Label htmlFor="contact-phone">Phone</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="email" id="contact-email" />
    <Label htmlFor="contact-email">Email</Label>
  </div>
</RadioGroup>
```

In a form, name the group with a visible legend instead: a `FieldSet` with a `FieldLegend variant="label"`, `aria-labelledby` on the group pointing at the legend, and each option in a `Field orientation="horizontal"`, as the Email notifications example shows. In Base UI projects, `onValueChange` also gets event details as a second argument.

## Rules

- Give each item a unique `value`.
- Use `aria-invalid` for errors. Don't add border or color classes.

## API reference

| Part | Built on |
| --- | --- |
| `RadioGroup` | [Radix RadioGroup.Root](https://www.radix-ui.com/primitives/docs/components/radio-group#root) |
| `RadioGroupItem` | [Radix RadioGroup.Item](https://www.radix-ui.com/primitives/docs/components/radio-group#item) |

## SLDS mapping

`RadioGroup` is the control of SLDS's radio group fieldset. `RadioGroupItem` is `slds-radio_faux`, the circle of `slds-radio`, and a disabled item is its `:disabled` state. Options stack with no gap, as SLDS's block `slds-radio` lines do. A `Label` beside an item is regular weight, as SLDS's radio labels are.

Known gaps:

- SLDS names the group with a visible `legend`. Wrap the group in a `FieldSet` with a `FieldLegend`, or name it with `aria-label`.

## Keyboard interactions

| Keys                    | Action                                                                |
| ----------------------- | --------------------------------------------------------------------- |
| Tab                     | Enters the group as one stop, at the checked option or the first one. |
| Arrow Down, Arrow Right | Moves to the next option and checks it.                               |
| Arrow Up, Arrow Left    | Moves to the previous option and checks it.                           |
| Space                   | Checks the focused option.                                            |

## Accessibility

- Name the group with a `FieldLegend` or `aria-label`, and every item with a visible `Label`.
- Pair `aria-invalid` with an error message the items point to through `aria-describedby`.
- A disabled item turns gray but isn't dimmed. Say why it's unavailable in nearby text if that matters.

## Responsive behavior

- The circle keeps its size in a flex row, and its hit area reaches past it on every side. Long labels wrap next to it; align the circle to the first line with `items-start` on the row.
- The group fills its container's width and stacks its options. For options in a row, set `className="flex gap-4"` on the group.

## Example code

### Email notifications

Three options under a `FieldLegend` that names the group through `aria-labelledby`, the middle one checked, and arrow keys move the choice.

```tsx
import { useId } from "react"

import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  { value: "all", label: "All new messages" },
  { value: "mentions", label: "Direct messages and mentions" },
  { value: "none", label: "Nothing" },
]

export default function RadioGroupDefault() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Notify me about
      </FieldLegend>
      <RadioGroup defaultValue="mentions" aria-labelledby={`${id}-legend`}>
        {options.map((option) => (
          <Field key={option.value} orientation="horizontal">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <FieldLabel htmlFor={`${id}-${option.value}`}>
              {option.label}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  )
}
```

### States

Enabled, disabled and invalid groups of two, each with one checked, set with `disabled` and `aria-invalid` on `RadioGroupItem`.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const groups: Array<{
  name: string
  options: [string, string]
  disabled?: boolean
  invalid?: boolean
}> = [
  { name: "Enabled", options: ["Unchecked", "Checked"] },
  {
    name: "Disabled",
    options: ["Disabled", "Disabled and checked"],
    disabled: true,
  },
  {
    name: "Invalid",
    options: ["Invalid", "Invalid and checked"],
    invalid: true,
  },
]

export default function RadioGroupStates() {
  const id = useId()

  return (
    <div className="grid w-full max-w-sm gap-4">
      {groups.map((group, groupIndex) => (
        <RadioGroup
          key={group.name}
          aria-label={group.name}
          defaultValue={group.options[1]}
        >
          {group.options.map((option, optionIndex) => (
            <Field
              key={option}
              orientation="horizontal"
              data-invalid={group.invalid || undefined}
            >
              <RadioGroupItem
                value={option}
                id={`${id}-${groupIndex}-${optionIndex}`}
                disabled={group.disabled}
                aria-invalid={group.invalid || undefined}
              />
              <FieldLabel htmlFor={`${id}-${groupIndex}-${optionIndex}`}>
                {option}
              </FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      ))}
    </div>
  )
}
```
