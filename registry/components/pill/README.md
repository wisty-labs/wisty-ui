# Pill

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/pill](https://ui.wisty.ai/pill) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a removable token for a record or a selected value, alone or in a list.

```bash
npx shadcn@latest add @wisty/pill
```

## Examples

- `default` (Selected records): Two accounts and a contact in a `PillGroup`, each taken out through `onRemove` by its remove icon, Backspace or Delete, with focus moving on.
- `linked` (Linked): Pills outside a group whose labels link with `href`: plain, with an account icon and with an avatar in `icon`, each with a remove button.
- `states` (States): An `invalid` pill with an error icon, and a long account name truncated by its parent.

## When to use

- A field shows records or values someone picked, like the accounts in a lookup or the options of a multi-select. Put them in a `PillGroup`.
- A page shows a related record as a compact token that links to it, like an account on a filter bar.
- Someone needs to remove a value they added, one at a time.

## When not to use

- For a status or a count. Use Badge. A badge describes something, and a pill stands for a thing people can remove.
- For a filter someone switches on and off. Use Toggle or Toggle group.
- For the chips inside a Combobox with `multiple`. Use its `ComboboxChip`, which works with the combobox's own keyboard handling.
- For a long list of selections. Show a count and a list instead, because a group of pills wraps onto many lines.

## Usage

The label is the pill's children.

```tsx
import { Icon } from "@/components/wisty/icon"
import { Pill } from "@/components/wisty/pill"
```

```tsx
<Pill
  href="/accounts/001"
  icon={<Icon name="standard:account" label="Account" />}
>
  Acme Corporation
</Pill>
```

Selected values go in a `PillGroup`, as the Selected records example shows. Pass `onRemove` to add the remove control, and remove the value from your state in it.

## Rules

- Give each pill in a `PillGroup` a `key`. Without it, removing any pill but the last drops focus to the page.
- Use `href` only outside a group. An option in a listbox can't be a link.
- Don't move focus yourself after a removal. The group already has.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `Pill` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `PillGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### Pill

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href`? | `string` |  | Makes the label a link. |
| `icon`? | `React.ReactNode` |  | An Icon or Avatar before the label. |
| `onRemove`? | `() => void` |  | Shows a remove control, and is called when it's used. |
| `removeLabel`? | `string` | `"Remove"` | The remove button's accessible name. |
| `invalid`? | `boolean` | `false` | Marks the pill as an error. |

### PillGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | Names the group for screen readers, like "Selected accounts". |

## SLDS mapping

`Pill` is `slds-pill` with a `slds-pill__label`. With `href` it's `slds-pill_link`, and the link, `slds-pill__action`, draws the border. `icon` is `slds-pill__icon_container`. The remove control is `slds-pill__remove`: a `slds-button_icon` outside a group, a `slds-icon_container` inside one. `PillGroup` is `slds-pill_container` around `slds-listbox slds-listbox_horizontal`. The remove glyph is Lucide's X where SLDS draws `utility:close`.

Known gaps:

- A linked pill with `invalid` keeps its gray border, since the link draws it. The label still turns red. A plain pill's border does turn red.
- SLDS's bare pill (`slds-pill_bare`) and its collapsed selection group with a "more" toggle aren't covered.

## Keyboard interactions

In a `PillGroup`, which is one tab stop on the last pill that had focus:

| Key               | Action                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Right arrow       | Moves to the next pill, from the last back to the first.                                                      |
| Left arrow        | Moves to the previous pill, from the first to the last.                                                       |
| Backspace, Delete | Removes the focused pill, if it has `onRemove`, and focuses the next one, or the previous one if it was last. |

## Accessibility

- `PillGroup` needs an `aria-label` that says what's selected, like "Selected accounts".
- Outside a group, the remove button is named by `removeLabel`. Pass "Remove Acme Corporation" rather than the default "Remove" when there are several pills.
- In a group, the remove icon is hidden from screen readers and takes no focus. Keyboard users remove pills with Backspace or Delete, which the group's hidden description tells them.
- `invalid` changes the color only. Add an error icon with a `label`, as the States example does, so screen readers hear the problem.
- A string label is repeated in a `title`, so a cut-off label can be read on hover. A label made of elements gets no title.

## Responsive behavior

- A pill is never wider than its parent. A long label is cut off with an ellipsis.
- A `PillGroup` wraps its pills onto more lines as they fill it.

## Example code

### Selected records

Two accounts and a contact in a `PillGroup`, each taken out through `onRemove` by its remove icon, Backspace or Delete, with focus moving on.

```tsx
"use client"

import { useState } from "react"

import { Icon } from "@/components/wisty/icon"
import { Pill, PillGroup } from "@/components/wisty/pill"

const records = [
  { id: "acme", name: "Acme Corporation", icon: "standard:account" },
  { id: "sarah", name: "Sarah Chen", icon: "standard:contact" },
  { id: "global", name: "Global Media", icon: "standard:account" },
] as const

export default function PillDefault() {
  const [selected, setSelected] = useState<readonly string[]>(
    records.map((record) => record.id)
  )

  return (
    <PillGroup aria-label="Selected records" className="w-80">
      {records
        .filter((record) => selected.includes(record.id))
        .map((record) => (
          <Pill
            key={record.id}
            icon={<Icon name={record.icon} />}
            onRemove={() =>
              setSelected((ids) => ids.filter((id) => id !== record.id))
            }
          >
            {record.name}
          </Pill>
        ))}
    </PillGroup>
  )
}
```

### Linked

Pills outside a group whose labels link with `href`: plain, with an account icon and with an avatar in `icon`, each with a remove button.

```tsx
"use client"

import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from "@/components/wisty/icon"
import { Pill } from "@/components/wisty/pill"

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%237f8de1'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23fff' fill-opacity='.85'/%3E%3Cpath d='M10 64c2-14 11-20 22-20s20 6 22 20z' fill='%23fff' fill-opacity='.85'/%3E%3C/svg%3E"

export default function PillLinked() {
  const [removed, setRemoved] = useState<string[]>([])
  const remove = (id: string) => () => setRemoved((ids) => [...ids, id])

  return (
    <div className="flex flex-wrap items-center gap-y-1">
      {!removed.includes("acme") && (
        <Pill href="#acme" onRemove={remove("acme")}>
          Acme Corporation
        </Pill>
      )}
      {!removed.includes("global") && (
        <Pill
          href="#global-media"
          icon={<Icon name="standard:account" label="Account" />}
          onRemove={remove("global")}
        >
          Global Media
        </Pill>
      )}
      {!removed.includes("sarah") && (
        <Pill
          href="#sarah-chen"
          icon={
            <Avatar shape="circle">
              <AvatarImage src={portrait} alt="" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          }
          onRemove={remove("sarah")}
        >
          Sarah Chen
        </Pill>
      )}
    </div>
  )
}
```

### States

An `invalid` pill with an error icon, and a long account name truncated by its parent.

```tsx
"use client"

import { useState } from "react"

import { Icon } from "@/components/wisty/icon"
import { Pill } from "@/components/wisty/pill"

export default function PillStates() {
  const [removed, setRemoved] = useState<string[]>([])
  const remove = (id: string) => () => setRemoved((ids) => [...ids, id])

  return (
    <div className="flex flex-col items-start gap-4">
      {!removed.includes("unknown") && (
        <Pill
          href="#unknown"
          invalid
          icon={<Icon name="utility:error" variant="error" label="Error" />}
          onRemove={remove("unknown")}
        >
          Unknown contact
        </Pill>
      )}
      <div className="w-55">
        {!removed.includes("long") && (
          <Pill href="#long" onRemove={remove("long")}>
            Edge Communications Worldwide Holdings, EMEA Region
          </Pill>
        )}
      </div>
    </div>
  )
}
```
