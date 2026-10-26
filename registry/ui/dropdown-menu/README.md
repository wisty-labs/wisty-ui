# Dropdown menu

This page shows the Radix version. Base UI projects get [registry/base/ui/dropdown-menu.tsx](../../base/ui/dropdown-menu.tsx), and [ui.wisty.ai/dropdown-menu](https://ui.wisty.ai/dropdown-menu) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Opens a menu of actions or options from a button, like a record's row actions.

```bash
npx shadcn@latest add @wisty/dropdown-menu
```

## Examples

- `default` (Record actions): A `DropdownMenuLabel` header over items with a `DropdownMenuShortcut`, a Share submenu, a `disabled` item, and Delete with `variant="destructive"`.
- `row-actions` (Row actions): An opportunity row's actions behind a small icon button named for the row, the menu lined up with its end by `align="end"`.
- `selection` (Checkbox and radio items): Checkbox items (`DropdownMenuCheckboxItem`) for visible columns and radio items (`DropdownMenuRadioItem`) for the sort order, one checked in each.

## When to use

- A button opens a list of actions, like a record's Edit, Clone and Delete.
- Row actions in a table, behind a small icon button.
- A few settings that change a view, like visible columns (checkbox items) or a sort order (radio items).

## When not to use

- People pick a value for a form field. Use Select.
- People search a long list. Use Combobox.
- There are only one or two actions with room for them. Show buttons.
- The list is navigation between pages. Use links or Tabs.
- People right-click an object to act on it. Use Context menu.

## Usage

```text
DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   └── DropdownMenuItem
    │       └── DropdownMenuShortcut
    ├── DropdownMenuSeparator
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent
            └── DropdownMenuItem
```

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
```

```tsx
<DropdownMenu>
  <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
    New
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={newOpportunity}>Opportunity</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

- Run an action with `onClick`, which works in Radix and Base UI projects; `onSelect` is Radix only.
- For settings, use `DropdownMenuCheckboxItem`, or `DropdownMenuRadioItem` inside a `DropdownMenuRadioGroup`, in an item's place. `inset` on an item, label or submenu trigger indents its text to line up with theirs.
- In Radix projects, checking a checkbox or radio item closes the menu; call `event.preventDefault()` in its `onSelect` to keep it open. In Base UI projects the menu stays open; pass `closeOnClick` to close it.

## Rules

- Put each `DropdownMenuLabel` inside a `DropdownMenuGroup`, or the menu can throw.
- Pass `modal` only when the page must be blocked. A modal menu stops the page scrolling and takes the next click outside just to close itself.
- Never nest a Button inside the trigger. That's a button in a button; style the trigger with `buttonVariants()` instead.
- Put an icon first in an item, then the text, then an optional `DropdownMenuShortcut`. The shortcut only shows the keys; it doesn't make them work.
- Use `variant="destructive"` only for actions that delete or can't be undone, and put them last, after a separator.
- Don't restyle highlight, focus or check colors. They come from the theme tokens.

## API reference

| Part | Built on |
| --- | --- |
| `DropdownMenu` | [Radix DropdownMenu.Root](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#root) |
| `DropdownMenuPortal` | [Radix DropdownMenu.Portal](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#portal) |
| `DropdownMenuTrigger` | [Radix DropdownMenu.Trigger](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#trigger) |
| `DropdownMenuContent` | [Radix DropdownMenu.Content](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#content) |
| `DropdownMenuGroup` | [Radix DropdownMenu.Group](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#group) |
| `DropdownMenuItem` | [Radix DropdownMenu.Item](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#item) |
| `DropdownMenuCheckboxItem` | [Radix DropdownMenu.CheckboxItem](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#checkboxitem) |
| `DropdownMenuRadioGroup` | [Radix DropdownMenu.RadioGroup](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radiogroup) |
| `DropdownMenuRadioItem` | [Radix DropdownMenu.RadioItem](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radioitem) |
| `DropdownMenuLabel` | [Radix DropdownMenu.Label](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#label) |
| `DropdownMenuSeparator` | [Radix DropdownMenu.Separator](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#separator) |
| `DropdownMenuShortcut` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `DropdownMenuSub` | [Radix DropdownMenu.Sub](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#sub) |
| `DropdownMenuSubTrigger` | [Radix DropdownMenu.SubTrigger](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#subtrigger) |
| `DropdownMenuSubContent` | [Radix DropdownMenu.SubContent](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#subcontent) |

### DropdownMenu

| Prop | Type | Default |
| --- | --- | --- |
| `modal`? | `boolean` | `false` |

### DropdownMenuContent

| Prop | Type | Default |
| --- | --- | --- |
| `align`? | `"center" \| "end" \| "start"` | `"start"` |
| `sideOffset`? | `number` | `2` |

### DropdownMenuItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |
| `variant`? | `"default" \| "destructive"` | `"default"` |

### DropdownMenuCheckboxItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### DropdownMenuRadioItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### DropdownMenuLabel

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### DropdownMenuSubTrigger

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### DropdownMenuSubContent

| Prop | Type | Default |
| --- | --- | --- |
| `sideOffset`? | `number` | `4` |

## SLDS mapping

- `DropdownMenuContent` and `DropdownMenuSubContent` are `slds-dropdown`.
- `DropdownMenuItem`, `DropdownMenuCheckboxItem` and `DropdownMenuRadioItem` are `slds-dropdown__item`. Checked items show SLDS's selected check (`slds-icon_selected`) before the text.
- `DropdownMenuLabel` is `slds-dropdown__header`.
- `DropdownMenuSeparator` is `slds-has-divider_top-space`.
- `DropdownMenuSubTrigger` is an item with `slds-has-submenu`.
- `DropdownMenuShortcut` has no SLDS counterpart. The trigger is whatever you style it as, usually Button's neutral or icon button.

Known gaps:

- No nubbin, and no `slds-dropdown_length-*` heights. The menu scrolls only when it runs out of room on screen.
- Icons are lucide's, not SLDS's utility icons.
- SLDS truncates a long item on one line. Here it wraps, unless you wrap the label in `<span className="truncate">`.
- A submenu trigger keeps its highlight while its submenu is open. SLDS drops it once focus moves into the submenu.

## Keyboard interactions

| Keys                       | Action                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| Enter, Space or Down Arrow | On the trigger, opens the menu and focuses the first item.          |
| Down Arrow, Up Arrow       | Moves focus to the next or previous item.                           |
| Home, End                  | Moves focus to the first or last item.                              |
| Letters                    | Moves focus to the next item that starts with them.                 |
| Enter or Space             | Runs the focused item, or checks it.                                |
| Right Arrow                | On a submenu trigger, opens the submenu and focuses its first item. |
| Left Arrow                 | In a submenu, closes it and returns focus to its trigger.           |
| Escape                     | Closes the menu and returns focus to the trigger.                   |

In Radix projects the arrow keys skip disabled items. In Base UI projects focus lands on them, but Enter and Space don't run them.

## Accessibility

- Name an icon-only trigger with `aria-label`. In a list, name it for its row ("Show actions for Acme"), as the Row actions example does, so screen readers can tell the buttons apart.
- A disabled item still reads out. Say why it's unavailable in nearby text if it matters.

## Responsive behavior

- The menu is as wide as its longest item, between 6rem and 20rem.
- For a menu at the end of a row, pass `align="end"` to line it up with the trigger's end edge, as the Row actions example does.

## Example code

### Record actions

A `DropdownMenuLabel` header over items with a `DropdownMenuShortcut`, a Share submenu, a `disabled` item, and Delete with `variant="destructive"`.

```tsx
import {
  ChevronDownIcon,
  CopyIcon,
  LinkIcon,
  MailIcon,
  MessageSquareIcon,
  PencilIcon,
  Share2Icon,
  SquareCheckIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuDefault() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
        Actions
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Opportunity</DropdownMenuLabel>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Clone
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SquareCheckIcon />
            New task
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Share2Icon />
            Share
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <MailIcon />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquareIcon />
              Slack
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LinkIcon />
              Copy link
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>
          <UserRoundIcon />
          Change owner
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Row actions

An opportunity row's actions behind a small icon button named for the row, the menu lined up with its end by `align="end"`.

```tsx
import {
  ChevronDownIcon,
  CopyIcon,
  PencilIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuRowActions() {
  return (
    <div className="flex w-full max-w-md items-center gap-3 border-b border-border py-2">
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">Acme - 200 Widgets</div>
        <div className="truncate text-muted-foreground">
          Prospecting · $120,000
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Show actions for Acme - 200 Widgets"
          className={buttonVariants({ variant: "outline", size: "icon-xs" })}
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Clone
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserRoundIcon />
            Change owner
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
```

### Checkbox and radio items

Checkbox items (`DropdownMenuCheckboxItem`) for visible columns and radio items (`DropdownMenuRadioItem`) for the sort order, one checked in each.

```tsx
"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuSelection() {
  const [owner, setOwner] = useState(true)
  const [phone, setPhone] = useState(false)
  const [sort, setSort] = useState("name")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
        Display options
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={owner} onCheckedChange={setOwner}>
            Account owner
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={phone} onCheckedChange={setPhone}>
            Phone
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="modified">
              Last modified
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```
