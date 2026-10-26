# Dual listbox

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/dual-listbox](https://ui.wisty.ai/dual-listbox) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks several options by moving them from one list to another, in order. For a short list of choices, use Checkbox or Combobox.

```bash
npx shadcn@latest add @wisty/dual-listbox
```

## Examples

- `default` (Fields to display): A list view's columns: fields move from Available Fields to Visible Fields, and the up and down buttons set their order.
- `required` (Required, with limits): Two to four languages with `required`, `min` and `max`: a move that breaks a limit is refused and its message shows.
- `locked` (Locked options): Opportunity Name and Stage stay at the top of the selected list, gray and locked by `requiredOptions`, so they can't be removed.
- `disabled` (Disabled): A `disabled` dual listbox shows its selection in gray boxes, with no Tab stops and every button disabled.
- `loading` (Loading): With `loading`, a spinner covers the source list while its options load, and the move buttons wait.
- `no-reordering` (Without reordering): A set whose order doesn't matter: `disableReordering` leaves out the up and down buttons, and `size={5}` shows five rows.

## When to use

- People pick several options from a long list and the order of what they pick matters, like the columns of a list view ("Select Fields to Display") or the fields on a layout.
- People pick several options and should see what's left beside what's chosen, like the languages an agent supports or the permission sets a user has.
- Some options must always stay chosen. Pass them as `requiredOptions`. They lead the selected list with a lock.
- The choice has limits, like "two to four". `min`, `max` and `required` refuse a move that breaks them and say why.
- It replaces `lightning-dual-listbox`.

## When not to use

- There are only a few options, or the order doesn't matter and space is tight. Use Checkbox, or Combobox with several values.
- People pick records, like accounts or contacts. Use Lookup.
- People pick one option. Use Select or Radio group.
- People sort a list without choosing from another. A dual listbox always shows both lists.

## Usage

```tsx
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { DualListbox } from "@/components/wisty/dual-listbox"
```

Name the group from a `FieldLegend`, as a visual picker is named, and hold the value in state when the page reads it:

```tsx
<DualListbox
  options={fields}
  sourceLabel="Available Fields"
  selectedLabel="Visible Fields"
  value={visibleFields}
  onValueChange={setVisibleFields}
  aria-labelledby="fields-legend"
/>
```

`value` is the selected list in its order, with `requiredOptions` first. `onValueChange` gets that list after every move and reorder. The options people highlight are the dual listbox's own state, not the value. With `name`, the selected values submit with a form, one entry per value, and an invalid selection stops the submit and shows its error. The error under the lists is the dual listbox's own; point the group's `aria-describedby` at a `FieldDescription` for help text.

## Rules

- Keep option values unique and stable. The value, the highlight and the focus follow them.
- Keep `requiredOptions` inside `options`. A required value with no option is ignored.
- Give the dual listbox a name for its group. Without it, the lists' names don't say what they choose.
- Never pass `asChild` or `render`.

## API reference

### DualListbox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `readonly DualListboxOption[]` |  | Every option, in the order the source list shows them. |
| `sourceLabel` | `string` |  | The source list's label, like "Available". |
| `selectedLabel` | `string` |  | The selected list's label, like "Selected". |
| `value`? | `readonly string[]` |  | The selected options' values, in the selected list's order. Controlled. |
| `defaultValue`? | `readonly string[]` |  |  |
| `onValueChange`? | `(value: string[]) => void` |  | Called with the selected values after a move or a reorder. |
| `requiredOptions`? | `readonly string[]` | `[]` | Values that are always selected and can't be removed. They lead the selected list, with a lock. |
| `min`? | `number` | `0` | The fewest options the selected list may hold. A move that leaves fewer is refused. |
| `max`? | `number` |  | The most options the selected list may hold. A move that adds more is refused. |
| `required`? | `boolean` | `false` | At least one option must be selected. |
| `disabled`? | `boolean` | `false` | Disables both lists and every button. |
| `disableReordering`? | `boolean` | `false` | Hides the up and down buttons. |
| `size`? | `number` |  | How many options each list shows before it scrolls. |
| `loading`? | `boolean` | `false` | Covers the source list with a spinner and disables the move buttons. |
| `name`? | `string` |  | Submits the selected values with a form, one entry per value; an invalid selection blocks the submit. |
| `form`? | `string` |  | The id of a form the values belong to, outside it. |
| `addButtonLabel`? | `string` | ``Move selection to ${selectedLabel}`` | The add button's name and tooltip. Defaults to "Move selection to" and the selected list's label. |
| `removeButtonLabel`? | `string` | ``Move selection to ${sourceLabel}`` | The remove button's name and tooltip. Defaults to "Move selection to" and the source list's label. |
| `upButtonLabel`? | `string` | `"Move selection up"` |  |
| `downButtonLabel`? | `string` | `"Move selection down"` |  |
| `messageWhenValueMissing`? | `string` | `"An option must be selected."` | The error when `required` and nothing is selected. |
| `messageWhenRangeOverflow`? | `string` |  | The error when more than `max` options would be selected. |
| `messageWhenRangeUnderflow`? | `string` |  | The error when fewer than `min` options would be selected. |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### DualListboxOption

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | What the option submits, and what `value` holds. |
| `label` | `string` |  | What the option shows. |

## SLDS mapping

`DualListbox` is `slds-dueling-list` inside a `role="group"` named by the field's legend. Each list is a `slds-dueling-list__column_responsive` column: a `slds-form-element__label` over `slds-dueling-list__options`, holding a `slds-listbox_vertical` listbox of `slds-listbox__option_plain` options. The buttons are `slds-button_icon-container` icon buttons in two `slds-dueling-list__column` columns. A locked option is `aria-disabled` with `utility:lock` after its label. The error is `slds-form-element__help` with `slds-has-error`.

Known gaps:

- No drag and drop between or within the lists, as in `lightning-dual-listbox`. The buttons and the keyboard move and reorder.
- The chevrons are lucide's, where SLDS draws `utility:right`, `left`, `up` and `down`. The lock is Salesforce's `utility:lock`, so it needs the icons the Icon component loads.
- The keyboard instructions, the announcements of each move, the locked option's text and the spinner's name are English.
- No label-inline layout, no options with descriptions or icons, and no filter inside the lists.

## Keyboard interactions

| Key                        | Action                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------ |
| Up, Down                   | Moves focus to the previous or next option and highlights it alone.                  |
| Home, End                  | Moves focus to the first or last option and highlights it alone.                     |
| Shift + Up, Down           | Moves focus and highlights the range from where the highlight started.               |
| Ctrl + Shift + Home, End   | Highlights the range from where the highlight started to the first or last option.   |
| Ctrl + Up, Down            | Moves focus without changing the highlight.                                          |
| Space, Enter, Ctrl + Space | Adds the focused option to the highlight, or takes it out.                           |
| Ctrl + A                   | Highlights every option in the list, or clears them all when they already are.       |
| Ctrl + Right               | Moves the highlighted options to the selected list and focuses the first of them.    |
| Ctrl + Left                | Moves the highlighted options back to the source list and focuses the first of them. |
| Letters and digits         | Moves focus to the next option whose label starts with what was typed.               |
| Tab                        | Moves between the two lists and the buttons. Each list is one Tab stop.              |

On a Mac, Command works where the table says Ctrl. With the mouse, a click highlights one option, Ctrl or Command with a click adds or removes one, and Shift with a click highlights a range.

## Accessibility

- Name the group: point `aria-labelledby` at a `FieldLegend`, or pass `aria-label`. `sourceLabel` and `selectedLabel` name the two lists.
- Each list describes its keyboard shortcuts to screen readers, and every move and reorder is announced.
- A locked option still takes focus, so screen reader users hear that it can't be removed.
- After a button moves options, focus stays on the button. When that move disables the button, focus goes to the first moved option.

## Responsive behavior

- The two lists share the width equally: 15rem each where there's room, 6rem at the narrowest, plus 5rem for the buttons. Narrower than 17rem, the dual listbox overflows its container.
- `size` sets how many options show before a list scrolls. Long labels truncate, with the full label in a tooltip.

## Example code

### Fields to display

A list view's columns: fields move from Available Fields to Visible Fields, and the up and down buttons set their order.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { DualListbox } from "@/components/wisty/dual-listbox"

const fields = [
  { value: "Name", label: "Account Name" },
  { value: "Owner.Alias", label: "Account Owner Alias" },
  { value: "AnnualRevenue", label: "Annual Revenue" },
  { value: "BillingCity", label: "Billing City" },
  { value: "BillingCountry", label: "Billing Country" },
  { value: "BillingState", label: "Billing State/Province" },
  { value: "CreatedDate", label: "Created Date" },
  { value: "NumberOfEmployees", label: "Employees" },
  { value: "Industry", label: "Industry" },
  { value: "LastActivityDate", label: "Last Activity" },
  { value: "Phone", label: "Phone" },
  { value: "Rating", label: "Rating" },
  { value: "Type", label: "Type" },
  { value: "Website", label: "Website" },
]

export default function DualListboxDefault() {
  const id = useId()

  return (
    <FieldSet className="max-w-xl">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Fields to display
      </FieldLegend>
      <DualListbox
        name="fields"
        options={fields}
        sourceLabel="Available Fields"
        selectedLabel="Visible Fields"
        defaultValue={["Name", "BillingState", "Phone", "Type", "Owner.Alias"]}
        aria-labelledby={`${id}-legend`}
      />
    </FieldSet>
  )
}
```

### Required, with limits

Two to four languages with `required`, `min` and `max`: a move that breaks a limit is refused and its message shows.

```tsx
import { useId } from "react"

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"
import { DualListbox } from "@/components/wisty/dual-listbox"

const languages = [
  { value: "zh_CN", label: "Chinese (Simplified)" },
  { value: "nl_NL", label: "Dutch" },
  { value: "en_US", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "pt_BR", label: "Portuguese (Brazil)" },
  { value: "es", label: "Spanish" },
]

export default function DualListboxRequired() {
  const id = useId()

  return (
    <FieldSet className="max-w-xl">
      <FieldLegend variant="label" id={`${id}-legend`}>
        <abbr title="required" className="me-0.5 text-destructive no-underline">
          *
        </abbr>
        Support languages
      </FieldLegend>
      <FieldDescription id={`${id}-description`}>
        Choose two to four languages the agent answers cases in.
      </FieldDescription>
      <DualListbox
        name="languages"
        required
        min={2}
        max={4}
        options={languages}
        sourceLabel="Available Languages"
        selectedLabel="Selected Languages"
        defaultValue={["en_US", "fr"]}
        aria-labelledby={`${id}-legend`}
        aria-describedby={`${id}-description`}
      />
    </FieldSet>
  )
}
```

### Locked options

Opportunity Name and Stage stay at the top of the selected list, gray and locked by `requiredOptions`, so they can't be removed.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { DualListbox } from "@/components/wisty/dual-listbox"

const fields = [
  { value: "Name", label: "Opportunity Name" },
  { value: "Account.Name", label: "Account Name" },
  { value: "Amount", label: "Amount" },
  { value: "CloseDate", label: "Close Date" },
  { value: "ForecastCategoryName", label: "Forecast Category" },
  { value: "LeadSource", label: "Lead Source" },
  { value: "NextStep", label: "Next Step" },
  { value: "Owner.Alias", label: "Opportunity Owner Alias" },
  { value: "Probability", label: "Probability (%)" },
  { value: "StageName", label: "Stage" },
  { value: "Type", label: "Type" },
]

export default function DualListboxLocked() {
  const id = useId()

  return (
    <FieldSet className="max-w-xl">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Fields to display
      </FieldLegend>
      <DualListbox
        name="fields"
        options={fields}
        sourceLabel="Available Fields"
        selectedLabel="Visible Fields"
        requiredOptions={["Name", "StageName"]}
        defaultValue={["Amount", "CloseDate"]}
        aria-labelledby={`${id}-legend`}
      />
    </FieldSet>
  )
}
```

### Disabled

A `disabled` dual listbox shows its selection in gray boxes, with no Tab stops and every button disabled.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { DualListbox } from "@/components/wisty/dual-listbox"

const fields = [
  { value: "Name", label: "Name" },
  { value: "Account.Name", label: "Account Name" },
  { value: "Email", label: "Email" },
  { value: "MailingCity", label: "Mailing City" },
  { value: "MobilePhone", label: "Mobile" },
  { value: "Owner.Alias", label: "Contact Owner Alias" },
  { value: "Phone", label: "Phone" },
  { value: "Title", label: "Title" },
]

export default function DualListboxDisabled() {
  const id = useId()

  return (
    <FieldSet className="max-w-xl">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Fields to display
      </FieldLegend>
      <DualListbox
        disabled
        options={fields}
        sourceLabel="Available Fields"
        selectedLabel="Visible Fields"
        defaultValue={["Name", "Account.Name", "Title", "Phone", "Email"]}
        aria-labelledby={`${id}-legend`}
      />
    </FieldSet>
  )
}
```

### Loading

With `loading`, a spinner covers the source list while its options load, and the move buttons wait.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { DualListbox } from "@/components/wisty/dual-listbox"

const assigned = [
  { value: "SalesUser", label: "Sales User" },
  { value: "ReportBuilder", label: "Report Builder" },
]

export default function DualListboxLoading() {
  const id = useId()

  return (
    <FieldSet className="max-w-xl">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Permission sets
      </FieldLegend>
      <DualListbox
        loading
        name="permissionSets"
        options={assigned}
        sourceLabel="Available Permission Sets"
        selectedLabel="Enabled Permission Sets"
        defaultValue={["SalesUser", "ReportBuilder"]}
        aria-labelledby={`${id}-legend`}
      />
    </FieldSet>
  )
}
```

### Without reordering

A set whose order doesn't matter: `disableReordering` leaves out the up and down buttons, and `size={5}` shows five rows.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { DualListbox } from "@/components/wisty/dual-listbox"

const industries = [
  { value: "Agriculture", label: "Agriculture" },
  { value: "Banking", label: "Banking" },
  { value: "Construction", label: "Construction" },
  { value: "Education", label: "Education" },
  { value: "Energy", label: "Energy" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Insurance", label: "Insurance" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Technology", label: "Technology" },
]

export default function DualListboxNoReordering() {
  const id = useId()

  return (
    <FieldSet className="max-w-xl">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Territory industries
      </FieldLegend>
      <DualListbox
        name="industries"
        disableReordering
        size={5}
        options={industries}
        sourceLabel="Available"
        selectedLabel="In Territory"
        defaultValue={["Banking", "Insurance"]}
        aria-labelledby={`${id}-legend`}
      />
    </FieldSet>
  )
}
```
