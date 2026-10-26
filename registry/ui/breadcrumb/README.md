# Breadcrumb

This page shows the Radix version. Base UI projects get [registry/base/ui/breadcrumb.tsx](../../base/ui/breadcrumb.tsx), and [ui.wisty.ai/breadcrumb](https://ui.wisty.ai/breadcrumb) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows where a page sits in a hierarchy, with links back up.

```bash
npx shadcn@latest add @wisty/breadcrumb
```

## Examples

- `default` (Related list trail): Links back to the Accounts list and the parent account, ending at the parent with no `BreadcrumbPage`.
- `collapsed` (Collapsed): A `BreadcrumbEllipsis` in place of the middle levels of a deep path, ending on the current page in `BreadcrumbPage`.

## When to use

- A page sits below other pages, and people go back up, like a record under its list view (Accounts > Acme) or a setup page under its section.
- The hierarchy is more than one level deep.

## When not to use

- The app has one level. A back link or the navigation is enough.
- People move between steps of a process. Use Path.
- People switch between sections of the same page. Use Tabs.

## Usage

```tsx
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
```

```text
Breadcrumb
└── BreadcrumbList
    ├── BreadcrumbItem
    │   └── BreadcrumbLink
    ├── BreadcrumbSeparator
    ├── BreadcrumbItem
    │   └── BreadcrumbEllipsis (optional, in place of middle levels)
    ├── BreadcrumbSeparator
    └── BreadcrumbItem
        └── BreadcrumbPage (optional, the current page)
```

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/opportunities">Opportunities</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Acme - 200 Widgets</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

A record or related list page can end the trail at the parent and show the current page as its title below, as Salesforce does and the Related list trail example shows; `BreadcrumbPage` is then left out. For your router's link, pass it to `BreadcrumbLink` with `asChild` in Radix projects or `render` in Base UI projects.

## Rules

- Put a `BreadcrumbSeparator` between items, never inside one.
- Don't add color or underline classes to links.

## API reference

| Part | Built on |
| --- | --- |
| `Breadcrumb` | [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav) |
| `BreadcrumbList` | [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol) |
| `BreadcrumbItem` | [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li) |
| `BreadcrumbLink` | [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) |
| `BreadcrumbPage` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `BreadcrumbSeparator` | [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li) |
| `BreadcrumbEllipsis` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |

### BreadcrumbLink

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild`? | `boolean` |  | Renders the child element in its place, with the props merged onto it. |

## SLDS mapping

`BreadcrumbList` is `slds-breadcrumb slds-list_horizontal slds-wrap`, each `BreadcrumbItem` is `slds-breadcrumb__item`, and `BreadcrumbLink` is its link, following SLDS's link reset.

Known gaps:

- SLDS draws a ">" before each item. `BreadcrumbSeparator` is a chevron icon in the text color, spaced like it; pass a child to draw something else.
- SLDS ends breadcrumbs at the parent, with the title in the page header. `BreadcrumbPage` is plain text with no SLDS counterpart.
- SLDS collapses levels into an overflow menu button. `BreadcrumbEllipsis` is decorative dots; put it in a Dropdown Menu trigger to list the hidden levels.

## Accessibility

- `Breadcrumb` is a `navigation` landmark named "breadcrumb". Pass your own `aria-label` when a page has two.
- `BreadcrumbPage` is announced as the current page and isn't a tab stop. Use it only for the page people are on.
- Separators and the ellipsis are hidden from assistive technology, so the ellipsis alone says nothing about the hidden levels.

## Responsive behavior

- Items wrap onto more lines when the trail is wider than its container, and a name too long for one line breaks inside a word. On narrow screens, show the first level, an ellipsis and the last one or two.

## Example code

### Related list trail

Links back to the Accounts list and the parent account, ending at the parent with no `BreadcrumbPage`.

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function BreadcrumbDefault() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Accounts</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Acme Corporation</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### Collapsed

A `BreadcrumbEllipsis` in place of the middle levels of a deep path, ending on the current page in `BreadcrumbPage`.

```tsx
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function BreadcrumbCollapsed() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Acme Corporation</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Contacts</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```
