# Data table

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/data-table](https://ui.wisty.ai/data-table) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows records in a table that sorts, selects, runs row actions and loads more. Formats typed columns: currency, percent, dates, links, addresses.

```bash
npx shadcn@latest add @wisty/data-table
```

## Examples

- `default` (Opportunities): Linked names as row headers with `meta.rowHeader`, typed dates and amounts, checkboxes from `enableRowSelection` and a menu per row from `rowActions`.
- `sorting` (Sorting): Sorted by amount, highest first, with `initialState.sorting` and the empty amount last, and a click on a header sorts by it.
- `selection` (Selection): Shift ranges and select all, capped at three rows by `maxRowSelection`, closed opportunities disabled by `enableRowSelection`, and a Delete button.
- `row-numbers` (Row numbers): A number before each row's checkbox from `showRowNumberColumn`, counting rows in the order shown, so sorting renumbers them.
- `single-selection` (Single selection): Radios for picking one contact, with no select all, set with `maxRowSelection: 1`.
- `row-actions` (Row actions): A `rowActions` function builds each row's menu when it opens, with Delete disabled on closed opportunities, and `onRowAction` handles the choice.
- `column-types` (Column types): Every `meta.type`, time included, with an amount's code from `currencyDisplay`, a short `dateStyle` and a URL as its `linkLabel` in a new tab.
- `wrap-and-clip` (Wrap and clip): Long text clipped with a title, or wrapped to three lines with `meta.wrapText`, switched from header menus built with `meta.headerActions`.
- `resizing` (Resizing): Resizing within `minSize` and `maxSize`, an amount fixed by `enableResizing: false`, and widths the page keeps in `state.columnSizing` and resets.
- `loading-and-empty` (Loading and empty): Placeholder rows from `isLoading` while the first page loads, and the page's own words in `empty` when nothing matches.
- `load-more` (Load more): Five opportunities and a Load more button for the next five, from `hasNextPage` and `onLoadMore`, keeping the selection.
- `load-on-scroll` (Load on scroll): A table with a height that scrolls under its header and, with `loadMoreOnScroll`, loads the next page as its last rows come into view.
- `virtualized` (Virtualized): 10,000 rows with selection and row menus, rendering only the rows in view with `virtualize`.

## When to use

- People read, sort and act on a list of records, like a list view of opportunities or a related list of contacts.
- People select rows for a bulk action, like deleting or reassigning several records, or each row has its own actions, like Edit and Delete.
- Values are Salesforce field types: currency, percent, numbers, dates, date-times, times of day, relative times, URLs, emails, phone numbers, checkboxes, addresses and names. Set `meta.type` and the table formats, aligns and sorts them.
- A column needs its own format, like a currency's code, a precise percent, a short date or a URL shown as a label in a new tab, as `lightning-datatable`'s `typeAttributes` set it.
- The records come in pages, like a GraphQL query with a cursor. The table shows Load more, or loads on scroll.
- The list runs to hundreds or thousands of rows. Give the table a height and pass `virtualize`.
- It's the table `lightning-datatable` draws: Salesforce's column types, resizable columns, row actions, loading more and virtualization.

## When not to use

- The data is a few read-only rows that don't sort or select, like a summary in a card. Use Table, which is plain markup.
- People edit cells in place or move between cells with the arrow keys. The data table doesn't do either yet. Inline edit and grid keyboard navigation are planned.
- People filter, hide, pin or group columns. Put filters in your own toolbar above the table and filter `data` yourself. The table has no column visibility, pinning or grouping.
- People page through numbered pages. Salesforce tables load more instead of paging, so there are no page controls. If you need them, put Pagination below the table and pass one page as `data`.
- The rows are a tree. The data table has no nested rows.

## Usage

The page owns the table. Call `useDataTable` in a client component, with columns built by `createDataTableColumnHelper`, and render `<DataTable table={table} />`. The page reads the selection and handles the actions from the same `table`, so its own buttons sit beside the table, as the Selection and Row actions examples show.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"
```

```tsx
type Opportunity = { id: string; name: string; amount: number | null }

// Outside the component, so the columns keep their identity.
const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("amount", { header: "Amount", meta: { type: "currency" } }),
])

export function OpportunitiesTable({
  opportunities,
}: {
  opportunities: Opportunity[]
}) {
  const table = useDataTable({
    columns,
    data: opportunities,
    getRowId: (row) => row.id,
  })
  return <DataTable table={table} aria-label="Opportunities" />
}
```

Columns are TanStack Table column definitions; `meta` takes the data table's own keys, listed in the API reference. Sorting, selection and column widths are TanStack state: pass `initialState` to start sorted or sized, or `state` with its change callback to control them (the Sorting and Resizing examples). A callback alone works too: the table keeps the state and calls you after each change.

Salesforce's GraphQL API returns fields as `{ value, displayValue }`. Read `.value` with a `meta.type`, so the table formats and sorts the raw value, as an accessor function with an `id`:

```tsx
col.accessor((row) => row.Amount.value, {
  id: "Amount",
  header: "Amount",
  meta: { type: "currency", currencyCode: "EUR" },
})
```

A column's `meta` also takes Output field's format and link keys, so a column reads as a record's field of the same type. The cell's title and the sort keep the value:

```tsx
col.accessor("website", {
  header: "Website",
  meta: { type: "url", linkLabel: "Visit site", linkTarget: "_blank" },
})
```

A label that differs by row, like each account's name on its website, is a custom `cell` that draws `OutputFieldCompactValue` from `@/components/wisty/output-field`:

```tsx
col.accessor("website", {
  header: "Website",
  meta: { type: "url" },
  cell: ({ row, getValue }) => (
    <OutputFieldCompactValue
      type="url"
      value={getValue()}
      linkLabel={row.original.name}
      linkTarget="_blank"
    />
  ),
})
```

`showRowNumberColumn` numbers the rows before the checkboxes, as list views do. The numbers count the rows shown, so sorting or filtering `data` renumbers them from 1. When `data` is one page of a longer list, like the third page of ten, pass the rows before it as `rowNumberOffset` and the first row reads 21.

To sort on the server, pass `manualSorting` and an `onSortingChange` that fetches; the state carries each column's `id`, like `[{ id: "Amount", desc: true }]`. To add your own `meta` keys, merge into `DataTableColumnMeta` with `declare module "@/components/wisty/data-table"`.

## Rules

- Call `table.resetRowSelection()` after a bulk delete removes selected rows. The table keeps the ids of rows that leave `data`, so a selection survives a refetch or a new page.
- Give the table a height before passing `virtualize` or `loadMoreOnScroll`.
- Select all covers the rows that are loaded, never every record on the server. A bulk action on the selection reaches only those.
- A `time` column's values are times of day, like `"09:30:00.000Z"`, and sort by the clock. An amount past 15 digits shows every digit when it's a decimal string, but two that differ only past the 15th may sort as equal.
- A `relative` column ("3 hours ago") counts from `now`, an ISO instant. Pass it when the page renders on the server, or the current time is read at render and the server and the browser can differ.
- An `address` value is `{ street, city, state, postalCode, country }` and a `name` value is `{ salutation, firstName, middleName, lastName, suffix }`. A cell shows either on one line ("312 Constitution Place, Austin, TX 78767, USA"), sorts by that text, and treats one with no parts as empty. A `relative` value is an instant and sorts by it; its date and time are in the cell's title and read after the text.
- Set `enableResizing: false` on a column that must keep its `size`. To keep widths across visits, save them with `onColumnSizingChange`. Restore widths from the server through `initialState.columnSizing`; read widths from `localStorage` only after the page hydrates, and pass them through `state.columnSizing`.
- Don't add `rowNumber`, `select` or `actions` columns; the table adds them, and a column of yours with one of those ids replaces it. Don't put buttons in `header`; use `meta.headerActions`.
- Never pass `asChild` or `render`.

## API reference

### DataTable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `table` | `DataTableInstance<TData, any>` |  | The table from useDataTable. |
| `isLoading`? | `boolean` | `false` | A first load: placeholder rows while there are none. |
| `hasNextPage`? | `boolean` | `false` | More rows can load: shows Load more, or loads on scroll. |
| `isFetchingNextPage`? | `boolean` | `false` | A next page is loading. |
| `onLoadMore`? | `() => void` |  | Loads the next page. The page appends its rows to data. |
| `loadMoreOnScroll`? | `boolean` | `false` | Loads the next page on scroll instead of with the button, which stays as a retry. |
| `virtualize`? | `boolean \| { overscan?: number; estimateRowHeight?: number }` | `false` | Renders only the rows in view. Needs a height on DataTable. |
| `empty`? | `React.ReactNode` |  | What the table shows when it has no rows. |

Also takes every [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table) prop.

### useDataTable

| Parameter | Type | Default |
| --- | --- | --- |
| `options` | `UseDataTableOptions<TData>` |  |
| `selector`? | `(state: TableState<Features>) => TSelected` |  |

Returns `DataTableInstance<TData, TSelected>`.

### createDataTableColumnHelper

Returns `DataTableColumnHelper<TData>`.

### DataTableColumnType

```ts
type DataTableColumnType = OutputFieldType
```

### DataTableRowAction

An item in a row's actions menu.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Identifies the action in onRowAction: "edit", "delete". |
| `label` | `string` |  | The item's text. |
| `disabled`? | `boolean` |  | Shows the item but doesn't let it run. |

### DataTableHeaderAction

An item in a column header's actions menu.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Identifies the action in onHeaderAction: "wrap", "clip". |
| `label` | `string` |  | The item's text. |
| `disabled`? | `boolean` |  | Shows the item but doesn't let it run. |
| `checked`? | `boolean` |  | Shows a check before the label when true, and room for one when false. |

### DataTableColumnMeta

What a column's `meta` takes. To add your own keys, edit this interface, or merge into it with `declare module "@/components/wisty/data-table"`.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `type`? | `DataTableColumnType` |  | How values format, align and sort. Defaults to "text". |
| `currencyCode`? | `string` |  | ISO 4217 code for "currency" columns. Defaults to "USD". |
| `label`? | `string` |  | The column's name in menus and announcements when `header` is a function. |
| `rowHeader`? | `boolean` |  | Renders cells as row headers (`<th scope="row">`), which name each row. |
| `wrapText`? | `boolean` |  | Wraps long values instead of clipping them. |
| `wrapTextMaxLines`? | `number` |  | With wrapText, the lines a cell shows before it clips. |
| `align`? | `"start" \| "center" \| "end"` |  | Overrides the type's alignment. Numbers align to the end. |
| `headerClassName`? | `string` |  | Classes on the column's header cell. |
| `cellClassName`? | `string` |  | Classes on the column's body cells. |
| `headerActions`? | `readonly DataTableHeaderAction[]` |  | An actions menu in the column header, handled by onHeaderAction. |
| `fractionDigits`? | `number` |  | Digits after the decimal point, a field's scale, as both the fewest and the most. Unset, Intl's default. |
| `minimumFractionDigits`? | `number` |  | The fewest digits after the decimal point, over fractionDigits. |
| `maximumFractionDigits`? | `number` |  | The most digits after the decimal point, over fractionDigits; under the minimum, it reads as the minimum. |
| `currencyDisplay`? | `"symbol" \| "code" \| "name"` |  | A currency as its symbol ("$"), its code ("USD") or its name ("US dollars"). Defaults to "symbol". |
| `dateStyle`? | `OutputFieldDateStyle` |  | The day's style in "date" and "datetime" values. Defaults to "medium": "Jun 18, 2026". |
| `timeStyle`? | `OutputFieldDateStyle` |  | The time's style in "datetime" and "time" values. Defaults to "short": "3:30 PM". |
| `hour12`? | `boolean` |  | true for a 12-hour clock, false for 24 hours. Unset, the locale's own clock. |
| `timeZoneName`? | `"short" \| "long"` |  | The zone's name after a "datetime" value, "EDT" or "Eastern Daylight Time". Unset, none. |
| `linkLabel`? | `string` |  | Words the link shows instead of the value, like "Visit website". The value stays its address. |
| `linkTarget`? | `"_blank" \| "_self" \| "_parent" \| "_top"` |  | Where the link opens; "_blank" adds rel="noopener noreferrer". Defaults to the same tab. |
| `linkTitle`? | `string` |  | The link's hover text. |

### Features

| Member | Type | Default |
| --- | --- | --- |
| `rowSortingFeature` | `TableFeature` |  |
| `rowSelectionFeature` | `TableFeature` |  |
| `columnSizingFeature` | `TableFeature` |  |
| `columnResizingFeature` | `TableFeature` |  |
| `dataTableFeature` | `TableFeature` |  |
| `sortedRowModel` | `(table: Table<any, any>) => () => RowModel<any, any>` |  |
| `columnMeta` | `DataTableColumnMeta` |  |

### DataTableRow

```ts
type DataTableRow<TData extends RowData> = Row<Features, TData>
```

### DataTableColumn

```ts
type DataTableColumn<TData extends RowData> = Column<Features, TData, unknown>
```

### DataTableColumnDef

```ts
type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  Features,
  TData,
  TValue
>
```

### DataTableInstance

```ts
type DataTableInstance<
  TData extends RowData,
  TSelected = TableState<Features>,
> = ReactTable<Features, TData, TSelected>
```

### DataTableColumnHelper

TanStack's column helper for this table, except that a column with an accessor function needs an `id`: it's the id the sorting state carries.

```ts
type DataTableColumnHelper<TData extends RowData> = Omit<
  ColumnHelper<Features, TData>,
  "accessor"
> & {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends (TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never),
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? DisplayColumnDef<Features, TData, TValue> & { id: string }
      : IdentifiedColumnDef<Features, TData, TValue>
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<Features, TData, TValue>
    : AccessorKeyColumnDef<Features, TData, TValue>
}
```

### UseDataTableOptions

```ts
type UseDataTableOptions<TData extends RowData> = Omit<
  TableOptions<Features, TData>,
  "features" | "getRowId"
> & {
  getRowId: (
    originalRow: TData,
    index: number,
    parent?: DataTableRow<TData>
  ) => string
}
```

## SLDS mapping

`DataTable` is the SLDS table as `lightning-datatable` renders it, on Table, with no cell buffer. Row headers are `th scope="row"`, and cells that don't wrap clip with `slds-truncate`. The row number column is `lightning-datatable`'s, each number `slds-row-number` in small, weak text. The select column holds Checkbox, and the actions button opens Dropdown Menu. The on-scroll spinner is SLDS's small spinner. SLDS has no Load more button or placeholder rows: Load more is `slds-button_neutral`, and placeholder rows are Skeleton.

Known gaps:

- No grid: the table isn't `role="grid"` and has no arrow keys between cells. Every control is a tab stop.
- A resize's guide line stops at the bottom of the visible rows. SLDS draws it 100vh tall.
- After a resize, widths stay in pixels when the container changes size, so the table scrolls sideways or leaves space at its end. `lightning-datatable` scales the columns to fit again.
- Wrap text and Clip text aren't built into header menus, as `lightning-datatable` adds them. The Wrap and clip example builds them with `meta.headerActions`.
- The arrow, chevrons and check are lucide's, where SLDS draws `utility:arrowdown`, `utility:down` and `utility:check`.
- The text the table adds ("Row Number", "Select all rows", "Choose a row to select", "Select …", "Show actions for …", "Show … column actions", "Sorted by …", "No items to display.", "Load more", "Loading") is English.

## Keyboard interactions

| Keys                     | Action                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Space                    | On a checkbox, selects or clears its row. On select all, selects every loaded row, or clears them.         |
| Shift+Space, Shift+click | On a row's checkbox, selects or clears every row from the last one you checked, rows out of view included. |
| Up Arrow, Down Arrow     | On a radio, selects the row above or below.                                                                |
| Enter, Space             | On a sort button, sorts by the column, then reverses it. On an actions button, opens its menu.             |
| Arrow keys               | On a column divider, widen or narrow the column by 10px. Left widens in a right-to-left table.             |
| Page Up, Page Down       | On a column divider, widen or narrow the column by 100px.                                                  |
| Home, End                | On a column divider, make the column its narrowest or widest.                                              |
| Escape                   | While you drag a divider, or move one after clicking it, puts the column back.                             |

Tab moves through select all, each sort button, header menu button and column divider, then each row's checkbox, links and actions button. With `virtualize`, the focused row and its neighbours stay rendered, so Tab continues in order after you scroll away, and a row stays while its menu is open. Menus take Dropdown Menu's keys.

## Accessibility

- Name the table with `aria-label` or `aria-labelledby` on `DataTable`.
- Mark the name column `meta.rowHeader`, or pass `getRowLabel`. Its value names each row's controls: "Select Acme", "Show actions for Acme". Without one, they name the row by its position: "Select row 1".
- Give a column whose `header` is a function a `meta.label`. It names the sort button, the header menu, the resize slider and the sort announcement.
- Sortable headers carry `aria-sort`, and a polite live region says the new sort, like "Sorted by Amount, ascending". Each column divider is a slider named "Amount column width" whose value reads "180 pixels".
- The table has `aria-busy` while `isLoading` or `isFetchingNextPage`; placeholder rows are hidden from screen readers. A virtualized table carries `aria-rowcount` and `aria-rowindex`, but find in page and printing see only the rendered rows.
- In Lightning Blue, a link in a selected row is 4.17:1, below WCAG AA's 4.5:1. SLDS's own stylesheet does the same.

## Responsive behavior

- The table fills its container. Columns with a `size` keep it; the rest share what's left, at least their `minSize` each. When they don't fit, the table scrolls sideways inside its border.
- After a resize, every column keeps its width and the table is as wide as its columns.
- The row number column widens when the numbers reach three digits, so a number never clips.
- Values clip with an ellipsis and a title unless the column sets `wrapText`. Decide per column: names clip, descriptions wrap with `wrapTextMaxLines`.
- Without a height, the table grows with its rows. With one (`className="h-96"` or `max-h-[60vh]`), it scrolls inside itself under a header that stays in place.

## Performance

- Rows re-render only when their own data, the columns, the locale or their selection changes. Define `columns` outside the component, or in `useMemo`, or every row re-renders on every render.
- Sorting runs in the browser unless you pass `manualSorting`. 10,000 rows sort in about 150ms to 320ms in development builds.
- Without `virtualize`, every row renders. Use it from a few hundred rows: 10,000 rows keep about 30 in the page. Rendering all of 2,000 rows takes 1.5s to 5s in development builds.
- A resize re-renders no rows: the width changes on the table's columns directly, and the page re-renders only as the drag starts and ends. With `columnResizeMode: "onChange"`, `columnSizing` and the page update on every frame instead.

## Example code

### Opportunities

Linked names as row headers with `meta.rowHeader`, typed dates and amounts, checkboxes from `enableRowSelection` and a menu per row from `rowActions`.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  closeDate: string
  stage: string
  amount: number
}

const opportunities: Opportunity[] = [
  {
    id: "006A",
    name: "Acme - 1,200 Widgets",
    closeDate: "2026-11-14",
    stage: "Value Proposition",
    amount: 140000,
  },
  {
    id: "006B",
    name: "Burlington Textiles Weaving Plant Generator",
    closeDate: "2026-10-30",
    stage: "Closed Won",
    amount: 235000,
  },
  {
    id: "006C",
    name: "Dickenson Mobile Generators",
    closeDate: "2026-12-05",
    stage: "Qualification",
    amount: 15000,
  },
  {
    id: "006D",
    name: "Edge Emergency Generator",
    closeDate: "2027-01-18",
    stage: "Id. Decision Makers",
    amount: 75000,
  },
  {
    id: "006E",
    name: "GenePoint Lab Generators",
    closeDate: "2026-11-02",
    stage: "Prospecting",
    amount: 60000,
  },
]

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={`#${row.original.id}`} className="text-link hover:underline">
        {getValue()}
      </a>
    ),
  }),
  col.accessor("closeDate", {
    header: "Close date",
    size: 150,
    meta: { type: "date" },
  }),
  col.accessor("stage", { header: "Stage", size: 160 }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

const rowActions = [
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
]

export default function DataTableDefault() {
  const table = useDataTable({
    columns,
    data: opportunities,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    rowActions,
    locale: "en-US",
  })

  return <DataTable table={table} aria-label="Opportunities" />
}
```

### Sorting

Sorted by amount, highest first, with `initialState.sorting` and the empty amount last, and a click on a header sorts by it.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  account: string
  closeDate: string
  amount: number | null
}

const opportunities: Opportunity[] = [
  {
    id: "006A",
    name: "Acme - 1,200 Widgets",
    account: "Acme",
    closeDate: "2026-11-14",
    amount: 140000,
  },
  {
    id: "006B",
    name: "Burlington Textiles Weaving Plant Generator",
    account: "Burlington Textiles Corp of America",
    closeDate: "2026-10-30",
    amount: 235000,
  },
  {
    id: "006C",
    name: "Dickenson Mobile Generators",
    account: "Dickenson plc",
    closeDate: "2026-12-05",
    amount: null,
  },
  {
    id: "006D",
    name: "Edge Emergency Generator",
    account: "Edge Communications",
    closeDate: "2027-01-18",
    amount: 75000,
  },
  {
    id: "006E",
    name: "GenePoint Lab Generators",
    account: "GenePoint",
    closeDate: "2026-11-02",
    amount: 60000,
  },
]

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("account", { header: "Account name" }),
  col.accessor("closeDate", {
    header: "Close date",
    size: 150,
    meta: { type: "date" },
  }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

export default function DataTableSorting() {
  const table = useDataTable({
    columns,
    data: opportunities,
    getRowId: (row) => row.id,
    initialState: { sorting: [{ id: "amount", desc: true }] },
    locale: "en-US",
  })

  return <DataTable table={table} aria-label="Opportunities" />
}
```

### Selection

Shift ranges and select all, capped at three rows by `maxRowSelection`, closed opportunities disabled by `enableRowSelection`, and a Delete button.

```tsx
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  stage: string
  amount: number
}

const opportunities: Opportunity[] = [
  {
    id: "006A",
    name: "Acme - 1,200 Widgets",
    stage: "Value Proposition",
    amount: 140000,
  },
  {
    id: "006B",
    name: "Burlington Textiles Weaving Plant Generator",
    stage: "Closed Won",
    amount: 235000,
  },
  {
    id: "006C",
    name: "Dickenson Mobile Generators",
    stage: "Qualification",
    amount: 15000,
  },
  {
    id: "006D",
    name: "Edge Emergency Generator",
    stage: "Id. Decision Makers",
    amount: 75000,
  },
  {
    id: "006E",
    name: "GenePoint Lab Generators",
    stage: "Prospecting",
    amount: 60000,
  },
]

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("stage", { header: "Stage", size: 160 }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

export default function DataTableSelection() {
  const [data, setData] = useState(opportunities)
  const table = useDataTable({
    columns,
    data,
    getRowId: (row) => row.id,
    maxRowSelection: 3,
    enableRowSelection: (row) => row.original.stage !== "Closed Won",
    locale: "en-US",
  })
  const selected = table.getSelectedRowIds()

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">
          {selected.length} of 3 selected
        </span>
        <Button
          variant="outline"
          disabled={selected.length === 0}
          onClick={() => {
            setData((rows) => rows.filter((row) => !selected.includes(row.id)))
            table.resetRowSelection()
          }}
        >
          Delete
        </Button>
      </div>
      <DataTable table={table} aria-label="Opportunities" />
    </div>
  )
}
```

### Row numbers

A number before each row's checkbox from `showRowNumberColumn`, counting rows in the order shown, so sorting renumbers them.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  account: string
  closeDate: string
  amount: number
}

const opportunities: Opportunity[] = [
  {
    id: "006A",
    name: "Burlington Textiles Weaving Plant Generator",
    account: "Burlington Textiles Corp of America",
    closeDate: "2026-10-30",
    amount: 235000,
  },
  {
    id: "006B",
    name: "Dickenson Mobile Generators",
    account: "Dickenson plc",
    closeDate: "2026-12-05",
    amount: 15000,
  },
  {
    id: "006C",
    name: "Edge Emergency Generator",
    account: "Edge Communications",
    closeDate: "2027-01-18",
    amount: 75000,
  },
  {
    id: "006D",
    name: "Express Logistics Standby Generator",
    account: "Express Logistics and Transport",
    closeDate: "2026-11-21",
    amount: 220000,
  },
  {
    id: "006E",
    name: "GenePoint Lab Generators",
    account: "GenePoint",
    closeDate: "2026-11-02",
    amount: 60000,
  },
  {
    id: "006F",
    name: "Grand Hotels Kitchen Generator",
    account: "Grand Hotels & Resorts Ltd",
    closeDate: "2026-12-12",
    amount: 15000,
  },
  {
    id: "006G",
    name: "Pyramid Emergency Generators",
    account: "Pyramid Construction Inc.",
    closeDate: "2027-02-03",
    amount: 100000,
  },
  {
    id: "006H",
    name: "United Oil Installations",
    account: "United Oil & Gas Corp.",
    closeDate: "2026-11-09",
    amount: 270000,
  },
  {
    id: "006I",
    name: "University of AZ Portable Generators",
    account: "University of Arizona",
    closeDate: "2027-01-07",
    amount: 50000,
  },
  {
    id: "006J",
    name: "sForce SLA",
    account: "sForce",
    closeDate: "2026-12-19",
    amount: 120000,
  },
]

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("account", { header: "Account name" }),
  col.accessor("closeDate", {
    header: "Close date",
    size: 150,
    meta: { type: "date" },
  }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

export default function DataTableRowNumbers() {
  const table = useDataTable({
    columns,
    data: opportunities,
    getRowId: (row) => row.id,
    showRowNumberColumn: true,
    enableRowSelection: true,
    locale: "en-US",
  })

  return <DataTable table={table} aria-label="Opportunities" />
}
```

### Single selection

Radios for picking one contact, with no select all, set with `maxRowSelection: 1`.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Contact = {
  id: string
  name: string
  title: string
  email: string
}

const contacts: Contact[] = [
  {
    id: "003A",
    name: "Rose Gonzalez",
    title: "SVP, Procurement",
    email: "rose@edge.example",
  },
  {
    id: "003B",
    name: "Sean Forbes",
    title: "CFO",
    email: "sean@edge.example",
  },
  {
    id: "003C",
    name: "Jack Rogers",
    title: "VP, Facilities",
    email: "jrogers@burlington.example",
  },
  {
    id: "003D",
    name: "Pat Stumuller",
    title: "SVP, Administration and Finance",
    email: "pat@pyramid.example",
  },
]

const col = createDataTableColumnHelper<Contact>()
const columns = col.columns([
  col.accessor("name", {
    header: "Name",
    size: 160,
    meta: { rowHeader: true },
  }),
  col.accessor("title", { header: "Title" }),
  col.accessor("email", { header: "Email", meta: { type: "email" } }),
])

export default function DataTableSingleSelection() {
  const table = useDataTable({
    columns,
    data: contacts,
    getRowId: (row) => row.id,
    maxRowSelection: 1,
    initialState: { rowSelection: { "003B": true } },
  })

  return <DataTable table={table} aria-label="Primary contact" />
}
```

### Row actions

A `rowActions` function builds each row's menu when it opens, with Delete disabled on closed opportunities, and `onRowAction` handles the choice.

```tsx
"use client"

import { useState } from "react"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
  type DataTableRow,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  stage: string
  amount: number
}

const opportunities: Opportunity[] = [
  {
    id: "006A",
    name: "Acme - 1,200 Widgets",
    stage: "Value Proposition",
    amount: 140000,
  },
  {
    id: "006B",
    name: "Burlington Textiles Weaving Plant Generator",
    stage: "Closed Won",
    amount: 235000,
  },
  {
    id: "006C",
    name: "Dickenson Mobile Generators",
    stage: "Qualification",
    amount: 15000,
  },
  {
    id: "006D",
    name: "Edge Emergency Generator",
    stage: "Id. Decision Makers",
    amount: 75000,
  },
]

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("stage", { header: "Stage", size: 160 }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

const actionsFor = (row: DataTableRow<Opportunity>) => [
  { value: "edit", label: "Edit" },
  {
    value: "delete",
    label: "Delete",
    disabled: row.original.stage === "Closed Won",
  },
]

export default function DataTableRowActions() {
  const [data, setData] = useState(opportunities)
  const table = useDataTable({
    columns,
    data,
    getRowId: (row) => row.id,
    rowActions: actionsFor,
    onRowAction: (action, row) => {
      if (action.value === "delete")
        setData((rows) => rows.filter((other) => other.id !== row.id))
    },
    locale: "en-US",
  })

  return <DataTable table={table} aria-label="Opportunities" />
}
```

### Column types

Every `meta.type`, time included, with an amount's code from `currencyDisplay`, a short `dateStyle` and a URL as its `linkLabel` in a new tab.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"
import type { OutputFieldAddress } from "@/components/wisty/output-field"

type Opportunity = {
  id: string
  name: string
  amount: number
  probability: number
  quantity: number | null
  closeDate: string
  createdDate: string
  lastModified: string
}

const opportunities: Opportunity[] = [
  {
    id: "006A",
    name: "Acme - 1,200 Widgets",
    amount: 140000,
    probability: 0.6,
    quantity: 1200,
    closeDate: "2026-11-14",
    createdDate: "2026-09-02T14:10:00Z",
    lastModified: "2026-10-13T12:00:00Z",
  },
  {
    id: "006D",
    name: "Edge Emergency Generator",
    amount: 75000.5,
    probability: 0.25,
    quantity: null,
    closeDate: "2027-01-18",
    createdDate: "2026-08-21T13:30:00Z",
    lastModified: "2026-10-12T14:00:00Z",
  },
]

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  website: string
  callTime: string | null
  mailingAddress: OutputFieldAddress | null
  primary: boolean
}

const contacts: Contact[] = [
  {
    id: "003A",
    name: "Rose Gonzalez",
    email: "rose@edge.example",
    phone: "5127579000",
    website: "https://edge.example",
    callTime: "09:30:00.000Z",
    mailingAddress: {
      street: "312 Constitution Place",
      city: "Austin",
      state: "TX",
      postalCode: "78767",
      country: "USA",
    },
    primary: true,
  },
  {
    id: "003C",
    name: "Jack Rogers",
    email: "jrogers@burlington.example",
    phone: "3362227000",
    website: "https://burlington.example",
    callTime: "14:00:00.000Z",
    mailingAddress: {
      street: "525 S. Lexington Ave",
      city: "Burlington",
      state: "NC",
      postalCode: "27215",
      country: "USA",
    },
    primary: false,
  },
]

const o = createDataTableColumnHelper<Opportunity>()
const opportunityColumns = o.columns([
  o.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  o.accessor("amount", {
    header: "Amount",
    size: 140,
    meta: { type: "currency", currencyDisplay: "code" },
  }),
  o.accessor("probability", {
    header: "Probability",
    size: 110,
    meta: { type: "percent" },
  }),
  o.accessor("quantity", {
    header: "Quantity",
    size: 100,
    meta: { type: "number" },
  }),
  o.accessor("closeDate", {
    header: "Close date",
    size: 110,
    meta: { type: "date", dateStyle: "short" },
  }),
  o.accessor("createdDate", {
    header: "Created date",
    size: 190,
    meta: { type: "datetime" },
  }),
  o.accessor("lastModified", {
    header: "Last modified",
    size: 130,
    meta: { type: "relative" },
  }),
])

const c = createDataTableColumnHelper<Contact>()
const contactColumns = c.columns([
  c.accessor("name", { header: "Name", size: 150, meta: { rowHeader: true } }),
  c.accessor("email", { header: "Email", meta: { type: "email" } }),
  c.accessor("phone", { header: "Phone", size: 130, meta: { type: "phone" } }),
  c.accessor("website", {
    header: "Website",
    size: 100,
    meta: { type: "url", linkLabel: "Visit site", linkTarget: "_blank" },
  }),
  c.accessor("callTime", {
    header: "Call time",
    size: 90,
    meta: { type: "time" },
  }),
  c.accessor("mailingAddress", {
    header: "Mailing address",
    size: 340,
    meta: { type: "address" },
  }),
  c.accessor("primary", {
    header: "Primary",
    size: 90,
    meta: { type: "boolean" },
  }),
])

export default function DataTableColumnTypes() {
  const opportunityTable = useDataTable({
    columns: opportunityColumns,
    data: opportunities,
    getRowId: (row) => row.id,
    locale: "en-US",
    timeZone: "America/New_York",
    now: "2026-10-13T15:00:00Z",
  })
  const contactTable = useDataTable({
    columns: contactColumns,
    data: contacts,
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex w-full flex-col gap-4">
      <DataTable table={opportunityTable} aria-label="Opportunities" />
      <DataTable table={contactTable} aria-label="Contacts" />
    </div>
  )
}
```

### Wrap and clip

Long text clipped with a title, or wrapped to three lines with `meta.wrapText`, switched from header menus built with `meta.headerActions`.

```tsx
"use client"

import { useMemo, useState } from "react"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Account = {
  id: string
  name: string
  description: string
  nextStep: string
}

const accounts: Account[] = [
  {
    id: "001A",
    name: "Burlington Textiles Corp of America",
    description:
      "Textile maker with plants in North Carolina and Georgia. Replacing its backup power across three weaving plants before the winter peak.",
    nextStep:
      "Send the revised quote for the third plant and confirm the install window with facilities.",
  },
  {
    id: "001B",
    name: "Edge Communications",
    description: "Regional carrier. Standby generators for two exchanges.",
    nextStep: "Site survey on Thursday.",
  },
  {
    id: "001C",
    name: "United Oil & Gas Corp.",
    description:
      "Refinery upgrade with a long approval chain.\nProcurement reviews every vendor each quarter.",
    nextStep:
      "Wait for procurement's review, then schedule a call with the plant manager and the CFO.",
  },
]

const col = createDataTableColumnHelper<Account>()

export default function DataTableWrapAndClip() {
  const [wrapped, setWrapped] = useState<Record<string, boolean>>({
    description: true,
  })

  const columns = useMemo(() => {
    const textActions = (id: string) => [
      { value: "wrap", label: "Wrap text", checked: Boolean(wrapped[id]) },
      { value: "clip", label: "Clip text", checked: !wrapped[id] },
    ]
    return col.columns([
      col.accessor("name", {
        header: "Account name",
        size: 160,
        meta: { rowHeader: true },
      }),
      col.accessor("description", {
        header: "Description",
        meta: {
          wrapText: wrapped.description,
          wrapTextMaxLines: 3,
          headerActions: textActions("description"),
        },
      }),
      col.accessor("nextStep", {
        header: "Next step",
        meta: {
          wrapText: wrapped.nextStep,
          wrapTextMaxLines: 3,
          headerActions: textActions("nextStep"),
        },
      }),
    ])
  }, [wrapped])

  const table = useDataTable({
    columns,
    data: accounts,
    getRowId: (row) => row.id,
    onHeaderAction: (action, column) =>
      setWrapped((current) => ({
        ...current,
        [column.id]: action.value === "wrap",
      })),
  })

  return <DataTable table={table} aria-label="Accounts" />
}
```

### Resizing

Resizing within `minSize` and `maxSize`, an amount fixed by `enableResizing: false`, and widths the page keeps in `state.columnSizing` and resets.

```tsx
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
  type ColumnSizingState,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  account: string
  stage: string
  amount: number
}

const opportunities: Opportunity[] = [
  {
    id: "006A",
    name: "Acme - 1,200 Widgets",
    account: "Acme",
    stage: "Value Proposition",
    amount: 140000,
  },
  {
    id: "006B",
    name: "Burlington Textiles Weaving Plant Generator",
    account: "Burlington Textiles Corp of America",
    stage: "Closed Won",
    amount: 235000,
  },
  {
    id: "006C",
    name: "Dickenson Mobile Generators",
    account: "Dickenson plc",
    stage: "Qualification",
    amount: 15000,
  },
  {
    id: "006D",
    name: "Edge Emergency Generator",
    account: "Edge Communications",
    stage: "Id. Decision Makers",
    amount: 75000,
  },
  {
    id: "006E",
    name: "GenePoint Lab Generators",
    account: "GenePoint",
    stage: "Prospecting",
    amount: 60000,
  },
]

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    minSize: 160,
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={`#${row.original.id}`} className="text-link hover:underline">
        {getValue()}
      </a>
    ),
  }),
  col.accessor("account", { header: "Account name" }),
  col.accessor("stage", { header: "Stage", size: 160, maxSize: 240 }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    enableResizing: false,
    meta: { type: "currency" },
  }),
])

export default function DataTableResizing() {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  const table = useDataTable({
    columns,
    data: opportunities,
    getRowId: (row) => row.id,
    state: { columnSizing },
    onColumnSizingChange: setColumnSizing,
    locale: "en-US",
  })

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-end">
        <Button
          variant="outline"
          disabled={Object.keys(columnSizing).length === 0}
          onClick={() => setColumnSizing({})}
        >
          Reset column widths
        </Button>
      </div>
      <DataTable table={table} aria-label="Opportunities" />
    </div>
  )
}
```

### Loading and empty

Placeholder rows from `isLoading` while the first page loads, and the page's own words in `empty` when nothing matches.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  stage: string
  amount: number
}

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("stage", { header: "Stage", size: 140 }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

const none: Opportunity[] = []

export default function DataTableLoadingAndEmpty() {
  const loading = useDataTable({
    columns,
    data: none,
    getRowId: (row) => row.id,
    enableRowSelection: true,
  })
  const empty = useDataTable({
    columns,
    data: none,
    getRowId: (row) => row.id,
    enableRowSelection: true,
  })

  return (
    <div className="flex w-full flex-col gap-4">
      <DataTable table={loading} aria-label="Opportunities" isLoading />
      <DataTable
        table={empty}
        aria-label="Search results"
        empty="No opportunities match your search."
      />
    </div>
  )
}
```

### Load more

Five opportunities and a Load more button for the next five, from `hasNextPage` and `onLoadMore`, keeping the selection.

```tsx
"use client"

import { useState } from "react"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  stage: string
  amount: number
}

const accounts = [
  "Acme",
  "Burlington Textiles",
  "Dickenson",
  "Edge Communications",
  "Express Logistics",
  "GenePoint",
  "Grand Hotels",
  "Pyramid Construction",
]
const stages = ["Prospecting", "Qualification", "Proposal", "Negotiation"]

const opportunity = (n: number): Opportunity => ({
  id: `006${String(n).padStart(3, "0")}`,
  name: `${accounts[n % accounts.length]} Generators ${n + 1}`,
  stage: stages[n % stages.length]!,
  amount: 10000 + ((n * 37000) % 250000),
})

const fetchPage = (offset: number) =>
  new Promise<Opportunity[]>((resolve) =>
    setTimeout(
      () =>
        resolve(
          Array.from({ length: 5 }, (_, index) => opportunity(offset + index))
        ),
      600
    )
  )

const total = 15
const firstPage = Array.from({ length: 5 }, (_, n) => opportunity(n))

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("stage", { header: "Stage", size: 140 }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

export default function DataTableLoadMore() {
  const [data, setData] = useState(firstPage)
  const [fetching, setFetching] = useState(false)
  const table = useDataTable({
    columns,
    data,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    locale: "en-US",
  })

  return (
    <DataTable
      table={table}
      aria-label="Opportunities"
      hasNextPage={data.length < total}
      isFetchingNextPage={fetching}
      onLoadMore={async () => {
        setFetching(true)
        const page = await fetchPage(data.length)
        setData((rows) => [...rows, ...page])
        setFetching(false)
      }}
    />
  )
}
```

### Load on scroll

A table with a height that scrolls under its header and, with `loadMoreOnScroll`, loads the next page as its last rows come into view.

```tsx
"use client"

import { useState } from "react"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  stage: string
  amount: number
}

const accounts = [
  "Acme",
  "Burlington Textiles",
  "Dickenson",
  "Edge Communications",
  "Express Logistics",
  "GenePoint",
  "Grand Hotels",
  "Pyramid Construction",
]
const stages = ["Prospecting", "Qualification", "Proposal", "Negotiation"]

const opportunity = (n: number): Opportunity => ({
  id: `006${String(n).padStart(3, "0")}`,
  name: `${accounts[n % accounts.length]} Generators ${n + 1}`,
  stage: stages[n % stages.length]!,
  amount: 10000 + ((n * 37000) % 250000),
})

const fetchPage = (offset: number) =>
  new Promise<Opportunity[]>((resolve) =>
    setTimeout(
      () =>
        resolve(
          Array.from({ length: 20 }, (_, index) => opportunity(offset + index))
        ),
      600
    )
  )

const total = 100
const firstPage = Array.from({ length: 20 }, (_, n) => opportunity(n))

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
  }),
  col.accessor("stage", { header: "Stage", size: 140 }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
])

export default function DataTableLoadOnScroll() {
  const [data, setData] = useState(firstPage)
  const [fetching, setFetching] = useState(false)
  const table = useDataTable({
    columns,
    data,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    locale: "en-US",
  })

  return (
    <DataTable
      table={table}
      aria-label="Opportunities"
      className="h-80 w-full"
      loadMoreOnScroll
      hasNextPage={data.length < total}
      isFetchingNextPage={fetching}
      onLoadMore={async () => {
        setFetching(true)
        const page = await fetchPage(data.length)
        setData((rows) => [...rows, ...page])
        setFetching(false)
      }}
    />
  )
}
```

### Virtualized

10,000 rows with selection and row menus, rendering only the rows in view with `virtualize`.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
  useDataTable,
  type DataTableRow,
} from "@/components/wisty/data-table"

type Opportunity = {
  id: string
  name: string
  account: string
  stage: string
  amount: number
  description: string
}

const accounts = [
  "Acme",
  "Burlington Textiles",
  "Dickenson",
  "Edge Communications",
  "Express Logistics",
  "GenePoint",
  "Grand Hotels",
  "Pyramid Construction",
  "United Oil & Gas",
  "University of Arizona",
]
const stages = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
]

const opportunities: Opportunity[] = Array.from({ length: 10_000 }, (_, n) => {
  const account = accounts[n % accounts.length]!
  return {
    id: `006${String(n).padStart(6, "0")}`,
    name: `${account} Generators ${n + 1}`,
    account,
    stage: stages[(n * 7) % stages.length]!,
    amount: 5000 + ((n * 7919) % 495000),
    description:
      n % 5 === 0
        ? `Backup power for ${account}: three sites, installed in phases over two quarters, with a service plan for each.`
        : "Standby generator.",
  }
})

const col = createDataTableColumnHelper<Opportunity>()
const columns = col.columns([
  col.accessor("name", {
    header: "Opportunity name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={`#${row.original.id}`} className="text-link hover:underline">
        {getValue()}
      </a>
    ),
  }),
  col.accessor("amount", {
    header: "Amount",
    size: 130,
    meta: { type: "currency" },
  }),
  col.accessor("description", {
    header: "Description",
    meta: { wrapText: true, wrapTextMaxLines: 3 },
  }),
])

const actionsFor = (row: DataTableRow<Opportunity>) => [
  { value: "edit", label: "Edit" },
  {
    value: "delete",
    label: "Delete",
    disabled: row.original.stage === "Closed Won",
  },
]

export default function DataTableVirtualized() {
  const table = useDataTable({
    columns,
    data: opportunities,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    rowActions: actionsFor,
    locale: "en-US",
  })

  return (
    <DataTable
      table={table}
      aria-label="Opportunities"
      className="h-96 w-full"
      virtualize
    />
  )
}
```
