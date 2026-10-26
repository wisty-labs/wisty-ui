# Metric trend

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/metric-trend](https://ui.wisty.ai/metric-trend) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A dashboard's lead chart: metrics as tabs, the selected one's trend below. Each can compare with an earlier period.

```bash
npx shadcn@latest add @wisty/metric-trend
```

## Examples

- `default` (Sales performance): A sales team's Q3 FY2027 as four tabs, amounts in the block's `currency`, each week against the same week of last quarter.
- `service` (Support health): Open cases and first response, where a fall is good (`isIncreasePositive: false`), ten days in, so `null` points end the lines, and CSAT has no `previous`.

## When to use

- As the chart a dashboard leads with: two to four numbers a team watches, each with its change, and the history of the selected one, in the room of one chart.
- For "how is this quarter going against last quarter, week by week": the trend draws this period's line over the comparison period's, and the tooltip names both dates.

## When not to use

- For a row of numbers without their history. Use KPI row.
- For one number on its own. Use Metric.
- For a trend people need to read closely, with several series or a target. Use Chart.
- For more than four metrics. Split them over two cards. Past four, the tabs stop reading as a row.

## Usage

```tsx
import { useId } from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MetricTrendTabs } from "@/components/wisty/metric-trend"
```

```tsx
export function SalesPerformance() {
  const titleId = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle id={titleId}>Sales performance</CardTitle>
        <CardDescription>This quarter against last, by week</CardDescription>
      </CardHeader>
      <MetricTrendTabs
        aria-labelledby={titleId}
        period="This quarter"
        comparison="Last quarter"
        currency="USD"
        metrics={[
          {
            id: "closed-won",
            label: "Closed won",
            value: 420_000,
            previous: 500_000,
            points: [
              { label: "Week of Jul 7", value: 120_000 },
              { label: "Week of Jul 14", value: 420_000 },
            ],
          },
          {
            id: "open-pipeline",
            label: "Open pipeline",
            value: 1_800_000,
            previous: 1_500_000,
            points: [
              { label: "Week of Jul 7", value: 1_650_000 },
              { label: "Week of Jul 14", value: 1_800_000 },
            ],
          },
        ]}
      />
    </Card>
  )
}
```

The page writes the card and its header; the block is the tabs and the chart. Put it straight in the `Card`, after the `CardHeader` and not in `CardContent`, so the tabs run to the card's edges. A `CardAction` in the header holds a control of the page's own, like a period picker.

The tab shows `value`, the period's summary as the app knows it. The block never adds up the points. Each point measures what `value` measures, at that time: a snapshot (open pipeline that week) or a running total (closed won to date). `previous` on a point draws the comparison period as a dashed line, and `previousLabel` names its date in the tooltip. A point with `value: null` leaves a gap, as the Support health example shows for the days still to come.

## Rules

- Pass numbers to `value`, `previous` and every point, never formatted strings, and `null` for a point you don't have yet, never 0.
- For a quarter-to-date total, pass running totals as points, not weekly amounts.
- Pass a percent as a fraction (0.318) with a percent `format`, so its change reads in points.
- Set `isIncreasePositive: false` on every metric where a fall is good, like open cases, handle time or churn. Never flip the sign to get a color.
- Give every point a `previousLabel` when it has a `previous`, so the tooltip names both dates.
- Pass amounts in one currency and set `currency` to match, or give the metric its own currency `format`. Without either, a metric reads as a plain number. Mixed currencies are unavailable (`value: null`), not added up.
- Name the tabs with `aria-labelledby` (the card title's id) or `aria-label`.
- Put the block directly in the `Card`, never in `CardContent`.
- Never pass `asChild` or `render`.

## API reference

### MetricTrendTabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label`? | `string` |  | Names the tabs when no title on the page does. |
| `aria-labelledby`? | `string` |  | The id of the card title that names the tabs. |
| `metrics` | `MetricTrendMetric[]` |  | Two to four metrics, in tab order. |
| `value`? | `string` |  | The selected metric's id, controlled. |
| `defaultValue`? | `string` |  | The metric to start on when uncontrolled. Default the first. |
| `onValueChange`? | `(id: string) => void` |  | Called when a tab is chosen. |
| `period`? | `string` | `"This period"` | This period's name, in the tooltip and legend. Default "This period". |
| `comparison`? | `string` | `"Previous period"` | The comparison period's name. Default "Previous period". |
| `currency`? | `string` |  | An ISO 4217 code for metrics with no `format`: their values read as amounts in it. Without one they read as plain numbers. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers. Default "en-US". |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### MetricTrendPoint

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | The bucket in this period, like "Week of Sep 8". |
| `value` | `number \| null` |  | null leaves a gap, as for a week still to come. |
| `previous`? | `number \| null` |  | The comparable bucket's value in the comparison period. |
| `previousLabel`? | `string` |  | That bucket's label, like "Week of Jun 9", shown in the tooltip. |

### MetricTrendMetric

One metric, as a tab and its chart.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `color`? | `1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | Which chart color the line takes, --chart-1 to --chart-6. Default 1. |
| `points` | `MetricTrendPoint[]` |  | The trend, oldest first. Each point measures what `value` measures, at that time. |
| `id` | `string` |  |  |
| `label` | `string` |  | What's measured, in sentence case: "Open pipeline". |
| `value` | `number \| null` |  | The current value. null shows "No data" and no change. |
| `previous`? | `number \| null` |  | The comparison period's value. Shows the change against it. |
| `format`? | `Intl.NumberFormatOptions` |  | How the value reads, as Intl.NumberFormat options. Default an amount in the block's `currency`, or a plain number without one. |
| `isIncreasePositive`? | `boolean` |  | Whether a rise is good. Default true. Pass false for open cases, sales cycle, handle time, churn. |

## Keyboard interactions

| Key                     | Action                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Arrow Left, Arrow Right | On the tabs: moves between metrics. In the chart: moves the tooltip between points. |
| Home, End               | On the tabs: the first or last metric.                                              |
| Enter, Space            | Selects the focused tab.                                                            |

Tab goes from the selected tab straight into the chart. In Radix projects the arrow keys select each tab they reach. In Base UI projects they only move focus, and Enter or Space selects.

## Accessibility

- `aria-labelledby` names the tab list: point it at the card's title, or pass `aria-label` when there is none. Each tab's name is its metric's whole text ("Closed won $3.41M −4.2% vs Last quarter"), so keep labels short.
- Direction is in the signed text. Whether a change is good shows in color only.
- The chart's points are reachable from the keyboard but announce nothing. The same points sit in a visually hidden table, one row per bucket with the comparison's value and date, so the trend is readable without the chart.

## Motion

- The chart draws at once, with no entrance animation, so switching tabs doesn't shimmer.

## Responsive behavior

- The tabs share the card's width, at least 9rem each, and the list scrolls sideways when they don't fit. A long label truncates; the value doesn't shrink.
- The chart is 16rem tall at any width. The axis thins its date labels as the card narrows.

## Performance

- Only the selected metric's chart is mounted. Switching tabs mounts the next one, and the chart library loads with the block. Keep to one such card per page.

## Example code

### Sales performance

A sales team's Q3 FY2027 as four tabs, amounts in the block's `currency`, each week against the same week of last quarter.

```tsx
import { useId } from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MetricTrendTabs } from "@/components/wisty/metric-trend"
import { salesTrendPoints } from "@/components/wisty/metric-trend-data"

export default function MetricTrendDefault() {
  const titleId = useId()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle id={titleId}>Sales performance</CardTitle>
        <CardDescription>Q3 FY2027 against Q2, by week</CardDescription>
      </CardHeader>
      <MetricTrendTabs
        aria-labelledby={titleId}
        period="This quarter"
        comparison="Last quarter"
        currency="USD"
        locale="en-US"
        metrics={[
          {
            id: "pipeline",
            label: "Open pipeline",
            value: 12_480_000,
            previous: 11_020_000,
            points: salesTrendPoints.pipeline,
          },
          {
            id: "closed-won",
            label: "Closed won",
            value: 3_410_000,
            previous: 3_560_000,
            points: salesTrendPoints.closedWon,
          },
          {
            id: "win-rate",
            label: "Win rate",
            value: 0.318,
            previous: 0.287,
            format: { style: "percent", maximumFractionDigits: 1 },
            color: 3,
            points: salesTrendPoints.winRate,
          },
          {
            id: "deal-size",
            label: "Average deal size",
            value: 66_900,
            previous: 62_800,
            color: 5,
            points: salesTrendPoints.dealSize,
          },
        ]}
      />
    </Card>
  )
}
```

### Support health

Open cases and first response, where a fall is good (`isIncreasePositive: false`), ten days in, so `null` points end the lines, and CSAT has no `previous`.

```tsx
import { useId } from "react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MetricTrendTabs } from "@/components/wisty/metric-trend"
import { metricTrendServiceFixture } from "@/components/wisty/metric-trend-data"

export default function MetricTrendService() {
  const titleId = useId()

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle id={titleId}>Support health</CardTitle>
        <CardDescription>
          Sep 16 to 29 against the two weeks before, as of Sep 25
        </CardDescription>
      </CardHeader>
      <MetricTrendTabs
        aria-labelledby={titleId}
        {...metricTrendServiceFixture}
      />
    </Card>
  )
}
```
