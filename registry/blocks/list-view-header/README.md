# List view header

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/list-view-header](https://ui.wisty.ai/list-view-header) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

The top of a list page, where people switch list views, search and act. The header of Lightning's object home, for a standard or custom object.

```bash
npx shadcn@latest add @wisty/list-view-header
```

## Examples

- `default` (All Opportunities): The header alone with every control wired: the title opens the list views, the pin marks one, and the count follows the search.
- `narrow` (Narrow width): At phone width the actions, the search and Display as wrap, and `hasMoreItems` makes 50 loaded rows read as 50+ items.
- `loading` (Loading): With `loading` and `itemCount` null, the meta line holds its place and no count is guessed.

## When to use

- At the top of a list page: All Opportunities, My Cases, Recently Viewed Accounts.
- In place of Lightning's object home header: the list view switcher and pin, the item count and the sort and filter, the list's actions, and the list's controls: search, List View Controls, Display as, Refresh, Column sort, Edit list, Show charts and Show filters.
- Above a list the page draws itself, such as a kanban or its own table.

## When not to use

- For a list page whose table sits under the header in one frame. Use List view.
- For one record's page. Use Record header.
- For a list inside a record page, like a related list. Use a Card with the data table inside.
- For a page that isn't a list. Use Page header.

## Usage

```tsx
import { ListViewHeader } from "@/components/wisty/list-view-header"
```

```tsx
<ListViewHeader
  icon="standard:case"
  objectLabel="Cases"
  views={[
    { value: "AllOpenCases", label: "All Open Cases" },
    { value: "MyOpenCases", label: "My Open Cases" },
  ]}
  recentViews={["MyOpenCases"]}
  defaultView="MyOpenCases"
  itemCount={cases.length}
  sortedBy="Date/Time Opened"
  updated="a minute ago"
  actions={[{ value: "new", label: "New" }]}
  search={search}
  onSearchChange={setSearch}
  joined
/>
```

The header is only the header. The page filters its rows with the search text, swaps the rows when the list view changes, and passes the count it shows. The list view, the search and the display each take a value and an `on…Change`, or a default and keep their own state. The title opens the list view switcher, with `recentViews` under Recent List Views and the rest under All Other Lists. The pin shows when `pinnedView` is set and `onPinnedViewChange` is passed, and is pressed while the list view shown is the pinned one. The List View Controls menu holds Lightning's own items, and `onListControl` receives the one picked. Pass `joined` when a Data table sits directly below. List view's `ListView` draws one frame around both from the page header's tokens: a bordered card in Lightning Blue and nothing in Cosmos, where the table keeps its own rounded box.

## Rules

- Pass the handler of each control the page supports: `onPinnedViewChange`, `onSearchChange`, `onListControl`, `onDisplayChange`, `onRefresh`, `onColumnSort`, `onEditList`, `onShowCharts` and `onShowFilters`. A control without one doesn't show, so the header never offers what the page can't do.
- Pass `itemCount` as the number of rows the page has, and `hasMoreItems` when it has loaded only some of them, which shows "50+ items". Pass `null` when the count isn't known. Never pass 0 for a count you don't have.
- Pass `updated` as the page writes it ("a few seconds ago"), from the time the rows were read. The block never reads the clock.
- Pass `sortedBy` and `filteredBy` in the list view's own words: the field label and the filter's name.
- The object icons come from `@salesforce-ux/icons`, a dependency licensed CC BY-ND 4.0: use them unaltered, and credit them.
- Never pass `asChild` or `render`.

## API reference

### ListViewHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | ``standard:${string}` \| `custom:${string}` \| `action:${string}` \| `doctype:${string}` \| `utility:${string}`` |  | The object's icon: "standard:opportunity". |
| `objectLabel` | `string` |  | The object's label, plural: "Opportunities". |
| `views` | `ListViewHeaderView[]` |  | The list views the switcher offers, shown in the order given (Lightning's is by name). |
| `recentViews`? | `string[]` | `[]` | The values of the user's recently used list views, most recent first. |
| `view`? | `string` |  | The list view shown, by value. |
| `defaultView`? | `string` |  | The list view shown at first, uncontrolled. Default the first view. |
| `onViewChange`? | `(view: string) => void` |  | Runs with a list view's value when one is picked. |
| `pinnedView`? | `string \| null` |  | The value of the pinned list view; null when none is pinned. Leave undefined to hide the pin. |
| `onPinnedViewChange`? | `(view: string \| null) => void` |  | Runs with the view to pin when the pin is pressed, or null to unpin; the pin shows only with it. |
| `itemCount` | `number \| null` |  | How many rows the list has. null when it isn't known. |
| `hasMoreItems`? | `boolean` | `false` | More rows exist than `itemCount`, as when only the first 50 loaded. |
| `sortedBy`? | `string` |  | The field the list is sorted by, as labeled: "Opportunity Name". |
| `filteredBy`? | `string` |  | The filter the list applies, as named: "All opportunities". |
| `updated`? | `string` |  | When the list last updated, as the page writes it: "a few seconds ago". |
| `actions`? | `ListViewHeaderAction[]` | `[]` | The list's actions, in order. |
| `visibleActions`? | `number` | `3` | How many actions show as buttons; the rest go in the menu. Default 3. |
| `onAction`? | `(action: ListViewHeaderAction) => void` |  | Runs with the action that's chosen. |
| `search`? | `string` |  | The search text. |
| `defaultSearch`? | `string` | `""` | The search text at first, uncontrolled. Default "". |
| `onSearchChange`? | `(search: string) => void` |  | Runs with the search text as it's typed; the search field shows only with it. |
| `display`? | `ListViewHeaderDisplay` |  | How the list displays. |
| `defaultDisplay`? | `ListViewHeaderDisplay` | `"table"` | How the list displays at first, uncontrolled. Default "table". |
| `onDisplayChange`? | `(display: ListViewHeaderDisplay) => void` |  | Runs with the display picked; Display as shows only with it. |
| `onListControl`? | `(control: ListViewHeaderControl) => void` |  | Runs with the item picked from List View Controls, which shows only with it. |
| `onRefresh`? | `() => void` |  | Runs when Refresh is pressed; the button shows only with it. |
| `onColumnSort`? | `() => void` |  | Opens the page's sort dialog from Column sort, which shows only with it. |
| `onEditList`? | `() => void` |  | Runs when Edit list is pressed; the button shows only with it. |
| `onShowCharts`? | `() => void` |  | Runs when Show charts is pressed; the button shows only with it. |
| `onShowFilters`? | `() => void` |  | Runs when Show filters is pressed; the button shows only with it. |
| `joined`? | `boolean` | `false` | Squares the bottom corners, for a header that sits on the list below. |
| `loading`? | `boolean` | `false` | Holds the meta line's place while the list loads. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for the count. Default "en-US". |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### ListViewHeaderView

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | The list view's id or API name: "AllOpportunities". |
| `label` | `string` |  | Its name, as the org names it: "All Opportunities". |

### ListViewHeaderAction

One of the list's actions, as a button or a menu item.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Identifies the action in onAction: "new", "import". |
| `label` | `string` |  | The action's name, in title case: "Change Owner". |
| `disabled`? | `boolean` |  | Shows the action but doesn't let it run. |

### ListViewHeaderDisplay

```ts
type ListViewHeaderDisplay = "table" | "kanban" | "split-view"
```

### ListViewHeaderControl

An item in the List View Controls menu.

```ts
type ListViewHeaderControl =
  | "new"
  | "clone"
  | "rename"
  | "sharing-settings"
  | "edit-list-filters"
  | "select-fields"
  | "reset-column-widths"
  | "reset-column-sorting"
  | "delete"
```

## Accessibility

- The list view's name is the page's h1, so render one list view header per page.
- The title is a button named by the list view, described as "Select a list view", inside the h1. It opens a dialog with a search field and the list views as options.
- Every icon-only control has a name: "Pin this list view", "List View Controls", "Display as Table", "Refresh", "Column sort", "Edit list", "Show charts" and "Show filters". The search field is "Search this list".
- The pin is a toggle button: it reads as pressed while the list view shown is the pinned one.
- While loading, the meta line's row is busy and shows a placeholder.

## Responsive behavior

- The list view's name stays on one line and truncates.
- When the actions don't fit beside the name, they move under it. When the controls don't fit beside the meta line, they move under it, and wrap.

## Example code

### All Opportunities

The header alone with every control wired: the title opens the list views, the pin marks one, and the count follows the search.

```tsx
"use client"

import { useState } from "react"

import {
  ListViewHeader,
  type ListViewHeaderDisplay,
} from "@/components/wisty/list-view-header"
import {
  listViewHeaderFixture,
  listViewOpportunities,
} from "@/components/wisty/list-view-header-data"

export default function ListViewHeaderDefault() {
  const [search, setSearch] = useState("")
  const [pinnedView, setPinnedView] = useState(listViewHeaderFixture.pinnedView)
  const [display, setDisplay] = useState<ListViewHeaderDisplay>("table")
  const query = search.trim().toLowerCase()
  const rows = listViewOpportunities.filter((row) =>
    `${row.name} ${row.accountName}`.toLowerCase().includes(query)
  )

  return (
    <ListViewHeader
      {...listViewHeaderFixture}
      itemCount={rows.length}
      pinnedView={pinnedView}
      onPinnedViewChange={setPinnedView}
      search={search}
      onSearchChange={setSearch}
      display={display}
      onDisplayChange={setDisplay}
      onAction={(action) => console.info(action)}
      onListControl={(control) => console.info(control)}
      onRefresh={() => console.info("Refresh")}
      onColumnSort={() => console.info("Column sort")}
      onEditList={() => console.info("Edit list")}
      onShowCharts={() => console.info("Show charts")}
      onShowFilters={() => console.info("Show filters")}
      className="w-full"
    />
  )
}
```

### Narrow width

At phone width the actions, the search and Display as wrap, and `hasMoreItems` makes 50 loaded rows read as 50+ items.

```tsx
"use client"

import { useState } from "react"

import {
  ListViewHeader,
  type ListViewHeaderDisplay,
} from "@/components/wisty/list-view-header"
import { listViewHeaderPartialFixture } from "@/components/wisty/list-view-header-data"

export default function ListViewHeaderNarrow() {
  const [search, setSearch] = useState("")
  const [display, setDisplay] = useState<ListViewHeaderDisplay>("table")

  return (
    <ListViewHeader
      {...listViewHeaderPartialFixture}
      search={search}
      onSearchChange={setSearch}
      display={display}
      onDisplayChange={setDisplay}
      className="w-full max-w-[22rem]"
    />
  )
}
```

### Loading

With `loading` and `itemCount` null, the meta line holds its place and no count is guessed.

```tsx
import { ListViewHeader } from "@/components/wisty/list-view-header"
import { listViewHeaderFixture } from "@/components/wisty/list-view-header-data"

export default function ListViewHeaderLoading() {
  return (
    <ListViewHeader
      {...listViewHeaderFixture}
      itemCount={null}
      loading
      className="w-full"
    />
  )
}
```
