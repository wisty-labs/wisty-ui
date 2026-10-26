# Gauge

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/gauge](https://ui.wisty.ai/gauge) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows one value against a maximum, as a dial, a ring, a bar or a row of dots. Optional ranges color the scale.

```bash
npx shadcn@latest add @wisty/gauge
```

## Examples

- `default` (Quota attainment): Metric. 72% of 100 on the default dial, its needle in the at-risk band of three `bands` on the scale.
- `ring` (Ring): Metric. 75% of the goal on a ring from `variant="polar"`, with the value in the middle.
- `flat` (Flat): Metric. Two bars from `variant="flat"`, each with the team average as a `reference` named Avg.
- `rating` (Rating): Metric. Customer satisfaction of 7 on ten dots from `variant="rating"`, against a target `reference` of 8.
- `without-bands` (Without bands): Metric. A dial with no `bands`: a win rate of 34% fills the track up to the needle, with the 40% average as a `reference`.
- `against-a-limit` (Against a limit): Metric. Data storage at 4.6 of a 5 GB `max` on a bar, in a Near limit band after a band with no tone.
- `bands` (Bands): Lightning's segment ranges from `bands` on a ring for the team and a bar per rep: behind below 50%, at risk below 80%, on track from it.
- `over-target` (Over target): Metric. A `value` of 124 past a `max` of 100, as a dial and a bar: the needle and the bar stop at max and the text shows the real value.
- `no-data` (No data): Metric. A `value` of `null` for attainment that didn't load: the dial has no needle, the bar is empty, and both say No data.

## When to use

- One value is measured against a scale or a goal, like quota attainment, win rate or customer satisfaction.
- A value falls into ranges that mean something, like behind, at risk and on track. The default dial draws them on its scale, as a Lightning dashboard's Gauge does.
- Progress toward a goal, where max is the goal. Use a ring (`variant="polar"`), or a bar (`variant="flat"`) where space is tight.
- A score out of a few points, like a 1 to 10 survey. Use `variant="rating"`.
- A usage meter against its limit, like data storage. Use a bar with the limit as `max`, as the Against a limit example shows.

## When not to use

- For a number with no maximum or scale. Use Metric.
- For a task's progress, like an upload or an import. Use Progress.
- For several values to compare. Use Chart, with a bar or column chart.
- For a record's stage in a process. Use Path.
- For a rating someone enters. The rating variant only shows a score. Use Rating.

## Usage

```tsx
import { Gauge } from "@/components/wisty/gauge"
```

```tsx
<Gauge
  variant="flat"
  label="First contact resolution"
  value={64}
  unit="%"
  reference={70}
/>
```

Pick the variant by what the reader compares the value with. A dial shows where the value sits on ranges from bad to good. A ring and a bar show progress toward `max`, the goal. A rating shows a score on `max` dots, five by default.

Add a `reference` when there's a point to compare with, like a target or the team's average, and name it with `referenceLabel` ("Target" by default, "Avg" for an average). It's optional on every variant.

A band runs up to its `to`, not including it, so a value of exactly 80 falls in the band after `to: 80`. A value at or past the last band's `to` counts as the last band. Leave out a band's `tone` for a calm range below a warning. Format the value with `valueFormatter` for the org's locale; the examples use en-US.

## Rules

- Pass the real value, even past `max`. The drawing stops full and the text shows the real value, like "124%". Never clamp or round it yourself.
- Pass `null` for a value that didn't load, never 0, so the gauge says "No data" (the No data example).
- Keep `reference` within `max`: a reference past it gets no mark, only its text.
- On a rating, keep `max` to ten dots or fewer, and pass a whole-number `reference` so its line falls between dots.
- On a dial, a band without a tone draws in the track's color. Use it for a calm range, never for one that needs attention.
- Pass `valueFormatter` a formatter with a fixed locale, like `(value) => compact.format(value)`, so server and client print the same text.
- Change the default value color through `className`, like `[--gauge-color:var(--chart-3)]`. It colors a dial's fill when it has no bands, and the value on the other variants. Bands override it.
- Never pass `asChild` or `render`.

## API reference

### Gauge

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` |  | Names the gauge. Shown under a dial or a ring, or above a bar or a rating. |
| `value` | `number \| null` |  | The value. It may pass max; the drawing stops at max, the text doesn't. null shows noDataLabel. |
| `max`? | `number` |  | The end of the scale, which starts at 0: the goal on a ring or a bar, the number of dots on a rating. Default 100, or 5 on a rating. |
| `variant`? | `"dial" \| "polar" \| "flat" \| "rating"` | `"dial"` | A half dial with a needle (dial), a ring (polar), a bar (flat) or a row of dots (rating). |
| `reference`? | `number` |  | A point to compare the value with, like a target or an average. Keep it within max, or it has no mark. |
| `referenceLabel`? | `string` | `"Target"` | The reference's name, shown with it, like "Target" or "Avg". |
| `bands`? | `GaugeBand[]` |  | Value ranges, lowest first. A dial draws them on its scale; the other variants take the color of the one the value is in. |
| `noDataLabel`? | `string` | `"No data"` | Shown and read when value is null, or max isn't above 0. |
| `valueFormatter`? | `(value: number) => string` | `(value: number) => oneDecimal.format(value)` | Formats the value, the reference and a dial's scale. Default rounded to one decimal. |
| `unit`? | `string` |  | A unit after the value and the reference, like "%" or "days". |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### GaugeBand

```ts
type GaugeBand =
  | {
      to: number
      tone: "success" | "warning" | "error"
      label: string
    }
  | {
      to: number
      tone?: undefined
      label?: string
    }
```

## SLDS mapping

SLDS has no gauge component. The dial is Lightning's dashboard Gauge: a half ring with its segment ranges on the scale, the scale's values inside it, and a needle at the value. The ring, the bar and the rating are the polar gauge, flat gauge and ratings chart of the SLDS Charts guidelines' Metric intent: the ring and the bar fill toward max, the goal, and the guidelines ask for a reference point, a target or an average, where there is one. `bands` take the colors the charts and Metric's trend use; on a ring, a bar or a rating they color the value instead of the scale.

Known gaps:

- Lightning's dial shows no value by default and has no reference. This one writes the value and the band's name under the hub, and marks a `reference` when you pass one.
- Lightning draws its gauge in SLDS 1's colors. This one uses SLDS 2's success, warning and error colors, so it changes with the theme.
- The guidelines say a ring can drain as well as fill. Pass what's left as the value to drain one.

## Accessibility

- The gauge is a `meter` named by its `label`. It sets its own role and `aria-value*` attributes after your props, so you can't replace them.
- `aria-valuenow` stops at `max`, as a meter's value must. `aria-valuetext` carries the real value, the band and the reference, like "68%, At risk, Avg 80%".
- The drawing is hidden from screen readers, and so are the dial's scale values. Everything it shows is also in the text.

## Motion

- The dial's needle sweeps from 0 to the value over 800ms when it first draws, with the charts' easing, and to a new value when the value changes. A dial without bands fills its track along with it.
- With reduced motion, the needle points straight at the value.
- The ring, the bar and the rating don't animate. A new value jumps into place.

## Responsive behavior

- A dial is as wide as its parent, up to 18rem, and a little over half as tall. Below 12rem its scale shows only 0 and max, with no minor ticks.
- A ring is as wide as its parent, up to 14rem, and as tall as it is wide. Narrow either with `className`, like `max-w-48`.
- The ring scales but its text doesn't. Below about 160px the value no longer fits inside, so use a bar there and in lists of people or records.
- A bar fills its parent, with the value at its end. A rating's dots keep their size and shrink only when the row is too narrow.
- In a list of bars whose values differ in width, give the value a fixed width so the bars line up, like `[&_[data-slot=gauge-value]]:min-w-32`.

## Example code

### Quota attainment

Metric. 72% of 100 on the default dial, its needle in the at-risk band of three `bands` on the scale.

```tsx
import { Gauge, type GaugeBand } from "@/components/wisty/gauge"

const bands: GaugeBand[] = [
  { to: 50, tone: "error", label: "Behind" },
  { to: 80, tone: "warning", label: "At risk" },
  { to: 100, tone: "success", label: "On track" },
]

export default function GaugeDefault() {
  return <Gauge label="Quota attainment" value={72} unit="%" bands={bands} />
}
```

### Ring

Metric. 75% of the goal on a ring from `variant="polar"`, with the value in the middle.

```tsx
import { Gauge } from "@/components/wisty/gauge"

export default function GaugeRing() {
  return (
    <Gauge variant="polar" label="Progress toward quota" value={75} unit="%" />
  )
}
```

### Flat

Metric. Two bars from `variant="flat"`, each with the team average as a `reference` named Avg.

```tsx
import { Gauge } from "@/components/wisty/gauge"

export default function GaugeFlat() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Gauge
        variant="flat"
        label="Quota attainment"
        value={98}
        unit="%"
        reference={76}
        referenceLabel="Avg"
      />
      <Gauge
        variant="flat"
        label="Win rate"
        value={75}
        unit="%"
        reference={82}
        referenceLabel="Avg"
      />
    </div>
  )
}
```

### Rating

Metric. Customer satisfaction of 7 on ten dots from `variant="rating"`, against a target `reference` of 8.

```tsx
import { Gauge } from "@/components/wisty/gauge"

export default function GaugeRating() {
  return (
    <div className="w-full max-w-xs">
      <Gauge
        variant="rating"
        label="Customer satisfaction"
        value={7}
        max={10}
        reference={8}
      />
    </div>
  )
}
```

### Without bands

Metric. A dial with no `bands`: a win rate of 34% fills the track up to the needle, with the 40% average as a `reference`.

```tsx
import { Gauge } from "@/components/wisty/gauge"

export default function GaugeWithoutBands() {
  return (
    <Gauge
      label="Win rate"
      value={34}
      unit="%"
      reference={40}
      referenceLabel="Avg"
    />
  )
}
```

### Against a limit

Metric. Data storage at 4.6 of a 5 GB `max` on a bar, in a Near limit band after a band with no tone.

```tsx
import { Gauge, type GaugeBand } from "@/components/wisty/gauge"

const bands: GaugeBand[] = [
  { to: 4 },
  { to: 4.75, tone: "warning", label: "Near limit" },
  { to: Infinity, tone: "error", label: "Almost at limit" },
]

export default function GaugeAgainstALimit() {
  return (
    <div className="w-full max-w-sm">
      <Gauge
        variant="flat"
        label="Data storage"
        value={4.6}
        max={5}
        unit="GB"
        bands={bands}
      />
    </div>
  )
}
```

### Bands

Lightning's segment ranges from `bands` on a ring for the team and a bar per rep: behind below 50%, at risk below 80%, on track from it.

```tsx
import { Gauge, type GaugeBand } from "@/components/wisty/gauge"

const bands: GaugeBand[] = [
  { to: 50, tone: "error", label: "Behind" },
  { to: 80, tone: "warning", label: "At risk" },
  { to: 100, tone: "success", label: "On track" },
]

const team = { attainment: 68 }
const reps = [
  { name: "Ana Silva", attainment: 42 },
  { name: "Ben Ito", attainment: 71 },
  { name: "Cara Diaz", attainment: 93 },
]

export default function GaugeBands() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-8">
      <Gauge
        variant="polar"
        label="Team quota"
        value={team.attainment}
        unit="%"
        bands={bands}
        className="max-w-48"
      />
      <div className="flex w-full max-w-64 flex-col gap-4">
        {reps.map((rep) => (
          <Gauge
            key={rep.name}
            variant="flat"
            label={rep.name}
            value={rep.attainment}
            unit="%"
            bands={bands}
          />
        ))}
      </div>
    </div>
  )
}
```

### Over target

Metric. A `value` of 124 past a `max` of 100, as a dial and a bar: the needle and the bar stop at max and the text shows the real value.

```tsx
import { Gauge } from "@/components/wisty/gauge"

export default function GaugeOverTarget() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-8">
      <Gauge
        label="Progress toward quota"
        value={124}
        unit="%"
        className="max-w-60"
      />
      <div className="w-full max-w-64">
        <Gauge
          variant="flat"
          label="Progress toward quota"
          value={124}
          unit="%"
        />
      </div>
    </div>
  )
}
```

### No data

Metric. A `value` of `null` for attainment that didn't load: the dial has no needle, the bar is empty, and both say No data.

```tsx
import { Gauge } from "@/components/wisty/gauge"

const quota: { attainment: number | null } = { attainment: null }

export default function GaugeNoData() {
  const attainment = quota.attainment
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-8">
      <Gauge
        label="Progress toward quota"
        value={attainment}
        unit="%"
        className="max-w-60"
      />
      <div className="w-full max-w-64">
        <Gauge
          variant="flat"
          label="Progress toward quota"
          value={attainment}
          unit="%"
        />
      </div>
    </div>
  )
}
```
