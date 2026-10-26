# Button

This page shows the Radix version. Base UI projects get [registry/base/ui/button.tsx](../../base/ui/button.tsx), and [ui.wisty.ai/button](https://ui.wisty.ai/button) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Runs an action on the page, like Save, Edit or New.

```bash
npx shadcn@latest add @wisty/button
```

## Examples

- `default` (Page actions): A list view's actions: `size="icon"` refresh and settings buttons, an `outline` Import and the brand New.
- `variants` (Variants): Every `variant`, with the four added ones on the lower rows and `inverse` on `bg-inverse`.
- `sizes` (Sizes): Each text `size` on the first row and each icon `size` on the second.
- `with-icon` (With icon): Icons as children, after or before the label, and `size="icon"` buttons in brand and `ghost`.
- `disabled` (Disabled): Bordered, filled and base buttons with `disabled`.
- `link` (As a link): Links to another page, styled as neutral and brand buttons with `buttonVariants()` as their class.

## When to use

- To run an action on the current page: save a record, submit a form, open a dialog or start a flow.
- For the main action of a page, form or dialog. Use `default` (SLDS brand) and keep it to one per view.
- For the actions next to it, such as Cancel or Edit. Use `outline` (SLDS neutral).
- For low-emphasis actions in toolbars, card headers and table rows. Use `ghost`, or an icon button with an `aria-label`.
- To confirm a delete or another action you can't undo. Use `destructive`, or `destructive-text` when the delete isn't the main action.
- For approve, complete and other positive actions. Use `success`.
- On a dark surface such as `bg-inverse`. Use `inverse`.

## When not to use

- To go to another page or URL. Use a link (`<a>` or your router's `Link`). If it has to look like a button, give the link `className={buttonVariants()}`, as in As a link.
- For a link inside a sentence. Use a plain `<a>`. The `link` variant is for standalone actions.
- To turn a setting on or off. Use Switch, or Toggle when the control shows a pressed state.
- To pick one option from a small set. Use Tabs to switch views, or Toggle Group or Radio Group to pick a value.
- To show a status, label or count. Use Badge.
- To offer several related actions in a small space. Use Dropdown Menu with a Button as its trigger.

## Usage

Pick a `variant` and a `size`. An icon goes before or after the label as a child; an icon-only button takes `size="icon"` and an `aria-label`.

```tsx
import { Button } from "@/components/ui/button"
```

```tsx
<Button>Save</Button>
```

A link that should look like a button takes `buttonVariants()` as its class, as the As a link example shows.

## Rules

- One `default` button per view or dialog, for the main action. The rest are `outline`, or `ghost` in dense toolbars.
- Never override radius, colors, font weight, height or shadows with utility classes such as `rounded-md`, `bg-blue-600`, `font-medium`, `h-9` or `shadow-sm`. The tokens carry each theme, and an override pins one look into every theme. Layout classes such as `w-full`, margins and `self-end` are fine.
- Put Lucide icons in as bare children. The button sizes and spaces them; give one a `size-*` class only to change its size.
- Space side-by-side buttons with `gap-2` on the parent. Button has no margin of its own.
- Prefer `size="default"`, `icon` and `icon-xs`. `xs`, `sm`, `lg`, `icon-sm` and `icon-lg` have no SLDS counterpart.
- Use `inverse` only on dark surfaces such as `bg-inverse`.
- For navigation, style the link itself: `<a href="/setup" className={buttonVariants()}>Setup</a>`. Never put a button inside a link, or a link inside a button.

## API reference

### Button

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant`? | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link" \| "outline-brand" \| "destructive-text" \| "success" \| "inverse"` | `"default"` |  |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` |  |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |

Also takes every [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) prop.

## SLDS mapping

Button draws SLDS 2's button on shadcn's props: brand, neutral, the base button, destructive and the text link, plus four variants SLDS has and shadcn doesn't. The table lists each value's SLDS class. `secondary` is neutral too, since SLDS has no filled gray button. Icon buttons color their glyph as SLDS icon buttons do: the link blue in Cosmos, gray in Lightning Blue.

Known gaps:

- Labels don't wrap. SLDS lets a long label wrap onto a second line.
- No spacing between buttons. SLDS puts 4px between siblings; here you set a gap on the parent.
- A `ghost` icon button is a 32px box, like SLDS's container icon button. SLDS's bare icon button is only as big as its glyph.
- Not covered: stateful buttons, selected icon buttons, and the bare, error, warning and more icon button styles. Rows of joined buttons are Button Group.

## Accessibility

- Icon-only buttons need an `aria-label`. Lucide icons render `aria-hidden`, so the label is the button's only name.
- Inside a form, a button without a `type` submits it. Set `type="button"` on every button that isn't the submit action.
- A disabled button can't take focus or show a tooltip. Say why an action is unavailable in nearby text.
- A link styled as a button follows Enter but not Space, as any link does, and `disabled` does nothing on it.
- The focus ring shows on keyboard focus only. It's a box shadow, so in forced-colors mode it becomes a 2px outline.
- `inverse` is made for `bg-inverse`. Check contrast before you put it on another surface.

## Motion

- In Cosmos, hovering lifts a button: 1.5px for bordered variants, 2px for filled ones, each with an edge shadow. Pressing drops it. Lightning Blue sets the lift and the shadow to none, so its buttons only change color.
- A button whose popup is open (`aria-expanded`) doesn't lift, so a popover anchored to it stays still.
- The lift runs with reduced motion too. It's 2px over 150ms, and SLDS has no reduced-motion rule for buttons either.

## Responsive behavior

- Labels don't wrap, so a long label overflows a narrow container. Keep labels short and let rows of buttons wrap with `flex-wrap`.
- For a full-width button on small screens, add `w-full`. That's SLDS's stretch button, with the label still centered.
- `xs` and `icon-xs` are 24px, WCAG's minimum target size. For touch-first screens use `lg` and `icon-lg`, at 40px.

## Example code

### Page actions

A list view's actions: `size="icon"` refresh and settings buttons, an `outline` Import and the brand New.

```tsx
import { PlusIcon, RefreshCwIcon, SettingsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonDefault() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="icon" variant="outline" aria-label="Refresh">
        <RefreshCwIcon />
      </Button>
      <Button size="icon" variant="outline" aria-label="List view settings">
        <SettingsIcon />
      </Button>
      <Button variant="outline">Import</Button>
      <Button>
        <PlusIcon />
        New
      </Button>
    </div>
  )
}
```

### Variants

Every `variant`, with the four added ones on the lower rows and `inverse` on `bg-inverse`.

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonVariants() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Brand</Button>
        <Button variant="outline">Neutral</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Base</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline-brand">Outline brand</Button>
        <Button variant="destructive-text">Destructive text</Button>
        <Button variant="success">Success</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-md bg-inverse p-4">
        <Button variant="inverse">Inverse</Button>
      </div>
    </div>
  )
}
```

### Sizes

Each text `size` on the first row and each icon `size` on the second.

```tsx
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs" variant="outline">
          Extra small
        </Button>
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button variant="outline">Default</Button>
        <Button size="lg" variant="outline">
          Large
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-xs" variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-lg" variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
      </div>
    </div>
  )
}
```

### With icon

Icons as children, after or before the label, and `size="icon"` buttons in brand and `ghost`.

```tsx
import {
  ChevronDownIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline">
        Actions
        <ChevronDownIcon />
      </Button>
      <Button variant="destructive-text">
        <Trash2Icon />
        Delete
      </Button>
      <Button size="icon" aria-label="Add record">
        <PlusIcon />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Settings">
        <SettingsIcon />
      </Button>
    </div>
  )
}
```

### Disabled

Bordered, filled and base buttons with `disabled`.

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>Brand</Button>
      <Button variant="outline" disabled>
        Neutral
      </Button>
      <Button variant="outline-brand" disabled>
        Outline brand
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
      <Button variant="success" disabled>
        Success
      </Button>
      <Button variant="ghost" disabled>
        Base
      </Button>
    </div>
  )
}
```

### As a link

Links to another page, styled as neutral and brand buttons with `buttonVariants()` as their class.

```tsx
import { buttonVariants } from "@/components/ui/button"

export default function ButtonLink() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href="#" className={buttonVariants({ variant: "outline" })}>
        View all
      </a>
      <a href="#" className={buttonVariants()}>
        Open report
      </a>
    </div>
  )
}
```
