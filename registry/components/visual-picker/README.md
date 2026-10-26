# Visual picker

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/visual-picker](https://ui.wisty.ai/visual-picker) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks one or several options shown as large cards with an icon or text. For plain choices, use Radio group or Checkbox.

```bash
npx shadcn@latest add @wisty/visual-picker
```

## Examples

- `default` (Account record type): Business Account or Person Account, one card at a time, each with an icon and its title under it.
- `multiple` (Several choices): Features to turn on with `type="multiple"`: each card toggles on its own, and a description sits under each title.
- `vertical` (Wide cards): Two ways to add a contact with `variant="vertical"`: the title and description inside each card, the check in its corner.
- `sizes` (Sizes): The same two cards at `size="small"`, the default medium and `size="large"`.
- `limit` (Up to two): Wide checkbox cards where two of four can be chosen, the others `disabled` while two are, and a description counting the choices.
- `states` (States): A required choice showing its error until one is chosen, a `disabled` card in a group, and a `disabled` group with its choice made.

## When to use

- People choose among two to five options that are easier to tell apart with a picture or a short explanation, like a record type, a plan or how to add a contact.
- The choice starts a flow, like a Setup wizard's first step or a "New" dialog that asks what kind of record to create.
- Several options can be on at once, like the features to turn on. Use `type="multiple"`.
- Each option needs a sentence to explain it. Use `variant="vertical"`, with the title and description inside the card.

## When not to use

- The options are plain words, or there are more than five. Use Radio group for one choice and Checkbox for several.
- The choice is a setting that switches on and off. Use Switch.
- People pick from a long list. Use Select, or Combobox to filter as they type.
- The buttons change a view or format in a toolbar, like Day, Week and Month. Use Toggle group.

## Usage

```tsx
import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  VisualPicker,
  VisualPickerBody,
  VisualPickerDescription,
  VisualPickerFigure,
  VisualPickerIcon,
  VisualPickerItem,
  VisualPickerTitle,
} from "@/components/wisty/visual-picker"
```

```text
VisualPicker
└── VisualPickerItem
    ├── VisualPickerFigure
    │   ├── VisualPickerIcon
    │   ├── VisualPickerTitle
    │   └── VisualPickerDescription
    └── VisualPickerBody
        ├── VisualPickerTitle
        └── VisualPickerDescription
```

A card with a `VisualPickerIcon` fills with the accent color when it's chosen, and a check replaces the icon. A card without one keeps its content and shows the check in its corner. Put the title in `VisualPickerBody` under an icon card, and inside the figure of a vertical card.

Name the group from a `FieldLegend`, as a radio group is named. For an error, mark the `FieldSet` with `data-invalid`, set `aria-invalid` on `VisualPicker`, which passes it to every card, and point `aria-describedby` at the `FieldError`:

```tsx
<FieldSet data-invalid>
  <FieldLegend variant="label" id="type-legend">
    Opportunity type
  </FieldLegend>
  <VisualPicker
    name="type"
    required
    value={type}
    onValueChange={setType}
    aria-invalid
    aria-labelledby="type-legend"
    aria-describedby="type-error"
  >
    <VisualPickerItem value="new">…</VisualPickerItem>
  </VisualPicker>
  <FieldError id="type-error">Complete this field.</FieldError>
</FieldSet>
```

`onValueChange` gets the chosen value with the default `type="single"`, and the list of chosen values with `type="multiple"`. With `name`, the choice submits with a form: one value for a single picker, one entry per chosen card for a multiple one. `required` asks for one card, or at least one with `type="multiple"`.

## Rules

- Keep each `VisualPickerItem`'s cards inside one `VisualPicker`: the group holds the value, the name and the size.
- Use the same kind of card in a group: all with icons, or all text.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `VisualPicker` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `VisualPickerItem` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `VisualPickerFigure` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `VisualPickerIcon` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `VisualPickerBody` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `VisualPickerTitle` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `VisualPickerDescription` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |

### VisualPicker

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-invalid`? | `boolean \| "true" \| "false" \| "grammar" \| "spelling"` |  | Set on every input, for a field with an error. |
| `variant`? | `"default" \| "vertical"` | `"default"` |  |
| `size`? | `"small" \| "medium" \| "large"` | `"medium"` |  |
| `name`? | `string` |  | The inputs' name, to submit the choice with a form. Generated when not given, so the radios still form one group. |
| `disabled`? | `boolean` | `false` | Disables every card. |
| `required`? | `boolean` | `false` | A choice must be made before the form submits: one card, or at least one with `type="multiple"`. |
| `form`? | `string` |  | The id of a form the inputs belong to, outside it. |
| `type`? | `"single" \| "multiple"` | `"single"` | Choose one card: radios. |
| `value`? | `string \| null \| readonly string[]` |  | The chosen card's value, controlled. `null` for none. |
| `defaultValue`? | `string \| readonly string[]` |  |  |
| `onValueChange`? | `(value: string) => void \| (value: string[]) => void` |  |  |

### VisualPickerItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | The value this card stands for, submitted with the form. |
| `disabled`? | `boolean` | `false` | Disables this card alone. |
| `id`? | `string` |  | The input's id. Generated when not given. |

## SLDS mapping

`VisualPickerItem` is `slds-visual-picker`: a visually hidden native radio or checkbox, then a `label` for it. `size` is `slds-visual-picker_small`, `_medium` or `_large` on every item, and `variant="vertical"` is `slds-visual-picker_vertical`. `VisualPickerFigure` is `slds-visual-picker__figure`: with a `VisualPickerIcon` it's the icon figure (`slds-visual-picker__icon`), and without one the text figure (`slds-visual-picker__text`), whose check is `slds-visual-picker__text-check`. `VisualPickerBody` is `slds-visual-picker__body`. `VisualPickerTitle` is `slds-text-heading_small` under the card and `slds-text-heading_medium` inside it, and `VisualPickerDescription` is `slds-text-title`. `VisualPicker` is the group SLDS leaves to the form element around it.

Known gaps:

- Icons and checks are lucide's, where SLDS draws utility and action icons. Pass an `Icon` from the icon component for a Salesforce object icon.
- No link variant (`slds-box_link` media cards). Use Item with an `href` for a list of links.
- Cards in a row keep a 1rem gap when they wrap to a second row, where SLDS's wrap only on their margin.

## Accessibility

- Name the group with `aria-labelledby` pointing at a `FieldLegend`, or with `aria-label`.
- Give every card text: a `VisualPickerTitle`, or a description. The card's label is its name, so an icon alone leaves the card unnamed.
- Each card is a native radio or checkbox. In a single picker, Tab reaches the chosen card, or the first one when none is chosen, and the arrow keys move the choice. In a multiple picker, each card is a Tab stop and Space toggles it.
- A card's whole text is its name, the description included. Keep descriptions to one sentence.

## Responsive behavior

- Square cards wrap to a new row when the row is full. A vertical card is 25rem wide and narrows to fit a smaller container.

## Example code

### Account record type

Business Account or Person Account, one card at a time, each with an icon and its title under it.

```tsx
import { useId } from "react"
import { Building2Icon, UserRoundIcon } from "lucide-react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  VisualPicker,
  VisualPickerBody,
  VisualPickerFigure,
  VisualPickerIcon,
  VisualPickerItem,
  VisualPickerTitle,
} from "@/components/wisty/visual-picker"

export default function VisualPickerDefault() {
  const id = useId()

  return (
    <FieldSet className="max-w-md">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Account record type
      </FieldLegend>
      <VisualPicker
        name="recordType"
        defaultValue="business"
        aria-labelledby={`${id}-legend`}
      >
        <VisualPickerItem value="business">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <Building2Icon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Business Account</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
        <VisualPickerItem value="person">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <UserRoundIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Person Account</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
      </VisualPicker>
    </FieldSet>
  )
}
```

### Several choices

Features to turn on with `type="multiple"`: each card toggles on its own, and a description sits under each title.

```tsx
import { useId } from "react"
import { BookOpenIcon, MessagesSquareIcon, RouteIcon } from "lucide-react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  VisualPicker,
  VisualPickerBody,
  VisualPickerDescription,
  VisualPickerFigure,
  VisualPickerIcon,
  VisualPickerItem,
  VisualPickerTitle,
} from "@/components/wisty/visual-picker"

export default function VisualPickerMultiple() {
  const id = useId()

  return (
    <FieldSet className="max-w-2xl">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Features to turn on
      </FieldLegend>
      <VisualPicker
        type="multiple"
        name="features"
        defaultValue={["chatter", "knowledge"]}
        aria-labelledby={`${id}-legend`}
      >
        <VisualPickerItem value="chatter">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <MessagesSquareIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Chatter</VisualPickerTitle>
            <VisualPickerDescription>
              Feeds and posts on records
            </VisualPickerDescription>
          </VisualPickerBody>
        </VisualPickerItem>
        <VisualPickerItem value="knowledge">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <BookOpenIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Knowledge</VisualPickerTitle>
            <VisualPickerDescription>
              Articles for agents and customers
            </VisualPickerDescription>
          </VisualPickerBody>
        </VisualPickerItem>
        <VisualPickerItem value="omni-channel">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <RouteIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Omni-Channel</VisualPickerTitle>
            <VisualPickerDescription>
              Routes work to available agents
            </VisualPickerDescription>
          </VisualPickerBody>
        </VisualPickerItem>
      </VisualPicker>
    </FieldSet>
  )
}
```

### Wide cards

Two ways to add a contact with `variant="vertical"`: the title and description inside each card, the check in its corner.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  VisualPicker,
  VisualPickerDescription,
  VisualPickerFigure,
  VisualPickerItem,
  VisualPickerTitle,
} from "@/components/wisty/visual-picker"

export default function VisualPickerVertical() {
  const id = useId()

  return (
    <FieldSet className="max-w-md">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Add a contact to this opportunity
      </FieldLegend>
      <VisualPicker
        variant="vertical"
        name="contactSource"
        defaultValue="existing"
        aria-labelledby={`${id}-legend`}
      >
        <VisualPickerItem value="existing">
          <VisualPickerFigure>
            <VisualPickerTitle>Choose an existing contact</VisualPickerTitle>
            <VisualPickerDescription>
              Search the account&apos;s contacts and add one with a contact
              role.
            </VisualPickerDescription>
          </VisualPickerFigure>
        </VisualPickerItem>
        <VisualPickerItem value="new">
          <VisualPickerFigure>
            <VisualPickerTitle>Create a new contact</VisualPickerTitle>
            <VisualPickerDescription>
              Add someone who isn&apos;t in Salesforce yet, on the
              opportunity&apos;s account.
            </VisualPickerDescription>
          </VisualPickerFigure>
        </VisualPickerItem>
      </VisualPicker>
    </FieldSet>
  )
}
```

### Sizes

The same two cards at `size="small"`, the default medium and `size="large"`.

```tsx
import { AppWindowIcon, PlugIcon } from "lucide-react"

import {
  VisualPicker,
  VisualPickerBody,
  VisualPickerFigure,
  VisualPickerIcon,
  VisualPickerItem,
  VisualPickerTitle,
} from "@/components/wisty/visual-picker"

export default function VisualPickerSizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <VisualPicker size="small" defaultValue="lightning" aria-label="App type">
        <VisualPickerItem value="lightning">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <AppWindowIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Lightning App</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
        <VisualPickerItem value="connected">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <PlugIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Connected App</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
      </VisualPicker>
      <VisualPicker defaultValue="lightning" aria-label="App type">
        <VisualPickerItem value="lightning">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <AppWindowIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Lightning App</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
        <VisualPickerItem value="connected">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <PlugIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Connected App</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
      </VisualPicker>
      <VisualPicker size="large" defaultValue="lightning" aria-label="App type">
        <VisualPickerItem value="lightning">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <AppWindowIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Lightning App</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
        <VisualPickerItem value="connected">
          <VisualPickerFigure>
            <VisualPickerIcon>
              <PlugIcon />
            </VisualPickerIcon>
          </VisualPickerFigure>
          <VisualPickerBody>
            <VisualPickerTitle>Connected App</VisualPickerTitle>
          </VisualPickerBody>
        </VisualPickerItem>
      </VisualPicker>
    </div>
  )
}
```

### Up to two

Wide checkbox cards where two of four can be chosen, the others `disabled` while two are, and a description counting the choices.

```tsx
"use client"

import { useId, useState } from "react"

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  VisualPicker,
  VisualPickerDescription,
  VisualPickerFigure,
  VisualPickerItem,
  VisualPickerTitle,
} from "@/components/wisty/visual-picker"

const limit = 2

export default function VisualPickerLimit() {
  const id = useId()
  const [channels, setChannels] = useState<string[]>(["email", "chat"])
  const full = channels.length >= limit
  const locked = (value: string) => full && !channels.includes(value)

  return (
    <FieldSet className="max-w-md">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Support channels for this plan
      </FieldLegend>
      <FieldDescription id={`${id}-description`}>
        Choose up to {limit} ({channels.length} chosen)
      </FieldDescription>
      <VisualPicker
        type="multiple"
        variant="vertical"
        name="channels"
        value={channels}
        onValueChange={setChannels}
        aria-labelledby={`${id}-legend`}
        aria-describedby={`${id}-description`}
      >
        <VisualPickerItem value="email" disabled={locked("email")}>
          <VisualPickerFigure>
            <VisualPickerTitle>Email</VisualPickerTitle>
            <VisualPickerDescription>
              Customers write to a support address and each email opens a case.
            </VisualPickerDescription>
          </VisualPickerFigure>
        </VisualPickerItem>
        <VisualPickerItem value="phone" disabled={locked("phone")}>
          <VisualPickerFigure>
            <VisualPickerTitle>Phone</VisualPickerTitle>
            <VisualPickerDescription>
              Agents take calls with the caller&apos;s case open beside them.
            </VisualPickerDescription>
          </VisualPickerFigure>
        </VisualPickerItem>
        <VisualPickerItem value="chat" disabled={locked("chat")}>
          <VisualPickerFigure>
            <VisualPickerTitle>Web chat</VisualPickerTitle>
            <VisualPickerDescription>
              Customers chat with an agent from the help center.
            </VisualPickerDescription>
          </VisualPickerFigure>
        </VisualPickerItem>
        <VisualPickerItem value="messaging" disabled={locked("messaging")}>
          <VisualPickerFigure>
            <VisualPickerTitle>Messaging</VisualPickerTitle>
            <VisualPickerDescription>
              Conversations over SMS and WhatsApp, routed to agents.
            </VisualPickerDescription>
          </VisualPickerFigure>
        </VisualPickerItem>
      </VisualPicker>
    </FieldSet>
  )
}
```

### States

A required choice showing its error until one is chosen, a `disabled` card in a group, and a `disabled` group with its choice made.

```tsx
"use client"

import { useId, useState } from "react"
import {
  Building2Icon,
  RepeatIcon,
  SparklesIcon,
  UserRoundIcon,
} from "lucide-react"

import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  VisualPicker,
  VisualPickerBody,
  VisualPickerDescription,
  VisualPickerFigure,
  VisualPickerIcon,
  VisualPickerItem,
  VisualPickerTitle,
} from "@/components/wisty/visual-picker"

export default function VisualPickerStates() {
  const id = useId()
  const [type, setType] = useState<string | null>(null)
  const invalid = type === null

  return (
    <div className="flex max-w-md flex-col gap-6">
      <FieldSet data-invalid={invalid}>
        <FieldLegend variant="label" id={`${id}-type`}>
          <abbr
            title="required"
            className="me-0.5 text-destructive no-underline"
          >
            *
          </abbr>
          Opportunity type
        </FieldLegend>
        <VisualPicker
          name="type"
          required
          value={type}
          onValueChange={setType}
          aria-invalid={invalid}
          aria-labelledby={`${id}-type`}
          aria-describedby={invalid ? `${id}-type-error` : undefined}
        >
          <VisualPickerItem value="new">
            <VisualPickerFigure>
              <VisualPickerIcon>
                <SparklesIcon />
              </VisualPickerIcon>
            </VisualPickerFigure>
            <VisualPickerBody>
              <VisualPickerTitle>New Business</VisualPickerTitle>
            </VisualPickerBody>
          </VisualPickerItem>
          <VisualPickerItem value="existing">
            <VisualPickerFigure>
              <VisualPickerIcon>
                <RepeatIcon />
              </VisualPickerIcon>
            </VisualPickerFigure>
            <VisualPickerBody>
              <VisualPickerTitle>Existing Business</VisualPickerTitle>
            </VisualPickerBody>
          </VisualPickerItem>
        </VisualPicker>
        {invalid ? (
          <FieldError id={`${id}-type-error`}>Complete this field.</FieldError>
        ) : null}
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-record-type`}>
          Account record type
        </FieldLegend>
        <VisualPicker
          name="recordType"
          defaultValue="business"
          aria-labelledby={`${id}-record-type`}
        >
          <VisualPickerItem value="business">
            <VisualPickerFigure>
              <VisualPickerIcon>
                <Building2Icon />
              </VisualPickerIcon>
            </VisualPickerFigure>
            <VisualPickerBody>
              <VisualPickerTitle>Business Account</VisualPickerTitle>
            </VisualPickerBody>
          </VisualPickerItem>
          <VisualPickerItem value="person" disabled>
            <VisualPickerFigure>
              <VisualPickerIcon>
                <UserRoundIcon />
              </VisualPickerIcon>
            </VisualPickerFigure>
            <VisualPickerBody>
              <VisualPickerTitle>Person Account</VisualPickerTitle>
            </VisualPickerBody>
          </VisualPickerItem>
        </VisualPicker>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-assignment`}>
          Case assignment
        </FieldLegend>
        <VisualPicker
          variant="vertical"
          name="assignment"
          defaultValue="rules"
          disabled
          aria-labelledby={`${id}-assignment`}
        >
          <VisualPickerItem value="rules">
            <VisualPickerFigure>
              <VisualPickerTitle>Use assignment rules</VisualPickerTitle>
              <VisualPickerDescription>
                The active case assignment rule picks the owner.
              </VisualPickerDescription>
            </VisualPickerFigure>
          </VisualPickerItem>
          <VisualPickerItem value="me">
            <VisualPickerFigure>
              <VisualPickerTitle>Assign to me</VisualPickerTitle>
              <VisualPickerDescription>
                You own the case until you reassign it.
              </VisualPickerDescription>
            </VisualPickerFigure>
          </VisualPickerItem>
        </VisualPicker>
      </FieldSet>
    </div>
  )
}
```
