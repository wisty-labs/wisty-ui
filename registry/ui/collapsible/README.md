# Collapsible

This page shows the Radix version. Base UI projects get [registry/base/ui/collapsible.tsx](../../base/ui/collapsible.tsx), and [ui.wisty.ai/collapsible](https://ui.wisty.ai/collapsible) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows and hides a block of content from a trigger, like a record's details.

```bash
npx shadcn@latest add @wisty/collapsible
```

## Examples

- `default` (Account details): A `CollapsibleTrigger` styled with `buttonVariants` shows the address and owner rows held in `CollapsibleContent`, closed at first.

## When to use

- A block of content is useful but not always needed, like an account's address and owner under its summary, as the Account details example shows.
- People show and hide each section on its own, and opening one leaves the others as they are.
- A section of a form people fold away, like advanced options.
- You want an expandable section: a gray title bar with a chevron above content that folds away.

## When not to use

- Several sections where opening one closes the others. Use Accordion.
- Content that switches between peers, like related lists. Use Tabs.
- A short hint or extra detail on demand. Use Popover or Tooltip.

## Usage

```text
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```

`Collapsible` has no styles of its own. Style the trigger as a button with `buttonVariants()`, as the Account details example does, or build an expandable section: the trigger goes in a heading, and the chevron turns on the trigger's `aria-[expanded=false]`.

```tsx
import { ChevronDownIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
```

```tsx
<Collapsible defaultOpen>
  <h2 className="my-2 text-(length:--section-title-size) leading-[1.875rem]">
    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-(--radius-2) border border-transparent bg-muted px-2 text-start font-(--section-title-weight) text-foreground outline-none focus-visible:shadow-(--shadow-focus) aria-[expanded=false]:[&>svg]:-rotate-90 [&>svg]:size-3.5 [&>svg]:shrink-0">
      <ChevronDownIcon />
      System information
    </CollapsibleTrigger>
  </h2>
  <CollapsibleContent className="pt-2 text-muted-foreground">
    {/* section body */}
  </CollapsibleContent>
</Collapsible>
```

Closed content leaves the page, and with it any form state inside. In Base UI projects, pass `keepMounted` to `CollapsibleContent` to keep it there hidden, or `hiddenUntilFound` so find-in-page can find and open it. In Radix projects, `forceMount` keeps it there but also keeps it showing, so hide it yourself with `data-[state=closed]:hidden`.

## Rules

- Keep the chevron inside the trigger, so it turns with the trigger's `aria-expanded`.

## API reference

| Part | Built on |
| --- | --- |
| `Collapsible` | [Radix Collapsible.Root](https://www.radix-ui.com/primitives/docs/components/collapsible#root) |
| `CollapsibleTrigger` | [Radix Collapsible.Trigger](https://www.radix-ui.com/primitives/docs/components/collapsible#trigger) |
| `CollapsibleContent` | [Radix Collapsible.Content](https://www.radix-ui.com/primitives/docs/components/collapsible#content) |

## SLDS mapping

`Collapsible` has no SLDS classes. The section in Usage builds SLDS's expandable section (`slds-section`): the heading is `slds-section__title`, the trigger `slds-section__title-action`, the chevron `slds-section__title-action-icon`, and the content `slds-section__content`. The Account details example uses a bare icon button (`slds-button_icon-container`) and bordered rows (`slds-box`).

Known gaps:

- The section's chevron is lucide's `ChevronDownIcon`. SLDS uses its `utility:switch` caret.

## Accessibility

- Put a section's trigger inside a heading, at the level that follows the page's headings, so the section shows up in the outline.
- An icon-only trigger needs an `aria-label` that says what it shows. Keep the chevron decorative.

## Example code

### Account details

A `CollapsibleTrigger` styled with `buttonVariants` shows the address and owner rows held in `CollapsibleContent`, closed at first.

```tsx
import { ChevronsUpDownIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function CollapsibleDefault() {
  return (
    <Collapsible className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold">Acme Corporation</p>
        <CollapsibleTrigger
          aria-label="Show account details"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ChevronsUpDownIcon />
        </CollapsibleTrigger>
      </div>
      <div className="rounded-(--radius-2) border px-4 py-2">
        Customer · Manufacturing
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-(--radius-2) border px-4 py-2">
          1 Market St, San Francisco
        </div>
        <div className="rounded-(--radius-2) border px-4 py-2">
          Owned by Jordan Lee
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```
