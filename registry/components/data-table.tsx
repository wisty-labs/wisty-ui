"use client"

import * as React from "react"
import {
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  FlexRender,
  functionalUpdate,
  metaHelper,
  rowSelectionFeature,
  rowSortingFeature,
  Subscribe,
  tableFeatures,
  useTable,
  type AccessorFn,
  type AccessorFnColumnDef,
  type AccessorKeyColumnDef,
  type Cell,
  type CellContext,
  type Column,
  type ColumnDef,
  type ColumnHelper,
  type ColumnSizingState,
  type DeepKeys,
  type DeepValue,
  type DisplayColumnDef,
  type Header,
  type IdentifiedColumnDef,
  type OnChangeFn,
  type ReactTable,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortFn,
  type SortingState,
  type TableFeature,
  type TableFeatures,
  type TableOptions,
  type TableState,
} from "@tanstack/react-table"
import {
  defaultRangeExtractor,
  measureElement,
  useVirtualizer,
  type Range,
} from "@tanstack/react-virtual"
import { ArrowDownIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  compareOutputTimes,
  formatOutputValue,
  OutputFieldCompactValue,
  type OutputFieldLinkOptions,
  type OutputFieldPlainValue,
  type OutputFieldStyleOptions,
  type OutputFieldType,
} from "@/components/wisty/output-field"

type DataTableColumnType = OutputFieldType

/** An item in a row's actions menu. */
interface DataTableRowAction {
  /** Identifies the action in onRowAction: "edit", "delete". */
  value: string
  /** The item's text. */
  label: string
  /** Shows the item but doesn't let it run. */
  disabled?: boolean
}

/** An item in a column header's actions menu. */
interface DataTableHeaderAction {
  /** Identifies the action in onHeaderAction: "wrap", "clip". */
  value: string
  /** The item's text. */
  label: string
  /** Shows the item but doesn't let it run. */
  disabled?: boolean
  /** Shows a check before the label when true, and room for one when false. */
  checked?: boolean
}

/**
 * What a column's `meta` takes. To add your own keys, edit this interface,
 * or merge into it with `declare module "@/components/wisty/data-table"`.
 */
interface DataTableColumnMeta
  extends OutputFieldStyleOptions, OutputFieldLinkOptions {
  /** How values format, align and sort. Defaults to "text". */
  type?: DataTableColumnType
  /** ISO 4217 code for "currency" columns. Defaults to "USD". */
  currencyCode?: string
  /** The column's name in menus and announcements when `header` is a function. */
  label?: string
  /** Renders cells as row headers (`<th scope="row">`), which name each row. */
  rowHeader?: boolean
  /** Wraps long values instead of clipping them. */
  wrapText?: boolean
  /** With wrapText, the lines a cell shows before it clips. */
  wrapTextMaxLines?: number
  /** Overrides the type's alignment. Numbers align to the end. */
  align?: "start" | "center" | "end"
  /** Classes on the column's header cell. */
  headerClassName?: string
  /** Classes on the column's body cells. */
  cellClassName?: string
  /** An actions menu in the column header, handled by onHeaderAction. */
  headerActions?: readonly DataTableHeaderAction[]
}

/** Options useDataTable takes beyond TanStack's; cells read them from table.options. */
interface DataTableFeatureOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /** Adds a row number column first; the numbers follow the rows shown, so sorting renumbers them. */
  showRowNumberColumn?: boolean
  /** The rows before the first: with 10, the first row reads 11. Defaults to 0. */
  rowNumberOffset?: number
  /** Caps the selection in every kind of change; 1 renders radios. Implies enableRowSelection. */
  maxRowSelection?: number
  /** Names a row in its labels, like "Select Acme". Defaults to the row header's value. */
  getRowLabel?: (row: Row<TFeatures, TData>) => string
  /** The actions menu of each row, or a function that returns a row's actions when its menu opens. */
  rowActions?:
    | readonly DataTableRowAction[]
    | ((row: Row<TFeatures, TData>) => readonly DataTableRowAction[])
  /** Called with the action picked from a row's menu. */
  onRowAction?: (action: DataTableRowAction, row: Row<TFeatures, TData>) => void
  /** Called with the action picked from a column header's menu. */
  onHeaderAction?: (
    action: DataTableHeaderAction,
    column: Column<TFeatures, TData, unknown>
  ) => void
  /** A BCP 47 locale for numbers, dates and sorting text. Defaults to "en-US". */
  locale?: string
  /** An IANA time zone for "datetime" values. Defaults to "UTC". */
  timeZone?: string
  /** The instant "relative" values count from. Defaults to render time; pass one for a stable render. */
  now?: string | number | Date
}

declare module "@tanstack/react-table" {
  interface Plugins {
    dataTableFeature: TableFeature
  }
  interface TableOptions_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    dataTableFeature: DataTableFeatureOptions<TFeatures, TData>
  }
}

// The row number, select and actions columns, in rem, as lightning-datatable sizes them.
const controlWidths: Record<string, number> = {
  rowNumber: 3.25,
  select: 2,
  actions: 3.125,
}

// From three digits the row number column widens per digit, so a number never
// clips. The widest number is the first or the last (a negative offset adds a sign).
function controlWidth<TData extends RowData>(column: DataTableColumn<TData>) {
  const width = controlWidths[column.id]!
  if (column.id !== "rowNumber") return width
  const offset = column.table.options.rowNumberOffset ?? 0
  const count = column.table.getRowModel().rows.length
  const digits = Math.max(
    String(offset + 1).length,
    String(offset + count).length
  )
  return width + Math.max(0, digits - 2) * 0.625
}

// lightning-datatable's min-column-width, max-column-width and resize-step.
const minColumnWidth = 50
const maxColumnWidth = 1000
const resizeStep = 10

// Defaults a page's defaultColumn overrides key by key. Empty values sort here,
// not through sortUndefined, and an unsized column shares what the others leave.
const dataTableFeature: TableFeature = {
  // TableFeature types getDefaultColumnDef for any feature set, so the cast.
  getDefaultColumnDef: (() => ({
    cell: DataTableValue,
    sortUndefined: false,
    size: undefined,
    minSize: minColumnWidth,
    maxSize: maxColumnWidth,
  })) as TableFeature["getDefaultColumnDef"],
}

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnSizingFeature,
  columnResizingFeature,
  dataTableFeature,
  sortedRowModel: createSortedRowModel(),
  columnMeta: metaHelper<DataTableColumnMeta>(),
})

type Features = typeof dataTableFeatures
type DataTableRow<TData extends RowData> = Row<Features, TData>
type DataTableColumn<TData extends RowData> = Column<Features, TData, unknown>
type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  Features,
  TData,
  TValue
>
type DataTableInstance<
  TData extends RowData,
  TSelected = TableState<Features>,
> = ReactTable<Features, TData, TSelected>

/**
 * TanStack's column helper for this table, except that a column with an
 * accessor function needs an `id`: it's the id the sorting state carries.
 */
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

function createDataTableColumnHelper<
  TData extends RowData,
>(): DataTableColumnHelper<TData> {
  return createColumnHelper<Features, TData>() as DataTableColumnHelper<TData>
}

type UseDataTableOptions<TData extends RowData> = Omit<
  TableOptions<Features, TData>,
  "features" | "getRowId"
> & {
  /** A stable id per row, like a record id. Selection is kept by it. */
  getRowId: (
    originalRow: TData,
    index: number,
    parent?: DataTableRow<TData>
  ) => string
}

// The hook

// Warns once per table, so a misconfigured page doesn't flood the console.
const warned = new WeakMap<object, Set<string>>()
function warnOnce(key: object, message: string) {
  const messages = warned.get(key) ?? new Set<string>()
  if (messages.has(message)) return
  messages.add(message)
  warned.set(key, messages)
  console.warn(message)
}

// Cached: every select cell counts once per change when maxRowSelection is set.
const selectionCounts = new WeakMap<object, number>()
function countSelected(selection: RowSelectionState | undefined) {
  if (!selection) return 0
  let count = selectionCounts.get(selection)
  if (count === undefined) {
    count = Object.keys(selection).length
    selectionCounts.set(selection, count)
  }
  return count
}

// A slice the hook keeps unless the page controls it. The page's callback runs
// after the update, so a callback alone still sorts and selects.
function useSlice<T>(
  controlled: T | undefined,
  initial: () => T,
  onChange: OnChangeFn<T> | undefined,
  transform?: (previous: T, next: T) => T
) {
  const [own, setOwn] = React.useState(initial)
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : own
  const latest = React.useRef(value)
  React.useLayoutEffect(() => {
    latest.current = value
  })
  const handler: OnChangeFn<T> = (updater) => {
    const previous = latest.current
    let next = functionalUpdate(updater, previous)
    if (transform) next = transform(previous, next)
    latest.current = next
    if (!isControlled) setOwn(next)
    onChange?.(next)
  }
  return [value, handler] as const
}

// Over the cap, keeps what was selected and adds new rows in display order until the cap.
function capSelection(
  previous: RowSelectionState,
  next: RowSelectionState,
  max: number,
  order: readonly { id: string }[]
): RowSelectionState {
  const ids = Object.keys(next)
  if (ids.length <= max) return next
  const position = new Map(order.map((row, index) => [row.id, index]))
  const kept = ids.filter((id) => previous[id])
  const added = ids
    .filter((id) => !previous[id])
    .sort(
      (a, b) =>
        (position.get(a) ?? Number.MAX_SAFE_INTEGER) -
        (position.get(b) ?? Number.MAX_SAFE_INTEGER)
    )
  const capped: RowSelectionState = {}
  for (const id of kept) capped[id] = true
  for (const id of added.slice(0, Math.max(0, max - kept.length)))
    capped[id] = true
  return capped
}

const hasColumn = (
  columns: readonly DataTableColumnDef<any, any>[],
  id: string
) =>
  columns.some(
    (column) =>
      ("id" in column && column.id === id) ||
      ("accessorKey" in column && column.accessorKey === id)
  )

// A sort function per column type, resolved once per column instead of per
// comparison. Columns and a defaultColumn with their own sortFn keep it.
function withSortFns<TData extends RowData>(
  columns: readonly DataTableColumnDef<TData, any>[]
): DataTableColumnDef<TData, any>[] {
  return columns.map((column) => {
    const nested =
      "columns" in column && column.columns
        ? { columns: withSortFns(column.columns) }
        : null
    const sortFn =
      column.sortFn === undefined ? sortFnFor(column.meta?.type) : undefined
    if (!nested && !sortFn) return column
    return { ...column, ...nested, ...(sortFn && { sortFn }) }
  })
}

function useDataTable<TData extends RowData, TSelected = TableState<Features>>(
  options: UseDataTableOptions<TData>,
  selector?: (state: TableState<Features>) => TSelected
): DataTableInstance<TData, TSelected> {
  const {
    columns,
    defaultColumn,
    maxRowSelection,
    enableRowSelection: pageEnableRowSelection,
    enableMultiRowSelection: pageEnableMultiRowSelection,
    enableSortingRemoval = false,
    sortDescFirst = false,
    enableMultiSort = false,
    state,
    initialState,
    onSortingChange,
    onRowSelectionChange,
    onColumnSizingChange,
    columnResizeDirection,
    locale = "en-US",
    timeZone = "UTC",
    ...rest
  } = options

  // Single selection: radios, no select-all, and a new pick replaces the old.
  const single = maxRowSelection === 1 || pageEnableMultiRowSelection === false
  // maxRowSelection or a multi-select setting implies selection.
  const selectable =
    pageEnableRowSelection !== false &&
    (pageEnableRowSelection !== undefined ||
      maxRowSelection !== undefined ||
      pageEnableMultiRowSelection !== undefined)
  const cap = selectable && !single ? maxRowSelection : undefined

  const tableRef = React.useRef<{
    getRowsInDisplayOrder: () => readonly { id: string }[]
  } | null>(null)

  const [sorting, setSorting] = useSlice<SortingState>(
    state?.sorting,
    () => initialState?.sorting ?? [],
    onSortingChange
  )
  const [rowSelection, setRowSelection] = useSlice<RowSelectionState>(
    state?.rowSelection,
    () => {
      const initial = initialState?.rowSelection ?? {}
      // Preselected rows past the cap are dropped, first ones kept.
      return cap === undefined ? initial : capSelection({}, initial, cap, [])
    },
    onRowSelectionChange,
    (previous, next) =>
      cap === undefined
        ? next
        : capSelection(
            previous,
            next,
            cap,
            tableRef.current?.getRowsInDisplayOrder() ?? []
          )
  )
  // Widths change once per resize, not on every frame of a drag, so a page
  // can save them from the callback alone.
  const [columnSizing, setColumnSizing] = useSlice<ColumnSizingState>(
    state?.columnSizing,
    () => initialState?.columnSizing ?? {},
    onColumnSizingChange
  )

  const ownRowNumber =
    rest.showRowNumberColumn === true && !hasColumn(columns, "rowNumber")
  const ownSelect = selectable && !hasColumn(columns, "select")
  const ownActions =
    rest.rowActions !== undefined && !hasColumn(columns, "actions")
  const typedSort = defaultColumn?.sortFn === undefined

  // Identity keys on presence, not on rowActions or a predicate written
  // inline, so a page's render doesn't rebuild every column and header.
  const allColumns = React.useMemo(
    () => [
      ...(ownRowNumber ? [rowNumberColumn] : []),
      ...(ownSelect ? [single ? radioColumn : selectColumn] : []),
      ...(typedSort ? withSortFns(columns) : columns),
      ...(ownActions ? [actionsColumn] : []),
    ],
    [columns, ownRowNumber, ownSelect, ownActions, single, typedSort]
  ) as DataTableColumnDef<TData, any>[]

  const table = useTable<Features, TData, TSelected>(
    {
      ...rest,
      features: dataTableFeatures,
      columns: allColumns,
      defaultColumn,
      enableSortingRemoval,
      sortDescFirst,
      enableMultiSort,
      state: { ...state, sorting, rowSelection, columnSizing },
      initialState,
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,
      onColumnSizingChange: setColumnSizing,
      // Unset, a resize follows the table's own direction, not left to right.
      columnResizeDirection,
      locale,
      timeZone,
      maxRowSelection,
      enableMultiRowSelection: single
        ? false
        : (pageEnableMultiRowSelection ?? true),
      // The page's predicate, then the cap: at the cap, rows that aren't selected can't be.
      enableRowSelection: !selectable
        ? false
        : (row) => {
            if (
              typeof pageEnableRowSelection === "function" &&
              !pageEnableRowSelection(row)
            )
              return false
            if (cap === undefined) return true
            return (
              row.getIsSelected() ||
              countSelected(row.table.atoms.rowSelection?.get()) < cap
            )
          },
    },
    selector
  )

  React.useLayoutEffect(() => {
    tableRef.current = table
  })

  if (rest.showRowNumberColumn && !ownRowNumber)
    warnOnce(
      table.store,
      'useDataTable: the page has its own "rowNumber" column, so the table adds none. Remove it to get the row number column.'
    )
  if (selectable && !ownSelect)
    warnOnce(
      table.store,
      'useDataTable: the page has its own "select" column, so the table adds none. Remove it to get the SLDS checkbox column with Shift ranges and select all.'
    )
  if (rest.rowActions !== undefined && !ownActions)
    warnOnce(
      table.store,
      'useDataTable: the page has its own "actions" column, so rowActions has no menu to fill. Remove the column, or drop rowActions.'
    )
  if (rest.onRowAction && rest.rowActions === undefined)
    warnOnce(
      table.store,
      "useDataTable: onRowAction is set but rowActions isn't, so no actions column renders."
    )

  return table
}

// Values: formats, links and sorting

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === ""

const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/

// A YYYY-MM-DD string is a calendar date, read as local midnight, so it shows
// on the same day in every time zone.
function toDate(value: unknown) {
  if (value instanceof Date) return value
  if (typeof value === "number") return new Date(value)
  if (typeof value !== "string") return null
  const day = dateOnly.exec(value)
  if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]))
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Number(value))
  )
    return Number(value)
  return null
}

// The column's meta passes whole, since the formatter ignores keys it doesn't
// read. Values a type can't read, like a currency's displayValue, pass through.
function formatValue(
  value: unknown,
  meta: DataTableColumnMeta | undefined,
  locale?: string,
  timeZone?: string,
  now?: string | number | Date
): string {
  return formatOutputValue(value, meta?.type, {
    ...meta,
    currency: meta?.currencyCode,
    locale,
    timeZone,
    now,
  })
}

// The default cell.
function DataTableValue<TData extends RowData>(
  context: CellContext<Features, TData, unknown>
) {
  const meta = context.column.columnDef.meta
  const { locale, timeZone, now } = context.table.options
  return (
    <OutputFieldCompactValue
      {...meta}
      value={context.getValue() as OutputFieldPlainValue}
      currency={meta?.currencyCode}
      locale={locale}
      timeZone={timeZone}
      now={now}
    />
  )
}

const collators = new Map<string, Intl.Collator>()
function collatorFor(locale: string | undefined) {
  const key = locale ?? ""
  let collator = collators.get(key)
  if (!collator) {
    collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" })
    collators.set(key, collator)
  }
  return collator
}

// Empty values sort last in both directions. TanStack inverts the comparison
// for descending, so one with an empty value reads the direction and inverts first.
function emptyLast(
  compare: (a: unknown, b: unknown, locale: string | undefined) => number,
  read: (value: unknown) => unknown = (value) => value
): SortFn<Features, any> {
  return (rowA, rowB, columnId) => {
    const a = read(rowA.getValue(columnId))
    const b = read(rowB.getValue(columnId))
    const aEmpty = isEmpty(a)
    const bEmpty = isEmpty(b)
    if (aEmpty || bEmpty) {
      if (aEmpty && bEmpty) return 0
      const desc = rowA.table.atoms.sorting
        ?.get()
        ?.find((sort) => sort.id === columnId)?.desc
      const last = aEmpty ? 1 : -1
      return desc ? -last : last
    }
    return compare(a, b, rowA.table.options.locale)
  }
}

const compareText = (a: unknown, b: unknown, locale: string | undefined) =>
  collatorFor(locale).compare(String(a), String(b))

const sortFns = {
  text: emptyLast(compareText),
  number: emptyLast((a, b, locale) => {
    const x = toNumber(a)
    const y = toNumber(b)
    return x !== null && y !== null ? x - y : compareText(a, b, locale)
  }),
  date: emptyLast((a, b, locale) => {
    // Calendar dates compare as text; anything else as a time.
    if (
      typeof a === "string" &&
      typeof b === "string" &&
      dateOnly.test(a) &&
      dateOnly.test(b)
    )
      return a < b ? -1 : a > b ? 1 : 0
    const x = toDate(a)?.getTime()
    const y = toDate(b)?.getTime()
    return x !== undefined && y !== undefined
      ? x - y
      : compareText(a, b, locale)
  }),
  // By the clock, not the text: "09:30:00Z" is before "09:30:00.100Z".
  time: emptyLast(
    (a, b, locale) => compareOutputTimes(a, b) ?? compareText(a, b, locale)
  ),
  boolean: emptyLast((a, b) => Number(Boolean(a)) - Number(Boolean(b))),
  // An address or a name sorts by its one-line text, and one with no parts is empty.
  address: emptyLast(compareText, (value) =>
    formatOutputValue(value, "address")
  ),
  name: emptyLast(compareText, (value) => formatOutputValue(value, "name")),
}

function sortFnFor(type: DataTableColumnType | undefined) {
  switch (type) {
    case "number":
    case "currency":
    case "percent":
      return sortFns.number
    case "date":
    case "datetime":
    case "relative":
      return sortFns.date
    case "time":
      return sortFns.time
    case "boolean":
      return sortFns.boolean
    case "address":
      return sortFns.address
    case "name":
      return sortFns.name
    default:
      return sortFns.text
  }
}

function alignOf(meta: DataTableColumnMeta | undefined) {
  if (meta?.align) return meta.align
  return meta?.type === "number" ||
    meta?.type === "currency" ||
    meta?.type === "percent"
    ? "end"
    : "start"
}

const alignClass = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
}

// Labels

function rowLabel<TData extends RowData>(row: DataTableRow<TData>) {
  const { getRowLabel } = row.table.options
  if (getRowLabel) return getRowLabel(row)
  const header = row.table
    .getAllLeafColumns()
    .find((column) => column.columnDef.meta?.rowHeader)
  const value = header ? row.getValue(header.id) : undefined
  return isEmpty(value) ? `row ${row.index + 1}` : String(value)
}

function columnLabel<TData extends RowData>(column: DataTableColumn<TData>) {
  const { meta, header } = column.columnDef
  return meta?.label ?? (typeof header === "string" ? header : column.id)
}

// The row number column

// Set by each row: its position in the rows shown, plus rowNumberOffset.
const RowNumberContext = React.createContext(0)

// Text, not a CSS counter, so it's read aloud; start aligned, so 9 and 10 start together.
function DataTableRowNumber() {
  const number = React.useContext(RowNumberContext)
  return (
    <span
      data-slot="data-table-row-number"
      className="ps-5 text-(length:--table-row-number-size) text-muted-foreground"
    >
      {number}
    </span>
  )
}

const rowNumberColumn: DataTableColumnDef<any> = {
  id: "rowNumber",
  header: () => <span className="sr-only">Row Number</span>,
  cell: () => <DataTableRowNumber />,
  enableSorting: false,
  enableResizing: false,
}

// The select column

// The name the radios share, so they're one group: one tab stop, arrow keys between rows.
const RadioNameContext = React.createContext("")

function DataTableSelectCell<TData extends RowData>({
  row,
}: {
  row: DataTableRow<TData>
}) {
  // Shift is read from the click or key and applied in onCheckedChange, through
  // TanStack's range handler.
  const shift = React.useRef(false)
  return (
    <Subscribe
      source={row.table.atoms.rowSelection!}
      selector={(selection) => ({
        selected: Boolean(selection?.[row.id]),
        // At the cap the other rows disable, so the count is part of what re-renders the cell.
        count: row.table.options.maxRowSelection ? countSelected(selection) : 0,
      })}
    >
      {({ selected }) => (
        <Checkbox
          checked={selected}
          disabled={!row.getCanSelect()}
          aria-label={`Select ${rowLabel(row)}`}
          onClick={(event) => {
            shift.current = event.shiftKey
          }}
          onKeyDown={(event) => {
            shift.current = event.shiftKey
          }}
          onCheckedChange={(checked) => {
            const shiftKey = shift.current
            shift.current = false
            row.getToggleSelectedHandler()({
              target: { checked: checked === true },
              shiftKey,
            })
          }}
        />
      )}
    </Subscribe>
  )
}

// "All" is every selectable row selected, or the cap reached, where a click clears the selection.
function headerSelection<TData extends RowData>(
  table: DataTableRow<TData>["table"],
  selection: RowSelectionState | undefined
) {
  const max = table.options.maxRowSelection
  const capReached = max !== undefined && countSelected(selection) >= max
  let selectable = 0
  let selectedSelectable = 0
  let selected = 0
  for (const row of table.getRowModel().rows) {
    const isSelected = Boolean(selection?.[row.id])
    if (isSelected) selected++
    // Below the cap, this is the page's own predicate.
    if (row.getCanSelect()) {
      selectable++
      if (isSelected) selectedSelectable++
    }
  }
  const all =
    (selectable > 0 && selectedSelectable >= selectable) ||
    (capReached && selected > 0)
  return { all, mixed: selected > 0 && !all }
}

function DataTableSelectAll<TData extends RowData>({
  table,
}: {
  table: DataTableRow<TData>["table"]
}) {
  return (
    <Subscribe source={table.atoms.rowSelection!}>
      {(selection) => {
        const { all, mixed } = headerSelection(table, selection)
        return (
          // Mixed is spread only when set: an undefined aria-checked would
          // replace the checkbox's own.
          <Checkbox
            checked={all}
            {...(mixed ? { "aria-checked": "mixed" as const } : {})}
            aria-label="Select all rows"
            disabled={table.getRowModel().rows.length === 0}
            onCheckedChange={() => table.toggleAllRowsSelected(!all)}
          />
        )
      }}
    </Subscribe>
  )
}

function DataTableRadioCell<TData extends RowData>({
  row,
}: {
  row: DataTableRow<TData>
}) {
  const name = React.useContext(RadioNameContext)
  return (
    <Subscribe
      source={row.table.atoms.rowSelection!}
      selector={(selection) => Boolean(selection?.[row.id])}
    >
      {(selected) => (
        // Inline on the text line, as a checkbox cell is.
        <span className="relative inline-flex size-4 align-middle">
          <input
            type="radio"
            name={name}
            checked={selected}
            disabled={!row.getCanSelect()}
            aria-label={`Select ${rowLabel(row)}`}
            onChange={() => row.toggleSelected(true)}
            className="peer m-0 size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-(--radio-border) bg-(--radio-background) shadow-(--radio-shadow) transition-[border-color,background-color] duration-100 ease-linear outline-none checked:bg-(--radio-background-checked) checked:shadow-(--radio-shadow-checked) focus-visible:border-(--radio-border-focus) focus-visible:shadow-(--shadow-focus-outset) disabled:cursor-default disabled:border-(--disabled-border) disabled:bg-(--disabled-container-strong) disabled:shadow-none"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto hidden size-2 rounded-full bg-(--radio-dot) peer-checked:block peer-disabled:bg-(--disabled-strong)"
          />
        </span>
      )}
    </Subscribe>
  )
}

const selectColumn: DataTableColumnDef<any> = {
  id: "select",
  header: ({ table }) => <DataTableSelectAll table={table} />,
  cell: ({ row }) => <DataTableSelectCell row={row} />,
  enableSorting: false,
  enableResizing: false,
}

const radioColumn: DataTableColumnDef<any> = {
  id: "select",
  header: () => <span className="sr-only">Choose a row to select</span>,
  cell: ({ row }) => <DataTableRadioCell row={row} />,
  enableSorting: false,
  enableResizing: false,
}

// Row actions

// Set by a virtualized body: keeps a row mounted while its menu is open.
const KeepRowMountedContext = React.createContext<
  ((rowId: string, keep: boolean) => void) | null
>(null)

// No fill, so a hovered or selected row shows through the button.
const rowActionsButtonClass = "size-5 bg-transparent align-middle"

function DataTableActionsCell<TData extends RowData>({
  row,
}: {
  row: DataTableRow<TData>
}) {
  const [open, setOpen] = React.useState(false)
  const keepMounted = React.useContext(KeepRowMountedContext)
  const { rowActions, onRowAction } = row.table.options
  // A function of the row is read when its menu opens.
  const actions = open
    ? typeof rowActions === "function"
      ? rowActions(row)
      : (rowActions ?? [])
    : []
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        keepMounted?.(row.id, next)
      }}
    >
      <DropdownMenuTrigger
        aria-label={`Show actions for ${rowLabel(row)}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon-xs" }),
          rowActionsButtonClass
        )}
      >
        <ChevronDownIcon className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.value}
            disabled={action.disabled}
            onClick={() => onRowAction?.(action, row)}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const actionsColumn: DataTableColumnDef<any> = {
  id: "actions",
  header: () => <span className="sr-only">Actions</span>,
  cell: ({ row }) => <DataTableActionsCell row={row} />,
  enableSorting: false,
  enableResizing: false,
}

// Headers

function DataTableHeaderMenu<TData extends RowData>({
  column,
  actions,
}: {
  column: DataTableColumn<TData>
  actions: readonly DataTableHeaderAction[]
}) {
  const [open, setOpen] = React.useState(false)
  const { onHeaderAction } = column.table.options
  // Checkable items keep room for the check, so the others line up.
  const checkable = actions.some((action) => action.checked !== undefined)
  return (
    <span className="absolute end-3 top-1/2 flex -translate-y-1/2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          aria-label={`Show ${columnLabel(column)} column actions`}
          className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
        >
          <ChevronDownIcon className="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action) =>
            action.checked === undefined ? (
              <DropdownMenuItem
                key={action.value}
                inset={checkable}
                disabled={action.disabled}
                onClick={() => onHeaderAction?.(action, column)}
              >
                {action.label}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuCheckboxItem
                key={action.value}
                checked={action.checked}
                disabled={action.disabled}
                onCheckedChange={() => {
                  // Base UI keeps the menu open on a checkbox item; close it
                  // here, so both bases close on a pick.
                  setOpen(false)
                  onHeaderAction?.(action, column)
                }}
              >
                {action.label}
              </DropdownMenuCheckboxItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  )
}

// Column resizing

const clampWidth = <TData extends RowData>(
  column: DataTableColumn<TData>,
  width: number
) =>
  Math.min(
    Math.max(width, column.columnDef.minSize ?? minColumnWidth),
    column.columnDef.maxSize ?? maxColumnWidth
  )

// Each data column's rendered width. A resize commits them all, so the others
// keep their widths; a column that measures 0, in a hidden table, keeps its size.
function measureColumns<TData extends RowData>(
  table: DataTableRow<TData>["table"],
  element: HTMLTableElement
) {
  const rows = element.tHead?.rows
  // Not .at(-1), so the file compiles for ES2020 targets.
  const cells = rows?.[rows.length - 1]?.cells
  const groups = table.getHeaderGroups()
  const widths: ColumnSizingState = {}
  groups[groups.length - 1]?.headers.forEach((header, index) => {
    const { column } = header
    if (isControlColumn(column.id)) return
    const width = cells?.[index]?.getBoundingClientRect().width
    widths[column.id] = clampWidth(
      column,
      width ? Math.round(width * 100) / 100 : column.getSize()
    )
  })
  return widths
}

const isRtl = <TData extends RowData>(
  column: DataTableColumn<TData>,
  cell: Element
) =>
  (column.table.options.columnResizeDirection ??
    getComputedStyle(cell).direction) === "rtl"

function commitWidth<TData extends RowData>(
  column: DataTableColumn<TData>,
  measured: ColumnSizingState,
  width: number
) {
  column.table.setColumnSizing((old) => ({
    ...measured,
    ...old,
    [column.id]: clampWidth(column, width),
  }))
}

// Arrow keys move the divider a step (Right widens, or Left in a right-to-left
// table), Page Up and Page Down ten steps, Home and End to the column's bounds.
function resizeWithKey<TData extends RowData>(
  column: DataTableColumn<TData>,
  input: HTMLInputElement,
  key: string
) {
  const cell = input.closest("th")
  const element = cell?.closest("table")
  if (!cell || !element) return false
  const forward = isRtl(column, cell) ? -resizeStep : resizeStep
  const steps: Record<string, number> = {
    ArrowRight: forward,
    ArrowLeft: -forward,
    ArrowUp: resizeStep,
    ArrowDown: -resizeStep,
    PageUp: resizeStep * 10,
    PageDown: -resizeStep * 10,
    Home: -Infinity,
    End: Infinity,
  }
  const step = steps[key]
  if (step === undefined) return false
  const measured = measureColumns(column.table, element)
  const current =
    column.table.atoms.columnSizing?.get()?.[column.id] ?? measured[column.id]
  commitWidth(column, measured, clampWidth(column, current ?? 0) + step)
  return true
}

// Drags a divider, or after a click that doesn't move, follows the mouse until
// the next click. Widths show on the colgroup as the pointer moves and commit
// when done. Escape cancels; a layer over the page keeps the cursor and takes the clicks.
function resizeWithPointer<TData extends RowData>(
  column: DataTableColumn<TData>,
  handle: HTMLElement,
  event: React.PointerEvent
) {
  const cell = handle.closest("th")
  const element = cell?.closest("table")
  if (!cell || !element) return
  const { table } = column
  const leaves = table.getAllLeafColumns()
  const cols = [
    ...element.querySelectorAll<HTMLElement>(":scope > colgroup > col"),
  ]
  const col = cols[leaves.indexOf(column)]
  if (!col) return
  event.preventDefault()

  const measured = measureColumns(table, element)
  const before = table.atoms.columnSizing?.get() ?? {}
  const widthOf = (leaf: DataTableColumn<TData>) =>
    clampWidth(leaf, before[leaf.id] ?? measured[leaf.id] ?? leaf.getSize())
  const start = widthOf(column)
  const direction = isRtl(column, cell) ? -1 : 1
  const live = table.options.columnResizeMode === "onChange"

  // While it moves, every column keeps its width and the table grows or
  // shrinks with this one.
  const saved = {
    cols: cols.map((each) => each.style.width),
    width: element.style.width,
    minWidth: element.style.minWidth,
  }
  let controls = 0
  let others = 0
  leaves.forEach((leaf, index) => {
    if (isControlColumn(leaf.id)) controls += controlWidth(leaf)
    else if (leaf !== column) {
      others += widthOf(leaf)
      if (cols[index]) cols[index].style.width = `${widthOf(leaf)}px`
    }
  })
  const show = (width: number) => {
    col.style.width = `${width}px`
    element.style.width =
      element.style.minWidth = `calc(${controls}rem + ${others + width}px)`
  }
  const restore = () => {
    cols.forEach((each, index) => (each.style.width = saved.cols[index]!))
    element.style.width = saved.width
    element.style.minWidth = saved.minWidth
  }
  show(start)
  table.setColumnResizing((old) => ({
    ...old,
    isResizingColumn: column.id,
    startOffset: event.clientX,
    startSize: start,
    deltaOffset: 0,
    deltaPercentage: 0,
    columnSizingStart: [[column.id, start]],
  }))

  let width = start
  let moved = false
  let following = false
  let frame = 0
  const follow = (clientX: number) => {
    const delta = clientX - event.clientX
    if (Math.abs(delta) > 2) moved = true
    width = clampWidth(column, start + delta * direction)
    show(width)
    if (live && !frame)
      frame = requestAnimationFrame(() => {
        frame = 0
        commitWidth(column, measured, width)
      })
  }

  const doc = handle.ownerDocument
  const layer = doc.createElement("div")
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483647",
    cursor: "col-resize",
    touchAction: "none",
  })
  doc.body.append(layer)
  // Keeps the pointer's events when it leaves the window.
  layer.setPointerCapture?.(event.pointerId)

  let done = false
  const finish = (save: boolean) => {
    if (done) return
    done = true
    cancelAnimationFrame(frame)
    layer.removeEventListener("pointermove", onMove)
    layer.removeEventListener("pointerdown", onDown)
    layer.removeEventListener("pointerup", onUp)
    layer.removeEventListener("pointercancel", onCancel)
    doc.removeEventListener("keydown", onKey, true)
    doc.defaultView?.removeEventListener("blur", onCancel)
    layer.remove()
    table.resetHeaderSizeInfo(true)
    if (live) {
      if (save) commitWidth(column, measured, width)
      else {
        restore()
        table.setColumnSizing(before)
      }
    } else {
      restore()
      if (save && width !== start) commitWidth(column, measured, width)
    }
  }
  const onMove = (move: PointerEvent) => {
    if (move.isPrimary) follow(move.clientX)
  }
  const onDown = (down: PointerEvent) => down.preventDefault()
  const onUp = (up: PointerEvent) => {
    if (!up.isPrimary) return
    if (up.button !== 0) return finish(false)
    follow(up.clientX)
    if (!moved && !following && up.pointerType === "mouse") {
      following = true
      return
    }
    finish(true)
  }
  const onCancel = () => finish(false)
  const onKey = (key: KeyboardEvent) => {
    if (key.key === "Escape") {
      key.preventDefault()
      key.stopPropagation()
      finish(false)
    } else if (key.key === "Tab" && following) finish(false)
  }
  layer.addEventListener("pointermove", onMove)
  layer.addEventListener("pointerdown", onDown)
  layer.addEventListener("pointerup", onUp)
  layer.addEventListener("pointercancel", onCancel)
  doc.addEventListener("keydown", onKey, true)
  doc.defaultView?.addEventListener("blur", onCancel)
}

// The handle straddles the next header's start; the last header's sits inside
// its end, with no line at rest.
const resizeHandleClass =
  "absolute inset-y-0 z-1 cursor-col-resize touch-none before:absolute before:inset-y-0 before:bg-(--table-resize-color) after:pointer-events-none after:absolute after:top-0 after:h-(--data-table-viewport) after:bg-(--table-resize-color-active) after:opacity-0 hover:before:w-1 hover:before:bg-(--table-resize-color-active) hover:after:opacity-100 peer-focus-visible:before:w-1 peer-focus-visible:before:bg-(--table-resize-color-active) peer-focus-visible:after:opacity-100 data-resizing:before:w-1 data-resizing:before:bg-(--table-resize-color-active) data-resizing:after:opacity-100"

function DataTableResizer<TData extends RowData>({
  column,
  last,
}: {
  column: DataTableColumn<TData>
  last: boolean
}) {
  // The slider reads the column's rendered width, which only layout knows
  // until a resize commits one, without a render.
  const sliderRef = React.useCallback((input: HTMLInputElement | null) => {
    const cell = input?.closest("th")
    if (!input || !cell) return
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(
        entry?.borderBoxSize?.[0]?.inlineSize ?? cell.offsetWidth
      )
      if (!width) return
      input.value = String(width)
      input.setAttribute("aria-valuetext", `${width} pixels`)
    })
    observer.observe(cell)
    return () => observer.disconnect()
  }, [])
  return (
    <>
      {/* A screen reader steps the value by resizeStep or sets it; aria-valuetext has the exact width. */}
      <input
        ref={sliderRef}
        type="range"
        aria-label={`${columnLabel(column)} column width`}
        min={column.columnDef.minSize ?? minColumnWidth}
        max={column.columnDef.maxSize ?? maxColumnWidth}
        step={resizeStep}
        className="peer sr-only"
        onKeyDown={(event) => {
          if (resizeWithKey(column, event.currentTarget, event.key))
            event.preventDefault()
        }}
        onChange={(event) => {
          const element = event.currentTarget.closest("table")
          if (!element) return
          commitWidth(
            column,
            measureColumns(column.table, element),
            Number(event.currentTarget.value)
          )
        }}
      />
      <Subscribe
        source={column.table.atoms.columnResizing!}
        selector={(resizing) => resizing?.isResizingColumn === column.id}
      >
        {(resizing) => (
          <span
            aria-hidden="true"
            data-slot="data-table-resize-handle"
            data-resizing={resizing || undefined}
            className={cn(
              resizeHandleClass,
              last
                ? "end-0 w-1 before:end-0 before:w-0 after:end-0 after:w-0"
                : "-end-3 w-6 before:end-3 before:w-px after:end-3 after:w-px"
            )}
            onPointerDown={(event) => {
              if (event.button === 0 && event.isPrimary)
                resizeWithPointer(column, event.currentTarget, event)
            }}
          />
        )}
      </Subscribe>
    </>
  )
}

function DataTableHead<TData extends RowData>({
  header,
  count,
}: {
  header: Header<Features, TData, unknown>
  /** Headers in its row. */
  count: number
}) {
  const { column } = header
  const meta = column.columnDef.meta
  // Each header stacks above the next, so the half of its resize handle
  // over the next one takes the pointer there.
  const style = { zIndex: 10 + count - header.index }
  if (header.isPlaceholder) return <TableHead scope="col" style={style} />
  // A control header renders its content bare, so the select-all box sits where the rows' do.
  if (isControlColumn(column.id))
    return (
      <TableHead scope="col" style={style} className={meta?.headerClassName}>
        <FlexRender header={header} />
      </TableHead>
    )
  const align = alignOf(meta)
  const menu = meta?.headerActions?.length ? (
    <DataTableHeaderMenu column={column} actions={meta.headerActions} />
  ) : null
  const label = <FlexRender header={header} />
  const resizer =
    header.subHeaders.length === 0 && column.getCanResize() ? (
      <DataTableResizer column={column} last={header.index === count - 1} />
    ) : null
  // A slider in a header would add its width to the column's name, so a
  // resizable header is named by its label.
  const name = resizer
    ? (meta?.label ??
      (typeof column.columnDef.header === "string"
        ? column.columnDef.header
        : undefined))
    : undefined
  if (!column.getCanSort())
    return (
      <TableHead
        scope="col"
        aria-label={name}
        style={style}
        className={cn(alignClass[align], meta?.headerClassName)}
      >
        <div className={cn("truncate", menu && "pe-6")}>{label}</div>
        {menu}
        {resizer}
      </TableHead>
    )
  const sorted = column.getIsSorted()
  return (
    // The sort button leaves room for the menu button.
    <TableHead
      scope="col"
      aria-label={name}
      aria-sort={
        sorted === "asc"
          ? "ascending"
          : sorted === "desc"
            ? "descending"
            : "none"
      }
      style={style}
      className={cn(
        menu && "[&[aria-sort]>button]:pe-8",
        meta?.headerClassName
      )}
    >
      <button
        type="button"
        className={cn(align === "end" && "justify-end")}
        // Two states, ascending first: the direction is explicit, so a page's
        // sorting options can't add a third.
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="truncate">{label}</span>
        <ArrowDownIcon />
      </button>
      {menu}
      {resizer}
    </TableHead>
  )
}

// Rows and cells

const isControlColumn = (id: string) =>
  id === "rowNumber" || id === "select" || id === "actions"

function DataTableCell<TData extends RowData>({
  cell,
}: {
  cell: Cell<Features, TData, unknown>
}) {
  const meta = cell.column.columnDef.meta
  const Component = meta?.rowHeader ? TableHead : TableCell
  const content = <FlexRender cell={cell} />
  if (isControlColumn(cell.column.id))
    return (
      <TableCell
        className={cn(
          cell.column.id === "actions" && "text-center",
          meta?.cellClassName
        )}
      >
        {content}
      </TableCell>
    )
  const { locale, timeZone, now } = cell.row.table.options
  const wrap = meta?.wrapText
  // Clipped text shows its full value in its title, never a link's label; a
  // relative value's is its date and time.
  const title =
    meta?.type === "relative"
      ? formatValue(
          cell.getValue(),
          { ...meta, type: "datetime" },
          locale,
          timeZone
        ) || undefined
      : !wrap && meta?.type !== "boolean"
        ? formatValue(cell.getValue(), meta, locale, timeZone, now) || undefined
        : undefined
  return (
    <Component
      scope={meta?.rowHeader ? "row" : undefined}
      className={cn(alignClass[alignOf(meta)], meta?.cellClassName)}
    >
      <div
        title={title}
        className={
          wrap
            ? cn(
                "break-words whitespace-pre-line",
                meta.wrapTextMaxLines && "line-clamp-(--data-table-lines)"
              )
            : "truncate"
        }
        style={
          wrap && meta.wrapTextMaxLines
            ? ({
                "--data-table-lines": meta.wrapTextMaxLines,
              } as React.CSSProperties)
            : undefined
        }
      >
        {content}
      </div>
    </Component>
  )
}

type DataTableRowProps<TData extends RowData> = {
  row: DataTableRow<TData>
  // Change when the columns do, and re-render the memoized row.
  cells: Cell<Features, TData, unknown>[]
  // Only compared by the memo: locale, time zone and now change how cells format.
  format: string
  index: number
  number: number
  measureRef?: (node: HTMLTableRowElement | null) => void
  ariaRowIndex?: number
}

function DataTableRowImpl<TData extends RowData>({
  row,
  cells,
  index,
  number,
  measureRef,
  ariaRowIndex,
}: DataTableRowProps<TData>) {
  return (
    // The row follows selection too: a selected row changes color.
    <Subscribe
      source={row.table.atoms.rowSelection!}
      selector={(selection) => Boolean(selection?.[row.id])}
    >
      {(selected) => (
        <TableRow
          ref={measureRef}
          data-index={index}
          data-row-id={row.id}
          data-state={selected ? "selected" : undefined}
          aria-selected={
            row.table.options.enableRowSelection === false
              ? undefined
              : selected
          }
          aria-rowindex={ariaRowIndex}
        >
          <RowNumberContext.Provider value={number}>
            {cells.map((cell) => (
              <DataTableCell key={cell.id} cell={cell} />
            ))}
          </RowNumberContext.Provider>
        </TableRow>
      )}
    </Subscribe>
  )
}

const DataTableRowMemo = React.memo(DataTableRowImpl) as typeof DataTableRowImpl

// Virtualization

const defaultRowHeight = 37
// The window a server renders before the browser measures the container.
const initialRect = { width: 0, height: 720 }

function DataTableVirtualBody<TData extends RowData>({
  rows,
  columnCount,
  scrollElement,
  headerHeight,
  headerRows,
  format,
  rowNumberOffset,
  overscan = 10,
  estimateRowHeight,
  footer,
}: {
  rows: DataTableRow<TData>[]
  columnCount: number
  scrollElement: HTMLElement | null
  headerHeight: number
  headerRows: number
  format: string
  rowNumberOffset: number
  overscan?: number
  estimateRowHeight?: number
  footer: React.ReactNode
}) {
  // Kept mounted: the focused row and two neighbours each side, so Tab continues
  // in order after a wheel scroll, and rows with an open menu, whose focus is in a portal.
  const [focusedRowId, setFocusedRowId] = React.useState<string | null>(null)
  const [menuRowIds, setMenuRowIds] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )
  // Until the page sets one, the estimate is the first row measured.
  const [measuredHeight, setMeasuredHeight] = React.useState<number>()
  const estimate = estimateRowHeight ?? measuredHeight ?? defaultRowHeight

  const keepMounted = React.useCallback((rowId: string, keep: boolean) => {
    const update = () =>
      setMenuRowIds((previous) => {
        if (previous.has(rowId) === keep) return previous
        const next = new Set(previous)
        if (keep) next.add(rowId)
        else next.delete(rowId)
        return next
      })
    if (keep) return update()
    // A closing menu returns focus to its trigger after it closes, Radix in
    // a timeout. Keep the row until focus moves, when the focused row keeps
    // it, or a moment passes, for a close that moves no focus.
    let done = false
    const release = () => {
      if (done) return
      done = true
      document.removeEventListener("focusin", onFocusIn)
      update()
    }
    const onFocusIn = () => requestAnimationFrame(release)
    document.addEventListener("focusin", onFocusIn)
    setTimeout(release, 500)
  }, [])

  const keptIndexes = React.useMemo(() => {
    if (!focusedRowId && menuRowIds.size === 0) return []
    const kept = new Set<number>()
    rows.forEach((row, index) => {
      if (row.id === focusedRowId)
        for (let near = index - 2; near <= index + 2; near++)
          if (near >= 0 && near < rows.length) kept.add(near)
      if (menuRowIds.has(row.id)) kept.add(index)
    })
    return [...kept].sort((a, b) => a - b)
  }, [rows, focusedRowId, menuRowIds])

  const rangeExtractor = React.useCallback(
    (range: Range) => {
      const base = defaultRangeExtractor(range)
      if (keptIndexes.length === 0) return base
      const all = new Set(base)
      for (const index of keptIndexes) if (index < range.count) all.add(index)
      return [...all].sort((a, b) => a - b)
    },
    [keptIndexes]
  )
  const getItemKey = React.useCallback(
    (index: number) => rows[index]?.id ?? index,
    [rows]
  )

  // A reader can scroll server-rendered rows before hydration, and the virtualizer
  // attaches at the top, so the position is read before it attaches and restored after.
  const restoreTo = React.useRef<number | null>(null)
  React.useLayoutEffect(() => {
    if (scrollElement) restoreTo.current = scrollElement.scrollTop
  }, [scrollElement])

  const virtualizer = useVirtualizer<HTMLElement, HTMLTableRowElement>({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimate,
    overscan,
    getItemKey,
    rangeExtractor,
    initialRect,
    scrollMargin: headerHeight,
    scrollPaddingStart: headerHeight,
    // A row that measures 0, in a hidden table, keeps its estimate, or the
    // window would grow until every row renders.
    measureElement: (element, entry, instance) => {
      const size = measureElement(element, entry, instance)
      if (!size) return instance.options.estimateSize(0)
      // Rows measured in one commit all see the old state: keep the first.
      if (estimateRowHeight === undefined && measuredHeight === undefined)
        setMeasuredHeight((first) => first ?? size)
      return size
    },
  })

  React.useLayoutEffect(() => {
    if (restoreTo.current) virtualizer.scrollToOffset(restoreTo.current)
    restoreTo.current = null
  }, [scrollElement, virtualizer])

  const items = virtualizer.getVirtualItems()
  // Without a height the container grows to fit, and every row renders.
  if (scrollElement && rows.length > 200 && items.length === rows.length)
    warnOnce(
      scrollElement,
      'DataTable: virtualize renders every row, because the table has no height. Give DataTable one, like className="h-96".'
    )
  const rendered: React.ReactNode[] = []
  let offset = headerHeight
  for (const item of items) {
    const gap = item.start - offset
    if (gap > 0)
      rendered.push(
        <DataTableSpacer
          key={rendered.length === 0 ? "lead" : `gap-${item.index}`}
          height={gap}
          columnCount={columnCount}
        />
      )
    const row = rows[item.index]!
    rendered.push(
      <DataTableRowMemo
        key={row.id}
        row={row}
        cells={row.getAllCells()}
        format={format}
        index={item.index}
        number={item.index + 1 + rowNumberOffset}
        measureRef={virtualizer.measureElement}
        ariaRowIndex={item.index + headerRows + 1}
      />
    )
    offset = item.end
  }
  const tail = virtualizer.getTotalSize() + headerHeight - offset
  if (tail > 0)
    rendered.push(
      <DataTableSpacer key="tail" height={tail} columnCount={columnCount} />
    )

  return (
    <KeepRowMountedContext.Provider value={keepMounted}>
      <TableBody
        onFocus={(event) => {
          const id = (event.target as Element)
            .closest("tr[data-row-id]")
            ?.getAttribute("data-row-id")
          if (id) setFocusedRowId(id)
        }}
        onBlur={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null))
            return
          // Focus left the window, not the row: it returns there.
          if (event.target === document.activeElement) return
          setFocusedRowId(null)
        }}
      >
        {rendered}
        {footer}
      </TableBody>
    </KeepRowMountedContext.Provider>
  )
}

// The rows that aren't rendered: no padding, border or hover, and not announced.
function DataTableSpacer({
  height,
  columnCount,
}: {
  height: number
  columnCount: number
}) {
  return (
    <tr aria-hidden="true" data-slot="data-table-spacer">
      <td
        aria-hidden="true"
        colSpan={columnCount}
        style={{ height, padding: 0, border: 0 }}
      />
    </tr>
  )
}

// Loading more on scroll

// One IntersectionObserver, with the viewport as its root, so clipping by
// the table's own scroll container counts, with a height or without.
function useLoadOnScroll({
  enabled,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rowCount,
}: {
  enabled: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore?: () => void
  rowCount: number
}) {
  const [stalled, setStalled] = React.useState(false)
  const visible = React.useRef(false)
  const requestedAt = React.useRef<number | null>(null)
  const wasFetching = React.useRef(false)
  const observed = React.useRef<{
    observer: IntersectionObserver
    node: Element
  } | null>(null)
  const maybeLoad = React.useRef(() => {})

  React.useLayoutEffect(() => {
    maybeLoad.current = () => {
      if (!enabled || !hasNextPage || isFetchingNextPage || stalled) return
      // One request per row count: a page that's still on its way, or one
      // that added nothing, doesn't ask again.
      if (!visible.current || requestedAt.current === rowCount) return
      requestedAt.current = rowCount
      onLoadMore?.()
    }
  })

  const zoneRef = React.useCallback((node: HTMLDivElement | null) => {
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = Boolean(entry?.isIntersecting)
      maybeLoad.current()
    })
    observer.observe(node)
    observed.current = { observer, node }
    return () => {
      observer.disconnect()
      observed.current = null
    }
  }, [])

  React.useLayoutEffect(() => {
    // A finished request that added nothing stops loading on scroll; the
    // Load more button retries.
    if (
      wasFetching.current &&
      !isFetchingNextPage &&
      requestedAt.current === rowCount
    )
      setStalled(true)
    wasFetching.current = isFetchingNextPage
    // New rows move the zone. Observing again reports where it is now; the
    // last report is stale.
    if (observed.current) {
      const { observer, node } = observed.current
      observer.unobserve(node)
      observer.observe(node)
    }
  }, [rowCount, isFetchingNextPage])

  return {
    zoneRef,
    stalled,
    retry: () => {
      setStalled(false)
      requestedAt.current = rowCount
    },
  }
}

// After the last row: the spinner while a page loads on scroll, and the zone
// that starts it, tall enough that a row taller than its estimate can't leave
// the end just out of view.
function DataTableBodyEnd({
  columnCount,
  zoneRef,
  fetching,
}: {
  columnCount: number
  zoneRef?: (node: HTMLDivElement | null) => void
  fetching: boolean
}) {
  return (
    <>
      {fetching ? (
        <tr data-slot="data-table-loading">
          <td colSpan={columnCount} className="py-3">
            <Spinner className="mx-auto block" />
          </td>
        </tr>
      ) : null}
      {zoneRef ? (
        <tr aria-hidden="true" data-slot="data-table-sentinel">
          <td
            aria-hidden="true"
            colSpan={columnCount}
            style={{ height: 0, padding: 0, border: 0, position: "relative" }}
          >
            <div
              ref={zoneRef}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-75"
            />
          </td>
        </tr>
      ) : null}
    </>
  )
}

// DataTable

type DataTableProps<TData extends RowData> = Omit<
  React.ComponentProps<"table">,
  "children"
> & {
  /** The table from useDataTable. */
  table: DataTableInstance<TData, any>
  /** A first load: placeholder rows while there are none. */
  isLoading?: boolean
  /** More rows can load: shows Load more, or loads on scroll. */
  hasNextPage?: boolean
  /** A next page is loading. */
  isFetchingNextPage?: boolean
  /** Loads the next page. The page appends its rows to data. */
  onLoadMore?: () => void
  /** Loads the next page on scroll instead of with the button, which stays as a retry. */
  loadMoreOnScroll?: boolean
  /** Renders only the rows in view. Needs a height on DataTable. */
  virtualize?: boolean | { overscan?: number; estimateRowHeight?: number }
  /** What the table shows when it has no rows. */
  empty?: React.ReactNode
}

// A column's width from columnSizing or size, or none, to share what the others leave.
const columnWidth = <TData extends RowData>(
  column: DataTableColumn<TData>,
  sizing: ColumnSizingState
) =>
  isControlColumn(column.id)
    ? `${controlWidth(column)}rem`
    : sizing[column.id] !== undefined || column.columnDef.size !== undefined
      ? `${column.getSize()}px`
      : undefined

// A fixed layout gives unsized columns only what's left, so the table is at
// least a minSize wider per unsized column and scrolls sideways instead. Once
// every column has a columnSizing entry, the table is as wide as its columns.
function tableStyle<TData extends RowData>(
  columns: DataTableColumn<TData>[],
  sizing: ColumnSizingState
): React.CSSProperties {
  let controls = 0
  let data = 0
  let entries = 0
  let pixels = 0
  for (const column of columns) {
    if (isControlColumn(column.id)) {
      controls += controlWidth(column)
      continue
    }
    data++
    if (sizing[column.id] !== undefined) entries++
    pixels +=
      columnWidth(column, sizing) !== undefined
        ? column.getSize()
        : (column.columnDef.minSize ?? minColumnWidth)
  }
  const width = `calc(${controls}rem + ${pixels}px)`
  return data > 0 && entries === data
    ? { width, minWidth: width }
    : { minWidth: width }
}

function DataTable<TData extends RowData>({
  table,
  className,
  style,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  loadMoreOnScroll = false,
  virtualize = false,
  empty,
  ...props
}: DataTableProps<TData>) {
  const radioName = React.useId()
  const [scrollElement, setScrollElement] =
    React.useState<HTMLDivElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  // Table's container is the scroll container.
  const wrapperRef = React.useCallback((node: HTMLDivElement | null) => {
    const container = node?.querySelector<HTMLDivElement>(
      ":scope > [data-slot=table-container]"
    )
    setScrollElement(container ?? null)
    if (!container) return
    // A resize's guide line reaches the bottom of the visible rows.
    const measure = () =>
      container.style.setProperty(
        "--data-table-viewport",
        `${container.clientHeight}px`
      )
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    const table = container.querySelector("table")
    if (table) observer.observe(table)
    measure()
    return () => observer.disconnect()
  }, [])

  // The header's height keeps focused rows clear of it (scroll-padding),
  // and places virtual rows below it.
  const headerRef = React.useCallback(
    (node: HTMLTableSectionElement | null) => {
      if (!node) return
      const measure = () => setHeaderHeight(node.getBoundingClientRect().height)
      const observer = new ResizeObserver(measure)
      observer.observe(node)
      measure()
      return () => observer.disconnect()
    },
    []
  )

  const rowCount = table.getRowModel().rows.length
  const loading = useLoadOnScroll({
    enabled: loadMoreOnScroll,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    rowCount,
  })
  const showButton =
    hasNextPage && onLoadMore && (!loadMoreOnScroll || loading.stalled)

  return (
    <RadioNameContext.Provider value={radioName}>
      {/* The table's own container is the one scroll container, so the header
          sticks inside it; the border and radius move to it. */}
      <div
        ref={wrapperRef}
        data-slot="data-table"
        style={
          {
            "--data-table-header-height": `${headerHeight}px`,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "flex min-h-0 flex-col gap-2",
          "*:data-[slot=table-container]:min-h-0 *:data-[slot=table-container]:overflow-auto *:data-[slot=table-container]:rounded-(--table-radius) *:data-[slot=table-container]:border *:data-[slot=table-container]:border-border *:data-[slot=table-container]:border-x-(color:--table-border-inline) *:data-[slot=table-container]:bg-background *:data-[slot=table-container]:scroll-pt-(--data-table-header-height) *:data-[slot=table-container]:scroll-pb-2 *:data-[slot=table-container]:[overflow-anchor:none]",
          className
        )}
      >
        <DataTableContent
          table={table}
          props={props}
          headerRef={headerRef}
          headerHeight={headerHeight}
          scrollElement={scrollElement}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreOnScroll={loadMoreOnScroll}
          zoneRef={loading.zoneRef}
          virtualize={virtualize}
          empty={empty}
        />
        {showButton ? (
          <div className="flex shrink-0 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                if (isFetchingNextPage) return
                loading.retry()
                onLoadMore?.()
              }}
            >
              {isFetchingNextPage ? <Spinner aria-hidden="true" /> : null}
              Load more
            </Button>
          </div>
        ) : null}
      </div>
    </RadioNameContext.Provider>
  )
}

// The page re-renders on every sort and selection change, even with a narrowing
// selector, since useDataTable keeps both in React state; selection re-renders
// only the cells that show it.
function DataTableContent<TData extends RowData>({
  table,
  props,
  headerRef,
  headerHeight,
  scrollElement,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  loadMoreOnScroll,
  zoneRef,
  virtualize,
  empty,
}: {
  table: DataTableInstance<TData, any>
  props: Omit<React.ComponentProps<"table">, "children">
  headerRef: (node: HTMLTableSectionElement | null) => void
  headerHeight: number
  scrollElement: HTMLElement | null
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  loadMoreOnScroll: boolean
  zoneRef: (node: HTMLDivElement | null) => void
  virtualize: NonNullable<DataTableProps<TData>["virtualize"]>
  empty: React.ReactNode
}) {
  const rows = table.getRowModel().rows
  const columns = table.getAllLeafColumns()
  const headerGroups = table.getHeaderGroups()
  const virtual = Boolean(virtualize)
  const { overscan, estimateRowHeight } =
    typeof virtualize === "object" ? virtualize : {}
  const { locale, timeZone, now } = table.options
  const format = `${locale}|${timeZone}|${now instanceof Date ? now.getTime() : now}`
  const sizing = table.options.state?.columnSizing ?? {}
  const rowNumberOffset = table.options.rowNumberOffset ?? 0

  const sort = table.options.state?.sorting?.[0]
  const sortedColumn = sort ? table.getColumn(sort.id) : undefined
  const status = sortedColumn
    ? `Sorted by ${columnLabel(sortedColumn)}, ${sort!.desc ? "descending" : "ascending"}`
    : ""

  const end = (
    <DataTableBodyEnd
      columnCount={columns.length}
      zoneRef={loadMoreOnScroll ? zoneRef : undefined}
      fetching={loadMoreOnScroll && isFetchingNextPage}
    />
  )

  let body: React.ReactNode
  if (rows.length === 0) {
    body = (
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }, (_, index) => (
            <tr key={index} aria-hidden="true" data-slot="data-table-stencil">
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {isControlColumn(column.id) ? null : (
                    <div className="flex h-[1lh] items-center">
                      <Skeleton
                        className={cn(
                          "h-2 w-3/4",
                          alignOf(column.columnDef.meta) === "end" && "ms-auto"
                        )}
                      />
                    </div>
                  )}
                </TableCell>
              ))}
            </tr>
          ))
        ) : (
          <tr data-slot="data-table-empty">
            <TableCell
              colSpan={columns.length || 1}
              className="py-6 text-center whitespace-normal text-muted-foreground"
            >
              {empty ?? "No items to display."}
            </TableCell>
          </tr>
        )}
      </TableBody>
    )
  } else if (virtual) {
    body = (
      <DataTableVirtualBody
        rows={rows}
        columnCount={columns.length}
        scrollElement={scrollElement}
        headerHeight={headerHeight}
        headerRows={headerGroups.length}
        format={format}
        rowNumberOffset={rowNumberOffset}
        overscan={overscan}
        estimateRowHeight={estimateRowHeight}
        footer={end}
      />
    )
  } else {
    body = (
      <TableBody>
        {rows.map((row, index) => (
          <DataTableRowMemo
            key={row.id}
            row={row}
            cells={row.getAllCells()}
            format={format}
            index={index}
            number={index + 1 + rowNumberOffset}
          />
        ))}
        {end}
      </TableBody>
    )
  }

  return (
    <>
      <span aria-live="polite" className="sr-only">
        {status}
      </span>
      {/* Only a virtualized table leaves rows out of the DOM; -1 is ARIA's
          "unknown", while more rows can load. */}
      <Table
        {...props}
        aria-busy={isLoading || isFetchingNextPage || undefined}
        aria-rowcount={
          virtual
            ? hasNextPage
              ? -1
              : rows.length + headerGroups.length
            : undefined
        }
        className="table-fixed rounded-none border-0"
        style={tableStyle(columns, sizing)}
      >
        <colgroup>
          {columns.map((column) => (
            <col
              key={column.id}
              style={{ width: columnWidth(column, sizing) }}
            />
          ))}
        </colgroup>
        <TableHeader ref={headerRef} className="[&_th]:sticky [&_th]:top-0">
          {headerGroups.map((group, index) => (
            <TableRow
              key={group.id}
              aria-rowindex={virtual ? index + 1 : undefined}
            >
              {group.headers.map((header) => (
                <DataTableHead
                  key={header.id}
                  header={header}
                  count={group.headers.length}
                />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {body}
      </Table>
    </>
  )
}

export {
  DataTable,
  createDataTableColumnHelper,
  useDataTable,
  type DataTableColumn,
  type DataTableColumnDef,
  type DataTableColumnHelper,
  type DataTableColumnMeta,
  type DataTableColumnType,
  type DataTableHeaderAction,
  type DataTableInstance,
  type DataTableProps,
  type DataTableRow,
  type DataTableRowAction,
  type ColumnSizingState,
  type RowSelectionState,
  type SortingState,
  type UseDataTableOptions,
}
