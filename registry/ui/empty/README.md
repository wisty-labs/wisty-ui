# Empty

This page shows the Radix version. Base UI projects get [registry/base/ui/empty.tsx](../../base/ui/empty.tsx), and [ui.wisty.ai/empty](https://ui.wisty.ai/empty) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Says a list, table or panel has nothing in it yet, and what to do next.

```bash
npx shadcn@latest add @wisty/empty
```

## Examples

- `default` (No opportunities): An icon in `EmptyMedia variant="icon"`, a title, why it's empty, and the action to start in `EmptyContent`.
- `text` (No results): A filter that matches nothing: an `EmptyTitle` and an `EmptyDescription` with a link to clear filters, and no media.

## When to use

- A list, table, card or panel has nothing to show yet, and people need to know why and what to do.
- A search or filter returns no results, as the No results example shows.
- People have cleared every item, like a finished task list.

## When not to use

- Content is still loading. Use Skeleton or Spinner.
- Something failed and people must act now. Use Alert.
- The empty area is tiny, like one table cell. A short line of text is enough.

## Usage

```text
Empty
├── EmptyHeader
│   ├── EmptyMedia
│   ├── EmptyTitle
│   └── EmptyDescription
└── EmptyContent
```

`EmptyMedia`, `EmptyDescription` and `EmptyContent` are optional. Actions go in `EmptyContent`, after the header. Add the `border` class to `Empty` for a dashed frame.

```tsx
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx
<Empty className="border">
  <EmptyHeader>
    <EmptyTitle>No tasks due today</EmptyTitle>
    <EmptyDescription>Tasks assigned to you show up here.</EmptyDescription>
  </EmptyHeader>
</Empty>
```

Inside a card, put `Empty` in `CardContent`, and leave the action out of the card header so it isn't shown twice.

## Rules

- Say why the area is empty and what to do next, in one or two short sentences.
- Give one clear action in `EmptyContent` when there is one.
- Don't draw Salesforce's illustrations. Use `EmptyMedia variant="icon"` with an icon, or your own image.

## API reference

| Part | Built on |
| --- | --- |
| `Empty` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `EmptyHeader` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `EmptyMedia` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `EmptyTitle` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `EmptyDescription` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |
| `EmptyContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### EmptyMedia

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "icon"` | `"default"` |

## SLDS mapping

`Empty` follows SLDS 2's empty state, `slds-illustration slds-illustration_small`, without its illustrations. `EmptyTitle` is `slds-text-heading_medium` and `EmptyDescription` is `slds-text-body_regular`, both in the body color. Links in the description take SLDS's link colors, with an underline SLDS doesn't have, since in Cosmos the link blue is too close to the navy text to tell apart by color alone.

Known gaps:

- SLDS's illustrations are Salesforce artwork and aren't included. Pass your own image to `EmptyMedia`.

## Accessibility

- The title isn't a heading. Put one inside `EmptyTitle`, like `<h2>`, when the page outline needs it.
- Make the action's label say what it does, like "New opportunity".

## Responsive behavior

- It fills its container and centers its content. The header and content are at most 24rem wide.

## Example code

### No opportunities

An icon in `EmptyMedia variant="icon"`, a title, why it's empty, and the action to start in `EmptyContent`.

```tsx
import { InboxIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function EmptyDefault() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No opportunities yet</EmptyTitle>
        <EmptyDescription>
          Opportunities you create or own show up here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>New opportunity</Button>
      </EmptyContent>
    </Empty>
  )
}
```

### No results

A filter that matches nothing: an `EmptyTitle` and an `EmptyDescription` with a link to clear filters, and no media.

```tsx
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default function EmptyText() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          No accounts match your filters. <a href="#filters">Clear filters</a>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
```
