# Skeleton

This page shows the Radix version. Base UI projects get [registry/base/ui/skeleton.tsx](../../base/ui/skeleton.tsx), and [ui.wisty.ai/skeleton](https://ui.wisty.ai/skeleton) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Holds the place of content while it loads.

```bash
npx shadcn@latest add @wisty/skeleton
```

## Examples

- `default` (Loading rows): Three rows loading, each a round avatar and two lines of text.

## When to use

- Content takes more than about 300ms to load and you know its shape, like a list, a card or a record's fields.
- A whole page or region loads at once, where many spinners would be noisy.

## When not to use

- The wait is under about 300ms. Show the content when it arrives.
- An action is running, like a save, or you don't know the content's shape. Use Spinner.
- A part of the page only shows when it has data. Don't show a stencil for it.

## Usage

Size each `Skeleton` with classes to match the content it stands in for, and mark the loading region with `aria-busy="true"`.

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

```tsx
<div aria-busy="true">
  <Skeleton className="h-4 w-3/5" />
</div>
```

## Rules

- Keep heights consistent, and use percent widths or `w-full` so stencils fill their container.
- Keep text that's known before the data arrives, such as a card's title, as real text.
- Don't draw buttons as skeletons.

## API reference

### Skeleton

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

## SLDS mapping

SLDS has no skeleton classes. Its Loading pattern calls these stencils, and the block is its shade surface, `slds-theme_shade`.

Known gaps:

- SLDS says stencils fade in and cross-fade to the content. Do that yourself if you need it.
- SLDS suggests about 20 fading stencil rows for a long table. There's no table stencil; build the rows from skeletons.

## Accessibility

- A skeleton has no role, so screen readers skip it. Remove `aria-busy` from the region when the content arrives.
- For a long wait, also say so in text, like a visually hidden "Loading contacts".

## Motion

- The skeleton pulses in every theme. With reduced motion it holds still, so don't animate it yourself.

## Example code

### Loading rows

Three rows loading, each a round avatar and two lines of text.

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDefault() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
```
