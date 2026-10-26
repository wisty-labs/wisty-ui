# Slider

This page shows the Radix version. Base UI projects get [registry/base/ui/slider.tsx](../../base/ui/slider.tsx), and [ui.wisty.ai/slider](https://ui.wisty.ai/slider) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks a number or a range by dragging a thumb along a track.

```bash
npx shadcn@latest add @wisty/slider
```

## Examples

- `default` (Discount): A labelled discount from 0 to 50%, its value after the track.
- `range` (Range): Two thumbs pick a range, one for each number in `defaultValue`.
- `disabled` (Disabled): A slider set with `disabled`: it can't take focus or move.
- `vertical` (Vertical): A slider that runs bottom to top, set with `orientation="vertical"`.

## When to use

- To pick a number from a range where the feel matters more than the exact value, like a discount, a volume or a probability.
- To pick a range with two thumbs, like a price filter, as the Range example shows.
- When the range is small enough to move through with the arrow keys.

## When not to use

- When people need an exact number, or the range is very large. Use Input with `type="number"`, or put one next to the slider.
- When the choice is one of a few named options. Use Radio Group or Toggle Group.
- To show progress, not to choose. Use Progress.

## Usage

Pass the value as an array, one number per thumb, and name the slider with `aria-labelledby` pointing at a visible label.

```tsx
import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function Probability() {
  const id = useId()

  return (
    <div className="grid gap-1">
      <Label id={`${id}-label`}>Probability</Label>
      <Slider aria-labelledby={`${id}-label`} defaultValue={[60]} />
    </div>
  )
}
```

When you control it, let `onValueChange` take a number as well as an array: `setValue(Array.isArray(next) ? next : [next])`. In Base UI projects, moving a single thumb by pointer passes a bare number, though the types say array, and kept as a number the slider draws a second thumb. For expensive work, act when the drag ends instead: `onValueCommit` in Radix projects, `onValueCommitted` in Base UI projects.

## Rules

- Don't restyle the track, thumb or fill colors. They come from the theme.

## API reference

### Slider

| Prop | Type | Default |
| --- | --- | --- |
| `min`? | `number` | `0` |
| `max`? | `number` | `100` |

Also takes every [Radix Slider.Root](https://www.radix-ui.com/primitives/docs/components/slider#root) prop.

## SLDS mapping

SLDS styles a native range input, `slds-slider__range` in `slds-slider`. The track, the fill and each thumb match that input's track and thumb, and `orientation="vertical"` is `slds-slider_vertical`. The value text after the slider is `slds-slider__value`, which the slider doesn't render; add it yourself, as the Discount example does.

Known gaps:

- SLDS's track has no fill. Here the range fills in the thumb's color.
- SLDS's slider is one native input, so it has no range slider.
- SLDS's range text in the label ("0 - 100", `slds-slider-label__range`) isn't part of Slider. Add it to the label if you want it.

## Keyboard interactions

| Keys                                | Action                               |
| ----------------------------------- | ------------------------------------ |
| Right or Up arrow                   | Increases the value by one step.     |
| Left or Down arrow                  | Decreases the value by one step.     |
| Shift + arrow, Page Up or Page Down | Changes the value by ten steps.      |
| Home, End                           | Moves to the minimum or the maximum. |

## Accessibility

- Each thumb takes its name from the root's `aria-labelledby`. An `aria-label` on the root reaches no thumb, so use a visible label.
- Each thumb announces its value, so make the value text next to the slider `aria-hidden`.
- A disabled slider can't take focus. Say why in nearby text if it matters.

## Responsive behavior

- A horizontal slider fills its container's width. A vertical one fills its container's height, so give that container a height, as the Vertical example does.

## Example code

### Discount

A labelled discount from 0 to 50%, its value after the track.

```tsx
"use client"

import { useId, useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"

export default function SliderDefault() {
  const id = useId()
  const [value, setValue] = useState([15])

  return (
    <Field className="w-full max-w-sm">
      <FieldLabel id={`${id}-label`}>Discount</FieldLabel>
      <div className="flex items-center">
        <Slider
          aria-labelledby={`${id}-label`}
          value={value}
          onValueChange={(next) =>
            setValue(Array.isArray(next) ? next : [next])
          }
          max={50}
          step={1}
        />
        <span
          aria-hidden="true"
          className="w-12 shrink-0 text-end tabular-nums"
        >
          {value[0]}%
        </span>
      </div>
    </Field>
  )
}
```

### Range

Two thumbs pick a range, one for each number in `defaultValue`.

```tsx
import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SliderRange() {
  const id = useId()

  return (
    <div className="grid w-full max-w-sm gap-1">
      <Label id={`${id}-label`}>Price range</Label>
      <Slider
        aria-labelledby={`${id}-label`}
        defaultValue={[25, 75]}
        max={100}
        step={5}
      />
    </div>
  )
}
```

### Disabled

A slider set with `disabled`: it can't take focus or move.

```tsx
import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SliderDisabled() {
  const id = useId()

  return (
    <div className="grid w-full max-w-sm gap-1">
      <Label id={`${id}-label`}>Discount</Label>
      <Slider
        aria-labelledby={`${id}-label`}
        defaultValue={[25]}
        max={100}
        disabled
      />
    </div>
  )
}
```

### Vertical

A slider that runs bottom to top, set with `orientation="vertical"`.

```tsx
import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SliderVertical() {
  const id = useId()

  return (
    <div className="flex flex-col items-center gap-2">
      <Label id={`${id}-label`}>Volume</Label>
      <div className="h-48">
        <Slider
          aria-labelledby={`${id}-label`}
          defaultValue={[50]}
          max={100}
          orientation="vertical"
        />
      </div>
    </div>
  )
}
```
