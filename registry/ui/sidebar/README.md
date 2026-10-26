# Sidebar

This page shows the Radix version. Base UI projects get [registry/base/ui/sidebar.tsx](../../base/ui/sidebar.tsx), and [ui.wisty.ai/sidebar](https://ui.wisty.ai/sidebar) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Lays out an app's side navigation, with groups, a header and a footer. Collapses, and becomes a sheet on small screens.

```bash
npx shadcn@latest add @wisty/sidebar
```

## Examples

- `default` (Reports navigation): The Reports app's nav in two sections, with icons, badges, the active page and a disabled item, beside a page with the trigger.
- `links` (Links): Items that link to pages, through `asChild` on Radix or `render` on Base UI, the current page set with `isActive` and `aria-current="page"`.
- `in-page` (In a page): Navigation between the sections of one page, beside their content, with `collapsible="none"` on `Sidebar` and `min-h-0` on the provider.
- `shaded` (Shaded): The nav on the gray page beside a white content panel, set with `variant="inset"` on `Sidebar`.
- `compact` (Compact): Small rows for a long list in little vertical space, set with `size="sm"` on each `SidebarMenuButton`.
- `quick-find` (Quick Find): A `SidebarInput` in `SidebarHeader` that filters the items, as Setup's Quick Find.
- `overflow` (Show more): A section that shows its first items and a Show more row that reveals the rest, as SLDS's overflow.
- `nested` (Nested items and actions): A `SidebarMenuSub` under an item, a `SidebarMenuAction` on rows, a `SidebarGroupAction` on a title, and a `SidebarSeparator`.
- `icon` (Icon rail): Collapsed with `collapsible="icon"` on `Sidebar`, each button naming itself with `tooltip`, under an app header and over a footer menu.

## When to use

- For the navigation of an app: its objects, pages or Setup sections, in groups with titles.
- For a list of destinations that stays on screen while the content changes, like Reports' folders or Object Manager's objects.
- For an app shell that collapses its navigation to make room and moves it into a sheet on small screens.
- For navigation inside one page, between the sections of a settings page or a folder list beside its content, with `collapsible="none"`, as the In a page example does.

## When not to use

- To switch between views of one record or page. Use Tabs.
- For a short list of links at the top of a page. Use Breadcrumb.
- For a menu of commands that opens from a button. Use Dropdown Menu.
- For a deep tree of nodes that expand in place, like Setup's object tree. Use Tree.

## Usage

```text
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   └── SidebarGroup
│   │       ├── SidebarGroupLabel
│   │       └── SidebarGroupContent
│   │           └── SidebarMenu
│   │               └── SidebarMenuItem
│   │                   ├── SidebarMenuButton
│   │                   ├── SidebarMenuBadge
│   │                   └── SidebarMenuSub
│   │                       └── SidebarMenuSubItem
│   │                           └── SidebarMenuSubButton
│   └── SidebarFooter
└── SidebarInset
    └── SidebarTrigger
```

Each `SidebarMenuButton` holds an icon and then its label in a `span`, last, so the label truncates.

```tsx
import { HomeIcon } from "lucide-react"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
```

```tsx
<SidebarMenuItem>
  <SidebarMenuButton isActive aria-current="page">
    <HomeIcon />
    <span>Home</span>
  </SidebarMenuButton>
</SidebarMenuItem>
```

The examples hold the selected row in state, so a click selects it; an app derives the active item from its route and sets `isActive` and `aria-current="page"` on the current page's row.

`collapsible` on `Sidebar` sets how it closes: `offcanvas` slides it off screen, `icon` shrinks it to an icon rail, and `none` keeps it open at every width, with no sheet on small screens. A button's `tooltip` shows only on the icon rail. `showOnHover` on `SidebarMenuAction` hides the action until its row is hovered or focused, on screens 768px and wider.

Items are buttons. For an item that goes to a page, pass `asChild` with an `<a>` in Radix projects, or `render={<a href="…" />}` in Base UI projects, as the Links example does; `SidebarMenuSubButton` is a link already. In Radix projects, items with a `tooltip` need a `TooltipProvider` around the app.

The provider writes its state to a `sidebar_state` cookie but never reads it. Read the cookie on the server and pass it as `defaultOpen`, or the sidebar opens on every load.

The app shell's provider goes around the whole app, once. A page's own navigation gets its own `SidebarProvider` around just that region, with `className="min-h-0"` so it doesn't fill the screen, and a `Sidebar` with `collapsible="none"`, which never collapses or moves into a sheet. It has no border of its own: add `border-e border-sidebar-border` on the side that meets the content, or `variant="inset"` for the shaded nav on a gray region. Every provider on the page listens for Ctrl+B and writes the same cookie. A `collapsible="none"` sidebar ignores its open state, so leave `SidebarTrigger` out of the region.

## Rules

- Use `variant="inset"` for the shaded nav and `size="sm"` on the buttons for the compact nav. Don't restyle rows, bars or tints with utility classes.
- Make an item a link when it goes to a page, and a button when it changes something on the page, as Show more does.
- Use `size="lg"` for a row in the header or footer, so its avatar lines up with the section titles.
- Use lucide icons as bare children. Don't import Salesforce icons into a primitive.

## API reference

| Part | Built on |
| --- | --- |
| `SidebarProvider` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `Sidebar` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarTrigger` | [Button](https://ui.wisty.ai/button#api-Button) |
| `SidebarRail` | [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) |
| `SidebarInset` | [`<main>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main) |
| `SidebarInput` | [Input](https://ui.wisty.ai/input#api-Input) |
| `SidebarHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarSeparator` | [Separator](https://ui.wisty.ai/separator#api-Separator) |
| `SidebarContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarGroupLabel` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarGroupAction` | [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) |
| `SidebarGroupContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarMenu` | [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul) |
| `SidebarMenuItem` | [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li) |
| `SidebarMenuButton` | [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) |
| `SidebarMenuAction` | [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) |
| `SidebarMenuBadge` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarMenuSkeleton` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `SidebarMenuSub` | [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul) |
| `SidebarMenuSubItem` | [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li) |
| `SidebarMenuSubButton` | [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) |

### SidebarProvider

| Prop | Type | Default |
| --- | --- | --- |
| `defaultOpen`? | `boolean` | `true` |
| `open`? | `boolean` |  |
| `onOpenChange`? | `(open: boolean) => void` |  |

### Sidebar

| Prop | Type | Default |
| --- | --- | --- |
| `side`? | `"left" \| "right"` | `"left"` |
| `variant`? | `"sidebar" \| "floating" \| "inset"` | `"sidebar"` |
| `collapsible`? | `"offcanvas" \| "icon" \| "none"` | `"offcanvas"` |

### SidebarGroupLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |

### SidebarGroupAction

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |

### SidebarMenuButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |
| `isActive`? | `boolean` | `false` |  |
| `tooltip`? | `string \| React.ComponentProps<typeof TooltipContent>` |  |  |
| `variant`? | `"default" \| "outline"` | `"default"` |  |
| `size`? | `"default" \| "sm" \| "lg"` | `"default"` |  |

### SidebarMenuAction

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |
| `showOnHover`? | `boolean` | `false` |  |

### SidebarMenuSkeleton

| Prop | Type | Default |
| --- | --- | --- |
| `showIcon`? | `boolean` | `false` |

### SidebarMenuSubButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |
| `size`? | `"sm" \| "md"` | `"md"` |  |
| `isActive`? | `boolean` | `false` |  |

### useSidebar

Returns `SidebarContextProps`.

### SidebarContextProps

| Member | Type | Default |
| --- | --- | --- |
| `state` | `"expanded" \| "collapsed"` |  |
| `open` | `boolean` |  |
| `setOpen` | `(open: boolean) => void` |  |
| `openMobile` | `boolean` |  |
| `setOpenMobile` | `(open: boolean) => void` |  |
| `isMobile` | `boolean` |  |
| `toggleSidebar` | `() => void` |  |

## SLDS mapping

The shell is shadcn's. The list inside it is SLDS 2's vertical navigation, `slds-nav-vertical`.

- `SidebarGroup` is `slds-nav-vertical__section` and `SidebarGroupLabel` is `slds-nav-vertical__title`.
- `SidebarMenuButton` is `slds-nav-vertical__action`. Rows in `SidebarHeader` or `SidebarFooter` aren't navigation, so they don't take its states.
- `SidebarMenuBadge` is `slds-badge` at the end of the row.
- `SidebarMenuSubButton` is the same row indented one level, as SLDS's tree indents.

Known gaps:

- SLDS's nav doesn't collapse, float, nest or have a header or footer. `floating`, `collapsible="icon"`, `SidebarRail`, `SidebarHeader`, `SidebarFooter`, `SidebarMenuAction`, `SidebarGroupAction`, `SidebarMenuSub` and `SidebarMenuSkeleton` are shadcn's, built from the theme tokens.
- SLDS's Show more row is a pattern, not a part. Build it from a `SidebarMenuButton` with `aria-expanded` and `aria-controls` after the list, as the Show more example does.
- Icons are lucide's, not SLDS's utility icons.

## Keyboard interactions

| Keys          | Action                                                                         |
| ------------- | ------------------------------------------------------------------------------ |
| Ctrl+B, Cmd+B | Toggles the sidebar from anywhere on the page.                                 |
| Escape        | On a small screen, closes the sheet. On the icon rail, closes an open tooltip. |

## Accessibility

- Wrap the groups in a `nav` with an `aria-label` so the navigation is a landmark. `Sidebar` itself is a `div`.
- Set `aria-current="page"` next to `isActive` on the current page's item. `isActive` only sets the look.
- Say what a badge counts in the item's name. `SidebarMenuBadge` sits beside the button, so its number isn't part of the name: put the count and its meaning in an `sr-only` span inside the label's `span` (`: 3 new items`), and mark the badge `aria-hidden`, as the Reports navigation example does.
- Give `SidebarMenuAction`, `SidebarGroupAction` and `SidebarInput` an `aria-label`.
- On the icon rail, each item's `tooltip` names it on hover and focus. Keep the label in the item too; it's the item's name.
- On a small screen the sidebar is a modal dialog with its close button hidden. Escape, the backdrop and the trigger close it.
- In Lightning Blue, `SidebarMenuBadge` has 3.65:1 contrast, below WCAG AA's 4.5:1 for its text size. Salesforce's own badge has the same limitation.

## Motion

- Collapsing and expanding slides the nav over 200ms, in every theme. On a small screen the sheet slides in as Sheet does.
- With reduced motion nothing slides. The sheet's backdrop still fades.

## Responsive behavior

- The sidebar is 16rem wide, 3rem as an icon rail and 18rem in the sheet. Set `--sidebar-width` and `--sidebar-width-icon` on the provider's `style` to change the first two. The sheet's width is fixed.
- Below 768px the trigger opens a sheet instead. The breakpoint lives in the `use-mobile` hook and in the `md:` classes; change both together.
- `SidebarContent` scrolls; the header and footer stay put.

## Performance

- Every item renders up front. Hundreds are fine; for thousands, filter them as the Quick Find example does.
- On the server the desktop sidebar renders, hidden on a small screen, and the sheet takes over after hydration.

## Example code

### Reports navigation

The Reports app's nav in two sections, with icons, badges, the active page and a disabled item, beside a page with the trigger.

```tsx
"use client"

import { useState } from "react"
import {
  ClockIcon,
  FolderIcon,
  FoldersIcon,
  GlobeIcon,
  LayoutListIcon,
  LockIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const frame =
  "h-120 min-h-0 overflow-hidden rounded-(--radius-3) border border-border contain-layout"

type Item = {
  label: string
  icon: LucideIcon
  badge?: number
  disabled?: boolean
}

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Reports",
    items: [
      { label: "Recent", icon: ClockIcon },
      { label: "Created by Me", icon: UserIcon, badge: 3 },
      { label: "Private Reports", icon: LockIcon },
      { label: "Public Reports", icon: GlobeIcon, badge: 12 },
      { label: "All Reports", icon: LayoutListIcon },
    ],
  },
  {
    title: "Folders",
    items: [
      { label: "My Folders", icon: FolderIcon },
      { label: "Shared with Me", icon: UsersIcon },
      { label: "All Folders", icon: FoldersIcon },
      { label: "Deleted Items", icon: Trash2Icon, disabled: true },
    ],
  },
]

export default function SidebarDefault() {
  const [current, setCurrent] = useState("Created by Me")

  return (
    <SidebarProvider className={frame}>
      <Sidebar className="h-full">
        <SidebarContent>
          <nav aria-label="Reports" className="flex flex-col gap-2">
            {groups.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          disabled={item.disabled}
                          isActive={item.label === current}
                          aria-current={
                            item.label === current ? "page" : undefined
                          }
                          onClick={() => setCurrent(item.label)}
                        >
                          <item.icon />
                          <span>
                            {item.label}
                            {item.badge !== undefined && (
                              <span className="sr-only">
                                : {item.badge} new items
                              </span>
                            )}
                          </span>
                        </SidebarMenuButton>
                        {item.badge !== undefined && (
                          <SidebarMenuBadge aria-hidden="true">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="font-semibold text-heading">{current}</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          The reports in this view, most recent first.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Links

Items that link to pages, through `asChild` on Radix or `render` on Base UI, the current page set with `isActive` and `aria-current="page"`.

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { frame } from "./default"

const current = "/lightning/o/Account/home"

const sections = [
  {
    title: "Sales",
    links: [
      { label: "Home", href: "/lightning/page/home" },
      { label: "Accounts", href: "/lightning/o/Account/home" },
      { label: "Contacts", href: "/lightning/o/Contact/home" },
      { label: "Opportunities", href: "/lightning/o/Opportunity/home" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Salesforce Help", href: "https://help.salesforce.com" },
      { label: "Trailhead", href: "https://trailhead.salesforce.com" },
    ],
  },
]

export default function SidebarLinks() {
  return (
    <SidebarProvider className={frame}>
      <Sidebar className="h-full">
        <SidebarContent>
          <nav aria-label="Sales" className="flex flex-col gap-2">
            {sections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.links.map((link) => (
                      <SidebarMenuItem key={link.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={link.href === current}
                          aria-current={
                            link.href === current ? "page" : undefined
                          }
                        >
                          <a href={link.href}>
                            <span>{link.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="font-semibold text-heading">Accounts</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          Accounts you viewed recently.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### In a page

Navigation between the sections of one page, beside their content, with `collapsible="none"` on `Sidebar` and `min-h-0` on the provider.

```tsx
"use client"

import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const sections = [
  {
    title: "Personal",
    items: [
      "Personal Information",
      "Language & Time Zone",
      "Approver Settings",
    ],
  },
  {
    title: "Display & Layout",
    items: ["Customize My Tabs", "Change My Display"],
  },
]

const descriptions: Record<string, string> = {
  "Personal Information": "Your name, email, phone and address.",
  "Language & Time Zone":
    "The language, locale and time zone that dates, numbers and currencies show in.",
  "Approver Settings":
    "Who approves your requests, and how you hear about them.",
  "Customize My Tabs": "The tabs each of your apps shows, and their order.",
  "Change My Display": "How dense lists and records are on your screen.",
}

export default function SidebarInPage() {
  const [selected, setSelected] = useState("Language & Time Zone")

  return (
    <SidebarProvider className="min-h-0 overflow-hidden rounded-(--radius-3) border border-border">
      <Sidebar collapsible="none" className="border-e border-sidebar-border">
        <SidebarContent>
          <nav aria-label="My Settings" className="flex flex-col gap-2">
            {sections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton
                          isActive={item === selected}
                          aria-current={item === selected ? "page" : undefined}
                          onClick={() => setSelected(item)}
                        >
                          <span>{item}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 p-4">
        <h2 className="font-semibold text-heading">{selected}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {descriptions[selected]}
        </p>
      </div>
    </SidebarProvider>
  )
}
```

### Shaded

The nav on the gray page beside a white content panel, set with `variant="inset"` on `Sidebar`.

```tsx
"use client"

import { useState } from "react"
import {
  ClockIcon,
  GlobeIcon,
  LayoutListIcon,
  LockIcon,
  UserIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { frame } from "./default"

const items = [
  { label: "Recent", icon: ClockIcon },
  { label: "Created by Me", icon: UserIcon, badge: 3 },
  { label: "Private Reports", icon: LockIcon },
  { label: "Public Reports", icon: GlobeIcon },
  { label: "All Reports", icon: LayoutListIcon },
]

export default function SidebarShaded() {
  const [current, setCurrent] = useState("Created by Me")

  return (
    <SidebarProvider className={frame}>
      <Sidebar variant="inset" className="h-full">
        <SidebarContent>
          <nav aria-label="Reports" className="flex flex-col gap-2">
            <SidebarGroup>
              <SidebarGroupLabel>Reports</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={item.label === current}
                        aria-current={
                          item.label === current ? "page" : undefined
                        }
                        onClick={() => setCurrent(item.label)}
                      >
                        <item.icon />
                        <span>
                          {item.label}
                          {item.badge !== undefined && (
                            <span className="sr-only">
                              : {item.badge} new items
                            </span>
                          )}
                        </span>
                      </SidebarMenuButton>
                      {item.badge !== undefined && (
                        <SidebarMenuBadge aria-hidden="true">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </nav>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="font-semibold text-heading">{current}</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          The reports in this view, most recent first.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Compact

Small rows for a long list in little vertical space, set with `size="sm"` on each `SidebarMenuButton`.

```tsx
"use client"

import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { frame } from "./default"

const sections = [
  {
    title: "Administration",
    items: [
      "Users",
      "Profiles",
      "Permission Sets",
      "Roles",
      "Public Groups",
      "Queues",
    ],
  },
  {
    title: "Platform Tools",
    items: ["Apps", "Objects and Fields", "Flows", "Email", "Custom Code"],
  },
]

export default function SidebarCompact() {
  const [current, setCurrent] = useState("Profiles")

  return (
    <SidebarProvider className={frame}>
      <Sidebar className="h-full">
        <SidebarContent>
          <nav aria-label="Setup" className="flex flex-col gap-2">
            {sections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton
                          size="sm"
                          isActive={item === current}
                          aria-current={item === current ? "page" : undefined}
                          onClick={() => setCurrent(item)}
                        >
                          <span>{item}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="font-semibold text-heading">{current}</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          Settings for the selected Setup page.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Quick Find

A `SidebarInput` in `SidebarHeader` that filters the items, as Setup's Quick Find.

```tsx
"use client"

import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { frame } from "./default"

const sections = [
  {
    title: "Administration",
    items: ["Users", "Profiles", "Permission Sets", "Roles"],
  },
  {
    title: "Platform Tools",
    items: ["Apps", "Objects and Fields", "Flows", "Email"],
  },
]

export default function SidebarQuickFind() {
  const [query, setQuery] = useState("")
  const [current, setCurrent] = useState("Users")
  const matches = (item: string) =>
    item.toLowerCase().includes(query.trim().toLowerCase())
  const shown = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(matches),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <SidebarProvider className={frame}>
      <Sidebar className="h-full">
        <SidebarHeader>
          <SidebarInput
            type="search"
            aria-label="Quick Find"
            placeholder="Quick Find"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label="Setup" className="flex flex-col gap-2">
            {shown.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton
                          isActive={item === current}
                          aria-current={item === current ? "page" : undefined}
                          onClick={() => setCurrent(item)}
                        >
                          <span>{item}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
            {shown.length === 0 && (
              <p className="px-6 py-2 text-sm text-muted-foreground">
                No items match.
              </p>
            )}
          </nav>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="font-semibold text-heading">{current}</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          Type in Quick Find to filter the Setup menu.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Show more

A section that shows its first items and a Show more row that reveals the rest, as SLDS's overflow.

```tsx
"use client"

import { useId, useState } from "react"
import { ChevronRightIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { frame } from "./default"

const shown = ["Recent", "Created by Me", "Private Reports"]
const more = ["Public Reports", "All Reports", "Deleted Reports"]

export default function SidebarOverflow() {
  const [current, setCurrent] = useState("Recent")
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <SidebarProvider className={frame}>
      <Sidebar className="h-full">
        <SidebarContent>
          <nav aria-label="Reports" className="flex flex-col gap-2">
            <SidebarGroup>
              <SidebarGroupLabel>Reports</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {shown.map((item) => (
                    <SidebarMenuItem key={item}>
                      <SidebarMenuButton
                        isActive={item === current}
                        aria-current={item === current ? "page" : undefined}
                        onClick={() => setCurrent(item)}
                      >
                        <span>{item}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
                <SidebarMenuButton
                  aria-expanded={open}
                  aria-controls={id}
                  onClick={() => setOpen(!open)}
                  className="font-semibold text-link in-data-[sidebar=content]:hover:not-data-active:text-link-hover aria-expanded:[&>svg]:rotate-90 motion-reduce:[&>svg]:transition-none [&>svg]:text-(--sidebar-item-foreground) [&>svg]:transition-transform"
                >
                  <ChevronRightIcon />
                  <span>{open ? "Show less" : "Show more"}</span>
                </SidebarMenuButton>
                <div id={id} hidden={!open}>
                  <SidebarMenu>
                    {more.map((item) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton
                          isActive={item === current}
                          aria-current={item === current ? "page" : undefined}
                          onClick={() => setCurrent(item)}
                        >
                          <span>{item}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </nav>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="font-semibold text-heading">{current}</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          The reports in this view, most recent first.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Nested items and actions

A `SidebarMenuSub` under an item, a `SidebarMenuAction` on rows, a `SidebarGroupAction` on a title, and a `SidebarSeparator`.

```tsx
"use client"

import { useState } from "react"
import {
  BoxIcon,
  EllipsisIcon,
  PlusIcon,
  SettingsIcon,
  WorkflowIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { frame } from "./default"

const accountPages = [
  "Fields and Relationships",
  "Page Layouts",
  "Record Types",
]

export default function SidebarNested() {
  const [current, setCurrent] = useState("Page Layouts")

  return (
    <SidebarProvider className={frame}>
      <Sidebar className="h-full">
        <SidebarContent>
          <nav aria-label="Object Manager" className="flex flex-col gap-2">
            <SidebarGroup>
              <SidebarGroupLabel>Objects</SidebarGroupLabel>
              <SidebarGroupAction aria-label="New object">
                <PlusIcon />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={current === "Account"}
                      aria-current={current === "Account" ? "page" : undefined}
                      onClick={() => setCurrent("Account")}
                    >
                      <BoxIcon />
                      <span>Account</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover aria-label="Account actions">
                      <EllipsisIcon />
                    </SidebarMenuAction>
                    <SidebarMenuSub>
                      {accountPages.map((page) => (
                        <SidebarMenuSubItem key={page}>
                          <SidebarMenuSubButton
                            href="#"
                            isActive={page === current}
                            aria-current={page === current ? "page" : undefined}
                            onClick={() => setCurrent(page)}
                          >
                            <span>{page}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={current === "Contact"}
                      aria-current={current === "Contact" ? "page" : undefined}
                      onClick={() => setCurrent("Contact")}
                    >
                      <BoxIcon />
                      <span>Contact</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover aria-label="Contact actions">
                      <EllipsisIcon />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Automation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={current === "Flows"}
                      aria-current={current === "Flows" ? "page" : undefined}
                      onClick={() => setCurrent("Flows")}
                    >
                      <WorkflowIcon />
                      <span>Flows</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={current === "Process Automation Settings"}
                      aria-current={
                        current === "Process Automation Settings"
                          ? "page"
                          : undefined
                      }
                      onClick={() => setCurrent("Process Automation Settings")}
                    >
                      <SettingsIcon />
                      <span>Process Automation Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </nav>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <span className="font-semibold text-heading">{current}</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">
          Hover an object for its actions.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Icon rail

Collapsed with `collapsible="icon"` on `Sidebar`, each button naming itself with `tooltip`, under an app header and over a footer menu.

```tsx
"use client"

import { useState } from "react"
import {
  BuildingIcon,
  ChartNoAxesColumnIcon,
  CloudIcon,
  HouseIcon,
  LayoutListIcon,
  UserRoundIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import { frame } from "./default"

const items = [
  { label: "Home", icon: HouseIcon },
  { label: "Accounts", icon: BuildingIcon },
  { label: "Opportunities", icon: LayoutListIcon },
  { label: "Reports", icon: ChartNoAxesColumnIcon },
]

export default function SidebarIcon() {
  const [current, setCurrent] = useState("Accounts")

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false} className={frame}>
        <Sidebar collapsible="icon" className="h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Sales">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-(--radius-2) bg-sidebar-primary text-sidebar-primary-foreground">
                    <CloudIcon />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-semibold text-heading">Sales</span>
                    <span className="text-xs text-muted-foreground">
                      Lightning app
                    </span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <nav aria-label="Sales" className="flex flex-col gap-2">
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={item.label === current}
                          aria-current={
                            item.label === current ? "page" : undefined
                          }
                          onClick={() => setCurrent(item.label)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Ada Lovelace">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-container text-muted-foreground">
                    <UserRoundIcon />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-semibold text-heading">
                      Ada Lovelace
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ada@acme.example
                    </span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-3 border-b border-border px-4">
            <SidebarTrigger />
            <span className="font-semibold text-heading">{current}</span>
          </header>
          <p className="p-4 text-sm text-muted-foreground">
            Press the trigger, or the sidebar's edge, to expand it. Hover an
            icon for its name.
          </p>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
```
