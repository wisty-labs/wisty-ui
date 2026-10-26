# Metric

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/metric](https://ui.wisty.ai/metric) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows one number with its name, a unit and a trend colored good or bad.

```bash
npx shadcn@latest add @wisty/metric
```

## Examples

- `default` (Closed won): This quarter's sales as one compact currency value, with the change on last quarter passed to `MetricTrend` as `change` and written as signed text.
- `states` (States): Rises and falls colored by `isIncreasePositive`, with worse or better in the text, no change, no trend, and three values with a `MetricUnit`.
- `with-sparkline` (In a card, with a sparkline): Open pipeline in a card whose title names it in place of `MetricLabel`, with eight weeks as a decorative sparkline under the number.
- `segment-ranges` (Segment ranges): Three values colored low, middle or high by their own breakpoints, with the range named under each value, so color isn't the only cue.
- `loading` (Loading): Two metrics with `loading` on `Metric`, beside one that has loaded: the labels stay, and the value and trend are placeholders of their own size.

## When to use

- A dashboard or record page shows one number that matters on its own, like sales this quarter or open cases.
- People need to see whether the number went up or down, and whether that's good.
- A row of key figures sits above the charts that explain them.

## When not to use

- For progress toward a target, or a value with a maximum. Use Gauge, which draws the value against the target and colors it by `bands`. A plain value colored by the range it falls in, as Lightning's dashboard Metric does with segment ranges, is the Segment ranges example: the range's color on `MetricValue` and its name under the value.
- For values across categories or over time. Use Chart. One value never needs a chart.
- For a status. Use Badge.
- For a list of labels and values on a record. Use the record's fields.

## Usage

```text
Metric
├── MetricLabel
├── MetricValue
│   └── MetricUnit
└── MetricTrend
```

```tsx
import {
  Metric,
  MetricLabel,
  MetricTrend,
  MetricUnit,
  MetricValue,
} from "@/components/wisty/metric"

const signed = new Intl.NumberFormat("en-US", { signDisplay: "exceptZero" })
const change = 4 // from your data
```

```tsx
<Metric>
  <MetricLabel>Win rate</MetricLabel>
  <MetricValue>
    32
    <MetricUnit>%</MetricUnit>
  </MetricValue>
  <MetricTrend change={change}>
    {signed.format(change)} pts vs last quarter
  </MetricTrend>
</Metric>
```

The trend's text and its `change` come from the same number, so the arrow and the words never disagree. Format the value before you pass it, with a fixed locale, so server and client print the same text. A word unit takes a space before it, as it's written (`{days} <MetricUnit>days</MetricUnit>`); a percent sign takes none. `formatMetricValue` formats a number as KPI row and Metric trend do: written out under 10,000, compact from there to three significant digits ("$4.82M"). `formatMetricChange` writes the change from a previous value as signed text: a percent of it, points for a percent `format`, and the difference itself when the previous value is 0. A sparkline, a card title in place of the label, and the loading state are shown by the In a card, with a sparkline and Loading examples.

## Rules

- Pass the signed change from the data as `change`, never a literal. When a rise is bad, add `isIncreasePositive={false}`; never flip the sign to get a color.
- Give a sparkline `isAnimationActive={false}` and `<YAxis hide domain={["dataMin", "dataMax"]} />`. Without the axis the line sits flat near the top instead of showing its shape.
- While the number loads, pass `loading` on `Metric` and render the same parts as when loaded, so the placeholders match what replaces them. Never show a zero, a dash or a stale figure in their place.
- A currency symbol belongs in the formatted value, not in `MetricUnit`.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `Metric` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `MetricLabel` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |
| `MetricValue` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |
| `MetricUnit` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `MetricTrend` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |

### Metric

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading`? | `boolean` | `false` | Whether the number is still loading: the parts draw placeholders and the metric is aria-busy. |

### MetricTrend

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `change` | `number` |  | The signed change; its sign sets the arrow, flat at 0. |
| `isIncreasePositive`? | `boolean` | `true` | Whether a rise is good; sets the color. Pass false for churn or open cases. |

### formatMetricValue

A dashboard number: written out under 10,000 with at most one decimal, compact from 10,000 to three significant digits ($4.82M, 12.9K), so neighbors compare at the same precision.

| Parameter | Type | Default |
| --- | --- | --- |
| `value` | `number` |  |
| `__1`? | `MetricFormatOptions` | `{}` |

Returns `string`.

### formatMetricChange

The change from `previous` to `value` as signed text: a percent of the previous value, points for a percent `format`, the difference itself when the previous value is 0, and "No change" at none. Minus is a true minus.

| Parameter | Type | Default |
| --- | --- | --- |
| `value` | `number` |  |
| `previous` | `number` |  |
| `__2`? | `MetricFormatOptions` | `{}` |

Returns `string`.

### MetricFigure

One key figure and the comparison period's value, as a block takes it.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` |  |  |
| `label` | `string` |  | What's measured, in sentence case: "Open pipeline". |
| `value` | `number \| null` |  | The current value. null shows "No data" and no change. |
| `previous`? | `number \| null` |  | The comparison period's value. Shows the change against it. |
| `format`? | `Intl.NumberFormatOptions` |  | How the value reads, as Intl.NumberFormat options. Default an amount in the block's `currency`, or a plain number without one. |
| `isIncreasePositive`? | `boolean` |  | Whether a rise is good. Default true. Pass false for open cases, sales cycle, handle time, churn. |

### MetricFormatOptions

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `format`? | `Intl.NumberFormatOptions` |  | Intl.NumberFormat options. A notation or digits here win over the defaults. |
| `locale`? | `string` |  | A BCP 47 locale. Default "en-US". |

## SLDS mapping

SLDS has no metric component. Its Charts guidelines name Metric as an intent, and Lightning's dashboard Metric shows one value. The parts follow SLDS's type classes and the meaning of its trend icon, `slds-icon-trend`; the table lists the class behind each part. The trend's arrow is Lucide's, turned as SLDS turns its own. While loading, the value and the trend are Skeleton.

Known gaps:

- SLDS's trend icon draws a circle around the arrow and can animate it. The metric draws the arrow only, and never animates it.

## Accessibility

- A metric is plain text in reading order: label, value, trend. `Metric` adds no role. A metric with no `MetricLabel` needs a name right before it, like a card title, or `role="group"` with `aria-labelledby` pointing at one.
- The arrow is hidden from screen readers, so the trend's text must carry the sign and the comparison ("+16% vs last quarter"). Good or bad is in the color only; when it matters, write it too ("+12% vs last week, worse").
- A sparkline is decoration. Wrap it in `aria-hidden="true"` and give the chart `accessibilityLayer={false}`, so it takes no tab stop, and say what it shows in the trend's text.
- A loading metric is `aria-busy`, with no text in its value and trend, so a screen reader never hears a stale or zero figure.

## Motion

- The value doesn't animate, so a changed figure jumps into place. The loading placeholders pulse, and hold still when the user prefers reduced motion.

## Responsive behavior

- A metric fills the width of its parent. Put metrics in a grid or a wrapping row with a gap.
- A long label wraps. The value doesn't shrink, so keep values compact ("$1.2M", not "$1,240,000").

## Performance

- A sparkline is a full chart. Keep to a few per page, with a few dozen points each.

## Example code

### Closed won

This quarter's sales as one compact currency value, with the change on last quarter passed to `MetricTrend` as `change` and written as signed text.

```tsx
import {
  Metric,
  MetricLabel,
  MetricTrend,
  MetricValue,
} from "@/components/wisty/metric"

const metric = { sales: 1_240_000, change: 0.16 }

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const signedPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "exceptZero",
})

export default function MetricDefault() {
  return (
    <Metric>
      <MetricLabel>Closed won this quarter</MetricLabel>
      <MetricValue>{compact.format(metric.sales)}</MetricValue>
      <MetricTrend change={metric.change}>
        {signedPercent.format(metric.change)} vs last quarter
      </MetricTrend>
    </Metric>
  )
}
```

### States

Rises and falls colored by `isIncreasePositive`, with worse or better in the text, no change, no trend, and three values with a `MetricUnit`.

```tsx
import {
  Metric,
  MetricLabel,
  MetricTrend,
  MetricUnit,
  MetricValue,
} from "@/components/wisty/metric"

const metrics = {
  winRate: { value: 32, change: 4 },
  openCases: { value: 128, change: 0.12 },
  churn: { value: 2.1, change: -0.4 },
  dealAge: { value: 41, change: 0 },
  accounts: { value: 1_480 },
}

const count = new Intl.NumberFormat("en-US")
const decimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })
const signed = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
})
const signedPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "exceptZero",
})

export default function MetricStates() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
      <Metric>
        <MetricLabel>Win rate</MetricLabel>
        <MetricValue>
          {count.format(metrics.winRate.value)}
          <MetricUnit>%</MetricUnit>
        </MetricValue>
        <MetricTrend change={metrics.winRate.change}>
          {signed.format(metrics.winRate.change)} pts vs last quarter
        </MetricTrend>
      </Metric>
      <Metric>
        <MetricLabel>Open cases</MetricLabel>
        <MetricValue>{count.format(metrics.openCases.value)}</MetricValue>
        <MetricTrend
          change={metrics.openCases.change}
          isIncreasePositive={false}
        >
          {signedPercent.format(metrics.openCases.change)} vs last week, worse
        </MetricTrend>
      </Metric>
      <Metric>
        <MetricLabel>Churn</MetricLabel>
        <MetricValue>
          {decimal.format(metrics.churn.value)}
          <MetricUnit>%</MetricUnit>
        </MetricValue>
        <MetricTrend change={metrics.churn.change} isIncreasePositive={false}>
          {signed.format(metrics.churn.change)} pts vs last quarter, better
        </MetricTrend>
      </Metric>
      <Metric>
        <MetricLabel>Average deal age</MetricLabel>
        <MetricValue>
          {count.format(metrics.dealAge.value)} <MetricUnit>days</MetricUnit>
        </MetricValue>
        <MetricTrend change={metrics.dealAge.change}>
          {metrics.dealAge.change === 0
            ? "No change"
            : `${signed.format(metrics.dealAge.change)} days`}{" "}
          vs last quarter
        </MetricTrend>
      </Metric>
      <Metric>
        <MetricLabel>Active accounts</MetricLabel>
        <MetricValue>{count.format(metrics.accounts.value)}</MetricValue>
      </Metric>
    </div>
  )
}
```

### In a card, with a sparkline

Open pipeline in a card whose title names it in place of `MetricLabel`, with eight weeks as a decorative sparkline under the number.

```tsx
"use client"

import { useId } from "react"
import { Line, LineChart, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Metric, MetricTrend, MetricValue } from "@/components/wisty/metric"

const weeks = [
  { week: "Aug 17", pipeline: 3_100_000 },
  { week: "Aug 24", pipeline: 3_250_000 },
  { week: "Aug 31", pipeline: 3_180_000 },
  { week: "Sep 7", pipeline: 3_420_000 },
  { week: "Sep 14", pipeline: 3_390_000 },
  { week: "Sep 21", pipeline: 3_610_000 },
  { week: "Sep 28", pipeline: 3_700_000 },
  { week: "Oct 5", pipeline: 3_860_000 },
]

const config = {
  pipeline: { label: "Open pipeline", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const signedPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "exceptZero",
})

export default function MetricWithSparkline() {
  const first = weeks[0]?.pipeline
  const last = weeks[weeks.length - 1]?.pipeline
  const change =
    first !== undefined && last !== undefined && weeks.length > 1 && first !== 0
      ? last / first - 1
      : undefined

  const titleId = useId()
  return (
    <Card className="w-full max-w-60">
      <CardHeader>
        <CardTitle id={titleId}>Open pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Metric role="group" aria-labelledby={titleId}>
          <MetricValue>
            {last === undefined ? "No data" : compact.format(last)}
          </MetricValue>
          {change !== undefined && (
            <>
              <div aria-hidden="true">
                <ChartContainer
                  config={config}
                  className="aspect-auto h-10 w-full"
                >
                  <LineChart
                    data={weeks}
                    accessibilityLayer={false}
                    margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                  >
                    <YAxis hide domain={["dataMin", "dataMax"]} />
                    <Line
                      dataKey="pipeline"
                      type="linear"
                      stroke="var(--color-pipeline)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
              <MetricTrend change={change}>
                {signedPercent.format(change)} over {weeks.length} weeks
              </MetricTrend>
            </>
          )}
        </Metric>
      </CardContent>
    </Card>
  )
}
```

### Segment ranges

Three values colored low, middle or high by their own breakpoints, with the range named under each value, so color isn't the only cue.

```tsx
import {
  Metric,
  MetricLabel,
  MetricUnit,
  MetricValue,
} from "@/components/wisty/metric"

const ranges = [
  { name: "Below target", color: "text-(--chart-negative)" },
  { name: "Near target", color: "text-(--chart-warning)" },
  { name: "On target", color: "text-(--chart-positive)" },
]

const metrics = [
  { label: "Win rate", value: 18, unit: "%", breakpoints: [20, 30] },
  { label: "Pipeline coverage", value: 2.6, unit: "x", breakpoints: [2, 3] },
  { label: "Quota attainment", value: 104, unit: "%", breakpoints: [80, 100] },
]

const decimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })

export default function MetricSegmentRanges() {
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-6">
      {metrics.map((metric) => {
        const range =
          ranges[metric.breakpoints.filter((at) => metric.value >= at).length]!
        return (
          <Metric key={metric.label}>
            <MetricLabel>{metric.label}</MetricLabel>
            <MetricValue className={range.color}>
              {decimal.format(metric.value)}
              <MetricUnit>{metric.unit}</MetricUnit>
            </MetricValue>
            <p
              className={`text-(length:--metric-label-size) leading-(--metric-label-line-height) ${range.color}`}
            >
              {range.name}
            </p>
          </Metric>
        )
      })}
    </div>
  )
}
```

### Loading

Two metrics with `loading` on `Metric`, beside one that has loaded: the labels stay, and the value and trend are placeholders of their own size.

```tsx
import {
  Metric,
  MetricLabel,
  MetricTrend,
  MetricValue,
} from "@/components/wisty/metric"

type Figures = { value?: number; change?: number }
const closedWon: Figures = {}
const winRate: Figures = {}
const pipeline: Figures = { value: 4_820_000, change: 0.145 }

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})
const signedPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "exceptZero",
  maximumFractionDigits: 1,
})

export default function MetricLoading() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
      <Metric loading={closedWon.value === undefined}>
        <MetricLabel>Closed won this quarter</MetricLabel>
        <MetricValue>
          {closedWon.value !== undefined && compact.format(closedWon.value)}
        </MetricValue>
        <MetricTrend change={closedWon.change ?? 0}>
          {closedWon.change !== undefined &&
            `${signedPercent.format(closedWon.change)} vs last quarter`}
        </MetricTrend>
      </Metric>
      <Metric loading={winRate.value === undefined}>
        <MetricLabel>Win rate</MetricLabel>
        <MetricValue>
          {winRate.value !== undefined && `${winRate.value}%`}
        </MetricValue>
      </Metric>
      <Metric loading={pipeline.value === undefined}>
        <MetricLabel>Open pipeline</MetricLabel>
        <MetricValue>
          {pipeline.value !== undefined && compact.format(pipeline.value)}
        </MetricValue>
        <MetricTrend change={pipeline.change ?? 0}>
          {pipeline.change !== undefined &&
            `${signedPercent.format(pipeline.change)} vs last quarter`}
        </MetricTrend>
      </Metric>
    </div>
  )
}
```
