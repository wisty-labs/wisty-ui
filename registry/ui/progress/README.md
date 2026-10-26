# Progress

This page shows the Radix version. Base UI projects get [registry/base/ui/progress.tsx](../../base/ui/progress.tsx), and [ui.wisty.ai/progress](https://ui.wisty.ai/progress) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows how far a task has come, from 0 to 100%.

```bash
npx shadcn@latest add @wisty/progress
```

## Examples

- `default` (Importing accounts): A label and its bold percentage above a bar at `value={25}`: `ProgressLabel` and `ProgressValue` in Base UI projects, plain markup in Radix ones.
- `sizes` (Sizes): SLDS's x-small, small, default and large heights and its circular bar, set with `h-*` and `rounded-full` classes on the bar.

## When to use

- A task takes more than a moment and you know how far along it is: an upload, an import, a batch update.
- To show how much of something is used or done, like a quota or a checklist, as a bar.

## When not to use

- You don't know how long it will take. Use Spinner.
- Content is loading into a known layout. Use Skeleton.
- Steps with names, like a guided setup. Use Path.
- People set the value. Use Slider.

## Usage

Pass a `value` and a name.

```tsx
import { Progress } from "@/components/ui/progress"
```

```tsx
<Progress value={40} aria-label="Import progress" />
```

The bases differ for a label, a value text and classes:

- In Radix projects, `Progress` is the bar alone, and classes on it land on the bar. Put the label and the value in your own markup above it, point `aria-labelledby` at the label and mark the value text `aria-hidden`, as the Importing accounts example shows.
- In Base UI projects, put `ProgressLabel` and `ProgressValue` inside `Progress`. They sit in a row above the bar, and the label names it. `ProgressValue` shows "25%" on its own, or takes a function of that text, like ``{(text) => `${text} complete`}``. The bar is a track inside `Progress`, so reach it with `[&_[data-slot=progress-track]]:`, as the Sizes example does.

## Rules

- Pass `value` as a number from 0 to 100. A fraction like 0.25 draws a near-empty bar.
- Don't restyle the colors. They come from the theme.

## API reference

### Progress

Also takes every [Radix Progress.Root](https://www.radix-ui.com/primitives/docs/components/progress#root) prop.

## SLDS mapping

The bar is `slds-progress-bar` and the fill is `slds-progress-bar__value`, as wide as the value. In Base UI projects, `ProgressLabel` and `ProgressValue` draw SLDS's labelled bar. SLDS's other heights and the circular bar aren't props: the Sizes example sets them with classes.

Known gaps:

- No vertical bar (`slds-progress-bar_vertical`) and no green value (`slds-progress-bar__value_success`).

## Accessibility

- Name every bar: `aria-label`, or `aria-labelledby` pointing at a visible label. `ProgressLabel` does it where it exists.
- With `value={null}`, the bar is indeterminate: empty, with no `aria-valuenow`. Pass `null` while you don't know yet, not 0.
- Screen readers don't announce the value as it moves. Announce the end of a long task somewhere else, like a toast.

## Motion

- The fill doesn't animate, so a change jumps to the new width.

## Responsive behavior

- The bar fills its container's width. Put it in a container with a width, or use `max-w-*`.

## Example code

### Importing accounts

A label and its bold percentage above a bar at `value={25}`: `ProgressLabel` and `ProgressValue` in Base UI projects, plain markup in Radix ones.

```tsx
import { useId } from "react"

import { Progress } from "@/components/ui/progress"

export default function ProgressDefault() {
  const id = useId()

  return (
    <div className="grid w-full max-w-md gap-2">
      <div className="flex items-center justify-between gap-3">
        <span id={`${id}-label`}>Importing accounts</span>
        <span aria-hidden="true" className="font-bold">
          25% complete
        </span>
      </div>
      <Progress value={25} aria-labelledby={`${id}-label`} />
    </div>
  )
}
```

### Sizes

SLDS's x-small, small, default and large heights and its circular bar, set with `h-*` and `rounded-full` classes on the bar.

```tsx
import { Progress } from "@/components/ui/progress"

export default function ProgressSizes() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <Progress value={25} aria-label="Contacts imported" className="h-0.5" />
      <Progress value={25} aria-label="Leads imported" className="h-1" />
      <Progress value={25} aria-label="Accounts imported" />
      <Progress
        value={25}
        aria-label="Opportunities imported"
        className="h-3"
      />
      <Progress
        value={25}
        aria-label="Cases imported"
        className="rounded-full [&_[data-slot=progress-indicator]]:rounded-full"
      />
    </div>
  )
}
```
