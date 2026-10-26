# Related list

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/related-list](https://ui.wisty.ai/related-list) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A record's related records of one kind, with New and View All. Lightning's related list, for a standard or custom object.

```bash
npx shadcn@latest add @wisty/related-list
```

## Examples

- `default` (Contacts): Edge Communications' contacts with New, a menu on each row and View All. The name column's `cell` links each contact.
- `opportunities` (Opportunities): Currency and date columns formatted in the list's `currency` and `locale`, and `rowActions` as a function that disables Delete on closed deals.
- `narrow` (Narrow column): The hero below 30rem, as in a record page's sidebar: the records become tiles and New moves into the actions menu.
- `tiles` (Tiles): Tiles at any width with `variant="tiles"`, three across in a wide card, and a count of 6+ from `count` with `hasMore`.
- `empty` (No records): An empty `records` array with `count={0}` draws the header alone, with New, and no View All.
- `unavailable` (Unavailable): A list that couldn't load, from `records={null}`, with no count in the title while `count` is unknown.
- `loading` (Loading): With `loading` and no records yet, placeholder rows hold the table's shape and the card is busy.

## When to use

- On a record page, to list one kind of related record: an account's contacts, opportunities or cases, or a custom object's records. It's Lightning's Related List – Single.
- When people need the first few records, a way to add one (New) and a link to the full list (View All), not the whole list in place.
- In a page's main column as a table, in its sidebar as tiles, or as tiles anywhere when that's how the list is set up.

## When not to use

- For the full list, with sorting, filtering and loading more. Use Data table on its own page, which View All links to.
- For the record's own fields. That's the record's detail, not a related list.
- For a short list on a card that isn't records of one object. Compose Card with Item.

## Usage

```tsx
import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"
```

```tsx
<RelatedList
  title="Contacts"
  icon="standard:contact"
  records={contacts}
  columns={columns}
  actions={[{ value: "new", label: "New", ariaLabel: "New Contact" }]}
  onAction={() => setCreating(true)}
  rowActions={[
    { value: "edit", label: "Edit" },
    { value: "delete", label: "Delete" },
  ]}
  onRowAction={(action, contact) => handle(action.value, contact.id)}
/>
```

Columns are the data table's, built with `createDataTableColumnHelper`, so the View All page can use the same ones. Mark the name column `meta: { rowHeader: true }` and give it a `cell` that links the record. In tiles, that cell is the title and every other column is a label and its value.

Pass the related records the page layout shows, in its order. The block shows the first `limit`. Pass the count you know: `count` alone is exact, and `count` with `hasMore` reads "6+" when you only know there are more.

## Rules

- Pass `null` to `records` when they couldn't load, never `[]`: an empty array says there are none.
- Pass `count` only when you know it. Never pass the length of `records` as the count when you asked for a limited number.
- Pass amounts in one currency and set `currency` to match. A column's own `currencyCode` wins.
- Keep `columns` outside the component, or in `useMemo`, so the table keeps its columns between renders.
- Never pass `asChild` or `render`.

## API reference

### RelatedList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` |  | The related list's label, plural: "Contacts". Names the card. |
| `icon` | `IconName` |  | The related object's icon: "standard:contact". |
| `records` | `TRecord[] \| null` |  | The records to show, in order; the block shows the first `limit`. `null` when they couldn't load. |
| `columns` | `readonly ColumnDef<{ rowSortingFeature: TableFeature; rowSelectionFeature: TableFeature; columnSizingFeature: TableFeature; columnResizingFeature: TableFeature; dataTableFeature: TableFeature; sortedRowModel: (table: Table<any, any>) => () => RowModel<any, any>; columnMeta: DataTableColumnMeta; }, TRecord, unknown>[]` |  | The columns, from createDataTableColumnHelper. One is `meta.rowHeader`, and each has a text `header` or `meta.label`. |
| `count`? | `number \| null` |  | How many related records there are. Unknown (`undefined` or `null`) shows no count. |
| `hasMore`? | `boolean` | `false` | There are more than `count`, as a capped count says: shows "(6+)". |
| `limit`? | `number` | `6` | The most records shown. Default 6. |
| `href`? | `string` |  | The View All page. Links the title, and adds View All when there are records. |
| `variant`? | `"table" \| "tiles"` | `"table"` | "table" or "tiles", as Lightning's Related List Type. A table shows tiles below 30rem. Default "table". |
| `actions`? | `RelatedListAction[]` | `[]` | The list's actions. The first is a button and the rest are in a menu after it. |
| `onAction`? | `(action: RelatedListAction) => void` |  |  |
| `rowActions`? | `\| readonly DataTableRowAction[] \| ((record: TRecord) => readonly DataTableRowAction[])` |  | Each record's menu, or a function that returns a record's actions when its menu opens. |
| `onRowAction`? | `(action: DataTableRowAction, record: TRecord) => void` |  |  |
| `loading`? | `boolean` | `false` | Draws placeholders while the records load, or marks the list busy over the ones it has. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers and dates. Default "en-US". |
| `timeZone`? | `string` | `"UTC"` | An IANA time zone for date-times. Default "UTC". |
| `currency`? | `string` | `"USD"` | An ISO 4217 code for currency columns with no `currencyCode`. Default "USD". |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### IconName

```ts
type IconName = React.ComponentProps<typeof Icon>["name"]
```

### RelatedListRecord

A record in the list. Any other fields are the columns' to read.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` |  | The record's Id. |

### RelatedListAction

One of the list's actions, like New.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel`? | `string` |  | What a screen reader hears when the label alone is unclear: "New Contact". |
| `value` | `string` |  | Identifies the action in onRowAction: "edit", "delete". |
| `label` | `string` |  | The item's text. |
| `disabled`? | `boolean` |  | Shows the item but doesn't let it run. |

## SLDS mapping

- The card is `slds-card`. Its header is the related list's header: the object's icon, `slds-card__header-title` with `slds-card__header-link` around the title and count, and the actions as a button group.
- The table is the data table as Lightning's basic related list draws it: no selection, sorting or resizing, and a menu on each row.
- Each tile is `slds-tile` in a related list (`slds-card__tile`): the object's icon, `slds-tile__title`, and the other fields as `slds-list_horizontal` label and value pairs.
- View All is `slds-card__footer-action`.

Known gaps:

- Lightning's header is a page header with 16px of padding. This card's is `slds-card__header`, 4px shorter.
- Lightning's View All is the whole footer, at regular weight. This one is a link button in the middle of the footer.
- Lightning's Enhanced List (row numbers, selection, sorting and a list view status line) isn't drawn. Link to a list view for that.
- The text the block adds ("Show actions for …", "Show more actions for …", "View All", "… aren't available.") is English.

## Accessibility

- The card is a region named by `title`. The title is a level 2 heading, and its link says the count: "Contacts (2)".
- Give an action whose label needs the object an `ariaLabel`: New is heard as "New Contact".
- The header's menu is "Show more actions for Contacts", or "Show actions for Contacts" where it holds every action. Each record's menu is "Show actions for" its name.
- Tiles are a list, each title a level 3 heading. View All is heard as "View All Contacts".
- While `loading`, the card is busy and its placeholders are hidden from screen readers.
- In Lightning Blue, a link in a row whose menu is open is 4.17:1, below WCAG AA's 4.5:1. SLDS's own stylesheet does the same on a hovered row.

## Responsive behavior

- The card takes its width from its container. Below 30rem of its own width, a table shows tiles instead, one per row, and the actions fold into one menu.
- With `variant="tiles"`, tiles go two across from 36rem and three from 54rem.
- In a table, columns share the width and clip with an ellipsis. In a tile, each label takes 30% and its value the rest, clipped too.

## Example code

### Contacts

Edge Communications' contacts with New, a menu on each row and View All. The name column's `cell` links each contact.

```tsx
"use client"

import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"
import {
  edgeContacts,
  type Contact,
} from "@/components/wisty/related-list-data"

const col = createDataTableColumnHelper<Contact>()
const columns = col.columns([
  col.accessor("name", {
    header: "Contact Name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a
        href={row.original.href}
        className="text-link hover:underline focus-visible:underline"
      >
        {getValue()}
      </a>
    ),
  }),
  col.accessor("title", { header: "Title" }),
  col.accessor("email", { header: "Email", meta: { type: "email" } }),
  col.accessor("phone", { header: "Phone", meta: { type: "phone" } }),
])

export default function RelatedListDefault() {
  return (
    <RelatedList
      title="Contacts"
      icon="standard:contact"
      records={edgeContacts}
      columns={columns}
      count={2}
      href="/accounts/001Dn00000EdgeCOM/contacts"
      actions={[{ value: "new", label: "New", ariaLabel: "New Contact" }]}
      rowActions={[
        { value: "edit", label: "Edit" },
        { value: "delete", label: "Delete" },
      ]}
      className="w-full"
    />
  )
}
```

### Opportunities

Currency and date columns formatted in the list's `currency` and `locale`, and `rowActions` as a function that disables Delete on closed deals.

```tsx
"use client"

import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"
import {
  edgeOpportunities,
  type Opportunity,
} from "@/components/wisty/related-list-data"

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity Name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a
        href={row.original.href}
        className="text-link hover:underline focus-visible:underline"
      >
        {getValue()}
      </a>
    ),
  }),
  col.accessor("stage", { header: "Stage" }),
  col.accessor("amount", { header: "Amount", meta: { type: "currency" } }),
  col.accessor("closeDate", { header: "Close Date", meta: { type: "date" } }),
])

const actionsFor = (opportunity: Opportunity) => [
  { value: "edit", label: "Edit" },
  {
    value: "delete",
    label: "Delete",
    disabled: opportunity.stage === "Closed Won",
  },
]

export default function RelatedListOpportunities() {
  return (
    <RelatedList
      title="Opportunities"
      icon="standard:opportunity"
      records={edgeOpportunities}
      columns={columns}
      count={3}
      href="/accounts/001Dn00000EdgeCOM/opportunities"
      actions={[{ value: "new", label: "New", ariaLabel: "New Opportunity" }]}
      rowActions={actionsFor}
      currency="USD"
      locale="en-US"
      className="w-full"
    />
  )
}
```

### Narrow column

The hero below 30rem, as in a record page's sidebar: the records become tiles and New moves into the actions menu.

```tsx
"use client"

import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"
import {
  relatedListFixture,
  type Contact,
} from "@/components/wisty/related-list-data"

const col = createDataTableColumnHelper<Contact>()
const columns = col.columns([
  col.accessor("name", {
    header: "Contact Name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a
        href={row.original.href}
        className="text-link hover:underline focus-visible:underline"
      >
        {getValue()}
      </a>
    ),
  }),
  col.accessor("title", { header: "Title" }),
  col.accessor("email", { header: "Email", meta: { type: "email" } }),
  col.accessor("phone", { header: "Phone", meta: { type: "phone" } }),
])

export default function RelatedListNarrow() {
  return (
    <RelatedList
      {...relatedListFixture}
      columns={columns}
      className="w-full max-w-sm"
    />
  )
}
```

### Tiles

Tiles at any width with `variant="tiles"`, three across in a wide card, and a count of 6+ from `count` with `hasMore`.

```tsx
"use client"

import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"
import {
  newContact,
  unitedOilContacts,
  type Contact,
} from "@/components/wisty/related-list-data"

const col = createDataTableColumnHelper<Contact>()
const columns = col.columns([
  col.accessor("name", {
    header: "Contact Name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a
        href={row.original.href}
        className="text-link hover:underline focus-visible:underline"
      >
        {getValue()}
      </a>
    ),
  }),
  col.accessor("title", { header: "Title" }),
  col.accessor("email", { header: "Email", meta: { type: "email" } }),
])

export default function RelatedListTiles() {
  return (
    <RelatedList
      variant="tiles"
      title="Contacts"
      icon="standard:contact"
      records={unitedOilContacts}
      columns={columns}
      count={6}
      hasMore
      href="/accounts/001Dn00000UogCOM/contacts"
      actions={[newContact]}
      rowActions={[
        { value: "edit", label: "Edit" },
        { value: "delete", label: "Delete" },
      ]}
      locale="en-US"
      className="w-full"
    />
  )
}
```

### No records

An empty `records` array with `count={0}` draws the header alone, with New, and no View All.

```tsx
"use client"

import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"

type Case = { id: string; caseNumber: string; subject: string }

const col = createDataTableColumnHelper<Case>()
const columns = col.columns([
  col.accessor("caseNumber", {
    header: "Case Number",
    meta: { rowHeader: true },
  }),
  col.accessor("subject", { header: "Subject" }),
])

export default function RelatedListEmpty() {
  return (
    <RelatedList
      title="Cases"
      icon="standard:case"
      records={[]}
      columns={columns}
      count={0}
      href="/accounts/001Dn00000EdgeCOM/cases"
      actions={[{ value: "new", label: "New", ariaLabel: "New Case" }]}
      className="w-full"
    />
  )
}
```

### Unavailable

A list that couldn't load, from `records={null}`, with no count in the title while `count` is unknown.

```tsx
"use client"

import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"
import type { Opportunity } from "@/components/wisty/related-list-data"

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity Name",
    meta: { rowHeader: true },
  }),
  col.accessor("stage", { header: "Stage" }),
])

export default function RelatedListUnavailable() {
  return (
    <RelatedList
      title="Opportunities"
      icon="standard:opportunity"
      records={null}
      columns={columns}
      href="/accounts/001Dn00000EdgeCOM/opportunities"
      actions={[{ value: "new", label: "New", ariaLabel: "New Opportunity" }]}
      className="w-full"
    />
  )
}
```

### Loading

With `loading` and no records yet, placeholder rows hold the table's shape and the card is busy.

```tsx
"use client"

import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { RelatedList } from "@/components/wisty/related-list"
import type { Contact } from "@/components/wisty/related-list-data"

const col = createDataTableColumnHelper<Contact>()
const columns = col.columns([
  col.accessor("name", { header: "Contact Name", meta: { rowHeader: true } }),
  col.accessor("title", { header: "Title" }),
  col.accessor("email", { header: "Email", meta: { type: "email" } }),
  col.accessor("phone", { header: "Phone", meta: { type: "phone" } }),
])

export default function RelatedListLoading() {
  return (
    <RelatedList
      loading
      title="Contacts"
      icon="standard:contact"
      records={null}
      columns={columns}
      href="/accounts/001Dn00000EdgeCOM/contacts"
      actions={[{ value: "new", label: "New", ariaLabel: "New Contact" }]}
      className="w-full"
    />
  )
}
```
