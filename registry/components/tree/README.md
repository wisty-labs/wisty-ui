# Tree

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/tree](https://ui.wisty.ai/tree) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a hierarchy people open level by level and pick one item from. For rows with columns, use Data table.

```bash
npx shadcn@latest add @wisty/tree
```

## Examples

- `default` (Account hierarchy): A parent account with its subsidiaries and sites, a city under each name, opened down to the selected site.
- `header` (With a header): A role hierarchy under a `TreeHeader` title, which names the tree through its id in `aria-labelledby`.
- `links` (Links): Report folders whose reports have an `href`: a click or Enter opens one, and arrow keys only move the selection.
- `icons` (With icons): A record's related records with an object `icon` before each label, and a lock as the `endIcon` of a private opportunity.
- `disabled` (Disabled): Inactive territories set `disabled`: the keyboard skips them, and Latin America can't open.
- `filterable` (Filtering): Setup's Quick Find: the search field sets `filter`, the tree keeps the matches and opens the items above them.
- `lazy-loading` (Loading children): Libraries set `loading` until their folders arrive: opening one shows a spinner while `onExpandedChange` fetches them.

## When to use

- People browse a hierarchy and pick one item from it: an account hierarchy, a role or territory hierarchy, report folders, Setup's menu. It replaces `lightning-tree`.
- The hierarchy is deeper than two levels, or long enough that people need to open and close branches to find their way.
- Items are places to go: give them an `href` and the tree is a navigation list.
- People search the hierarchy by name. Pass the search field's text as `filter`.
- A branch's children come from a request. Mark it `loading` and add its `items` when they arrive.

## When not to use

- Each item has several values to compare in columns. Use Data table.
- The app's main navigation, a flat list of pages with a few groups. Use Sidebar.
- One section that shows or hides more content. Use Collapsible, or Accordion for several.
- People pick a value for a form field. Use Select, or Combobox to filter as they type.

## Usage

```tsx
import { Tree, type TreeItem } from "@/components/wisty/tree"
```

```tsx
<Tree
  aria-label="Account hierarchy"
  items={[
    {
      name: "global-media",
      label: "Global Media",
      metatext: "Toronto",
      items: [{ name: "global-media-us", label: "Global Media US" }],
    },
  ]}
  defaultSelected="global-media-us"
/>
```

Items are data, not parts: each has a unique `name`, which `selected`, `expanded` and the callbacks use, and nests its children in `items`. The selected item's parents open on first render. `onExpandedChange` gets every open item's name, so the item that just opened is the one not in your last list:

```tsx
function Libraries() {
  const [expanded, setExpanded] = useState<string[]>([])
  return (
    <Tree
      aria-label="Libraries"
      items={libraries}
      expanded={expanded}
      onExpandedChange={(names) => {
        const opened = names.filter((name) => !expanded.includes(name))
        setExpanded(names)
        opened.forEach(loadFolders)
      }}
    />
  )
}
```

A title above the tree is a `TreeHeader` the page writes, with its id in the tree's `aria-labelledby` (the With a header example).

`filterTreeItems(items, filter)` returns what the tree shows for a filter. When its `length` is 0, show a no-results message beside the tree, as the Filtering example does.

## Rules

- Give every item a `name` that's unique in the whole tree, not just among its siblings.
- Keep items' meaning in `label` and `metatext`. They're the item's name for screen readers, and what `filter` searches.
- Pass a new `items` array to change the tree, as React state. A loading branch keeps `loading` until its `items` are set.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `Tree` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |
| `TreeHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | A title above a tree. Give it an id and pass that to the tree's `aria-labelledby`. |

### Tree

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TreeItem[]` |  | The tree's items, nested through each item's `items`. |
| `selected`? | `string \| null` |  | The selected item's name. `null` selects none. |
| `defaultSelected`? | `string \| null` | `null` |  |
| `onSelectedChange`? | `(name: string) => void` |  | Called with the item's name when a click or a key selects another item. |
| `expanded`? | `string[]` |  | The names of the open items. |
| `defaultExpanded`? | `string[]` | `[]` | The names of the open items at first. The selected item's parents open too. |
| `onExpandedChange`? | `(names: string[]) => void` |  | Called with every open item's name when one opens or closes. |
| `filter`? | `string` |  | Shows only the items whose label or metatext contains it, their parents open and the text marked. |

### filterTreeItems

The items a filter leaves: every item whose label or metatext contains it (ignoring case) with all of its children, and the items above each one. An empty filter leaves them all. Check `.length` for an empty result.

| Parameter | Type | Default |
| --- | --- | --- |
| `items` | `TreeItem[]` |  |
| `filter`? | `string` |  |

Returns `TreeItem[]`.

### TreeItem

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | Unique across the tree: what selection and expansion are keyed by. |
| `label` | `string` |  |  |
| `metatext`? | `string` |  | A second line under the label, like a type or a city. |
| `href`? | `string` |  | Makes the label a link. It opens on click or Enter, never on arrow keys. |
| `disabled`? | `boolean` |  | Can't be focused, selected or opened, and neither can anything under it. |
| `icon`? | `React.ReactNode` |  | Before the label. Decorative: put the meaning in the label or metatext. |
| `endIcon`? | `React.ReactNode` |  | After the label, at the row's end. Decorative, as icon. |
| `loading`? | `boolean` |  | A branch whose children are on their way: it opens to a spinner. |
| `items`? | `TreeItem[]` |  | Children. An item without any is a leaf, unless it's loading. |

## SLDS mapping

`Tree` is `slds-tree_container` around the `slds-tree`. `TreeHeader` is `slds-tree__group-header`, drawn as a title rather than lightning-tree's `h4`, so it never breaks the page's heading order. Each item is a `role="treeitem"` around its `slds-tree__item` row: the chevron (`slds-button_icon`, `slds-hidden` on a leaf), then `slds-tree__item-label` and `slds-tree__item-meta` in `slds-has-flexi-truncate`. A label with an `href` is inside an `a`. Children sit in a `role="group"`. A filter's matches use SLDS's `mark` style.

Known gaps:

- The chevron is lucide's, where SLDS draws `utility:chevronright`.
- `icon`, `endIcon`, `filter` and `loading` have no SLDS markup. The icons sit before and after the label with x-small margins, and a loading branch shows SLDS's x-small inline spinner in place of its children.
- No width cap. SLDS stops a tree at 25rem; set `max-w-100` with `className` to match.
- One item selected at a time. SLDS's multi-select tree isn't covered.

## Keyboard interactions

| Key         | Action                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------- |
| Down arrow  | Moves focus and selection to the next item, skipping disabled ones.                         |
| Up arrow    | Moves focus and selection to the previous item.                                             |
| Right arrow | Opens a closed branch. On an open branch, moves to its first child. Does nothing on a leaf. |
| Left arrow  | Closes an open branch. Otherwise moves to the parent.                                       |
| Home        | Moves to the first item.                                                                    |
| End         | Moves to the last item that's showing.                                                      |
| Enter       | Selects the item, and opens its link if it has one.                                         |
| Space       | Selects the item.                                                                           |
| \*          | Opens every branch beside the focused item.                                                 |
| Letters     | Moves to the next item whose label starts with the typed letters.                           |

The tree is one tab stop, on the selected item. When that item is inside a closed branch, the tab stop is the closed branch.

## Accessibility

- Name the tree with `aria-label`, or with `aria-labelledby` pointing at a `TreeHeader` or a heading of the page's own.
- Selection follows focus, so `onSelectedChange` runs on every arrow key. Don't navigate or load a page from it; give items an `href` instead, which opens only on a click or Enter.
- Each item is read as its label, then its metatext. Icons are hidden from screen readers: put what an icon means in the label or the metatext.
- A disabled item and everything under it are skipped by the keyboard and can't be selected or opened.

## Motion

- The chevron turns over 0.2s when a branch opens or closes. With reduced motion it turns at once.

## Performance

- Every open item renders. For thousands of items, keep branches closed and load their children when they open.

## Example code

### Account hierarchy

A parent account with its subsidiaries and sites, a city under each name, opened down to the selected site.

```tsx
import { Tree, type TreeItem } from "@/components/wisty/tree"

const accounts: TreeItem[] = [
  {
    name: "united-oil-gas-corp",
    label: "United Oil & Gas Corp.",
    metatext: "New York, NY",
    items: [
      {
        name: "united-oil-gas-uk",
        label: "United Oil & Gas, UK",
        metatext: "London, UK",
        items: [
          {
            name: "united-oil-gas-aberdeen",
            label: "United Oil & Gas, Aberdeen",
            metatext: "Aberdeen, UK",
          },
          {
            name: "united-oil-gas-pembroke",
            label: "United Oil & Gas, Pembroke",
            metatext: "Pembroke, UK",
          },
        ],
      },
      {
        name: "united-oil-gas-singapore",
        label: "United Oil & Gas, Singapore",
        metatext: "Singapore",
        items: [
          {
            name: "united-oil-gas-jurong",
            label: "United Oil & Gas, Jurong Island",
            metatext: "Singapore",
          },
        ],
      },
      {
        name: "united-oil-gas-houston",
        label: "United Oil & Gas, Houston",
        metatext: "Houston, TX",
      },
    ],
  },
]

export default function TreeDefault() {
  return (
    <Tree
      aria-label="Account hierarchy"
      items={accounts}
      defaultSelected="united-oil-gas-aberdeen"
      className="max-w-100"
    />
  )
}
```

### With a header

A role hierarchy under a `TreeHeader` title, which names the tree through its id in `aria-labelledby`.

```tsx
import { useId } from "react"

import { Tree, TreeHeader, type TreeItem } from "@/components/wisty/tree"

const roles: TreeItem[] = [
  {
    name: "ceo",
    label: "CEO",
    items: [
      {
        name: "svp-sales-marketing",
        label: "SVP, Sales & Marketing",
        items: [
          {
            name: "vp-north-american-sales",
            label: "VP, North American Sales",
            items: [
              { name: "eastern-sales-team", label: "Eastern Sales Team" },
              { name: "western-sales-team", label: "Western Sales Team" },
            ],
          },
          { name: "vp-international-sales", label: "VP, International Sales" },
          { name: "vp-marketing", label: "VP, Marketing" },
        ],
      },
      {
        name: "svp-customer-service",
        label: "SVP, Customer Service & Support",
        items: [
          {
            name: "customer-support-na",
            label: "Customer Support, North America",
          },
          {
            name: "customer-support-intl",
            label: "Customer Support, International",
          },
        ],
      },
      { name: "cfo", label: "CFO" },
      { name: "coo", label: "COO" },
    ],
  },
]

export default function TreeWithHeader() {
  const headerId = useId()

  return (
    <div className="w-full max-w-100">
      <TreeHeader id={headerId}>Role hierarchy</TreeHeader>
      <Tree
        aria-labelledby={headerId}
        items={roles}
        defaultExpanded={["ceo"]}
        defaultSelected="vp-north-american-sales"
      />
    </div>
  )
}
```

### Links

Report folders whose reports have an `href`: a click or Enter opens one, and arrow keys only move the selection.

```tsx
import { Tree, type TreeItem } from "@/components/wisty/tree"

const reports: TreeItem[] = [
  {
    name: "sales-reports",
    label: "Sales Reports",
    items: [
      {
        name: "pipeline-by-stage",
        label: "Pipeline by Stage",
        href: "#pipeline-by-stage",
      },
      {
        name: "closed-won-this-quarter",
        label: "Closed Won This Quarter",
        href: "#closed-won-this-quarter",
      },
      {
        name: "opportunities-by-owner",
        label: "Opportunities by Owner",
        href: "#opportunities-by-owner",
      },
    ],
  },
  {
    name: "service-reports",
    label: "Service Reports",
    items: [
      {
        name: "open-cases-by-priority",
        label: "Open Cases by Priority",
        href: "#open-cases-by-priority",
      },
      {
        name: "case-resolution-time",
        label: "Case Resolution Time",
        href: "#case-resolution-time",
      },
    ],
  },
  {
    name: "private-reports",
    label: "Private Reports",
    items: [
      {
        name: "my-open-tasks",
        label: "My Open Tasks",
        href: "#my-open-tasks",
      },
    ],
  },
]

export default function TreeLinks() {
  return (
    <Tree
      aria-label="Report folders"
      items={reports}
      defaultExpanded={["sales-reports", "service-reports"]}
      defaultSelected="closed-won-this-quarter"
      className="max-w-100"
    />
  )
}
```

### With icons

A record's related records with an object `icon` before each label, and a lock as the `endIcon` of a private opportunity.

```tsx
import { Icon } from "@/components/wisty/icon"
import { Tree, type TreeItem } from "@/components/wisty/tree"

const records: TreeItem[] = [
  {
    name: "edge-communications",
    label: "Edge Communications",
    metatext: "Austin, TX",
    icon: <Icon name="standard:account" size="x-small" />,
    items: [
      {
        name: "edge-emergency-generator",
        label: "Edge Emergency Generator",
        metatext: "Closed Won",
        icon: <Icon name="standard:opportunity" size="x-small" />,
      },
      {
        name: "edge-installation",
        label: "Edge Installation",
        metatext: "Proposal/Price Quote, private",
        icon: <Icon name="standard:opportunity" size="x-small" />,
        endIcon: <Icon name="utility:lock" size="xx-small" />,
      },
      {
        name: "rose-gonzalez",
        label: "Rose Gonzalez",
        metatext: "SVP, Procurement",
        icon: <Icon name="standard:contact" size="x-small" />,
      },
      {
        name: "case-00001002",
        label: "Electrical wiring installation",
        metatext: "Case 00001002",
        icon: <Icon name="standard:case" size="x-small" />,
      },
    ],
  },
]

export default function TreeIcons() {
  return (
    <Tree
      aria-label="Related records"
      items={records}
      defaultExpanded={["edge-communications"]}
      defaultSelected="edge-communications"
      className="max-w-100"
    />
  )
}
```

### Disabled

Inactive territories set `disabled`: the keyboard skips them, and Latin America can't open.

```tsx
import { Tree, type TreeItem } from "@/components/wisty/tree"

const territories: TreeItem[] = [
  {
    name: "north-america",
    label: "North America",
    items: [
      { name: "us-west", label: "US West", metatext: "12 accounts" },
      { name: "us-east", label: "US East", metatext: "18 accounts" },
      {
        name: "canada",
        label: "Canada",
        metatext: "Inactive",
        disabled: true,
      },
    ],
  },
  {
    name: "emea",
    label: "EMEA",
    items: [
      { name: "uk-ireland", label: "UK & Ireland", metatext: "9 accounts" },
      { name: "dach", label: "DACH", metatext: "6 accounts" },
    ],
  },
  {
    name: "latam",
    label: "Latin America",
    metatext: "Inactive",
    disabled: true,
    items: [
      { name: "brazil", label: "Brazil" },
      { name: "mexico", label: "Mexico" },
    ],
  },
]

export default function TreeDisabled() {
  return (
    <Tree
      aria-label="Sales territories"
      items={territories}
      defaultExpanded={["north-america"]}
      defaultSelected="us-west"
      className="max-w-100"
    />
  )
}
```

### Filtering

Setup's Quick Find: the search field sets `filter`, the tree keeps the matches and opens the items above them.

```tsx
"use client"

import { useId, useState } from "react"

import { Input } from "@/components/ui/input"
import { filterTreeItems, Tree, type TreeItem } from "@/components/wisty/tree"

const setup: TreeItem[] = [
  {
    name: "administration",
    label: "Administration",
    items: [
      {
        name: "users",
        label: "Users",
        items: [
          { name: "users-list", label: "Users" },
          { name: "profiles", label: "Profiles" },
          { name: "permission-sets", label: "Permission Sets" },
          { name: "permission-set-groups", label: "Permission Set Groups" },
          { name: "roles", label: "Roles" },
        ],
      },
      {
        name: "data",
        label: "Data",
        items: [
          { name: "data-import-wizard", label: "Data Import Wizard" },
          { name: "data-export", label: "Data Export" },
        ],
      },
    ],
  },
  {
    name: "platform-tools",
    label: "Platform Tools",
    items: [
      {
        name: "objects-and-fields",
        label: "Objects and Fields",
        items: [
          { name: "object-manager", label: "Object Manager" },
          { name: "picklist-value-sets", label: "Picklist Value Sets" },
        ],
      },
      {
        name: "process-automation",
        label: "Process Automation",
        items: [
          { name: "flows", label: "Flows" },
          { name: "approval-processes", label: "Approval Processes" },
        ],
      },
    ],
  },
  {
    name: "settings",
    label: "Settings",
    items: [
      {
        name: "security",
        label: "Security",
        items: [
          { name: "session-settings", label: "Session Settings" },
          { name: "sharing-settings", label: "Sharing Settings" },
          { name: "network-access", label: "Network Access" },
        ],
      },
    ],
  },
]

export default function TreeFilterable() {
  const id = useId()
  const [filter, setFilter] = useState("")
  const empty = filterTreeItems(setup, filter).length === 0

  return (
    <div className="flex w-full max-w-100 flex-col gap-2">
      <Input
        type="search"
        placeholder="Quick Find"
        aria-label="Quick Find"
        aria-controls={`${id}-tree`}
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <Tree
        id={`${id}-tree`}
        aria-label="Setup"
        items={setup}
        defaultExpanded={["administration"]}
        filter={filter}
      />
      <p role="status" className="text-muted-foreground">
        {empty ? `No results for "${filter.trim()}".` : null}
      </p>
    </div>
  )
}
```

### Loading children

Libraries set `loading` until their folders arrive: opening one shows a spinner while `onExpandedChange` fetches them.

```tsx
"use client"

import { useState } from "react"

import { Tree, type TreeItem } from "@/components/wisty/tree"

const folders: Record<string, TreeItem[]> = {
  "sales-collateral": [
    { name: "product-sheets", label: "Product Sheets", metatext: "14 files" },
    { name: "case-studies", label: "Case Studies", metatext: "6 files" },
    { name: "pricing", label: "Pricing", metatext: "3 files" },
  ],
  "brand-assets": [
    { name: "logos", label: "Logos", metatext: "22 files" },
    { name: "templates", label: "Templates", metatext: "9 files" },
  ],
  contracts: [
    {
      name: "master-agreements",
      label: "Master Agreements",
      metatext: "41 files",
    },
    { name: "renewals", label: "Renewals", metatext: "17 files" },
  ],
}

const fetchFolders = (library: string) =>
  new Promise<TreeItem[]>((resolve) =>
    setTimeout(() => resolve(folders[library] ?? []), 1500)
  )

export default function TreeLazyLoading() {
  const [expanded, setExpanded] = useState<string[]>([])
  const [libraries, setLibraries] = useState<TreeItem[]>([
    { name: "sales-collateral", label: "Sales Collateral", loading: true },
    { name: "brand-assets", label: "Brand Assets", loading: true },
    { name: "contracts", label: "Contracts", loading: true },
  ])

  const onExpandedChange = (names: string[]) => {
    const opened = names.filter((name) => !expanded.includes(name))
    setExpanded(names)
    for (const name of opened) {
      if (!libraries.find((library) => library.name === name)?.loading) continue
      fetchFolders(name).then((items) =>
        setLibraries((current) =>
          current.map((library) =>
            library.name === name
              ? { ...library, loading: false, items }
              : library
          )
        )
      )
    }
  }

  return (
    <Tree
      aria-label="Libraries"
      items={libraries}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      className="max-w-100"
    />
  )
}
```
