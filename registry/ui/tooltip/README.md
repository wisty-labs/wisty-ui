# Tooltip

This page shows the Radix version. Base UI projects get [registry/base/ui/tooltip.tsx](../../base/ui/tooltip.tsx), and [ui.wisty.ai/tooltip](https://ui.wisty.ai/tooltip) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a short hint about a control while it has hover or keyboard focus.

```bash
npx shadcn@latest add @wisty/tooltip
```

## Examples

- `default` (Field-level help): An info button shows a field's help text above it, on hover or keyboard focus.
- `icon-button` (On an icon button): Icon buttons carry their name in `aria-label`, and the tooltip shows the same words to people who can see the icon.
- `sides` (Sides): Tooltips on each side of their buttons, set with `side` on `TooltipContent`.

## When to use

- A control needs a short hint in plain text, like what an icon button does or what a field expects.
- Field-level help: an info button beside a label, as Salesforce shows on record forms.

## When not to use

- The content has links, buttons or fields, or more than a sentence or two. Use Popover, or Hover Card for a preview.
- The information is needed to finish the task. Put it on the page, in the label or in a description below the field.
- The control has no name of its own. Give it a visible label or an `aria-label` first. A tooltip isn't a name.
- On touch screens, where there's no hover. Don't hide anything people need behind a tooltip.

## Usage

```text
TooltipProvider
└── Tooltip
    ├── TooltipTrigger
    └── TooltipContent
```

Put one `TooltipProvider` near the root of the app, around every `Tooltip`. In Radix projects a tooltip throws without it. In Base UI projects it works without one, but waits its own delay before opening.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
```

```tsx
<Tooltip>
  <TooltipTrigger className={buttonVariants({ variant: "outline" })}>
    Freeze column
  </TooltipTrigger>
  <TooltipContent>Keeps this column in view as you scroll.</TooltipContent>
</Tooltip>
```

## Rules

- Never nest a Button inside `TooltipTrigger`. That's a button in a button; style the trigger with `buttonVariants()` instead.
- Keep tooltip text short and plain: no links, buttons or headings.
- Don't style `TooltipContent`'s colors, padding or nubbin. They come from the theme.

## API reference

| Part | Built on |
| --- | --- |
| `TooltipProvider` | [Radix Tooltip.Provider](https://www.radix-ui.com/primitives/docs/components/tooltip#provider) |
| `Tooltip` | [Radix Tooltip.Root](https://www.radix-ui.com/primitives/docs/components/tooltip#root) |
| `TooltipTrigger` | [Radix Tooltip.Trigger](https://www.radix-ui.com/primitives/docs/components/tooltip#trigger) |
| `TooltipContent` | [Radix Tooltip.Content](https://www.radix-ui.com/primitives/docs/components/tooltip#content) |

### TooltipProvider

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `delayDuration`? | `number` | `0` | The duration from when the pointer enters the trigger until the tooltip gets opened. |

### TooltipContent

| Prop | Type | Default |
| --- | --- | --- |
| `sideOffset`? | `number` | `0` |

## SLDS mapping

- `TooltipContent` is `slds-popover slds-popover_tooltip` and its `slds-popover__body` in one element.
- Its arrow is SLDS's nubbin (`slds-nubbin_*`), centered on the edge that faces the trigger.
- `TooltipTrigger` has no SLDS class of its own.

Known gaps:

- No corner nubbins (`slds-nubbin_bottom-left` and others), and no error or warning tooltips.
- The nubbin's shadow is SLDS's bottom-nubbin shadow, turned to point outward on every side. SLDS's own shadows for the other sides differ slightly.

## Accessibility

- Give every trigger a name of its own: its text, or an `aria-label` on an icon button, as the On an icon button example does. In Base UI projects nothing links the trigger to its tooltip, so screen readers don't read the tooltip at all.
- Don't put anything in a tooltip that people can't get another way.
- When the tooltip repeats an icon button's `aria-label`, some screen readers read it twice, once as the name and once as the description.

## Motion

- The tooltip fades over 0.1s in every theme. In Base UI projects it fades out too; in Radix projects it disappears at once. The fade only changes opacity, so it stays on with reduced motion.

## Example code

### Field-level help

An info button shows a field's help text above it, on hover or keyboard focus.

```tsx
import { InfoIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipDefault() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          aria-label="Help for Annual Revenue"
          className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
        >
          <InfoIcon />
        </TooltipTrigger>
        <TooltipContent>
          The account&apos;s revenue for its last fiscal year, in the
          account&apos;s currency.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### On an icon button

Icon buttons carry their name in `aria-label`, and the tooltip shows the same words to people who can see the icon.

```tsx
import { FilterIcon, RefreshCwIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipIconButton() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger
            aria-label="Refresh"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <RefreshCwIcon />
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            aria-label="Show filters"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <FilterIcon />
          </TooltipTrigger>
          <TooltipContent>Show filters</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
```

### Sides

Tooltips on each side of their buttons, set with `side` on `TooltipContent`.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sides = ["top", "right", "bottom", "left"] as const

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 place-items-center gap-x-36 gap-y-8">
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger className={buttonVariants({ variant: "outline" })}>
              <span className="capitalize">{side}</span>
            </TooltipTrigger>
            <TooltipContent side={side}>Opens on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
```
