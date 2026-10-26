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
