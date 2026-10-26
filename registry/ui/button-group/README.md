# Button group

This page shows the Radix version. Base UI projects get [registry/base/ui/button-group.tsx](../../base/ui/button-group.tsx), and [ui.wisty.ai/button-group](https://ui.wisty.ai/button-group) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Joins related buttons into one control, like a record's Edit, Clone and More.

```bash
npx shadcn@latest add @wisty/button-group
```

## Examples

- `default` (Record actions): New Contact, Edit and Clone joined with a More actions `DropdownMenuTrigger` at the end, styled with `buttonVariants()`.
- `brand` (Brand): Two brand buttons, with the inset line the group draws between them.
- `split` (Split button): A brand button and its options button, split by a `ButtonGroupSeparator`.
- `nested` (Nested): Two `ButtonGroup`s inside a third, kept apart, one with a disabled button.
- `text` (Text): Fixed text in `ButtonGroupText`, an `Input` that takes the space left, and a button.
- `vertical` (Vertical): Two icon buttons stacked with `orientation="vertical"` on `ButtonGroup`.

## When to use

- A few related actions sit together, like a record's Edit, Clone and Delete.
- A main action has a menu of related ones beside it, as a split button.
- An input needs a fixed prefix and an action, like a web address with Visit.

## When not to use

- The buttons stay pressed to show a choice. Use Toggle Group.
- The actions aren't related, or there are more than about four. Use separate buttons, or Dropdown Menu for the rest.
- An input needs icons or buttons inside its frame. Use Input Group.

## Usage

```tsx
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
```

```text
ButtonGroup
├── ButtonGroupText (optional, fixed text before an Input)
├── Button
├── ButtonGroupSeparator (between filled buttons)
└── DropdownMenuTrigger (optional, a menu at the end)
```

```tsx
<ButtonGroup aria-label="Approval">
  <Button variant="outline">Approve</Button>
  <Button variant="outline">Reject</Button>
</ButtonGroup>
```

Style a menu trigger in the group with `className={buttonVariants({ variant: "outline", size: "icon" })}`, as the Record actions example does. A `ButtonGroup` inside another keeps two sets apart, as Nested shows.

## Rules

- Use `variant="outline"` for a neutral group, and the brand variant only for the main action.
- Don't restyle the buttons' borders or corners inside a group. The group sets them.
- Use `ButtonGroupSeparator` between filled buttons, as in a split button. Bordered buttons already share a border.

## API reference

| Part | Built on |
| --- | --- |
| `ButtonGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ButtonGroupText` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ButtonGroupSeparator` | [Separator](https://ui.wisty.ai/separator#api-Separator) |

### ButtonGroup

| Prop | Type | Default |
| --- | --- | --- |
| `orientation`? | `"horizontal" \| "vertical"` | `"horizontal"` |

### ButtonGroupText

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild`? | `boolean` | `false` | Renders the child element in its place, with the props merged onto it. |

### ButtonGroupSeparator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation`? | `"horizontal" \| "vertical"` | `"vertical"` | Either `vertical` or `horizontal`. |

## SLDS mapping

`ButtonGroup` is `slds-button-group`: the buttons join, inner corners square, each keeping its start border and all but the last dropping their end border. A focused button takes SLDS's group focus, a brand button after a brand button gets SLDS's inset line, and nested groups sit apart as `.slds-button-group + .slds-button-group` do.

Known gaps:

- SLDS has no text part. `ButtonGroupText` is a box joined to the buttons, in the neutral button's border and radius. SLDS's nearest pattern, fixed text beside an input (`slds-form-element__addon`), sits outside the field without a box.
- SLDS has no separator element; between brand buttons it draws a line. `ButtonGroupSeparator` draws that line next to a filled button, and a border-colored one between bordered buttons.
- SLDS has no vertical group. `orientation="vertical"` mirrors the horizontal one.
- In Lightning Blue, SLDS keeps the line between two brand buttons while the second is hovered. Ours drops it on hover.

## Accessibility

- Name the group with `aria-label`, like "Record actions". It has the `group` role.
- Name icon-only buttons and triggers with `aria-label`.
- `ButtonGroupText` is plain text, not a label. Name an input beside it with `aria-label` or a Label.

## Responsive behavior

- The group is as wide as its children and doesn't wrap. Give it a width and an `Input` inside takes the space left, as the Text example shows.
- Keep groups to a few short labels, and move extra actions into a menu on narrow screens.

## Example code

### Record actions

New Contact, Edit and Clone joined with a More actions `DropdownMenuTrigger` at the end, styled with `buttonVariants()`.

```tsx
import { ChevronDownIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ButtonGroupDefault() {
  return (
    <ButtonGroup aria-label="Record actions">
      <Button variant="outline">New Contact</Button>
      <Button variant="outline">Edit</Button>
      <Button variant="outline">Clone</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="More actions"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Change owner</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
```

### Brand

Two brand buttons, with the inset line the group draws between them.

```tsx
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupBrand() {
  return (
    <ButtonGroup aria-label="Save">
      <Button>Save</Button>
      <Button>Save &amp; New</Button>
    </ButtonGroup>
  )
}
```

### Split button

A brand button and its options button, split by a `ButtonGroupSeparator`.

```tsx
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup aria-label="Save">
      <Button>Save</Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More save options">
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  )
}
```

### Nested

Two `ButtonGroup`s inside a third, kept apart, one with a disabled button.

```tsx
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupNested() {
  return (
    <ButtonGroup aria-label="Toolbar">
      <ButtonGroup aria-label="Pages">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="outline">Next</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Record actions">
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Delete</Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
```

### Text

Fixed text in `ButtonGroupText`, an `Input` that takes the space left, and a button.

```tsx
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"

export default function ButtonGroupWithText() {
  return (
    <ButtonGroup className="w-80">
      <ButtonGroupText>https://</ButtonGroupText>
      <Input aria-label="Website address" placeholder="example.com" />
      <Button variant="outline">Visit</Button>
    </ButtonGroup>
  )
}
```

### Vertical

Two icon buttons stacked with `orientation="vertical"` on `ButtonGroup`.

```tsx
import { MinusIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Zoom">
      <Button variant="outline" size="icon" aria-label="Zoom in">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Zoom out">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  )
}
```
