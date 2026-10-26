# Sheet

This page shows the Radix version. Base UI projects get [registry/base/ui/sheet.tsx](../../base/ui/sheet.tsx), and [ui.wisty.ai/sheet](https://ui.wisty.ai/sheet) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Slides a panel in from the edge of the screen for a task beside the page.

```bash
npx shadcn@latest add @wisty/sheet
```

## Examples

- `default` (List view filters): An icon trigger opens opportunity filters on the right, with Cancel as a `SheetClose` and Apply in `SheetFooter`.
- `sides` (Sides): A panel from each side of the screen, set with `side` on `SheetContent`.

## When to use

- To look at or edit a record's details without leaving the page, like a contact from a list.
- For filters or settings that act on the page underneath, as the List view filters example shows.
- For a short form that's easier to fill in beside the content than in a centered dialog.

## When not to use

- For a question people must answer before going on. Use Alert dialog.
- For a short task that needs no context from the page. Use Dialog.
- For a few details next to one element. Use Popover or Hover card.
- For navigation that stays on screen. Use Sidebar.
- For a panel people work alongside. The sheet is modal: the page behind it can't take focus while it's open.

## Usage

```text
Sheet
├── SheetTrigger
└── SheetContent
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    └── SheetFooter
        └── SheetClose
```

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

```tsx
<Sheet>
  <SheetTrigger className={buttonVariants({ variant: "outline" })}>
    Details
  </SheetTrigger>
  <SheetContent aria-describedby={undefined}>
    <SheetHeader>
      <SheetTitle>Details</SheetTitle>
    </SheetHeader>
    <div className="px-3">The details go here.</div>
  </SheetContent>
</Sheet>
```

Put the body between the header and the footer, padded with `px-3` so it lines up with the header. `SheetContent` draws a close button in its top corner, level with the title; `showCloseButton={false}` leaves it out.

A `SheetClose` closes the sheet on its own, so use it for Cancel. To close after a button has done its work, like Apply, pass `open` and `onOpenChange` from state to `Sheet` and set it closed in the handler.

## Rules

- Prefer `side="right"` for details and editing, and `side="left"` for navigation or filters. Top and bottom have no Salesforce counterpart, so use them sparingly.
- Put Cancel before the main action in `SheetFooter`.
- Don't restyle the panel's background, shadow or corners. They come from the theme tokens.

## API reference

| Part | Built on |
| --- | --- |
| `Sheet` | [Radix Dialog.Root](https://www.radix-ui.com/primitives/docs/components/dialog#root) |
| `SheetTrigger` | [Radix Dialog.Trigger](https://www.radix-ui.com/primitives/docs/components/dialog#trigger) |
| `SheetClose` | [Radix Dialog.Close](https://www.radix-ui.com/primitives/docs/components/dialog#close) |
| `SheetContent` | [Radix Dialog.Content](https://www.radix-ui.com/primitives/docs/components/dialog#content) |
| `SheetHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SheetFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SheetTitle` | [Radix Dialog.Title](https://www.radix-ui.com/primitives/docs/components/dialog#title) |
| `SheetDescription` | [Radix Dialog.Description](https://www.radix-ui.com/primitives/docs/components/dialog#description) |

### SheetContent

| Prop | Type | Default |
| --- | --- | --- |
| `side`? | `"top" \| "right" \| "bottom" \| "left"` | `"right"` |
| `showCloseButton`? | `boolean` | `true` |

## SLDS mapping

SLDS has no sheet. The sheet is its side panel, `slds-panel slds-panel_docked slds-size_medium`, floated over the page.

- The backdrop is `slds-backdrop`, as in Dialog.
- `SheetHeader` is `slds-panel__header`, `SheetTitle` is `slds-panel__header-title` and the close button is `slds-panel__close`.
- The body is `slds-panel__body`, and `px-3` matches its padding.
- `SheetFooter` is `slds-panel__actions`.

Known gaps:

- SLDS docks its panels inside the page layout, beside the content, with no backdrop. The sheet floats over the page and dims it. A docked panel that reflows the page is your layout.
- `SheetDescription` has no SLDS counterpart.
- Icons are lucide's, not SLDS's utility icons.

## Accessibility

- Always include a `SheetTitle`; it's the sheet's name. Without a `SheetDescription`, pass `aria-describedby={undefined}` to `SheetContent`, or the console may warn.
- An icon-only trigger needs an `aria-label`, as the List view filters example shows.
- With `showCloseButton={false}`, give the sheet another way out, like a Cancel that's a `SheetClose`.
- With a combobox open inside, Escape closes only its list, and the next Escape closes the sheet. A command's search field isn't an open list, so Escape there closes the sheet at once.

## Motion

- The sheet slides in from its side and the backdrop fades in, in every theme.
- With reduced motion the sheet appears in place. The backdrop still fades.

## Responsive behavior

- Side sheets are 3/4 of the screen wide, up to 20rem on screens 640px and wider. For a wider one, pass a width through `className`, like `className="sm:max-w-120"`.
- Top and bottom sheets are as wide as the screen and as tall as their content.
- The sheet scrolls when its content is taller than the screen, and footer buttons wrap when they don't fit.

## Performance

- The content mounts only while the sheet is open, in a portal on `document.body`. Styles scoped to an ancestor don't reach it, and its state resets on close.

## Example code

### List view filters

An icon trigger opens opportunity filters on the right, with Cancel as a `SheetClose` and Apply in `SheetFooter`.

```tsx
import { useId } from "react"
import { FilterIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const stages = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
]

export default function SheetDefault() {
  const id = useId()

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Show filters"
        className={buttonVariants({ variant: "outline", size: "icon" })}
      >
        <FilterIcon />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Applies to All Opportunities.</SheetDescription>
        </SheetHeader>
        <FieldGroup className="px-3">
          <Field>
            <FieldLabel htmlFor={`${id}-account`}>Account Name</FieldLabel>
            <Input id={`${id}-account`} placeholder="Any account" />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-stage`}>Stage</FieldLabel>
            <NativeSelect id={`${id}-stage`} defaultValue="Prospecting">
              <NativeSelectOption value="">Any stage</NativeSelectOption>
              {stages.map((stage) => (
                <NativeSelectOption key={stage} value={stage}>
                  {stage}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-amount`}>Amount at least</FieldLabel>
            <Input
              id={`${id}-amount`}
              inputMode="decimal"
              defaultValue="50,000"
            />
          </Field>
        </FieldGroup>
        <SheetFooter>
          <SheetClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </SheetClose>
          <Button>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

### Sides

A panel from each side of the screen, set with `side` on `SheetContent`.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const sides = ["top", "right", "bottom", "left"] as const

export default function SheetSides() {
  return (
    <div className="flex flex-wrap gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger className={buttonVariants({ variant: "outline" })}>
            Open {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Activity</SheetTitle>
              <SheetDescription>
                Upcoming tasks and events for Acme.
              </SheetDescription>
            </SheetHeader>
            <p className="px-3 pb-3">No upcoming activity.</p>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
```
