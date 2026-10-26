# Alert dialog

This page shows the Radix version. Base UI projects get [registry/base/ui/alert-dialog.tsx](../../base/ui/alert-dialog.tsx), and [ui.wisty.ai/alert-dialog](https://ui.wisty.ai/alert-dialog) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Asks a question people must answer before going on, like confirming a delete.

```bash
npx shadcn@latest add @wisty/alert-dialog
```

## Examples

- `default` (Delete record): Delete asks first, with the error header from `variant="destructive"` on `AlertDialogContent`, Cancel, and a destructive Delete.
- `variants` (Header colors): The plain, success and info headers, set with `variant` on `AlertDialogContent`, each with Cancel and a brand action.
- `warning` (Warning): A service that's down, with `variant="warning"` and a single `AlertDialogCancel` as the Okay button.
- `small` (Small with media): A short question with its buttons side by side, set with `size="sm"`, and an icon in `AlertDialogMedia`.

## When to use

- People confirm an action they can't easily undo, like deleting a record or discarding changes.
- A system problem stops the current task and people must acknowledge it, like a service that's down.
- A short yes or no question must be answered before going on.

## When not to use

- People need to fill in fields or do a task. Use Dialog.
- The message needs no answer, like a saved record. Use Sonner.
- The problem belongs to one part of the page, like a form section. Use Alert.
- People should keep the page in view while they work. Use Sheet or Popover.

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
```

```text
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia (optional icon)
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
```

Style the trigger with `className={buttonVariants()}` from Button, as the examples do.

`AlertDialogAction` and `AlertDialogCancel` close the dialog as soon as they're clicked. To keep it open while the action runs, like a delete that waits for the server, control `open` and put a `Button` in the footer in place of the Action:

```tsx
const [open, setOpen] = useState(false)

async function remove() {
  await deleteAccount()
  setOpen(false)
}

return (
  <AlertDialog open={open} onOpenChange={setOpen}>
    {/* trigger and header as in the examples, then in the footer: */}
    {/* <Button variant="destructive" onClick={remove}>Delete</Button> */}
  </AlertDialog>
)
```

## Rules

- For a delete or another destructive action, pass `variant="destructive"` to both `AlertDialogContent` and `AlertDialogAction`.
- Use `variant="warning"` for a system problem people must acknowledge, with a single Cancel such as "Okay", as the Warning example shows.
- Don't restyle the header, corners or colors with utility classes. They come from the theme tokens.

## API reference

| Part | Built on |
| --- | --- |
| `AlertDialog` | [Radix AlertDialog.Root](https://www.radix-ui.com/primitives/docs/components/alert-dialog#root) |
| `AlertDialogTrigger` | [Radix AlertDialog.Trigger](https://www.radix-ui.com/primitives/docs/components/alert-dialog#trigger) |
| `AlertDialogPortal` | [Radix AlertDialog.Portal](https://www.radix-ui.com/primitives/docs/components/alert-dialog#portal) |
| `AlertDialogOverlay` | [Radix AlertDialog.Overlay](https://www.radix-ui.com/primitives/docs/components/alert-dialog#overlay) |
| `AlertDialogContent` | [Radix AlertDialog.Content](https://www.radix-ui.com/primitives/docs/components/alert-dialog#content) |
| `AlertDialogHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `AlertDialogFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `AlertDialogMedia` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `AlertDialogTitle` | [Radix AlertDialog.Title](https://www.radix-ui.com/primitives/docs/components/alert-dialog#title) |
| `AlertDialogDescription` | [Radix AlertDialog.Description](https://www.radix-ui.com/primitives/docs/components/alert-dialog#description) |
| `AlertDialogAction` | [Radix AlertDialog.Action](https://www.radix-ui.com/primitives/docs/components/alert-dialog#action) |
| `AlertDialogCancel` | [Radix AlertDialog.Cancel](https://www.radix-ui.com/primitives/docs/components/alert-dialog#cancel) |

### AlertDialogContent

| Prop | Type | Default |
| --- | --- | --- |
| `size`? | `"default" \| "sm"` | `"default"` |
| `variant`? | `"default" \| "destructive" \| "warning" \| "success" \| "info"` | `"default"` |

### AlertDialogAction

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link" \| "outline-brand" \| "destructive-text" \| "success" \| "inverse"` | `"default"` |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` |

### AlertDialogCancel

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link" \| "outline-brand" \| "destructive-text" \| "success" \| "inverse"` | `"outline"` |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` |

## SLDS mapping

`AlertDialogContent` is `slds-modal slds-modal_prompt`, and `AlertDialogOverlay` is `slds-backdrop`, as Dialog's. `AlertDialogHeader` is `slds-modal__header`, themed by `variant`, and `AlertDialogTitle` is its `slds-text-heading_medium` heading. `AlertDialogDescription` is the prompt's message in `slds-modal__content`, on the box's own background under the themed header. A link in it takes the link color, underlined so it doesn't rely on color alone. `AlertDialogFooter` is `slds-modal__footer slds-theme_default`. `AlertDialogMedia` has no SLDS counterpart: it's Empty's gray icon box. The title's alignment, the footer's rule and its button alignment follow each theme's prompt hooks.

Known gaps:

- SLDS's striped header texture (`slds-theme_alert-texture`) isn't in the SLDS 2 stylesheet, so it isn't here either.
- Icons are lucide's, not SLDS's utility icons.

## Keyboard interactions

| Keys           | Action                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Escape         | Closes the dialog and returns focus to the trigger. With a combobox's list open inside, closes only the list; press again. |
| Tab, Shift+Tab | Moves between the dialog's controls and stays inside it.                                                                   |

A Command's search field isn't an open list, so Escape there closes the dialog.

## Accessibility

- Always include an `AlertDialogTitle` and an `AlertDialogDescription`. They name and describe the dialog, so screen readers read the question when it opens.
- Always include an `AlertDialogCancel`, first in the footer, even when it's the only button, like an Okay. Focus moves to it on open; without one, focus can stay on the trigger behind the dialog.
- Clicking outside doesn't close the dialog. People choose a button or press Escape.

## Motion

- The backdrop and the box fade in, the box faster, as Dialog's do, in every theme. Nothing moves, so the fades stay on with reduced motion.

## Responsive behavior

- From 48rem (768px) wide, the dialog is half the screen wide, between 20rem and 40rem. Below it, it fills the screen less 2rem on each side. `size="sm"` stays at 20rem or less.
- The title wraps and long words break. Footer buttons wrap onto a second line when they don't fit; in `size="sm"` they share the row in two equal columns.

## Performance

- The content renders in a portal at `document.body`, only while open, so styles scoped to an ancestor don't reach it.

## Example code

### Delete record

Delete asks first, with the error header from `variant="destructive"` on `AlertDialogContent`, Cancel, and a destructive Delete.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AlertDialogDefault() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({ variant: "outline" })}>
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent variant="destructive">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            Acme and its 12 contacts will be deleted. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Header colors

The plain, success and info headers, set with `variant` on `AlertDialogContent`, each with Cancel and a brand action.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AlertDialogVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <AlertDialog>
        <AlertDialogTrigger className={buttonVariants({ variant: "outline" })}>
          Discard changes
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard your changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes to this opportunity. If you leave now,
              they&apos;re lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger className={buttonVariants({ variant: "outline" })}>
          Mark as won
        </AlertDialogTrigger>
        <AlertDialogContent variant="success">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Close Acme - 200 Widgets as won?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The stage changes to Closed Won and the amount counts toward this
              quarter&apos;s quota.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Mark as won</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger className={buttonVariants({ variant: "outline" })}>
          Recalculate sharing
        </AlertDialogTrigger>
        <AlertDialogContent variant="info">
          <AlertDialogHeader>
            <AlertDialogTitle>Recalculate sharing?</AlertDialogTitle>
            <AlertDialogDescription>
              Sharing for 1,240 accounts is recalculated overnight. You&apos;ll
              get an email when it&apos;s done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Recalculate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
```

### Warning

A service that's down, with `variant="warning"` and a single `AlertDialogCancel` as the Okay button.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AlertDialogWarning() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({ variant: "outline" })}>
        Sync billing
      </AlertDialogTrigger>
      <AlertDialogContent variant="warning">
        <AlertDialogHeader>
          <AlertDialogTitle>Service unavailable</AlertDialogTitle>
          <AlertDialogDescription>
            We can&apos;t reach the billing service right now. Your changes are
            saved. Try syncing again in a few minutes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Okay</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Small with media

A short question with its buttons side by side, set with `size="sm"`, and an icon in `AlertDialogMedia`.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Share2Icon } from "lucide-react"

export default function AlertDialogSmall() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({ variant: "outline" })}>
        Share report
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Share2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Share this report?</AlertDialogTitle>
          <AlertDialogDescription>
            Everyone in the Sales group can view it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don&apos;t share</AlertDialogCancel>
          <AlertDialogAction>Share</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```
