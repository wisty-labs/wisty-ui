# Separator

This page shows the Radix version. Base UI projects get [registry/base/ui/separator.tsx](../../base/ui/separator.tsx), and [ui.wisty.ai/separator](https://ui.wisty.ai/separator) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Draws a thin line between groups of content.

```bash
npx shadcn@latest add @wisty/separator
```

## Examples

- `default` (Account summary): A line under an account's name, and lines with `orientation="vertical"` between Details, Related and Activity in an `h-5` flex row.

## When to use

- To put a light break between two groups of content, like a card's details and its actions.
- To put a thin line between items in a row, like links or toolbar buttons.

## When not to use

- Content needs more than a line to set it apart. Use spacing or Card.
- Items in a menu. Use the menu's own separator.
- Table rows. Table draws its own lines.

## Usage

Render a `Separator` between two groups and set its margin with classes:

```tsx
import { Separator } from "@/components/ui/separator"
```

```tsx
<Separator className="my-3" />
```

A vertical separator takes `orientation="vertical"` and stretches to its flex row's height, so the row's height sets the line's length, as `flex h-5 items-center gap-3` does in the Account summary example.

The bases differ for screen readers. In Radix projects the line is decorative by default and screen readers skip it; pass `decorative={false}` when it separates sections that matter to the page's structure. In Base UI projects it's always announced as a separator, and there's no `decorative` prop.

## Rules

- Put a vertical separator in a flex row. In a plain block it has no height, so it doesn't show.
- Don't recolor the line. Its color comes from the theme's border token.

## API reference

### Separator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation`? | `"horizontal" \| "vertical"` | `"horizontal"` | Either `vertical` or `horizontal`. |
| `decorative`? | `boolean` | `true` | Whether or not the component is purely decorative. |

Also takes every [Radix Separator.Root](https://www.radix-ui.com/primitives/docs/components/separator#root) prop.

## SLDS mapping

A horizontal `Separator` is the line of `slds-has-divider_top` and `slds-has-divider_bottom`. A vertical one is `slds-border_left`.

Known gaps:

- SLDS's spaced dividers (`slds-has-divider_top-space`) carry their own margin. Add it with `my-2`.
- SLDS's vertical divider, `slds-has-divider_left`, is a small dot before an item. Separator draws a line instead.

## Example code

### Account summary

A line under an account's name, and lines with `orientation="vertical"` between Details, Related and Activity in an `h-5` flex row.

```tsx
import { Separator } from "@/components/ui/separator"

export default function SeparatorDefault() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <div>
        <p className="font-semibold">Acme Corporation</p>
        <p className="text-muted-foreground">Customer · Manufacturing</p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-3">
        <span>Details</span>
        <Separator orientation="vertical" />
        <span>Related</span>
        <Separator orientation="vertical" />
        <span>Activity</span>
      </div>
    </div>
  )
}
```
