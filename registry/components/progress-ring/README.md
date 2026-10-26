# Progress ring

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/progress-ring](https://ui.wisty.ai/progress-ring) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows how much of a task is done as a small ring that fills from 0 to 100. For a value against a target, use Gauge.

```bash
npx shadcn@latest add @wisty/progress-ring
```

## Examples

- `default` (Onboarding progress): Three quarters done at `value={75}` in a `size="large"` ring with nothing inside, so screen readers hear the label and 75%.
- `variants` (Variants): Base, active step, warning and expired at 60, then complete at 100, with the warning, expired and complete icons each carrying a hidden word.
- `step` (Step number): A Setup Assistant step: a large `active-step` ring a third done, with the step number "2" as its children.
- `drain` (Countdown): With `direction="drain"`, the ring empties counterclockwise as time runs out, named by the text beside it through `aria-labelledby`.
- `sizes` (Sizes): The default medium ring and `size="large"`, both at 40.
- `autocomplete` (Completes at 100): With `variant="base-autocomplete"`, rings at 0 and 50 stay base, and the one at 100 turns complete with a check.

## When to use

- A task is partly done and you know how much, like a profile's completion, an import's progress or a setup step, and there's room for a small ring but not a bar.
- Time or a quota runs down, like the days left to respond to a case. Use `direction="drain"`.
- The share needs a status beside it: the step people are on (`active-step`), running late (`warning`), out of time (`expired`) or done (`complete`).
- It replaces `lightning-progress-ring`.

## When not to use

- You don't know how long the work will take. Use Spinner.
- There's room for a bar, or the progress is the main thing on the page, like an upload. Use Progress.
- A value is measured against a target, with ranges like behind and on track, like quota attainment. Use Gauge.
- People work through named steps in order. Use Progress indicator.
- You want to show the percent. Write it beside the ring, never in it. For a large dial with its value inside, use Gauge.

## Usage

```tsx
import { ProgressRing } from "@/components/wisty/progress-ring"
```

```tsx
<ProgressRing value={40} aria-label="Data import" />
```

- `value` is a percent, from 0 to 100. Pass `null` when it isn't known yet, so the ring stays empty and screen readers hear no value.
- Children go inside the ring: a step number, as a setup list numbers its steps. The warning, expired and complete variants show their icon there instead.
- With `variant="base-autocomplete"`, the ring turns complete, with a check, when `value` reaches 100.

## Rules

- Keep `value` a percent. Convert a count or an amount first, like `Math.round((done / total) * 100)`.
- Use `variant="complete"` only at 100. To turn complete when the task finishes, use `base-autocomplete`.
- Children are a step number or one glyph, never a percentage or a word. The ring is sized for one or two characters.
- Never pass `asChild` or `render`.

## API reference

### ProgressRing

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label`? | `string` |  | Names what the ring measures, like "Upload progress". |
| `aria-labelledby`? | `string` |  | The id of visible text that names what the ring measures. |
| `children`? | `React.ReactNode` |  | A step number or one glyph inside the ring. Not shown with an icon. |
| `variant`? | `"base" \| "base-autocomplete" \| "active-step" \| "warning" \| "expired" \| "complete"` | `"base"` |  |
| `size`? | `"medium" \| "large"` | `"medium"` |  |
| `value` | `number \| null` |  | How much is done, from 0 to 100. Clamped. null when it isn't known. |
| `direction`? | `"fill" \| "drain"` | `"fill"` | fill grows the ring clockwise; drain empties it counterclockwise. |
| `iconLabel`? | `string` |  | Replaces the icon's hidden word ("Warning", "Expired", "Complete"). |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

## SLDS mapping

`ProgressRing` is `slds-progress-ring`. The progressbar inside it is `slds-progress-ring__progress`, holding the arc, `slds-progress-ring__path`. Children and the variant's icon go in `slds-progress-ring__content`, and the dot at the arc's end is `slds-progress-ring__progress-head`.

Known gaps:

- The warning, expired and complete icons are Lucide's triangle alert, ban and check, standing for `utility:warning`, `utility:error` and `utility:check`.
- The blueprint's warning and expired colors without their icon aren't a variant. Like `lightning-progress-ring`, those variants always show it.

## Accessibility

- Name the ring with `aria-label`, or point `aria-labelledby` at visible text beside it. Say what it measures, like "Upload progress".
- The value is read as a percent of 100. To show a count, like 3 of 7 days, pass its percent and write the count beside the ring.
- The warning, expired and complete icons are read as a hidden word: "Warning", "Expired" or "Complete". Translate it with `iconLabel`.
- Children are read after the progressbar, not as its value. A bare "2" says little, so put the step in the label too, like "Step 2 of 4".
- The ring is never focusable. Don't put a link or button inside it.

## Motion

- The arc doesn't animate. A new value jumps into place, in every theme.

## Example code

### Onboarding progress

Three quarters done at `value={75}` in a `size="large"` ring with nothing inside, so screen readers hear the label and 75%.

```tsx
import { ProgressRing } from "@/components/wisty/progress-ring"

export default function ProgressRingDefault() {
  return (
    <ProgressRing value={75} size="large" aria-label="Onboarding progress" />
  )
}
```

### Variants

Base, active step, warning and expired at 60, then complete at 100, with the warning, expired and complete icons each carrying a hidden word.

```tsx
import { ProgressRing } from "@/components/wisty/progress-ring"

export default function ProgressRingVariants() {
  return (
    <div className="flex items-center gap-4">
      <ProgressRing value={60} aria-label="Profile completion" />
      <ProgressRing
        value={60}
        variant="active-step"
        aria-label="Connect your email"
      />
      <ProgressRing value={60} variant="warning" aria-label="First response" />
      <ProgressRing value={60} variant="expired" aria-label="Resolution time" />
      <ProgressRing value={100} variant="complete" aria-label="Account setup" />
    </div>
  )
}
```

### Step number

A Setup Assistant step: a large `active-step` ring a third done, with the step number "2" as its children.

```tsx
import { ProgressRing } from "@/components/wisty/progress-ring"

export default function ProgressRingStep() {
  return (
    <ProgressRing
      value={33}
      variant="active-step"
      size="large"
      aria-label="Step 2 of 4"
    >
      2
    </ProgressRing>
  )
}
```

### Countdown

With `direction="drain"`, the ring empties counterclockwise as time runs out, named by the text beside it through `aria-labelledby`.

```tsx
import { useId } from "react"

import { ProgressRing } from "@/components/wisty/progress-ring"

export default function ProgressRingDrain() {
  const id = useId()

  return (
    <div className="flex items-center gap-2">
      <ProgressRing value={43} direction="drain" aria-labelledby={id} />
      <span id={id}>3 days left</span>
    </div>
  )
}
```

### Sizes

The default medium ring and `size="large"`, both at 40.

```tsx
import { ProgressRing } from "@/components/wisty/progress-ring"

export default function ProgressRingSizes() {
  return (
    <div className="flex items-center gap-4">
      <ProgressRing value={40} aria-label="Data import" />
      <ProgressRing value={40} size="large" aria-label="Data import" />
    </div>
  )
}
```

### Completes at 100

With `variant="base-autocomplete"`, rings at 0 and 50 stay base, and the one at 100 turns complete with a check.

```tsx
import { ProgressRing } from "@/components/wisty/progress-ring"

export default function ProgressRingAutocomplete() {
  return (
    <div className="flex items-center gap-4">
      <ProgressRing
        value={0}
        variant="base-autocomplete"
        aria-label="Add users"
      />
      <ProgressRing
        value={50}
        variant="base-autocomplete"
        aria-label="Import contacts"
      />
      <ProgressRing
        value={100}
        variant="base-autocomplete"
        aria-label="Connect your email"
      />
    </div>
  )
}
```
