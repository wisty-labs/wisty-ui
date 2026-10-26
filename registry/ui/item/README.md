# Item

This page shows the Radix version. Base UI projects get [registry/base/ui/item.tsx](../../base/ui/item.tsx), and [ui.wisty.ai/item](https://ui.wisty.ai/item) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows one entry as a row with an icon, a title, a description and actions.

```bash
npx shadcn@latest add @wisty/item
```

## Examples

- `default` (Account): An `outline` account with `ItemMedia variant="icon"` and a Follow button, and a `muted` item at `size="sm"` with a View button.
- `group` (Group): Three accounts in an `ItemGroup`, each with `role="listitem"`, and an `ItemSeparator` between them instead of gaps.
- `variants` (Variants): Each `variant` on `Item`: `default`, `outline` and `muted`.
- `sizes` (Sizes): Each `size` on `Item`, `default`, `sm` and `xs`, with icon media and an icon button.
- `media` (Media): An Avatar in `ItemMedia`, an icon with `variant="icon"`, and an image with `variant="image"`.
- `header-footer` (Header and footer): An opportunity with its title and a badge in `ItemHeader`, and an amount and a button in `ItemFooter`.

## When to use

- To show one entry as a row: a name, a line of detail and an action, like a record, a file or a person.
- To list a few records, like related records or search results, with `ItemGroup`.
- To link a row to its record from the title, with an `<a>` in `ItemTitle`.
- To show a short record summary with a header and footer, like an opportunity with its stage and amount.

## When not to use

- Many records with several fields to compare. Use Table or Data table.
- A summary with a header, body and footer actions that stands on its own. Use Card.
- A choice in a menu. Use Dropdown menu's items.
- An empty list. Use Empty.
- A form control with its label, help text or error. Use Field.

## Usage

```text
ItemGroup
├── Item
│   ├── ItemMedia
│   ├── ItemContent
│   │   ├── ItemTitle
│   │   └── ItemDescription
│   └── ItemActions
├── ItemSeparator
└── Item
```

`ItemHeader` and `ItemFooter` add full-width rows above and below the content, as the Header and footer example shows.

```tsx
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
```

```tsx
<Item variant="outline">
  <ItemContent>
    <ItemTitle>Rose Gonzalez</ItemTitle>
    <ItemDescription>SVP, Procurement · Edge Communications</ItemDescription>
  </ItemContent>
</Item>
```

In an `ItemGroup`, give each `Item` `role="listitem"`, as the Group example shows. To link a record, put an `<a>` in `ItemTitle`. A whole item can be the link too: `asChild` with an `<a>` child in Radix projects, `render={<a href="…" />}` in Base UI projects.

## Rules

- Put `ItemSeparator` between items, not after the last one.
- Put the record name in `ItemTitle` and one short line in `ItemDescription`.
- Use `ItemMedia variant="icon"` with a lucide icon, or an `Avatar` for people. For a Salesforce object's colored icon, put Icon in a plain `ItemMedia`, as Related list does.
- In a Card, put the `ItemGroup` in the `Card` itself, not in `CardContent`, and give each `Item` `className="px-(--card-spacing-inline)"`, so its text lines up with the card's title.
- Use `outline` for a standalone item and `default` in a list with separators.

## API reference

| Part | Built on |
| --- | --- |
| `ItemGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ItemSeparator` | [Separator](https://ui.wisty.ai/separator#api-Separator) |
| `Item` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ItemMedia` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ItemContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ItemTitle` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ItemDescription` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |
| `ItemActions` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ItemHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ItemFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### Item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant`? | `"default" \| "outline" \| "muted"` | `"default"` |  |
| `size`? | `"default" \| "sm" \| "xs"` | `"default"` |  |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |

### ItemMedia

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "icon" \| "image"` | `"default"` |

## SLDS mapping

`Item` is an SLDS tile (`slds-tile`) on the media object (`slds-media slds-media_center`). `ItemMedia` is `slds-media__figure`, `ItemTitle` is `slds-tile__title slds-truncate`, `ItemDescription` is `slds-tile__detail slds-text-body_small slds-text-color_weak` and `ItemActions` is `slds-media__figure_reverse`. `ItemGroup` spaces items like `slds-tile + slds-tile`, or like `slds-has-dividers_bottom` when it holds `ItemSeparator`s. `ItemHeader` and `ItemFooter` have no SLDS part.

Known gaps:

- SLDS's divided list (`slds-has-dividers_bottom-space`) pads items less on wide screens than on narrow ones. Items keep one size; `xs` matches the wide one.
- Items keep a transparent 1px border, so a bare item is 1px larger on each side than an SLDS tile.

## Accessibility

- `ItemGroup` has `role="list"`. Each `Item` in it needs `role="listitem"`, or the list is invalid.
- Name icon-only buttons with `aria-label`, like "Follow Acme Corporation". Give images in `ItemMedia` an `alt`; lucide icons are hidden on their own.
- `ItemTitle` isn't a heading. Put an `<h3>` in it when the page outline needs one.
- A linked item's whole text becomes the link's name. Keep it short.
- `ItemSeparator` is hidden from assistive technology, so it doesn't break the list.
- Contrast: in Lightning Blue, a muted item's description is about 4.2:1, the same as SLDS's `slds-theme_shade` with `slds-text-color_weak`. Links in a muted item are below 4.5:1 there too, so keep links out of muted items.

## Responsive behavior

- An item fills its container's width. The content takes the free space and the actions keep their size.
- The title stays on one line and ends in an ellipsis, also in a header beside a badge. A title that holds a badge or an icon wraps instead, so neither is cut off.
- The description stops at two lines with an ellipsis.

## Example code

### Account

An `outline` account with `ItemMedia variant="icon"` and a Follow button, and a `muted` item at `size="sm"` with a View button.

```tsx
import { Building2Icon, TrophyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemDefault() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Building2Icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Acme Corporation</ItemTitle>
          <ItemDescription>
            Customer · Manufacturing · San Francisco
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Follow</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <TrophyIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>2 opportunities closed this quarter</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
```

### Group

Three accounts in an `ItemGroup`, each with `role="listitem"`, and an `ItemSeparator` between them instead of gaps.

```tsx
import { Building2Icon } from "lucide-react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemGroupExample() {
  return (
    <ItemGroup className="max-w-md">
      <Item role="listitem">
        <ItemMedia variant="icon">
          <Building2Icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Acme Corporation</ItemTitle>
          <ItemDescription>Customer · San Francisco</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item role="listitem">
        <ItemMedia variant="icon">
          <Building2Icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Global Media</ItemTitle>
          <ItemDescription>Prospect · New York</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item role="listitem">
        <ItemMedia variant="icon">
          <Building2Icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Edge Communications</ItemTitle>
          <ItemDescription>Customer · Austin</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
```

### Variants

Each `variant` on `Item`: `default`, `outline` and `muted`.

```tsx
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

const opportunities = [
  {
    variant: "default",
    name: "Edge Emergency Generator",
    detail: "Prospecting · $75,000 · Closes Nov 12, 2026",
  },
  {
    variant: "outline",
    name: "United Oil Installations",
    detail: "Negotiation · $270,000 · Closes Dec 3, 2026",
  },
  {
    variant: "muted",
    name: "Grand Hotels Guest Portal",
    detail: "Proposal · $90,000 · Closes Jan 20, 2027",
  },
] as const

export default function ItemVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {opportunities.map((opportunity) => (
        <Item key={opportunity.name} variant={opportunity.variant}>
          <ItemContent>
            <ItemTitle>{opportunity.name}</ItemTitle>
            <ItemDescription>{opportunity.detail}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" aria-label={`Open ${opportunity.name}`}>
              Open
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}
```

### Sizes

Each `size` on `Item`, `default`, `sm` and `xs`, with icon media and an icon button.

```tsx
import { BriefcaseIcon, ExternalLinkIcon, LifeBuoyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <BriefcaseIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Generator won&apos;t start</ItemTitle>
          <ItemDescription>Case 00001026 · High priority</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Open case 00001026"
          >
            <ExternalLinkIcon />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <LifeBuoyIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Billing address change</ItemTitle>
          <ItemDescription>Case 00001027 · Medium priority</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Open case 00001027"
          >
            <ExternalLinkIcon />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <LifeBuoyIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Password reset</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Open case 00001028"
          >
            <ExternalLinkIcon />
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
```

### Media

An Avatar in `ItemMedia`, an icon with `variant="icon"`, and an image with `variant="image"`.

```tsx
import { Building2Icon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%237f8de1'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23fff' fill-opacity='.85'/%3E%3Cpath d='M10 64c2-14 11-20 22-20s20 6 22 20z' fill='%23fff' fill-opacity='.85'/%3E%3C/svg%3E"

export default function ItemMediaExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar>
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Grace Hopper</ItemTitle>
          <ItemDescription>VP of Operations, Acme Corporation</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Building2Icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Acme Corporation</ItemTitle>
          <ItemDescription>Customer · Manufacturing</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <img src={portrait} alt="Jordan Lee" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Jordan Lee</ItemTitle>
          <ItemDescription>Account Executive, Global Media</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
```

### Header and footer

An opportunity with its title and a badge in `ItemHeader`, and an amount and a button in `ItemFooter`.

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

export default function ItemHeaderFooter() {
  return (
    <Item variant="outline" className="max-w-md">
      <ItemHeader>
        <ItemTitle>Edge Installation</ItemTitle>
        <Badge>Negotiation</Badge>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          Edge Communications · Closes Dec 15, 2026
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <span>$120,000</span>
        <Button variant="outline">Log a Call</Button>
      </ItemFooter>
    </Item>
  )
}
```
