# Popover

This page shows the Radix version. Base UI projects get [registry/base/ui/popover.tsx](../../base/ui/popover.tsx), and [ui.wisty.ai/popover](https://ui.wisty.ai/popover) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows details or a short form in a panel anchored to a trigger. The page stays usable behind it.

```bash
npx shadcn@latest add @wisty/popover
```

## Examples

- `default` (Rename account): A short form after the `PopoverHeader`, its edge on the trigger's with `align="start"` on `PopoverContent`, and focus moves into the field.

## When to use

- To show more about something on the page without leaving it, like the owner of an account or the details behind a status.
- For a short form next to the thing it changes, like renaming a record in place.
- When the content has links, fields or buttons, so a tooltip won't do, and people should still use the rest of the page while it's open.

## When not to use

- The text is a one-line hint about a control. Use Tooltip.
- A preview of a linked record, opened on hover. Use Hover card.
- People pick one action or option from a list. Use Dropdown menu, or Select for a form value.
- The task is long, has several steps, or must be finished or cancelled before anything else. Use Dialog.
- The content should stay on screen while people work elsewhere. Put it in the page, a Card or a panel.

## Usage

```text
Popover
├── PopoverTrigger
└── PopoverContent
    └── PopoverHeader
        ├── PopoverTitle
        └── PopoverDescription
```

```tsx
import { useId } from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function OwnerDetails() {
  const id = useId()

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
        Account owner
      </PopoverTrigger>
      <PopoverContent aria-labelledby={`${id}-title`}>
        <PopoverHeader>
          <PopoverTitle id={`${id}-title`}>Sarah Chen</PopoverTitle>
          <PopoverDescription>Sales Director, Austin</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
```

There's no close part. To close the popover after Save, control it: pass `open` and `onOpenChange` from state to `Popover`, and call `setOpen(false)` once the save succeeds.

## Rules

- Never nest a Button inside `PopoverTrigger`. That's a button in a button; style the trigger with `buttonVariants()` instead.
- Put the heading and text in `PopoverHeader`, `PopoverTitle` and `PopoverDescription`, then fields and buttons after the header.
- Don't add borders, shadows, padding or colors to `PopoverContent`. They come from the theme.
- Don't add a close button unless the content needs one. Escape and an outside click already close it.
- If you add open or close animation through `className`, put it behind `motion-safe:`.

## API reference

| Part | Built on |
| --- | --- |
| `Popover` | [Radix Popover.Root](https://www.radix-ui.com/primitives/docs/components/popover#root) |
| `PopoverTrigger` | [Radix Popover.Trigger](https://www.radix-ui.com/primitives/docs/components/popover#trigger) |
| `PopoverContent` | [Radix Popover.Content](https://www.radix-ui.com/primitives/docs/components/popover#content) |
| `PopoverAnchor` | [Radix Popover.Anchor](https://www.radix-ui.com/primitives/docs/components/popover#anchor) |
| `PopoverHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `PopoverTitle` | [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements) |
| `PopoverDescription` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |

### PopoverContent

| Prop | Type | Default |
| --- | --- | --- |
| `align`? | `"center" \| "end" \| "start"` | `"center"` |
| `sideOffset`? | `number` | `4` |

## SLDS mapping

SLDS marks up a popover as a `section.slds-popover` with a `div.slds-popover__body`, and puts the header inside the body.

- `PopoverContent` is `slds-popover` and `slds-popover__body` in one element.
- `PopoverHeader` is `slds-popover__header` as SLDS places it inside the body. It also holds the description.
- `PopoverTitle` is the header's `h2.slds-text-heading_small`.
- `PopoverDescription` is body text.
- `PopoverTrigger` has no SLDS class of its own. Style it as `slds-button_neutral` with `buttonVariants({ variant: "outline" })`.

Known gaps:

- No nubbin. SLDS popovers usually point at their trigger with one (`slds-nubbin_*`).
- No close button (`slds-popover__close`). Escape, an outside click or the trigger closes it.
- No footer part (`slds-popover__footer`), and no error, warning, walkthrough or feature variants.
- SLDS's small body (`slds-popover__body_small`, which scrolls past 15rem) isn't exposed.

## Keyboard interactions

| Keys   | Action                                                                                                                                                     |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Escape | Closes the popover and moves focus back to the trigger. With a Combobox open inside, the first Escape closes only its list.                                |
| Tab    | Past the last control, loops back to the first in Radix projects. In Base UI projects it moves on to whatever follows the trigger, and the popover closes. |

When it opens, focus moves to the first control inside.

## Accessibility

- In Radix projects, name the popover: give `PopoverTitle` an `id` and pass it to `PopoverContent` as `aria-labelledby`. Nothing else links them, and the title renders as a `div`, not a heading. In Base UI projects `PopoverTitle` names the popover already.
- Give the trigger a visible label that says what opens, like "Account owner", not "More".
- Clicking outside closes the popover and leaves focus where you clicked, not on the trigger.

## Responsive behavior

- The popover is 20rem wide. Pass a width class to `PopoverContent` to change it.
- On very narrow screens a 20rem popover can cover most of the page. Consider Dialog or Sheet there.

## Example code

### Rename account

A short form after the `PopoverHeader`, its edge on the trigger's with `align="start"` on `PopoverContent`, and focus moves into the field.

```tsx
import { useId } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PopoverDefault() {
  const id = useId()

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
        Rename
      </PopoverTrigger>
      <PopoverContent align="start" aria-labelledby={`${id}-title`}>
        <PopoverHeader>
          <PopoverTitle id={`${id}-title`}>Rename account</PopoverTitle>
          <PopoverDescription>
            The new name shows everywhere the account appears.
          </PopoverDescription>
        </PopoverHeader>
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>Account Name</FieldLabel>
          <Input id={`${id}-name`} defaultValue="Acme" maxLength={80} />
        </Field>
        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```
