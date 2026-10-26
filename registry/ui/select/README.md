# Select

This page shows the Radix version. Base UI projects get [registry/base/ui/select.tsx](../../base/ui/select.tsx), and [ui.wisty.ai/select](https://ui.wisty.ai/select) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks one value from a short list in a dropdown, as a picklist does.

```bash
npx shadcn@latest add @wisty/select
```

## Examples

- `default` (Opportunity stage): A picklist named by a `FieldLabel`, showing the `placeholder` on `SelectValue` until a stage is picked.
- `groups` (Groups): Options in `SelectGroup`s under `SelectLabel`s, a `SelectSeparator` between them, a `disabled` option and a selected value.
- `sizes` (Sizes): The default 32px trigger and the 28px one, set with `size` on `SelectTrigger`, each named by `aria-label` as in a toolbar.
- `states` (States): A picklist with `aria-invalid` on `SelectTrigger` and an error, and one with `disabled` on `Select`.
- `long-list` (Long list): Account's 32 industries: the list shows seven options and scrolls through the rest, as SLDS's picklist does.

## When to use

- To pick one value from a short, fixed list, like an opportunity's stage or an account's type: the picklist of record forms.
- For roughly 4 to 15 options, known up front, that don't need searching.

## When not to use

- Two or three options with room to show them. Use Radio group, or Checkbox for yes or no.
- People should type to search a long list, like countries. Use Combobox. To pick a record, like an account, use Lookup.
- People pick several values. Use Checkbox.
- The list holds actions, like Edit or Delete. Use Dropdown menu.
- A plain form post, or the phone's own picker on mobile. Use Native select.

## Usage

```text
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   └── SelectItem
    ├── SelectSeparator
    └── SelectItem
```

To control the value, pass `value` and `onValueChange`:

```tsx
import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PrioritySelect() {
  const [priority, setPriority] = useState("Medium")

  return (
    <Select
      value={priority}
      onValueChange={(next) => setPriority(next ?? "Medium")}
    >
      <SelectTrigger aria-label="Priority">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="High">High</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="Low">Low</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

The bases differ in three places:

- In Radix projects, `onValueChange` gets the value. In Base UI projects its type allows `null` and it gets event details as a second argument, so the snippet falls back on `null`.
- In Radix projects, the trigger shows the selected option's text. In Base UI projects it shows the value unless you pass `items`, a list of `{ value, label }`, to `Select`. Pass `items` when a value doesn't read as its label, like `needs-analysis`.
- To open the list over the field, with the selected option on it, pass `position="item-aligned"` to `SelectContent` in Radix projects, or `alignItemWithTrigger` in Base UI projects.

## Rules

- Give every `SelectItem` a unique `value`.
- Put `SelectValue` inside `SelectTrigger`, with a `placeholder` for an empty select.
- Don't restyle the trigger's border, focus ring or error colors. They come from the input tokens and change per theme.
- Don't put buttons, links or other interactive elements inside `SelectItem`.

## API reference

| Part | Built on |
| --- | --- |
| `Select` | [Radix Select.Root](https://www.radix-ui.com/primitives/docs/components/select#root) |
| `SelectGroup` | [Radix Select.Group](https://www.radix-ui.com/primitives/docs/components/select#group) |
| `SelectValue` | [Radix Select.Value](https://www.radix-ui.com/primitives/docs/components/select#value) |
| `SelectTrigger` | [Radix Select.Trigger](https://www.radix-ui.com/primitives/docs/components/select#trigger) |
| `SelectContent` | [Radix Select.Content](https://www.radix-ui.com/primitives/docs/components/select#content) |
| `SelectLabel` | [Radix Select.Label](https://www.radix-ui.com/primitives/docs/components/select#label) |
| `SelectItem` | [Radix Select.Item](https://www.radix-ui.com/primitives/docs/components/select#item) |
| `SelectSeparator` | [Radix Select.Separator](https://www.radix-ui.com/primitives/docs/components/select#separator) |
| `SelectScrollUpButton` | [Radix Select.ScrollUpButton](https://www.radix-ui.com/primitives/docs/components/select#scrollupbutton) |
| `SelectScrollDownButton` | [Radix Select.ScrollDownButton](https://www.radix-ui.com/primitives/docs/components/select#scrolldownbutton) |

### SelectTrigger

| Prop | Type | Default |
| --- | --- | --- |
| `size`? | `"sm" \| "default"` | `"default"` |

### SelectContent

| Prop | Type | Default |
| --- | --- | --- |
| `position`? | `"item-aligned" \| "popper"` | `"popper"` |
| `align`? | `"center" \| "end" \| "start"` | `"center"` |
| `sideOffset`? | `number` | `2` |

## SLDS mapping

Select is SLDS's picklist, the read-only combobox (`slds-combobox` with `slds-input_faux`), not the native `slds-select`.

- `SelectTrigger` is `slds-input_faux slds-combobox__input` with its chevron (`slds-input__icon_right`). It takes the input's border, focus, error and disabled styles.
- `SelectValue` is the field's `slds-truncate` text.
- `SelectContent` is `slds-dropdown slds-dropdown_fluid slds-dropdown_length-with-icon-7`.
- `SelectItem` is `slds-listbox__option slds-listbox__option_plain`, with the check in `slds-listbox__option-icon` on the left.
- `SelectLabel` is `slds-listbox__option-header`, and `SelectSeparator` is the `slds-has-divider_top-space` line.

Known gaps:

- No option icons, no option metadata lines, and no five- or ten-row list (`slds-dropdown_length-5`, `-10`).

## Keyboard interactions

| Keys                       | Action                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Enter, Space or Down Arrow | On the trigger, opens the list with the selected option highlighted.                        |
| Down Arrow, Up Arrow       | Moves the highlight to the next or previous option.                                         |
| Home, End                  | Moves the highlight to the first or last option.                                            |
| Letters                    | Highlights the next option whose label starts with them. On the closed trigger, selects it. |
| Enter                      | Selects the highlighted option, closes the list and returns focus to the trigger.           |
| Escape                     | Closes the list without changing the value and returns focus to the trigger.                |

## Accessibility

- Name the trigger: give it an `id` and point a `FieldLabel`'s `htmlFor` at it, or pass `aria-label`.
- For an error, set `aria-invalid` on `SelectTrigger` and point `aria-describedby` at the message.
- In Cosmos dark, the error text in an invalid field is about 4.3:1, below WCAG AA's 4.5:1. SLDS's own invalid combobox is the same.
- The highlighted option shows an inset ring on keyboard focus, so the highlight isn't color alone. Keep it if you restyle items.

## Motion

- The list appears and disappears at once, with no fade or zoom. If you add animation classes through `className`, put them behind `motion-safe:`.

## Responsive behavior

- The trigger is as wide as its content. Pass `className="w-full"` to fill a form column.
- The list is at least as wide as the trigger. It shows seven rows, then scrolls, and opens above the field when there's no room below.
- A long label is cut off on one line in the trigger. Keep option labels short.

## Example code

### Opportunity stage

A picklist named by a `FieldLabel`, showing the `placeholder` on `SelectValue` until a stage is picked.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectDefault() {
  const id = useId()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Stage</FieldLabel>
      <Select>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Prospecting">Prospecting</SelectItem>
          <SelectItem value="Qualification">Qualification</SelectItem>
          <SelectItem value="Needs Analysis">Needs Analysis</SelectItem>
          <SelectItem value="Closed Won">Closed Won</SelectItem>
          <SelectItem value="Closed Lost">Closed Lost</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  )
}
```

### Groups

Options in `SelectGroup`s under `SelectLabel`s, a `SelectSeparator` between them, a `disabled` option and a selected value.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectGroups() {
  const id = useId()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Account type</FieldLabel>
      <Select defaultValue="Customer - Direct">
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Customers</SelectLabel>
            <SelectItem value="Customer - Direct">Customer - Direct</SelectItem>
            <SelectItem value="Customer - Channel">
              Customer - Channel
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Partners</SelectLabel>
            <SelectItem value="Partner">Partner</SelectItem>
            <SelectItem value="Reseller" disabled>
              Reseller
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
```

### Sizes

The default 32px trigger and the 28px one, set with `size` on `SelectTrigger`, each named by `aria-label` as in a toolbar.

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select defaultValue="Close Date">
        <SelectTrigger aria-label="Sort by">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Close Date">Close Date</SelectItem>
          <SelectItem value="Amount">Amount</SelectItem>
          <SelectItem value="Stage">Stage</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="Close Date">
        <SelectTrigger size="sm" aria-label="Sort by, small">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Close Date">Close Date</SelectItem>
          <SelectItem value="Amount">Amount</SelectItem>
          <SelectItem value="Stage">Stage</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

### States

A picklist with `aria-invalid` on `SelectTrigger` and an error, and one with `disabled` on `Select`.

```tsx
import { useId } from "react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectStates() {
  const id = useId()

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-priority`}>Priority</FieldLabel>
        <Select>
          <SelectTrigger
            id={`${id}-priority`}
            aria-invalid="true"
            aria-describedby={`${id}-priority-error`}
            className="w-full"
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <FieldError id={`${id}-priority-error`}>
          Complete this field.
        </FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-region`}>Region</FieldLabel>
        <Select defaultValue="EMEA" disabled>
          <SelectTrigger id={`${id}-region`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Americas">Americas</SelectItem>
            <SelectItem value="EMEA">EMEA</SelectItem>
            <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  )
}
```

### Long list

Account's 32 industries: the list shows seven options and scrolls through the rest, as SLDS's picklist does.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const industries = [
  "Agriculture",
  "Apparel",
  "Banking",
  "Biotechnology",
  "Chemicals",
  "Communications",
  "Construction",
  "Consulting",
  "Education",
  "Electronics",
  "Energy",
  "Engineering",
  "Entertainment",
  "Environmental",
  "Finance",
  "Food & Beverage",
  "Government",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Machinery",
  "Manufacturing",
  "Media",
  "Not For Profit",
  "Recreation",
  "Retail",
  "Shipping",
  "Technology",
  "Telecommunications",
  "Transportation",
  "Utilities",
  "Other",
]

export default function SelectLongList() {
  const id = useId()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Industry</FieldLabel>
      <Select>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry}>
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
```
