"use client"

import * as React from "react"
import { FlexRender } from "@tanstack/react-table"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DataTable,
  useDataTable,
  type DataTableInstance,
  type DataTableRow,
  type DataTableRowAction,
  type UseDataTableOptions,
} from "@/components/wisty/data-table"
import { Icon } from "@/components/wisty/icon"

type IconName = React.ComponentProps<typeof Icon>["name"]

/** A record in the list. Any other fields are the columns' to read. */
interface RelatedListRecord {
  /** The record's Id. */
  id: string
}

/** One of the list's actions, like New. */
interface RelatedListAction extends DataTableRowAction {
  /** What a screen reader hears when the label alone is unclear: "New Contact". */
  ariaLabel?: string
}

interface RelatedListProps<TRecord extends RelatedListRecord> extends Omit<
  React.ComponentProps<"div">,
  "title" | "children"
> {
  /** The related list's label, plural: "Contacts". Names the card. */
  title: string
  /** The related object's icon: "standard:contact". */
  icon: IconName
  /** The records to show, in order; the block shows the first `limit`. `null` when they couldn't load. */
  records: TRecord[] | null
  /** The columns, from createDataTableColumnHelper. One is `meta.rowHeader`, and each has a text `header` or `meta.label`. */
  columns: UseDataTableOptions<TRecord>["columns"]
  /** How many related records there are. Unknown (`undefined` or `null`) shows no count. */
  count?: number | null
  /** There are more than `count`, as a capped count says: shows "(6+)". */
  hasMore?: boolean
  /** The most records shown. Default 6. */
  limit?: number
  /** The View All page. Links the title, and adds View All when there are records. */
  href?: string
  /** "table" or "tiles", as Lightning's Related List Type. A table shows tiles below 30rem. Default "table". */
  variant?: "table" | "tiles"
  /** The list's actions. The first is a button and the rest are in a menu after it. */
  actions?: RelatedListAction[]
  onAction?: (action: RelatedListAction) => void
  /** Each record's menu, or a function that returns a record's actions when its menu opens. */
  rowActions?:
    | readonly DataTableRowAction[]
    | ((record: TRecord) => readonly DataTableRowAction[])
  onRowAction?: (action: DataTableRowAction, record: TRecord) => void
  /** Draws placeholders while the records load, or marks the list busy over the ones it has. */
  loading?: boolean
  /** A BCP 47 locale for numbers and dates. Default "en-US". */
  locale?: string
  /** An IANA time zone for date-times. Default "UTC". */
  timeZone?: string
  /** An ISO 4217 code for currency columns with no `currencyCode`. Default "USD". */
  currency?: string
}

// Until the width is known both forms render and the container queries pick one, so a server
// render is right; after, only one renders, so a resize unmounts the other with any menu open in it.
function useWide() {
  const [wide, setWide] = React.useState<boolean | null>(null)
  const ref = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const rem = () =>
      parseFloat(getComputedStyle(node.ownerDocument.documentElement).fontSize)
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.borderBoxSize?.[0]?.inlineSize ?? node.offsetWidth
      setWide(width > 0 ? width >= 30 * rem() : null)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [wide, ref] as const
}

const tileColumns =
  "grid-cols-1 @min-[36rem]/related-list:grid-cols-2 @min-[54rem]/related-list:grid-cols-3"

const rowActionsButton = cn(
  buttonVariants({ variant: "outline", size: "icon-xs" }),
  "size-5 bg-transparent"
)

function labelOf<TRecord extends RelatedListRecord>(
  table: DataTableInstance<TRecord, any>,
  row: DataTableRow<TRecord>
) {
  const own = table.options.getRowLabel?.(row)
  if (own) return own
  const header = table
    .getAllLeafColumns()
    .find((column) => column.columnDef.meta?.rowHeader)
  const value = header ? row.getValue(header.id) : undefined
  return value === null || value === undefined ? row.id : String(value)
}

// A function's actions are read when the menu opens.
function RelatedListMenu({
  actions,
  onAction,
  label,
  triggerClassName,
  children,
}: {
  actions: () => readonly DataTableRowAction[]
  onAction: (action: DataTableRowAction) => void
  label: string
  triggerClassName: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger aria-label={label} className={triggerClassName}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(open ? actions() : []).map((action) => (
          <DropdownMenuItem
            key={action.value}
            disabled={action.disabled}
            onClick={() => onAction(action)}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Tiles keep the card's spacing above View All; the table meets it.
const tilesClass =
  "group-has-data-[slot=card-footer]/card:pb-(--card-spacing-block)"

// One tile per record: the row header's cell as the title, the other columns under their labels.
function RelatedListTiles<TRecord extends RelatedListRecord>({
  table,
  icon,
  className,
}: {
  table: DataTableInstance<TRecord, any>
  icon: IconName
  className?: string
}) {
  const { rowActions, onRowAction } = table.options
  return (
    <ItemGroup className={cn("grid gap-0", tilesClass, className)}>
      {table.getRowModel().rows.map((row) => {
        const cells = row
          .getAllCells()
          .filter((cell) => cell.column.id !== "actions")
        const title = cells.find(
          (cell) => cell.column.columnDef.meta?.rowHeader
        )
        const details = cells.filter((cell) => cell !== title)
        const label = labelOf(table, row)
        return (
          <Item
            key={row.id}
            role="listitem"
            className="flex-nowrap items-start gap-3 px-(--card-spacing-inline) py-1"
          >
            <ItemMedia className="self-start">
              <Icon name={icon} />
            </ItemMedia>
            <ItemContent className="min-w-0 gap-0">
              <ItemTitle role="heading" aria-level={3} className="block">
                {title ? <FlexRender cell={title} /> : label}
              </ItemTitle>
              <dl className="grid grid-cols-[30%_minmax(0,1fr)] text-(length:--font-size-base) leading-(--line-height-base)">
                {details.map((cell) => {
                  const { header, meta } = cell.column.columnDef
                  return (
                    <React.Fragment key={cell.id}>
                      <dt className="truncate pe-3 text-muted-foreground">
                        {meta?.label ??
                          (typeof header === "string"
                            ? header
                            : cell.column.id)}
                        :
                      </dt>
                      <dd className="truncate">
                        <FlexRender cell={cell} />
                      </dd>
                    </React.Fragment>
                  )
                })}
              </dl>
            </ItemContent>
            {rowActions !== undefined ? (
              <ItemActions className="self-start">
                <RelatedListMenu
                  actions={() =>
                    typeof rowActions === "function"
                      ? rowActions(row)
                      : rowActions
                  }
                  onAction={(action) => onRowAction?.(action, row)}
                  label={`Show actions for ${label}`}
                  triggerClassName={rowActionsButton}
                >
                  <ChevronDownIcon className="size-3" />
                </RelatedListMenu>
              </ItemActions>
            ) : null}
          </Item>
        )
      })}
    </ItemGroup>
  )
}

// Hidden from screen readers: the card already says it's busy.
function RelatedListTilesLoading({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("grid", tilesClass, className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex items-start gap-3 px-(--card-spacing-inline) py-1"
        >
          <Skeleton className="size-8 shrink-0 rounded-(--icon-radius)" />
          <div className="flex min-w-0 flex-1 flex-col gap-2 py-1.5">
            <Skeleton className="h-2 w-2/5" />
            <Skeleton className="h-2 w-3/4" />
            <Skeleton className="h-2 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function RelatedList<TRecord extends RelatedListRecord>({
  title,
  icon,
  records,
  columns,
  count,
  hasMore = false,
  limit = 6,
  href,
  variant = "table",
  actions = [],
  onAction,
  rowActions,
  onRowAction,
  loading = false,
  locale = "en-US",
  timeZone = "UTC",
  currency = "USD",
  className,
  ...props
}: RelatedListProps<TRecord>) {
  const [wide, headerRef] = useWide()
  const shown = React.useMemo(() => {
    const most = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 6
    return (records ?? []).slice(0, most)
  }, [records, limit])

  // Currency columns without a code format in the list's currency.
  const ownColumns = React.useMemo(
    () =>
      columns.map((column) =>
        column.meta?.type === "currency" && !column.meta.currencyCode
          ? { ...column, meta: { ...column.meta, currencyCode: currency } }
          : column
      ),
    [columns, currency]
  )

  const table = useDataTable({
    columns: ownColumns,
    data: shown,
    getRowId: (record) => record.id,
    enableSorting: false,
    enableColumnResizing: false,
    rowActions:
      rowActions === undefined
        ? undefined
        : typeof rowActions === "function"
          ? (row) => rowActions(row.original)
          : rowActions,
    onRowAction:
      rowActions === undefined
        ? undefined
        : (action, row) => onRowAction?.(action, row.original),
    locale,
    timeZone,
  })

  const waiting = loading && shown.length === 0
  const unavailable = records === null && !loading
  const hasBody = waiting || unavailable || shown.length > 0
  const hasFooter = href !== undefined && shown.length > 0

  const countText =
    count === null || count === undefined
      ? null
      : `(${new Intl.NumberFormat(locale).format(count)}${hasMore ? "+" : ""})`
  const [first, ...rest] = actions
  const run = (action: DataTableRowAction) =>
    onAction?.(action as RelatedListAction)

  const tiles = (columnsClass?: string) =>
    waiting ? (
      <RelatedListTilesLoading className={columnsClass} />
    ) : (
      <RelatedListTiles table={table} icon={icon} className={columnsClass} />
    )
  const tableForm = (
    <DataTable
      table={table}
      isLoading={waiting}
      aria-label={title}
      className={cn(
        "*:data-[slot=table-container]:rounded-none *:data-[slot=table-container]:border-x-0",
        hasFooter && "*:data-[slot=table-container]:border-b-0"
      )}
    />
  )

  return (
    <Card
      data-slot="related-list"
      data-variant={variant}
      role="region"
      aria-label={title}
      aria-busy={loading || undefined}
      className={cn("@container/related-list gap-0", className)}
      {...props}
    >
      <CardHeader
        ref={headerRef}
        className={cn(hasBody && "pb-(--card-spacing-block)")}
      >
        <CardTitle
          role="heading"
          aria-level={2}
          className="row-span-2 flex min-w-0 items-center gap-3 self-center"
        >
          <Icon name={icon} size="small" />
          {href !== undefined ? (
            <a
              href={href}
              className="flex min-w-0 gap-1 rounded-(--radius-1) outline-none hover:underline focus-visible:underline focus-visible:shadow-(--shadow-focus)"
            >
              <span className="truncate">{title}</span>
              {/* A space, so the name reads "Contacts (2)"; flex lays the gap. */}
              {countText ? (
                <>
                  {" "}
                  <span className="shrink-0">{countText}</span>
                </>
              ) : null}
            </a>
          ) : (
            <span className="flex min-w-0 gap-1">
              <span className="truncate">{title}</span>
              {countText ? (
                <>
                  {" "}
                  <span className="shrink-0">{countText}</span>
                </>
              ) : null}
            </span>
          )}
        </CardTitle>
        {first ? (
          <CardAction>
            {wide !== false ? (
              <ButtonGroup className="hidden @min-[30rem]/related-list:flex">
                <Button
                  variant="outline"
                  disabled={first.disabled}
                  aria-label={first.ariaLabel}
                  onClick={() => run(first)}
                >
                  {first.label}
                </Button>
                {rest.length > 0 ? (
                  <RelatedListMenu
                    actions={() => rest}
                    onAction={run}
                    label={`Show more actions for ${title}`}
                    triggerClassName={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                  >
                    <ChevronDownIcon />
                  </RelatedListMenu>
                ) : null}
              </ButtonGroup>
            ) : null}
            {wide !== true ? (
              <RelatedListMenu
                actions={() => actions}
                onAction={run}
                label={`Show actions for ${title}`}
                triggerClassName={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "@min-[30rem]/related-list:hidden"
                )}
              >
                <ChevronDownIcon />
              </RelatedListMenu>
            ) : null}
          </CardAction>
        ) : null}
      </CardHeader>
      {hasBody ? (
        <CardContent className="px-0">
          {unavailable ? (
            <p className="px-(--card-spacing-inline) text-muted-foreground">
              {title} aren&apos;t available.
            </p>
          ) : variant === "tiles" ? (
            tiles(tileColumns)
          ) : (
            // Tiles in a narrow card, the table in a wide one.
            <>
              {wide !== false ? (
                <div className="hidden @min-[30rem]/related-list:block">
                  {tableForm}
                </div>
              ) : null}
              {wide !== true ? (
                <div className="@min-[30rem]/related-list:hidden">
                  {tiles()}
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      ) : null}
      {hasFooter ? (
        <CardFooter>
          <a href={href} className={buttonVariants({ variant: "link" })}>
            View All <span className="sr-only">{title}</span>
          </a>
        </CardFooter>
      ) : null}
    </Card>
  )
}

export { RelatedList }
export type { RelatedListAction, RelatedListProps, RelatedListRecord }
