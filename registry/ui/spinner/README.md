# Spinner

This page shows the Radix version. Base UI projects get [registry/base/ui/spinner.tsx](../../base/ui/spinner.tsx), and [ui.wisty.ai/spinner](https://ui.wisty.ai/spinner) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows that something is loading.

```bash
npx shadcn@latest add @wisty/spinner
```

## Examples

- `default` (Loading): A spinner on its own, named Loading for screen readers.
- `sizes` (Sizes): SLDS's xx-small, x-small, small, medium and large spinners, set with `size-3`, `size-4` (the default), `size-5`, `size-8` and `size-12`.
- `colors` (Colors): The brand spinner with `text-primary`, and the inverse spinner on a dark surface with `text-inverse-foreground`.

## When to use

- Something is loading or running and you can't show its shape, like a search, a save or a refresh.
- A button starts a slow action and should show it's busy.

## When not to use

- You know the shape of the content that's loading, like a list or a card. Use Skeleton.
- You know how far along a task is. Use Progress.
- The wait is under about 300ms. Show nothing.

## Usage

Render a `Spinner` where the content will appear and name it for what's loading. Inside a `Button` it takes the button's text color: disable the button and keep its label next to the spinner.

```tsx
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
```

```tsx
<Button disabled>
  <Spinner aria-label="Saving" />
  Saving
</Button>
```

## Rules

- Use only the gray default, `text-primary` for the brand spinner and `text-inverse-foreground` on dark surfaces.
- Don't add `animate-spin`. The spinner has its own motion.

## API reference

### Spinner

Also takes every [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg) prop.

## SLDS mapping

`Spinner` is `slds-spinner slds-spinner_inline`: six dots that bounce outward in turn. Sizes follow SLDS's widths: `size-3` is `slds-spinner_xx-small`, `size-4` is `_x-small`, `size-5` is `_small`, `size-8` is `_medium` and `size-12` is `_large`, as the Sizes example shows. `className="text-primary"` is `slds-spinner_brand`, and `text-inverse-foreground` is `slds-spinner_inverse`, as the Colors example shows.

Known gaps:

- SLDS's spinner container (`slds-spinner_container`), the overlay that covers a region while it loads, isn't part of the spinner. Build it with a positioned `div` if you need it.
- SLDS's delayed spinner (`slds-spinner_delayed`) isn't a prop. Render the spinner after 300ms instead.
- SLDS's inline spinner centers its dots on the top edge of its box. This one centers them in the box.
- In Lightning Blue, `text-primary` is a little darker than SLDS's brand spinner.

## Accessibility

- The spinner is a `role="status"` named "Loading". Name it for what's loading with `aria-label`, like "Loading contacts".
- Inside a button, keep the button's own text, like "Saving". It names the action; the spinner's label names the wait.

## Motion

- The dots bounce outward in turn, once a second, in every theme.
- With reduced motion the dots hold still. The spinner's name still says something is loading.

## Responsive behavior

- The spinner keeps its size in a flex row. Set it with `size-*` classes, not `width` and `height`.
- The dots spill out of the box. Together they're about a quarter wider than it at rest, and half again as wide at the top of a bounce. Keep that much space free around it, more so for large spinners.

## Example code

### Loading

A spinner on its own, named Loading for screen readers.

```tsx
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerDefault() {
  return <Spinner aria-label="Loading" />
}
```

### Sizes

SLDS's xx-small, x-small, small, medium and large spinners, set with `size-3`, `size-4` (the default), `size-5`, `size-8` and `size-12`.

```tsx
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerSizes() {
  return (
    <div className="flex items-center gap-10">
      <Spinner className="size-3" aria-label="Loading owner" />
      <Spinner aria-label="Loading fields" />
      <Spinner className="size-5" aria-label="Loading activity" />
      <Spinner className="size-8" aria-label="Loading contacts" />
      <Spinner className="size-12" aria-label="Loading dashboard" />
    </div>
  )
}
```

### Colors

The brand spinner with `text-primary`, and the inverse spinner on a dark surface with `text-inverse-foreground`.

```tsx
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerColors() {
  return (
    <div className="flex items-center gap-10">
      <Spinner className="size-8 text-primary" aria-label="Loading contacts" />
      <div className="flex size-20 items-center justify-center rounded-md bg-inverse">
        <Spinner
          className="size-8 text-inverse-foreground"
          aria-label="Loading reports"
        />
      </div>
    </div>
  )
}
```
