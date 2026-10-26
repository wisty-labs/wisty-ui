# Hover card

This page shows the Radix version. Base UI projects get [registry/base/ui/hover-card.tsx](../../base/ui/hover-card.tsx), and [ui.wisty.ai/hover-card](https://ui.wisty.ai/hover-card) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Previews a linked record or person while the pointer rests on the link.

```bash
npx shadcn@latest add @wisty/hover-card
```

## Examples

- `default` (Record preview): An account link, `HoverCardTrigger` with an `href`, previews the account when the pointer rests on it or it takes focus.

## When to use

- A link to a record or person, where a quick preview saves a click: an account's type and phone, a contact's title and email.
- Salesforce's record previews, opened on hover from a link that still goes somewhere useful.

## When not to use

- The content is the only way to get the information, or people need to act in it. Hover cards open on hover and focus only, and touch screens have no hover. Use Popover, opened by a click.
- The hint is a few words about a control. Use Tooltip.
- The preview needs a form or several actions. Use Popover or Dialog.

## Usage

```text
HoverCard
├── HoverCardTrigger
└── HoverCardContent
```

The trigger renders a link. Give it an `href`, so it still goes to the record when clicked.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
```

```tsx
<HoverCard>
  <HoverCardTrigger
    href="/contacts/sarah-chen"
    className={buttonVariants({ variant: "link" })}
  >
    Sarah Chen
  </HoverCardTrigger>
  <HoverCardContent>VP Sales, sarah.chen@edge.example</HoverCardContent>
</HoverCard>
```

The card waits before it opens and closes. In Radix projects, change the waits with `openDelay` and `closeDelay` on `HoverCard`. In Base UI projects, use `delay` and `closeDelay` on `HoverCardTrigger`.

## Rules

- Put only a preview in the card: the record's name and a few short lines about it.
- Don't add borders, shadows, padding or colors to `HoverCardContent`. They come from the theme.

## API reference

| Part | Built on |
| --- | --- |
| `HoverCard` | [Radix HoverCard.Root](https://www.radix-ui.com/primitives/docs/components/hover-card#root) |
| `HoverCardTrigger` | [Radix HoverCard.Trigger](https://www.radix-ui.com/primitives/docs/components/hover-card#trigger) |
| `HoverCardContent` | [Radix HoverCard.Content](https://www.radix-ui.com/primitives/docs/components/hover-card#content) |

### HoverCardContent

| Prop | Type | Default |
| --- | --- | --- |
| `align`? | `"center" \| "end" \| "start"` | `"center"` |
| `sideOffset`? | `number` | `4` |

## SLDS mapping

SLDS has no hover card. Salesforce's record previews open a popover on hover, so the hover card takes Popover's look.

- `HoverCardContent` is `slds-popover` and `slds-popover__body` in one element, as `PopoverContent` is.
- `HoverCardTrigger` is a link. In the example it's `slds-button` (Button's `link` variant).

Known gaps:

- No nubbin. SLDS popovers usually point at their trigger.
- No `slds-popover_panel` layout (the record preview with a gray header). Compose one inside the content if you need it.

## Accessibility

- The card has no role and doesn't describe the link. Screen reader users hear the link only, so the card must never hold the only copy of anything.
- Give the link a name that makes sense alone, like the record's name.
- Focus stays on the link while the card is open, so links inside the card are hard to reach from the keyboard. Keep it to text.

## Motion

- The card fades in over 0.1s in every theme. The fade only changes opacity, so it stays on with reduced motion.

## Example code

### Record preview

An account link, `HoverCardTrigger` with an `href`, previews the account when the pointer rests on it or it takes focus.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function HoverCardDefault() {
  return (
    <HoverCard>
      <HoverCardTrigger
        href="#edge-communications"
        className={buttonVariants({ variant: "link" })}
      >
        Edge Communications
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-0.5">
        <p className="font-semibold">Edge Communications</p>
        <p>Customer in Austin, owned by Sarah Chen.</p>
        <p className="text-muted-foreground">Customer since 2019</p>
      </HoverCardContent>
    </HoverCard>
  )
}
```
