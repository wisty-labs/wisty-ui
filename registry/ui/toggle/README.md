# Toggle

This page shows the Radix version. Base UI projects get [registry/base/ui/toggle.tsx](../../base/ui/toggle.tsx), and [ui.wisty.ai/toggle](https://ui.wisty.ai/toggle) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Stays pressed until it's pressed again, like Bold in a text editor.

```bash
npx shadcn@latest add @wisty/toggle
```

## Examples

- `default` (List view display): Split view, Show charts and Show filters as `variant="outline"` icon toggles, each named by `aria-label`, Show filters pressed.
- `bare` (Bare): Icon toggles with no border, the `default` variant, as in a note's formatting toolbar, Bold pressed.
- `text` (Text): Toggles with labels: one off, one pressed, and a bare text toggle.
- `sizes` (Sizes): Small, default and large, set with `size` on `Toggle`.
- `disabled` (Disabled): Disabled toggles, pressed and not, in both variants.

## When to use

- For a button that stays pressed until it's pressed again, like Bold in a text editor.
- For an icon button that shows or hides part of a view, like a list view's charts or filters, beside buttons that don't stay pressed.
- For a labelled button that marks something, like Favorite.
- In place of Lightning's stateful button icon, or a stateful button whose label stays the same.

## When not to use

- A setting turns on or off in a form or settings list. Use Switch or Checkbox.
- People pick one of a few related options, like text alignment. Use Toggle Group.
- The button runs an action and doesn't stay pressed. Use Button.
- The label changes to name the next action, such as Follow becoming Unfollow. Use Button.

## Usage

An icon-only toggle takes an `aria-label`, which also gives it the square icon padding. A toggle with text is named by its text and pads like a button, as the Text example shows.

```tsx
import { BoldIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
```

```tsx
<Toggle aria-label="Bold" variant="outline">
  <BoldIcon />
</Toggle>
```

## Rules

- Don't add `aria-label` to a toggle with visible text: it gets icon padding, and the label replaces the text as the name.
- Show the pressed state with `defaultPressed` or `pressed`, never with a class. The state has to reach `aria-pressed`.
- Never override colors, radius or height with utility classes. The tokens carry each theme.

## API reference

### Toggle

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "outline"` | `"default"` |
| `size`? | `"default" \| "sm" \| "lg"` | `"default"` |

Also takes every [Radix Toggle.Root](https://www.radix-ui.com/primitives/docs/components/toggle#root) prop.

## SLDS mapping

`Toggle` is SLDS's stateful icon button, and a toggle with text is its dual-stateful button (`slds-button_dual-stateful`).

Known gaps:

- A bare (`variant="default"`) toggle with text pads like a button. SLDS's base stateful button has no padding; ours keeps it so the pressed fill has room.

## Accessibility

- Name an icon-only toggle with `aria-label`. Keep both the visible label and the name the same when it's pressed; `aria-pressed` carries the state.
- A disabled toggle can't take focus or show a tooltip. Say why in nearby text.

## Motion

- In Cosmos, hovering lifts an `outline` toggle 1.5px and a pressed toggle 2px, each with an edge shadow, over 150ms. Lightning Blue sets the lift and the shadow to none.
- The lift runs with reduced motion too.

## Responsive behavior

- It keeps its height and doesn't shrink in a flex row, and text doesn't wrap. Let a toolbar wrap with `flex-wrap`.

## Example code

### List view display

Split view, Show charts and Show filters as `variant="outline"` icon toggles, each named by `aria-label`, Show filters pressed.

```tsx
import { ChartPieIcon, Columns2Icon, FilterIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleDefault() {
  return (
    <div className="flex items-center gap-1">
      <Toggle variant="outline" aria-label="Split view">
        <Columns2Icon />
      </Toggle>
      <Toggle variant="outline" aria-label="Show charts">
        <ChartPieIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Show filters" defaultPressed>
        <FilterIcon />
      </Toggle>
    </div>
  )
}
```

### Bare

Icon toggles with no border, the `default` variant, as in a note's formatting toolbar, Bold pressed.

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleBare() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" defaultPressed>
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
    </div>
  )
}
```

### Text

Toggles with labels: one off, one pressed, and a bare text toggle.

```tsx
import { StarIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleText() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline">
        <StarIcon />
        Favorite
      </Toggle>
      <Toggle variant="outline" defaultPressed>
        <StarIcon />
        Favorite
      </Toggle>
      <Toggle>Show archived</Toggle>
    </div>
  )
}
```

### Sizes

Small, default and large, set with `size` on `Toggle`.

```tsx
import { BoldIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="outline" size="sm" aria-label="Bold, small">
        <BoldIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle variant="outline" size="lg" aria-label="Bold, large">
        <BoldIcon />
      </Toggle>
    </div>
  )
}
```

### Disabled

Disabled toggles, pressed and not, in both variants.

```tsx
import { BoldIcon, ItalicIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export default function ToggleDisabled() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" disabled defaultPressed>
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic" disabled>
        <ItalicIcon />
      </Toggle>
      <Toggle
        variant="outline"
        aria-label="Bold, outline"
        disabled
        defaultPressed
      >
        <BoldIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Italic, outline" disabled>
        <ItalicIcon />
      </Toggle>
    </div>
  )
}
```
