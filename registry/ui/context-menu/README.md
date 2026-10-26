# Context menu

This page shows the Radix version. Base UI projects get [registry/base/ui/context-menu.tsx](../../base/ui/context-menu.tsx), and [ui.wisty.ai/context-menu](https://ui.wisty.ai/context-menu) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Opens a menu of actions on right-click, like on a file tile or a list row.

```bash
npx shadcn@latest add @wisty/context-menu
```

## Examples

- `default` (Opportunity actions): A `ContextMenuLabel` header over items with a `ContextMenuShortcut`, a Share submenu, a `disabled` item, and Delete with `variant="destructive"`.
- `selection` (Checkbox and radio items): Checkbox items (`ContextMenuCheckboxItem`) for what to show, radio items for the sort order, and an item lined up with them by `inset`.

## When to use

- People right-click an object to act on it, like a file tile, a list row or a card.
- As a shortcut to actions that also live somewhere visible.
- In a canvas or editor where a right-click on an element is the usual way in, like a page builder.

## When not to use

- The menu would be the only way to reach an action. Many people never right-click, and touch screens need a long press. Show a button or a Dropdown menu as well.
- A button opens the menu. Use Dropdown menu.
- People pick a value for a form field. Use Select.
- A bar of menus along the top of an app, like File and Edit. Use Menubar.

## Usage

```text
ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   └── ContextMenuItem
    │       └── ContextMenuShortcut
    ├── ContextMenuSeparator
    └── ContextMenuSub
        ├── ContextMenuSubTrigger
        └── ContextMenuSubContent
            └── ContextMenuItem
```

The trigger is the area people right-click. It has no style of its own, so give it a display, a size and a focus style.

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
```

```tsx
<ContextMenu>
  <ContextMenuTrigger
    tabIndex={0}
    className="flex rounded-(--radius-2) border border-border p-4 outline-none focus-visible:shadow-(--shadow-focus)"
  >
    Acme Corp
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onClick={editAccount}>Edit</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

- Run an action with `onClick`, which works in Radix and Base UI projects; `onSelect` is Radix only.
- For choices, use `ContextMenuCheckboxItem`, or `ContextMenuRadioItem` inside a `ContextMenuRadioGroup`, in an item's place. `inset` on an item, label or submenu trigger indents its text to line up with theirs.
- In Radix projects, checking a checkbox or radio item closes the menu; call `event.preventDefault()` in its `onSelect` to keep it open. In Base UI projects the menu stays open; pass `closeOnClick` to close it.
- The menu opens at the pointer, to its right. In Radix projects it always does: `ContextMenuContent` ignores `side`, `sideOffset` and `align`, so leave them off. In Base UI projects they move it.

## Rules

- Use a context menu only as a shortcut. Put the same actions in a visible Dropdown menu or buttons too.
- Put each `ContextMenuLabel` inside a `ContextMenuGroup`, or the menu can throw.
- Put an icon first in an item, then the text, then an optional `ContextMenuShortcut`. The shortcut only shows the keys; it doesn't make them work.
- Use `variant="destructive"` only for actions that delete or can't be undone, and put them last, after a separator.
- Don't restyle highlight, focus or check colors. They come from the theme tokens.

## API reference

| Part | Built on |
| --- | --- |
| `ContextMenu` | [Radix ContextMenu.Root](https://www.radix-ui.com/primitives/docs/components/context-menu#root) |
| `ContextMenuTrigger` | [Radix ContextMenu.Trigger](https://www.radix-ui.com/primitives/docs/components/context-menu#trigger) |
| `ContextMenuGroup` | [Radix ContextMenu.Group](https://www.radix-ui.com/primitives/docs/components/context-menu#group) |
| `ContextMenuPortal` | [Radix ContextMenu.Portal](https://www.radix-ui.com/primitives/docs/components/context-menu#portal) |
| `ContextMenuSub` | [Radix ContextMenu.Sub](https://www.radix-ui.com/primitives/docs/components/context-menu#sub) |
| `ContextMenuRadioGroup` | [Radix ContextMenu.RadioGroup](https://www.radix-ui.com/primitives/docs/components/context-menu#radiogroup) |
| `ContextMenuContent` | [Radix ContextMenu.Content](https://www.radix-ui.com/primitives/docs/components/context-menu#content) |
| `ContextMenuItem` | [Radix ContextMenu.Item](https://www.radix-ui.com/primitives/docs/components/context-menu#item) |
| `ContextMenuSubTrigger` | [Radix ContextMenu.SubTrigger](https://www.radix-ui.com/primitives/docs/components/context-menu#subtrigger) |
| `ContextMenuSubContent` | [Radix ContextMenu.SubContent](https://www.radix-ui.com/primitives/docs/components/context-menu#subcontent) |
| `ContextMenuCheckboxItem` | [Radix ContextMenu.CheckboxItem](https://www.radix-ui.com/primitives/docs/components/context-menu#checkboxitem) |
| `ContextMenuRadioItem` | [Radix ContextMenu.RadioItem](https://www.radix-ui.com/primitives/docs/components/context-menu#radioitem) |
| `ContextMenuLabel` | [Radix ContextMenu.Label](https://www.radix-ui.com/primitives/docs/components/context-menu#label) |
| `ContextMenuSeparator` | [Radix ContextMenu.Separator](https://www.radix-ui.com/primitives/docs/components/context-menu#separator) |
| `ContextMenuShortcut` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |

### ContextMenuContent

| Prop | Type | Default |
| --- | --- | --- |
| `side`? | `"top" \| "right" \| "bottom" \| "left"` |  |

### ContextMenuItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |
| `variant`? | `"default" \| "destructive"` | `"default"` |

### ContextMenuSubTrigger

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### ContextMenuSubContent

| Prop | Type | Default |
| --- | --- | --- |
| `sideOffset`? | `number` | `4` |
| `alignOffset`? | `number` | `2` |

### ContextMenuCheckboxItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### ContextMenuRadioItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### ContextMenuLabel

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

## SLDS mapping

SLDS has no context menu. This is SLDS's menu, opened at the pointer.

- `ContextMenuContent` and `ContextMenuSubContent` are `slds-dropdown`.
- `ContextMenuItem`, `ContextMenuCheckboxItem` and `ContextMenuRadioItem` are `slds-dropdown__item`. Checked items show SLDS's selected check (`slds-icon_selected`) before the text.
- `ContextMenuLabel` is `slds-dropdown__header`.
- `ContextMenuSeparator` is `slds-has-divider_top-space`.
- `ContextMenuSubTrigger` is an item with `slds-has-submenu`.
- `ContextMenuShortcut` and `ContextMenuTrigger` have no SLDS counterpart. The examples draw the trigger as SLDS's file selector drop zone (`slds-file-selector__dropzone`).

Known gaps:

- No nubbin, and no `slds-dropdown_length-*` heights. The menu scrolls only when it runs out of room on screen.
- Icons are lucide's, not SLDS's utility icons.
- SLDS truncates a long item on one line. Here it wraps, unless you wrap the label in `<span className="truncate">`.
- A submenu trigger keeps its highlight while its submenu is open. SLDS drops it once focus moves into the submenu.

## Keyboard interactions

| Keys                 | Action                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Menu or Shift+F10    | On the focused trigger, opens the menu.                             |
| Down Arrow, Up Arrow | Moves focus to the next or previous item.                           |
| Home, End            | Moves focus to the first or last item.                              |
| Letters              | Moves focus to the next item that starts with them.                 |
| Enter or Space       | Runs the focused item, or checks it.                                |
| Right Arrow          | On a submenu trigger, opens the submenu and focuses its first item. |
| Left Arrow           | In a submenu, closes it and returns focus to its trigger.           |
| Escape               | Closes the menu.                                                    |

Opened from the keyboard, in Radix projects the first item takes focus, and the arrow keys stop at the first and last items. In Base UI projects the menu takes focus with no item highlighted, the first Down Arrow reaches the first item, and the arrow keys wrap. In Radix projects the arrow keys skip disabled items. In Base UI projects focus lands on them, but Enter and Space don't run them.

Macs have no Menu key, and browsers differ on Shift+F10, so keyboard users may have no way in. Keep the actions reachable elsewhere.

## Accessibility

- The trigger has no role and isn't in the tab order. Give it `tabIndex={0}` and text that says what it holds.
- The menu is modal. While it's open, the page doesn't scroll, a click outside only closes it, and the rest of the page is hidden from screen readers or kept out of the focus order.
- A disabled item still reads out. Say why it's unavailable in nearby text if it matters.
- In Base UI projects a `ContextMenuLabel` names its `ContextMenuGroup` for screen readers. In Radix projects it's only text, so give the group an `aria-label` when its name matters.

## Performance

- Use one `ContextMenu` per area. For a long list, put one around the list and read which row was clicked, rather than one per row.

## Example code

### Opportunity actions

A `ContextMenuLabel` header over items with a `ContextMenuShortcut`, a Share submenu, a `disabled` item, and Delete with `variant="destructive"`.

```tsx
import {
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

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function ContextMenuDefault() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        className="flex h-36 w-full max-w-72 items-center justify-center rounded-(--radius-2) border border-dashed border-border-strong text-(length:--font-size-base) outline-none focus-visible:shadow-(--shadow-focus)"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Opportunity</ContextMenuLabel>
          <ContextMenuItem>
            <PencilIcon />
            Edit
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <CopyIcon />
            Clone
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <SquareCheckIcon />
            New task
            <ContextMenuShortcut>⌘T</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2Icon />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <MailIcon />
              Email
            </ContextMenuItem>
            <ContextMenuItem>
              <MessageSquareIcon />
              Slack
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <LinkIcon />
              Copy link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem disabled>
          <UserRoundIcon />
          Change owner
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2Icon />
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

### Checkbox and radio items

Checkbox items (`ContextMenuCheckboxItem`) for what to show, radio items for the sort order, and an item lined up with them by `inset`.

```tsx
"use client"

import { useState } from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function ContextMenuSelection() {
  const [closed, setClosed] = useState(true)
  const [amounts, setAmounts] = useState(false)
  const [sort, setSort] = useState("close-date")

  return (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        className="flex h-36 w-full max-w-72 flex-col items-center justify-center gap-1 rounded-(--radius-2) border border-dashed border-border-strong p-4 text-center text-(length:--font-size-base) text-muted-foreground outline-none focus-visible:shadow-(--shadow-focus)"
      >
        <strong className="text-foreground">Opportunities</strong>
        Right-click or press the Menu key for view options
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Show</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={closed} onCheckedChange={setClosed}>
            Closed opportunities
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={amounts}
            onCheckedChange={setAmounts}
          >
            Amounts
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Sort by</ContextMenuLabel>
          <ContextMenuRadioGroup value={sort} onValueChange={setSort}>
            <ContextMenuRadioItem value="close-date">
              Close date
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="amount">Amount</ContextMenuRadioItem>
            <ContextMenuRadioItem value="stage">Stage</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Reset view</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```
