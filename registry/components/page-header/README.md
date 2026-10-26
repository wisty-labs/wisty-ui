# Page header

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/page-header](https://ui.wisty.ai/page-header) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Titles a page with its icon, actions, meta text and key details. For a record or a list, start from Record header or List view header.

```bash
npx shadcn@latest add @wisty/page-header
```

## Examples

- `default` (Report page): A report's icon, what it reports on over its name, and Edit and Subscribe with more actions in a menu.
- `details` (With key details): An account's page with four fields in `PageHeaderDetails` below the title, the phone and website as links.
- `meta-and-controls` (List view): An accounts list: the title opens a searchable list of list views, a pin follows it, and a second `PageHeaderRow` holds the meta text and controls.
- `dashboard` (Dashboard): A dashboard's page, with when its data was read and whose view it shows as `PageHeaderMeta` in a row of its own.
- `setup` (Setup page): Object Manager's header: a menu button among the actions, and a Quick Find search beside the meta text.

## When to use

- At the top of a page, to name it: a report, a dashboard, a setup page, a record or a list.
- When the page's actions belong beside its name, like Edit, Subscribe or New.
- When a few key details belong under the name, like a record's highlights.
- In place of Lightning's page header, `lightning-card` used as a page title, or a hand-built title bar.

## When not to use

- For a record's page: start from Record header, which formats its highlight fields and collapses its actions into a menu.
- For a list's page: start from List view header, which adds the list switcher, the meta line and the list's controls.
- For a section inside a page. Use Card with a `CardTitle`.

## Usage

```text
PageHeader
├── PageHeaderRow
│   ├── PageHeaderFigure
│   ├── PageHeaderHeading
│   │   ├── PageHeaderEyebrow
│   │   └── PageHeaderTitle
│   └── PageHeaderActions
├── PageHeaderRow
│   ├── PageHeaderMeta
│   └── PageHeaderActions
└── PageHeaderDetails
    └── PageHeaderDetail
        ├── PageHeaderDetailLabel
        └── PageHeaderDetailValue
```

```tsx
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"
```

```tsx
<PageHeader>
  <PageHeaderRow>
    <PageHeaderFigure>
      <Icon name="standard:dashboard" />
    </PageHeaderFigure>
    <PageHeaderHeading>
      <PageHeaderEyebrow>Dashboard</PageHeaderEyebrow>
      <PageHeaderTitle>Sales Leaderboard</PageHeaderTitle>
    </PageHeaderHeading>
  </PageHeaderRow>
</PageHeader>
```

A title that opens a switcher holds the trigger inside `PageHeaderTitle`, so the heading keeps its name. Up to two controls that act on the title, like a pin, go in `PageHeaderHeading` after `PageHeaderTitle`, at the end of the title's line. Pass `joined` on `PageHeader` when a table sits directly below it: the header draws no frame of its own, and a wrapper around both draws one with the header's tokens, as List view header's first example does.

## Rules

- Keep the title to one line. Put anything that describes it in `PageHeaderEyebrow` above, or in `PageHeaderMeta` or the details below.
- Render the details as label and value pairs. A value that's missing shows an empty `PageHeaderDetailValue`, not a dash or "None".
- Put links in detail values for web addresses, email addresses and phone numbers, with `className="text-link hover:underline"`.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `PageHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `PageHeaderRow` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `PageHeaderFigure` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `PageHeaderHeading` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `PageHeaderEyebrow` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |
| `PageHeaderTitle` | [`<h1>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements) |
| `PageHeaderActions` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `PageHeaderMeta` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |
| `PageHeaderDetails` | [`<dl>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl) |
| `PageHeaderDetail` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `PageHeaderDetailLabel` | [`<dt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dt) |
| `PageHeaderDetailValue` | [`<dd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dd) |

### PageHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `joined`? | `boolean` | `false` | Draws no frame of its own, so the header and the list below it share one from the page. |

## SLDS mapping

The parts follow `slds-page-header`: each row is `slds-page-header__row`, the figure holds `slds-page-header__icon`, the heading is `slds-page-header__name` with `slds-page-header__title` as the h1, the actions are `slds-page-header__controls`, the meta text is `slds-page-header__meta-text`, and the details are `slds-page-header__detail-row` with a `slds-page-header__detail-block` per detail. The table lists every part.

Known gaps:

- SLDS puts the object's name inside the h1. Here the eyebrow is a paragraph before it, so the heading is the page's name alone.
- The vertical header (`slds-page-header_vertical`) isn't a variant. On a narrow page the details go two to a row, as its detail list does, and the rows wrap.
- SLDS's detail row never wraps. Here it wraps when the details don't fit in one line.

## Accessibility

- `PageHeaderTitle` is the page's h1, so use one page header per page, at the top of its main content.
- Give every icon-only button an `aria-label`, and give a button group one that names whose actions they are ("Report actions").
- A truncated title or detail value shows its full text only to people who can hover. Pass the full text as `title` too.

## Responsive behavior

- A row wraps its items when they don't fit: the actions move under the title, and the controls under the meta text.
- The title stays on one line and truncates before the actions wrap, once it's narrower than 12rem.
- The details sit in one row, each at most a quarter of it, and wrap when they don't fit. On a narrow page they go two to a row.
- The header is as wide as its parent gives it. In a flex row, give it `w-full` or `flex-1`.

## Example code

### Report page

A report's icon, what it reports on over its name, and Edit and Subscribe with more actions in a menu.

```tsx
import { ChevronDownIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"

export default function PageHeaderDefault() {
  return (
    <PageHeader className="w-full">
      <PageHeaderRow>
        <PageHeaderFigure>
          <Icon name="standard:report" />
        </PageHeaderFigure>
        <PageHeaderHeading>
          <PageHeaderEyebrow>Report: Opportunities</PageHeaderEyebrow>
          <PageHeaderTitle>Pipeline by Stage</PageHeaderTitle>
        </PageHeaderHeading>
        <PageHeaderActions>
          <ButtonGroup aria-label="Report actions">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Subscribe</Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="More actions"
                className={buttonVariants({ variant: "outline", size: "icon" })}
              >
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save As</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  )
}
```

### With key details

An account's page with four fields in `PageHeaderDetails` below the title, the phone and website as links.

```tsx
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDetail,
  PageHeaderDetailLabel,
  PageHeaderDetails,
  PageHeaderDetailValue,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"

export default function PageHeaderDetailsExample() {
  return (
    <PageHeader className="w-full">
      <PageHeaderRow>
        <PageHeaderFigure>
          <Icon name="standard:account" />
        </PageHeaderFigure>
        <PageHeaderHeading>
          <PageHeaderEyebrow>Account</PageHeaderEyebrow>
          <PageHeaderTitle title="Burlington Textiles Corp of America">
            Burlington Textiles Corp of America
          </PageHeaderTitle>
        </PageHeaderHeading>
        <PageHeaderActions>
          <ButtonGroup aria-label="Account actions">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">New Contact</Button>
          </ButtonGroup>
        </PageHeaderActions>
      </PageHeaderRow>
      <PageHeaderDetails>
        <PageHeaderDetail>
          <PageHeaderDetailLabel>Type</PageHeaderDetailLabel>
          <PageHeaderDetailValue>Customer - Direct</PageHeaderDetailValue>
        </PageHeaderDetail>
        <PageHeaderDetail>
          <PageHeaderDetailLabel>Phone</PageHeaderDetailLabel>
          <PageHeaderDetailValue>
            <a href="tel:+13362227000" className="text-link hover:underline">
              (336) 222-7000
            </a>
          </PageHeaderDetailValue>
        </PageHeaderDetail>
        <PageHeaderDetail>
          <PageHeaderDetailLabel>Website</PageHeaderDetailLabel>
          <PageHeaderDetailValue>
            <a
              href="https://www.burlington.example"
              className="text-link hover:underline"
            >
              www.burlington.example
            </a>
          </PageHeaderDetailValue>
        </PageHeaderDetail>
        <PageHeaderDetail>
          <PageHeaderDetailLabel>Account Owner</PageHeaderDetailLabel>
          <PageHeaderDetailValue>Ellen Hart</PageHeaderDetailValue>
        </PageHeaderDetail>
      </PageHeaderDetails>
    </PageHeader>
  )
}
```

### List view

An accounts list: the title opens a searchable list of list views, a pin follows it, and a second `PageHeaderRow` holds the meta text and controls.

```tsx
import {
  ArrowUpDownIcon,
  ChartPieIcon,
  ChevronDownIcon,
  FilterIcon,
  PencilIcon,
  PinIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  TableIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"

const iconButton = buttonVariants({ variant: "outline", size: "icon" })
const menuButton = cn(iconButton, "w-auto gap-0.5 px-1.5")

export default function PageHeaderMetaAndControls() {
  return (
    <PageHeader className="w-full">
      <PageHeaderRow>
        <PageHeaderFigure>
          <Icon name="standard:account" />
        </PageHeaderFigure>
        <PageHeaderHeading>
          <PageHeaderEyebrow>Accounts</PageHeaderEyebrow>
          <Popover>
            <PageHeaderTitle>
              <PopoverTrigger className="inline-flex max-w-full items-center gap-2 text-start shadow-[inset_0_-1px_0_transparent] outline-none hover:shadow-[inset_0_-1px_0_currentColor] focus-visible:shadow-[inset_0_-1px_0_currentColor] aria-expanded:shadow-[inset_0_-1px_0_currentColor]">
                <span className="truncate">All Accounts</span>
                <Icon
                  name="utility:down"
                  size="x-small"
                  className="shrink-0 text-current"
                />
              </PopoverTrigger>
            </PageHeaderTitle>
            <PopoverContent
              align="start"
              aria-label="List views"
              className="w-[min(36rem,calc(100vw-2rem))] p-0"
            >
              <Command label="Search lists" defaultValue="All Accounts">
                <CommandInput placeholder="Search lists..." />
                <CommandList>
                  <CommandEmpty>No lists found.</CommandEmpty>
                  <CommandGroup heading="Recent List Views">
                    <CommandItem value="All Accounts" aria-checked>
                      All Accounts (Pinned list)
                    </CommandItem>
                    <CommandItem value="Recently Viewed">
                      Recently Viewed
                    </CommandItem>
                  </CommandGroup>
                  <CommandGroup heading="All Other Lists">
                    <CommandItem value="My Accounts">My Accounts</CommandItem>
                    <CommandItem value="New Last Week">
                      New Last Week
                    </CommandItem>
                    <CommandItem value="New This Week">
                      New This Week
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Pin this list view"
            aria-pressed
            className="mb-(--page-header-switcher-offset) aria-pressed:[&_svg]:fill-current"
          >
            <PinIcon />
          </Button>
        </PageHeaderHeading>
        <PageHeaderActions>
          <ButtonGroup aria-label="Accounts actions">
            <Button variant="outline">New</Button>
            <Button variant="outline">Import</Button>
            <Button variant="outline">Printable View</Button>
          </ButtonGroup>
        </PageHeaderActions>
      </PageHeaderRow>
      <PageHeaderRow>
        <PageHeaderMeta>
          50+ items • Sorted by Account Name • Updated a few seconds ago
        </PageHeaderMeta>
        <PageHeaderActions>
          <InputGroup className="w-56 max-w-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              aria-label="Search this list"
              placeholder="Search this list..."
            />
          </InputGroup>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="List View Controls"
              className={menuButton}
            >
              <SettingsIcon />
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New</DropdownMenuItem>
              <DropdownMenuItem>Clone</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Select Fields to Display</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Display as Table"
              className={menuButton}
            >
              <TableIcon />
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Table</DropdownMenuItem>
              <DropdownMenuItem>Kanban</DropdownMenuItem>
              <DropdownMenuItem>Split View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" aria-label="Refresh">
            <RefreshCwIcon />
          </Button>
          <Button variant="outline" size="icon" aria-label="Column sort">
            <ArrowUpDownIcon />
          </Button>
          <Button variant="outline" size="icon" aria-label="Edit list">
            <PencilIcon />
          </Button>
          <ButtonGroup aria-label="List panels">
            <Button variant="outline" size="icon" aria-label="Show charts">
              <ChartPieIcon />
            </Button>
            <Button variant="outline" size="icon" aria-label="Show filters">
              <FilterIcon />
            </Button>
          </ButtonGroup>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  )
}
```

### Dashboard

A dashboard's page, with when its data was read and whose view it shows as `PageHeaderMeta` in a row of its own.

```tsx
import { ChevronDownIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"

export default function PageHeaderDashboard() {
  return (
    <PageHeader className="w-full">
      <PageHeaderRow>
        <PageHeaderFigure>
          <Icon name="standard:dashboard" />
        </PageHeaderFigure>
        <PageHeaderHeading>
          <PageHeaderEyebrow>Dashboard</PageHeaderEyebrow>
          <PageHeaderTitle>Sales Leaderboard</PageHeaderTitle>
        </PageHeaderHeading>
        <PageHeaderActions>
          <ButtonGroup aria-label="Dashboard actions">
            <Button variant="outline">Refresh</Button>
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Subscribe</Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="More actions"
                className={buttonVariants({ variant: "outline", size: "icon" })}
              >
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save As</DropdownMenuItem>
                <DropdownMenuItem>Full Screen</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </PageHeaderActions>
      </PageHeaderRow>
      <PageHeaderRow>
        <PageHeaderMeta>
          As of Oct 12, 2026, 9:42 AM • Viewing as Ellen Hart
        </PageHeaderMeta>
      </PageHeaderRow>
    </PageHeader>
  )
}
```

### Setup page

Object Manager's header: a menu button among the actions, and a Quick Find search beside the meta text.

```tsx
import { ChevronDownIcon, SearchIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"

export default function PageHeaderSetup() {
  return (
    <PageHeader className="w-full">
      <PageHeaderRow>
        <PageHeaderFigure>
          <Icon name="standard:settings" />
        </PageHeaderFigure>
        <PageHeaderHeading>
          <PageHeaderEyebrow>Setup</PageHeaderEyebrow>
          <PageHeaderTitle>Object Manager</PageHeaderTitle>
        </PageHeaderHeading>
        <PageHeaderActions>
          <ButtonGroup aria-label="Object Manager actions">
            <Button variant="outline">Schema Builder</Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "outline" })}
              >
                Create
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Custom Object</DropdownMenuItem>
                <DropdownMenuItem>
                  Custom Object from Spreadsheet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </PageHeaderActions>
      </PageHeaderRow>
      <PageHeaderRow>
        <PageHeaderMeta>52 Items, Sorted by Label</PageHeaderMeta>
        <PageHeaderActions>
          <InputGroup className="w-56 max-w-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              aria-label="Quick Find"
              placeholder="Quick Find"
            />
          </InputGroup>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  )
}
```
