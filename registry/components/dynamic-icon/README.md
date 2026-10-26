# Dynamic icon

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/dynamic-icon](https://ui.wisty.ai/dynamic-icon) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a small animated status, like a calculation running or a score's strength. For an indefinite wait, use Spinner.

```bash
npx shadcn@latest add @wisty/dynamic-icon
```

## Examples

- `default` (Record statuses): Each glyph before the words it stands for: a calculation running, a chart refreshing, an engaged contact, a likely conversion and a rising win rate.
- `eq` (Equalizer): Bars that bounce while a chart refreshes, and stand at rest with `playing={false}` once it's up to date.
- `score` (Score): A filled green dot for `value="positive"` and an empty red ring for `value="negative"`, each before the words that say which.
- `strength` (Strength): A conversion prediction from `value={3}` to `value={-3}`: green dots above 0, red dots below and three empty dots at 0.
- `trend` (Trend): Up in green, neutral and down in red, each drawing its ring and then its arrow beside the change it stands for.
- `label` (On its own, with a label): An ellie with no text beside it, so its `label` gives screen readers the words in place of the drawing.

## When to use

- Something runs in the background, like a field calculation or an Einstein score being worked out. Use `DynamicIconEllie`.
- A graph or a feed is refreshing, or a recording is in progress. Use `DynamicIconEq`, and stop it with `playing={false}`.
- A record is marked good or bad in one small dot, like an engagement or fit score. Use `DynamicIconScore`.
- A signed score from -3 to 3, like an Einstein prediction's strength or a password's. Use `DynamicIconStrength`.
- A value moved up, down or stayed level, like a forecast score since last week. Use `DynamicIconTrend`.
- It replaces `lightning-dynamic-icon`, apart from its waffle.

## When not to use

- You're waiting on something to load. Use Spinner.
- The status needs words, like Closed Won or Overdue. Use Badge.
- A number shows beside its change. Use Metric, whose trend arrow follows the number's sign.
- How much of a task is done. Use Progress ring.
- Opening the App Launcher. The waffle belongs to the app shell, not here.

## Usage

```tsx
import {
  DynamicIconEllie,
  DynamicIconEq,
  DynamicIconScore,
  DynamicIconStrength,
  DynamicIconTrend,
} from "@/components/wisty/dynamic-icon"
```

```tsx
<DynamicIconStrength value={2} label="Strong fit" />
```

- Each glyph is its own export and takes only its own option: `playing`, `value` or `direction`. Ellie has none.
- `label` says what's happening, like "Forecast score is up 2 points". Without it the icon is decorative and screen readers skip it.

## Rules

- Don't use a score, strength or trend icon for good or bad alone. Its color is the only difference, so put the meaning in `label` or in the text beside it.
- Keep each icon its SLDS size. They're drawn at 5 to 16 pixels and don't scale with text.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `DynamicIconEllie` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `DynamicIconEq` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `DynamicIconScore` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `DynamicIconStrength` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `DynamicIconTrend` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### DynamicIconEllie

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`? | `string` |  | Says what's happening, like "Score is recalculating". Decorative without one. |

### DynamicIconEq

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`? | `string` |  | Says what's happening, like "Score is recalculating". Decorative without one. |
| `playing`? | `boolean` | `true` | Bounces the bars. false stops them at rest. |

### DynamicIconScore

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`? | `string` |  | Says what's happening, like "Score is recalculating". Decorative without one. |
| `value` | `"positive" \| "negative"` |  | positive draws a filled green dot, negative an empty red one. |

### DynamicIconStrength

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`? | `string` |  | Says what's happening, like "Score is recalculating". Decorative without one. |
| `value` | `-3 \| -2 \| -1 \| 0 \| 1 \| 2 \| 3` |  | How many of the three dots fill: green above 0, red below 0. |

### DynamicIconTrend

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`? | `string` |  | Says what's happening, like "Score is recalculating". Decorative without one. |
| `direction` | `"up" \| "down" \| "neutral"` |  | Points the arrow: up in green, down in red, neutral straight ahead. |

## SLDS mapping

Each export is the dynamic icon of the same name: `DynamicIconEllie` is `slds-icon-ellie`, `DynamicIconEq` is `slds-icon-eq` with three `slds-icon-eq__bar`, `DynamicIconScore` is `slds-icon-score`, `DynamicIconStrength` is `slds-icon-strength` and `DynamicIconTrend` is `slds-icon-trend`. `label` is the `slds-assistive-text`.

Known gaps:

- The waffle (`slds-icon-waffle`) isn't here. It's the App Launcher's button.
- `slds-is-paused` isn't a prop. `lightning-dynamic-icon` doesn't offer it either.
- A strength's dots change color with a fade, as `lightning-dynamic-icon` draws them, not with SLDS's staggered fill-in on load.

## Accessibility

- Pass `label` when the icon is the only sign of the status. Say what's happening, like "Graph is refreshing", not what it looks like.
- Leave `label` out when visible text beside the icon already says it, so screen readers don't read it twice.
- A changed `value` or `direction` isn't announced. If people need to hear the change, say it in a live region.

## Motion

- Ellie pops in after two seconds, then pulses twice and stops. Eq's bars bounce until `playing` is false. A trend draws its ring and then its arrow when it appears. Score and strength fade to a new value.
- With reduced motion, nothing moves: ellie and trend show their last frame, eq's bars stand at rest, and a new score or strength jumps into place.

## Example code

### Record statuses

Each glyph before the words it stands for: a calculation running, a chart refreshing, an engaged contact, a likely conversion and a rising win rate.

```tsx
import {
  DynamicIconEllie,
  DynamicIconEq,
  DynamicIconScore,
  DynamicIconStrength,
  DynamicIconTrend,
} from "@/components/wisty/dynamic-icon"

export default function DynamicIconDefault() {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-3">
      <DynamicIconEllie className="justify-self-center" />
      <span>Calculating the forecast</span>
      <DynamicIconEq className="justify-self-center" />
      <span>Refreshing the pipeline chart</span>
      <DynamicIconScore value="positive" className="justify-self-center" />
      <span>Engaged in the last 30 days</span>
      <DynamicIconStrength value={2} className="justify-self-center" />
      <span>Likely to convert</span>
      <DynamicIconTrend direction="up" className="justify-self-center" />
      <span>Win rate up 4 points since last quarter</span>
    </div>
  )
}
```

### Equalizer

Bars that bounce while a chart refreshes, and stand at rest with `playing={false}` once it's up to date.

```tsx
import { DynamicIconEq } from "@/components/wisty/dynamic-icon"

export default function DynamicIconEqExample() {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-3">
      <DynamicIconEq />
      <span>Refreshing the pipeline chart</span>
      <DynamicIconEq playing={false} />
      <span>Pipeline chart is up to date</span>
    </div>
  )
}
```

### Score

A filled green dot for `value="positive"` and an empty red ring for `value="negative"`, each before the words that say which.

```tsx
import { DynamicIconScore } from "@/components/wisty/dynamic-icon"

export default function DynamicIconScoreExample() {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-3">
      <DynamicIconScore value="positive" />
      <span>Engaged in the last 30 days</span>
      <DynamicIconScore value="negative" />
      <span>No activity in 90 days</span>
    </div>
  )
}
```

### Strength

A conversion prediction from `value={3}` to `value={-3}`: green dots above 0, red dots below and three empty dots at 0.

```tsx
import { DynamicIconStrength } from "@/components/wisty/dynamic-icon"

export default function DynamicIconStrengthExample() {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-3">
      <DynamicIconStrength value={3} />
      <span>Very likely to convert</span>
      <DynamicIconStrength value={1} />
      <span>Somewhat likely to convert</span>
      <DynamicIconStrength value={0} />
      <span>Not enough activity to predict</span>
      <DynamicIconStrength value={-1} />
      <span>Somewhat unlikely to convert</span>
      <DynamicIconStrength value={-3} />
      <span>Very unlikely to convert</span>
    </div>
  )
}
```

### Trend

Up in green, neutral and down in red, each drawing its ring and then its arrow beside the change it stands for.

```tsx
import { DynamicIconTrend } from "@/components/wisty/dynamic-icon"

export default function DynamicIconTrendExample() {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-3">
      <DynamicIconTrend direction="up" />
      <span>Win rate up 4 points since last quarter</span>
      <DynamicIconTrend direction="neutral" />
      <span>Pipeline unchanged since last week</span>
      <DynamicIconTrend direction="down" />
      <span>Average deal size down 8% since last quarter</span>
    </div>
  )
}
```

### On its own, with a label

An ellie with no text beside it, so its `label` gives screen readers the words in place of the drawing.

```tsx
import { DynamicIconEllie } from "@/components/wisty/dynamic-icon"

export default function DynamicIconLabel() {
  return <DynamicIconEllie label="Your calculation is running." />
}
```
