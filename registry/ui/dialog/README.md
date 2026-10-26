# Dialog

This page shows the Radix version. Base UI projects get [registry/base/ui/dialog.tsx](../../base/ui/dialog.tsx), and [ui.wisty.ai/dialog](https://ui.wisty.ai/dialog) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Opens a window over the page for a short task or a message that needs an answer.

```bash
npx shadcn@latest add @wisty/dialog
```

## Examples

- `default` (Edit record): Edit opens the account in a modal: fields under a `DialogTitle` and `DialogDescription`, with a `DialogClose` Cancel and Save in `DialogFooter`.
- `message` (Message): A short message with a title and text ending in a link, and a Close button added by `showCloseButton` on `DialogFooter`.
- `long-content` (Long content): A wider modal, sized like SLDS's medium modal with `className` on `DialogContent`, whose body scrolls while the header and footer stay in view.

## When to use

- A short task that needs people's full attention before they go back to the page, like editing a few fields of a record.
- A message people must read and close, like a notice about their trial.
- A choice that stops the current flow until it's made.

## When not to use

- People confirm a destructive action, like deleting a record. Use Alert dialog.
- The content is long or the task has many steps. Use a full page.
- People should keep the page in view while they work. Use Popover for a field or two, or Sheet for a panel beside the page.
- The message needs no answer, like a saved record. Use Sonner.

## Usage

```text
Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter
        └── DialogClose
```

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

```tsx
<Dialog>
  <DialogTrigger className={buttonVariants({ variant: "outline" })}>
    Show details
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Acme</DialogTitle>
      <DialogDescription>Customer since 2019.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

`DialogContent` has a close button just above its top end corner; `showCloseButton={false}` removes it. `showCloseButton` on `DialogFooter` adds a Close button to the footer, as the Message example shows.

To close the dialog when a save finishes, control it. Until `setOpen(false)` runs, the dialog stays open, so an error can show inside it.

```tsx
import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EditAccount({ onSave }: { onSave: () => Promise<void> }) {
  const [open, setOpen] = useState(false)

  async function save() {
    await onSave()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Edit
      </DialogTrigger>
      <DialogContent>
        {/* header and fields */}
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DialogClose>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Rules

- Put Cancel before the primary action in `DialogFooter`, and make Cancel a `DialogClose`.
- Style triggers and closes with `className={buttonVariants({ variant: "outline" })}`.
- Don't restyle the dialog's corners, colors or shadow. They come from the theme tokens.
- Don't put `overflow` classes on `DialogContent`. The close button sits outside the box and would be clipped.

## API reference

| Part | Built on |
| --- | --- |
| `Dialog` | [Radix Dialog.Root](https://www.radix-ui.com/primitives/docs/components/dialog#root) |
| `DialogTrigger` | [Radix Dialog.Trigger](https://www.radix-ui.com/primitives/docs/components/dialog#trigger) |
| `DialogPortal` | [Radix Dialog.Portal](https://www.radix-ui.com/primitives/docs/components/dialog#portal) |
| `DialogClose` | [Radix Dialog.Close](https://www.radix-ui.com/primitives/docs/components/dialog#close) |
| `DialogOverlay` | [Radix Dialog.Overlay](https://www.radix-ui.com/primitives/docs/components/dialog#overlay) |
| `DialogContent` | [Radix Dialog.Content](https://www.radix-ui.com/primitives/docs/components/dialog#content) |
| `DialogHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `DialogFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `DialogTitle` | [Radix Dialog.Title](https://www.radix-ui.com/primitives/docs/components/dialog#title) |
| `DialogDescription` | [Radix Dialog.Description](https://www.radix-ui.com/primitives/docs/components/dialog#description) |

### DialogContent

| Prop | Type | Default |
| --- | --- | --- |
| `showCloseButton`? | `boolean` | `true` |

### DialogFooter

| Prop | Type | Default |
| --- | --- | --- |
| `showCloseButton`? | `boolean` | `false` |

## SLDS mapping

- `DialogOverlay` is `slds-backdrop`.
- `DialogContent` is the modal's box, `slds-modal__container`. Its close button is `slds-modal__close`.
- `DialogHeader` is `slds-modal__header`, `DialogTitle` is `slds-modal__title`, and `DialogDescription` is the header's tagline. A link in it takes the link color, underlined so it doesn't rely on color alone.
- Anything between the header and the footer is `slds-modal__content`.
- `DialogFooter` is `slds-modal__footer`.

Known gaps:

- SLDS's sizes aren't props. Pass a width through `className`, as Long content does:
  - `slds-modal_small`: `md:w-3/5 md:min-w-160 sm:max-w-[52rem]`
  - `slds-modal_medium`: `md:w-[70%] md:min-w-160 sm:max-w-300`
  - `slds-modal_large`: `md:w-[90%] md:min-w-160 sm:max-w-none`
- The body doesn't scroll on its own, as `slds-modal__content` does. Wrap it in a `div` with `-mx-4 -my-1 max-h-[60vh] overflow-y-auto px-4 py-1`, as Long content does, so the header and footer stay in view and focus rings aren't clipped.
- Icons are lucide's, not SLDS's utility icons.

## Accessibility

- Always include a `DialogTitle`: it names the dialog. With no `DialogDescription`, pass `aria-describedby={undefined}` to `DialogContent` so the console doesn't warn.
- A scrolling body needs a way in from the keyboard. Give its `div` `role="region"`, an `aria-label` and `tabIndex={0}`, as Long content does.
- Opening the dialog focuses its first element you can tab to, but the bases differ on links. In Radix projects a link is never focused first, so a link in the description is passed over for the next control; in Base UI projects the link takes focus.
- With a Combobox list open inside, the first Escape closes only the list. A Command's search field isn't an open list, so Escape there closes the dialog.

## Motion

- The backdrop and the box fade in, in every theme. They only change opacity, so they still run with reduced motion.

## Responsive behavior

- On small screens the dialog fills the width less a margin. From the `md` breakpoint it's half the screen, within a minimum and a maximum width.
- The dialog grows with its content and doesn't scroll, so a tall body runs off the screen. Wrap the body in a scrolling `div`, as Long content does.
- Long words in the title break, and footer buttons wrap onto a second line when they don't fit.

## Example code

### Edit record

Edit opens the account in a modal: fields under a `DialogTitle` and `DialogDescription`, with a `DialogClose` Cancel and Save in `DialogFooter`.

```tsx
import { useId } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function DialogDefault() {
  const id = useId()

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Acme</DialogTitle>
          <DialogDescription>
            Changes are saved to the account record.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`${id}-name`}>Account Name</FieldLabel>
            <Input id={`${id}-name`} defaultValue="Acme" />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-phone`}>Phone</FieldLabel>
            <Input
              id={`${id}-phone`}
              type="tel"
              defaultValue="(415) 555-0100"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-website`}>Website</FieldLabel>
            <Input
              id={`${id}-website`}
              type="url"
              defaultValue="https://acme.example"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Message

A short message with a title and text ending in a link, and a Close button added by `showCloseButton` on `DialogFooter`.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DialogMessage() {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Show trial status
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your trial ends in 3 days</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Upgrade before Friday to keep your records, reports and dashboards.
          After the trial ends, your data stays read-only for 30 days.{" "}
          <a href="#">Compare editions</a>
        </DialogDescription>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
```

### Long content

A wider modal, sized like SLDS's medium modal with `className` on `DialogContent`, whose body scrolls while the header and footer stay in view.

```tsx
import { useId } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

const stages = [
  "Prospecting",
  "Qualification",
  "Needs Analysis",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
]

export default function DialogLongContent() {
  const id = useId()

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        New Opportunity
      </DialogTrigger>
      <DialogContent className="sm:max-w-300 md:w-[70%] md:min-w-160">
        <DialogHeader>
          <DialogTitle>New Opportunity</DialogTitle>
          <DialogDescription>For Acme, owned by Sarah Chen.</DialogDescription>
        </DialogHeader>
        <div
          role="region"
          aria-label="Opportunity details"
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region must be reachable by keyboard.
          tabIndex={0}
          className="-mx-4 -my-1 max-h-[60vh] overflow-y-auto px-4 py-1"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${id}-name`}>Opportunity Name</FieldLabel>
              <Input id={`${id}-name`} defaultValue="Acme - 200 Widgets" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-account`}>Account Name</FieldLabel>
              <Input id={`${id}-account`} defaultValue="Acme" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-close`}>Close Date</FieldLabel>
              <Input id={`${id}-close`} type="date" defaultValue="2026-12-15" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-stage`}>Stage</FieldLabel>
              <NativeSelect id={`${id}-stage`} defaultValue="Prospecting">
                {stages.map((stage) => (
                  <NativeSelectOption key={stage} value={stage}>
                    {stage}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-amount`}>Amount</FieldLabel>
              <Input
                id={`${id}-amount`}
                inputMode="decimal"
                defaultValue="$120,000"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-probability`}>
                Probability (%)
              </FieldLabel>
              <Input
                id={`${id}-probability`}
                inputMode="numeric"
                defaultValue="10"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-next`}>Next Step</FieldLabel>
              <Input
                id={`${id}-next`}
                defaultValue="Demo for the purchasing team"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-description`}>Description</FieldLabel>
              <Textarea
                id={`${id}-description`}
                defaultValue="200 widgets for Acme's new plant, to be delivered in two batches."
              />
            </Field>
          </FieldGroup>
        </div>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```
