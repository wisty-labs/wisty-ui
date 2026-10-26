# Chart

This page shows the Radix version. Base UI projects get [registry/base/ui/chart.tsx](../../base/ui/chart.tsx), and [ui.wisty.ai/chart](https://ui.wisty.ai/chart) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Draws bar, line, area, donut, scatter and funnel charts. One config names each series and its color, and the tooltip and legend read it.

```bash
npx shadcn@latest add @wisty/chart
```

## Examples

- `default` (Bar chart): Comparison. Sales by account as horizontal bars, largest first, long names wrapped to two lines, with a period switch that reorders them on one axis.
- `bar-values` (Bar chart with values): Comparison. Open pipeline by account with each bar's value at its end, so the value axis and the grid are hidden.
- `bar-top` (Bar chart of the top five): Comparison. The five largest of fifteen accounts, sorted and sliced from the rows, with a line under the chart that states the rest and their total.
- `bar-drill-down` (Bar chart with drill-down): Comparison. Choosing an account's bar, or the account in a select, lists its open opportunities in a table under the chart.
- `column` (Column chart): Comparison. Sales by account size as columns in the buckets' own order, with a period switch that moves them against one value axis.
- `column-groups` (Column chart with groups): Comparison. Sales by quarter with a column per product line side by side, a distinct hue each, the legend below and both values in the tooltip.
- `column-target` (Column chart with a target): Comparison. Closed won by month against a fixed target, drawn as a dashed line labelled with its value where no column crosses it.
- `column-negative` (Column chart with negative values): Comparison. Net new ARR by month on an axis that runs below zero, losing months growing down from a zero line, with the sign in the tooltip.
- `stacked-bar` (Stacked bar chart): Comparison. Open pipeline by owner as horizontal bars stacked by stage, the legend below, the total in the tooltip, and a period switch on one axis.
- `stacked` (Stacked column chart): Comparison. Sales by account size and product, a color per product, the legend below, the total in the tooltip, and a period switch on one axis.
- `stacked-percent` (Stacked column chart to 100%): Composition. Opportunity outcomes by region as shares of each column, stacked to 100%, with each part's count and share in the tooltip.
- `dot-plot` (Dot plot): Comparison. Sales by account type as a dot per row, largest first, the value axis on top, with a period switch that moves dots to their new rank.
- `line` (Line chart): Trending. Sales and profit by month as two plain lines, the legend below, with a period switch that redraws them on the same scale.
- `area` (Area chart): Trending. Sales by month as one series, a line with a dot on each point over a flat 20% fill, and a period switch on the same scale.
- `area-running-total` (Area chart with a running total): Trending. Closed won by week added up into a running total, crossing a dashed quota line, with each week's amount and the total in the tooltip.
- `combo` (Combination chart): Trending. Sales as columns on a left axis and open opportunities as a line on a right axis, both titled, with a period switch that keeps both scales.
- `donut` (Donut chart): Composition. Campaigns by source on a thin ring with the total in the middle, and a period switch where slices re-sort and a source leaves.
- `donut-others` (Donut chart with Others): Composition. Leads by source, sources at 3% or less folded into a gray Others slice, with each slice's share in the legend.
- `scatter` (Scatter plot): Relationship. Accounts by employees and sales in one series, a color per segment, with a period switch that moves each account on fixed axes.
- `funnel` (Funnel chart): Pipeline. Opportunities by stage as a tapered column with each count on its band, the total above and a legend titled Stage, with a period switch.
- `waterfall` (Waterfall chart): Pipeline. Cash flow from the opening to the closing balance, rises and falls colored by meaning, with a period switch whose steps move when it changes.
- `dashboard` (Dashboard): Three charts on cards sharing one config and one period filter: columns with an average line, every region by name, and sales against a dashed target.
- `states` (Loading and empty states): Any intent. A chart card while its rows load, as a skeleton at the chart's size, with no rows, as an empty state, and when they couldn't load, with Retry.

## When to use

- A dashboard, report or record page shows numbers as a picture: a comparison, a trend, a share of a whole, a relationship or the stages of a pipeline.
- Pick the chart by what the reader should see, then copy the example named in the row. A row another item answers names that item and its example.

| Intent       | The reader should see                                      | Example                           |
| ------------ | ---------------------------------------------------------- | --------------------------------- |
| Comparison   | Values side by side, with long category names              | Bar chart                         |
| Comparison   | Each value exactly, with long category names               | Bar chart with values             |
| Comparison   | The largest few of many, with the rest stated              | Bar chart of the top five         |
| Comparison   | Values side by side, and the records behind the one chosen | Bar chart with drill-down         |
| Comparison   | Values across ordered buckets                              | Column chart                      |
| Comparison   | Two or three groups side by side in each bucket            | Column chart with groups          |
| Comparison   | Values against a fixed target                              | Column chart with a target        |
| Comparison   | Values that can fall below zero                            | Column chart with negative values |
| Comparison   | Long names, and what each value is made of                 | Stacked bar chart                 |
| Comparison   | Values side by side, and what each is made of              | Stacked column chart              |
| Comparison   | Many categories at a glance, without heavy bars            | Dot plot                          |
| Trending     | Two to four values over time, in one unit                  | Line chart                        |
| Trending     | One value over time                                        | Area chart                        |
| Trending     | One value adding up over time, against a target            | Area chart with a running total   |
| Trending     | Two values over time, in two units                         | Combination chart                 |
| Composition  | Each column's parts as shares, when totals differ          | Stacked column chart to 100%      |
| Composition  | The share of a whole, two to five parts                    | Donut chart                       |
| Composition  | The share of a whole, small parts as "Others"              | Donut chart with Others           |
| Composition  | The share of a whole, with each part's value               | Chart legend: Campaigns by source |
| Relationship | How two measures move together                             | Scatter plot                      |
| Relationship | How three measures relate, the third as dot size           | Chart legend: Bubble chart        |
| Pipeline     | How many reach each stage                                  | Funnel chart                      |
| Pipeline     | How a value got from its start to its end                  | Waterfall chart                   |
| Metric       | One number, with its change                                | Metric: Closed won                |
| Metric       | One number, colored by the range it falls in               | Metric: Segment ranges            |
| Metric       | One number against a target                                | Gauge: Quota attainment           |
| Dashboard    | Several measures at once, on cards                         | Dashboard                         |
| Any          | A chart whose rows are loading or empty                    | Loading and empty states          |

## When not to use

- One number. Use Metric, or Gauge when it has a target.
- Values the reader will sort, filter or copy. Use Table or Data table.
- More than four lines or five slices. Split the chart, use a bar chart, or add the smallest parts up into "Others".
- A third unit. Two units get two titled axes, and a third needs a second chart.
- A chart type Chart doesn't draw:

| Chart             | Use instead                                      |
| ----------------- | ------------------------------------------------ |
| Treemap           | A donut chart of four named groups plus "Others" |
| Heatmap or matrix | Data table, with the values in its cells         |
| Map               | A bar chart by region                            |
| Sankey            | A stacked column chart of each source by target  |

## Usage

Every chart is Recharts composed inside `ChartContainer`, with a config that names each series and gives it a color.

```text
ChartContainer
└── a Recharts chart, like BarChart
    ├── axes, grid and series, like XAxis and Bar
    ├── ChartTooltip, with content={<ChartTooltipContent />}
    └── ChartLegend, with content={<ChartLegendContent />}
```

The tooltip and legend read their labels and colors from the config. To format tooltip values, map `payload` as below, so each row keeps its indicator and name.

```tsx
import { useId } from "react"
import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { stage: "Prospecting", amount: 420000 },
  { stage: "Qualification", amount: 310000 },
  { stage: "Negotiation/Review", amount: 180000 },
]

const config = {
  amount: { label: "Amount", color: "var(--chart-1)" },
} satisfies ChartConfig

// Swap en-US and USD for the org's locale and currency.
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function PipelineByStage() {
  const titleId = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle id={titleId}>Pipeline by stage</CardTitle>
        <CardDescription>This quarter, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart data={data} aria-labelledby={titleId}>
            <XAxis dataKey="stage" tickLine={false} axisLine={false} />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

Each config key gets `--color-<key>` inside the chart. Which fields are keys:

- A series key, the `dataKey` of a measure like `amount`, is a config key.
- In a donut or funnel, `nameKey` picks a row field, like `source`. That field's values (`Web`, `Partner Referral`) are config keys.
- A category axis's field, like `stage` above, needs no entry. Its values are the tick labels.
- A key can be a value straight from the data, spaces and punctuation included. Paint it with `chartColor(key)`, which returns the `var(--color-<key>)` the chart defines for it, escaped: `fill={chartColor(row.source)}`.
- When a tooltip looks up `config[row.segment].label`, as the Scatter plot example does, type the field as the config's keys. Rows from a query come as `string`, so check each value before you build them.

A config entry's `icon`, an icon component, takes the place of that series' swatch in the legend and its indicator in the tooltip, in the muted text color. `hideIcon` on `ChartLegendContent` brings the legend's swatches back.

From a report or query, take the keys from the grouping, the labels from its display values and the colors by position. Keep the four largest groups and add the rest into one "Others" row.

## Rules

### Rows and color

- Rows hold raw numbers (620000, never 620 "in thousands"), in the order drawn: largest first for comparisons and shares, buckets in their own order.
- Picklist values are data, written as Salesforce labels them: "Closed Won", "Proposal/Price Quote", "Partner Referral". A measure's name is sentence case: "Closed won" for the amount.
- One config per dashboard, `satisfies ChartConfig`, with `color` or `theme` per series. Never a `colors` array.
- Colors go `--chart-1` onward in order, as Lightning's dashboards draw them. The values of one grouping (stages, products, segments) take the palette in order, so three stages are blue, light blue and purple. Two different measures take `--chart-1` and `--chart-3`; the same measure in an earlier period takes its tint, `--chart-2`.
- The slice or bar that folds the small groups ("Others") takes `--chart-other`, a neutral, and goes last.
- Paint with `fill="var(--color-<key>)"`, or `chartColor(key)` for a key from data, never `Cell` or a hex value. Choose `data-chart-palette` per dashboard, not per chart.
- `--success` and `--destructive` only for marks that mean good or bad, with a sign or a word.
- At most four lines, five slices and about 12 bar categories.

### Axes and marks

- `tickLine={false} axisLine={false}` on every axis, `tickMargin={8}` on category axes, `width="auto"` on Y axes. Value axes start at zero.
- `margin={{ top: 12 }}` at least, or Recharts pushes the top tick's label below its gridline to keep it inside the chart.
- Horizontal bars and dot plots put the value axis on top and use `CartesianGrid horizontal={false}`; every other chart uses `vertical={false}`.
- Title an axis only when the card's description doesn't carry its unit. A rotated title takes `textAnchor: "middle"` so it centers on the axis. Two units get two titled `YAxis`, the second on the right; never three.
- Lines are `type="linear"` and `strokeWidth={2}`. One series over time is an `Area` with `fillOpacity={0.2}` and dots; two to four are `Line`s with `dot={false}`.
- `cursor={false}` on scatter, dot plot, donut and funnel.
- A waterfall shows a start, the steps and an end, never the parts of one number. Its rows are signed changes and totals; a stated total that doesn't match the steps before it adds a "Not accounted for" step, never a corrected one.
- A waterfall's steps go rises first, then falls, each largest first, or in time order, and in the same order in every period, so a filter moves them instead of shuffling them. Keep to about 10 steps and fold the smallest into "Other". One waterfall per card: they don't work as small multiples.

### Legend, tooltip and labels

- No legend for one series. Otherwise `<ChartLegend itemSorter={null} content={<ChartLegendContent />} />` below the chart, since Recharts sorts by name without it. Every legend entry must be a config key, or it shows a swatch with no text.
- Every legend reads swatch, then name. A legend of a field's values (stages, products, sources) starts with the field's name in muted text, as Lightning titles its legends; a legend of measures (Sales, Profit) has none. Put it in the legend's `content`, before `ChartLegendContent`.
- A donut's or funnel's legend sits on its right, top-aligned; every other chart's sits below. In a narrow card, every legend goes below.
- A scatter with groups builds its legend from the groups: `content={() => <ChartLegendContent payload={legend} />}`.
- Charts whose marks are blocks, like the funnel, take `data-chart-swatch="square"` on `ChartContainer`, so the legend and tooltip swatches match the marks.
- Format with a fixed locale: compact for ticks and labels ("$620K"), full for tooltips. Pass `compact.format`, never the formatter object. `formatter` on `ChartTooltipContent` replaces the whole row.
- A fixed target is a dashed `ReferenceLine` with `ifOverflow="extendDomain"`, or a target above the data disappears. Label it where no bar crosses the line. A target that changes by period is a dashed series. Only targets and forecasts are dashed.
- Value labels sit outside the bar: `<LabelList className="fill-foreground" />` at `right` or `top`. When every bar has one, hide the value axis and the grid. A waterfall keeps both, since its labels hide in a narrow card.
- A donut's total is a `Label` with `position="center"` whose content centers on `x + width / 2` and `y + height / 2`. A `"cx" in viewBox` check draws nothing.

### Names and states

- Keep the chart's box while rows load: `aria-busy="true"` on the card, a `Skeleton` at the chart's aspect ratio and an sr-only "Loading chart". Never empty axes or fake series.
- No rows is an `Empty` in the same box that says what's missing and what to change. An error is the same `Empty` with the message and a Retry button.
- Never pass `activeShape`.

## API reference

| Part | Built on |
| --- | --- |
| `ChartContainer` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ChartStyle` |  |
| `ChartTooltip` | [Recharts Tooltip](https://recharts.github.io/en-US/api/Tooltip/) |
| `ChartTooltipContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ChartLegend` | [Recharts Legend](https://recharts.github.io/en-US/api/Legend/) |
| `ChartLegendContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### ChartContainer

| Prop | Type | Default |
| --- | --- | --- |
| `config` | `ChartConfig` |  |
| `initialDimension`? | `{ width: number height: number }` | `{ width: 320, height: 200 }` |

### ChartStyle

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` |  |
| `config` | `ChartConfig` |  |

### ChartTooltipContent

| Prop | Type | Default |
| --- | --- | --- |
| `hideLabel`? | `boolean` | `false` |
| `hideIndicator`? | `boolean` | `false` |
| `indicator`? | `"line" \| "dot" \| "dashed"` | `"dot"` |
| `nameKey`? | `string` |  |
| `labelKey`? | `string` |  |

### ChartLegendContent

| Prop | Type | Default |
| --- | --- | --- |
| `hideIcon`? | `boolean` | `false` |
| `nameKey`? | `string` |  |
| `verticalAlign`? | `"top" \| "bottom" \| "middle"` | `"bottom"` |

### chartColor

The `var(--color-<key>)` a config key sets, for any key, spaces included.

| Parameter | Type | Default |
| --- | --- | --- |
| `key` | `string` |  |

Returns `string`.

### ChartConfig

```ts
type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>
```

## SLDS mapping

SLDS 2 has no chart stylesheet or blueprint. The Charts guidelines set the look, and the tokens set the values.

- Series colors `--chart-1` to `--chart-6` are Lightning's default chart palette, in hue and tint pairs: blue, light blue, purple, light purple, teal, light teal. Dark mode takes the darker set a Lightning dashboard draws there.
- `data-chart-palette` on any element inside the theme root switches the charts in it to Salesforce's other dashboard palettes, with the names a dashboard's properties use. `default` and `color-safe` are categorical, with distinct hues. `bluegrass`, `sunrise`, `water` and `watermelon` are sequential, light to dark, for ordered buckets.
- The tooltip is SLDS's hover tooltip on the popover surface. Legend swatches and tooltip dots are SLDS's legend dots.
- The donut is SLDS's thin ring, starting at 12 o'clock and running clockwise. The funnel is SLDS's: a stacked column, each stage as tall as its value, clipped to a taper.
- A chart sits on a card, as a Lightning dashboard component does: the card's title, description and footer play its title, subtitle and footer. The title names what's measured ("Sales by account"), never the chart type; the description holds the period and the unit.

Known gaps:

- Compact numbers print "$620K". Salesforce prints a lowercase "k".
- Recharts' legend can't show values beside each entry or a size scale. Use Chart legend in HTML beside the chart.
- Not drawn: treemap, heatmap, map, sankey and origami. When not to use lists what to draw instead.

## Keyboard interactions

Each chart is one tab stop.

| Key                      | Action                                                  |
| ------------------------ | ------------------------------------------------------- |
| ArrowRight and ArrowLeft | Move along the data and show the tooltip for each point |
| Escape                   | Hide the tooltip                                        |

- On horizontal bars (`layout="vertical"`), ArrowLeft moves down the list and ArrowRight moves up. ArrowUp, ArrowDown, Home and End do nothing.
- The arrows walk only the first `Scatter` of a chart, so put every row in one.
- The funnel is one point to Recharts. Focus shows the first stage and the arrows don't move, so draw each stage's count on its band and name each stage with its count in an HTML legend, as the Funnel chart example does.
- The keys can't choose a mark. To drill into the records behind a bar, take the click from `Bar` `onClick` and give keyboard users a second control after the chart, such as a `select` of the same categories, as the Bar chart with drill-down example does.

## Accessibility

- Name every chart from visible text: `aria-labelledby` on the chart root, pointing at the `CardTitle` of the card it sits on. Don't use the `title` prop, which draws an SVG title that browsers may show on hover.
- Moving with the arrow keys announces nothing. Put the key numbers in HTML near the chart, as a table or a sentence, when exact values matter.
- A `Pie` adds a second tab stop unless it has `rootTabIndex={-1}`.
- Color never carries meaning alone. Label the series, dash targets, give changes a sign, and name a scatter's group in its tooltip.
- The palettes are Salesforce's as published. The lighter tints sit under 3:1 on white, so label them and check the series you draw against your background.

## Motion

- Series animate in on mount and when the data changes. Keep the chart mounted and its series keys stable, so it moves from the old values to the new; don't key a chart by period.
- A period switch keeps one value axis for every period: `getNiceTickValues` over all the periods' rows, passed as `ticks` and as the top of `domain`. Marks then move against a steady scale, and periods compare honestly; Recharts doesn't animate an axis that rescales.
- Bars match old to new by their category with `animationMatchBy={matchByDataKey("size")}`, so a category that comes or goes grows in or shrinks out instead of the bars beside it shifting values.
- Lines, areas and donuts take `animationDuration={800}` and `animationEasing="cubic-bezier(0.42,0,0.58,1)"`, and a `Pie` also takes `animationBegin={0}`. Recharts' named easings don't match CSS: its `ease-in-out` is CSS's ease-out.
- The tooltip fades in and moves between points in 0.1s.
- A leaving stacked column collapses as one block, and each donut slice slides from its old angles to its new ones, so a slice that changes rank slides past its neighbour and a leaving slice sweeps shut where it was, each through the example's `animationInterpolateFn`; Recharts' defaults split the stack into slivers and snap the ring to the new order.
- A waterfall's steps grow from their own start, not from zero, through the example's `animationInterpolateFn`; a step that leaves drops its label at once.
- With reduced motion, series and tooltip don't animate.

## Responsive behavior

- `ChartContainer` fills its width at 16:9 and redraws on resize. Inside a flex parent it has no width of its own, so give it `w-full`.
- Under 24rem, as in a third of a dashboard, 16:9 leaves too little plot. Put `@container` on the figure or card and `@max-sm:aspect-square` on `ChartContainer`.
- A donut with its legend on the right takes `mx-auto aspect-[3/2] w-full max-w-md`; with the legend below, `mx-auto aspect-square w-full max-w-72`. A funnel takes `aspect-[4/3] w-full` beside its legend, which moves under it in a narrow card.
- A legend on the right needs about 400px. In a narrow card, put it below: a legend is a prop, so the donut example reads `useChartWidth()` and moves it under 384px.
- On an ordered axis (months, size buckets), thin crowded ticks evenly with `interval="equidistantPreserveStart"`. Never thin names that aren't ordered, like accounts: `interval={0}` and a tick that wraps them, as the bar chart's does. When every name must show, as a waterfall's steps must, use `interval={0}` and a tick that wraps names under their column and turns them 45° below about 56px a column.

## Performance

- Each chart is one SVG, and Recharts adds about 100 kB gzipped to the bundle.
- Hundreds of points draw fine. Lightning turns hover off above 200 points; aggregate or bin the data before that.
- Keep `data` and the config outside the component or in state, so Recharts doesn't animate the same series again on every render.

## Example code

### Bar chart

Comparison. Sales by account as horizontal bars, largest first, long names wrapped to two lines, with a period switch that reorders them on one axis.

```tsx
"use client"

import { useId, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  getNiceTickValues,
  matchByDataKey,
  Text,
  useChartWidth,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisQuarter = [
  { account: "United Oil & Gas Corp.", sales: 620000 },
  { account: "Edge Communications", sales: 560000 },
  { account: "Burlington Textiles", sales: 480000 },
  { account: "Grand Hotels & Resorts", sales: 350000 },
  { account: "Dickenson plc", sales: 240000 },
  { account: "GenePoint", sales: 130000 },
]

const lastQuarter = [
  { account: "Edge Communications", sales: 540000 },
  { account: "Burlington Textiles", sales: 510000 },
  { account: "United Oil & Gas Corp.", sales: 390000 },
  { account: "Express Logistics and Transport", sales: 330000 },
  { account: "Grand Hotels & Resorts", sales: 280000 },
  { account: "Dickenson plc", sales: 170000 },
]

const periods = { "This quarter": thisQuarter, "Last quarter": lastQuarter }
const highest = Math.max(
  ...[...thisQuarter, ...lastQuarter].map((row) => row.sales)
)
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Period = keyof typeof periods

function ValueTick({
  x,
  y,
  payload,
  index,
  width,
  visibleTicksCount,
}: XAxisTickContentProps) {
  if (index % 2 && Number(width) / (visibleTicksCount - 1) < 56) return null
  return (
    <Text
      x={x}
      y={y}
      textAnchor="middle"
      verticalAnchor="end"
      className="recharts-cartesian-axis-tick-value"
    >
      {compact.format(Number(payload.value))}
    </Text>
  )
}

function AccountName({ x, y, payload }: YAxisTickContentProps) {
  const chartWidth = useChartWidth() ?? 0
  return (
    <Text
      x={x}
      y={y}
      width={Math.min(Math.max(chartWidth / 3, 100), 144)}
      maxLines={2}
      textAnchor="end"
      verticalAnchor="middle"
      className="recharts-cartesian-axis-tick-value"
      style={{ fontSize: "var(--chart-text-size)" }}
    >
      {String(payload.value)}
    </Text>
  )
}

export default function ChartDefault() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This quarter")

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales by account</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={periods[period]}
            layout="vertical"
            margin={{ left: 8, right: 24 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              orientation="top"
              tickLine={false}
              axisLine={false}
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              interval={0}
              tick={ValueTick}
            />
            <YAxis
              dataKey="account"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width="auto"
              interval={0}
              tick={(props: YAxisTickContentProps) => (
                <AccountName {...props} />
              )}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              animationMatchBy={matchByDataKey("account")}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Bar chart with values

Comparison. Open pipeline by account with each bar's value at its end, so the value axis and the grid are hidden.

```tsx
"use client"

import { useId } from "react"
import {
  Bar,
  BarChart,
  LabelList,
  Text,
  useChartWidth,
  XAxis,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const pipeline = [
  { account: "Express Logistics and Transport", amount: 1240000 },
  { account: "University of Arizona", amount: 960000 },
  { account: "Pyramid Construction Inc.", amount: 815000 },
  { account: "Grand Hotels & Resorts", amount: 640000 },
  { account: "United Oil & Gas Corp.", amount: 470000 },
  { account: "sForce", amount: 285000 },
  { account: "GenePoint", amount: 120000 },
]

const config = {
  amount: { label: "Open pipeline", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const labelWidth =
  Math.max(...pipeline.map((row) => compact.format(row.amount).length)) * 8

function AccountName({ x, y, payload }: YAxisTickContentProps) {
  const chartWidth = useChartWidth() ?? 0
  return (
    <Text
      x={x}
      y={y}
      width={Math.min(Math.max(chartWidth / 3, 100), 144)}
      maxLines={2}
      textAnchor="end"
      verticalAnchor="middle"
      className="recharts-cartesian-axis-tick-value"
      style={{ fontSize: "var(--chart-text-size)" }}
    >
      {String(payload.value)}
    </Text>
  )
}

export default function ChartBarValues() {
  const titleId = useId()

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Open pipeline by account</CardTitle>
        <CardDescription>USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={pipeline}
            layout="vertical"
            margin={{ left: 8, right: labelWidth + 8 }}
            aria-labelledby={titleId}
          >
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis
              dataKey="account"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width="auto"
              interval={0}
              tick={(props: YAxisTickContentProps) => (
                <AccountName {...props} />
              )}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Bar dataKey="amount" fill="var(--color-amount)">
              <LabelList
                dataKey="amount"
                position="right"
                className="fill-foreground"
                formatter={(value) => compact.format(Number(value))}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Bar chart of the top five

Comparison. The five largest of fifteen accounts, sorted and sliced from the rows, with a line under the chart that states the rest and their total.

```tsx
"use client"

import { useId } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  getNiceTickValues,
  Text,
  useChartWidth,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const accounts = [
  { account: "Burlington Textiles", sales: 480000 },
  { account: "Cloud Kicks", sales: 95000 },
  { account: "Dickenson plc", sales: 240000 },
  { account: "Edge Communications", sales: 560000 },
  { account: "Express Logistics and Transport", sales: 330000 },
  { account: "GenePoint", sales: 130000 },
  { account: "Global Media", sales: 210000 },
  { account: "Grand Hotels & Resorts", sales: 350000 },
  { account: "Northern Trail Outfitters", sales: 180000 },
  { account: "Pyramid Construction Inc.", sales: 290000 },
  { account: "sForce", sales: 60000 },
  { account: "United Oil & Gas Corp.", sales: 620000 },
  { account: "United Oil & Gas, Singapore", sales: 150000 },
  { account: "United Oil & Gas, UK", sales: 270000 },
  { account: "University of Arizona", sales: 115000 },
]

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const ranked = [...accounts].sort((a, b) => b.sales - a.sales)
const top = ranked.slice(0, 5)
const rest = ranked.slice(5)
const restSales = rest.reduce((sum, row) => sum + row.sales, 0)
const highest = top[0]?.sales ?? 0
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

function ValueTick({
  x,
  y,
  payload,
  index,
  width,
  visibleTicksCount,
}: XAxisTickContentProps) {
  if (index % 2 && Number(width) / (visibleTicksCount - 1) < 56) return null
  return (
    <Text
      x={x}
      y={y}
      textAnchor="middle"
      verticalAnchor="end"
      className="recharts-cartesian-axis-tick-value"
    >
      {compact.format(Number(payload.value))}
    </Text>
  )
}

function AccountName({ x, y, payload }: YAxisTickContentProps) {
  const chartWidth = useChartWidth() ?? 0
  return (
    <Text
      x={x}
      y={y}
      width={Math.min(Math.max(chartWidth / 3, 100), 144)}
      maxLines={2}
      textAnchor="end"
      verticalAnchor="middle"
      className="recharts-cartesian-axis-tick-value"
      style={{ fontSize: "var(--chart-text-size)" }}
    >
      {String(payload.value)}
    </Text>
  )
}

export default function ChartBarTop() {
  const titleId = useId()

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales by account</CardTitle>
        <CardDescription>Top five, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={top}
            layout="vertical"
            margin={{ left: 8, right: 24 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              orientation="top"
              tickLine={false}
              axisLine={false}
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              interval={0}
              tick={ValueTick}
            />
            <YAxis
              dataKey="account"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width="auto"
              interval={0}
              tick={(props: YAxisTickContentProps) => (
                <AccountName {...props} />
              )}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Bar dataKey="sales" fill="var(--color-sales)" />
          </BarChart>
        </ChartContainer>
        {rest.length > 0 && (
          <p className="mt-3 text-center text-(length:--chart-text-size) text-foreground tabular-nums">
            {rest.length} more {rest.length === 1 ? "account" : "accounts"},{" "}
            {compact.format(restSales)} in all
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

### Bar chart with drill-down

Comparison. Choosing an account's bar, or the account in a select, lists its open opportunities in a table under the chart.

```tsx
"use client"

import { useId, useRef, useState } from "react"
import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  getNiceTickValues,
  Rectangle,
  Text,
  useChartWidth,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Empty, EmptyDescription } from "@/components/ui/empty"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const pipeline = [
  { account: "United Oil & Gas Corp.", amount: 620000 },
  { account: "Edge Communications", amount: 560000 },
  { account: "Burlington Textiles", amount: 480000 },
  { account: "Grand Hotels & Resorts", amount: 350000 },
  { account: "Dickenson plc", amount: 240000 },
  { account: "GenePoint", amount: 130000 },
]

const opportunities = [
  {
    account: "United Oil & Gas Corp.",
    name: "United Oil Refinery Generators",
    stage: "Proposal/Price Quote",
    closeDate: "2026-11-20",
    amount: 270000,
  },
  {
    account: "United Oil & Gas Corp.",
    name: "United Oil Plant Standby Generators",
    stage: "Needs Analysis",
    closeDate: "2027-01-15",
    amount: 175000,
  },
  {
    account: "United Oil & Gas Corp.",
    name: "United Oil Emergency Generators",
    stage: "Negotiation/Review",
    closeDate: "2026-10-30",
    amount: 120000,
  },
  {
    account: "United Oil & Gas Corp.",
    name: "United Oil Installations",
    stage: "Prospecting",
    closeDate: "2027-02-26",
    amount: 55000,
  },
  {
    account: "Edge Communications",
    name: "Edge Emergency Generator",
    stage: "Value Proposition",
    closeDate: "2026-12-11",
    amount: 240000,
  },
  {
    account: "Edge Communications",
    name: "Edge Installation",
    stage: "Negotiation/Review",
    closeDate: "2026-11-06",
    amount: 185000,
  },
  {
    account: "Edge Communications",
    name: "Edge SLA",
    stage: "Proposal/Price Quote",
    closeDate: "2026-12-18",
    amount: 135000,
  },
  {
    account: "Burlington Textiles",
    name: "Burlington Textiles Weaving Plant Generator",
    stage: "Perception Analysis",
    closeDate: "2026-12-04",
    amount: 235000,
  },
  {
    account: "Burlington Textiles",
    name: "Burlington Textiles Mill Standby Generators",
    stage: "Qualification",
    closeDate: "2027-01-29",
    amount: 160000,
  },
  {
    account: "Burlington Textiles",
    name: "Burlington Textiles Installations",
    stage: "Prospecting",
    closeDate: "2027-03-12",
    amount: 85000,
  },
  {
    account: "Grand Hotels & Resorts",
    name: "Grand Hotels Emergency Generators",
    stage: "Id. Decision Makers",
    closeDate: "2026-12-15",
    amount: 150000,
  },
  {
    account: "Grand Hotels & Resorts",
    name: "Grand Hotels Generator Installations",
    stage: "Negotiation/Review",
    closeDate: "2026-11-13",
    amount: 120000,
  },
  {
    account: "Grand Hotels & Resorts",
    name: "Grand Hotels Kitchen Generator",
    stage: "Qualification",
    closeDate: "2027-01-22",
    amount: 80000,
  },
  {
    account: "Dickenson plc",
    name: "Dickenson Mobile Generators",
    stage: "Proposal/Price Quote",
    closeDate: "2026-11-27",
    amount: 155000,
  },
  {
    account: "Dickenson plc",
    name: "Dickenson Standby Generators",
    stage: "Prospecting",
    closeDate: "2027-02-12",
    amount: 85000,
  },
  {
    account: "GenePoint",
    name: "GenePoint Lab Generators",
    stage: "Value Proposition",
    closeDate: "2026-12-30",
    amount: 90000,
  },
  {
    account: "GenePoint",
    name: "GenePoint SLA",
    stage: "Qualification",
    closeDate: "2027-01-08",
    amount: 40000,
  },
]

const highest = Math.max(...pipeline.map((row) => row.amount))
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  amount: { label: "Open pipeline", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})
const date = new Intl.DateTimeFormat("en-US", { timeZone: "UTC" })

function ValueTick({
  x,
  y,
  payload,
  index,
  width,
  visibleTicksCount,
}: XAxisTickContentProps) {
  if (index % 2 && Number(width) / (visibleTicksCount - 1) < 56) return null
  return (
    <Text
      x={x}
      y={y}
      textAnchor="middle"
      verticalAnchor="end"
      className="recharts-cartesian-axis-tick-value"
    >
      {compact.format(Number(payload.value))}
    </Text>
  )
}

function AccountName({ x, y, payload }: YAxisTickContentProps) {
  const chartWidth = useChartWidth() ?? 0
  return (
    <Text
      x={x}
      y={y}
      width={Math.min(Math.max(chartWidth / 3, 100), 144)}
      maxLines={2}
      textAnchor="end"
      verticalAnchor="middle"
      className="recharts-cartesian-axis-tick-value"
      style={{ fontSize: "var(--chart-text-size)" }}
    >
      {String(payload.value)}
    </Text>
  )
}

export default function ChartBarDrillDown() {
  const titleId = useId()
  const selectId = useId()
  const selectRef = useRef<HTMLSelectElement>(null)
  const [account, setAccount] = useState("")
  const rows = opportunities.filter((row) => row.account === account)

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Open pipeline by account</CardTitle>
        <CardDescription>
          Choose a bar or an account to see its opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="@container">
          <ChartContainer
            config={config}
            className="w-full @max-sm:aspect-square"
          >
            <BarChart
              data={pipeline}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
              aria-labelledby={titleId}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                orientation="top"
                tickLine={false}
                axisLine={false}
                ticks={ticks}
                domain={[0, ticks.at(-1)!]}
                interval={0}
                tick={ValueTick}
              />
              <YAxis
                dataKey="account"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width="auto"
                interval={0}
                tick={(props: YAxisTickContentProps) => (
                  <AccountName {...props} />
                )}
              />
              <ChartTooltip
                content={({ active, payload, label }) => (
                  <ChartTooltipContent
                    active={active}
                    label={label}
                    payload={payload?.map((item) => ({
                      ...item,
                      value: full.format(Number(item.value)),
                    }))}
                  />
                )}
              />
              <Bar
                dataKey="amount"
                fill="var(--color-amount)"
                className="cursor-pointer"
                onClick={(bar) => setAccount(bar.payload.account)}
                shape={(props: BarShapeProps) => (
                  <Rectangle
                    {...props}
                    fillOpacity={
                      !account || props.payload.account === account ? 1 : 0.4
                    }
                  />
                )}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor={selectId}>Account</Label>
          <NativeSelect
            id={selectId}
            ref={selectRef}
            value={account}
            onChange={(event) => setAccount(event.target.value)}
          >
            <NativeSelectOption value="" disabled>
              Choose an account
            </NativeSelectOption>
            {pipeline.map((row) => (
              <NativeSelectOption key={row.account} value={row.account}>
                {row.account}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Button
            variant="outline"
            disabled={!account}
            onClick={() => {
              setAccount("")
              selectRef.current?.focus()
            }}
          >
            Clear
          </Button>
        </div>
        {account ? (
          <Table>
            <TableCaption>Open opportunities: {account}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity name</TableHead>
                <TableHead className="@max-md:hidden">Stage</TableHead>
                <TableHead className="@max-md:hidden">Close date</TableHead>
                <TableHead className="text-end">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="whitespace-normal">
                    {row.name}
                    <span className="block text-muted-foreground @md:hidden">
                      {row.stage}, {date.format(new Date(row.closeDate))}
                    </span>
                  </TableCell>
                  <TableCell className="@max-md:hidden">{row.stage}</TableCell>
                  <TableCell className="@max-md:hidden">
                    {date.format(new Date(row.closeDate))}
                  </TableCell>
                  <TableCell className="text-end tabular-nums">
                    {full.format(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell className="@max-md:hidden" />
                <TableCell className="@max-md:hidden" />
                <TableCell className="text-end tabular-nums">
                  {full.format(rows.reduce((sum, row) => sum + row.amount, 0))}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <Empty className="border">
            <EmptyDescription className="text-muted-foreground">
              Choose a bar or an account to list its open opportunities.
            </EmptyDescription>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
```

### Column chart

Comparison. Sales by account size as columns in the buckets' own order, with a period switch that moves them against one value axis.

```tsx
"use client"

import { useId, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  getNiceTickValues,
  matchByDataKey,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisYear = [
  { size: "0-5K", sales: 13000000 },
  { size: "5-10K", sales: 34000000 },
  { size: "10-15K", sales: 25000000 },
  { size: "15-20K", sales: 48000000 },
  { size: "20-25K", sales: 29000000 },
  { size: "25-30K", sales: 39000000 },
  { size: "30-35K", sales: 7000000 },
  { size: "35-40K", sales: 13000000 },
]

const lastYear = [
  { size: "0-5K", sales: 11000000 },
  { size: "5-10K", sales: 29000000 },
  { size: "10-15K", sales: 27000000 },
  { size: "15-20K", sales: 36000000 },
  { size: "20-25K", sales: 22000000 },
  { size: "25-30K", sales: 31000000 },
  { size: "30-35K", sales: 9000000 },
]

const periods = { "This year": thisYear, "Last year": lastYear }
const highest = Math.max(...[...thisYear, ...lastYear].map((row) => row.sales))
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Period = keyof typeof periods

export default function ChartColumn() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This year")

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales by account size</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={periods[period]}
            margin={{ top: 12, left: 8, right: 8 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="size"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
              height={44}
              label={{
                value: "Account size (employees)",
                position: "insideBottom",
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  labelFormatter={(value) => `${value} employees`}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              animationMatchBy={matchByDataKey("size")}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Column chart with groups

Comparison. Sales by quarter with a column per product line side by side, a distinct hue each, the legend below and both values in the tooltip.

```tsx
"use client"

import { useId } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  getNiceTickValues,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { quarter: "Q1", generators: 410000, installation: 260000 },
  { quarter: "Q2", generators: 470000, installation: 310000 },
  { quarter: "Q3", generators: 440000, installation: 350000 },
  { quarter: "Q4", generators: 580000, installation: 390000 },
]

const highest = Math.max(
  ...data.flatMap((row) => [row.generators, row.installation])
)
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  generators: { label: "Generators", color: "var(--chart-1)" },
  installation: { label: "Installation", color: "var(--chart-2)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export default function ChartColumnGroups() {
  const titleId = useId()

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales by quarter and product line</CardTitle>
        <CardDescription>USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={data}
            margin={{ top: 12, left: 8, right: 8 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <ChartLegend
              itemSorter={null}
              content={({ payload }) => (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
                  <span className="text-muted-foreground">Product line</span>
                  <ChartLegendContent payload={payload} className="pt-0" />
                </div>
              )}
            />
            <Bar dataKey="generators" fill="var(--color-generators)" />
            <Bar dataKey="installation" fill="var(--color-installation)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Column chart with a target

Comparison. Closed won by month against a fixed target, drawn as a dashed line labelled with its value where no column crosses it.

```tsx
"use client"

import { useId } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  getNiceTickValues,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", closedWon: 180000 },
  { month: "Feb", closedWon: 215000 },
  { month: "Mar", closedWon: 230000 },
  { month: "Apr", closedWon: 290000 },
  { month: "May", closedWon: 240000 },
  { month: "Jun", closedWon: 385000 },
]

const target = 250000
const highest = Math.max(target, ...data.map((row) => row.closedWon))
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  closedWon: { label: "Closed won", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export default function ChartColumnTarget() {
  const titleId = useId()

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Closed won by month</CardTitle>
        <CardDescription>
          Against a {compact.format(target)} target, USD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={data}
            margin={{ top: 12, left: 8, right: 8 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Bar dataKey="closedWon" fill="var(--color-closedWon)" />
            <ReferenceLine
              y={target}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
              label={{
                value: `Target ${compact.format(target)}`,
                position: "insideBottomLeft",
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Column chart with negative values

Comparison. Net new ARR by month on an axis that runs below zero, losing months growing down from a zero line, with the sign in the tooltip.

```tsx
"use client"

import { useId } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  getNiceTickValues,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", netNewArr: 96000 },
  { month: "Feb", netNewArr: -24000 },
  { month: "Mar", netNewArr: 140000 },
  { month: "Apr", netNewArr: 52000 },
  { month: "May", netNewArr: -38000 },
  { month: "Jun", netNewArr: 118000 },
]

const values = data.map((row) => row.netNewArr)
const highest = Math.max(0, ...values)
const ticks = getNiceTickValues(
  [Math.min(0, ...values), highest],
  6,
  true,
  "snap125"
).filter((tick, index, all) => index === 0 || all[index - 1]! < highest)

const config = {
  netNewArr: { label: "Net new ARR", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const signed = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
})

export default function ChartColumnNegative() {
  const titleId = useId()

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Net new ARR by month</CardTitle>
        <CardDescription>USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={data}
            margin={{ top: 12, left: 8, right: 8 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[ticks[0]!, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ReferenceLine y={0} />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: signed.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Bar dataKey="netNewArr" fill="var(--color-netNewArr)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Stacked bar chart

Comparison. Open pipeline by owner as horizontal bars stacked by stage, the legend below, the total in the tooltip, and a period switch on one axis.

```tsx
"use client"

import { useId, useState } from "react"
import {
  type AnimationItem,
  Bar,
  BarChart,
  type BarRectangleItem,
  CartesianGrid,
  getNiceTickValues,
  matchByDataKey,
  Text,
  useChartWidth,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisQuarter = [
  {
    owner: "Ashley Chen",
    qualification: 180000,
    needsAnalysis: 240000,
    proposal: 310000,
    negotiation: 150000,
  },
  {
    owner: "Marcus Webb",
    qualification: 120000,
    needsAnalysis: 200000,
    proposal: 260000,
    negotiation: 210000,
  },
  {
    owner: "Priya Raman",
    qualification: 210000,
    needsAnalysis: 150000,
    proposal: 180000,
    negotiation: 90000,
  },
  {
    owner: "Daniel Ortiz",
    qualification: 90000,
    needsAnalysis: 130000,
    proposal: 120000,
    negotiation: 160000,
  },
  {
    owner: "Grace Kim",
    qualification: 140000,
    needsAnalysis: 110000,
    proposal: 0,
    negotiation: 60000,
  },
]

const lastQuarter = [
  {
    owner: "Marcus Webb",
    qualification: 160000,
    needsAnalysis: 230000,
    proposal: 290000,
    negotiation: 240000,
  },
  {
    owner: "Ashley Chen",
    qualification: 150000,
    needsAnalysis: 190000,
    proposal: 220000,
    negotiation: 120000,
  },
  {
    owner: "Rachel Adams",
    qualification: 100000,
    needsAnalysis: 140000,
    proposal: 170000,
    negotiation: 110000,
  },
  {
    owner: "Priya Raman",
    qualification: 130000,
    needsAnalysis: 120000,
    proposal: 90000,
    negotiation: 60000,
  },
  {
    owner: "Daniel Ortiz",
    qualification: 70000,
    needsAnalysis: 0,
    proposal: 110000,
    negotiation: 80000,
  },
]

const config = {
  qualification: { label: "Qualification", color: "var(--chart-1)" },
  needsAnalysis: { label: "Needs Analysis", color: "var(--chart-2)" },
  proposal: { label: "Proposal/Price Quote", color: "var(--chart-3)" },
  negotiation: { label: "Negotiation/Review", color: "var(--chart-4)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Row = (typeof thisQuarter)[number]

const periods = { "This quarter": thisQuarter, "Last quarter": lastQuarter }
const stages = Object.keys(config) as (keyof typeof config)[]
const total = (row: Row) => stages.reduce((sum, stage) => sum + row[stage], 0)
const highest = Math.max(...[...thisQuarter, ...lastQuarter].map(total))
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

type Period = keyof typeof periods

function growFromBase(
  items: readonly AnimationItem<BarRectangleItem>[] | null,
  t: number
) {
  const flat = (bar: BarRectangleItem) => ({
    ...bar,
    x: bar.stackedBarStart,
    width: 0,
  })
  const tween = (from: number, to: number) => from + (to - from) * t
  return (items ?? []).flatMap((item) => {
    if (item.status === "removed" && t === 1) return []
    const from = item.status === "added" ? flat(item.next) : item.prev
    const to = item.status === "removed" ? flat(item.prev) : item.next
    return [
      {
        ...to,
        x: tween(from.x, to.x),
        y: tween(from.y, to.y),
        width: tween(from.width, to.width),
        height: tween(from.height, to.height),
      },
    ]
  })
}

function ValueTick({
  x,
  y,
  payload,
  index,
  width,
  visibleTicksCount,
}: XAxisTickContentProps) {
  if (index % 2 && Number(width) / (visibleTicksCount - 1) < 48) return null
  return (
    <Text
      x={x}
      y={y}
      textAnchor="middle"
      verticalAnchor="end"
      className="recharts-cartesian-axis-tick-value"
    >
      {compact.format(Number(payload.value))}
    </Text>
  )
}

function OwnerName({ x, y, payload }: YAxisTickContentProps) {
  const chartWidth = useChartWidth() ?? 0
  return (
    <Text
      x={x}
      y={y}
      width={Math.min(Math.max(chartWidth / 3, 100), 144)}
      maxLines={2}
      textAnchor="end"
      verticalAnchor="middle"
      className="recharts-cartesian-axis-tick-value"
      style={{ fontSize: "var(--chart-text-size)" }}
    >
      {String(payload.value)}
    </Text>
  )
}

export default function ChartStackedBar() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This quarter")
  const totals = new Map(periods[period].map((row) => [row.owner, total(row)]))

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Open pipeline by owner and stage</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={periods[period]}
            layout="vertical"
            margin={{ left: 8, right: 24 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              orientation="top"
              tickLine={false}
              axisLine={false}
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              interval={0}
              tick={ValueTick}
            />
            <YAxis
              dataKey="owner"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width="auto"
              interval={0}
              tick={(props: YAxisTickContentProps) => <OwnerName {...props} />}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  labelFormatter={(value) =>
                    `${value}: ${full.format(totals.get(String(value)) ?? 0)}`
                  }
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <ChartLegend
              itemSorter={null}
              content={({ payload }) => (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
                  <span className="text-muted-foreground">Stage</span>
                  <ChartLegendContent payload={payload} className="pt-0" />
                </div>
              )}
            />
            {stages.map((stage) => (
              <Bar
                key={stage}
                dataKey={stage}
                stackId="pipeline"
                fill={`var(--color-${stage})`}
                animationMatchBy={matchByDataKey("owner")}
                animationInterpolateFn={growFromBase}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Stacked column chart

Comparison. Sales by account size and product, a color per product, the legend below, the total in the tooltip, and a period switch on one axis.

```tsx
"use client"

import { useId, useState } from "react"
import {
  type AnimationItem,
  Bar,
  BarChart,
  type BarRectangleItem,
  CartesianGrid,
  getNiceTickValues,
  matchByDataKey,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisYear = [
  { size: "0-5K", productA: 4000000, productB: 4000000, productC: 4000000 },
  { size: "5-10K", productA: 12000000, productB: 15000000, productC: 10000000 },
  { size: "10-15K", productA: 10000000, productB: 9000000, productC: 8000000 },
  {
    size: "15-20K",
    productA: 13000000,
    productB: 16000000,
    productC: 14000000,
  },
  { size: "20-25K", productA: 8000000, productB: 8000000, productC: 4000000 },
  { size: "25-30K", productA: 12000000, productB: 12000000, productC: 7000000 },
  { size: "30-35K", productA: 2000000, productB: 2000000, productC: 1000000 },
  { size: "35-40K", productA: 5000000, productB: 5000000, productC: 3000000 },
]

const lastYear = [
  { size: "0-5K", productA: 3000000, productB: 5000000, productC: 2000000 },
  { size: "5-10K", productA: 10000000, productB: 14000000, productC: 5000000 },
  { size: "10-15K", productA: 11000000, productB: 10000000, productC: 4000000 },
  { size: "15-20K", productA: 12000000, productB: 15000000, productC: 7000000 },
  { size: "20-25K", productA: 9000000, productB: 8000000, productC: 3000000 },
  { size: "25-30K", productA: 10000000, productB: 11000000, productC: 4000000 },
  { size: "30-35K", productA: 3000000, productB: 3000000, productC: 1000000 },
]

const periods = { "This year": thisYear, "Last year": lastYear }
const highest = Math.max(
  ...[...thisYear, ...lastYear].map(
    (row) => row.productA + row.productB + row.productC
  )
)
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  productA: { label: "Product A", color: "var(--chart-1)" },
  productB: { label: "Product B", color: "var(--chart-2)" },
  productC: { label: "Product C", color: "var(--chart-3)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Period = keyof typeof periods

function growFromBase(
  items: readonly AnimationItem<BarRectangleItem>[] | null,
  t: number
) {
  const flat = (bar: BarRectangleItem) => ({
    ...bar,
    y: bar.stackedBarStart,
    height: 0,
  })
  const tween = (from: number, to: number) => from + (to - from) * t
  return (items ?? []).flatMap((item) => {
    if (item.status === "removed" && t === 1) return []
    const from = item.status === "added" ? flat(item.next) : item.prev
    const to = item.status === "removed" ? flat(item.prev) : item.next
    return [
      {
        ...to,
        x: tween(from.x, to.x),
        y: tween(from.y, to.y),
        width: tween(from.width, to.width),
        height: tween(from.height, to.height),
      },
    ]
  })
}

export default function ChartStacked() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This year")
  const totals = new Map(
    periods[period].map((row) => [
      row.size,
      row.productA + row.productB + row.productC,
    ])
  )

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales by account size and product</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={periods[period]}
            margin={{ top: 12, left: 8, right: 8 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="size"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  labelFormatter={(value) =>
                    `${value} employees: ${full.format(totals.get(String(value)) ?? 0)}`
                  }
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <ChartLegend
              itemSorter={null}
              content={({ payload }) => (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
                  <span className="text-muted-foreground">Product</span>
                  <ChartLegendContent payload={payload} className="pt-0" />
                </div>
              )}
            />
            <Bar
              dataKey="productA"
              stackId="sales"
              fill="var(--color-productA)"
              animationMatchBy={matchByDataKey("size")}
              animationInterpolateFn={growFromBase}
            />
            <Bar
              dataKey="productB"
              stackId="sales"
              fill="var(--color-productB)"
              animationMatchBy={matchByDataKey("size")}
              animationInterpolateFn={growFromBase}
            />
            <Bar
              dataKey="productC"
              stackId="sales"
              fill="var(--color-productC)"
              animationMatchBy={matchByDataKey("size")}
              animationInterpolateFn={growFromBase}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Stacked column chart to 100%

Composition. Opportunity outcomes by region as shares of each column, stacked to 100%, with each part's count and share in the tooltip.

```tsx
"use client"

import { useId } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const regions = [
  { region: "West", won: 62, open: 50, lost: 38 },
  { region: "North", won: 45, open: 35, lost: 40 },
  { region: "Central", won: 28, open: 22, lost: 30 },
  { region: "East", won: 51, open: 63, lost: 66 },
  { region: "South", won: 18, open: 28, lost: 34 },
]

const totals = new Map(
  regions.map((row) => [row.region, row.won + row.open + row.lost])
)

const config = {
  won: { label: "Closed Won", color: "var(--chart-1)" },
  open: { label: "Open", color: "var(--chart-2)" },
  lost: { label: "Closed Lost", color: "var(--chart-3)" },
} satisfies ChartConfig

const count = new Intl.NumberFormat("en-US")
const percent = new Intl.NumberFormat("en-US", { style: "percent" })

export default function ChartStackedPercent() {
  const titleId = useId()

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>
          Share of opportunities by region and outcome
        </CardTitle>
        <CardDescription>This quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <BarChart
            data={regions}
            stackOffset="expand"
            margin={{ top: 12, left: 8, right: 8 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="region"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              domain={[0, 1]}
              tickFormatter={(value: number) => percent.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                const total = totals.get(String(label)) ?? 0
                return (
                  <ChartTooltipContent
                    active={active}
                    label={label}
                    labelFormatter={(value) =>
                      `${value}: ${count.format(total)} opportunities`
                    }
                    payload={payload?.map((item) => ({
                      ...item,
                      value: `${count.format(Number(item.value))} (${percent.format(Number(item.value) / total)})`,
                    }))}
                  />
                )
              }}
            />
            <ChartLegend
              itemSorter={null}
              content={({ payload }) => (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
                  <span className="text-muted-foreground">Outcome</span>
                  <ChartLegendContent payload={payload} className="pt-0" />
                </div>
              )}
            />
            <Bar dataKey="won" stackId="outcome" fill="var(--color-won)" />
            <Bar dataKey="open" stackId="outcome" fill="var(--color-open)" />
            <Bar dataKey="lost" stackId="outcome" fill="var(--color-lost)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Dot plot

Comparison. Sales by account type as a dot per row, largest first, the value axis on top, with a period switch that moves dots to their new rank.

```tsx
"use client"

import { useId, useState } from "react"
import {
  CartesianGrid,
  getNiceTickValues,
  matchByDataKey,
  Scatter,
  ScatterChart,
  Text,
  useChartWidth,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
  type YAxisTickContentProps,
  ZAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisQuarter = [
  { type: "Customer", sales: 820000 },
  { type: "Partner", sales: 540000 },
  { type: "Reseller", sales: 410000 },
  { type: "Prospect", sales: 260000 },
  { type: "Other", sales: 90000 },
]

const lastQuarter = [
  { type: "Customer", sales: 710000 },
  { type: "Reseller", sales: 480000 },
  { type: "Partner", sales: 450000 },
  { type: "Prospect", sales: 190000 },
  { type: "Other", sales: 120000 },
]

const periods = { "This quarter": thisQuarter, "Last quarter": lastQuarter }
const highest = Math.max(
  ...[...thisQuarter, ...lastQuarter].map((row) => row.sales)
)
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Period = keyof typeof periods

function ValueTick({
  x,
  y,
  payload,
  index,
  width,
  visibleTicksCount,
}: XAxisTickContentProps) {
  if (index % 2 && Number(width) / (visibleTicksCount - 1) < 56) return null
  return (
    <Text
      x={x}
      y={y}
      textAnchor="middle"
      verticalAnchor="end"
      className="recharts-cartesian-axis-tick-value"
    >
      {compact.format(Number(payload.value))}
    </Text>
  )
}

function TypeName({ x, y, payload }: YAxisTickContentProps) {
  const chartWidth = useChartWidth() ?? 0
  return (
    <Text
      x={x}
      y={y}
      width={Math.min(Math.max(chartWidth / 3, 100), 144)}
      maxLines={2}
      textAnchor="end"
      verticalAnchor="middle"
      className="recharts-cartesian-axis-tick-value"
      style={{ fontSize: "var(--chart-text-size)" }}
    >
      {String(payload.value)}
    </Text>
  )
}

export default function ChartDotPlot() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This quarter")

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales by account type</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <ScatterChart
            margin={{ left: 8, right: 24 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              dataKey="sales"
              orientation="top"
              tickLine={false}
              axisLine={false}
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              interval={0}
              tick={ValueTick}
            />
            <YAxis
              type="category"
              dataKey="type"
              allowDuplicatedCategory={false}
              reversed
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width="auto"
              interval={0}
              tick={(props: YAxisTickContentProps) => <TypeName {...props} />}
            />
            <ZAxis dataKey={() => 1} range={[452, 452]} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  label={payload?.[0]?.payload?.type}
                  payload={payload
                    ?.filter((item) => item.dataKey === "sales")
                    .map((item) => ({
                      ...item,
                      value: full.format(Number(item.value)),
                    }))}
                />
              )}
            />
            <Scatter
              data={periods[period]}
              name="sales"
              fill="var(--color-sales)"
              animationMatchBy={matchByDataKey("type")}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Line chart

Trending. Sales and profit by month as two plain lines, the legend below, with a period switch that redraws them on the same scale.

```tsx
"use client"

import { useId, useState } from "react"
import {
  CartesianGrid,
  getNiceTickValues,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisYear = [
  { month: "Jan", sales: 120000, profit: 40000 },
  { month: "Feb", sales: 125000, profit: 55000 },
  { month: "Mar", sales: 190000, profit: 60000 },
  { month: "Apr", sales: 150000, profit: 70000 },
  { month: "May", sales: 260000, profit: 110000 },
  { month: "Jun", sales: 280000, profit: 90000 },
]

const lastYear = [
  { month: "Jan", sales: 95000, profit: 25000 },
  { month: "Feb", sales: 140000, profit: 45000 },
  { month: "Mar", sales: 130000, profit: 40000 },
  { month: "Apr", sales: 175000, profit: 65000 },
  { month: "May", sales: 165000, profit: 50000 },
  { month: "Jun", sales: 210000, profit: 75000 },
]

const periods = { "This year": thisYear, "Last year": lastYear }
const highest = Math.max(...[...thisYear, ...lastYear].map((row) => row.sales))
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
  profit: { label: "Profit", color: "var(--chart-3)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Period = keyof typeof periods

export default function ChartLine() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This year")

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales and profit by month</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <LineChart
            data={periods[period]}
            margin={{ top: 12, left: 8, right: 16 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  indicator="line"
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
            <Line
              dataKey="sales"
              type="linear"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
              animationEasing="cubic-bezier(0.42,0,0.58,1)"
            />
            <Line
              dataKey="profit"
              type="linear"
              stroke="var(--color-profit)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
              animationEasing="cubic-bezier(0.42,0,0.58,1)"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Area chart

Trending. Sales by month as one series, a line with a dot on each point over a flat 20% fill, and a period switch on the same scale.

```tsx
"use client"

import { useId, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  getNiceTickValues,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisYear = [
  { month: "Jan", sales: 120000 },
  { month: "Feb", sales: 125000 },
  { month: "Mar", sales: 190000 },
  { month: "Apr", sales: 150000 },
  { month: "May", sales: 260000 },
  { month: "Jun", sales: 280000 },
]

const lastYear = [
  { month: "Jan", sales: 95000 },
  { month: "Feb", sales: 140000 },
  { month: "Mar", sales: 130000 },
  { month: "Apr", sales: 175000 },
  { month: "May", sales: 165000 },
  { month: "Jun", sales: 210000 },
]

const periods = { "This year": thisYear, "Last year": lastYear }
const highest = Math.max(...[...thisYear, ...lastYear].map((row) => row.sales))
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Period = keyof typeof periods

export default function ChartArea() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This year")

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Sales by month</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <AreaChart
            data={periods[period]}
            margin={{ top: 12, left: 8, right: 16 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  indicator="line"
                  payload={payload?.map((item) => ({
                    ...item,
                    value: full.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <Area
              dataKey="sales"
              type="linear"
              stroke="var(--color-sales)"
              strokeWidth={2}
              fill="var(--color-sales)"
              fillOpacity={0.2}
              dot={{ r: 3, fillOpacity: 1, strokeWidth: 0 }}
              animationDuration={800}
              animationEasing="cubic-bezier(0.42,0,0.58,1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Area chart with a running total

Trending. Closed won by week added up into a running total, crossing a dashed quota line, with each week's amount and the total in the tooltip.

```tsx
"use client"

import { useId } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  getNiceTickValues,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const weeks = [
  { week: "Jul 6", won: 42000 },
  { week: "Jul 13", won: 68000 },
  { week: "Jul 20", won: 35000 },
  { week: "Jul 27", won: 91000 },
  { week: "Aug 3", won: 54000 },
  { week: "Aug 10", won: 76000 },
  { week: "Aug 17", won: 48000 },
  { week: "Aug 24", won: 112000 },
  { week: "Aug 31", won: 63000 },
  { week: "Sep 7", won: 87000 },
  { week: "Sep 14", won: 129000 },
  { week: "Sep 21", won: 198000 },
  { week: "Sep 28", won: 246000 },
]

const quota = 1200000
const rows = weeks.map((row, index) => ({
  ...row,
  total: weeks.slice(0, index + 1).reduce((sum, { won }) => sum + won, 0),
}))
const highest = Math.max(quota, rows.at(-1)!.total)
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)

const config = {
  total: { label: "Running total", color: "var(--chart-1)" },
  won: { label: "Closed won" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export default function ChartAreaRunningTotal() {
  const titleId = useId()

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Running total of closed won by week</CardTitle>
        <CardDescription>Last quarter, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <AreaChart
            data={rows}
            margin={{ top: 12, left: 8, right: 24 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={ticks}
              domain={[0, ticks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  labelFormatter={(value) => `Week of ${value}`}
                  hideIndicator
                  payload={payload?.flatMap((item) =>
                    (["won", "total"] as const).map((key) => ({
                      ...item,
                      name: key,
                      value: full.format(item.payload[key]),
                    }))
                  )}
                />
              )}
            />
            <ReferenceLine
              y={quota}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
              label={{
                value: `Quota ${compact.format(quota)}`,
                position: "insideBottomLeft",
              }}
            />
            <Area
              dataKey="total"
              type="linear"
              stroke="var(--color-total)"
              strokeWidth={2}
              fill="var(--color-total)"
              fillOpacity={0.2}
              dot={{ r: 3, fillOpacity: 1, strokeWidth: 0 }}
              animationDuration={800}
              animationEasing="cubic-bezier(0.42,0,0.58,1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Combination chart

Trending. Sales as columns on a left axis and open opportunities as a line on a right axis, both titled, with a period switch that keeps both scales.

```tsx
"use client"

import { useId, useState } from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  getNiceTickValues,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisYear = [
  { month: "Jan", sales: 120000, opportunities: 32 },
  { month: "Feb", sales: 125000, opportunities: 41 },
  { month: "Mar", sales: 190000, opportunities: 38 },
  { month: "Apr", sales: 150000, opportunities: 52 },
  { month: "May", sales: 260000, opportunities: 47 },
  { month: "Jun", sales: 280000, opportunities: 58 },
]

const lastYear = [
  { month: "Jan", sales: 95000, opportunities: 28 },
  { month: "Feb", sales: 140000, opportunities: 35 },
  { month: "Mar", sales: 130000, opportunities: 33 },
  { month: "Apr", sales: 175000, opportunities: 44 },
  { month: "May", sales: 165000, opportunities: 40 },
  { month: "Jun", sales: 210000, opportunities: 49 },
]

const periods = { "This year": thisYear, "Last year": lastYear }
const highestSales = Math.max(
  ...[...thisYear, ...lastYear].map((row) => row.sales)
)
const salesTicks = getNiceTickValues(
  [0, highestSales],
  6,
  true,
  "snap125"
).filter((tick, index, all) => index === 0 || all[index - 1]! < highestSales)
const highestOpportunities = Math.max(
  ...[...thisYear, ...lastYear].map((row) => row.opportunities)
)
const opportunityTicks = getNiceTickValues(
  [0, highestOpportunities],
  6,
  true,
  "snap125"
).filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highestOpportunities
)

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
  opportunities: { label: "Open opportunities", color: "var(--chart-3)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})
const count = new Intl.NumberFormat("en-US")

type Period = keyof typeof periods

export default function ChartCombo() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This year")

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>
          Sales and open opportunities by month
        </CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <ComposedChart
            data={periods[period]}
            margin={{ top: 12, left: 8, right: 8 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} yAxisId="sales" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="equidistantPreserveStart"
            />
            <YAxis
              yAxisId="sales"
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={salesTicks}
              domain={[0, salesTicks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
              label={{
                value: "Sales",
                angle: -90,
                position: "insideLeft",
                textAnchor: "middle",
              }}
            />
            <YAxis
              yAxisId="opportunities"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={opportunityTicks}
              domain={[0, opportunityTicks.at(-1)!]}
              tickFormatter={(value: number) => count.format(value)}
              label={{
                value: "Open opportunities",
                angle: 90,
                position: "insideRight",
                textAnchor: "middle",
              }}
            />
            <ChartTooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value:
                      item.dataKey === "sales"
                        ? full.format(Number(item.value))
                        : count.format(Number(item.value)),
                  }))}
                />
              )}
            />
            <ChartLegend itemSorter={null} content={<ChartLegendContent />} />
            <Bar yAxisId="sales" dataKey="sales" fill="var(--color-sales)" />
            <Line
              yAxisId="opportunities"
              dataKey="opportunities"
              type="linear"
              stroke="var(--color-opportunities)"
              strokeWidth={2}
              dot={false}
              animationDuration={800}
              animationEasing="cubic-bezier(0.42,0,0.58,1)"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Donut chart

Composition. Campaigns by source on a thin ring with the total in the middle, and a period switch where slices re-sort and a source leaves.

```tsx
"use client"

import { useId, useState } from "react"
import {
  type AnimationItem,
  Label,
  matchByDataKey,
  Pie,
  PieChart,
  type PieSectorDataItem,
  useChartWidth,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const thisYear = [
  { source: "email", campaigns: 35, fill: "var(--color-email)" },
  { source: "call", campaigns: 25, fill: "var(--color-call)" },
  { source: "text", campaigns: 20, fill: "var(--color-text)" },
  { source: "social", campaigns: 12, fill: "var(--color-social)" },
  { source: "phone", campaigns: 8, fill: "var(--color-phone)" },
]

const lastYear = [
  { source: "call", campaigns: 31, fill: "var(--color-call)" },
  { source: "email", campaigns: 27, fill: "var(--color-email)" },
  { source: "text", campaigns: 13, fill: "var(--color-text)" },
  { source: "phone", campaigns: 9, fill: "var(--color-phone)" },
]

const periods = { "This year": thisYear, "Last year": lastYear }

const config = {
  campaigns: { label: "Campaigns" },
  email: { label: "Email", color: "var(--chart-1)" },
  call: { label: "Call", color: "var(--chart-2)" },
  text: { label: "Text", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
  phone: { label: "Phone", color: "var(--chart-5)" },
} satisfies ChartConfig

const count = new Intl.NumberFormat("en-US")

type Period = keyof typeof periods

function slideInPlace(
  items: readonly AnimationItem<PieSectorDataItem>[] | null,
  t: number
) {
  const between = (from: number, to: number) => from + (to - from) * t
  return (items ?? []).flatMap((item) => {
    if (item.status === "matched") {
      return [
        {
          ...item.next,
          startAngle: between(item.prev.startAngle, item.next.startAngle),
          endAngle: between(item.prev.endAngle, item.next.endAngle),
        },
      ]
    }
    if (item.status === "added") {
      const { startAngle, endAngle } = item.next
      return [{ ...item.next, endAngle: between(startAngle, endAngle) }]
    }
    if (t === 1) return []
    const { startAngle, endAngle } = item.prev
    return [{ ...item.prev, endAngle: between(endAngle, startAngle) }]
  })
}

function SourceLegend() {
  const below = (useChartWidth() ?? 0) < 384
  return below ? (
    <ChartLegend
      itemSorter={null}
      content={({ payload }) => (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
          <span className="text-muted-foreground">Source</span>
          <ChartLegendContent
            payload={payload}
            nameKey="source"
            className="pt-0"
          />
        </div>
      )}
    />
  ) : (
    <ChartLegend
      layout="vertical"
      align="right"
      verticalAlign="top"
      itemSorter={null}
      content={({ payload }) => (
        <div className="flex flex-col items-start gap-2">
          <span className="text-muted-foreground">Source</span>
          <ChartLegendContent
            payload={payload}
            nameKey="source"
            className="flex-col items-start justify-start gap-2 pt-0"
          />
        </div>
      )}
    />
  )
}

export default function ChartDonut() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This year")
  const rows = periods[period]
  const total = rows.reduce((sum, row) => sum + row.campaigns, 0)

  return (
    <Card className="@container mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle id={titleId}>Campaigns by source</CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="mx-auto aspect-[3/2] w-full max-w-md @max-sm:aspect-square"
        >
          <PieChart aria-labelledby={titleId}>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  nameKey="source"
                  hideLabel
                  payload={payload?.map((item) => ({
                    ...item,
                    value: `${count.format(Number(item.value))} (${Math.round((Number(item.value) / total) * 100)}%)`,
                  }))}
                />
              )}
            />
            <Pie
              data={rows}
              dataKey="campaigns"
              nameKey="source"
              innerRadius="58%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              stroke="var(--background)"
              strokeWidth={1}
              rootTabIndex={-1}
              animationMatchBy={matchByDataKey("source")}
              animationInterpolateFn={slideInPlace}
              animationBegin={0}
              animationDuration={800}
              animationEasing="cubic-bezier(0.42,0,0.58,1)"
            >
              <Label
                position="center"
                content={({ viewBox }) => {
                  if (!viewBox || !("width" in viewBox)) return null
                  const x = (viewBox.x ?? 0) + (viewBox.width ?? 0) / 2
                  const y = (viewBox.y ?? 0) + (viewBox.height ?? 0) / 2
                  return (
                    <text x={x} y={y} textAnchor="middle">
                      <tspan
                        x={x}
                        y={y + 4}
                        className="fill-foreground text-(length:--chart-value-size) font-semibold"
                      >
                        {count.format(total)}
                      </tspan>
                      <tspan x={x} y={y + 24} className="fill-muted-foreground">
                        Campaigns
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
            <SourceLegend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Donut chart with Others

Composition. Leads by source, sources at 3% or less folded into a gray Others slice, with each slice's share in the legend.

```tsx
"use client"

import { useId } from "react"
import { Label, Pie, PieChart, useChartWidth } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  chartColor,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Row = { source: keyof typeof config; leads: number }

const leadsBySource: Row[] = [
  { source: "Web", leads: 486 },
  { source: "Partner Referral", leads: 274 },
  { source: "Trade Show", leads: 168 },
  { source: "Phone Inquiry", leads: 117 },
  { source: "Purchased List", leads: 34 },
  { source: "Employee Referral", leads: 29 },
  { source: "Advertisement", leads: 21 },
  { source: "Word of mouth", leads: 14 },
  { source: "Webinar", leads: 6 },
]

const total = leadsBySource.reduce((sum, row) => sum + row.leads, 0)
const small = leadsBySource.filter((row) => row.leads / total <= 0.03)
const others: Row = {
  source: "others",
  leads: small.reduce((sum, row) => sum + row.leads, 0),
}
const slices = [
  ...leadsBySource.filter((row) => row.leads / total > 0.03),
  ...(small.length ? [others] : []),
].map((row) => ({ ...row, fill: chartColor(row.source) }))

const config = {
  leads: { label: "Leads" },
  Web: { label: "Web", color: "var(--chart-1)" },
  "Partner Referral": { label: "Partner Referral", color: "var(--chart-2)" },
  "Trade Show": { label: "Trade Show", color: "var(--chart-3)" },
  "Phone Inquiry": { label: "Phone Inquiry", color: "var(--chart-4)" },
  others: { label: "Others", color: "var(--chart-other)" },
  "Purchased List": { label: "Purchased List" },
  "Employee Referral": { label: "Employee Referral" },
  Advertisement: { label: "Advertisement" },
  "Word of mouth": { label: "Word of mouth" },
  Webinar: { label: "Webinar" },
} satisfies ChartConfig

const count = new Intl.NumberFormat("en-US")
const percent = new Intl.NumberFormat("en-US", { style: "percent" })

function SourceLegend() {
  const below = (useChartWidth() ?? 0) < 384
  const content = () => (
    <div
      className={
        below
          ? "flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3"
          : "flex flex-col items-start gap-2"
      }
    >
      <span className="text-muted-foreground">Lead Source</span>
      {slices.map((slice) => (
        <div key={slice.source} className="flex items-center gap-1.5">
          <div
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: slice.fill }}
          />
          {config[slice.source].label}{" "}
          <span className="text-muted-foreground tabular-nums">
            {percent.format(slice.leads / total)}
          </span>
        </div>
      ))}
    </div>
  )
  return below ? (
    <ChartLegend itemSorter={null} content={content} />
  ) : (
    <ChartLegend
      layout="vertical"
      align="right"
      verticalAlign="top"
      itemSorter={null}
      content={content}
    />
  )
}

export default function ChartDonutOthers() {
  const titleId = useId()

  return (
    <Card className="@container mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle id={titleId}>Leads by source</CardTitle>
        <CardDescription>This quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="mx-auto aspect-[3/2] w-full max-w-md @max-sm:aspect-square"
        >
          <PieChart aria-labelledby={titleId}>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => (
                <ChartTooltipContent
                  active={active}
                  nameKey="source"
                  hideLabel={payload?.[0]?.payload.source !== "others"}
                  labelFormatter={() =>
                    `${small.length} sources, each 3% or less`
                  }
                  payload={payload?.map((item) => ({
                    ...item,
                    value: `${count.format(Number(item.value))} (${percent.format(Number(item.value) / total)})`,
                  }))}
                />
              )}
            />
            <Pie
              data={slices}
              dataKey="leads"
              nameKey="source"
              innerRadius="58%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              stroke="var(--background)"
              strokeWidth={1}
              rootTabIndex={-1}
              animationBegin={0}
              animationDuration={800}
              animationEasing="cubic-bezier(0.42,0,0.58,1)"
            >
              <Label
                position="center"
                content={({ viewBox }) => {
                  if (!viewBox || !("width" in viewBox)) return null
                  const x = (viewBox.x ?? 0) + (viewBox.width ?? 0) / 2
                  const y = (viewBox.y ?? 0) + (viewBox.height ?? 0) / 2
                  return (
                    <text x={x} y={y} textAnchor="middle">
                      <tspan
                        x={x}
                        y={y + 4}
                        className="fill-foreground text-(length:--chart-value-size) font-semibold"
                      >
                        {count.format(total)}
                      </tspan>
                      <tspan x={x} y={y + 24} className="fill-muted-foreground">
                        Leads
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
            <SourceLegend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Scatter plot

Relationship. Accounts by employees and sales in one series, a color per segment, with a period switch that moves each account on fixed axes.

```tsx
"use client"

import { useId, useState } from "react"
import {
  CartesianGrid,
  getNiceTickValues,
  matchByDataKey,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Row = {
  account: string
  segment: "small" | "midMarket" | "enterprise"
  employees: number
  sales: number
}

const thisYear: Row[] = [
  { account: "Account A", segment: "small", employees: 40, sales: 120000 },
  { account: "Account B", segment: "small", employees: 85, sales: 180000 },
  { account: "Account C", segment: "small", employees: 120, sales: 160000 },
  { account: "Account D", segment: "small", employees: 150, sales: 300000 },
  { account: "Account E", segment: "midMarket", employees: 210, sales: 260000 },
  { account: "Account F", segment: "midMarket", employees: 260, sales: 420000 },
  { account: "Account G", segment: "midMarket", employees: 320, sales: 380000 },
  { account: "Account H", segment: "midMarket", employees: 380, sales: 520000 },
  {
    account: "Account I",
    segment: "enterprise",
    employees: 450,
    sales: 470000,
  },
  {
    account: "Account J",
    segment: "enterprise",
    employees: 520,
    sales: 640000,
  },
  {
    account: "Account K",
    segment: "enterprise",
    employees: 600,
    sales: 580000,
  },
  {
    account: "Account L",
    segment: "enterprise",
    employees: 700,
    sales: 760000,
  },
]

const lastYear: Row[] = [
  { account: "Account A", segment: "small", employees: 35, sales: 90000 },
  { account: "Account B", segment: "small", employees: 70, sales: 210000 },
  { account: "Account C", segment: "small", employees: 110, sales: 140000 },
  { account: "Account D", segment: "small", employees: 130, sales: 230000 },
  { account: "Account E", segment: "midMarket", employees: 190, sales: 300000 },
  { account: "Account F", segment: "midMarket", employees: 240, sales: 330000 },
  { account: "Account G", segment: "midMarket", employees: 300, sales: 410000 },
  { account: "Account H", segment: "midMarket", employees: 340, sales: 440000 },
  {
    account: "Account I",
    segment: "enterprise",
    employees: 430,
    sales: 520000,
  },
  {
    account: "Account J",
    segment: "enterprise",
    employees: 490,
    sales: 560000,
  },
  {
    account: "Account K",
    segment: "enterprise",
    employees: 560,
    sales: 650000,
  },
]

const periods = { "This year": thisYear, "Last year": lastYear }
const rows = [...thisYear, ...lastYear]
const highestEmployees = Math.max(...rows.map((row) => row.employees))
const employeeTicks = getNiceTickValues(
  [0, highestEmployees],
  6,
  true,
  "snap125"
).filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highestEmployees
)
const highestSales = Math.max(...rows.map((row) => row.sales))
const salesTicks = getNiceTickValues(
  [0, highestSales],
  6,
  true,
  "snap125"
).filter((tick, index, all) => index === 0 || all[index - 1]! < highestSales)

const config = {
  small: { label: "Small business", color: "var(--chart-1)" },
  midMarket: { label: "Mid-market", color: "var(--chart-2)" },
  enterprise: { label: "Enterprise", color: "var(--chart-3)" },
  employees: { label: "Employees" },
  sales: { label: "Sales" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})
const count = new Intl.NumberFormat("en-US")

const segments = ["small", "midMarket", "enterprise"] as const
const legend = segments.map((segment) => ({
  value: segment,
  color: `var(--color-${segment})`,
}))

type Period = keyof typeof periods
type Point = Row & { fill: string }

export default function ChartScatter() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This year")
  const points: Point[] = periods[period].map((row) => ({
    ...row,
    fill: `var(--color-${row.segment})`,
  }))

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Accounts by employees and sales</CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <ChartContainer
          config={config}
          className="w-full @max-sm:aspect-square"
        >
          <ScatterChart
            margin={{ top: 12, left: 8, right: 16 }}
            aria-labelledby={titleId}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              type="number"
              dataKey="employees"
              name="employees"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={44}
              ticks={employeeTicks}
              domain={[0, employeeTicks.at(-1)!]}
              tickFormatter={(value: number) => count.format(value)}
              label={{ value: "Employees", position: "insideBottom" }}
            />
            <YAxis
              type="number"
              dataKey="sales"
              name="sales"
              tickLine={false}
              axisLine={false}
              width="auto"
              ticks={salesTicks}
              domain={[0, salesTicks.at(-1)!]}
              tickFormatter={(value: number) => compact.format(value)}
              label={{
                value: "Sales",
                angle: -90,
                position: "insideLeft",
                textAnchor: "middle",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as Point | undefined
                return (
                  <ChartTooltipContent
                    active={active}
                    label={row?.account}
                    payload={
                      row && payload
                        ? [
                            {
                              ...payload[0]!,
                              dataKey: "segment",
                              name: "Segment",
                              value: config[row.segment].label,
                            },
                            ...payload.map((item) => ({
                              ...item,
                              value:
                                item.dataKey === "sales"
                                  ? full.format(Number(item.value))
                                  : count.format(Number(item.value)),
                            })),
                          ]
                        : payload
                    }
                  />
                )
              }}
            />
            <ChartLegend
              itemSorter={null}
              content={() => (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
                  <span className="text-muted-foreground">Segment</span>
                  <ChartLegendContent payload={legend} className="pt-0" />
                </div>
              )}
            />
            <Scatter
              data={points}
              animationMatchBy={matchByDataKey("account")}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

### Funnel chart

Pipeline. Opportunities by stage as a tapered column with each count on its band, the total above and a legend titled Stage, with a period switch.

```tsx
"use client"

import { useId, useState } from "react"
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Row = {
  stage:
    | "prospecting"
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closedWon"
  opportunities: number
}

const thisQuarter: Row[] = [
  { stage: "prospecting", opportunities: 120 },
  { stage: "qualification", opportunities: 90 },
  { stage: "proposal", opportunities: 60 },
  { stage: "negotiation", opportunities: 35 },
  { stage: "closedWon", opportunities: 20 },
]

const lastQuarter: Row[] = [
  { stage: "prospecting", opportunities: 150 },
  { stage: "qualification", opportunities: 80 },
  { stage: "proposal", opportunities: 45 },
  { stage: "negotiation", opportunities: 30 },
  { stage: "closedWon", opportunities: 25 },
]

const periods = {
  "This quarter": thisQuarter,
  "Last quarter": lastQuarter,
}

const config = {
  opportunities: { label: "Opportunities" },
  prospecting: { label: "Prospecting", color: "var(--chart-1)" },
  qualification: { label: "Qualification", color: "var(--chart-2)" },
  proposal: { label: "Proposal/Price Quote", color: "var(--chart-3)" },
  negotiation: { label: "Negotiation/Review", color: "var(--chart-4)" },
  closedWon: { label: "Closed Won", color: "var(--chart-5)" },
} satisfies ChartConfig

const count = new Intl.NumberFormat("en-US")

type Period = keyof typeof periods

const taper = 0.3

function slicesOf(rows: Row[], total: number) {
  return rows.map((row, index) => {
    const above = rows
      .slice(0, index)
      .reduce((sum, stage) => sum + stage.opportunities, 0)
    const top = (taper * above) / total
    const bottom = (taper * (above + row.opportunities)) / total
    return {
      stage: row.stage,
      points: `${top},0 ${1 - top},0 ${1 - bottom},1 ${bottom},1`,
    }
  })
}

export default function ChartFunnel() {
  const titleId = useId()
  const clipId = useId()
  const [period, setPeriod] = useState<Period>("This quarter")
  const rows = periods[period]
  const total = rows.reduce((sum, row) => sum + row.opportunities, 0)
  const share = (value: number) => Math.round((value / total) * 100)
  const column = [
    Object.fromEntries(rows.map((row) => [row.stage, row.opportunities])),
  ]

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Opportunities by stage</CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <div className="flex flex-col gap-4 @md:flex-row @md:items-start">
          <div className="min-w-0 flex-1">
            <p className="text-center text-(length:--chart-text-size) text-foreground tabular-nums">
              {config.opportunities.label}: {count.format(total)}
            </p>
            <ChartContainer
              config={config}
              data-chart-swatch="square"
              className="aspect-[4/3] w-full"
            >
              <BarChart
                data={column}
                barCategoryGap={0}
                reverseStackOrder
                aria-labelledby={titleId}
              >
                <defs>
                  {slicesOf(rows, total).map((slice) => (
                    <clipPath
                      key={slice.stage}
                      id={`${clipId}-${slice.stage}`}
                      clipPathUnits="objectBoundingBox"
                    >
                      <polygon points={slice.points} />
                    </clipPath>
                  ))}
                </defs>
                <XAxis hide />
                <YAxis hide domain={[0, "dataMax"]} />
                <ChartTooltip
                  cursor={false}
                  shared={false}
                  content={({ active, payload }) => (
                    <ChartTooltipContent
                      active={active}
                      hideLabel
                      payload={payload?.map((item) => ({
                        ...item,
                        value: `${count.format(Number(item.value))} (${share(Number(item.value))}%)`,
                      }))}
                    />
                  )}
                />
                {rows.map((row) => (
                  <Bar
                    key={row.stage}
                    dataKey={row.stage}
                    stackId="funnel"
                    fill={`var(--color-${row.stage})`}
                    stroke="var(--background)"
                    clipPath={`url(#${clipId}-${row.stage})`}
                  >
                    <LabelList
                      dataKey={row.stage}
                      position="center"
                      formatter={(value) => count.format(Number(value))}
                      className="fill-foreground stroke-background tabular-nums"
                      strokeWidth={3}
                      paintOrder="stroke"
                      strokeLinejoin="round"
                    />
                  </Bar>
                ))}
              </BarChart>
            </ChartContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-(length:--chart-text-size) @md:flex-col @md:items-start @md:gap-2 @md:pt-1">
            <span className="text-muted-foreground">Stage</span>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-foreground @md:flex-col @md:items-start @md:gap-2">
              {rows.map((row) => (
                <li key={row.stage} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: config[row.stage].color }}
                  />
                  <span>
                    {config[row.stage].label}
                    <span className="sr-only">
                      {`: ${count.format(row.opportunities)} (${share(row.opportunities)}%)`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Waterfall chart

Pipeline. Cash flow from the opening to the closing balance, rises and falls colored by meaning, with a period switch whose steps move when it changes.

```tsx
"use client"

import { useId, useState } from "react"
import {
  type AnimationItem,
  Bar,
  BarChart,
  type BarRectangleItem,
  type BarShapeProps,
  CartesianGrid,
  getNiceTickValues,
  matchByDataKey,
  Rectangle,
  ReferenceLine,
  Text,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

type Row =
  | { label: string; value: number; kind?: never }
  | { label: string; value?: number; kind: "total" }

const thisQuarter: Row[] = [
  { label: "Opening balance", value: 120000, kind: "total" },
  { label: "Income", value: 84000 },
  { label: "Consulting", value: 12000 },
  { label: "Payroll", value: -61000 },
  { label: "Software", value: -9000 },
  { label: "Closing balance", kind: "total" },
]

const lastQuarter: Row[] = [
  { label: "Opening balance", value: 96000, kind: "total" },
  { label: "Income", value: 91000 },
  { label: "Payroll", value: -58000 },
  { label: "Travel", value: -7000 },
  { label: "Closing balance", value: 120000, kind: "total" },
]

const periods = {
  "This quarter": thisQuarter,
  "Last quarter": lastQuarter,
}
const levels = Object.values(periods).flatMap((rows) =>
  walk(rows).flatMap((step) => [step.start, step.end])
)
const highest = Math.max(...levels)
const ticks = getNiceTickValues(
  [Math.min(0, ...levels), highest],
  6,
  true,
  "snap125"
).filter((tick, index, all) => index === 0 || all[index - 1]! < highest)

const config = {
  total: { label: "Total", color: "var(--chart-1)" },
  rise: { label: "Increase", color: "var(--chart-positive)" },
  fall: { label: "Decrease", color: "var(--chart-negative)" },
  gap: { label: "Not accounted for", color: "var(--chart-warning)" },
  change: { label: "Change" },
  start: { label: "Before" },
  end: { label: "After" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})
const signed = (format: Intl.NumberFormat, value: number) =>
  (value > 0 ? "+" : "") + format.format(value)

type Period = keyof typeof periods
type Kind = "total" | "rise" | "fall" | "gap"
type Step = {
  label: string
  kind: Kind
  start: number
  end: number
  change: number
  fill: string
  last: boolean
}

const barGap = 0.2

function walk(rows: Row[]): Step[] {
  const steps: Step[] = []
  let level = 0
  const add = (label: string, kind: Kind, start: number, end: number) =>
    steps.push({
      label,
      kind,
      start,
      end,
      change: end - start,
      fill: `var(--color-${kind})`,
      last: false,
    })
  for (const row of rows) {
    if (row.kind !== "total") {
      add(row.label, row.value < 0 ? "fall" : "rise", level, level + row.value)
      level += row.value
      continue
    }
    if (steps.length && row.value !== undefined && row.value !== level) {
      add("Not accounted for", "gap", level, row.value)
    }
    level = row.value ?? level
    add(row.label, "total", 0, level)
  }
  if (steps.length) steps[steps.length - 1]!.last = true
  return steps
}

function growFromStart(
  items: readonly AnimationItem<BarRectangleItem>[] | null,
  t: number
) {
  const flat = (bar: BarRectangleItem) => ({
    ...bar,
    y: bar.y + bar.height,
    height: 0,
  })
  const tween = (from: number, to: number) => from + (to - from) * t
  return (items ?? []).flatMap((item) => {
    if (item.status === "removed" && t === 1) return []
    const from = item.status === "added" ? flat(item.next) : item.prev
    const to =
      item.status === "removed"
        ? {
            ...flat(item.prev),
            payload: { ...item.prev.payload, leaving: true },
          }
        : item.next
    return [
      {
        ...to,
        x: tween(from.x, to.x),
        y: tween(from.y, to.y),
        width: tween(from.width, to.width),
        height: tween(from.height, to.height),
      },
    ]
  })
}

function WaterfallBar(props: BarShapeProps) {
  const { x, y, width } = props
  const step = props.payload as Step & { leaving?: true }
  const up = step.end >= step.start
  return (
    <g>
      <Rectangle {...props} />
      {!step.leaving && width / (1 - 2 * barGap) >= 44 && (
        <text
          x={x + width / 2}
          y={up ? y - 6 : y + 6}
          textAnchor="middle"
          dominantBaseline={up ? "auto" : "hanging"}
          className="fill-foreground tabular-nums"
        >
          {step.kind === "total"
            ? compact.format(step.end)
            : signed(compact, step.change)}
        </text>
      )}
      {!step.leaving && !step.last && (
        <line
          x1={x + width}
          x2={x + width + (width * 2 * barGap) / (1 - 2 * barGap)}
          y1={y}
          y2={y}
          stroke="var(--border-strong)"
          shapeRendering="crispEdges"
        />
      )}
    </g>
  )
}

function StepName({
  x,
  y,
  width,
  payload,
  visibleTicksCount,
}: XAxisTickContentProps) {
  const name = String(payload.value)
  if (Number(width) / visibleTicksCount < 56) {
    return (
      <Text
        x={x}
        y={y}
        angle={-45}
        textAnchor="end"
        verticalAnchor="middle"
        className="recharts-cartesian-axis-tick-value"
      >
        {name.length > 18 ? `${name.slice(0, 17)}…` : name}
      </Text>
    )
  }
  return (
    <Text
      x={x}
      y={y}
      width={Number(width) / visibleTicksCount}
      maxLines={3}
      textAnchor="middle"
      verticalAnchor="start"
      className="recharts-cartesian-axis-tick-value"
    >
      {name}
    </Text>
  )
}

export default function ChartWaterfall() {
  const titleId = useId()
  const [period, setPeriod] = useState<Period>("This quarter")
  const steps = walk(periods[period])

  return (
    <Card className="@container w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>Cash flow</CardTitle>
        <CardDescription>{period}, USD</CardDescription>
      </CardHeader>
      <CardContent>
        <ButtonGroup aria-label="Period" className="mb-2">
          {(Object.keys(periods) as Period[]).map((name) => (
            <Button
              key={name}
              size="sm"
              variant={name === period ? "default" : "outline"}
              aria-pressed={name === period}
              onClick={() => setPeriod(name)}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        {steps.length === 0 ? (
          <Empty className="aspect-video @max-sm:aspect-square">
            <EmptyHeader>
              <EmptyTitle>No cash flow in this period</EmptyTitle>
              <EmptyDescription>Choose another quarter.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer
            config={config}
            className="w-full @max-sm:aspect-square"
          >
            <BarChart
              data={steps}
              margin={{ top: 20, left: 8, right: 8, bottom: 4 }}
              barCategoryGap={`${barGap * 100}%`}
              aria-labelledby={titleId}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                height="auto"
                tick={StepName}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width="auto"
                ticks={ticks}
                domain={[ticks[0]!, ticks.at(-1)!]}
                tickFormatter={(value: number) => compact.format(value)}
              />
              <ReferenceLine y={0} />
              <ChartTooltip
                content={({ active, payload, label }) => (
                  <ChartTooltipContent
                    active={active}
                    label={label}
                    hideIndicator
                    payload={payload?.flatMap((item) => {
                      const step = item.payload as Step
                      const keys =
                        step.kind === "total"
                          ? (["end"] as const)
                          : (["change", "start", "end"] as const)
                      return keys.map((key) => ({
                        ...item,
                        name: step.kind === "total" ? "total" : key,
                        value:
                          key === "change"
                            ? signed(full, step.change)
                            : full.format(step[key]),
                      }))
                    })}
                  />
                )}
              />
              <Bar
                dataKey={(step: Step) => [step.start, step.end]}
                shape={WaterfallBar}
                animationMatchBy={matchByDataKey("label")}
                animationInterpolateFn={growFromStart}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
```

### Dashboard

Three charts on cards sharing one config and one period filter: columns with an average line, every region by name, and sales against a dashed target.

```tsx
"use client"

import { useId, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  getNiceTickValues,
  LabelList,
  Line,
  LineChart,
  matchByDataKey,
  ReferenceLine,
  Text,
  useChartWidth,
  XAxis,
  YAxis,
  type YAxisTickContentProps,
} from "recharts"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const firstHalf = [
  { month: "Jan", sales: 120000, lastYear: 95000, target: 140000 },
  { month: "Feb", sales: 150000, lastYear: 110000, target: 140000 },
  { month: "Mar", sales: 190000, lastYear: 150000, target: 160000 },
  { month: "Apr", sales: 150000, lastYear: 160000, target: 160000 },
  { month: "May", sales: 260000, lastYear: 180000, target: 200000 },
  { month: "Jun", sales: 280000, lastYear: 210000, target: 220000 },
]

const secondHalf = [
  { month: "Jul", sales: 200000, lastYear: 180000, target: 210000 },
  { month: "Aug", sales: 230000, lastYear: 190000, target: 210000 },
  { month: "Sep", sales: 190000, lastYear: 200000, target: 230000 },
  { month: "Oct", sales: 240000, lastYear: 205000, target: 230000 },
  { month: "Nov", sales: 250000, lastYear: 220000, target: 250000 },
  { month: "Dec", sales: 270000, lastYear: 240000, target: 260000 },
]

const firstHalfByRegion = [
  { region: "West", sales: 420000 },
  { region: "East", sales: 380000 },
  { region: "North", sales: 230000 },
  { region: "South", sales: 120000 },
]

const secondHalfByRegion = [
  { region: "East", sales: 470000 },
  { region: "West", sales: 440000 },
  { region: "North", sales: 260000 },
  { region: "Central", sales: 170000 },
  { region: "South", sales: 120000 },
]

const periods = {
  "Jan to Jun": { byMonth: firstHalf, byRegion: firstHalfByRegion },
  "Jul to Dec": { byMonth: secondHalf, byRegion: secondHalfByRegion },
}
const highest = Math.max(
  ...[...firstHalf, ...secondHalf].flatMap((row) => [
    row.sales,
    row.lastYear,
    row.target,
  ])
)
const ticks = getNiceTickValues([0, highest], 6, true, "snap125").filter(
  (tick, index, all) => index === 0 || all[index - 1]! < highest
)
const regionMax = Math.max(
  ...[...firstHalfByRegion, ...secondHalfByRegion].map((row) => row.sales)
)

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
  lastYear: { label: "Last year", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--chart-3)" },
} satisfies ChartConfig

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Period = keyof typeof periods

function RegionName({ x, y, payload }: YAxisTickContentProps) {
  const chartWidth = useChartWidth() ?? 0
  return (
    <Text
      x={x}
      y={y}
      width={Math.min(Math.max(chartWidth / 3, 100), 144)}
      maxLines={2}
      textAnchor="end"
      verticalAnchor="middle"
      className="recharts-cartesian-axis-tick-value"
      style={{ fontSize: "var(--chart-text-size)" }}
    >
      {String(payload.value)}
    </Text>
  )
}

export default function ChartDashboard() {
  const monthTitleId = useId()
  const regionTitleId = useId()
  const targetTitleId = useId()
  const [period, setPeriod] = useState<Period>("Jan to Jun")
  const { byMonth, byRegion } = periods[period]
  const average =
    byMonth.reduce((sum, row) => sum + row.sales, 0) / byMonth.length

  return (
    <div className="@container w-full">
      <ButtonGroup aria-label="Period" className="mb-4">
        {(Object.keys(periods) as Period[]).map((name) => (
          <Button
            key={name}
            size="sm"
            variant={name === period ? "default" : "outline"}
            aria-pressed={name === period}
            onClick={() => setPeriod(name)}
          >
            {name}
          </Button>
        ))}
      </ButtonGroup>
      <div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
        <Card className="@container">
          <CardHeader>
            <CardTitle id={monthTitleId}>Sales this year and last</CardTitle>
            <CardDescription>{period}, USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={config}
              className="w-full @max-sm:aspect-square"
            >
              <BarChart
                data={byMonth}
                margin={{ top: 12, left: 8, right: 8 }}
                aria-labelledby={monthTitleId}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval="equidistantPreserveStart"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width="auto"
                  ticks={ticks}
                  domain={[0, ticks.at(-1)!]}
                  tickFormatter={(value: number) => compact.format(value)}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => (
                    <ChartTooltipContent
                      active={active}
                      label={label}
                      payload={payload?.map((item) => ({
                        ...item,
                        value: full.format(Number(item.value)),
                      }))}
                    />
                  )}
                />
                <ChartLegend
                  itemSorter={null}
                  content={<ChartLegendContent />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" />
                <Bar dataKey="lastYear" fill="var(--color-lastYear)" />
                <ReferenceLine
                  y={average}
                  label={{
                    value: `Average ${compact.format(average)}`,
                    position: "insideBottomLeft",
                  }}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="@container">
          <CardHeader>
            <CardTitle id={regionTitleId}>Sales by region</CardTitle>
            <CardDescription>{period}, USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={config}
              className="w-full @max-sm:aspect-square"
            >
              <BarChart
                data={byRegion}
                layout="vertical"
                margin={{ right: 48 }}
                aria-labelledby={regionTitleId}
              >
                <XAxis type="number" hide domain={[0, regionMax]} />
                <YAxis
                  dataKey="region"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width="auto"
                  interval={0}
                  tick={(props: YAxisTickContentProps) => (
                    <RegionName {...props} />
                  )}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => (
                    <ChartTooltipContent
                      active={active}
                      label={label}
                      payload={payload?.map((item) => ({
                        ...item,
                        value: full.format(Number(item.value)),
                      }))}
                    />
                  )}
                />
                <Bar
                  dataKey="sales"
                  fill="var(--color-sales)"
                  animationMatchBy={matchByDataKey("region")}
                >
                  <LabelList
                    dataKey="sales"
                    position="right"
                    className="fill-foreground"
                    formatter={(value) => compact.format(Number(value))}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="@container @xl:col-span-2 @4xl:col-span-1">
          <CardHeader>
            <CardTitle id={targetTitleId}>Sales against target</CardTitle>
            <CardDescription>{period}, USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={config}
              className="max-h-72 w-full @max-sm:aspect-square"
            >
              <LineChart
                data={byMonth}
                margin={{ top: 12, left: 8, right: 16 }}
                aria-labelledby={targetTitleId}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval="equidistantPreserveStart"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width="auto"
                  ticks={ticks}
                  domain={[0, ticks.at(-1)!]}
                  tickFormatter={(value: number) => compact.format(value)}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => (
                    <ChartTooltipContent
                      active={active}
                      label={label}
                      indicator="line"
                      payload={payload?.map((item) => ({
                        ...item,
                        value: full.format(Number(item.value)),
                      }))}
                    />
                  )}
                />
                <ChartLegend
                  itemSorter={null}
                  content={<ChartLegendContent />}
                />
                <Line
                  dataKey="sales"
                  type="linear"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={800}
                  animationEasing="cubic-bezier(0.42,0,0.58,1)"
                />
                <Line
                  dataKey="target"
                  type="linear"
                  stroke="var(--color-target)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  animationDuration={800}
                  animationEasing="cubic-bezier(0.42,0,0.58,1)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Loading and empty states

Any intent. A chart card while its rows load, as a skeleton at the chart's size, with no rows, as an empty state, and when they couldn't load, with Retry.

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChartStates() {
  return (
    <div className="@container w-full">
      <div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
        <Card aria-busy="true" className="@container">
          <CardHeader>
            <CardTitle>Sales by month</CardTitle>
            <CardDescription>Jan to Jun, USD</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full @max-sm:aspect-square" />
            <span className="sr-only">Loading chart</span>
          </CardContent>
        </Card>
        <Card className="@container">
          <CardHeader>
            <CardTitle>Sales by region</CardTitle>
            <CardDescription>Jan to Jun, USD</CardDescription>
          </CardHeader>
          <CardContent>
            <Empty className="aspect-video @max-sm:aspect-square">
              <EmptyHeader>
                <EmptyTitle>No sales in this period</EmptyTitle>
                <EmptyDescription>Choose a longer date range.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
        <Card className="@container">
          <CardHeader>
            <CardTitle>Sales by product</CardTitle>
            <CardDescription>Jan to Jun, USD</CardDescription>
          </CardHeader>
          <CardContent>
            <Empty className="aspect-video @max-sm:aspect-square">
              <EmptyHeader>
                <EmptyTitle>Sales couldn't load</EmptyTitle>
                <EmptyDescription>
                  The report took too long to run.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="sm">
                  Retry
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```
