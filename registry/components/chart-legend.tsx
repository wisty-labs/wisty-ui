import * as React from "react"

import { cn } from "@/lib/utils"
import type { ChartConfig } from "@/components/ui/chart"

type LegendColor = { light?: string; dark?: string }

const colorOf = (item: ChartConfig[string]): LegendColor =>
  item.theme
    ? { light: item.theme.light, dark: item.theme.dark }
    : { light: item.color, dark: item.color }

function ChartLegendList({
  config,
  keys,
  values,
  shape = "dot",
  orientation = "horizontal",
  className,
  ...props
}: React.ComponentProps<"ul"> & {
  /** The chart's config. Its labels and colors make the list. */
  config: ChartConfig
  /** Which entries to show, in this order. Default every entry with a color, in config order. */
  keys?: string[]
  /** A formatted value per key, shown after its label, like "35 (35%)". */
  values?: Record<string, React.ReactNode>
  /** Dots for lines, bars and slices; squares for square marks. */
  shape?: "dot" | "square"
  /** A wrapping row, or a column with values at the end. */
  orientation?: "horizontal" | "vertical"
}) {
  // Only entries with a color or theme have a swatch to show.
  const shown = (keys ?? Object.keys(config)).filter(
    (key) => config[key]?.color ?? config[key]?.theme
  )

  return (
    <ul
      data-slot="chart-legend-list"
      data-orientation={orientation}
      className={cn(
        "flex text-(length:--chart-text-size) text-foreground",
        orientation === "horizontal"
          ? "flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
          : "flex-col gap-2",
        className
      )}
      {...props}
    >
      {shown.map((key) => {
        const item = config[key]
        if (!item) return null
        // A color written as var(--color-<key>) only resolves inside
        // ChartContainer; use var(--chart-n), a literal or theme here.
        const { light, dark } = colorOf(item)
        const value = values?.[key]

        return (
          <li
            key={key}
            data-slot="chart-legend-item"
            className="flex min-w-0 items-center gap-1.5 [&>svg]:size-3 [&>svg]:shrink-0 [&>svg]:text-muted-foreground"
          >
            {item.icon ? (
              <item.icon />
            ) : (
              <span
                aria-hidden="true"
                data-slot="chart-legend-swatch"
                className={cn(
                  "size-2.5 shrink-0 bg-(--swatch) dark:bg-(--swatch-dark)",
                  shape === "dot" ? "rounded-full" : "rounded-[2px]"
                )}
                style={
                  {
                    "--swatch": light,
                    "--swatch-dark": dark,
                  } as React.CSSProperties
                }
              />
            )}
            <span data-slot="chart-legend-label">{item.label ?? key}</span>
            {value != null && (
              <>
                <span className="sr-only">: </span>
                <span
                  data-slot="chart-legend-value"
                  className={cn(
                    "font-medium tabular-nums",
                    orientation === "vertical" && "ms-auto ps-3"
                  )}
                >
                  {value}
                </span>
              </>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// A label's line height: level leaders' circle tops any closer would put one
// label on the next.
const labelGap = 13

// The largest 1, 2 or 5 times a power of ten at or below a value.
const roundDown = (value: number) => {
  const power = 10 ** Math.floor(Math.log10(value))
  const multiple = [5, 2, 1].find((m) => m * power <= value) ?? 1
  return multiple * power
}

function ChartSizeLegend({
  title,
  domain,
  range,
  values,
  valueFormatter = String,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** What dot size measures, like "Deals". */
  title: string
  /** The ZAxis domain, covering every row: Recharts widens one that doesn't, unseen here. */
  domain: [number, number]
  /** The ZAxis range: the smallest and largest dot area, in square pixels. */
  range: [number, number]
  /** The values to draw, largest three. Default the domain's end and round values below it. */
  values?: number[]
  /** Formats each value, like (v) => count.format(v). */
  valueFormatter?: (value: number) => string
}) {
  const [d0, d1] = domain
  const [r0, r1] = range
  // Recharts' ZAxis scale: linear from domain to area, as d3's scaleLinear.
  // Equal ends map every value to the middle of the range. Recharts never
  // scales a 0: it reads it as no size and gives the range's first area.
  const areaOf = (value: number) =>
    value === 0
      ? r0
      : d1 === d0
        ? (r0 + r1) / 2
        : r0 + ((value - d0) / (d1 - d0)) * (r1 - r0)
  const diameterOf = (value: number) =>
    2 * Math.sqrt(Math.max(0, areaOf(value)) / Math.PI)

  const shown = [...(values ?? defaultValues())]
    .sort((a, b) => b - a)
    .slice(0, 3)

  // The domain's end, then the largest round value whose circle's top is a
  // label's height lower, down to the domain's start. Whole numbers only,
  // unless the domain ends below 1.
  function defaultValues() {
    const picked = [d1]
    if (d1 === d0 || r1 <= r0) return picked
    while (picked.length < 3) {
      const target = diameterOf(picked[picked.length - 1]!) - labelGap
      if (target <= 0) break
      const area = Math.PI * (target / 2) ** 2
      const exact = d0 + ((area - r0) / (r1 - r0)) * (d1 - d0)
      const next = exact > 0 ? Math.max(d0, roundDown(exact)) : d0
      if (next > exact || (d1 >= 1 && next < 1) || diameterOf(next) <= 0) break
      picked.push(next)
      if (next === d0) break
    }
    return picked
  }

  const diameters = shown.map(diameterOf)
  const largest = Math.max(...diameters, 2)
  const bottom = largest + 1
  const cx = largest / 2 + 0.5
  const lineEnd = largest + 9
  const height = Math.max(bottom, bottom - Math.min(...diameters) + 7) + 1
  const formatted = shown.map(valueFormatter)
  const list =
    formatted.length > 1
      ? `${formatted.slice(0, -1).join(", ")} and ${formatted[formatted.length - 1]}`
      : (formatted[0] ?? "")

  return (
    <div
      data-slot="chart-size-legend"
      className={cn(
        "flex flex-col gap-1.5 text-(length:--chart-text-size) text-foreground",
        className
      )}
      {...props}
    >
      <span data-slot="chart-size-legend-title" aria-hidden="true">
        {title}
      </span>
      <svg
        aria-hidden="true"
        width={lineEnd + 48}
        height={height}
        className="overflow-visible"
      >
        {diameters.map((diameter, index) => {
          const top = bottom - diameter
          return (
            <g key={index}>
              <circle
                cx={cx}
                cy={bottom - diameter / 2}
                r={diameter / 2}
                fill="none"
                className="stroke-muted-foreground"
              />
              <path
                d={`M${cx} ${top}H${lineEnd}`}
                fill="none"
                className="stroke-border"
              />
              <text
                x={lineEnd + 4}
                y={top}
                dominantBaseline="central"
                className="fill-muted-foreground tabular-nums"
              >
                {formatted[index]}
              </text>
            </g>
          )
        })}
      </svg>
      <span className="sr-only">
        {`${title} by dot size: larger dots mean more. The legend shows ${formatted.length > 1 ? "dots" : "a dot"} for ${list}.`}
      </span>
    </div>
  )
}

export { ChartLegendList, ChartSizeLegend }
