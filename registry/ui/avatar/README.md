# Avatar

This page shows the Radix version. Base UI projects get [registry/base/ui/avatar.tsx](../../base/ui/avatar.tsx), and [ui.wisty.ai/avatar](https://ui.wisty.ai/avatar) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a person or record as a picture or initials.

```bash
npx shadcn@latest add @wisty/avatar
```

## Examples

- `default` (Profile picture): The record owner's picture in `AvatarImage`, round with `shape="circle"`, and her initials in `AvatarFallback`.
- `sizes` (Sizes): Each `size`, with a record's initials in the default shape and a person's as circles.
- `group` (Group and badge): An opportunity team in `AvatarGroup` with an `AvatarGroupCount`, and an avatar with an `AvatarBadge` for status.

## When to use

- A list, card or header shows who owns a record or wrote a comment.
- A record needs a small picture or initials next to its name, like an account in a related list.
- A few people share something, like the members of a team. Overlap their avatars in an `AvatarGroup`.

## When not to use

- The picture is content, like a product photo. Use an `img`.
- The record has an object icon in Salesforce, like Account or Opportunity. Use Icon.
- The avatar would be the only way to tell people apart. Show the name next to it.

## Usage

```tsx
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
```

```text
AvatarGroup (optional, for several people)
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge (optional status dot)
└── AvatarGroupCount (optional, like +2)
```

The fallback shows until the picture loads, and stays when it fails. Next to a name:

```tsx
<div className="flex items-center gap-3">
  <Avatar shape="circle">
    <AvatarImage src="/people/david-miller.jpg" alt="" />
    <AvatarFallback>DM</AvatarFallback>
  </Avatar>
  <a href="/users/david-miller">David Miller</a>
</div>
```

## Rules

- Always add an `AvatarFallback` with one or two initials.
- Use `shape="circle"` for people and the default shape for records.
- Don't add rounded or size classes. Use `shape` and `size`.

## API reference

| Part | Built on |
| --- | --- |
| `Avatar` | [Radix Avatar.Root](https://www.radix-ui.com/primitives/docs/components/avatar#root) |
| `AvatarImage` | [Radix Avatar.Image](https://www.radix-ui.com/primitives/docs/components/avatar#image) |
| `AvatarFallback` | [Radix Avatar.Fallback](https://www.radix-ui.com/primitives/docs/components/avatar#fallback) |
| `AvatarBadge` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `AvatarGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `AvatarGroupCount` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### Avatar

| Prop | Type | Default |
| --- | --- | --- |
| `size`? | `"default" \| "sm" \| "lg"` | `"default"` |
| `shape`? | `"default" \| "circle"` | `"default"` |

## SLDS mapping

`Avatar` is `slds-avatar`, with its corners from SLDS's avatar radius hook; `shape="circle"` is `slds-avatar_circle`. `AvatarFallback` is `slds-avatar__initials` and `AvatarGroupCount` is `slds-avatar__initials_inverse`. `AvatarImage` fills the avatar and takes its corners.

Known gaps:

- `AvatarBadge` and `AvatarGroup` have no SLDS counterpart. They keep a dot and an overlapping row, in the theme's colors. SLDS's own avatar group, two avatars stacked diagonally, isn't covered.
- SLDS's `x-small` size has no counterpart.
- SLDS colors initials by object (`slds-icon-standard-account` and others). Pass a background class to `AvatarFallback` for that.

## Accessibility

- Give `AvatarImage` an `alt` with the person's or record's name, or `alt=""` when the name is shown beside it.
- Initials are read as letters. Put the full name next to the avatar.
- A badge that only shows color needs `role="img"` and an `aria-label`, like "Online".
- Give an `AvatarGroup` `role="group"` and an `aria-label`, like "Opportunity team", so it's read as one set.
- In Lightning Blue, `AvatarGroupCount`'s gray text on gray is below 4.5:1, the pair Salesforce's own inverse initials use, kept so the count matches.

## Responsive behavior

- Avatars keep their size and don't shrink in a flex row. The picture is cropped to fit.
- Keep initials to two letters. Longer text overflows the avatar.

## Example code

### Profile picture

The record owner's picture in `AvatarImage`, round with `shape="circle"`, and her initials in `AvatarFallback`.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%237f8de1'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23fff' fill-opacity='.85'/%3E%3Cpath d='M10 64c2-14 11-20 22-20s20 6 22 20z' fill='%23fff' fill-opacity='.85'/%3E%3C/svg%3E"

export default function AvatarDefault() {
  return (
    <Avatar shape="circle">
      <AvatarImage src={portrait} alt="Sarah Chen" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  )
}
```

### Sizes

Each `size`, with a record's initials in the default shape and a person's as circles.

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarSizes() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <Avatar size="sm">
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex items-center gap-4">
        <Avatar size="sm" shape="circle">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar shape="circle">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar size="lg" shape="circle">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
```

### Group and badge

An opportunity team in `AvatarGroup` with an `AvatarGroupCount`, and an avatar with an `AvatarBadge` for status.

```tsx
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"

export default function AvatarGroupExample() {
  return (
    <div className="flex items-center gap-8">
      <AvatarGroup role="group" aria-label="Opportunity team">
        <Avatar shape="circle">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar shape="circle">
          <AvatarFallback>JR</AvatarFallback>
        </Avatar>
        <Avatar shape="circle">
          <AvatarFallback>LP</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
      <Avatar shape="circle">
        <AvatarFallback>DM</AvatarFallback>
        <AvatarBadge role="img" aria-label="Online" />
      </Avatar>
    </div>
  )
}
```
