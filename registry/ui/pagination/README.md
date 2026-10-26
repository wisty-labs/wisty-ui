# Pagination

This page shows the Radix version. Base UI projects get [registry/base/ui/pagination.tsx](../../base/ui/pagination.tsx), and [ui.wisty.ai/pagination](https://ui.wisty.ai/pagination) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Moves between pages of a long list.

```bash
npx shadcn@latest add @wisty/pagination
```

## Examples

- `default` (Page links): Previous, page links with the second marked `isActive`, a `PaginationEllipsis` before the last page, and next.

## When to use

- A list or table has more rows than fit on one page, and people move between pages.
- People need to jump to a page by number, or step to the previous or next one.

## When not to use

- The list grows as people scroll, as Salesforce's list views do. Use Data table, which loads more rows instead.
- There are only two or three steps in a flow. Use Path, or buttons.
- People move between sections of one page. Use Tabs.

## Usage

```text
Pagination
└── PaginationContent
    ├── PaginationItem
    │   └── PaginationPrevious
    ├── PaginationItem
    │   └── PaginationLink
    ├── PaginationItem
    │   └── PaginationEllipsis
    └── PaginationItem
        └── PaginationNext
```

`Pagination` centers itself in its row. To sit it at the end of a list's footer, beside a count, pass `className="mx-0 w-auto"`:

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

```tsx
<div className="flex items-center justify-between gap-2">
  <p className="text-muted-foreground">26–50 of 132 accounts</p>
  <Pagination className="mx-0 w-auto">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="?page=1" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="?page=2" isActive>
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="?page=3" />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>
```

`size` on a link takes Button's sizes: page numbers default to square `icon` buttons, and previous and next to `default`.

## Rules

- Mark exactly one page, the current one, with `isActive`. It sets `aria-current="page"`.
- Give every link an `href` that loads that page, so pages open in a new tab and work without JavaScript.
- Use `PaginationEllipsis` for skipped pages, not a disabled link.
- Don't restyle the links with variant or color classes.

## API reference

| Part | Built on |
| --- | --- |
| `Pagination` | [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav) |
| `PaginationContent` | [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul) |
| `PaginationItem` | [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li) |
| `PaginationLink` | [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) |
| `PaginationPrevious` | [PaginationLink](https://ui.wisty.ai/pagination#api-PaginationLink) |
| `PaginationNext` | [PaginationLink](https://ui.wisty.ai/pagination#api-PaginationLink) |
| `PaginationEllipsis` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |

### PaginationLink

| Prop | Type | Default |
| --- | --- | --- |
| `isActive`? | `boolean` |  |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"icon"` |

### PaginationPrevious

| Prop | Type | Default |
| --- | --- | --- |
| `isActive`? | `boolean` |  |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` |  |
| `text`? | `string` | `"Previous"` |

### PaginationNext

| Prop | Type | Default |
| --- | --- | --- |
| `isActive`? | `boolean` |  |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` |  |
| `text`? | `string` | `"Next"` |

## SLDS mapping

SLDS has no pagination. This one is built from SLDS buttons, through `buttonVariants`; the table shows which pages are neutral and which are base buttons. Previous and next are base buttons (`slds-button`) with a chevron. Page numbers take the link color of labelled SLDS buttons, since a page number is a label. The ellipsis has no SLDS part.

Known gaps:

- No disabled state for previous or next on the first or last page. Leave the item out instead.

## Accessibility

- `Pagination` is a `navigation` landmark named "pagination". Rename it with `aria-label` when a page has more than one.
- Previous and next are named "Go to previous page" and "Go to next page" whether or not their text shows. `text` changes the visible label, not the name.

## Responsive behavior

- The list doesn't wrap. Show fewer page numbers on narrow screens, with an ellipsis for the rest.
- Below the `sm` breakpoint, previous and next show only their chevrons.

## Example code

### Page links

Previous, page links with the second marked `isActive`, a `PaginationEllipsis` before the last page, and next.

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationDefault() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=6">6</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```
