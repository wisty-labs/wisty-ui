# Toggle group

This page shows the Radix version. Base UI projects get [registry/base/ui/toggle-group.tsx](../../base/ui/toggle-group.tsx), and [ui.wisty.ai/toggle-group](https://ui.wisty.ai/toggle-group) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Joins toggles in a row, one or several pressed, like Day, Week and Month.

```bash
npx shadcn@latest add @wisty/toggle-group
```

## Examples

- `default` (Calendar view): Day, Week and Month as `variant="outline"` items joined in one row, one pressed at a time, Week pressed.
- `multiple` (Multiple): Weekdays where several can be pressed, set with `type="multiple"` (`multiple` in Base UI projects), Mon and Wed pressed.
- `icons` (Icons): Icon-only `variant="outline"` formatting toggles, joined and each named with `aria-label`, Bold pressed.
- `spacing` (Spacing): Bare icon toggles 4px apart, set with `spacing={1}` on `ToggleGroup`, Bold pressed.
- `like-dislike` (Helpful or not): A yes or no question as two `variant="outline"` items apart by `spacing={2}`, Helpful pressed, its thumbs swappable for smiles or a check and an X.
- `disabled` (Disabled): A single-choice group set with `disabled` on `ToggleGroup`, Week pressed.

## When to use

- To pick one of a few related options in a compact control, like a calendar's Day, Week and Month.
- To turn several related options on and off, like text formatting or the days a meeting repeats.
- The options are short labels or icons that fit on one line.
- In place of Lightning's radio group with `type="button"`.

## When not to use

- One option turns on or off on its own. Use Toggle.
- The choice is a form field with a label and validation. Use Radio Group or Checkbox.
- The options switch between panels of content. Use Tabs.
- The buttons run actions and don't stay pressed. Use Button Group.
- There are more than about five options, or long labels. Use Select.

## Usage

The two bases take different props for the choice mode and the value. In Radix projects `type` is required, `"single"` or `"multiple"`, and a single-choice value is a string. In Base UI projects a group is single-choice unless it takes `multiple`, and the value is always an array.

```tsx
import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ListDisplayPicker() {
  const [display, setDisplay] = useState("table")

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={display}
      onValueChange={(next) => next && setDisplay(next)}
      aria-label="Display as"
    >
      <ToggleGroupItem value="table">Table</ToggleGroupItem>
      <ToggleGroupItem value="kanban">Kanban</ToggleGroupItem>
      <ToggleGroupItem value="split">Split view</ToggleGroupItem>
    </ToggleGroup>
  )
}
```

In Base UI projects, leave out `type` and pass `value={[display]}` with `onValueChange={(next) => next[0] && setDisplay(next[0])}`. Pressing the pressed item releases it, so `onValueChange` gets `""` in Radix projects and `[]` in Base UI projects. The checks keep one display pressed.

`spacing` on `ToggleGroup` sets the gap between items, in the same steps as `gap-*` classes: `spacing={1}` is 4px. At 0, the default, the items join into one control.

## Rules

- Never give `aria-label` to an item with visible text. The label decides whether the item draws as a labelled segment or an icon button, with its padding and borders.
- Use `variant="outline"` for joined segments. For a row of separate icon toggles, use bare items with `spacing`, as the Spacing example shows.
- Never override item colors, radius or height with utility classes. The tokens carry each theme.

## API reference

| Part | Built on |
| --- | --- |
| `ToggleGroup` | [Radix ToggleGroup.Root](https://www.radix-ui.com/primitives/docs/components/toggle-group#root) |
| `ToggleGroupItem` | [Radix ToggleGroup.Item](https://www.radix-ui.com/primitives/docs/components/toggle-group#item) |

### ToggleGroup

| Prop | Type | Default |
| --- | --- | --- |
| `orientation`? | `"horizontal" \| "vertical"` | `"horizontal"` |
| `variant`? | `"default" \| "outline"` |  |
| `size`? | `"default" \| "sm" \| "lg"` |  |
| `spacing`? | `number` | `0` |

### ToggleGroupItem

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "outline"` | `"default"` |
| `size`? | `"default" \| "sm" \| "lg"` | `"default"` |

## SLDS mapping

`ToggleGroup` is SLDS's radio button group for one choice and its checkbox button group for several, and each `ToggleGroupItem` is a Toggle. An item with text is the group's label (`slds-radio_button__label` or `slds-checkbox_button__label`). An icon-only item, with `aria-label`, is a button in `slds-button-group-list`, as in SLDS's rich text toolbar. With `spacing` above 0, items are separate Toggles.

Known gaps:

- SLDS's radio and checkbox button groups are a little taller than its other controls. Ours match Button's height, so they line up with buttons and inputs.
- SLDS has no vertical button group. A vertical group mirrors the horizontal one.

## Keyboard interactions

| Keys                    | Action                                                      |
| ----------------------- | ----------------------------------------------------------- |
| Right Arrow, Left Arrow | Moves to the next or previous item. Focus doesn't press it. |
| Down Arrow, Up Arrow    | The same, in a group with `orientation="vertical"`.         |
| Space, Enter            | Presses or releases the focused item.                       |

## Accessibility

- Name the group with `aria-label`, and each icon-only item with `aria-label`. Keep the names the same when pressed; the pressed state carries the change.

## Motion

- In Cosmos, outline and pressed items lift on hover as Toggle's do, over 150ms. Lightning Blue sets the lift to none.
- The lift runs with reduced motion too.

## Responsive behavior

- The group is as wide as its items and doesn't wrap, and labels stay on one line. Keep it to a few short items, or use Select on narrow screens.

## Example code

### Calendar view

Day, Week and Month as `variant="outline"` items joined in one row, one pressed at a time, Week pressed.

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupDefault() {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      defaultValue="week"
      aria-label="Calendar view"
    >
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}
```

### Multiple

Weekdays where several can be pressed, set with `type="multiple"` (`multiple` in Base UI projects), Mon and Wed pressed.

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      defaultValue={["Mon", "Wed"]}
      aria-label="Repeat on"
    >
      {days.map((day) => (
        <ToggleGroupItem key={day} value={day}>
          {day}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
```

### Icons

Icon-only `variant="outline"` formatting toggles, joined and each named with `aria-label`, Bold pressed.

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupIcons() {
  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      defaultValue={["bold"]}
      aria-label="Text formatting"
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
```

### Spacing

Bare icon toggles 4px apart, set with `spacing={1}` on `ToggleGroup`, Bold pressed.

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupSpacing() {
  return (
    <ToggleGroup
      type="multiple"
      spacing={1}
      defaultValue={["bold"]}
      aria-label="Text formatting"
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
```

### Helpful or not

A yes or no question as two `variant="outline"` items apart by `spacing={2}`, Helpful pressed, its thumbs swappable for smiles or a check and an X.

```tsx
import { useId } from "react"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupLikeDislike() {
  const id = useId()

  return (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Was this article helpful?
      </FieldLegend>
      <ToggleGroup
        type="single"
        variant="outline"
        spacing={2}
        defaultValue="helpful"
        aria-labelledby={`${id}-legend`}
      >
        <ToggleGroupItem value="helpful">
          <ThumbsUpIcon />
          Helpful
        </ToggleGroupItem>
        <ToggleGroupItem value="not-helpful">
          <ThumbsDownIcon />
          Not helpful
        </ToggleGroupItem>
      </ToggleGroup>
    </FieldSet>
  )
}
```

### Disabled

A single-choice group set with `disabled` on `ToggleGroup`, Week pressed.

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ToggleGroupDisabled() {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      defaultValue="week"
      disabled
      aria-label="Calendar view"
    >
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}
```
