# List view

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/list-view](https://ui.wisty.ai/list-view) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A list of records: list views, search and a table to sort and select. Lightning's object home, for a standard or custom object.

```bash
npx shadcn@latest add @wisty/list-view
```

## Examples

- `default` (All Accounts): The installed Accounts page: ten accounts and Load more, sortable columns, selection, a menu on each row and search over the loaded rows.
- `custom-object` (Custom object): Projects, a custom object, written out in full: its own icon, list views and columns, with a currency, a percent and empty values.
- `unavailable` (Unavailable): With `records` null, the count and the Updated time drop out and the table says so, where an empty array reads 0 items.

## When to use

- For an object's tab in an app, standard or custom: its records with Lightning's list view switcher, search, row numbers, sortable columns, selection and a menu on each row.
- When you want Lightning's object home as a page you own: the Accounts page installs as a file, and another object's page is the same lines with its own columns, icon and label.
- When the app reads the records, a page at a time or all at once, and passes them in as plain rows.

## When not to use

- For one record's page. Use Record page.
- For the header alone, over a list of your own. Use List view header.
- For a few related records on a record page. Use Related list.

## Usage

```tsx
import { DataTable } from "@/components/wisty/data-table"
import { ListView, useListView } from "@/components/wisty/list-view"
import { ListViewHeader } from "@/components/wisty/list-view-header"
```

```tsx
const list = useListView({
  records: cases,
  searchBy: ["caseNumber", "subject", "status"],
  columns,
  getRowId: (record) => record.id,
  loading,
})
```

```tsx
<ListView>
  <ListViewHeader
    icon="standard:case"
    objectLabel="Cases"
    views={views}
    itemCount={list.itemCount}
    sortedBy={list.sortedBy}
    search={list.search}
    onSearchChange={list.setSearch}
    loading={loading}
    joined
  />
  <DataTable
    table={list.table}
    aria-label="All Open Cases"
    isLoading={loading}
    empty={list.unavailable ? "Cases aren't available." : undefined}
  />
</ListView>
```

`ListView` is the frame: it joins a List view header to the Data table under it. `useListView` takes Data table's options with `records` in place of `data`, filters the records by the search over the `searchBy` fields, counts what's left, names the column the table sorts by, and tells rows that couldn't load from none. The Accounts page, `ListViewPage`, installs as `list-view-page.tsx`, the file you edit: swap its fixture import for the app's reads, and pass `onAction`, `onRowAction` and the handler of each list control the app supports. To search on the server, leave `searchBy` out, read `list.search` and pass the results in as `records`. To act on the selected rows, read `list.table.getSelectedRowIds()` beside the header's actions.

## Rules

- Pass `null` to `records` when the list couldn't load, never `[]`: an empty array says the list view has no records.
- Pass `loading` to `useListView` and `ListViewHeader`, and as `isLoading` to `DataTable`, while the first rows are read.
- While the app has read only some rows, pass `hasMoreItems` to the header and `hasNextPage` to the table. The count then reads "10+ items", and Load more asks for the rest.
- Selection outlives a search that hides selected rows. Act only on the selected rows the table shows, or call `list.table.resetRowSelection()` when the search changes.
- Pass `updated` as the page writes it, from the time the rows were read, and leave it out while `list.unavailable`. The page never reads the clock.
- Render one per page: the list view's name is the page's h1. Never pass `asChild` or `render`.

## API reference

### ListView

The frame that joins a list view header to the table under it.

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### useListView

Holds the list's search and derives its count, sort label and unavailable state from the app's rows.

| Parameter | Type | Default |
| --- | --- | --- |
| `options` | `UseListViewOptions<TRecord>` |  |

Returns `UseListViewResult<TRecord>`.

### UseListViewOptions

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `records` | `TRecord[] \| null` |  | The rows the app has read, or `null` when they couldn't load. |
| `searchBy`? | `readonly (keyof TRecord)[]` |  | The fields the search matches; leave it out to search on the server. |
| `loading`? | `boolean` |  | The first read: no count while it lasts, and never unavailable. |
| `getRowId` | `( originalRow: TData, index: number, parent?: DataTableRow<TData> ) => string` |  | A stable id per row, like a record id. Selection is kept by it. |
| `showRowNumberColumn`? | `boolean` |  | Adds a row number column first; the numbers follow the rows shown, so sorting renumbers them. |
| `rowNumberOffset`? | `number` |  | The rows before the first: with 10, the first row reads 11. Defaults to 0. |
| `maxRowSelection`? | `number` |  | Caps the selection in every kind of change; 1 renders radios. Implies enableRowSelection. |
| `getRowLabel`? | `(row: Row<TFeatures, TData>) => string` |  | Names a row in its labels, like "Select Acme". Defaults to the row header's value. |
| `rowActions`? | `\| readonly DataTableRowAction[] \| ((row: Row<TFeatures, TData>) => readonly DataTableRowAction[])` |  | The actions menu of each row, or a function that returns a row's actions when its menu opens. |
| `onRowAction`? | `(action: DataTableRowAction, row: Row<TFeatures, TData>) => void` |  | Called with the action picked from a row's menu. |
| `onHeaderAction`? | `( action: DataTableHeaderAction, column: Column<TFeatures, TData, unknown> ) => void` |  | Called with the action picked from a column header's menu. |
| `locale`? | `string` |  | A BCP 47 locale for numbers, dates and sorting text. Defaults to "en-US". |
| `timeZone`? | `string` |  | An IANA time zone for "datetime" values. Defaults to "UTC". |
| `now`? | `string \| number \| Date` |  | The instant "relative" values count from. Defaults to render time; pass one for a stable render. |

Also has every tanstack/table-core member.

### UseListViewResult

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `table` | `DataTableInstance<TRecord>` |  | The table for DataTable, over the rows the search leaves. |
| `search` | `string` |  | The search text, for ListViewHeader's `search`. |
| `setSearch` | `(search: string) => void` |  | Sets the search text, for ListViewHeader's `onSearchChange`. |
| `itemCount` | `number \| null` |  | How many rows the search leaves; `null` while loading or unavailable. |
| `sortedBy` | `string` |  | The label of the column sorted first, if any, for ListViewHeader's `sortedBy`. |
| `unavailable` | `boolean` |  | The rows couldn't load: `records` is `null` and nothing is loading. |

## SLDS mapping

The page is Lightning's object home: List view header (the page header's object home variant) joined to Data table in one frame, the way a list view draws its table under the header.

Known gaps:

- No kanban or split view: the page draws a table, so it passes no `onDisplayChange`, and Display as doesn't show.
- No inline edit in the cells, no list view charts and no filter panel.

## Responsive behavior

- The frame takes its container's width. The header's controls move under the meta line when they don't fit, and the table scrolls sideways in a narrow container.

## Example code

### All Accounts

The installed Accounts page: ten accounts and Load more, sortable columns, selection, a menu on each row and search over the loaded rows.

Installing List view writes these files. The example renders the first.

#### components/wisty/list-view-page.tsx

```tsx
"use client"

import { useState } from "react"

import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableRowAction,
} from "@/components/wisty/data-table"
import { ListView, useListView } from "@/components/wisty/list-view"
import {
  ListViewHeader,
  type ListViewHeaderAction,
} from "@/components/wisty/list-view-header"
import {
  listViewAccounts,
  listViewAccountViews,
  listViewRecentAccountViews,
  type ListViewAccount,
} from "@/components/wisty/list-view-data"

const col = createDataTableColumnHelper<ListViewAccount>()
const columns = col.columns([
  col.accessor("name", {
    header: "Account Name",
    minSize: 220,
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
  col.accessor("phone", {
    header: "Phone",
    size: 160,
    meta: { type: "phone" },
  }),
  col.accessor("type", { header: "Type", size: 170 }),
  col.accessor("owner", { header: "Account Owner", size: 150 }),
  col.accessor("lastModified", {
    header: "Last Modified Date",
    size: 210,
    meta: { type: "datetime" },
  }),
])

const actions: ListViewHeaderAction[] = [
  { value: "new", label: "New" },
  { value: "import", label: "Import" },
  { value: "printable-view", label: "Printable View" },
]

const rowActions: DataTableRowAction[] = [
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
]

/** The Accounts list view, over the sample org's accounts. */
function ListViewPage() {
  const [accounts, setAccounts] = useState(listViewAccounts.slice(0, 10))
  const [view, setView] = useState("AllAccounts")
  const hasMore = accounts.length < listViewAccounts.length
  const list = useListView({
    records: accounts,
    searchBy: ["name", "phone", "type", "owner"],
    columns,
    getRowId: (account) => account.id,
    initialState: { sorting: [{ id: "name", desc: false }] },
    showRowNumberColumn: true,
    enableRowSelection: true,
    rowActions,
    locale: "en-US",
    timeZone: "America/Chicago",
  })

  return (
    <ListView className="w-full">
      <ListViewHeader
        icon="standard:account"
        objectLabel="Accounts"
        views={listViewAccountViews}
        recentViews={listViewRecentAccountViews}
        view={view}
        onViewChange={setView}
        itemCount={list.itemCount}
        hasMoreItems={hasMore}
        sortedBy={list.sortedBy}
        filteredBy="All accounts"
        updated={list.unavailable ? undefined : "a few seconds ago"}
        actions={actions}
        search={list.search}
        onSearchChange={list.setSearch}
        locale="en-US"
        joined
      />
      <DataTable
        table={list.table}
        aria-label={
          listViewAccountViews.find((option) => option.value === view)?.label
        }
        hasNextPage={hasMore}
        onLoadMore={() => setAccounts(listViewAccounts)}
        empty={list.unavailable ? "Accounts aren't available." : undefined}
      />
    </ListView>
  )
}

export { ListViewPage }
```

#### components/wisty/list-view.tsx

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  useDataTable,
  type DataTableColumn,
  type DataTableInstance,
  type UseDataTableOptions,
} from "@/components/wisty/data-table"

interface UseListViewOptions<TRecord extends object> extends Omit<
  UseDataTableOptions<TRecord>,
  "data"
> {
  /** The rows the app has read, or `null` when they couldn't load. */
  records: TRecord[] | null
  /** The fields the search matches; leave it out to search on the server. */
  searchBy?: readonly (keyof TRecord)[]
  /** The first read: no count while it lasts, and never unavailable. */
  loading?: boolean
}

interface UseListViewResult<TRecord extends object> {
  /** The table for DataTable, over the rows the search leaves. */
  table: DataTableInstance<TRecord>
  /** The search text, for ListViewHeader's `search`. */
  search: string
  /** Sets the search text, for ListViewHeader's `onSearchChange`. */
  setSearch: (search: string) => void
  /** How many rows the search leaves; `null` while loading or unavailable. */
  itemCount: number | null
  /** The label of the column sorted first, if any, for ListViewHeader's `sortedBy`. */
  sortedBy: string | undefined
  /** The rows couldn't load: `records` is `null` and nothing is loading. */
  unavailable: boolean
}

const none: never[] = []

function columnLabel<TRecord extends object>(column: DataTableColumn<TRecord>) {
  const { meta, header } = column.columnDef
  return meta?.label ?? (typeof header === "string" ? header : column.id)
}

/** Holds the list's search and derives its count, sort label and unavailable state from the app's rows. */
function useListView<TRecord extends object>(
  options: UseListViewOptions<TRecord>
): UseListViewResult<TRecord> {
  const { records, searchBy, loading = false, ...tableOptions } = options
  const [search, setSearch] = React.useState("")
  const query = search.trim().toLowerCase()
  const rows =
    records && searchBy && query
      ? records.filter((record) =>
          searchBy.some((field) =>
            String(record[field] ?? "")
              .toLowerCase()
              .includes(query)
          )
        )
      : (records ?? none)
  const table = useDataTable({ ...tableOptions, data: rows })
  const sort = table.state.sorting[0]
  const sorted = sort ? table.getColumn(sort.id) : undefined
  const unavailable = records === null && !loading

  return {
    table,
    search,
    setSearch,
    itemCount: loading || unavailable ? null : rows.length,
    sortedBy: sorted ? columnLabel(sorted) : undefined,
    unavailable,
  }
}

/** The frame that joins a list view header to the table under it. */
function ListView({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-view"
      className={cn(
        "flex flex-col overflow-hidden rounded-(--page-header-radius) border-(length:--page-header-border-width) border-b-0 border-(--page-header-border) shadow-(--page-header-shadow)",
        className
      )}
      {...props}
    />
  )
}

export { ListView, useListView }
export type { UseListViewOptions, UseListViewResult }
```

#### components/wisty/list-view-data.ts

```ts
import type { ListViewHeaderView } from "@/components/wisty/list-view-header"

/** One account in the All Accounts list view, its columns as plain values. */
export interface ListViewAccount {
  /** The account's Id. */
  id: string
  /** The account's name, linked to its record page. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, as labeled. */
  type: string | null
  /** The account owner's name. */
  owner: string
  /** Last Modified Date, an ISO 8601 instant. */
  lastModified: string
  /** The account's record page. */
  href: string
}

/** The sample org's accounts, as the All Accounts list view shows them. */
export const listViewAccounts: ListViewAccount[] = [
  {
    id: "001Dn00000BurlTX",
    name: "Burlington Textiles Corp of America",
    phone: "(336) 222-7000",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-12T15:42:00Z",
    href: "/accounts/001Dn00000BurlTX",
  },
  {
    id: "001Dn00000DickPL",
    name: "Dickenson plc",
    phone: "(785) 241-6200",
    type: "Customer - Channel",
    owner: "Ellen Hart",
    lastModified: "2026-06-03T18:10:00Z",
    href: "/accounts/001Dn00000DickPL",
  },
  {
    id: "001Dn00000EdgeCOM",
    name: "Edge Communications",
    phone: "(512) 757-6000",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-12T14:05:00Z",
    href: "/accounts/001Dn00000EdgeCOM",
  },
  {
    id: "001Dn00000ExprLG",
    name: "Express Logistics and Transport",
    phone: "(503) 421-7800",
    type: "Customer - Channel",
    owner: "Priya Raman",
    lastModified: "2026-05-29T20:31:00Z",
    href: "/accounts/001Dn00000ExprLG",
  },
  {
    id: "001Dn00000GenePT",
    name: "GenePoint",
    phone: "(650) 867-3450",
    type: "Customer - Channel",
    owner: "Priya Raman",
    lastModified: "2026-06-10T16:48:00Z",
    href: "/accounts/001Dn00000GenePT",
  },
  {
    id: "001Dn00000GrndHR",
    name: "Grand Hotels & Resorts Ltd",
    phone: "(312) 596-1000",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-08T13:22:00Z",
    href: "/accounts/001Dn00000GrndHR",
  },
  {
    id: "001Dn00000PyrmCN",
    name: "Pyramid Construction Inc.",
    phone: "(014) 427-4427",
    type: "Customer - Channel",
    owner: "Priya Raman",
    lastModified: "2026-05-21T09:15:00Z",
    href: "/accounts/001Dn00000PyrmCN",
  },
  {
    id: "001Dn00000SfrcIN",
    name: "sForce",
    phone: "(415) 901-7000",
    type: null,
    owner: "Ellen Hart",
    lastModified: "2026-04-30T17:02:00Z",
    href: "/accounts/001Dn00000SfrcIN",
  },
  {
    id: "001Dn00000UogCRP",
    name: "United Oil & Gas Corp.",
    phone: "(212) 842-5500",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-11T19:40:00Z",
    href: "/accounts/001Dn00000UogCRP",
  },
  {
    id: "001Dn00000UogSGP",
    name: "United Oil & Gas, Singapore",
    phone: "(650) 450-8810",
    type: "Customer - Direct",
    owner: "Priya Raman",
    lastModified: "2026-06-02T03:55:00Z",
    href: "/accounts/001Dn00000UogSGP",
  },
  {
    id: "001Dn00000UogUKL",
    name: "United Oil & Gas, UK",
    phone: "+44 191 4956203",
    type: "Customer - Direct",
    owner: "Priya Raman",
    lastModified: "2026-05-26T11:08:00Z",
    href: "/accounts/001Dn00000UogUKL",
  },
  {
    id: "001Dn00000UnivAZ",
    name: "University of Arizona",
    phone: "(520) 773-9050",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-09T22:17:00Z",
    href: "/accounts/001Dn00000UnivAZ",
  },
]

/** The org's Accounts list views, in the switcher's order. */
export const listViewAccountViews: ListViewHeaderView[] = [
  { value: "AllAccounts", label: "All Accounts" },
  { value: "MyAccounts", label: "My Accounts" },
  { value: "NewThisWeek", label: "New This Week" },
  {
    value: "PlatinumandGoldSLACustomers",
    label: "Platinum and Gold SLA Customers",
  },
  { value: "RecentlyViewedAccounts", label: "Recently Viewed Accounts" },
]

/** The user's recently used Accounts list views, most recent first. */
export const listViewRecentAccountViews = ["AllAccounts", "MyAccounts"]
```

### Custom object

Projects, a custom object, written out in full: its own icon, list views and columns, with a currency, a percent and empty values.

```tsx
"use client"

import { useState } from "react"

import {
  createDataTableColumnHelper,
  DataTable,
} from "@/components/wisty/data-table"
import { ListView, useListView } from "@/components/wisty/list-view"
import { ListViewHeader } from "@/components/wisty/list-view-header"

interface Project {
  id: string
  name: string
  accountName: string | null
  status: string
  startDate: string | null
  budget: number | null
  percentComplete: number | null
  owner: string
  href: string
}

const projects: Project[] = [
  {
    id: "a0BDn00000BurlWP",
    name: "Burlington Weaving Plant Generator",
    accountName: "Burlington Textiles Corp of America",
    status: "Completed",
    startDate: "2026-07-06",
    budget: 235_000,
    percentComplete: 1,
    owner: "Ellen Hart",
    href: "/projects/a0BDn00000BurlWP",
  },
  {
    id: "a0BDn00000DickMG",
    name: "Dickenson Mobile Generators",
    accountName: "Dickenson plc",
    status: "Planned",
    startDate: "2027-01-12",
    budget: 15_000,
    percentComplete: 0,
    owner: "Ellen Hart",
    href: "/projects/a0BDn00000DickMG",
  },
  {
    id: "a0BDn00000EdgeEG",
    name: "Edge Emergency Generator",
    accountName: "Edge Communications",
    status: "In Progress",
    startDate: "2026-10-05",
    budget: 75_000,
    percentComplete: 0.35,
    owner: "Ellen Hart",
    href: "/projects/a0BDn00000EdgeEG",
  },
  {
    id: "a0BDn00000EdgeIN",
    name: "Edge Installation",
    accountName: "Edge Communications",
    status: "Completed",
    startDate: "2026-08-17",
    budget: 50_000,
    percentComplete: 1,
    owner: "Priya Raman",
    href: "/projects/a0BDn00000EdgeIN",
  },
  {
    id: "a0BDn00000ExprSG",
    name: "Express Logistics Standby Generator",
    accountName: "Express Logistics and Transport",
    status: "Completed",
    startDate: "2026-06-01",
    budget: 220_000,
    percentComplete: 1,
    owner: "Priya Raman",
    href: "/projects/a0BDn00000ExprSG",
  },
  {
    id: "a0BDn00000GeneLG",
    name: "GenePoint Lab Generators",
    accountName: "GenePoint",
    status: "Planned",
    startDate: null,
    budget: 60_000,
    percentComplete: 0,
    owner: "Ellen Hart",
    href: "/projects/a0BDn00000GeneLG",
  },
  {
    id: "a0BDn00000FleeAU",
    name: "Generator Fleet Audit",
    accountName: null,
    status: "In Progress",
    startDate: "2026-10-01",
    budget: 12_000,
    percentComplete: 0.5,
    owner: "Priya Raman",
    href: "/projects/a0BDn00000FleeAU",
  },
  {
    id: "a0BDn00000GrndEG",
    name: "Grand Hotels Emergency Generators",
    accountName: "Grand Hotels & Resorts Ltd",
    status: "In Progress",
    startDate: "2026-09-14",
    budget: 210_000,
    percentComplete: 0.6,
    owner: "Marcus Lee",
    href: "/projects/a0BDn00000GrndEG",
  },
  {
    id: "a0BDn00000UnivIN",
    name: "University of AZ Installations",
    accountName: "University of Arizona",
    status: "On Hold",
    startDate: "2026-08-24",
    budget: null,
    percentComplete: 0.2,
    owner: "Marcus Lee",
    href: "/projects/a0BDn00000UnivIN",
  },
]

const views = [
  { value: "AllProjects", label: "All Projects" },
  { value: "ActiveProjects", label: "Active Projects" },
  { value: "MyProjects", label: "My Projects" },
  { value: "RecentlyViewedProjects", label: "Recently Viewed Projects" },
]

const col = createDataTableColumnHelper<Project>()
const columns = col.columns([
  col.accessor("name", {
    header: "Project Name",
    minSize: 220,
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
  col.accessor("accountName", { header: "Account", size: 200 }),
  col.accessor("status", { header: "Status", size: 120 }),
  col.accessor("budget", {
    header: "Budget",
    size: 130,
    meta: { type: "currency" },
  }),
  col.accessor("percentComplete", {
    header: "% Complete",
    size: 110,
    meta: { type: "percent" },
  }),
  col.accessor("startDate", {
    header: "Start Date",
    size: 160,
    meta: { type: "date" },
  }),
  col.accessor("owner", { header: "Owner", size: 140 }),
])

export default function ListViewCustomObject() {
  const [view, setView] = useState("AllProjects")
  const list = useListView({
    records: projects,
    searchBy: ["name", "accountName", "status", "owner"],
    columns,
    getRowId: (project) => project.id,
    initialState: { sorting: [{ id: "name", desc: false }] },
    showRowNumberColumn: true,
    enableRowSelection: true,
    rowActions: [
      { value: "edit", label: "Edit" },
      { value: "delete", label: "Delete" },
    ],
    locale: "en-US",
  })

  return (
    <ListView className="w-full">
      <ListViewHeader
        icon="custom:custom44"
        objectLabel="Projects"
        views={views}
        view={view}
        onViewChange={setView}
        itemCount={list.itemCount}
        sortedBy={list.sortedBy}
        filteredBy="All projects"
        updated={list.unavailable ? undefined : "a few seconds ago"}
        actions={[{ value: "new", label: "New" }]}
        search={list.search}
        onSearchChange={list.setSearch}
        joined
      />
      <DataTable
        table={list.table}
        aria-label={views.find((option) => option.value === view)?.label}
        empty={list.unavailable ? "Projects aren't available." : undefined}
      />
    </ListView>
  )
}
```

### Unavailable

With `records` null, the count and the Updated time drop out and the table says so, where an empty array reads 0 items.

```tsx
"use client"

import {
  createDataTableColumnHelper,
  DataTable,
} from "@/components/wisty/data-table"
import { ListView, useListView } from "@/components/wisty/list-view"
import { ListViewHeader } from "@/components/wisty/list-view-header"
import {
  listViewAccountViews,
  type ListViewAccount,
} from "@/components/wisty/list-view-data"

const col = createDataTableColumnHelper<ListViewAccount>()
const columns = col.columns([
  col.accessor("name", {
    header: "Account Name",
    minSize: 220,
    meta: { rowHeader: true },
  }),
  col.accessor("phone", {
    header: "Phone",
    size: 160,
    meta: { type: "phone" },
  }),
  col.accessor("type", { header: "Type", size: 170 }),
  col.accessor("owner", { header: "Account Owner", size: 150 }),
])

export default function ListViewUnavailable() {
  const list = useListView<ListViewAccount>({
    records: null,
    searchBy: ["name", "phone", "type", "owner"],
    columns,
    getRowId: (account) => account.id,
    initialState: { sorting: [{ id: "name", desc: false }] },
    showRowNumberColumn: true,
    enableRowSelection: true,
  })

  return (
    <ListView className="w-full">
      <ListViewHeader
        icon="standard:account"
        objectLabel="Accounts"
        views={listViewAccountViews}
        itemCount={list.itemCount}
        sortedBy={list.sortedBy}
        filteredBy="All accounts"
        updated={list.unavailable ? undefined : "a few seconds ago"}
        search={list.search}
        onSearchChange={list.setSearch}
        joined
      />
      <DataTable
        table={list.table}
        aria-label="All Accounts"
        empty={list.unavailable ? "Accounts aren't available." : undefined}
      />
    </ListView>
  )
}
```
