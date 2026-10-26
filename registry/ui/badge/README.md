# Badge

This page shows the Radix version. Base UI projects get [registry/base/ui/badge.tsx](../../base/ui/badge.tsx), and [ui.wisty.ai/badge](https://ui.wisty.ai/badge) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Labels a status or a count in a short chip.

```bash
npx shadcn@latest add @wisty/badge
```

## Examples

- `default` (Opportunity status): A stage badge, and a `variant="warning"` badge with a clock icon for a close date that has passed.
- `variants` (Variants): Every `variant`, with `inverse`, `success`, `warning` and `info` on the second row.
- `with-icon` (With icon): An icon as a direct child of `Badge`, before the label on three badges and after it on Escalated.
- `link` (As a link): Links to filtered list views, styled with `cn(badgeVariants())` on the anchor, with a hover color and focus ring.

## When to use

- To label a record's status where people scan for it, like a stage in a table row or a state next to a page title.
- To show a short count or category next to a label: "3 new", "Beta", "Partner".
- To color a status by meaning with `success`, `warning`, `destructive` and `info`. The word in the label still carries the meaning.
- To link a label to a filtered view, with `badgeVariants()` on the link.

## When not to use

- For an action like Approve or Retry. Use Button.
- For a value people can remove, like a selected filter or a record picked in a lookup. Use Pill.
- For a message that needs a sentence or tells people what to do next. Use Alert.
- To flag a form error. Put the error text under the field, with Field.
- To switch between views. Use Tabs.

## Usage

Pick a `variant` by meaning. An icon goes before or after the label as a direct child.

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge variant="success">Qualified</Badge>
```

A link that should look like a badge takes `badgeVariants()` through `cn()`, as the As a link example shows. Without `cn()`, the `outline` and `secondary` borders lose to the base's transparent border.

## Rules

- Don't wrap an icon or set its `size`. The badge sizes only its direct `svg` children.
- Don't add `onClick` to a badge. Use Button for actions.
- Never hard-code colors or sizes (`bg-green-100`, `rounded-full`, `text-[11px]`). The tokens carry each theme.
- A badge can be a link, but it can't contain one or any other control.
- Avoid `ghost` and `link`. Salesforce draws neither, so they look out of place next to other badges.

## API reference

### Badge

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant`? | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link" \| "inverse" \| "success" \| "warning" \| "info"` | `"default"` |  |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |

Also takes every [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) prop.

## SLDS mapping

`Badge` is `slds-badge`, and the feedback variants are its `slds-theme_*` colors. `secondary` and `outline` both draw `slds-badge_lightest`, so they look the same. `ghost` and `link` have no SLDS counterpart: they're shadcn's, kept so shadcn code still compiles.

Known gaps:

- SLDS puts a start margin between adjacent badges (`.slds-badge + .slds-badge`). Badge doesn't, so give the parent a `gap-2`.

## Accessibility

- Write the status in the label. The feedback variants only change colors, and icons are hidden from assistive technology.
- Don't put `aria-label` on a plain badge. A `span` with no role can't take a name, and axe reports it. Add hidden text instead: `<Badge>3 <span className="sr-only">unread</span></Badge>`.
- A badge doesn't announce changes. If a count updates while someone's on the page and they need to know, render it inside a `role="status"` region.
- In Lightning Blue, the `default` badge's gray text on gray is below 4.5:1, the pair Salesforce's own badge uses.
- In Cosmos dark, the `inverse` badge's dark text on gray is below 4.5:1, the pair Salesforce's own inverse badge uses.

## Responsive behavior

- A badge sizes to its content, never wraps and doesn't shrink in a flex row, so a long label makes it wider. To cap one, set a max width and truncate the text: `<Badge className="max-w-40"><span className="truncate">Enterprise renewal</span></Badge>`.
- Put `flex flex-wrap gap-2` on the parent so a row of badges wraps.

## Example code

### Opportunity status

A stage badge, and a `variant="warning"` badge with a clock icon for a close date that has passed.

```tsx
import { ClockIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export default function BadgeDefault() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Negotiation</Badge>
      <Badge variant="warning">
        <ClockIcon />
        Close date passed
      </Badge>
    </div>
  )
}
```

### Variants

Every `variant`, with `inverse`, `success`, `warning` and `info` on the second row.

```tsx
import { Badge } from "@/components/ui/badge"

export default function BadgeVariants() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="inverse">Inverse</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
      </div>
    </div>
  )
}
```

### With icon

An icon as a direct child of `Badge`, before the label on three badges and after it on Escalated.

```tsx
import { ArrowUpIcon, CheckIcon, CircleAlertIcon, StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <StarIcon />
        Starred
      </Badge>
      <Badge variant="success">
        <CheckIcon />
        Closed Won
      </Badge>
      <Badge variant="destructive">
        <CircleAlertIcon />
        At risk
      </Badge>
      <Badge variant="warning">
        Escalated
        <ArrowUpIcon />
      </Badge>
    </div>
  )
}
```

### As a link

Links to filtered list views, styled with `cn(badgeVariants())` on the anchor, with a hover color and focus ring.

```tsx
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function BadgeLink() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href="#negotiation"
        className={cn(badgeVariants({ variant: "outline" }))}
      >
        Negotiation
      </a>
      <a href="#partner" className={cn(badgeVariants())}>
        Partner
      </a>
    </div>
  )
}
```
