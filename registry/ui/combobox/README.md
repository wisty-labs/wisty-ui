# Combobox

This page shows the Radix version. Base UI projects get [registry/base/ui/combobox.tsx](../../base/ui/combobox.tsx), and [ui.wisty.ai/combobox](https://ui.wisty.ai/combobox) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Filters a list of options as you type, for one value or several shown as pills.

```bash
npx shadcn@latest add @wisty/combobox
```

## Examples

- `default` (Billing country): Countries passed as `items` filter as you type, and `ComboboxEmpty` shows a message when nothing matches.
- `groups` (Groups): Option headers from `ComboboxLabel`, a `ComboboxSeparator`, a disabled option, and a selected value with the `showClear` button.
- `multiple` (Multiple): Several values as pills inside the field, set with `multiple` on `Combobox` and a `ComboboxChip` per value.
- `states` (States): An industry marked with `aria-invalid` above its `FieldError`, and a region with a value and `disabled`.
- `dialog` (In a dialog): A loss reason in a modal dialog, where the list opens above the dialog and Escape closes the list before the dialog.

## When to use

- People pick a value from a long list and typing to filter it helps, like a country, a product or an industry.
- People pick several values from such a list. The chips parts show each picked value as a pill in the field.
- The options are in the page, or you fetch them yourself as people type.

## When not to use

- The list is short and people don't need to type. Use Select.
- The value is any text, with no list to pick from. Use Input.
- People pick Salesforce records, with object icons, a meta line, recent records or a search as they type. Use Lookup, which is built on this combobox.
- The list holds actions, like Edit or Delete, rather than values. Use Dropdown menu.
- There are only a few choices and people should see them all. Use Radio group or Checkbox.

## Usage

Pass the options to `Combobox` as `items`, and render one `ComboboxItem` per option from a function inside `ComboboxList`. A function as children needs a client component, so mark the file `"use client"`.

```text
Combobox
├── ComboboxInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxItem
```

```tsx
"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
```

```tsx
<Combobox items={["Agriculture", "Banking", "Education", "Retail"]}>
  <ComboboxInput aria-label="Industry" placeholder="Search industries..." />
  <ComboboxContent>
    <ComboboxEmpty>No industries found.</ComboboxEmpty>
    <ComboboxList>
      {(industry: string) => (
        <ComboboxItem key={industry} value={industry}>
          {industry}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

`ComboboxInput` has a chevron button that opens the list; `showTrigger={false}` removes it. `showClear` adds a clear button, which takes the chevron's place while the field has a value.

For several values, pass `multiple` to `Combobox` and build the field from chips. Call `useComboboxAnchor()` and give its ref to `ComboboxChips` as `ref` and to `ComboboxContent` as `anchor`, so the list opens below the whole field, as the Multiple example shows. Each `ComboboxChip` has a remove button unless you pass `showRemove={false}`.

```text
Combobox
├── ComboboxChips
│   └── ComboboxValue
│       ├── ComboboxChip
│       └── ComboboxChipsInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxItem
```

For groups, pass `items` as groups that each hold their own `items`. The function inside `ComboboxList` then returns a `ComboboxGroup` per group, given that group's `items`, and a function inside its `ComboboxCollection` returns the options, as the Groups example shows.

```text
ComboboxList
└── ComboboxGroup
    ├── ComboboxSeparator
    ├── ComboboxLabel
    └── ComboboxCollection
        └── ComboboxItem
```

`onValueChange` gets the new value, or `null` when the field is cleared. For object items, give `Combobox` an `itemToStringLabel` so the field shows a label.

In Radix projects, Combobox is built on `@base-ui/react`, as shadcn's is, so installing it adds that package beside `radix-ui`. The two work side by side.

## Rules

- Disable with `disabled` on both `Combobox` and `ComboboxInput`, as the States example does.
- Don't add your own Escape or outside-click handling inside a dialog. The dialogs already leave Escape to an open list.

## API reference

| Part | Built on |
| --- | --- |
| `Combobox` | [Base UI Combobox.Root](https://base-ui.com/react/components/combobox#root) |
| `ComboboxValue` | [Base UI Combobox.Value](https://base-ui.com/react/components/combobox#value) |
| `ComboboxTrigger` | [Base UI Combobox.Trigger](https://base-ui.com/react/components/combobox#trigger) |
| `ComboboxInput` | [Base UI Combobox.Input](https://base-ui.com/react/components/combobox#input) |
| `ComboboxContent` | [Base UI Combobox.Popup](https://base-ui.com/react/components/combobox#popup) |
| `ComboboxList` | [Base UI Combobox.List](https://base-ui.com/react/components/combobox#list) |
| `ComboboxItem` | [Base UI Combobox.Item](https://base-ui.com/react/components/combobox#item) |
| `ComboboxGroup` | [Base UI Combobox.Group](https://base-ui.com/react/components/combobox#group) |
| `ComboboxLabel` | [Base UI Combobox.GroupLabel](https://base-ui.com/react/components/combobox#grouplabel) |
| `ComboboxCollection` | [Base UI Combobox.Collection](https://base-ui.com/react/components/combobox#collection) |
| `ComboboxEmpty` | [Base UI Combobox.Empty](https://base-ui.com/react/components/combobox#empty) |
| `ComboboxSeparator` | [Base UI Combobox.Separator](https://base-ui.com/react/components/combobox#separator) |
| `ComboboxChips` | [Base UI Combobox.Chips](https://base-ui.com/react/components/combobox#chips) |
| `ComboboxChip` | [Base UI Combobox.Chip](https://base-ui.com/react/components/combobox#chip) |
| `ComboboxChipsInput` | [Base UI Combobox.Input](https://base-ui.com/react/components/combobox#input) |

### ComboboxInput

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `showTrigger`? | `boolean` | `true` |  |
| `showClear`? | `boolean` | `false` |  |
| `disabled`? | `boolean` | `false` | Whether the component should ignore user interaction. |

### ComboboxContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align`? | `"center" \| "end" \| "start"` | `"start"` | How to align the popup relative to the specified side. |
| `side`? | `"top" \| "bottom" \| "left" \| "right" \| "inline-end" \| "inline-start"` | `"bottom"` | Which side of the anchor element to align the popup against. |
| `sideOffset`? | `number \| OffsetFunction` | `2` | Distance between the anchor and the popup in pixels. |
| `alignOffset`? | `number \| OffsetFunction` | `0` | Additional offset along the alignment axis in pixels. |
| `anchor`? | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null` |  | An element to position the popup against. |

### ComboboxChip

| Prop | Type | Default |
| --- | --- | --- |
| `showRemove`? | `boolean` | `true` |

### useComboboxAnchor

Returns `RefObject<HTMLDivElement | null>`.

## SLDS mapping

Combobox draws SLDS's autocomplete combobox. It runs on Base UI's combobox in Radix projects too, so installing it in a Radix project adds `@base-ui/react`.

- `ComboboxInput` is `slds-combobox__input` in `slds-input-has-icon_right`, with the chevron as the input icon. Its clear button is SLDS's input icon button.
- `ComboboxContent` is `slds-dropdown slds-dropdown_fluid slds-dropdown_length-with-icon-7`, as Select's list.
- `ComboboxItem` is `slds-listbox__option slds-listbox__option_plain`, with SLDS's check column on the left.
- `ComboboxLabel` is `slds-listbox__option-header`, and `ComboboxSeparator` is `slds-has-divider_top-space`. `ComboboxEmpty` is a plain option row in muted text, since SLDS has no "no results" row.
- `ComboboxChips` is SLDS's inline listbox of pills (`slds-has-inline-listbox`, `slds-listbox_inline`), and `ComboboxChip` is a `slds-pill` option.

Known gaps:

- SLDS's autocomplete shows a search icon. Here the field has a chevron, which SLDS 2's combobox anatomy also names.
- SLDS 2 shows several values as pills below the field. Here they sit inside it, as in SLDS's inline listbox.
- Option icons, metadata lines, a loading spinner and the 5 and 10 row list heights aren't drawn. For records with icons and meta lines, use Lookup.

## Keyboard interactions

| Keys                 | Action                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Typing               | Filters the options and opens the list.                                                         |
| Down Arrow, Up Arrow | Opens the list, or moves the highlight. Opening highlights the selected option, if any.         |
| Enter                | Selects the highlighted option and closes the list.                                             |
| Escape               | Closes the list. On a closed field with a value, clears it.                                     |
| Left Arrow (chips)   | From the start of the input, moves to the last chip, then along the chips. Right Arrow returns. |
| Backspace (chips)    | In an empty input, removes the last chip. On a focused chip, removes it.                        |

Inside a Dialog, Sheet, Alert dialog or Popover, the first Escape closes only the list and the next closes the dialog. On a closed field with a value, Escape clears it; in Radix projects the same Escape also closes the dialog.

## Accessibility

- Name the input: a `FieldLabel` whose `htmlFor` matches the input's `id`, or `aria-label`.
- For an error, set `aria-invalid` on `ComboboxInput` and point `aria-describedby` at the message, as the States example does.
- The chevron, clear and chip remove buttons are out of the Tab order and named "Show options", "Clear" and "Remove". No prop changes those names, so for another language, edit them in your copy of the file.
- While the list is open, everything outside the field and the list is hidden from screen readers, the label and error included. The input keeps its name from the label.
- `ComboboxEmpty` is a status, so screen readers announce it when nothing matches. Always include one.
- In Cosmos dark, the invalid field's text reaches about 4.3:1, below WCAG AA's 4.5:1. Salesforce's own stylesheet fails the same way.

## Responsive behavior

- The field fills its container. The list is as wide as the field, shows seven rows, then scrolls, and opens above the field when there's no room below.
- Chips wrap onto more rows as the field fills, and the input keeps at least 4rem.
- Long option labels wrap in the list. A long value in the field scrolls with the text.

## Performance

- Filtering runs over `items` on every keystroke. A few hundred items are fine.
- For thousands, or for records on a server, filter yourself: pass `filteredItems` or control `inputValue`, and fetch as people type.

## Example code

### Billing country

Countries passed as `items` filter as you type, and `ComboboxEmpty` shows a message when nothing matches.

```tsx
"use client"

import { useId } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldLabel } from "@/components/ui/field"

const countries = [
  "Canada",
  "France",
  "Germany",
  "Japan",
  "Mexico",
  "United Kingdom",
  "United States",
]

export default function ComboboxDefault() {
  const id = useId()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Billing Country</FieldLabel>
      <Combobox items={countries}>
        <ComboboxInput id={id} placeholder="Search countries..." />
        <ComboboxContent>
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxList>
            {(country: string) => (
              <ComboboxItem key={country} value={country}>
                {country}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
```

### Groups

Option headers from `ComboboxLabel`, a `ComboboxSeparator`, a disabled option, and a selected value with the `showClear` button.

```tsx
"use client"

import { useId } from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox"
import { Field, FieldLabel } from "@/components/ui/field"

const sources = [
  { value: "Online", items: ["Web", "Email", "Social Media"] },
  { value: "Offline", items: ["Trade Show", "Phone"] },
]

export default function ComboboxGroups() {
  const id = useId()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Lead source</FieldLabel>
      <Combobox items={sources} defaultValue="Web">
        <ComboboxInput id={id} placeholder="Search sources..." showClear />
        <ComboboxContent>
          <ComboboxEmpty>No sources found.</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof sources)[number], index: number) => (
              <ComboboxGroup key={group.value} items={group.items}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(source: string) => (
                    <ComboboxItem
                      key={source}
                      value={source}
                      disabled={source === "Phone"}
                    >
                      {source}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
```

### Multiple

Several values as pills inside the field, set with `multiple` on `Combobox` and a `ComboboxChip` per value.

```tsx
"use client"

import { Fragment, useId } from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldLabel } from "@/components/ui/field"

const products = [
  "Analytics",
  "Commerce",
  "Marketing",
  "Platform",
  "Sales",
  "Service",
]

export default function ComboboxMultiple() {
  const id = useId()
  const anchor = useComboboxAnchor()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Products</FieldLabel>
      <Combobox multiple items={products} defaultValue={["Sales", "Service"]}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <Fragment>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput id={id} placeholder="Add products..." />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No products found.</ComboboxEmpty>
          <ComboboxList>
            {(product: string) => (
              <ComboboxItem key={product} value={product}>
                {product}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
```

### States

An industry marked with `aria-invalid` above its `FieldError`, and a region with a value and `disabled`.

```tsx
"use client"

import { useId } from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const industries = [
  "Agriculture",
  "Banking",
  "Education",
  "Healthcare",
  "Retail",
]

const regions = ["Americas", "EMEA", "Asia Pacific"]

export default function ComboboxStates() {
  const id = useId()

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-industry`}>Industry</FieldLabel>
        <Combobox items={industries}>
          <ComboboxInput
            id={`${id}-industry`}
            placeholder="Search industries..."
            aria-invalid="true"
            aria-describedby={`${id}-industry-error`}
          />
          <ComboboxContent>
            <ComboboxEmpty>No industries found.</ComboboxEmpty>
            <ComboboxList>
              {(industry: string) => (
                <ComboboxItem key={industry} value={industry}>
                  {industry}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <FieldError id={`${id}-industry-error`}>
          Complete this field.
        </FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-region`}>Region</FieldLabel>
        <Combobox items={regions} defaultValue="EMEA" disabled>
          <ComboboxInput id={`${id}-region`} disabled />
          <ComboboxContent>
            <ComboboxList>
              {(region: string) => (
                <ComboboxItem key={region} value={region}>
                  {region}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </FieldGroup>
  )
}
```

### In a dialog

A loss reason in a modal dialog, where the list opens above the dialog and Escape closes the list before the dialog.

```tsx
"use client"

import { useId } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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

const reasons = [
  "Competitor",
  "No Budget",
  "No Decision",
  "Price",
  "Product Fit",
  "Timing",
]

export default function ComboboxDialog() {
  const id = useId()

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Mark as lost
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as lost</DialogTitle>
          <DialogDescription>
            The opportunity moves to Closed Lost.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor={id}>Loss Reason</FieldLabel>
          <Combobox items={reasons}>
            <ComboboxInput id={id} placeholder="Search reasons..." />
            <ComboboxContent>
              <ComboboxEmpty>No reasons found.</ComboboxEmpty>
              <ComboboxList>
                {(reason: string) => (
                  <ComboboxItem key={reason} value={reason}>
                    {reason}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
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
