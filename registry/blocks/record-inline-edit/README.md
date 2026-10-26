# Record inline edit

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/record-inline-edit](https://ui.wisty.ai/record-inline-edit) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A record's Details tab, edited in place with a pencil, Cancel and Save. The app does the saving.

```bash
npx shadcn@latest add @wisty/record-inline-edit
```

## Examples

- `default` (Opportunity details): An opportunity's sections with a pencil on each field people can edit. A pencil opens them all, with Cancel and Save at the bottom.
- `editing` (Editing): With `defaultMode="edit"`: Owner and Expected Revenue stay read-only with a lock, and a field you change turns yellow with an undo button.
- `errors` (After a failed save): The app's `errors`: the account lookup's filter error on its field, and a validation rule's message for the record above the sections.
- `pending` (Saving): With `pending`, Save shows a spinner and is disabled, so it can't save twice, while the app saves the changed values.
- `horizontal` (Compact density): With `layout="horizontal"` and `columns={1}`, labels sit beside values, as in Lightning's compact density, shown in edit mode with its locks.
- `readonly` (Read-only record): With `readOnly`, for a record people can see but not edit: the same fields, and no pencils.
- `loading` (Loading): With `loading` and no values yet, the layout's labels hold their places and every value is a placeholder.

## When to use

- A record page's Details tab where people change fields in place: Lightning's inline edit, a pencil on each field, then Cancel and Save at the bottom.
- The fields, which are editable and the picklist values come from the object's metadata and page layout, and the app saves through `updateRecord` or the REST API.
- What `lightning-record-form` draws in view mode with its edit pencils.

## When not to use

- The tab is read-only, or a pencil opens a form elsewhere. Use Record detail.
- People create a record, or edit it in a modal. Use Record form.
- Many records side by side. Use Data table.

## Usage

```tsx
import {
  RecordInlineEdit,
  RecordInlineEditCancel,
  RecordInlineEditField,
  RecordInlineEditFooter,
  RecordInlineEditMessages,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import { RecordFormSubmit } from "@/components/wisty/record-form"
```

```text
RecordInlineEdit
├── RecordInlineEditMessages
├── RecordInlineEditSection
│   └── RecordInlineEditField
└── RecordInlineEditFooter
    ├── RecordInlineEditCancel
    └── RecordFormSubmit
```

`fields` describes every field, keyed by API name: Record form's description, which extends Record detail's, with `editable: false` for a field people can't change and `href` for a lookup's link. `values` is the record. The same two render a read-only Record detail. Each `RecordInlineEditField` draws one field by `name`. Saving is the app's, so control `mode`: `onSubmit` gets the values, and the app passes `pending` and a failed save's `errors` back in, or the new `values` with `mode` set to `"view"`. `defaultMode` only sets the mode it starts in.

```tsx
const [mode, setMode] = useState<RecordInlineEditMode>("view")
const [values, setValues] = useState(record)
const [errors, setErrors] = useState<RecordFormErrors>()
const [pending, startSaving] = useTransition()

<RecordInlineEdit
  fields={fields}
  values={values}
  mode={mode}
  onModeChange={setMode}
  pending={pending}
  errors={errors}
  onSubmit={(_, { changed }) =>
    startSaving(async () => {
      const result = await updateOpportunity(changed)
      setErrors(result.errors)
      if (result.errors) return
      setValues(result.record)
      setMode("view")
    })
  }
>
  …
</RecordInlineEdit>
```

Send `changed`, the values that differ from `values`, to `updateRecord`. When it's empty, set the mode back to `"view"` without a request. To lay out a page layout loaded at runtime, map its sections to `RecordInlineEditSection` and their field names to `RecordInlineEditField`, as Record form's Usage does.

`RecordInlineEditFooter` draws Cancel and Save on its own. To order the buttons or add one of the page's, pass them as children: `RecordInlineEditCancel` returns to view mode, and Save is Record form's `RecordFormSubmit`:

```tsx
<RecordInlineEditFooter>
  <RecordInlineEditCancel />
  <Button type="button" variant="outline" onClick={openFieldHistory}>
    Field History
  </Button>
  <RecordFormSubmit>Save</RecordFormSubmit>
</RecordInlineEditFooter>
```

A field whose control Record form doesn't draw, like a multi-select picklist, takes a custom control as `RecordInlineEditField`'s child, written with `useRecordFormControl` as in Record form. Edit mode draws it; view mode shows the value by the field's type.

The footer sticks to the bottom of its scroll container. For Lightning's footer, fixed to the bottom of the window, set it with `className`:

```tsx
<RecordInlineEditFooter className="fixed inset-x-0 bottom-0 z-50" />
```

## Rules

- Control `mode` for a save: the block never leaves edit mode on its own, and never reads success from `pending` going false.
- Pass `errors` from state, a new object for each failed save. Errors left over from an earlier edit don't show when a new one starts.
- Pass `null` for an empty value, never `""` or 0. A percent is a fraction: 0.6 for 60%. A lookup's value is its record (`{ id, name }`).
- A `relative` field must be `editable: false`. A `datetime` is an instant, shown and edited on `timeZone`'s clock, so pass the user's time zone; a `time` is Salesforce's `"HH:mm:ss.SSSZ"`, which no time zone moves.
- Give sections with the same title a `value`, or they share their open state.
- Keep the footer inside `RecordInlineEdit`: Save is a submit button. It and its children show only in edit mode. With children, keep a `RecordFormSubmit` and a `RecordInlineEditCancel` among them, or people can't save or leave edit mode.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `RecordInlineEdit` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |
| `RecordInlineEditMessages` | [RecordFormMessages](https://ui.wisty.ai/record-form#api-RecordFormMessages) | The errors for the whole record, above the sections in edit mode. Renders nothing without any. |
| `RecordInlineEditSection` | [RecordDetailSection](https://ui.wisty.ai/record-detail#api-RecordDetailSection) | A collapsible section of the page layout, drawn the same in both modes. |
| `RecordInlineEditField` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | One field by API name: its value with a pencil in view mode, the form field or a locked value in edit mode. |
| `RecordInlineEditFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | The buttons docked at the bottom of the block in edit mode: Cancel and Save, or its children. |
| `RecordInlineEditCancel` | [Button](https://ui.wisty.ai/button#api-Button) | Cancel: back to view mode, dropping the edits. Disabled while the save runs. |

### RecordInlineEdit

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` | `RecordInlineEditFields` |  | Every field the layout can show, keyed by API name. |
| `values`? | `RecordInlineEditValues` | `{}` | The record's values. After a save, pass the new values with mode "view". |
| `mode`? | `RecordInlineEditMode` |  | View or edit, controlled. A save needs it controlled, so the app can return to view. |
| `defaultMode`? | `RecordInlineEditMode` | `"view"` | The mode it starts in, uncontrolled. Default "view". |
| `onModeChange`? | `(mode: RecordInlineEditMode) => void` |  | Called when a pencil asks for edit mode, or Cancel for view mode. |
| `pending`? | `boolean` | `false` | The save is running: Save shows a spinner and is disabled. |
| `errors`? | `RecordFormErrors` |  | A failed save's errors. Pass a new object for each save, from state. |
| `onSubmit`? | `( values: RecordFormValues, details: RecordInlineEditSubmitDetails ) => void` |  | Called with valid values when Save is pressed. |
| `readOnly`? | `boolean` | `false` | The user can't edit the record: no pencils, and view mode only. |
| `columns`? | `1 \| 2` | `2` | Fields per row. Default 2. Two columns fall to one in a narrow container. |
| `layout`? | `"auto" \| "stacked" \| "horizontal"` | `"auto"` | Label above the value, or beside it from a 48rem screen. Default "auto": beside it when the page is compact (`data-density="compact"`), above it otherwise. |
| `headingLevel`? | `2 \| 3 \| 4` | `2` | The level of each section's heading. Default 2, under a record page's h1. |
| `loading`? | `boolean` | `false` | Holds every value's place while the record loads, with no pencils. Without children, draws placeholder fields. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers and dates. Default "en-US". |
| `currency`? | `string` | `"USD"` | An ISO 4217 code for currency fields. Default "USD". |
| `timeZone`? | `string` | `"UTC"` | An IANA time zone whose clock datetime fields show and are edited in. Default "UTC". |

### RecordInlineEditSection

A collapsible section of the page layout, drawn the same in both modes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value`? | `string` |  | A stable key for its open state, like the layout section's id. Without it, the title keys it. |
| `defaultOpen`? | `boolean` | `true` | Whether the section starts open, uncontrolled. Default true. |

### RecordInlineEditField

One field by API name: its value with a pencil in view mode, the form field or a locked value in edit mode.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children`? | `React.ReactNode` |  | A custom control for edit mode that calls useRecordFormControl; omit it for the type's own. |
| `name` | `string` |  | The field's API name, a key of the root's `fields`. |

### RecordInlineEditFooter

The buttons docked at the bottom of the block in edit mode: Cancel and Save, or its children.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children`? | `React.ReactNode` |  | Buttons in place of Cancel and Save; leave it out for the defaults. |
| `cancelLabel`? | `string` | `"Cancel"` | The Cancel button's text, without children. Default "Cancel". |
| `saveLabel`? | `string` | `"Save"` | The Save button's text, without children. Default "Save". |

### RecordInlineEditCancel

Cancel: back to view mode, dropping the edits. Disabled while the save runs.

| Prop | Type | Default |
| --- | --- | --- |
| `children`? | `ReactNode` | `"Cancel"` |
| `variant`? | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link" \| "outline-brand" \| "destructive-text" \| "success" \| "inverse"` | `"outline"` |

### RecordInlineEditFieldDescription

How a field is drawn, read and edited: Record form's description, or a relative time, which is only shown.

```ts
type RecordInlineEditFieldDescription =
  | RecordFormFieldDescription
  | Extract<RecordDetailFieldDescription, { type: "relative" }>
```

### RecordInlineEditFields

The record's fields, keyed by API name.

```ts
type RecordInlineEditFields = Record<string, RecordInlineEditFieldDescription>
```

### RecordInlineEditValues

The record's values, keyed by API name: a lookup's is its record, a compound field's its parts, an instant ISO 8601.

```ts
type RecordInlineEditValues = RecordDetailValues
```

### RecordInlineEditMode

```ts
type RecordInlineEditMode = "view" | "edit"
```

### RecordInlineEditSubmitDetails

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `changed` | `RecordFormValues` |  | The values that differ from `values`, as updateRecord takes them. |

## SLDS mapping

- `RecordInlineEditSection` is Record detail's section, an expandable `slds-section` over the record detail form layout (`slds-form`, `slds-form__row`, `slds-form__item`), drawn the same in both modes.
- In view mode, `RecordInlineEditField` is Record detail's field: `slds-form-element_readonly` with `slds-form-element_edit` and its pencil. In edit mode it's Record form's field, and a field people can't edit stays read-only with `utility:lock` where the pencil was.
- A changed field is `slds-is-edited`, with `slds-form-element__undo`'s `utility:undo` button.
- `RecordInlineEditMessages` is Record form's error Alert.
- `RecordInlineEditFooter` is `slds-docked-form-footer`, sticky at the bottom of its scroll container rather than fixed to the window.

Known gaps:

- No multi-select picklist or rich text controls in edit mode, as in Record form. Draw them with a custom control. A relative time ("3 hours ago") stays read-only.
- No error popover next to the footer's buttons; the record's errors show above the sections.
- A pencil opens every editable field, as Lightning's record detail does. Editing one field alone, as a list view's cell does, isn't drawn.

## Keyboard interactions

| Key               | Action                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Enter on a pencil | Switches to edit mode and focuses that field's control.                                  |
| Enter in a field  | Saves, as Save does. In a lookup or picklist with its list open, Enter picks the option. |

## Accessibility

- Each section's title is a heading with its toggle inside: `h2` by default, for a record page whose header is the `h1`. Under another heading, set `headingLevel` one level below it.
- A pencil is named after its field, like "Edit Amount", an undo button "Undo Amount", and a lock "Locked Opportunity Owner".
- Cancel, or a save the app finishes by setting the mode to `"view"`, returns focus to the pencil that started the edit, or to its section's toggle when that section was collapsed meanwhile.
- While `pending`, Save and Cancel are disabled, so the save's answer can't land on a newer edit. Fields stay editable.
- A save that fails moves focus to the first field with an error, or to the record's errors when none belongs to a field on the page, and opens every collapsed section until the edit ends.

## Responsive behavior

- Two columns need about 584px. In a narrower container the fields stack in one column, in the same order.
- Labels follow Salesforce's display density by default (`layout="auto"`): above the values, and beside them when the page is compact (`data-density="compact"` on `<html>`). `layout="stacked"` or `"horizontal"` fixes it for one block.
- Beside means from a 48rem screen, whatever the block's own width; below that they stack.

## Example code

### Opportunity details

An opportunity's sections with a pencil on each field people can edit. A pencil opens them all, with Cancel and Save at the bottom.

```tsx
"use client"

import {
  RecordInlineEdit,
  RecordInlineEditField,
  RecordInlineEditFooter,
  RecordInlineEditMessages,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import {
  recordInlineEditFields,
  recordInlineEditOpportunity,
} from "@/components/wisty/record-inline-edit-data"

export default function RecordInlineEditDefault() {
  return (
    <RecordInlineEdit
      fields={recordInlineEditFields}
      values={recordInlineEditOpportunity}
      className="w-full max-w-3xl"
    >
      <RecordInlineEditMessages />
      <RecordInlineEditSection title="Opportunity Information">
        <RecordInlineEditField name="OwnerId" />
        <RecordInlineEditField name="Amount" />
        <RecordInlineEditField name="IsPrivate" />
        <RecordInlineEditField name="ExpectedRevenue" />
        <RecordInlineEditField name="Name" />
        <RecordInlineEditField name="CloseDate" />
        <RecordInlineEditField name="AccountId" />
        <RecordInlineEditField name="NextStep" />
        <RecordInlineEditField name="Type" />
        <RecordInlineEditField name="StageName" />
        <RecordInlineEditField name="LeadSource" />
        <RecordInlineEditField name="Probability" />
      </RecordInlineEditSection>
      <RecordInlineEditSection title="Additional Information">
        <RecordInlineEditField name="OrderNumber__c" />
        <RecordInlineEditField name="MainCompetitors__c" />
        <RecordInlineEditField name="CurrentGenerators__c" />
        <RecordInlineEditField name="DeliveryInstallationStatus__c" />
        <RecordInlineEditField name="InstallationStart__c" />
        <RecordInlineEditField name="TrackingNumber__c" />
        <RecordInlineEditField name="Description" />
      </RecordInlineEditSection>
      <RecordInlineEditSection title="System Information">
        <RecordInlineEditField name="LastModifiedDate" />
      </RecordInlineEditSection>
      <RecordInlineEditFooter />
    </RecordInlineEdit>
  )
}
```

### Editing

With `defaultMode="edit"`: Owner and Expected Revenue stay read-only with a lock, and a field you change turns yellow with an undo button.

```tsx
"use client"

import {
  RecordInlineEdit,
  RecordInlineEditField,
  RecordInlineEditFooter,
  RecordInlineEditMessages,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import {
  recordInlineEditFields,
  recordInlineEditOpportunity,
} from "@/components/wisty/record-inline-edit-data"

export default function RecordInlineEditEditing() {
  return (
    <RecordInlineEdit
      fields={recordInlineEditFields}
      values={recordInlineEditOpportunity}
      defaultMode="edit"
      className="w-full max-w-3xl"
    >
      <RecordInlineEditMessages />
      <RecordInlineEditSection title="Opportunity Information">
        <RecordInlineEditField name="OwnerId" />
        <RecordInlineEditField name="Amount" />
        <RecordInlineEditField name="IsPrivate" />
        <RecordInlineEditField name="ExpectedRevenue" />
        <RecordInlineEditField name="Name" />
        <RecordInlineEditField name="CloseDate" />
        <RecordInlineEditField name="AccountId" />
        <RecordInlineEditField name="NextStep" />
        <RecordInlineEditField name="Type" />
        <RecordInlineEditField name="StageName" />
        <RecordInlineEditField name="LeadSource" />
        <RecordInlineEditField name="Probability" />
      </RecordInlineEditSection>
      <RecordInlineEditSection title="Additional Information">
        <RecordInlineEditField name="OrderNumber__c" />
        <RecordInlineEditField name="MainCompetitors__c" />
        <RecordInlineEditField name="CurrentGenerators__c" />
        <RecordInlineEditField name="DeliveryInstallationStatus__c" />
        <RecordInlineEditField name="TrackingNumber__c" />
        <RecordInlineEditField name="Description" />
      </RecordInlineEditSection>
      <RecordInlineEditFooter />
    </RecordInlineEdit>
  )
}
```

### After a failed save

The app's `errors`: the account lookup's filter error on its field, and a validation rule's message for the record above the sections.

```tsx
"use client"

import {
  RecordInlineEdit,
  RecordInlineEditField,
  RecordInlineEditFooter,
  RecordInlineEditMessages,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import {
  recordInlineEditFields,
  recordInlineEditOpportunityErrors,
  recordInlineEditOpportunityFailed,
} from "@/components/wisty/record-inline-edit-data"

export default function RecordInlineEditErrors() {
  return (
    <RecordInlineEdit
      fields={recordInlineEditFields}
      values={recordInlineEditOpportunityFailed}
      errors={recordInlineEditOpportunityErrors}
      defaultMode="edit"
      className="w-full max-w-3xl"
    >
      <RecordInlineEditMessages />
      <RecordInlineEditSection title="Opportunity Information">
        <RecordInlineEditField name="OwnerId" />
        <RecordInlineEditField name="Amount" />
        <RecordInlineEditField name="IsPrivate" />
        <RecordInlineEditField name="ExpectedRevenue" />
        <RecordInlineEditField name="Name" />
        <RecordInlineEditField name="CloseDate" />
        <RecordInlineEditField name="AccountId" />
        <RecordInlineEditField name="NextStep" />
        <RecordInlineEditField name="Type" />
        <RecordInlineEditField name="StageName" />
        <RecordInlineEditField name="LeadSource" />
        <RecordInlineEditField name="Probability" />
      </RecordInlineEditSection>
      <RecordInlineEditFooter />
    </RecordInlineEdit>
  )
}
```

### Saving

With `pending`, Save shows a spinner and is disabled, so it can't save twice, while the app saves the changed values.

```tsx
"use client"

import {
  RecordInlineEdit,
  RecordInlineEditField,
  RecordInlineEditFooter,
  RecordInlineEditMessages,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import {
  recordInlineEditFields,
  recordInlineEditOpportunity,
} from "@/components/wisty/record-inline-edit-data"

export default function RecordInlineEditPending() {
  return (
    <RecordInlineEdit
      fields={recordInlineEditFields}
      values={recordInlineEditOpportunity}
      defaultMode="edit"
      pending
      className="w-full max-w-3xl"
    >
      <RecordInlineEditMessages />
      <RecordInlineEditSection title="Opportunity Information">
        <RecordInlineEditField name="OwnerId" />
        <RecordInlineEditField name="Amount" />
        <RecordInlineEditField name="IsPrivate" />
        <RecordInlineEditField name="ExpectedRevenue" />
        <RecordInlineEditField name="Name" />
        <RecordInlineEditField name="CloseDate" />
        <RecordInlineEditField name="AccountId" />
        <RecordInlineEditField name="NextStep" />
        <RecordInlineEditField name="Type" />
        <RecordInlineEditField name="StageName" />
        <RecordInlineEditField name="LeadSource" />
        <RecordInlineEditField name="Probability" />
      </RecordInlineEditSection>
      <RecordInlineEditSection title="Additional Information">
        <RecordInlineEditField name="OrderNumber__c" />
        <RecordInlineEditField name="MainCompetitors__c" />
        <RecordInlineEditField name="CurrentGenerators__c" />
        <RecordInlineEditField name="DeliveryInstallationStatus__c" />
        <RecordInlineEditField name="TrackingNumber__c" />
        <RecordInlineEditField name="Description" />
      </RecordInlineEditSection>
      <RecordInlineEditFooter />
    </RecordInlineEdit>
  )
}
```

### Compact density

With `layout="horizontal"` and `columns={1}`, labels sit beside values, as in Lightning's compact density, shown in edit mode with its locks.

```tsx
"use client"

import {
  RecordInlineEdit,
  RecordInlineEditField,
  RecordInlineEditFooter,
  RecordInlineEditMessages,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import {
  recordInlineEditFields,
  recordInlineEditOpportunity,
} from "@/components/wisty/record-inline-edit-data"

export default function RecordInlineEditHorizontal() {
  return (
    <RecordInlineEdit
      fields={recordInlineEditFields}
      values={recordInlineEditOpportunity}
      defaultMode="edit"
      columns={1}
      layout="horizontal"
      className="w-full max-w-[38rem]"
    >
      <RecordInlineEditMessages />
      <RecordInlineEditSection title="Opportunity Information">
        <RecordInlineEditField name="OwnerId" />
        <RecordInlineEditField name="Name" />
        <RecordInlineEditField name="AccountId" />
        <RecordInlineEditField name="Amount" />
        <RecordInlineEditField name="ExpectedRevenue" />
        <RecordInlineEditField name="CloseDate" />
        <RecordInlineEditField name="StageName" />
        <RecordInlineEditField name="Probability" />
        <RecordInlineEditField name="IsPrivate" />
        <RecordInlineEditField name="NextStep" />
      </RecordInlineEditSection>
      <RecordInlineEditFooter />
    </RecordInlineEdit>
  )
}
```

### Read-only record

With `readOnly`, for a record people can see but not edit: the same fields, and no pencils.

```tsx
"use client"

import {
  RecordInlineEdit,
  RecordInlineEditField,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import {
  recordInlineEditFields,
  recordInlineEditOpportunity,
} from "@/components/wisty/record-inline-edit-data"

export default function RecordInlineEditReadonly() {
  return (
    <RecordInlineEdit
      fields={recordInlineEditFields}
      values={recordInlineEditOpportunity}
      readOnly
      className="w-full max-w-3xl"
    >
      <RecordInlineEditSection title="Opportunity Information">
        <RecordInlineEditField name="OwnerId" />
        <RecordInlineEditField name="Amount" />
        <RecordInlineEditField name="IsPrivate" />
        <RecordInlineEditField name="ExpectedRevenue" />
        <RecordInlineEditField name="Name" />
        <RecordInlineEditField name="CloseDate" />
        <RecordInlineEditField name="AccountId" />
        <RecordInlineEditField name="NextStep" />
        <RecordInlineEditField name="Type" />
        <RecordInlineEditField name="StageName" />
        <RecordInlineEditField name="LeadSource" />
        <RecordInlineEditField name="Probability" />
      </RecordInlineEditSection>
      <RecordInlineEditSection title="Additional Information">
        <RecordInlineEditField name="OrderNumber__c" />
        <RecordInlineEditField name="MainCompetitors__c" />
        <RecordInlineEditField name="CurrentGenerators__c" />
        <RecordInlineEditField name="DeliveryInstallationStatus__c" />
        <RecordInlineEditField name="InstallationStart__c" />
        <RecordInlineEditField name="TrackingNumber__c" />
        <RecordInlineEditField name="Description" />
      </RecordInlineEditSection>
    </RecordInlineEdit>
  )
}
```

### Loading

With `loading` and no values yet, the layout's labels hold their places and every value is a placeholder.

```tsx
"use client"

import {
  RecordInlineEdit,
  RecordInlineEditField,
  RecordInlineEditSection,
} from "@/components/wisty/record-inline-edit"
import { recordInlineEditFields } from "@/components/wisty/record-inline-edit-data"

export default function RecordInlineEditLoading() {
  return (
    <RecordInlineEdit
      fields={recordInlineEditFields}
      loading
      className="w-full max-w-3xl"
    >
      <RecordInlineEditSection title="Opportunity Information">
        <RecordInlineEditField name="OwnerId" />
        <RecordInlineEditField name="Amount" />
        <RecordInlineEditField name="IsPrivate" />
        <RecordInlineEditField name="ExpectedRevenue" />
        <RecordInlineEditField name="Name" />
        <RecordInlineEditField name="CloseDate" />
        <RecordInlineEditField name="AccountId" />
        <RecordInlineEditField name="NextStep" />
        <RecordInlineEditField name="Type" />
        <RecordInlineEditField name="StageName" />
        <RecordInlineEditField name="LeadSource" />
        <RecordInlineEditField name="Probability" />
      </RecordInlineEditSection>
      <RecordInlineEditSection title="Additional Information">
        <RecordInlineEditField name="OrderNumber__c" />
        <RecordInlineEditField name="MainCompetitors__c" />
        <RecordInlineEditField name="CurrentGenerators__c" />
        <RecordInlineEditField name="DeliveryInstallationStatus__c" />
        <RecordInlineEditField name="InstallationStart__c" />
        <RecordInlineEditField name="TrackingNumber__c" />
        <RecordInlineEditField name="Description" />
      </RecordInlineEditSection>
    </RecordInlineEdit>
  )
}
```
