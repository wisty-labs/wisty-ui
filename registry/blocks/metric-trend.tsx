"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  formatMetricChange,
  formatMetricValue,
  Metric,
  type MetricFigure,
  MetricLabel,
  MetricTrend,
  MetricValue,
} from "@/components/wisty/metric"

interface MetricTrendPoint {
  /** The bucket in this period, like "Week of Sep 8". */
  label: string
  /** null leaves a gap, as for a week still to come. */
  value: number | null
  /** The comparable bucket's value in the comparison period. */
  previous?: number | null
  /** That bucket's label, like "Week of Jun 9", shown in the tooltip. */
  previousLabel?: string
}

/** One metric, as a tab and its chart. */
interface MetricTrendMetric extends MetricFigure {
  /** Which chart color the line takes, --chart-1 to --chart-6. Default 1. */
  color?: 1 | 2 | 3 | 4 | 5 | 6
  /** The trend, oldest first. Each point measures what `value` measures, at that time. */
  points: MetricTrendPoint[]
}

type MetricTrendTabsLabel =
  | {
      /** The id of the card title that names the tabs. */
      "aria-labelledby": string
      "aria-label"?: string
    }
  | {
      "aria-labelledby"?: string
      /** Names the tabs when no title on the page does. */
      "aria-label": string
    }

type MetricTrendTabsProps = Omit<
  React.ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> &
  MetricTrendTabsLabel & {
    /** Two to four metrics, in tab order. */
    metrics: MetricTrendMetric[]
    /** The selected metric's id, controlled. */
    value?: string
    /** The metric to start on when uncontrolled. Default the first. */
    defaultValue?: string
    /** Called when a tab is chosen. */
    onValueChange?: (id: string) => void
    /** This period's name, in the tooltip and legend. Default "This period". */
    period?: string
    /** The comparison period's name. Default "Previous period". */
    comparison?: string
    /** An ISO 4217 code for metrics with no `format`: their values read as amounts in it. Without one they read as plain numbers. */
    currency?: string
    /** A BCP 47 locale for numbers. Default "en-US". */
    locale?: string
  }

const hasPrevious = (metric: MetricTrendMetric) =>
  metric.points.some(
    (point) => point.previous !== undefined && point.previous !== null
  )

function MetricTrendChart({
  metric,
  format: numberFormat,
  period,
  comparison,
  locale,
}: {
  metric: MetricTrendMetric
  format: Intl.NumberFormatOptions | undefined
  period: string
  comparison: string
  locale: string
}) {
  // useId's colons would break the url(#id) gradient reference.
  const id = React.useId().replace(/:/g, "")
  const color = `var(--chart-${metric.color ?? 1})`
  const config = {
    value: { label: period, color },
    previous: { label: comparison, color: "var(--muted-foreground)" },
  } satisfies ChartConfig
  const compared = hasPrevious(metric)
  const format = (value: number) =>
    formatMetricValue(value, { format: numberFormat, locale })
  const tick = (value: number) =>
    formatMetricValue(value, {
      format: {
        ...numberFormat,
        notation: "compact",
        maximumSignificantDigits: 2,
      },
      locale,
    })
  const name = `${metric.label}, ${period}${compared ? ` and ${comparison}` : ""}`

  return (
    <>
      <ChartContainer
        config={config}
        data-slot="metric-trend-chart"
        className="aspect-auto h-64 w-full"
      >
        <AreaChart
          data={metric.points}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          title={name}
        >
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            width={48}
            tickFormatter={tick}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                className="min-w-48"
                formatter={(value, name, item) => {
                  // The comparison row carries its own date, so both
                  // periods' dates are in the tooltip.
                  const point = item.payload as MetricTrendPoint
                  const isPrevious = name === "previous"
                  return (
                    <div
                      data-slot="metric-trend-tooltip-row"
                      className="flex w-full items-center gap-2"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-0 w-3 shrink-0 border-t-2",
                          isPrevious
                            ? "border-dashed border-muted-foreground"
                            : "border-(--color-value)"
                        )}
                      />
                      <span className="flex-1 text-muted-foreground">
                        {isPrevious
                          ? `${comparison}${point.previousLabel ? `, ${point.previousLabel}` : ""}`
                          : period}
                      </span>
                      <span className="font-semibold text-popover-foreground tabular-nums">
                        {typeof value === "number" ? format(value) : "No data"}
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
          {compared && (
            <Line
              dataKey="previous"
              type="linear"
              stroke="var(--color-previous)"
              strokeOpacity={0.7}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{
                r: 3,
                fill: "var(--color-previous)",
                strokeWidth: 0,
              }}
              isAnimationActive={false}
            />
          )}
          <Area
            dataKey="value"
            type="linear"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill={`url(#${id}-fill)`}
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--color-value)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
      <div
        data-slot="metric-trend-legend"
        aria-hidden="true"
        className="flex flex-wrap items-center gap-x-4 gap-y-1 ps-12 text-(length:--chart-text-size) text-muted-foreground"
      >
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-3 border-t-2" style={{ borderColor: color }} />
          {period}
        </span>
        {compared && (
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-3 border-t-2 border-dashed border-muted-foreground" />
            {comparison}
          </span>
        )}
      </div>
      {/* The same points as a table for screen readers; the chart is decoration to them. */}
      <table data-slot="metric-trend-table" className="sr-only">
        <caption>{name}</caption>
        <thead>
          <tr>
            <th scope="col">{period}</th>
            <th scope="col">{metric.label}</th>
            {compared && <th scope="col">{comparison}</th>}
          </tr>
        </thead>
        <tbody>
          {metric.points.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{point.value === null ? "No data" : format(point.value)}</td>
              {compared && (
                <td>
                  {point.previous === undefined || point.previous === null
                    ? "No data"
                    : `${format(point.previous)}${point.previousLabel ? `, ${point.previousLabel}` : ""}`}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function MetricTrendTabs({
  metrics,
  "aria-labelledby": labelledBy,
  "aria-label": label,
  value: valueProp,
  defaultValue,
  onValueChange,
  period = "This period",
  comparison = "Previous period",
  currency,
  locale = "en-US",
  className,
  ...props
}: MetricTrendTabsProps) {
  const formatOf = (metric: MetricTrendMetric) =>
    metric.format ??
    (currency ? { style: "currency" as const, currency } : undefined)
  const [inner, setInner] = React.useState(defaultValue ?? metrics[0]?.id ?? "")
  const selected = valueProp ?? inner
  const select = (next: unknown) => {
    // Base UI's tabs report any value type; the values here are metric ids.
    const id = String(next)
    if (valueProp === undefined) setInner(id)
    onValueChange?.(id)
  }

  return (
    <div
      data-slot="metric-trend-tabs"
      className={cn("min-w-0", className)}
      {...props}
    >
      <Tabs value={selected} onValueChange={select} className="min-w-0">
        <TabsList
          aria-labelledby={labelledBy}
          aria-label={label}
          className="overflow-x-auto overflow-y-hidden [scrollbar-width:none]"
        >
          {metrics.map((metric) => {
            const format = formatOf(metric)
            const change =
              metric.value !== null &&
              metric.previous !== undefined &&
              metric.previous !== null
                ? metric.value - metric.previous
                : null
            return (
              <TabsTrigger
                key={metric.id}
                value={metric.id}
                data-metric={metric.id}
                className="h-auto min-w-36 flex-1 basis-0 items-start border-e border-(--tabs-border) px-(--card-spacing-inline) py-3 text-start font-normal whitespace-normal last:border-e-0 aria-selected:font-normal"
              >
                <Metric className="w-full gap-0.5">
                  <MetricLabel className="truncate">{metric.label}</MetricLabel>
                  {metric.value === null ? (
                    <MetricValue className="text-muted-foreground">
                      No data
                    </MetricValue>
                  ) : (
                    <MetricValue>
                      {formatMetricValue(metric.value, { format, locale })}
                    </MetricValue>
                  )}
                  {change !== null ? (
                    <MetricTrend
                      change={change}
                      isIncreasePositive={metric.isIncreasePositive}
                    >
                      {formatMetricChange(metric.value!, metric.previous!, {
                        format,
                        locale,
                      })}{" "}
                      vs {comparison}
                    </MetricTrend>
                  ) : (
                    // Keeps the tabs the same height when one has no change.
                    <span aria-hidden="true" className="block h-4" />
                  )}
                </Metric>
              </TabsTrigger>
            )
          })}
        </TabsList>
        {/* The panel holds a focusable chart, so it needn't be a tab stop
            itself: Tab goes from the selected tab into the chart. */}
        {metrics.map((metric) => (
          <TabsContent
            key={metric.id}
            value={metric.id}
            tabIndex={-1}
            className="flex flex-col gap-3 px-(--card-body-spacing-inline) pt-4"
          >
            {metric.id === selected ? (
              <MetricTrendChart
                metric={metric}
                format={formatOf(metric)}
                period={period}
                comparison={comparison}
                locale={locale}
              />
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export { MetricTrendTabs }
export type { MetricTrendMetric, MetricTrendPoint, MetricTrendTabsProps }
