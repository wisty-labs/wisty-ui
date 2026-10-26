import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  formatMetricChange,
  formatMetricValue,
  Metric,
  type MetricFigure,
  MetricLabel,
  MetricTrend,
  MetricValue,
} from "@/components/wisty/metric"

const columns: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 @min-[22rem]/kpi-row:grid-cols-2",
  3: "grid-cols-1 @min-[33rem]/kpi-row:grid-cols-3",
  4: "grid-cols-1 @min-[22rem]/kpi-row:grid-cols-2 @min-[44rem]/kpi-row:grid-cols-4",
  5: "grid-cols-1 @min-[33rem]/kpi-row:grid-cols-3 @min-[55rem]/kpi-row:grid-cols-5",
}

// More than five isn't a header row; they wrap as they fit.
const autoFit = "grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))]"

/** One key figure. */
type KpiRowMetric = MetricFigure

interface KpiRowProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Two to five key figures, in reading order. */
  metrics: KpiRowMetric[]
  /** The comparison period, as said after "vs". Default "last quarter". */
  comparison?: string
  /** Holds every metric's shape with placeholders while the numbers load. */
  loading?: boolean
  /** An ISO 4217 code for metrics with no `format`. Default "USD". */
  currency?: string
  /** A BCP 47 locale for numbers. Default "en-US". */
  locale?: string
}

function KpiRow({
  metrics,
  comparison = "last quarter",
  loading = false,
  currency = "USD",
  locale = "en-US",
  className,
  ...props
}: KpiRowProps) {
  return (
    <Card
      data-slot="kpi-row"
      role="group"
      aria-label="Key metrics"
      className={cn("@container/kpi-row gap-0 py-0", className)}
      {...props}
    >
      <div className={cn("grid", columns[metrics.length] ?? autoFit)}>
        {metrics.map((metric) => {
          const format = metric.format ?? { style: "currency", currency }
          const change =
            metric.value !== null &&
            metric.previous !== undefined &&
            metric.previous !== null
              ? metric.value - metric.previous
              : null
          return (
            <Metric
              key={metric.id}
              loading={loading}
              data-metric={metric.id}
              className="-ms-px -mt-px border-s border-t border-border px-(--card-spacing-inline) py-(--card-spacing-block)"
            >
              <MetricLabel>{metric.label}</MetricLabel>
              {metric.value === null && !loading ? (
                <MetricValue className="text-muted-foreground">
                  No data
                </MetricValue>
              ) : (
                <MetricValue>
                  {metric.value === null
                    ? null
                    : formatMetricValue(metric.value, { format, locale })}
                </MetricValue>
              )}
              {loading || change !== null ? (
                <MetricTrend
                  change={change ?? 0}
                  isIncreasePositive={metric.isIncreasePositive}
                >
                  {change === null
                    ? null
                    : `${formatMetricChange(metric.value!, metric.previous!, { format, locale })} vs ${comparison}`}
                </MetricTrend>
              ) : null}
            </Metric>
          )
        })}
      </div>
    </Card>
  )
}

export { KpiRow }
export type { KpiRowMetric, KpiRowProps }
