"use client"

import * as React from "react"
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const MetricLoading = React.createContext(false)

function Metric({
  loading = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Whether the number is still loading: the parts draw placeholders and the metric is aria-busy. */
  loading?: boolean
}) {
  return (
    <MetricLoading.Provider value={loading}>
      <div
        data-slot="metric"
        aria-busy={loading || undefined}
        className={cn("flex min-w-0 flex-col gap-1", className)}
        {...props}
      />
    </MetricLoading.Provider>
  )
}

function MetricLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="metric-label"
      className={cn(
        "text-(length:--metric-label-size) leading-(--metric-label-line-height) text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function MetricValue({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const loading = React.useContext(MetricLoading)
  if (loading) {
    // Matches the value's line: 1em of block, the rest of the line height as margin.
    return (
      <Skeleton
        data-slot="metric-value"
        data-loading=""
        className={cn(
          "my-[calc((var(--metric-value-line-height)-1)*0.5em)] h-[1em] w-[5ch] text-(length:--chart-value-size)",
          className
        )}
        {...(props as React.ComponentProps<"div">)}
      />
    )
  }
  return (
    <p
      data-slot="metric-value"
      className={cn(
        "text-(length:--chart-value-size) leading-(--metric-value-line-height) text-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function MetricUnit({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="metric-unit"
      className={cn(
        "text-(length:--chart-unit-size) text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

const trendIcons = {
  up: ArrowUpRightIcon,
  down: ArrowDownRightIcon,
  flat: ArrowRightIcon,
}

const trendColors = {
  positive: "text-(--chart-positive)",
  negative: "text-(--chart-negative)",
  neutral: "text-muted-foreground",
}

function MetricTrend({
  change,
  isIncreasePositive = true,
  className,
  children,
  ...props
}: React.ComponentProps<"p"> & {
  /** The signed change; its sign sets the arrow, flat at 0. */
  change: number
  /** Whether a rise is good; sets the color. Pass false for churn or open cases. */
  isIncreasePositive?: boolean
}) {
  const loading = React.useContext(MetricLoading)
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat"
  const sentiment =
    direction === "flat"
      ? "neutral"
      : (direction === "up") === isIncreasePositive
        ? "positive"
        : "negative"
  const Icon = trendIcons[direction]

  if (loading) {
    // No direction or sentiment: there's no change to show yet.
    return (
      <Skeleton
        data-slot="metric-trend"
        data-loading=""
        className={cn(
          "h-4 w-[14ch] text-(length:--metric-label-size)",
          className
        )}
        {...(props as React.ComponentProps<"div">)}
      />
    )
  }

  return (
    <p
      data-slot="metric-trend"
      data-direction={direction}
      data-sentiment={sentiment}
      className={cn(
        "flex items-center gap-1 text-(length:--metric-label-size) leading-(--metric-label-line-height) [&_svg]:size-4 [&_svg]:shrink-0",
        trendColors[sentiment],
        className
      )}
      {...props}
    >
      <Icon aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

/** One key figure and the comparison period's value, as a block takes it. */
interface MetricFigure {
  id: string
  /** What's measured, in sentence case: "Open pipeline". */
  label: string
  /** The current value. null shows "No data" and no change. */
  value: number | null
  /** The comparison period's value. Shows the change against it. */
  previous?: number | null
  /** How the value reads, as Intl.NumberFormat options. Default an amount in the block's `currency`, or a plain number without one. */
  format?: Intl.NumberFormatOptions
  /** Whether a rise is good. Default true. Pass false for open cases, sales cycle, handle time, churn. */
  isIncreasePositive?: boolean
}

interface MetricFormatOptions {
  /** Intl.NumberFormat options. A notation or digits here win over the defaults. */
  format?: Intl.NumberFormatOptions
  /** A BCP 47 locale. Default "en-US". */
  locale?: string
}

const digitKeys = [
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
] as const

/**
 * A dashboard number: written out under 10,000 with at most one decimal,
 * compact from 10,000 to three significant digits ($4.82M, 12.9K), so
 * neighbors compare at the same precision.
 */
function formatMetricValue(
  value: number,
  { format, locale = "en-US" }: MetricFormatOptions = {}
) {
  const notation =
    format?.notation ?? (Math.abs(value) >= 10_000 ? "compact" : "standard")
  const digits: Intl.NumberFormatOptions = digitKeys.some(
    (key) => key in (format ?? {})
  )
    ? {}
    : notation === "compact"
      ? { maximumSignificantDigits: 3 }
      : { minimumFractionDigits: 0, maximumFractionDigits: 1 }
  return new Intl.NumberFormat(locale, {
    notation,
    ...digits,
    ...format,
  }).format(value)
}

/**
 * The change from `previous` to `value` as signed text: a percent of the
 * previous value, points for a percent `format`, the difference itself when
 * the previous value is 0, and "No change" at none. Minus is a true minus.
 */
function formatMetricChange(
  value: number,
  previous: number,
  { format, locale = "en-US" }: MetricFormatOptions = {}
) {
  const difference = value - previous
  if (difference === 0) return "No change"
  let text: string
  if (format?.style === "percent") {
    // A rate's change in percent of itself misleads: 28.7% to 31.8% is +3.1 pts.
    text = `${new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
      signDisplay: "exceptZero",
    }).format(difference * 100)} pts`
  } else if (previous === 0) {
    text = formatMetricValue(difference, {
      format: { ...format, signDisplay: "exceptZero" },
      locale,
    })
  } else {
    text = new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
      signDisplay: "exceptZero",
    }).format(difference / Math.abs(previous))
  }
  // Intl's hyphen sits low beside a plus, so a true minus sign replaces it.
  return text.replace("-", "−")
}

export {
  Metric,
  MetricLabel,
  MetricValue,
  MetricUnit,
  MetricTrend,
  formatMetricValue,
  formatMetricChange,
  type MetricFigure,
  type MetricFormatOptions,
}
