# Native select

This page shows the Radix version. Base UI projects get [registry/base/ui/native-select.tsx](../../base/ui/native-select.tsx), and [ui.wisty.ai/native-select](https://ui.wisty.ai/native-select) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks one option with the browser's own select.

```bash
npx shadcn@latest add @wisty/native-select
```

## Examples

- `default` (Lead source): An empty first option, then lead sources in two `NativeSelectOptGroup`s, Inbound and Outbound.
- `states` (States): One with `aria-invalid` and an error message it points to, and one `disabled`.
- `sizes` (Sizes): The default and small selects, set with `size` on `NativeSelect`.

## When to use

- People pick one option from a short, fixed list, and the browser's own list is fine.
- The form must work on touch devices with the system picker, or without JavaScript.
- The options come in groups, like inbound and outbound lead sources.

## When not to use

- The list should look like the rest of the app, or options need icons or descriptions. Use Select.
- The list is long or people should search it. Use Combobox.
- People may pick several options. Use checkboxes.
- There are two to five options and room to show them all. Use Radio group.

## Usage

```text
NativeSelect
├── NativeSelectOption
└── NativeSelectOptGroup
    └── NativeSelectOption
```

Pass `id` to `NativeSelect`, so a label's `htmlFor` reaches the `select`. Start with an empty option when people must choose.

```tsx
import { Field, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
```

```tsx
<Field>
  <FieldLabel htmlFor="rating">Rating</FieldLabel>
  <NativeSelect id="rating" defaultValue="">
    <NativeSelectOption value="">Select an option</NativeSelectOption>
    <NativeSelectOption value="hot">Hot</NativeSelectOption>
    <NativeSelectOption value="cold">Cold</NativeSelectOption>
  </NativeSelect>
</Field>
```

`className` goes to the wrapper around the select, so width classes size the whole field. Every other prop goes to the `select`.

## Rules

- Use `NativeSelectOption` and `NativeSelectOptGroup`, not bare `option` and `optgroup`, so the options keep readable colors in dark mode.
- Show errors with `aria-invalid`. Don't add border or color classes.

## API reference

| Part | Built on |
| --- | --- |
| `NativeSelect` | [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select) |
| `NativeSelectOption` | [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option) |
| `NativeSelectOptGroup` | [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/optgroup) |

### NativeSelect

| Prop | Type | Default |
| --- | --- | --- |
| `size`? | `"sm" \| "default"` | `"default"` |

## SLDS mapping

`NativeSelect` is `slds-select_container` around `slds-select`, drawn with the input's frame. `aria-invalid` is `slds-has-error`, and `disabled` is SLDS's gray disabled field, not dimmed. Options and option groups keep the browser's colors.

Known gaps:

- SLDS draws two small triangles, up and down. This draws one chevron.

## Accessibility

- Name it with a visible label. The empty first option isn't a label.
- Pair `aria-invalid` with an error message the select points to through `aria-describedby`.
- In Cosmos dark, text in an invalid select is about 4.3:1 against its background, below AA. Salesforce's own stylesheet fails the same way.

## Responsive behavior

- In a vertical Field it fills the column. Elsewhere it's as wide as its longest option; add `w-full` to fill its container.
- When the field is narrower than an option, the option's text is cut off before the chevron.
- On touch screens the text is larger, so iOS Safari doesn't zoom in on focus. Don't set a smaller text size on it.

## Example code

### Lead source

An empty first option, then lead sources in two `NativeSelectOptGroup`s, Inbound and Outbound.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

export default function NativeSelectDefault() {
  const id = useId()

  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor={`${id}-source`}>Lead source</FieldLabel>
      <NativeSelect id={`${id}-source`} defaultValue="">
        <NativeSelectOption value="">Select an option</NativeSelectOption>
        <NativeSelectOptGroup label="Inbound">
          <NativeSelectOption value="web">Web</NativeSelectOption>
          <NativeSelectOption value="phone">Phone inquiry</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Outbound">
          <NativeSelectOption value="referral">
            Partner referral
          </NativeSelectOption>
          <NativeSelectOption value="trade-show">Trade show</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </Field>
  )
}
```

### States

One with `aria-invalid` and an error message it points to, and one `disabled`.

```tsx
import { useId } from "react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export default function NativeSelectStates() {
  const id = useId()

  return (
    <FieldGroup className="max-w-sm">
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-stage`}>Stage</FieldLabel>
        <NativeSelect
          id={`${id}-stage`}
          defaultValue=""
          aria-invalid="true"
          aria-describedby={`${id}-stage-error`}
        >
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOption value="prospecting">
            Prospecting
          </NativeSelectOption>
          <NativeSelectOption value="closed-won">Closed Won</NativeSelectOption>
        </NativeSelect>
        <FieldError id={`${id}-stage-error`}>Select a stage.</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-region`}>Region</FieldLabel>
        <NativeSelect id={`${id}-region`} defaultValue="emea" disabled>
          <NativeSelectOption value="amer">Americas</NativeSelectOption>
          <NativeSelectOption value="emea">EMEA</NativeSelectOption>
        </NativeSelect>
      </Field>
    </FieldGroup>
  )
}
```

### Sizes

The default and small selects, set with `size` on `NativeSelect`.

```tsx
import { useId } from "react"

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export default function NativeSelectSizes() {
  const id = useId()

  return (
    <div className="flex flex-wrap items-center gap-4">
      <NativeSelect aria-label="Rows per page" id={`${id}-default`}>
        <NativeSelectOption value="25">25 rows</NativeSelectOption>
        <NativeSelectOption value="50">50 rows</NativeSelectOption>
      </NativeSelect>
      <NativeSelect size="sm" aria-label="Rows per page, small" id={`${id}-sm`}>
        <NativeSelectOption value="25">25 rows</NativeSelectOption>
        <NativeSelectOption value="50">50 rows</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
```
