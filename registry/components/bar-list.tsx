"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { formatMetricValue } from "@/components/wisty/metric"

interface BarListItem {
  /** A stable id for selection and keys. Default the label. */
  id?: string
  /** What the row is, like an account name. */
  label: string
  /** The number. null is a missing value: it sorts last and reads "No data". */
  value: number | null
  /** A second line under the label, like the owner. */
  detail?: string
  /** Makes the row a link. Ignored when the list is selectable. */
  href?: string
}

interface BarListMarker {
  /** Where the line sits, on the bars' scale. */
  value: number
  /** Its name, shown before its value under the list, like "Quota". */
  label?: string
}

interface BarListProps extends Omit<
  React.ComponentProps<"ol">,
  "children" | "color"
> {
  items: BarListItem[]
  /** Intl.NumberFormat options for values. Without a notation, 10,000 and up read compact. */
  format?: Intl.NumberFormatOptions
  /** A BCP 47 locale for numbers. Default "en-US". */
  locale?: string
  /** Default "descending". "none" keeps the given order. */
  sort?: "descending" | "ascending" | "none"
  /** Shows only the first rows after sorting. */
  limit?: number
  /** The whole population's total, to show each row's share of it. */
  total?: number
  /**
   * The scale's end, shared by lists side by side so their bars compare.
   * Grows to fit the largest value and the marker if they're larger.
   */
  max?: number
  /** A reference value drawn across every bar, like a quota, with its label. */
  marker?: BarListMarker
  /** Which chart color the bars take, --chart-1 to --chart-6. Default 1. */
  color?: 1 | 2 | 3 | 4 | 5 | 6
  /** What the list says when it has no rows. Default "No data". */
  emptyMessage?: string
  /** The selected row's id, controlled. Any of the three selection props makes rows toggle buttons. */
  selected?: string | null
  /** The row to start selected when uncontrolled. */
  defaultSelected?: string | null
  /** Called with the toggled row's id, or null when it's cleared. */
  onSelectedChange?: (id: string | null) => void
}

const idOf = (item: BarListItem) => item.id ?? item.label

function formatShare(share: number, locale: string) {
  if (share > 0 && share < 0.01) return "<1%"
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(share)
}

/** Controlled when value isn't undefined. */
function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : inner
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [current, set] as const
}

const barSizes = {
  default: "h-2",
  xs: "h-0.5",
}

/**
 * One bar on a scale from 0 to max. Hidden from assistive technology: the
 * row's text says the value.
 */
function BarListBar({
  value,
  max,
  marker,
  size = "default",
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** The bar's length on the scale. null or 0 draws no fill. */
  value: number | null
  /** The scale's end. */
  max: number
  /** A reference value, drawn as a dashed line when it's on the scale. */
  marker?: number
  /** "xs" is a hairline, for dense rows. */
  size?: keyof typeof barSizes
}) {
  const at = (v: number) => `${(v / max) * 100}%`
  const width =
    value !== null && value > 0 && max > 0 ? at(Math.min(value, max)) : "0%"
  const markerOn =
    marker !== undefined && max > 0 && marker >= 0 && marker <= max
  return (
    <span
      data-slot="bar-list-bar"
      aria-hidden="true"
      className={cn(
        "relative block w-full rounded-full bg-(--progress-track)",
        barSizes[size],
        className
      )}
      {...props}
    >
      <span
        data-slot="bar-list-indicator"
        className="block h-full rounded-full bg-(--bar-list-color,var(--chart-1)) transition-opacity duration-150 in-data-dimmed:opacity-35 motion-reduce:transition-none"
        style={{ width }}
      />
      {markerOn && (
        <span
          data-slot="bar-list-marker"
          className="absolute -inset-y-1 w-0 -translate-x-1/2 border-l-2 border-dashed border-foreground"
          style={{ left: at(marker) }}
        />
      )}
    </span>
  )
}

const rowClass =
  "grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 rounded-(--radius-2) px-2 py-1.5 text-start text-(length:--font-size-base)"
const interactiveClass =
  "outline-hidden hover:bg-accent focus-visible:shadow-(--shadow-focus)"

function BarList({
  items,
  format,
  locale = "en-US",
  sort = "descending",
  limit,
  total,
  max: maxProp,
  marker,
  color = 1,
  emptyMessage = "No data",
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  className,
  style,
  "aria-describedby": describedBy,
  ...props
}: BarListProps) {
  const markerId = React.useId()
  const selectable =
    selectedProp !== undefined ||
    defaultSelected !== null ||
    onSelectedChange !== undefined
  const [selected, setSelected] = useControllableState(
    selectedProp,
    defaultSelected,
    onSelectedChange
  )
  const rows = React.useMemo(() => {
    const sorted =
      sort === "none"
        ? items
        : [...items].sort((a, b) => {
            if (a.value === null) return b.value === null ? 0 : 1
            if (b.value === null) return -1
            return sort === "descending" ? b.value - a.value : a.value - b.value
          })
    return limit === undefined ? sorted : sorted.slice(0, limit)
  }, [items, sort, limit])
  const max = Math.max(
    maxProp ?? 0,
    marker?.value ?? 0,
    ...rows.map((row) => row.value ?? 0)
  )
  const markerText = marker
    ? [marker.label, formatMetricValue(marker.value, { format, locale })]
        .filter(Boolean)
        .join(" ")
    : null
  const markerAt =
    marker && max > 0 ? Math.max(0, (marker.value / max) * 100) : null

  return (
    <ol
      data-slot="bar-list"
      data-selectable={selectable || undefined}
      aria-describedby={
        [describedBy, markerText && rows.length ? markerId : null]
          .filter(Boolean)
          .join(" ") || undefined
      }
      className={cn("flex flex-col gap-1", className)}
      style={
        {
          "--bar-list-color": `var(--chart-${color})`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {rows.length === 0 ? (
        <li
          data-slot="bar-list-empty"
          className="px-2 py-1.5 text-(length:--font-size-base) text-muted-foreground"
        >
          {emptyMessage}
        </li>
      ) : null}
      {rows.map((item) => {
        const id = idOf(item)
        const isSelected = selectable && selected === id
        const dimmed = selectable && selected !== null && !isSelected
        const share =
          total !== undefined && total > 0 && item.value !== null
            ? formatShare(item.value / total, locale)
            : null

        const content = (
          <>
            <span data-slot="bar-list-text" className="flex min-w-0 flex-col">
              <span
                data-slot="bar-list-label"
                className="truncate text-foreground"
                title={item.label}
              >
                {item.label}
              </span>
              {item.detail && (
                <span
                  data-slot="bar-list-detail"
                  className="truncate text-(length:--chart-text-size) text-muted-foreground"
                >
                  {item.detail}
                </span>
              )}
            </span>{" "}
            <span
              data-slot="bar-list-figures"
              className="flex items-baseline gap-2 self-start whitespace-nowrap tabular-nums"
            >
              {item.value === null ? (
                <span
                  data-slot="bar-list-value"
                  className="text-muted-foreground"
                >
                  No data
                </span>
              ) : (
                <span
                  data-slot="bar-list-value"
                  className="font-semibold text-heading"
                >
                  {formatMetricValue(item.value, { format, locale })}
                </span>
              )}{" "}
              {share && (
                <span
                  data-slot="bar-list-share"
                  className="min-w-[4ch] text-end text-(length:--chart-text-size) text-muted-foreground"
                >
                  {share}
                </span>
              )}
            </span>
            <BarListBar
              value={item.value}
              max={max}
              marker={marker?.value}
              data-dimmed={dimmed || undefined}
              className="col-span-2"
            />
          </>
        )

        return (
          <li
            key={id}
            data-slot="bar-list-item"
            data-selected={isSelected || undefined}
            className="-mx-2"
          >
            {selectable ? (
              <button
                type="button"
                data-slot="bar-list-row"
                aria-pressed={isSelected}
                className={cn(rowClass, interactiveClass, "cursor-pointer")}
                onClick={() => setSelected(isSelected ? null : id)}
              >
                {content}
              </button>
            ) : item.href ? (
              <a
                href={item.href}
                data-slot="bar-list-row"
                className={cn(
                  rowClass,
                  interactiveClass,
                  "[&>span:first-child>span:first-child]:hover:underline"
                )}
              >
                {content}
              </a>
            ) : (
              <div data-slot="bar-list-row" className={rowClass}>
                {content}
              </div>
            )}
          </li>
        )
      })}
      {markerText && markerAt !== null && rows.length > 0 ? (
        <li
          id={markerId}
          data-slot="bar-list-marker-label"
          aria-hidden="true"
          className="relative h-4 text-(length:--chart-text-size) leading-4 text-muted-foreground"
        >
          <span
            data-slot="bar-list-marker-text"
            className={cn(
              "absolute top-0 whitespace-nowrap",
              markerAt < 15
                ? "translate-x-0"
                : markerAt > 85
                  ? "-translate-x-full"
                  : "-translate-x-1/2"
            )}
            style={{ left: `${markerAt}%` }}
          >
            {markerText}
          </span>
        </li>
      ) : null}
    </ol>
  )
}

export {
  BarList,
  BarListBar,
  type BarListItem,
  type BarListMarker,
  type BarListProps,
}
