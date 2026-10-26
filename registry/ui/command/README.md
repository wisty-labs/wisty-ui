# Command

This page shows the Radix version. Base UI projects get [registry/base/ui/command.tsx](../../base/ui/command.tsx), and [ui.wisty.ai/command](https://ui.wisty.ai/command) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Jumps to records, pages and commands from the keyboard, filtering as you type. For a form field, use Select or Combobox.

```bash
npx shadcn@latest add @wisty/command
```

## Examples

- `default` (Search records and actions): Recent records and actions filtered as you type, grouped with `CommandGroup` and shown with icons, and a `CommandShortcut` on each action.
- `dialog` (In a dialog): The palette in `CommandDialog`: a Search button opens it, and picking a record or app page closes it.
- `selection` (Selected and disabled): A list view switcher in `PopoverContent`, the current view checked with `aria-checked` and one view `disabled`.
- `empty` (No results): A search that matches nothing shows the `CommandEmpty` row.

## When to use

- People search a mixed list of things to do or places to go, like recent records, actions and app pages, and pick one from the keyboard.
- A command palette: a search box and its results in a dialog that opens from a button or a shortcut.
- A choice made from a button that people search, like switching a list view from a popover. The choice acts at once and isn't kept as a form field's value.
- A list that stays on the page with a search field above it, like a quick find in a side panel.

## When not to use

- The value belongs to a form field, even one shown in a popover. Use Select for short lists or Combobox for long ones, which keeps the value in the field.
- People pick Salesforce records with object icons and a meta line. Use Lookup.
- The list holds a few actions on one thing, opened from a button. Use Dropdown menu.

## Usage

```text
Command
├── CommandInput
└── CommandList
    ├── CommandEmpty
    ├── CommandGroup
    │   └── CommandItem
    │       └── CommandShortcut
    └── CommandSeparator
```

Give `Command` a `label`, which names the search field.

```tsx
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
```

```tsx
<Command label="Search Salesforce">
  <CommandInput placeholder="Search records..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandItem value="Rose Gonzalez" onSelect={openRecord}>
      Rose Gonzalez
    </CommandItem>
  </CommandList>
</Command>
```

`onSelect` gets the item's `value`, from Enter or a click. Items filter on their text, shortcut included, so pass `value` with the words people search for and `keywords` for other words that should match. For a palette, put a `Command` inside `CommandDialog`, as the In a dialog example shows; it has no close button unless you pass `showCloseButton`. For a choice from a button, put it inside `PopoverContent` with `p-0`, as the Selected and disabled example shows.

## Rules

- `CommandDialog` doesn't add a `Command`. Put one inside it.
- Use `CommandGroup`'s `heading` for headers, not your own elements, and a `CommandSeparator` between groups.
- Don't add your own check icon. `aria-checked` or `data-checked` on an item draws the check.
- Inside a popover or dialog, add no shadow; they have their own. On its own on a page, give `Command` `shadow-(--elevation-2)`, as the Search records and actions example does.
- Keep a list to seven rows or fewer, headers included, before people have to scroll.

## API reference

| Part | Built on |
| --- | --- |
| `Command` | [cmdk Command](https://github.com/dip/cmdk) |
| `CommandDialog` | [Dialog](https://ui.wisty.ai/dialog#api-Dialog) |
| `CommandInput` | [cmdk Command.Input](https://github.com/dip/cmdk) |
| `CommandList` | [cmdk Command.List](https://github.com/dip/cmdk) |
| `CommandEmpty` | [cmdk Command.Empty](https://github.com/dip/cmdk) |
| `CommandGroup` | [cmdk Command.Group](https://github.com/dip/cmdk) |
| `CommandSeparator` | [cmdk Command.Separator](https://github.com/dip/cmdk) |
| `CommandItem` | [cmdk Command.Item](https://github.com/dip/cmdk) |
| `CommandShortcut` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |

### CommandDialog

| Prop | Type | Default |
| --- | --- | --- |
| `title`? | `string` | `"Command Palette"` |
| `description`? | `string` | `"Search for a command to run..."` |
| `showCloseButton`? | `boolean` | `false` |

## SLDS mapping

SLDS has no command palette, so Command is built from the parts it does have. It runs on cmdk in Radix and Base UI projects alike; cmdk depends on `@radix-ui/react-dialog`, so a Base UI project installs it and the Radix packages it needs too.

- `Command` is `slds-dropdown` without its shadow. Inside `CommandDialog` it takes the modal's corners.
- `CommandInput` is input group's search field, `slds-input-has-icon_left`.
- `CommandList` is `slds-listbox_vertical` at `slds-dropdown_length-7`.
- `CommandItem` is a plain listbox option, `slds-listbox__option_plain`, with SLDS's icon column. The check is SLDS's selected option check, `slds-is-selected`.
- `CommandGroup`'s heading is `slds-listbox__option-header`, and `CommandSeparator` is `slds-has-divider_top-space`. `CommandEmpty` is a plain option row in muted text, since SLDS has no "no results" row.
- `CommandDialog` is a `slds-modal` with no header, footer or padding.

Known gaps:

- SLDS centers its modal. `CommandDialog` opens a third of the way down, so it doesn't move as the results change.
- An item with an icon starts its text where SLDS's listbox does, further in than a Dropdown menu item, which follows SLDS's menu. A command used as a menu won't line up with one.
- No entity options with a meta line and object icons. Use Lookup for records.

## Keyboard interactions

| Keys                                    | Action                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| Typing                                  | Filters the items. The first match becomes active.                                     |
| Down Arrow, Up Arrow                    | Shows the active item, then moves to the next or previous one, skipping disabled ones. |
| Home, End, Cmd+Up Arrow, Cmd+Down Arrow | Moves to the first or last item.                                                       |
| Alt+Down Arrow, Alt+Up Arrow            | Moves to the first item of the next or previous group.                                 |
| Ctrl+N, Ctrl+J / Ctrl+P, Ctrl+K         | Moves down or up, as the arrows do. Turn off with `vimBindings={false}`.               |
| Enter                                   | Selects the active item, shown or not, so typing then Enter runs the first match.      |
| Escape                                  | In a `CommandDialog` or popover, closes it. Inline, does nothing.                      |

A palette's shortcut, like Cmd+K, is yours to add.

## Accessibility

- Always pass `label` to `Command`. Inside a popover, also give `PopoverContent` an `aria-label`.
- `CommandDialog`'s `title` and `description` name the dialog for screen readers and aren't shown. Set them to what the palette searches.
- Mark the current choice with `aria-checked` on every item: `true` on the chosen one, `false` on the rest, so their text lines up. Screen reader support for it on an option varies, so also show the choice on the button that opens the list.
- Screen readers aren't told how many items match, or that nothing does. Keep a `role="status"` element outside the list and put the count or "No results" in it. An axe scan also flags the empty row inside the list.
- `CommandDialog` returns focus on close to whatever had it when it opened, as long as that element is still on the page and can take focus.

## Motion

- `CommandDialog`'s backdrop and box fade in and out as Dialog's do. Fades don't move anything, so they stay on with reduced motion.

## Responsive behavior

- `Command` fills its container's width. Give it a `max-w-*` on a wide page.
- The list shows seven rows, then scrolls. Long item text wraps, and shortcuts stay at the end of the row.
- `CommandDialog` is half the screen wide, between 20rem and 40rem, or the screen less 2rem a side on small screens. It stops 1rem above the bottom, and on a short screen its list scrolls inside it.

## Performance

- Every item renders and is scored on every keystroke. A few hundred items filter without trouble.
- For thousands, or for results from a server, pass `shouldFilter={false}` to `Command`, control `CommandInput`'s `value`, and render only the items you fetched.

## Example code

### Search records and actions

Recent records and actions filtered as you type, grouped with `CommandGroup` and shown with icons, and a `CommandShortcut` on each action.

```tsx
import {
  BriefcaseIcon,
  Building2Icon,
  CopyIcon,
  PencilIcon,
  UserIcon,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export default function CommandDefault() {
  return (
    <Command
      label="Search Salesforce"
      className="max-w-sm shadow-(--elevation-2)"
    >
      <CommandInput placeholder="Search records and actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Recent records">
          <CommandItem>
            <Building2Icon />
            Burlington Textiles Corp of America
          </CommandItem>
          <CommandItem>
            <UserIcon />
            Rose Gonzalez
          </CommandItem>
          <CommandItem>
            <BriefcaseIcon />
            Edge Emergency Generator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="Edit record">
            <PencilIcon />
            Edit record
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem value="Clone record">
            <CopyIcon />
            Clone record
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

### In a dialog

The palette in `CommandDialog`: a Search button opens it, and picking a record or app page closes it.

```tsx
"use client"

import { useState } from "react"
import {
  BarChart3Icon,
  BriefcaseIcon,
  Building2Icon,
  HouseIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export default function CommandInDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        Search...
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Salesforce"
        description="Search recent records or go to an app page."
      >
        <Command label="Search Salesforce">
          <CommandInput placeholder="Search records and pages..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Recent records">
              <CommandItem onSelect={() => setOpen(false)}>
                <Building2Icon />
                Burlington Textiles Corp of America
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <UserIcon />
                Rose Gonzalez
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <BriefcaseIcon />
                Edge Emergency Generator
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Go to">
              <CommandItem onSelect={() => setOpen(false)}>
                <HouseIcon />
                Home
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <BarChart3Icon />
                Reports
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
```

### Selected and disabled

A list view switcher in `PopoverContent`, the current view checked with `aria-checked` and one view `disabled`.

```tsx
"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const views = [
  {
    heading: "Recent list views",
    names: ["Recently Viewed Leads", "My Open Leads"],
  },
  {
    heading: "Other list views",
    names: [
      "All Open Leads",
      "My Unread Leads",
      "Today's Leads",
      "Leads to Reassign",
    ],
  },
]

export default function CommandSelection() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState("My Open Leads")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
        {view}
        <ChevronDownIcon />
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="start"
        aria-label="List views"
      >
        <Command label="Search list views" defaultValue={view}>
          <CommandInput placeholder="Search list views..." />
          <CommandList>
            <CommandEmpty>No list views found.</CommandEmpty>
            {views.map((group) => (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.names.map((name) => (
                  <CommandItem
                    key={name}
                    value={name}
                    aria-checked={name === view}
                    disabled={name === "Leads to Reassign"}
                    onSelect={(value) => {
                      setView(value)
                      setOpen(false)
                    }}
                  >
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### No results

A search that matches nothing shows the `CommandEmpty` row.

```tsx
"use client"

import { useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function CommandNoResults() {
  const [search, setSearch] = useState("Acme Holdings")

  return (
    <Command
      label="Search accounts"
      className="max-w-sm shadow-(--elevation-2)"
    >
      <CommandInput
        placeholder="Search accounts..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results for &quot;{search}&quot;</CommandEmpty>
        <CommandItem>Burlington Textiles Corp of America</CommandItem>
        <CommandItem>Dickenson plc</CommandItem>
        <CommandItem>Edge Communications</CommandItem>
      </CommandList>
    </Command>
  )
}
```
