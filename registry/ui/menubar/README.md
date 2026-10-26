# Menubar

This page shows the Radix version. Base UI projects get [registry/base/ui/menubar.tsx](../../base/ui/menubar.tsx), and [ui.wisty.ai/menubar](https://ui.wisty.ai/menubar) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Keeps a row of menus on screen, like an editor's File, Edit and View.

```bash
npx shadcn@latest add @wisty/menubar
```

## Examples

- `default` (Report builder menus): Three menus with `MenubarShortcut`s, Export `disabled` until the report is saved, and Delete last as `variant="destructive"`.
- `selection` (Checkbox and radio items): A View menu of `MenubarCheckboxItem`s and `MenubarRadioItem`s under `MenubarLabel`s, and an `inset` item lined up with them.
- `submenu` (Submenu): Account's Share item, a `MenubarSubTrigger`, opens a `MenubarSubContent` of Email, Chatter post and Copy link.

## When to use

- An app or editor needs a row of menus that stays on screen, like File, Edit and View.
- A record or workspace has many commands, and grouping them under a few menus keeps the page calm.
- People expect desktop-style keyboard use: arrow keys along the bar and through each menu.

## When not to use

- One button opens a few actions. Use Dropdown menu.
- The links move between pages or sections of an app. Use links or Tabs.
- People right-click on an element to act on it. Use Context menu.
- There are only two or three commands with room for them. Show buttons, or a Button group.

## Usage

```text
Menubar
└── MenubarMenu
    ├── MenubarTrigger
    └── MenubarContent
        ├── MenubarItem
        │   └── MenubarShortcut
        ├── MenubarSub
        │   ├── MenubarSubTrigger
        │   └── MenubarSubContent
        │       └── MenubarItem
        ├── MenubarSeparator
        └── MenubarGroup
            ├── MenubarLabel
            ├── MenubarCheckboxItem
            └── MenubarRadioGroup
                └── MenubarRadioItem
```

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
```

```tsx
<Menubar aria-label="Flow builder">
  <MenubarMenu>
    <MenubarTrigger>Flow</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Save</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

Run an item's action with `onClick` on `MenubarItem`; `onSelect` exists only in Radix projects. `inset` on an item, label or submenu trigger starts its text where a checked item's text starts, so it lines up under checkbox and radio items. The menus aren't modal, so the page stays scrollable and clickable while one is open. In Base UI projects `modal` on `Menubar` changes that; in Radix projects the menubar is never modal.

In Radix projects, checking a checkbox or radio item closes the menu; call `event.preventDefault()` in its `onSelect` to keep it open. In Base UI projects the menu stays open; pass `closeOnClick` to close it.

## Rules

- Put each `MenubarLabel` inside a `MenubarGroup` or `MenubarRadioGroup`, or the menu can throw.
- A trigger's label is plain text. Don't put a Button or an icon-only control in it.
- Use `variant="destructive"` only for actions that delete or can't be undone, and put them last, after a separator.
- Don't restyle trigger hover, focus or open colors. They come from the theme tokens.
- Don't use a menubar for page navigation. It has no current-page state.

## API reference

| Part | Built on |
| --- | --- |
| `Menubar` | [Radix Menubar.Root](https://www.radix-ui.com/primitives/docs/components/menubar#root) |
| `MenubarMenu` | [Radix Menubar.Menu](https://www.radix-ui.com/primitives/docs/components/menubar#menu) |
| `MenubarGroup` | [Radix Menubar.Group](https://www.radix-ui.com/primitives/docs/components/menubar#group) |
| `MenubarPortal` | [Radix Menubar.Portal](https://www.radix-ui.com/primitives/docs/components/menubar#portal) |
| `MenubarRadioGroup` | [Radix Menubar.RadioGroup](https://www.radix-ui.com/primitives/docs/components/menubar#radiogroup) |
| `MenubarTrigger` | [Radix Menubar.Trigger](https://www.radix-ui.com/primitives/docs/components/menubar#trigger) |
| `MenubarContent` | [Radix Menubar.Content](https://www.radix-ui.com/primitives/docs/components/menubar#content) |
| `MenubarItem` | [Radix Menubar.Item](https://www.radix-ui.com/primitives/docs/components/menubar#item) |
| `MenubarCheckboxItem` | [Radix Menubar.CheckboxItem](https://www.radix-ui.com/primitives/docs/components/menubar#checkboxitem) |
| `MenubarRadioItem` | [Radix Menubar.RadioItem](https://www.radix-ui.com/primitives/docs/components/menubar#radioitem) |
| `MenubarLabel` | [Radix Menubar.Label](https://www.radix-ui.com/primitives/docs/components/menubar#label) |
| `MenubarSeparator` | [Radix Menubar.Separator](https://www.radix-ui.com/primitives/docs/components/menubar#separator) |
| `MenubarShortcut` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `MenubarSub` | [Radix Menubar.Sub](https://www.radix-ui.com/primitives/docs/components/menubar#sub) |
| `MenubarSubTrigger` | [Radix Menubar.SubTrigger](https://www.radix-ui.com/primitives/docs/components/menubar#subtrigger) |
| `MenubarSubContent` | [Radix Menubar.SubContent](https://www.radix-ui.com/primitives/docs/components/menubar#subcontent) |

### MenubarContent

| Prop | Type | Default |
| --- | --- | --- |
| `align`? | `"center" \| "end" \| "start"` | `"start"` |
| `sideOffset`? | `number` | `3` |
| `alignOffset`? | `number` | `0` |

### MenubarItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |
| `variant`? | `"default" \| "destructive"` | `"default"` |

### MenubarCheckboxItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### MenubarRadioItem

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### MenubarLabel

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### MenubarSubTrigger

| Prop | Type | Default |
| --- | --- | --- |
| `inset`? | `boolean` |  |

### MenubarSubContent

| Prop | Type | Default |
| --- | --- | --- |
| `sideOffset`? | `number` | `4` |

## SLDS mapping

SLDS has no menubar. `Menubar` takes the item look of Global Navigation's context bar, without its app name or primary area, and its menus are SLDS menus styled as in Dropdown menu.

- `Menubar` is `slds-context-bar` with `slds-context-bar__secondary`.
- `MenubarTrigger` is `slds-context-bar__item` with its `slds-context-bar__label-action`.
- `MenubarContent` and `MenubarSubContent` are `slds-dropdown`.
- `MenubarItem`, `MenubarCheckboxItem` and `MenubarRadioItem` are `slds-dropdown__item`. Checked items show SLDS's selected check (`slds-icon_selected`) before the text.
- `MenubarLabel` is `slds-dropdown__header`, and `MenubarSeparator` is `slds-has-divider_top-space`.
- `MenubarSubTrigger` is an item with `slds-has-submenu`. `MenubarShortcut` and a disabled trigger have no SLDS counterpart.

Known gaps:

- No current-page state (`slds-is-active`). Menubar holds commands, not navigation.
- No nubbin, and no `slds-dropdown_length-*` heights. A menu scrolls only when it runs out of room on screen.
- Icons are lucide's, not SLDS's utility icons.

## Keyboard interactions

| Keys                       | Action                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| Right Arrow, Left Arrow    | On a trigger, moves focus to the next or previous trigger.          |
| Enter, Space or Down Arrow | On a trigger, opens its menu and focuses the first item.            |
| Down Arrow, Up Arrow       | In a menu, moves focus to the next or previous item.                |
| Right Arrow, Left Arrow    | In a menu, closes it and opens the next or previous trigger's menu. |
| Right Arrow                | On a submenu trigger, opens the submenu and focuses its first item. |
| Left Arrow                 | In a submenu, closes it and returns focus to its trigger.           |
| Enter or Space             | Runs the focused item, or checks it.                                |
| Escape                     | Closes the menu and returns focus to its trigger.                   |

Only one trigger is in the tab order at a time, so Tab leaves the bar. In Radix projects the arrow keys skip disabled items and triggers. In Base UI projects focus lands on them, but Enter and Space don't run them.

## Accessibility

- Give the bar a name with `aria-label`, like "Report builder", so screen readers can tell it from another bar on the page.
- A disabled item still reads out. Say why it's unavailable in nearby text if it matters.

## Motion

- In Lightning Blue, the trigger's hover fill fades in over 0.25s. Cosmos has no hover fill, so nothing fades there.
- The fade only changes color, so it runs with reduced motion too.

## Responsive behavior

- The bar fills its container's width and doesn't wrap or scroll. Pass `className="w-fit"` to size it to its triggers.
- Triggers don't shrink. A long label ends in an ellipsis at a width that differs per theme, so keep labels to one or two words.

## Example code

### Report builder menus

Three menus with `MenubarShortcut`s, Export `disabled` until the report is saved, and Delete last as `variant="destructive"`.

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function MenubarDefault() {
  return (
    <Menubar aria-label="Report builder">
      <MenubarMenu>
        <MenubarTrigger>Report</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Save
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Save as…</MenubarItem>
          <MenubarItem>
            Run
            <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Export</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Delete</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Add filter</MenubarItem>
          <MenubarItem>Add column</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Refresh
            <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Full screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

### Checkbox and radio items

A View menu of `MenubarCheckboxItem`s and `MenubarRadioItem`s under `MenubarLabel`s, and an `inset` item lined up with them.

```tsx
"use client"

import { useState } from "react"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function MenubarSelection() {
  const [highlights, setHighlights] = useState(true)
  const [activity, setActivity] = useState(true)
  const [related, setRelated] = useState(false)
  const [density, setDensity] = useState("comfy")
  const [sort, setSort] = useState("name")
  const [filter, setFilter] = useState("mine")

  return (
    <Menubar aria-label="List view">
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Show</MenubarLabel>
            <MenubarCheckboxItem
              checked={highlights}
              onCheckedChange={setHighlights}
            >
              Highlights panel
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={activity}
              onCheckedChange={setActivity}
            >
              Activity timeline
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={related} onCheckedChange={setRelated}>
              Related lists
            </MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel>Density</MenubarLabel>
            <MenubarRadioGroup value={density} onValueChange={setDensity}>
              <MenubarRadioItem value="comfy">Comfy</MenubarRadioItem>
              <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem inset>Reset to default</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Sort</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={sort} onValueChange={setSort}>
            <MenubarRadioItem value="name">Name</MenubarRadioItem>
            <MenubarRadioItem value="close-date">Close date</MenubarRadioItem>
            <MenubarRadioItem value="amount">Amount</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Filter</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={filter} onValueChange={setFilter}>
            <MenubarRadioItem value="mine">My opportunities</MenubarRadioItem>
            <MenubarRadioItem value="all">All opportunities</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

### Submenu

Account's Share item, a `MenubarSubTrigger`, opens a `MenubarSubContent` of Email, Chatter post and Copy link.

```tsx
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function MenubarSubmenu() {
  return (
    <Menubar aria-label="Record">
      <MenubarMenu>
        <MenubarTrigger>Account</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New task</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email</MenubarItem>
              <MenubarItem>Chatter post</MenubarItem>
              <MenubarItem>Copy link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>Archive</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Edit details</MenubarItem>
          <MenubarItem>Change owner</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Help for this page</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```
