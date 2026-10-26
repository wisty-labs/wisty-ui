# Bar list

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/bar-list](https://ui.wisty.ai/bar-list) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Ranks labeled values with a bar under each on one scale, with shares of a total. Rows can link to records or toggle to filter a page.

```bash
npx shadcn@latest add @wisty/bar-list
```

## Examples

- `default` (Top accounts): Accounts by open pipeline, each row a link set with `href` on its item, and shares of the quarter's total from `total`.
- `selection` (Filter by a row): A channel selected with `selected` and `onSelectedChange`, named in the card's description, as a page would filter its other parts by it.
- `agentforce` (Agent escalations): The top five of twelve topics, kept with `limit`, each with its share of all 214 escalations from `total`, not only of the rows shown.
- `marker` (Against a quota): Closed won by rep against the quota every rep carries, drawn across every bar by `marker`, with its text under the rows.
- `bar` (One bar): A `BarListBar` under each of two account fields: the default bar, and a `size="xs"` bar with a `marker`, colored by `--bar-list-color`.
- `states` (Zero, small and missing values): A tiny value keeps its true length, a zero has no bar, a `null` value sorts last and says No data, and an empty list shows its `emptyMessage`.

## When to use

- To rank a handful of things by one value: top accounts by pipeline, owners by bookings, queues by backlog, agent topics by escalations. It answers "which ones drive this number".
- When a row should open its record, or filter the rest of a page.
- When every row is measured against one reference value, like a quota each rep carries. The `marker` draws it across every bar, as the Against a quota example shows.
- Lightning's dashboards draw this as a horizontal bar chart, and the bar list draws that chart as a list.

## When not to use

- For a trend over time. Use Chart, or Metric with a sparkline.
- For values that can be negative. Bars here start at zero and only grow right. Use a Chart bar chart.
- For more than about ten rows. Show the top rows with `limit` and link to a report or list view for the rest.
- For parts of a whole that people compare by proportion only. A Chart donut or stacked bar may suit better.
- For a table of several columns. Use Data table.

## Usage

```tsx
import { BarList } from "@/components/wisty/bar-list"
```

```tsx
<BarList
  aria-label="Cases by channel"
  items={[
    { label: "Email", value: 412 },
    { label: "Phone", value: 288 },
    { label: "Web", value: 176 },
  ]}
/>
```

A row with an `href` is a link. Passing `selected`, `defaultSelected` or `onSelectedChange` makes every row a toggle button instead, one selected at a time or none, and the list ignores `href`: the page owns the selection and filters its other parts with it (the Filter by a row example). `BarListBar` is one bar on its own, for a row a list can't hold (the One bar example); it's hidden from screen readers, so write the number beside it. Pass `locale` for the org's locale, and format a number you write yourself the same way, with Metric's `formatMetricValue`; the examples use en-US.

## Rules

- Pass `null` for a value you don't have, never a zero. Zero is a real value and draws no bar.
- Pass `total` only when the values add up to it (amounts and counts, not rates), and only the true total of all records, never the sum of the rows shown.
- Use `href` for record links or selection for filtering, never both.
- Pass `marker` only for one reference that applies to every row, in the values' unit. A target that differs per row isn't a marker; use a Gauge per row.
- Give lists side by side the same `max`, at least their largest value. Keep one `color` per measure across a page.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `BarListBar` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) | One bar on a scale from 0 to max. Hidden from assistive technology: the row's text says the value. |
| `BarList` | [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol) |  |

### BarListBar

One bar on a scale from 0 to max. Hidden from assistive technology: the row's text says the value.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| null` |  | The bar's length on the scale. null or 0 draws no fill. |
| `max` | `number` |  | The scale's end. |
| `marker`? | `number` |  | A reference value, drawn as a dashed line when it's on the scale. |
| `size`? | `keyof typeof barSizes` | `"default"` | "xs" is a hairline, for dense rows. |

### BarList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BarListItem[]` |  |  |
| `format`? | `Intl.NumberFormatOptions` |  | Intl.NumberFormat options for values. Without a notation, 10,000 and up read compact. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers. Default "en-US". |
| `sort`? | `"descending" \| "ascending" \| "none"` | `"descending"` | Default "descending". "none" keeps the given order. |
| `limit`? | `number` |  | Shows only the first rows after sorting. |
| `total`? | `number` |  | The whole population's total, to show each row's share of it. |
| `max`? | `number` |  | The scale's end, shared by lists side by side so their bars compare. Grows to fit the largest value and the marker if they're larger. |
| `marker`? | `BarListMarker` |  | A reference value drawn across every bar, like a quota, with its label. |
| `color`? | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Which chart color the bars take, --chart-1 to --chart-6. Default 1. |
| `emptyMessage`? | `string` | `"No data"` | What the list says when it has no rows. Default "No data". |
| `selected`? | `string \| null` |  | The selected row's id, controlled. Any of the three selection props makes rows toggle buttons. |
| `defaultSelected`? | `string \| null` | `null` | The row to start selected when uncontrolled. |
| `onSelectedChange`? | `(id: string \| null) => void` |  | Called with the toggled row's id, or null when it's cleared. |

### BarListItem

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `id`? | `string` |  | A stable id for selection and keys. Default the label. |
| `label` | `string` |  | What the row is, like an account name. |
| `value` | `number \| null` |  | The number. null is a missing value: it sorts last and reads "No data". |
| `detail`? | `string` |  | A second line under the label, like the owner. |
| `href`? | `string` |  | Makes the row a link. Ignored when the list is selectable. |

### BarListMarker

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` |  | Where the line sits, on the bars' scale. |
| `label`? | `string` |  | Its name, shown before its value under the list, like "Quota". |

## SLDS mapping

SLDS has no bar list. The rows follow the SLDS Charts guidelines and the theme's text tokens; each bar is SLDS's circular progress bar (`slds-progress-bar slds-progress-bar_circular`) in a chart color on the progress track, the same bar the flat Gauge draws, and `BarListBar`'s `xs` size is `slds-progress-bar_x-small`. The marker is the flat gauge's target mark, drawn on each bar. A `data-chart-palette` on an ancestor changes the bars' color.

Known gaps:

- SLDS's bar charts have an axis, gridlines and a tooltip. The bar list has none of them and writes the value on every row instead.

## Accessibility

- Name the list: `aria-label`, or `aria-labelledby` with the title's id. Without one it reads as an unnamed list.
- The bar is hidden from assistive technology; the row's text carries the value.
- A long label is cut with an ellipsis and keeps its full text in a `title`. The cut is visual only: a linked row's accessible name holds the whole label.
- Selection is never shown by color alone: the row's `aria-pressed` changes and the other bars fade.

## Motion

- When the selection changes, the other bars fade in every theme. With reduced motion they change at once.

## Responsive behavior

- The label column shrinks and truncates; the value and share never wrap. On a narrow card a long name loses its end first, so keep the figures short with `format`.

## Example code

### Top accounts

Accounts by open pipeline, each row a link set with `href` on its item, and shares of the quarter's total from `total`.

```tsx
import { BarList } from "@/components/wisty/bar-list"

const accounts = [
  {
    label: "Edge Communications",
    value: 1_240_000,
    detail: "Maria Chen",
    href: "#edge",
  },
  {
    label: "Burlington Textiles Corp of America",
    value: 865_000,
    detail: "Jon Amos",
    href: "#burlington",
  },
  {
    label: "United Oil & Gas Corp.",
    value: 1_610_000,
    detail: "Maria Chen",
    href: "#united-oil",
  },
  {
    label: "Grand Hotels & Resorts Ltd",
    value: 540_000,
    detail: "Priya Nair",
    href: "#grand-hotels",
  },
  {
    label: "GenePoint",
    value: 312_000,
    detail: "Sam Ortiz",
    href: "#genepoint",
  },
]

export default function BarListDefault() {
  return (
    <BarList
      aria-label="Top accounts by open pipeline"
      className="w-full max-w-md"
      items={accounts}
      format={{ style: "currency", currency: "USD" }}
      total={7_420_000}
    />
  )
}
```

### Filter by a row

A channel selected with `selected` and `onSelectedChange`, named in the card's description, as a page would filter its other parts by it.

```tsx
"use client"

import { useId, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarList } from "@/components/wisty/bar-list"

const channels = [
  { id: "email", label: "Email", value: 412 },
  { id: "phone", label: "Phone", value: 318 },
  { id: "web", label: "Web", value: 276 },
  { id: "chat", label: "Messaging", value: 189 },
  { id: "agent", label: "Agentforce handoff", value: 89 },
]

export default function BarListSelection() {
  const titleId = useId()
  const [channel, setChannel] = useState<string | null>("phone")
  const selected = channels.find((item) => item.id === channel)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle id={titleId}>New cases by channel</CardTitle>
        <CardDescription aria-live="polite">
          {selected
            ? `Filtered to ${selected.label}: ${selected.value} cases`
            : "1,284 cases this week. Select a channel to filter."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarList
          aria-labelledby={titleId}
          items={channels}
          total={1_284}
          color={5}
          selected={channel}
          onSelectedChange={setChannel}
        />
      </CardContent>
    </Card>
  )
}
```

### Agent escalations

The top five of twelve topics, kept with `limit`, each with its share of all 214 escalations from `total`, not only of the rows shown.

```tsx
import { useId } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarList } from "@/components/wisty/bar-list"

const topics = [
  {
    label: "Billing disputes",
    value: 61,
    detail: "28 sessions with a refund over the agent's limit",
  },
  { label: "Order changes after shipping", value: 44 },
  { label: "Warranty claims", value: 37 },
  { label: "Account access", value: 22 },
  { label: "Product recommendations", value: 9 },
  { label: "Shipping delays", value: 8 },
  { label: "Returns", value: 8 },
  { label: "Password resets", value: 7 },
  { label: "Invoice copies", value: 6 },
  { label: "Delivery address changes", value: 5 },
  { label: "Loyalty points", value: 4 },
  { label: "Other", value: 3 },
]

export default function BarListAgentforce() {
  const titleId = useId()
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle id={titleId}>Escalations by topic</CardTitle>
        <CardDescription>
          Service agent, September. Top 5 of {topics.length} topics, share of
          all 214 escalations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarList
          aria-labelledby={titleId}
          items={topics}
          total={214}
          limit={5}
          color={3}
        />
      </CardContent>
    </Card>
  )
}
```

### Against a quota

Closed won by rep against the quota every rep carries, drawn across every bar by `marker`, with its text under the rows.

```tsx
import { useId } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarList } from "@/components/wisty/bar-list"

const reps = [
  { label: "Maria Chen", value: 512_000, detail: "West" },
  { label: "Jon Amos", value: 386_000, detail: "Central" },
  { label: "Priya Nair", value: 441_000, detail: "West" },
  { label: "Sam Ortiz", value: 214_000, detail: "Central" },
  { label: "Lauren Boyle", value: 298_000, detail: "West" },
]

export default function BarListMarker() {
  const titleId = useId()
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle id={titleId}>Closed won by rep</CardTitle>
        <CardDescription>Q3 FY2027, against each rep's quota</CardDescription>
      </CardHeader>
      <CardContent>
        <BarList
          aria-labelledby={titleId}
          items={reps}
          format={{ style: "currency", currency: "USD" }}
          marker={{ value: 400_000, label: "Quota" }}
        />
      </CardContent>
    </Card>
  )
}
```

### One bar

A `BarListBar` under each of two account fields: the default bar, and a `size="xs"` bar with a `marker`, colored by `--bar-list-color`.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarListBar } from "@/components/wisty/bar-list"

const account = {
  name: "Edge Communications",
  owner: "Maria Chen",
  pipelineShare: 0.17,
  winRate: 0.62,
  winRateTarget: 0.8,
}

const percent = new Intl.NumberFormat("en-US", { style: "percent" })

export default function BarListOneBar() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardDescription>Owner: {account.owner}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span>Share of open pipeline</span>
              <span className="font-bold tabular-nums">
                {percent.format(account.pipelineShare)}
              </span>
            </div>
            <BarListBar value={account.pipelineShare} max={1} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span>Win rate</span>
              <span className="tabular-nums">
                <span className="font-bold">
                  {percent.format(account.winRate)}
                </span>
                <span className="text-muted-foreground">
                  , target {percent.format(account.winRateTarget)}
                </span>
              </span>
            </div>
            <BarListBar
              value={account.winRate}
              max={1}
              marker={account.winRateTarget}
              size="xs"
              className="[--bar-list-color:var(--chart-3)]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Zero, small and missing values

A tiny value keeps its true length, a zero has no bar, a `null` value sorts last and says No data, and an empty list shows its `emptyMessage`.

```tsx
import { useId } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarList } from "@/components/wisty/bar-list"

const regions = [
  { label: "North America", value: 2_310_000 },
  { label: "EMEA", value: 1_180_000 },
  { label: "APAC", value: 24_000 },
  { label: "LATAM", value: 0 },
  { label: "Middle East", value: null },
]

export default function BarListStates() {
  const bookingsId = useId()
  const renewalsId = useId()
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle id={bookingsId}>Bookings by region</CardTitle>
        </CardHeader>
        <CardContent>
          <BarList
            aria-labelledby={bookingsId}
            items={regions}
            format={{ style: "currency", currency: "USD" }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle id={renewalsId}>Renewals by region</CardTitle>
        </CardHeader>
        <CardContent>
          <BarList
            aria-labelledby={renewalsId}
            items={[]}
            emptyMessage="No renewals closed yet"
          />
        </CardContent>
      </Card>
    </div>
  )
}
```
