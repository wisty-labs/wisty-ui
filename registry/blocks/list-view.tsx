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
