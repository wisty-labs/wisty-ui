# Sonner

This page shows the Radix version. Base UI projects get [registry/base/ui/sonner.tsx](../../base/ui/sonner.tsx), and [ui.wisty.ai/sonner](https://ui.wisty.ai/sonner) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows brief, non-blocking messages, like a saved record or a failed request.

```bash
npx shadcn@latest add @wisty/sonner
```

## Examples

- `default` (Record saved): Save calls `toast.success()`, which shows a toast at the top center with a close button.
- `types` (Types): Buttons that call `toast.success()`, `.info()`, `.warning()` and `.error()`, with `duration: Infinity` on the warning and error so they stay until closed.
- `record-created` (Record created): Save calls `toast.success()` with the new contact's name linked in the title, a description, and `duration: 10000` so there's time to reach the link.

## When to use

- To confirm that something happened, like a saved record or a sent email, without interrupting people.
- To report a background failure people should know about, like a request that didn't go through.
- For short-lived news that needs no answer, or one optional action, like Undo.

## When not to use

- When the message belongs to one part of the page, like a form's errors. Use Alert next to that part, or the field's own error message.
- When people must read it or decide something before they go on. Use Dialog.
- When the message must stay until the problem is fixed, like a lost connection. Use Alert with `variant="banner"`.
- When the text is long or has several actions. Toasts are for one or two short lines.

## Usage

Render one `Toaster` near the root of the app, then call `toast()` from an event handler anywhere. The file exports `toast` too, so both come from one place.

```tsx
import { Toaster, toast } from "@/components/ui/sonner"
```

Once, near the root of the app:

```tsx
<Toaster />
```

Then, in an event handler:

```tsx
toast.success("Email sent.")
```

A link in the title or the description takes the toast's text color, underlined. Put a link people need in the title: phones show only the title.

For one button in the toast, like Undo, pass `action: { label, onClick }`; the toast runs `onClick` and then closes. A fixed `id` replaces a toast instead of stacking a second one.

## Rules

- Render exactly one `Toaster`. Every `Toaster` shows every toast, so a second one shows each toast twice.
- Call `toast()` from an event handler or after a request finishes, never while rendering. Each render would show another toast.
- Pick the type by outcome: `toast.success()` for done, `toast.error()` for failed, `toast.warning()` for needs attention soon, `toast()` or `toast.info()` for news.
- Pass `duration: Infinity` to `toast.error()` and `toast.warning()`, so they stay until closed, as Salesforce's do. A toast with a link takes `duration: 10000`, so people have time to reach the link.
- Pass options like `duration` to each `toast()` call. `toastOptions` on `Toaster` replaces the classes that give toasts their look in each theme.
- Don't style toast colors with classes. The theme sets them, and they change per theme.
- Don't turn off the close button unless every toast times out.

## API reference

| Part | Built on |
| --- | --- |
| `Toaster` | [Sonner](https://sonner.emilkowal.ski/toaster) |
| `toast` | [Sonner toast](https://sonner.emilkowal.ski/toast) |

### Toaster

| Prop | Type | Default |
| --- | --- | --- |
| `position`? | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "top-center" \| "bottom-center"` | `"top-center"` |
| `expand`? | `boolean` | `true` |
| `closeButton`? | `boolean` | `true` |

## SLDS mapping

`Toaster` is `slds-notify_container`. Each toast is `slds-notify slds-notify_toast` with the theme class from the table below. The title is `slds-text-heading_small`, the icon sits in `slds-icon_container`, and the close button is `slds-notify__close`.

Known gaps:

- SLDS toasts have no buttons. An action button looks like a neutral button, and a cancel button like a link in the toast's text color.
- Every toast has one width, so toasts don't grow with their text. Pass `style={{ "--width": "…" }}` to `Toaster` to change it.
- Toasts sit further from the top of the screen and further apart when listed than SLDS's.
- Icons are lucide's, not SLDS's utility icons.

## Keyboard interactions

| Keys   | Action                                                                   |
| ------ | ------------------------------------------------------------------------ |
| Alt+T  | Lists the toasts and moves focus to them. Change the keys with `hotkey`. |
| Escape | With focus in the toasts, stacks them again.                             |

## Accessibility

- Keep toasts short. Screen readers read the whole toast, and a toast without `duration: Infinity` disappears after four seconds.
- Don't put the only way to do something in a toast; it can time out before people reach it. Repeat the action on the page.
- Toasts don't take focus when they appear. Someone who misses one gets it back with Alt+T.

## Motion

- Toasts slide in from the top and fade out, in every theme. The loading icon spins.
- With reduced motion the slide and fade are off, and the loading icon holds still.

## Responsive behavior

- Below 600px toasts fill the screen, less 16px on each side.
- Below 30em (480px) toasts show only their title, as SLDS's small-screen toasts do: the icon and the description are hidden. The title must carry the message on phones, links included.
- Three toasts show at a time, listed with the newest on top, as SLDS lists them. Pass `visibleToasts` to show more, or `expand={false}` to stack them behind the newest until hovered.

## Example code

### Record saved

Save calls `toast.success()`, which shows a toast at the top center with a close button.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"

export default function SonnerDefault() {
  return (
    <Button
      variant="outline"
      onClick={() => toast.success('Account "Acme" was saved.')}
    >
      Save
    </Button>
  )
}
```

### Types

Buttons that call `toast.success()`, `.info()`, `.warning()` and `.error()`, with `duration: Infinity` on the warning and error so they stay until closed.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"

export default function SonnerTypes() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => toast.success("Account ACME - 100 widgets was created.")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("26 potential duplicate leads were found.")}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Your session ends in 10 minutes.", {
            duration: Infinity,
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("The record couldn't be saved.", { duration: Infinity })
        }
      >
        Error
      </Button>
    </div>
  )
}
```

### Record created

Save calls `toast.success()` with the new contact's name linked in the title, a description, and `duration: 10000` so there's time to reach the link.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"

export default function SonnerRecordCreated() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.success(
          <>
            Contact &quot;<a href="#">Jane Doe</a>&quot; was created.
          </>,
          {
            description: "Find it under Contacts on the Acme account.",
            duration: 10000,
          }
        )
      }
    >
      Save
    </Button>
  )
}
```
