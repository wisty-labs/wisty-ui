# Card

This page shows the Radix version. Base UI projects get [registry/base/ui/card.tsx](../../base/ui/card.tsx), and [ui.wisty.ai/card](https://ui.wisty.ai/card) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Groups related content and actions in a titled container.

```bash
npx shadcn@latest add @wisty/card
```

## Examples

- `default` (Related list): An account's contacts: a count in `CardTitle`, New in `CardAction`, a line of content and View all in `CardFooter`.
- `nested` (Nested): Two cards with `size="sm"` inside another, which drop their border and shadow.
- `with-icon` (With icon): The contact object's icon before the title, an `Icon` inside `CardTitle` with `flex items-center gap-3`, and New in `CardAction`.
- `empty-and-loading` (Empty and loading): A card with no tasks shows `Empty` in `CardContent`, and a card still loading its events shows a `Spinner` in its place.

## When to use

- To group content and actions about one thing under a title, like the contacts on an account or a summary of open cases.
- For a related list on a record page: a title with a count, a New button in the header and a View all link in the footer, as the Related list example shows.
- For dashboard tiles in a grid, where each card stands on its own.
- For a sub-section inside a card. Give the inner card `size="sm"`, as in Nested.

## When not to use

- For a record or page header with the record name, key fields and page actions. Use a plain `<header>`.
- To switch between peer panels of equal weight. Use Tabs.
- For page layout. Use plain `<section>` or `<div>` elements with grid or flex, and put cards inside them.
- As one big click target. Put a link in the title or a button in the header action instead.
- For a third level of nesting. Inside a small card, use a list, a heading or a divider.

## Usage

```tsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

```text
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter
```

Every part is optional. `CardAction` places itself at the end of the header, beside the title and description.

## Rules

- Keep CardAction inside CardHeader. Its grid placement only works there.
- Don't add radius, border, shadow or title size classes. The tokens set them per theme, and a class pins one look into every theme.
- Nest one level at most, with `size="sm"` on the inner card only.
- A Cosmos card has no visible border or shadow, so put it on the gray page (`bg-page`). On a white surface, pass `border-border`.
- The footer centers its content. Pass `justify-end` for form actions, or `border-t-0` to drop the divider.
- When View all navigates, render a link: `<a href="/contacts" className={buttonVariants({ variant: "link" })}>View all</a>`.
- For a table of records in a card, use the Related list block. Table draws its own border, so a Table under `px-0` puts that border on the card's edges. For other full-bleed content, pass `px-0` to CardContent, and in a small card also `group-data-[size=sm]/card:px-0`.

## API reference

| Part | Built on |
| --- | --- |
| `Card` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CardHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CardTitle` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CardDescription` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CardAction` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CardContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CardFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### Card

| Prop | Type | Default |
| --- | --- | --- |
| `size`? | `"default" \| "sm"` | `"default"` |

## SLDS mapping

- `Card` is `slds-card`. A card inside a card drops its border and shadow, as `.slds-card .slds-card` does.
- `CardHeader` is `slds-card__header`, `CardTitle` is `slds-card__header-title`, and `CardAction` is the `slds-no-flex` slot at the end of the header.
- `CardDescription` has no SLDS counterpart. It uses SLDS's meta text (`slds-text-body_small`).
- `CardContent` is `slds-card__body slds-card__body_inner`, and `CardFooter` is `slds-card__footer`.

Known gaps:

- No header icon slot. Put the object icon inside CardTitle, as With icon shows.
- No linked title style (`slds-card__header-link`). Put an `<a>` inside CardTitle and add `hover:underline`.
- No margin between stacked sibling cards. Set a gap on the container.
- No `slds-card_boundary`. To bring back a nested card's border, pass `in-data-[slot=card]:border-border`.
- Every part renders a `div`, where SLDS uses `<article>`, `<header>` and `<footer>`.

## Accessibility

- CardTitle isn't a heading. When the page outline needs one, put it inside: `<CardTitle><h2>Contacts</h2></CardTitle>`. The title style doesn't change.
- For a major section of the page, wrap the card in a `<section>` whose `aria-labelledby` points at the title's `id`. Don't do it for every card: too many regions make landmark navigation noisy.
- CardDescription's muted text is 4.6:1 on white in Lightning Blue. On a gray fill like `bg-muted` it drops below 4.5:1, so keep it on the card surface.

## Responsive behavior

- Card fills its container. Constrain it with the container or a class like `max-w-md`.
- Titles wrap. Add `truncate` to CardTitle for a single-line title.
- CardHeader is a named container (`@container/card-header`), so header content can respond to the card's width. It also adds nothing to the card's intrinsic width: in a flex row or a `w-fit` layout, give the card a width.
- The card clips overflow. Wrap wide content, like a table, in a `div` with `overflow-x-auto`, keep the default padding around focusable content so focus rings aren't cut off, and render menus and popovers in a portal (Popover and Dropdown Menu do by default).

## Example code

### Related list

An account's contacts: a count in `CardTitle`, New in `CardAction`, a line of content and View all in `CardFooter`.

```tsx
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardDefault() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Contacts (3)</CardTitle>
        <CardDescription>Acme Corporation</CardDescription>
        <CardAction>
          <Button variant="outline">New</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        Ada Lovelace, Grace Hopper and Alan Turing work at this account.
      </CardContent>
      <CardFooter>
        <a href="#" className={buttonVariants({ variant: "link" })}>
          View all
        </a>
      </CardFooter>
    </Card>
  )
}
```

### Nested

Two cards with `size="sm"` inside another, which drop their border and shadow.

```tsx
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardNested() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Opportunity details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Next step</CardTitle>
            <CardAction>
              <Badge variant="warning">Due today</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>Send the revised quote to procurement.</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Competitors</CardTitle>
          </CardHeader>
          <CardContent>Globex, Initech</CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
```

### With icon

The contact object's icon before the title, an `Icon` inside `CardTitle` with `flex items-center gap-3`, and New in `CardAction`.

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icon } from "@/components/wisty/icon"

export default function CardWithIcon() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon name="standard:contact" size="small" />
          Contacts (3)
        </CardTitle>
        <CardAction>
          <Button variant="outline">New</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        Ada Lovelace, Grace Hopper and Alan Turing work at this account.
      </CardContent>
    </Card>
  )
}
```

### Empty and loading

A card with no tasks shows `Empty` in `CardContent`, and a card still loading its events shows a `Spinner` in its place.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export default function CardEmptyAndLoading() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No new tasks</EmptyTitle>
              <EmptyDescription>
                Nothing needs your attention right now. Check back later.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Spinner className="size-8" aria-label="Loading events" />
        </CardContent>
      </Card>
    </div>
  )
}
```
