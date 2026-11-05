# Filter

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/filter](https://ui.wisty.ai/filter) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows one filter criterion that opens an editor when pressed. For a list view's whole filter panel, use List view filter panel.

```bash
npx shadcn@latest add @wisty/filter
```

## Examples

- `default` (Account name criterion): One criterion that opens its editor when pressed, with a Value field, Cancel and Save written out in FilterContent.
- `states` (New, changed and in error): Numbered criteria with FilterMarker: one new, one changed with its FilterStatus asterisk, and one invalid with its FilterError.
- `locked` (Locked with a reason): A locked criterion people can read but not open or remove, with its reason written under it.

## When to use

- To show one filter criterion, like Account Name contains "Acme", as an item people press to edit it in a popover.
- When the criterion can be new, changed but not saved, invalid or locked, and people need to see which.
- In a filter panel, a report's filters or a builder of conditions, where the page owns the list and the editor's fields.

## When not to use

- For a list view's whole filter panel, with Filter by Owner, filter logic and Save. Use List view filter panel, which is built from these parts.
- For a quick choice that filters as soon as it changes, like a status picker above a table. Use Select or Toggle group.
- To search rows by text. Use an Input or List view header's search.

## Usage

```text
Filter
├── FilterMarker
├── FilterItem
│   ├── FilterTrigger
│   │   ├── FilterProperty
│   │   │   └── FilterStatus
│   │   └── FilterPredicate
│   └── FilterRemove
├── FilterError
└── FilterContent
```

```tsx
import {
  Filter,
  FilterContent,
  FilterError,
  FilterItem,
  FilterPredicate,
  FilterProperty,
  FilterRemove,
  FilterStatus,
  FilterTrigger,
} from "@/components/wisty/filter"
```

```tsx
<Filter status="changed" invalid={!!error} open={open} onOpenChange={setOpen}>
  <FilterItem>
    <FilterTrigger>
      <FilterProperty>
        Amount
        <FilterStatus />
      </FilterProperty>
      <FilterPredicate>greater than $50,000</FilterPredicate>
    </FilterTrigger>
    <FilterRemove aria-label="Remove filter: Amount greater than $50,000" />
  </FilterItem>
  <FilterError>{error}</FilterError>
  <FilterContent aria-label="Choose filter criteria">{editor}</FilterContent>
</Filter>
```

`FilterContent` holds whatever edits the criterion: fields and the buttons that apply or drop them. It adds no buttons of its own. Close it by setting `open` to false from those buttons. `FilterMarker` holds a number such as `1.` beside the item, for filters that filter logic refers to by position. `FilterStatus` draws the asterisk after the label of a new or changed criterion. Write it where the asterisk belongs, or leave it out, as Filter by Owner does.

## Rules

- Pass `status`, `invalid` and `locked` from the data the page holds. The filter never works out whether a criterion changed or can be applied.
- A locked filter never opens its editor or shows `FilterRemove`. Enforce what it stands for where the data is read.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `Filter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | One criterion people press to edit: its item, an optional marker, its error and its editor. |
| `FilterMarker` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |  |
| `FilterItem` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |
| `FilterTrigger` | [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) |  |
| `FilterProperty` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |  |
| `FilterStatus` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |  |
| `FilterPredicate` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |  |
| `FilterRemove` | [Button](https://ui.wisty.ai/button#api-Button) |  |
| `FilterError` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |  |
| `FilterContent` | [PopoverContent](https://ui.wisty.ai/popover#api-PopoverContent) |  |

### Filter

One criterion people press to edit: its item, an optional marker, its error and its editor.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status`? | `FilterState` | `"unchanged"` | Whether the criterion is saved, new or changed since it was saved. Default "unchanged". |
| `invalid`? | `boolean` | `false` | The criterion can't be applied; write its reason in FilterError. |
| `locked`? | `boolean` | `false` | Shown but never edited or removed: the trigger is disabled and the editor never opens. |
| `open`? | `boolean` |  | Whether the editor is open, controlled. |
| `defaultOpen`? | `boolean` |  | Whether the editor is open at first, uncontrolled. |
| `onOpenChange`? | `(open: boolean) => void` |  | Called when the editor opens or closes. |

### FilterContent

| Prop | Type | Default |
| --- | --- | --- |
| `align`? | `"center" \| "end" \| "start"` | `"end"` |
| `side`? | `"top" \| "bottom" \| "left" \| "right"` | `"left"` |
| `sideOffset`? | `number` | `10` |

### FilterState

```ts
type FilterState = "unchanged" | "new" | "changed"
```

## SLDS mapping

`Filter` is a criterion's wrapper and `FilterItem` its `slds-filters__item`, with `slds-is-new` for `status` new or changed, `slds-has-error` for `invalid` and `slds-is-locked` for `locked`. `FilterTrigger` is the item's `slds-button_reset` holding the `slds-text-body_small` label (`FilterProperty`) and the value (`FilterPredicate`). `FilterRemove` is the small icon button. `FilterError` is the `slds-text-color_error` message under the item. `FilterContent` is `slds-popover slds-popover_large` opening on the left with `slds-nubbin_right-bottom`.

Known gaps:

- `FilterRemove` uses lucide's trash glyph where SLDS draws `utility:delete`.
- SLDS's grouped filters (`slds-filters__group`) and the expression builder's rows aren't parts here.

## Accessibility

- The trigger's name is its text, so write the words a screen reader should say first, like an `sr-only` "Edit filter 1:", inside `FilterTrigger`. A new or changed criterion adds "Not saved" or "Changed, not saved" at the end.
- Give `FilterRemove` an `aria-label` that names the criterion, and `FilterContent` an `aria-label` or `aria-labelledby`.
- `invalid` describes the trigger with `FilterError`'s text, so write the error whenever `invalid` is true.
- A locked trigger is disabled, so write the reason as visible text beside it.

## Example code

### Account name criterion

One criterion that opens its editor when pressed, with a Value field, Cancel and Save written out in FilterContent.

```tsx
"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Filter,
  FilterContent,
  FilterItem,
  FilterPredicate,
  FilterProperty,
  FilterTrigger,
} from "@/components/wisty/filter"

export default function FilterDefault() {
  const id = useId()
  const [value, setValue] = useState("Acme")
  const [draft, setDraft] = useState(value)
  const [open, setOpen] = useState(false)

  return (
    <Filter
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setDraft(value)
      }}
      className="w-full max-w-xs"
    >
      <FilterItem>
        <FilterTrigger>
          <FilterProperty>Account Name</FilterProperty>
          <FilterPredicate>contains &quot;{value}&quot;</FilterPredicate>
        </FilterTrigger>
      </FilterItem>
      <FilterContent aria-label="Choose filter criteria">
        <Field>
          <FieldLabel htmlFor={id}>Value</FieldLabel>
          <Input
            id={id}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </Field>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setValue(draft)
              setOpen(false)
            }}
          >
            Save
          </Button>
        </div>
      </FilterContent>
    </Filter>
  )
}
```

### New, changed and in error

Numbered criteria with FilterMarker: one new, one changed with its FilterStatus asterisk, and one invalid with its FilterError.

```tsx
"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Filter,
  FilterContent,
  FilterError,
  FilterItem,
  FilterMarker,
  FilterPredicate,
  FilterProperty,
  FilterRemove,
  FilterStatus,
  FilterTrigger,
} from "@/components/wisty/filter"

function Criterion({
  number,
  label,
  operator,
  initialValue,
  status,
  error,
}: {
  number: number
  label: string
  operator: string
  initialValue: string
  status: "new" | "changed" | "unchanged"
  error?: string
}) {
  const id = useId()
  const [value, setValue] = useState(initialValue)
  const [draft, setDraft] = useState(value)
  const [open, setOpen] = useState(false)

  return (
    <Filter
      status={status}
      invalid={!!error}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setDraft(value)
      }}
    >
      <FilterMarker>{number}.</FilterMarker>
      <FilterItem>
        <FilterTrigger>
          <FilterProperty>
            {label}
            <FilterStatus />
          </FilterProperty>
          <FilterPredicate>
            {operator} {value}
          </FilterPredicate>
        </FilterTrigger>
        <FilterRemove
          aria-label={`Remove filter: ${label} ${operator} ${value}`}
        />
      </FilterItem>
      <FilterError>{error}</FilterError>
      <FilterContent aria-label="Choose filter criteria">
        <Field>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            id={id}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </Field>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setValue(draft)
              setOpen(false)
            }}
          >
            Save
          </Button>
        </div>
      </FilterContent>
    </Filter>
  )
}

export default function FilterStates() {
  return (
    <ol className="flex w-full max-w-xs flex-col gap-4">
      <li>
        <Criterion
          number={1}
          label="Stage"
          operator="equals"
          initialValue="Prospecting"
          status="new"
        />
      </li>
      <li>
        <Criterion
          number={2}
          label="Amount"
          operator="greater than"
          initialValue="$50,000"
          status="changed"
        />
      </li>
      <li>
        <Criterion
          number={3}
          label="Region"
          operator="equals"
          initialValue="EMEA"
          status="unchanged"
          error="Region isn't available to filter by."
        />
      </li>
    </ol>
  )
}
```

### Locked with a reason

A locked criterion people can read but not open or remove, with its reason written under it.

```tsx
import {
  Filter,
  FilterItem,
  FilterPredicate,
  FilterProperty,
  FilterTrigger,
} from "@/components/wisty/filter"

export default function FilterLocked() {
  return (
    <Filter locked className="w-full max-w-xs">
      <FilterItem>
        <FilterTrigger>
          <FilterProperty>Status</FilterProperty>
          <FilterPredicate>not equal to Closed</FilterPredicate>
        </FilterTrigger>
      </FilterItem>
      <p className="mt-1 text-xs">This view shows open cases only.</p>
    </Filter>
  )
}
```
