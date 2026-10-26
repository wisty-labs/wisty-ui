# Kbd

This page shows the Radix version. Base UI projects get [registry/base/ui/kbd.tsx](../../base/ui/kbd.tsx), and [ui.wisty.ai/kbd](https://ui.wisty.ai/kbd) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a key or a keyboard shortcut, like Ctrl S.

```bash
npx shadcn@latest add @wisty/kbd
```

## Examples

- `default` (Modifier keys and a shortcut): The Mac modifier keys in one `KbdGroup`, and Save as Ctrl + S with the plus sign as a plain `span` between the keys.

## When to use

- Text names a key or a keyboard shortcut, like "Press / to search".
- A help panel lists an app's shortcuts, as Lightning's keyboard shortcuts list does.
- A tooltip shows the shortcut for an action.

## When not to use

- The text is code or a value people copy. Use a `code` element.
- The key is an action people click. Use Button.
- Inside a Dropdown menu item, use `DropdownMenuShortcut`, which follows the menu's text.

## Usage

Wrap each key in a `Kbd`, and the keys of one shortcut in a `KbdGroup`, so the combination reads as one input.

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"
```

```tsx
<p>
  Press <Kbd>/</Kbd> to search, or{" "}
  <KbdGroup>
    <Kbd>Ctrl</Kbd>
    <Kbd>S</Kbd>
  </KbdGroup>{" "}
  to save.
</p>
```

## Rules

- Put a `+` or other separator between keys as plain text inside the group, not in a `Kbd`, or it reads as a key.
- Don't override the key's fill, radius or text size. They come from the theme.

## API reference

| Part | Built on |
| --- | --- |
| `Kbd` | [`<kbd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/kbd) |
| `KbdGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

## SLDS mapping

SLDS has no keyboard key. `Kbd` is a small gray key built from SLDS tokens: the gray container fill, the secondary text color and the theme's smallest radius, with text at the menu text size.

Known gaps:

- No SLDS blueprint to match. The look follows SLDS's keyboard interaction guidelines and tokens, not a component.

## Accessibility

- Screen readers read the key's text, so write keys as people see them on the keyboard, like `Ctrl` or `Esc`.
- A key ignores the pointer and its text can't be selected. A `title` or tooltip on a `Kbd` never shows; put it on the element around it.

## Responsive behavior

- A key doesn't wrap, and a group keeps its keys on one line. In a narrow column, a long shortcut can push past the edge.

## Example code

### Modifier keys and a shortcut

The Mac modifier keys in one `KbdGroup`, and Save as Ctrl + S with the plus sign as a plain `span` between the keys.

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function KbdDefault() {
  return (
    <div className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>S</Kbd>
      </KbdGroup>
    </div>
  )
}
```
