# Checkbox

This page shows the Radix version. Base UI projects get [registry/base/ui/checkbox.tsx](../../base/ui/checkbox.tsx), and [ui.wisty.ai/checkbox](https://ui.wisty.ai/checkbox) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Turns one option on or off, or shows a mixed state for a group.

```bash
npx shadcn@latest add @wisty/checkbox
```

## Examples

- `default` (Contact preferences): A plain checkbox, one checked with `defaultChecked` and help text, one `disabled`, and a choice card that selects as a whole.
- `states` (States): Unchecked and checked, then `disabled` and `aria-invalid`, each unchecked and checked.

## When to use

- People turn one option on or off, like a contact's Email Opt Out or Do Not Call.
- People pick any number of options from a short list. Group the checkboxes in a `FieldSet`.
- A row in a table can be selected. Put a checkbox in the row's first cell.
- The choice takes effect when people save, not at once.

## When not to use

- The choice takes effect at once, like turning a setting on. Use Switch.
- People pick exactly one option. Use Radio Group, or Select for a long list.
- The list is long or searchable. Use Combobox.

## Usage

Give each checkbox a label: a `Label` after it with `htmlFor` set to its `id`, or a `Field` with `orientation="horizontal"`, as the Contact preferences example shows.

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
```

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="fax-opt-out" />
  <Label htmlFor="fax-opt-out">Fax Opt Out</Label>
</div>
```

To control it, pass `checked` and `onCheckedChange`; to only set where it starts, pass `defaultChecked`.

For the mixed state, in Radix projects pass `checked="indeterminate"`, and `onCheckedChange` may then receive `"indeterminate"` as well as `true` or `false`. In Base UI projects, pass the separate `indeterminate` prop. Both draw the same dash.

## Rules

- Use `aria-invalid` for errors. Don't add border or color classes: the error look differs per theme.
- Don't dim a disabled checkbox with opacity classes. The gray box is the disabled look, and the label beside it stays readable.

## API reference

### Checkbox

Also takes every [Radix Checkbox.Root](https://www.radix-ui.com/primitives/docs/components/checkbox#root) prop.

## SLDS mapping

`Checkbox` is `slds-checkbox_faux`, the box SLDS draws for `slds-checkbox`. Checked is its `:checked` fill, the mixed state its `:indeterminate` dash, `aria-invalid` is `slds-has-error`, and disabled is SLDS's gray box. A `Label` beside a checkbox is regular weight, as SLDS's checkbox labels are.

Known gaps:

- The check is lucide's `CheckIcon`, sized to SLDS's mark. SLDS draws its check with borders, so the stroke ends differ a little.

## Accessibility

- In a table, name a row's checkbox with `aria-label`, like "Select Acme Corporation".
- In a choice card, where a label wraps the whole card, point the checkbox's `aria-labelledby` at the `FieldTitle` and its `aria-describedby` at the description, as the Contact preferences example does. Otherwise the card's whole text becomes its name.
- Group related checkboxes in a `FieldSet` with a `FieldLegend`, so the group has a name.
- Pair `aria-invalid` with an error message the checkbox points to through `aria-describedby`.

## Responsive behavior

- Long labels wrap next to the box. Align the box to the first line with `items-start` on the row.

## Example code

### Contact preferences

A plain checkbox, one checked with `defaultChecked` and help text, one `disabled`, and a choice card that selects as a whole.

```tsx
import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"

export default function CheckboxDefault() {
  const id = useId()

  return (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id={`${id}-email`} />
        <FieldLabel htmlFor={`${id}-email`}>Email Opt Out</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          id={`${id}-call`}
          defaultChecked
          aria-describedby={`${id}-call-help`}
        />
        <FieldContent>
          <FieldLabel htmlFor={`${id}-call`}>Do Not Call</FieldLabel>
          <FieldDescription id={`${id}-call-help`}>
            Reps won&apos;t see this contact in call lists.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id={`${id}-fax`} disabled />
        <FieldLabel htmlFor={`${id}-fax`}>Fax Opt Out</FieldLabel>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox
            id={`${id}-sync`}
            aria-labelledby={`${id}-sync-title`}
            aria-describedby={`${id}-sync-help`}
          />
          <FieldContent>
            <FieldTitle id={`${id}-sync-title`}>Sync with Outlook</FieldTitle>
            <FieldDescription id={`${id}-sync-help`}>
              Keep this contact up to date in your Outlook address book.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}
```

### States

Unchecked and checked, then `disabled` and `aria-invalid`, each unchecked and checked.

```tsx
import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

const states: Array<{
  label: string
  checked: boolean
  disabled?: boolean
  invalid?: boolean
}> = [
  { label: "Unchecked", checked: false },
  { label: "Checked", checked: true },
  { label: "Disabled", checked: false, disabled: true },
  { label: "Disabled and checked", checked: true, disabled: true },
  { label: "Invalid", checked: false, invalid: true },
  { label: "Invalid and checked", checked: true, invalid: true },
]

export default function CheckboxStates() {
  const id = useId()

  return (
    <FieldGroup className="w-full max-w-sm">
      {states.map((state, index) => (
        <Field
          key={state.label}
          orientation="horizontal"
          data-invalid={state.invalid || undefined}
        >
          <Checkbox
            id={`${id}-${index}`}
            defaultChecked={state.checked}
            disabled={state.disabled}
            aria-invalid={state.invalid || undefined}
          />
          <FieldLabel htmlFor={`${id}-${index}`}>{state.label}</FieldLabel>
        </Field>
      ))}
    </FieldGroup>
  )
}
```
