# KPI row

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/kpi-row](https://ui.wisty.ai/kpi-row) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A dashboard's header row: key figures on one card, each with its change.

```bash
npx shadcn@latest add @wisty/kpi-row
```

## Examples

- `default` (Quarter at a glance): Open pipeline, closed won, win rate and average deal size against last quarter, win rate changing in points through a percent `format`.
- `partial` (Missing figures): Open pipeline has no `previous`, so it shows no change, and quota attainment's `value` is `null`, so it says No data.
- `loading` (Loading): With `loading`, every metric holds its shape with placeholders before the numbers arrive, and the labels stay readable.

## When to use

- As a dashboard's header row: the three to five numbers a page is about, the way Pipeline Inspection opens with open pipeline, closed won, win rate and average deal size.
- When each number means most next to its change against a period, like last quarter.
- When the row has to hold its shape while the numbers load.

## When not to use

- For one number on its own card, or your own arrangement of label, value and trend. Use Metric.
- For progress toward a target or quota. Use Gauge.
- For a list of values to compare with each other. Use Bar list or Data table.

## Usage

```tsx
import { KpiRow } from "@/components/wisty/kpi-row"
```

```tsx
<KpiRow
  comparison="last quarter"
  metrics={[
    {
      id: "renewals",
      label: "Renewal ARR",
      value: 2_140_000,
      previous: 1_980_000,
    },
    {
      id: "cycle",
      label: "Average sales cycle",
      value: 41,
      previous: 47,
      format: { style: "unit", unit: "day", unitDisplay: "long" },
      isIncreasePositive: false,
    },
  ]}
/>
```

The block formats each number and derives its change as a percent of `previous`: "+8.1% vs last quarter". With a percent `format` the change is in points. When `previous` is 0 it's the difference itself.

## Rules

- Pass numbers to `value` and `previous`, never formatted strings, and `null` for a value you don't have, never 0.
- Pass a percent as a fraction (0.318) with a percent `format`, so its change reads in points.
- Set `isIncreasePositive: false` on every metric where a fall is good, like open cases, sales cycle, handle time or churn. Never flip the sign to get a color.
- Write `comparison` as a person would say it after "vs": "last quarter", "same week last year".
- Pass amounts in one currency and set `currency` to match. Mixed currencies are unavailable (`value: null`), not added up.
- Never pass `asChild` or `render`.

## API reference

### KpiRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `metrics` | `KpiRowMetric[]` |  | Two to five key figures, in reading order. |
| `comparison`? | `string` | `"last quarter"` | The comparison period, as said after "vs". Default "last quarter". |
| `loading`? | `boolean` | `false` | Holds every metric's shape with placeholders while the numbers load. |
| `currency`? | `string` | `"USD"` | An ISO 4217 code for metrics with no `format`. Default "USD". |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers. Default "en-US". |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### KpiRowMetric

One key figure.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` |  |  |
| `label` | `string` |  | What's measured, in sentence case: "Open pipeline". |
| `value` | `number \| null` |  | The current value. null shows "No data" and no change. |
| `previous`? | `number \| null` |  | The comparison period's value. Shows the change against it. |
| `format`? | `Intl.NumberFormatOptions` |  | How the value reads, as Intl.NumberFormat options. Default an amount in the block's `currency`, or a plain number without one. |
| `isIncreasePositive`? | `boolean` |  | Whether a rise is good. Default true. Pass false for open cases, sales cycle, handle time, churn. |

## SLDS mapping

- The card is `slds-card`, with no header: the row is the content.
- Each metric is Metric: the label is `slds-text-title`, the value `slds-text-heading_large`, and the change takes the colors of SLDS's trend icon.
- The placeholders are Skeleton.

## Accessibility

- The card is a group named "Key metrics". Pass `aria-label` to name it for the page.
- Direction is in the signed text. Whether a change is good shows in color only, so where that isn't obvious, make the label say it.
- While loading, each metric is busy and its value and change are placeholders. The labels stay readable.

## Motion

- The loading placeholders pulse, and stop when the user asks for reduced motion.

## Responsive behavior

- The card takes its width from its container, not its content, so give it one in a flex row.
- Its columns follow its own width, so a row never leaves one metric alone: four go one, two by two, then four across from 44rem; five go three over two, then five across from 55rem.
- A long label wraps. The value doesn't shrink.

## Example code

### Quarter at a glance

Open pipeline, closed won, win rate and average deal size against last quarter, win rate changing in points through a percent `format`.

```tsx
import { KpiRow } from "@/components/wisty/kpi-row"

export default function KpiRowDefault() {
  return (
    <KpiRow
      comparison="last quarter"
      currency="USD"
      locale="en-US"
      metrics={[
        {
          id: "pipeline",
          label: "Open pipeline",
          value: 12_480_000,
          previous: 11_020_000,
        },
        {
          id: "closed-won",
          label: "Closed won",
          value: 3_410_000,
          previous: 3_560_000,
        },
        {
          id: "win-rate",
          label: "Win rate",
          value: 0.318,
          previous: 0.287,
          format: { style: "percent", maximumFractionDigits: 1 },
        },
        {
          id: "deal-size",
          label: "Average deal size",
          value: 66_900,
          previous: 62_800,
        },
      ]}
      className="w-full"
    />
  )
}
```

### Missing figures

Open pipeline has no `previous`, so it shows no change, and quota attainment's `value` is `null`, so it says No data.

```tsx
import { KpiRow } from "@/components/wisty/kpi-row"
import { kpiRowPartialFixture } from "@/components/wisty/kpi-row-data"

export default function KpiRowPartial() {
  return <KpiRow {...kpiRowPartialFixture} className="w-full" />
}
```

### Loading

With `loading`, every metric holds its shape with placeholders before the numbers arrive, and the labels stay readable.

```tsx
import { KpiRow } from "@/components/wisty/kpi-row"
import { kpiRowFixture } from "@/components/wisty/kpi-row-data"

export default function KpiRowLoading() {
  return <KpiRow {...kpiRowFixture} loading className="w-full" />
}
```
