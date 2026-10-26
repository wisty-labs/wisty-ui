# Table

This page shows the Radix version. Base UI projects get [registry/base/ui/table.tsx](../../base/ui/table.tsx), and [ui.wisty.ai/table](https://ui.wisty.ai/table) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows rows of data in columns, read-only. For sorting, selection and row actions, use Data table.

```bash
npx shadcn@latest add @wisty/table
```

## Examples

- `default` (Open opportunities): Opportunities with a `TableCaption` naming the table and a total row in `TableFooter`.
- `selection` (Selection column): A checkbox in each row's first cell and one in the header, and the checked row is drawn selected with `data-state="selected"` on `TableRow`.
- `sortable` (Sortable headers): Headers with `aria-sort` and a `<button>`, sorted by name. Click a header to sort by it.

## When to use

- People read and compare records in rows and columns, like a related list or a report.
- The data is read-only, or each row has a link or a simple action.

## When not to use

- People sort, select rows for a bulk action, resize columns, use row actions or load more rows, and you want that handled for you. Use Data Table.
- People edit cells in place or move between cells with the arrow keys. Neither Table nor Data Table does that yet.
- The data is one record's fields. Use a definition list or a Card.
- The content is a layout, not data.

## Usage

```text
Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       └── TableHead
├── TableBody
│   └── TableRow
│       └── TableCell
└── TableFooter
    └── TableRow
        └── TableCell
```

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx
<Table aria-label="Contacts">
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
      <TableCell>ada@acme.example</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Two patterns come from attributes. A `Checkbox` straight inside the first `TableHead` and each row's first `TableCell` makes a selection column, and `data-state="selected"` on a `TableRow` draws it selected, as the Selection column example shows. A `TableHead` with `aria-sort` and a plain `<button>` inside becomes a sortable header: give the button an `ArrowDownIcon`, which turns for `ascending` and hides for `none`. The Sortable headers example sorts the rows itself.

```tsx
<TableHead aria-sort="ascending">
  <button type="button">
    Name
    <ArrowDownIcon />
  </button>
</TableHead>
```

## Rules

- Set `data-state="selected"` for a selected row. A background class pins one theme's color.
- Put `Checkbox` directly in the cell, not in a wrapper, or a row's box no longer sits on the text line.
- Put a plain `<button>` in a sortable header, never `Button`: its own height, padding and hover fight the header's.
- Align numbers with `text-end` on their head and cells.
- Don't add borders, stripes or padding classes; the tokens carry each theme's table.

## API reference

| Part | Built on |
| --- | --- |
| `Table` | [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table) |
| `TableHeader` | [`<thead>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/thead) |
| `TableBody` | [`<tbody>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tbody) |
| `TableFooter` | [`<tfoot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tfoot) |
| `TableRow` | [`<tr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/tr) |
| `TableHead` | [`<th>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th) |
| `TableCell` | [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/td) |
| `TableCaption` | [`<caption>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/caption) |

## SLDS mapping

`Table` is `slds-table slds-table_bordered` as lightning-datatable draws it, so it matches Data Table: no `slds-table_cell-buffer`, and a line under the header. `TableHeader` cells are the header row, `TableRow` takes `slds-is-selected` from `data-state="selected"`, a cell holding a checkbox is lightning-datatable's selection column, and a `TableHead` with `aria-sort` is `slds-is-sortable` with its button as `slds-th__action` and its arrow as `slds-is-sortable__icon`. `TableFooter` and `TableCaption` have no SLDS counterpart: the footer borrows the header's look, the caption is weak text under the table.

Known gaps:

- Striping, fixed layout, column borders, resizing and inline editing aren't styled. Data Table adds a fixed layout and resizable columns.
- The header checkbox can show SLDS's mixed state: pass `checked="indeterminate"` in Radix projects and `indeterminate` in Base UI projects.

## Accessibility

- Name the table with a `TableCaption` or an `aria-label` on `Table`.
- Put column headers in `TableHeader`. For a row header, use `TableHead` with `scope="row"` in a body row.
- `data-state="selected"` only changes the look. Select rows with checkboxes, named by their row ("Select Ada Lovelace") and "Select all rows" in the header, so the state reaches assistive tech.
- Keep `aria-sort` on every sortable header, with `"none"` on the unsorted ones, so screen readers hear which column is sorted and how. The button inside names the column.

## Responsive behavior

- The table fills its container. When the columns don't fit, the container scrolls sideways; the page doesn't.
- Cells don't wrap. Add `whitespace-normal` to a cell to let long text wrap.

## Performance

- Every row renders. For more than a few hundred rows, page the data with Pagination, or use Data Table, which can render only the rows in view.

## Example code

### Open opportunities

Opportunities with a `TableCaption` naming the table and a total row in `TableFooter`.

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const opportunities = [
  {
    name: "Acme - 1,200 Widgets",
    account: "Acme",
    stage: "Prospecting",
    amount: "$140,000",
  },
  {
    name: "Global Media - 400 Licenses",
    account: "Global Media",
    stage: "Negotiation",
    amount: "$62,500",
  },
  {
    name: "Edge Communications - Upgrade",
    account: "Edge Communications",
    stage: "Closed Won",
    amount: "$27,000",
  },
  {
    name: "Burlington Textiles - 200 Seats",
    account: "Burlington Textiles",
    stage: "Proposal",
    amount: "$235,000",
  },
]

export default function TableDefault() {
  return (
    <Table>
      <TableCaption>Open opportunities this quarter.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Opportunity name</TableHead>
          <TableHead>Account name</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opportunity) => (
          <TableRow key={opportunity.name}>
            <TableCell>
              <a href="#" className="text-link hover:underline">
                {opportunity.name}
              </a>
            </TableCell>
            <TableCell>{opportunity.account}</TableCell>
            <TableCell>{opportunity.stage}</TableCell>
            <TableCell className="text-end">{opportunity.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">$464,500</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
```

### Selection column

A checkbox in each row's first cell and one in the header, and the checked row is drawn selected with `data-state="selected"` on `TableRow`.

```tsx
"use client"

import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const contacts = [
  { name: "Ada Lovelace", title: "Chief Analyst", email: "ada@acme.example" },
  {
    name: "Grace Hopper",
    title: "VP Engineering",
    email: "grace@acme.example",
  },
  {
    name: "Alan Turing",
    title: "Head of Research",
    email: "alan@acme.example",
  },
]

export default function TableSelection() {
  const [selected, setSelected] = useState<string[]>(["Grace Hopper"])
  const allSelected = selected.length === contacts.length

  return (
    <Table aria-label="Contacts">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Select all rows"
              checked={allSelected}
              onCheckedChange={(checked) =>
                setSelected(
                  checked === true
                    ? contacts.map((contact) => contact.name)
                    : []
                )
              }
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => {
          const isSelected = selected.includes(contact.name)
          return (
            <TableRow
              key={contact.name}
              data-state={isSelected ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${contact.name}`}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    setSelected((current) =>
                      checked === true
                        ? [...current, contact.name]
                        : current.filter((name) => name !== contact.name)
                    )
                  }
                />
              </TableCell>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.title}</TableCell>
              <TableCell>{contact.email}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
```

### Sortable headers

Headers with `aria-sort` and a `<button>`, sorted by name. Click a header to sort by it.

```tsx
"use client"

import { useState } from "react"
import { ArrowDownIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Column = "name" | "title" | "email"

const columns: Array<{ key: Column; label: string }> = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "email", label: "Email" },
]

const contacts = [
  {
    name: "Grace Hopper",
    title: "VP Engineering",
    email: "grace@acme.example",
  },
  { name: "Ada Lovelace", title: "Chief Analyst", email: "ada@acme.example" },
  {
    name: "Alan Turing",
    title: "Head of Research",
    email: "alan@acme.example",
  },
]

export default function TableSortable() {
  const [sort, setSort] = useState<{
    column: Column
    direction: "ascending" | "descending"
  }>({ column: "name", direction: "ascending" })

  const rows = [...contacts].sort((a, b) => {
    const order = a[sort.column].localeCompare(b[sort.column])
    return sort.direction === "ascending" ? order : -order
  })

  return (
    <Table aria-label="Contacts">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              aria-sort={sort.column === column.key ? sort.direction : "none"}
            >
              <button
                type="button"
                onClick={() =>
                  setSort((current) => ({
                    column: column.key,
                    direction:
                      current.column === column.key &&
                      current.direction === "ascending"
                        ? "descending"
                        : "ascending",
                  }))
                }
              >
                {column.label}
                <ArrowDownIcon />
              </button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((contact) => (
          <TableRow key={contact.name}>
            <TableCell>{contact.name}</TableCell>
            <TableCell>{contact.title}</TableCell>
            <TableCell>{contact.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```
