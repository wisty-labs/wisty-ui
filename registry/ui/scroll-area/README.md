# Scroll area

This page shows the Radix version. Base UI projects get [registry/base/ui/scroll-area.tsx](../../base/ui/scroll-area.tsx), and [ui.wisty.ai/scroll-area](https://ui.wisty.ai/scroll-area) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Scrolls its content in a fixed-size box, with slim scrollbars.

```bash
npx shadcn@latest add @wisty/scroll-area
```

## Examples

- `default` (Account list): Eighteen accounts with separators in a fixed-height box that scrolls up and down.
- `horizontal` (Horizontal): A row of opportunity tiles that scrolls sideways, with `<ScrollBar orientation="horizontal" />` as the last child.
- `both-axes` (Both directions): A plain `table` of cases wider and taller than its box, with the default vertical bar and a horizontal `ScrollBar`.

## When to use

- A list, panel or table must fit a fixed height or width, and the rest scrolls inside it.
- A row of tiles or cards is wider than the space it has.
- A scrolling box whose scrollbar should match the theme on every system.

## When not to use

- The whole page scrolls. Let the browser scroll it.
- A table only needs to scroll sideways. Table does that on its own.
- A long table, or one with sorting or selection. Use Data table: given a height it scrolls under a header that stays put, and `virtualize` draws only the rows on screen.
- Options in a menu, select or combobox. Dropdown menu, Select and Combobox cap their own height and scroll.

## Usage

Give `ScrollArea` a fixed size and put the content inside. It scrolls up and down; for sideways scrolling add `<ScrollBar orientation="horizontal" />` as the last child, as the Horizontal example shows.

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"
```

```tsx
<ScrollArea className="h-72 rounded-(--radius-2) border">
  <div className="p-4">{/* content taller than the area */}</div>
</ScrollArea>
```

In Radix projects, the scrollbar shows while the pointer is over the area and hides after the pointer leaves; pass `type="always"` to keep it shown. In Base UI projects, it shows whenever the content overflows. In Radix projects the content also sits in a `display: table` box, where `truncate` doesn't cut text and percentage widths don't follow the area.

## Rules

- Give the area a fixed height, a fixed width, or both. Without one, nothing scrolls.
- Draw the box with `rounded-(--radius-2) border`. Don't style the scrollbar or thumb.
- Don't put `Table` inside. It wraps the table in its own scrolling box, which scrolls instead of the area. Use a plain `table` with the Table parts, as the Both directions example shows.
- Don't use `truncate` inside. Give children a fixed width or let text wrap.

## API reference

| Part | Built on |
| --- | --- |
| `ScrollArea` | [Radix ScrollArea.Root](https://www.radix-ui.com/primitives/docs/components/scroll-area#root) |
| `ScrollBar` | [Radix ScrollArea.Scrollbar](https://www.radix-ui.com/primitives/docs/components/scroll-area#scrollbar) |

### ScrollBar

| Prop | Type | Default |
| --- | --- | --- |
| `orientation`? | `"horizontal" \| "vertical"` | `"vertical"` |

## SLDS mapping

SLDS 2 has no scroll area and doesn't style scrollbars. `ScrollArea` is the box of `slds-scrollable`, and `ScrollBar` is `slds-scrollable_y` or `slds-scrollable_x`, which keep the browser's own scrollbar. The bar and its pill thumb are drawn from SLDS's neutral and surface tokens, and the area clips them to its corners.

Known gaps:

- The corner where the two bars meet stays clear. Native scrollbars fill it.
- Select, Dropdown menu and Table scroll with the browser's own scrollbar. Only Scroll area draws one, so with classic scrollbars they look different.

## Accessibility

- The area has no role and no name. Pass `role="region"` and an `aria-label` to make it a landmark people can jump to.
- The area itself isn't always focusable. Put a link or a control inside, so keyboard users can reach the content; the browser's scrolling keys work once something inside has focus.

## Responsive behavior

- The area is the size you give it. Text wraps unless you set `whitespace-nowrap`, as the Horizontal example does.

## Example code

### Account list

Eighteen accounts with separators in a fixed-height box that scrolls up and down.

```tsx
import { Fragment } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const accounts = [
  "Acme Corporation",
  "Burlington Textiles Corp of America",
  "Cloud Kicks",
  "Dickenson plc",
  "Dreamhouse Realty",
  "Edge Communications",
  "Express Logistics and Transport",
  "GenePoint",
  "Get Cloudy Consulting",
  "Global Media",
  "Grand Hotels & Resorts Ltd",
  "Northern Trail Outfitters",
  "Pyramid Construction Inc.",
  "sForce",
  "United Oil & Gas Corp.",
  "Universal Containers",
  "University of Arizona",
  "Ursa Major Solar",
]

export default function ScrollAreaDefault() {
  return (
    <ScrollArea className="h-72 w-56 rounded-(--radius-2) border">
      <div className="p-4">
        {accounts.map((account) => (
          <Fragment key={account}>
            <a href="#" className="text-link hover:underline">
              {account}
            </a>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}
```

### Horizontal

A row of opportunity tiles that scrolls sideways, with `<ScrollBar orientation="horizontal" />` as the last child.

```tsx
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const opportunities = [
  {
    name: "Dickenson Mobile Generators",
    account: "Dickenson plc",
    amount: "$15,000",
    stage: "Qualification",
    close: "Nov 4, 2026",
  },
  {
    name: "Edge Installation",
    account: "Edge Communications",
    amount: "$50,000",
    stage: "Value Proposition",
    close: "Nov 12, 2026",
  },
  {
    name: "Express Logistics Standby Generator",
    account: "Express Logistics and Transport",
    amount: "$220,000",
    stage: "Perception Analysis",
    close: "Nov 20, 2026",
  },
  {
    name: "GenePoint Standby Generator",
    account: "GenePoint",
    amount: "$85,000",
    stage: "Id. Decision Makers",
    close: "Dec 1, 2026",
  },
  {
    name: "Grand Hotels Kitchen Generator",
    account: "Grand Hotels & Resorts Ltd",
    amount: "$15,000",
    stage: "Proposal/Price Quote",
    close: "Dec 9, 2026",
  },
  {
    name: "United Oil Plant Standby Generators",
    account: "United Oil & Gas Corp.",
    amount: "$675,000",
    stage: "Negotiation/Review",
    close: "Dec 15, 2026",
  },
]

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea className="w-full max-w-md rounded-(--radius-2) border whitespace-nowrap">
      <ul className="flex w-max gap-3 p-3">
        {opportunities.map((opportunity) => (
          <li
            key={opportunity.name}
            className="w-48 shrink-0 rounded-(--radius-2) border p-3 whitespace-normal"
          >
            <a
              href="#"
              className="text-link transition-colors duration-100 ease-linear hover:text-link-hover hover:underline focus-visible:text-link-hover focus-visible:underline focus-visible:outline-(--focus)"
            >
              {opportunity.name}
            </a>
            <p className="text-muted-foreground">{opportunity.account}</p>
            <p className="text-muted-foreground">{opportunity.amount}</p>
            <p className="text-muted-foreground">{opportunity.stage}</p>
            <p className="text-muted-foreground">Closes {opportunity.close}</p>
          </li>
        ))}
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
```

### Both directions

A plain `table` of cases wider and taller than its box, with the default vertical bar and a horizontal `ScrollBar`.

```tsx
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const cases = [
  [
    "00001026",
    "Generator won't start",
    "Edge Communications",
    "Working",
    "High",
    "Maria Lopez",
    "Oct 6, 2026",
  ],
  [
    "00001027",
    "Seal on the cooling pump leaks",
    "United Oil & Gas Corp.",
    "New",
    "High",
    "Dev Patel",
    "Oct 6, 2026",
  ],
  [
    "00001028",
    "Invoice shows the wrong amount",
    "Burlington Textiles Corp of America",
    "Escalated",
    "Medium",
    "Ana Silva",
    "Oct 5, 2026",
  ],
  [
    "00001029",
    "Need training for new staff",
    "Grand Hotels & Resorts Ltd",
    "New",
    "Low",
    "Tom Becker",
    "Oct 5, 2026",
  ],
  [
    "00001030",
    "Panel shows an error code",
    "Express Logistics and Transport",
    "Working",
    "High",
    "Maria Lopez",
    "Oct 4, 2026",
  ],
  [
    "00001031",
    "Request for a site visit",
    "GenePoint",
    "New",
    "Medium",
    "Dev Patel",
    "Oct 4, 2026",
  ],
  [
    "00001032",
    "Fuel gauge reads empty",
    "Dickenson plc",
    "Working",
    "Medium",
    "Ana Silva",
    "Oct 3, 2026",
  ],
  [
    "00001033",
    "Replacement part is late",
    "Pyramid Construction Inc.",
    "Escalated",
    "High",
    "Tom Becker",
    "Oct 3, 2026",
  ],
  [
    "00001034",
    "Warranty question",
    "University of Arizona",
    "Closed",
    "Low",
    "Maria Lopez",
    "Oct 2, 2026",
  ],
  [
    "00001035",
    "Generator is too loud",
    "Edge Communications",
    "New",
    "Low",
    "Dev Patel",
    "Oct 2, 2026",
  ],
  [
    "00001036",
    "Power drops under load",
    "United Oil & Gas, UK",
    "Working",
    "High",
    "Ana Silva",
    "Oct 1, 2026",
  ],
  [
    "00001037",
    "Manual is missing pages",
    "sForce",
    "Closed",
    "Low",
    "Tom Becker",
    "Oct 1, 2026",
  ],
  [
    "00001038",
    "Change the service contact",
    "Cloud Kicks",
    "New",
    "Low",
    "Maria Lopez",
    "Sep 30, 2026",
  ],
  [
    "00001039",
    "Battery won't hold a charge",
    "Ursa Major Solar",
    "Working",
    "Medium",
    "Dev Patel",
    "Sep 30, 2026",
  ],
  [
    "00001040",
    "Schedule the yearly check",
    "Universal Containers",
    "New",
    "Medium",
    "Ana Silva",
    "Sep 29, 2026",
  ],
]

const columns = [
  "Case Number",
  "Subject",
  "Account",
  "Status",
  "Priority",
  "Owner",
  "Opened",
]

export default function ScrollAreaBothAxes() {
  return (
    <ScrollArea className="h-64 w-full max-w-md rounded-(--radius-2) border">
      <table className="w-max border-separate border-spacing-0 text-(length:--font-size-base) text-(--table-foreground)">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map(([number, ...cells]) => (
            <TableRow key={number}>
              <TableHead scope="row">
                <a
                  href="#"
                  className="text-link transition-colors duration-100 ease-linear hover:text-link-hover hover:underline focus-visible:text-link-hover focus-visible:underline focus-visible:outline-(--focus)"
                >
                  {number}
                </a>
              </TableHead>
              {cells.map((cell, index) => (
                <TableCell key={columns[index + 1]}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
```
