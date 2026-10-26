# Chart legend

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/chart-legend](https://ui.wisty.ai/chart-legend) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Lists a chart's series with their values beside it, or the sizes of its bubbles.

```bash
npx shadcn@latest add @wisty/chart-legend
```

## Examples

- `default` (Campaigns by source): Composition. A donut with the total in the middle and a list beside it giving each source's count and share, set with `values` and `orientation`.
- `bubble` (Bubble chart): Relationship. Dot size is open deals, explained by `ChartSizeLegend` from the `ZAxis` `domain` and `range`, and color is industry in `ChartLegendList`.
- `funnel` (Funnel with values): Pipeline. A funnel with square swatches from `shape`, each with its stage's count and share, since the arrow keys can't walk stages.

## When to use

- A donut or a bar chart's legend should show each entry's value, like "Email 35 (35%)".
- A bubble chart uses dot size for a measure, and readers need to know what the sizes mean.
- A chart needs its legend outside the chart's box, like a list beside a donut in a wide card.

## When not to use

- For a plain legend under a chart. Use `ChartLegend` with `ChartLegendContent` from Chart, inside the chart.
- For a chart with one series. Name the measure in the card title instead.
- For exact values readers need to compare. Add a table beside the chart.

## Usage

Both parts sit beside a `ChartContainer`, not inside it, and read the same config.

```tsx
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartLegendList } from "@/components/wisty/chart-legend"

const config = {
  won: { label: "Closed Won", color: "var(--chart-1)" },
  open: { label: "Open", color: "var(--chart-2)" },
  lost: { label: "Closed Lost", color: "var(--chart-3)" },
} satisfies ChartConfig
```

```tsx
<figure>
  <ChartContainer config={config}>{/* the chart */}</ChartContainer>
  <ChartLegendList
    config={config}
    keys={["won", "lost"]}
    aria-label="Outcome"
  />
</figure>
```

A list with values, standing beside a donut or a funnel, is in the Campaigns by source and Funnel with values examples. Format the values for the org's locale and currency; the examples use en-US and USD.

`ChartSizeLegend` must agree with the chart's `ZAxis`, so work out one `domain` and one `range` and pass both to each:

```tsx
import { ZAxis } from "recharts"

import { ChartSizeLegend } from "@/components/wisty/chart-legend"

const rows = [{ deals: 56 }, { deals: 12 }, { deals: 3 }]
// From 0 to the largest row, so the domain covers every row.
const sizeDomain: [number, number] = [
  0,
  Math.max(0, ...rows.map((row) => row.deals)),
]
const sizeRange: [number, number] = [0, 900]
```

```tsx
<ZAxis type="number" dataKey="deals" domain={sizeDomain} range={sizeRange} />
<ChartSizeLegend title="Open deals" domain={sizeDomain} range={sizeRange} />
```

## Rules

- Put `ChartLegendList` and `ChartSizeLegend` beside `ChartContainer`, never inside `ChartLegend`'s `content`.
- Write config colors as `var(--chart-n)`, a literal or `theme`, in order from `--chart-1`. Never `var(--color-<key>)`: that variable exists only inside the chart's container, so the legend's swatch would be empty. Rows and series inside the chart may still use it.
- Always set the `ZAxis` `domain` yourself, covering every row. A domain the data outgrows is widened by the chart, and the legend's circles no longer match the dots.
- Pass `values` to `ChartSizeLegend` only with clearly different sizes. It draws the three largest, and two close values put one label on the other.
- Draw a bubble chart's points in one `Scatter`, with `fill: "var(--color-<key>)"` on each row. The arrow keys only walk a chart's first `Scatter`, so one per color leaves points out of reach. Name the color's category in the tooltip too.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `ChartLegendList` | [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul) |
| `ChartSizeLegend` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### ChartLegendList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `ChartConfig` |  | The chart's config. Its labels and colors make the list. |
| `keys`? | `string[]` |  | Which entries to show, in this order. Default every entry with a color, in config order. |
| `values`? | `Record<string, React.ReactNode>` |  | A formatted value per key, shown after its label, like "35 (35%)". |
| `shape`? | `"dot" \| "square"` | `"dot"` | Dots for lines, bars and slices; squares for square marks. |
| `orientation`? | `"horizontal" \| "vertical"` | `"horizontal"` | A wrapping row, or a column with values at the end. |

### ChartSizeLegend

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` |  | What dot size measures, like "Deals". |
| `domain` | `[number, number]` |  | The ZAxis domain, covering every row: Recharts widens one that doesn't, unseen here. |
| `range` | `[number, number]` |  | The ZAxis range: the smallest and largest dot area, in square pixels. |
| `values`? | `number[]` |  | The values to draw, largest three. Default the domain's end and round values below it. |
| `valueFormatter`? | `(value: number) => string` | `String` | Formats each value, like (v) => count.format(v). |

## SLDS mapping

SLDS has no legend markup. Its Charts guidelines show legends as swatches with labels, sometimes with values, and a size legend for bubble charts. `ChartLegendList` draws the same swatches as Chart's `ChartLegendContent` and its tooltip dot. `ChartSizeLegend` is the guidelines' size legend: nested outlined circles sharing a bottom edge, with a level leader from each circle's top to its value, sized by Recharts' `ZAxis` scale.

Known gaps:

- No gradient legend for color scales.

## Accessibility

- Give `ChartLegendList` an `aria-label` that says what the entries are, like "Industry". It names the list, not the chart; name the chart with its card title.
- Each entry reads as its label and value, like "Email: 35 (35%)". The swatch is hidden from screen readers, so an entry's meaning must be in its label.
- `ChartSizeLegend` hides its drawing and title and says the same in a sentence ("Open deals by dot size: larger dots mean more. The legend shows dots for 56, 20 and 2."), so `title` must read as the measure's name.

## Responsive behavior

- A horizontal list wraps onto new lines and centers its entries.
- A vertical list beside a donut needs room: about 400px for the chart and the list together. In a narrower card, put the list under the chart with `orientation="horizontal"`.

## Example code

### Campaigns by source

Composition. A donut with the total in the middle and a list beside it giving each source's count and share, set with `values` and `orientation`.

```tsx
"use client"

import { useId } from "react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartLegendList } from "@/components/wisty/chart-legend"

const rows = [
  { source: "email", campaigns: 35, fill: "var(--color-email)" },
  { source: "call", campaigns: 25, fill: "var(--color-call)" },
  { source: "text", campaigns: 20, fill: "var(--color-text)" },
  { source: "social", campaigns: 12, fill: "var(--color-social)" },
  { source: "phone", campaigns: 8, fill: "var(--color-phone)" },
]

const config = {
  campaigns: { label: "Campaigns" },
  email: { label: "Email", color: "var(--chart-1)" },
  call: { label: "Call", color: "var(--chart-2)" },
  text: { label: "Text", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
  phone: { label: "Phone", color: "var(--chart-5)" },
} satisfies ChartConfig

const count = new Intl.NumberFormat("en-US")
const percent = new Intl.NumberFormat("en-US", { style: "percent" })

const total = rows.reduce((sum, row) => sum + row.campaigns, 0)
const share = (value: number) =>
  `${count.format(value)} (${percent.format(value / total)})`
const values = Object.fromEntries(
  rows.map((row) => [row.source, share(row.campaigns)])
)

export default function ChartLegendDefault() {
  const titleId = useId()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle id={titleId}>Campaigns by source</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-6">
          <ChartContainer
            config={config}
            className="aspect-square w-full max-w-56 min-w-0 flex-1"
          >
            <PieChart aria-labelledby={titleId}>
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload?.map((item) => ({
                      ...item,
                      value: share(Number(item.value)),
                    }))}
                    nameKey="source"
                    hideLabel
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
                        <tspan
                          x={x}
                          y={y + 24}
                          className="fill-muted-foreground"
                        >
                          Campaigns
                        </tspan>
                      </text>
                    )
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <ChartLegendList
            config={config}
            values={values}
            orientation="vertical"
            aria-label="Campaigns by source"
            className="min-w-32 pt-4"
          />
        </div>
      </CardContent>
    </Card>
  )
}
```

### Bubble chart

Relationship. Dot size is open deals, explained by `ChartSizeLegend` from the `ZAxis` `domain` and `range`, and color is industry in `ChartLegendList`.

```tsx
"use client"

import { useId } from "react"
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
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
import {
  ChartLegendList,
  ChartSizeLegend,
} from "@/components/wisty/chart-legend"

type Row = {
  account: string
  industry: "tech" | "health" | "retail"
  employees: number
  sales: number
  deals: number
}

const rows: Row[] = [
  {
    account: "Acme",
    industry: "tech",
    employees: 40,
    sales: 120_000,
    deals: 8,
  },
  {
    account: "Globex",
    industry: "tech",
    employees: 150,
    sales: 300_000,
    deals: 24,
  },
  {
    account: "Initech",
    industry: "tech",
    employees: 380,
    sales: 520_000,
    deals: 40,
  },
  {
    account: "Umbrella",
    industry: "health",
    employees: 85,
    sales: 180_000,
    deals: 12,
  },
  {
    account: "Wonka",
    industry: "health",
    employees: 260,
    sales: 420_000,
    deals: 30,
  },
  {
    account: "Stark",
    industry: "health",
    employees: 600,
    sales: 580_000,
    deals: 36,
  },
  {
    account: "Wayne",
    industry: "retail",
    employees: 120,
    sales: 160_000,
    deals: 10,
  },
  {
    account: "Hooli",
    industry: "retail",
    employees: 450,
    sales: 470_000,
    deals: 34,
  },
  {
    account: "Soylent",
    industry: "retail",
    employees: 700,
    sales: 760_000,
    deals: 56,
  },
]

const config = {
  tech: { label: "Technology", color: "var(--chart-1)" },
  health: { label: "Healthcare", color: "var(--chart-2)" },
  retail: { label: "Retail", color: "var(--chart-3)" },
} satisfies ChartConfig

const sizeDomain: [number, number] = [
  0,
  Math.max(0, ...rows.map((row) => row.deals)),
]
const sizeRange: [number, number] = [0, 900]

const count = new Intl.NumberFormat("en-US")
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

const points = rows.map((row) => ({
  ...row,
  fill: `var(--color-${row.industry})`,
}))

export default function ChartLegendBubble() {
  const titleId = useId()

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle id={titleId}>
          Accounts by employees, sales and open deals
        </CardTitle>
        <CardDescription>USD</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ChartContainer config={config} className="w-full">
          <ScatterChart
            aria-labelledby={titleId}
            margin={{ top: 8, right: 16, bottom: 16, left: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              type="number"
              dataKey="employees"
              name="Employees"
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => count.format(value)}
              label={{
                value: "Employees",
                position: "insideBottom",
                offset: -12,
              }}
            />
            <YAxis
              type="number"
              dataKey="sales"
              name="Sales"
              domain={[0, "auto"]}
              width="auto"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => compact.format(value)}
              label={{
                value: "Sales",
                angle: -90,
                position: "insideLeft",
                textAnchor: "middle",
              }}
            />
            <ZAxis
              type="number"
              dataKey="deals"
              name="Open deals"
              domain={sizeDomain}
              range={sizeRange}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  | (typeof points)[number]
                  | undefined
                return (
                  <ChartTooltipContent
                    active={active}
                    label={row?.account}
                    payload={
                      row && payload
                        ? [
                            {
                              ...payload[0]!,
                              dataKey: "industry",
                              name: "Industry",
                              value: config[row.industry].label,
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
            <Scatter data={points} stroke="var(--background)" strokeWidth={1} />
          </ScatterChart>
        </ChartContainer>
        <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-3">
          <ChartLegendList config={config} aria-label="Industry" />
          <ChartSizeLegend
            title="Open deals"
            domain={sizeDomain}
            range={sizeRange}
            valueFormatter={(value) => count.format(value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
```

### Funnel with values

Pipeline. A funnel with square swatches from `shape`, each with its stage's count and share, since the arrow keys can't walk stages.

```tsx
"use client"

import { useId } from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartLegendList } from "@/components/wisty/chart-legend"

const data = [
  { stage: "prospecting", opportunities: 120 },
  { stage: "qualification", opportunities: 90 },
  { stage: "proposal", opportunities: 60 },
  { stage: "negotiation", opportunities: 35 },
  { stage: "closedWon", opportunities: 20 },
]

const config = {
  opportunities: { label: "Opportunities" },
  prospecting: { label: "Prospecting", color: "var(--chart-1)" },
  qualification: { label: "Qualification", color: "var(--chart-2)" },
  proposal: { label: "Proposal/Price Quote", color: "var(--chart-3)" },
  negotiation: { label: "Negotiation/Review", color: "var(--chart-4)" },
  closedWon: { label: "Closed Won", color: "var(--chart-5)" },
} satisfies ChartConfig

const count = new Intl.NumberFormat("en-US")
const percent = new Intl.NumberFormat("en-US", { style: "percent" })

const total = data.reduce((sum, row) => sum + row.opportunities, 0)
const share = (value: number) =>
  `${count.format(value)} (${percent.format(value / total)})`
const values = Object.fromEntries(
  data.map((row) => [row.stage, share(row.opportunities)])
)
const column = [
  Object.fromEntries(data.map((row) => [row.stage, row.opportunities])),
]
const taper = 0.3
const slices = data.map((row, index) => {
  const above = data
    .slice(0, index)
    .reduce((sum, stage) => sum + stage.opportunities, 0)
  const top = (taper * above) / total
  const bottom = (taper * (above + row.opportunities)) / total
  return {
    stage: row.stage,
    points: `${top},0 ${1 - top},0 ${1 - bottom},1 ${bottom},1`,
  }
})

export default function ChartLegendFunnel() {
  const titleId = useId()
  const clipId = useId()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle id={titleId}>Opportunities by stage</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-6">
          <ChartContainer
            config={config}
            className="aspect-[4/3] w-full max-w-56 min-w-0 flex-1"
          >
            <BarChart
              data={column}
              barCategoryGap={0}
              reverseStackOrder
              aria-labelledby={titleId}
            >
              <defs>
                {slices.map((slice) => (
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
              <YAxis hide />
              <ChartTooltip
                cursor={false}
                shared={false}
                content={({ active, payload }) => (
                  <ChartTooltipContent
                    active={active}
                    hideLabel
                    payload={payload?.map((item) => ({
                      ...item,
                      value: share(Number(item.value)),
                    }))}
                  />
                )}
              />
              {data.map((row) => (
                <Bar
                  key={row.stage}
                  dataKey={row.stage}
                  stackId="funnel"
                  fill={`var(--color-${row.stage})`}
                  stroke="var(--background)"
                  clipPath={`url(#${clipId}-${row.stage})`}
                />
              ))}
            </BarChart>
          </ChartContainer>
          <ChartLegendList
            config={config}
            values={values}
            shape="square"
            orientation="vertical"
            aria-label="Opportunities by stage"
            className="min-w-36"
          />
        </div>
      </CardContent>
    </Card>
  )
}
```
