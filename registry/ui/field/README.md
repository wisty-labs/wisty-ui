# Field

This page shows the Radix version. Base UI projects get [registry/base/ui/field.tsx](../../base/ui/field.tsx), and [ui.wisty.ai/field](https://ui.wisty.ai/field) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Lays out a form control with its label, help text and error.

```bash
npx shadcn@latest add @wisty/field
```

## Examples

- `default` (Account details): Part of an account's edit form: a required name with a `FieldDescription`, and an email with a `FieldError` under `data-invalid`.
- `fieldset` (Fieldset): A billing address in a `FieldSet` under a `FieldLegend` and a description, then a labelled `FieldSeparator` before an optional field.
- `checkbox-group` (Checkbox group): Three checkboxes in `orientation="horizontal"` fields under `FieldLegend variant="label"`, stacked tight as SLDS does, one with a description.
- `horizontal` (Label beside the field): A contact's fields with `layout="horizontal"`: each label in a column, help text under its input. Below a 48rem screen they stack.
- `help` (Label with help): An info button after the `FieldLabel` that shows the field's help in a `Tooltip` and describes itself with it, through `aria-describedby`.

## When to use

- A form control needs a label, and maybe help text or an error. It does what a Lightning input's label, help text and error do, for any control.
- Several fields make up a form, or related fields need a legend, like an address.
- A checkbox, radio or switch needs its label beside it.
- It works with any form library.

## When not to use

- A control needs only a label, outside a form. Label is enough.
- You show a record's values read-only. Use Output field, or Record detail for a record's whole Details tab.
- The message is about the whole form, not one field. Use Alert above the form.

## Usage

A field holds one control with its label and text:

```text
Field
├── FieldLabel
├── control, like Input
├── FieldDescription
└── FieldError
```

Related fields share a legend:

```text
FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    ├── Field
    └── Field
```

```tsx
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
```

```tsx
<Field>
  <FieldLabel htmlFor="phone">Phone</FieldLabel>
  <Input id="phone" type="tel" aria-describedby="phone-help" />
  <FieldDescription id="phone-help">Include the country code.</FieldDescription>
</Field>
```

For a text field with its label in a column beside it, as a record's edit form lays them out, give `Field` `layout="horizontal"`. From a 48rem screen the label takes the first third, less a gap, and the control and help text start after it; below that the field stacks. `layout="auto"` follows Salesforce's display density: stacked, and horizontal when the page is compact (`data-density="compact"` on `<html>`, see Theming).

For help that opens from an info button beside the label, as Salesforce's field-level help does, put a `TooltipTrigger` after the `FieldLabel` with the help in its `TooltipContent`, as the Label with help example shows. Name the button "Help for" and the label, and point its `aria-describedby` at a hidden copy of the help inside it. In Base UI projects the tooltip doesn't describe its trigger, and in Radix projects it does only while open.

For a checkbox, radio or switch, give `Field` `orientation="horizontal"` so the label sits beside the control. When it also has a description, wrap the label and description in `FieldContent`, as the Checkbox group example shows.

For a form library's errors, mark the `Field` with `data-invalid`, set `aria-invalid` on the control and pass the list to `FieldError`. One message shows as text, several as a list, each once:

```tsx
<Field data-invalid={invalid}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-invalid={invalid} aria-describedby="email-error" />
  <FieldError id="email-error" errors={errors} />
</Field>
```

## Rules

- One `Field` per control, with one `FieldLabel`.
- Use `orientation="horizontal"` only for checkboxes, radios and switches. For a text field with its label beside it, use `layout="horizontal"`, or `layout="auto"` to follow the page's density; both need the default vertical orientation.
- Don't add spacing classes between fields. `FieldGroup` spaces them.
- A group of checkboxes takes `FieldLegend variant="label"` and `data-slot="checkbox-group"` on its `FieldGroup`, as the Checkbox group example shows. Without the slot, the boxes sit as far apart as text fields.
- Don't color the label of an invalid field. Only the error text and the control turn red.

## API reference

| Part | Built on |
| --- | --- |
| `FieldSet` | [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset) |
| `FieldLegend` | [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/legend) |
| `FieldGroup` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `Field` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `FieldContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `FieldLabel` | [Label](https://ui.wisty.ai/label#api-Label) |
| `FieldTitle` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `FieldDescription` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) |
| `FieldSeparator` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `FieldError` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### FieldLegend

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"legend" \| "label"` | `"legend"` |

### Field

| Prop | Type | Default |
| --- | --- | --- |
| `orientation`? | `"vertical" \| "horizontal" \| "responsive"` | `"vertical"` |
| `layout`? | `"stacked" \| "horizontal" \| "auto"` | `"stacked"` |

### FieldError

| Prop | Type | Default |
| --- | --- | --- |
| `errors`? | `Array<{ message?: string } \| undefined>` |  |

## SLDS mapping

- `Field` is `slds-form-element`; `FieldGroup` stacks fields as `slds-form-element_stacked` does. `layout="horizontal"` is `slds-form-element_horizontal`.
- `FieldLabel` is `slds-form-element__label`, through Label. Beside a checkbox or radio it's regular weight, as SLDS's are.
- `FieldDescription` is `slds-form-element__help`. `FieldError` is the help text of an `slds-has-error` form element; the control draws its own error style from `aria-invalid`.
- `FieldSet` is a `fieldset.slds-form-element`, `FieldLegend` is `slds-form-element__legend`.

Known gaps:

- `FieldSeparator`, and the selectable card a `FieldLabel` becomes when it wraps a `Field`, have no SLDS counterpart.
- Read-only and inline-edit form elements are Output field's, not Field's.

## Accessibility

- Link each label to its control with `htmlFor` and `id`, and help text and errors with `aria-describedby`. `Field` doesn't do it for you.
- Set `aria-invalid` on the invalid control. `FieldError` has `role="alert"`, so its message is announced when it appears.
- Mark a required field with `required` on the control and an asterisk in the label, as the Account details example shows.
- In Cosmos dark, text in an invalid input is about 4.3:1 against its background, below AA. Salesforce's own stylesheet fails the same way; the error text below the field passes.

## Responsive behavior

- `orientation="responsive"` turns horizontal once the surrounding `FieldGroup` is at least 28rem wide. It reads the group's width, so outside a `FieldGroup` it stays vertical.

## Example code

### Account details

Part of an account's edit form: a required name with a `FieldDescription`, and an email with a `FieldError` under `data-invalid`.

```tsx
import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldDefault() {
  const id = useId()

  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor={`${id}-name`}>
          <span>
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
            Account name
          </span>
        </FieldLabel>
        <Input
          id={`${id}-name`}
          required
          aria-describedby={`${id}-name-help`}
          placeholder="Acme Corporation"
        />
        <FieldDescription id={`${id}-name-help`}>
          Use the name on the contract.
        </FieldDescription>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
        <Input
          id={`${id}-email`}
          type="email"
          defaultValue="ada@acme"
          aria-invalid="true"
          aria-describedby={`${id}-email-error`}
        />
        <FieldError id={`${id}-email-error`}>
          Enter a valid email address.
        </FieldError>
      </Field>
    </FieldGroup>
  )
}
```

### Fieldset

A billing address in a `FieldSet` under a `FieldLegend` and a description, then a labelled `FieldSeparator` before an optional field.

```tsx
import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldFieldset() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Billing address</FieldLegend>
      <FieldDescription>Where we send invoices.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${id}-street`}>Street</FieldLabel>
          <Input id={`${id}-street`} defaultValue="1 Market Street" />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-city`}>City</FieldLabel>
          <Input id={`${id}-city`} defaultValue="San Francisco" />
        </Field>
        <FieldSeparator>Optional</FieldSeparator>
        <Field>
          <FieldLabel htmlFor={`${id}-po`}>Purchase order number</FieldLabel>
          <Input id={`${id}-po`} />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
```

### Checkbox group

Three checkboxes in `orientation="horizontal"` fields under `FieldLegend variant="label"`, stacked tight as SLDS does, one with a description.

```tsx
import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

export default function FieldCheckboxGroup() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend variant="label">Notify me about</FieldLegend>
      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal">
          <Checkbox id={`${id}-cases`} defaultChecked />
          <FieldLabel htmlFor={`${id}-cases`}>New cases</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id={`${id}-comments`} />
          <FieldLabel htmlFor={`${id}-comments`}>Comments</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id={`${id}-digest`}
            aria-describedby={`${id}-digest-help`}
          />
          <FieldContent>
            <FieldLabel htmlFor={`${id}-digest`}>Weekly digest</FieldLabel>
            <FieldDescription id={`${id}-digest-help`}>
              A summary of your team's open cases, every Monday.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
```

### Label beside the field

A contact's fields with `layout="horizontal"`: each label in a column, help text under its input. Below a 48rem screen they stack.

```tsx
import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function FieldHorizontal() {
  const id = useId()

  return (
    <FieldGroup className="max-w-xl">
      <Field layout="horizontal">
        <FieldLabel htmlFor={`${id}-name`}>Contact name</FieldLabel>
        <Input id={`${id}-name`} defaultValue="Rose Gonzalez" />
      </Field>
      <Field layout="horizontal">
        <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
        <Input
          id={`${id}-email`}
          type="email"
          defaultValue="rose@edgecomm.example"
        />
      </Field>
      <Field layout="horizontal">
        <FieldLabel htmlFor={`${id}-phone`}>Phone</FieldLabel>
        <Input
          id={`${id}-phone`}
          type="tel"
          defaultValue="(512) 757-6000"
          aria-describedby={`${id}-phone-help`}
        />
        <FieldDescription id={`${id}-phone-help`}>
          Include the country code for numbers outside the US.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
```

### Label with help

An info button after the `FieldLabel` that shows the field's help in a `Tooltip` and describes itself with it, through `aria-describedby`.

```tsx
import { useId } from "react"
import { InfoIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const help =
  "The account's revenue for its last fiscal year, in the account's currency."

export default function FieldHelp() {
  const id = useId()

  return (
    <Field className="max-w-sm">
      <div className="flex items-center gap-1">
        <FieldLabel htmlFor={`${id}-revenue`}>Annual Revenue</FieldLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="Help for Annual Revenue"
              aria-describedby={`${id}-revenue-help`}
              className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
            >
              <InfoIcon />
              <span id={`${id}-revenue-help`} hidden>
                {help}
              </span>
            </TooltipTrigger>
            <TooltipContent>{help}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id={`${id}-revenue`}
        inputMode="decimal"
        defaultValue="139,000,000"
      />
    </Field>
  )
}
```
