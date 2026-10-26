# Record form

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/record-form](https://ui.wisty.ai/record-form) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Lightning's New and Edit record form, with required checks and save errors. The app does the saving.

```bash
npx shadcn@latest add @wisty/record-form
```

## Examples

- `default` (New Contact): The contact layout's two sections in two columns: Last Name required, an account lookup, a picklist with help, a checkbox, and Save & New.
- `edit` (Edit Opportunity): An opportunity's values in every control: an amount in `currency`, a percent, a close date, and Description in a one-column section.
- `name-and-address` (Name and address): Edit Contact's compound fields: Name as a salutation picklist and four inputs, and Mailing Address as five labelled parts.
- `event` (New Event): An event's Start and End as datetime fields, each a date and a time, shown on Austin's clock with `timeZone` and submitted as instants.
- `custom-control` (Custom control): A multi-select picklist the page draws with Combobox, joined to the form by `useRecordFormControl`: required check, error focus and the edited state.
- `dialog` (In a dialog): The New Record modal: the form wraps the body and the footer, so the footer's buttons submit it, and Preferred Call Time is a time field.
- `errors` (After a failed save): The app's `errors`: the cleared required name has its message, and a validation rule's message for the record sits above the sections.
- `pending` (Saving): With `pending`, Save shows a spinner and is disabled, so it can't save twice, and every value stays as it was submitted.

## When to use

- To create or edit a Salesforce record: Lightning's New and Edit forms, what `lightning-record-edit-form` and `lightning-record-form` draw.
- When the fields, which are required and the picklist values come from the object's metadata and page layout, and the app saves through `createRecord`, `updateRecord` or the REST API.
- In a New Record modal, or on a page.
- When one field needs a control the form doesn't draw, like a multi-select picklist: write it with `useRecordFormControl` and keep the form's checks, undo and focus.

## When not to use

- To show a record's values without editing them. Use Record detail, or Data table for many records.
- To edit a record's Details tab in place, with a pencil on each field. Use Record inline edit.
- For a form that isn't a record's, like a search or a settings panel. Compose Field with its controls.
- For one field on its own. Use Field with the control, like Lookup or Date picker.

## Usage

```tsx
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
  useRecordFormControl,
} from "@/components/wisty/record-form"
```

```text
RecordForm
├── RecordFormRequiredLegend
├── RecordFormMessages
├── RecordFormSection
│   └── RecordFormField
└── RecordFormFooter (DialogFooter in a dialog)
    └── RecordFormSubmit
```

`fields` describes every field the form can show, keyed by API name; each `RecordFormField` draws one by `name`. Saving is the app's: `onSubmit` gets the values, and the app passes `pending` and a failed save's `errors` back in. After Save & New, change the form's `key` to start again.

```tsx
const [errors, setErrors] = useState<RecordFormErrors>()
const [pending, startSaving] = useTransition()
const [form, setForm] = useState(0)

<RecordForm
  key={form}
  fields={fields}
  pending={pending}
  errors={errors}
  onSubmit={(values, { intent }) =>
    startSaving(async () => {
      const result = await saveContact(values)
      setErrors(result.errors)
      if (!result.errors && intent === "save-and-new") setForm(form + 1)
    })
  }
>
  …
</RecordForm>
```

`highlightChanges` marks each field whose value differs from `defaultValues`, with an undo button that puts the default back, as Lightning's inline edit does. `autoFocusField` names the field whose control takes focus when the form mounts. `onInvalidFields` gets the fields the form's own checks stopped a save for, before focus moves, so a page can open the tab or section that hides one. It runs inside `flushSync`, so a plain `setState` there has shown the field when the form focuses it.

Values are keyed by API name: text, a number, a percent as a fraction (0.6 for 60%), `true` or `false`, a date as `"YYYY-MM-DD"`, a datetime as an ISO 8601 instant (`"2026-06-18T14:00:00.000Z"`), a time as Salesforce's `"HH:mm:ss.SSSZ"` (`"09:30:00.000Z"`), a lookup's record id, an address's or a name's parts, or `null` for an empty field. A lookup's default value is its record (`{ id, name }`), so the field can show the name. In an edit, send `changed`, the second argument's values that differ from `defaultValues`, to `updateRecord`. A number is compared as the field shows it, rounded to its `scale`, so a default of 75000.005 at scale 2 is 75000.01 and isn't changed until someone edits it.

A datetime field is a date and a time on the clock of `timeZone`, an IANA zone that defaults to `"UTC"`. Pass the user's Salesforce time zone (`TimeZoneSidKey`), so an event at `"2026-06-18T14:00:00.000Z"` reads 9:00 AM in `"America/Chicago"`, and what they type saves as the instant it names there. A time field is a time of day with no zone, so `timeZone` never moves it. Both edit hours and minutes.

An address or a name is one field whose value is its parts: `{ street, city, state, postalCode, country }` or `{ salutation, firstName, middleName, lastName, suffix }`. Gather `MailingStreet`, `MailingCity` and the rest into it for `defaultValues`, and spread the submitted object back out to save, since Salesforce saves the parts, not the compound field. `labels` names each part, like "Mailing City":

```tsx
const fields = {
  Name: { label: "Name", type: "name", required: true },
  MailingAddress: {
    label: "Mailing Address",
    type: "address",
    labels: { street: "Mailing Street", city: "Mailing City" },
  },
} satisfies RecordFormFields
```

A field whose control the form doesn't draw takes a custom control as `RecordFormField`'s child. The field keeps its label, help, error and undo, and the control calls `useRecordFormControl` for the rest: `value`, as the form submits it, `onValueChange`, and `controlProps` to spread on the element people type in or pick from, so the label names it and a failed save focuses it. Describe the field in `fields` by the value it holds: `text` for a multi-select picklist's `"English;Spanish"`, so the form's required check and `changed` apply. When the control holds an entry it can't read, pass `onValueChange(null, { error })`; the save stops there with that message. The Custom control example draws this picklist with Combobox:

```tsx
<RecordFormField name="Languages__c">
  <LanguagesPicklist />
</RecordFormField>
```

To lay out a page layout you load at runtime, flatten each section's rows to field names and map them to parts:

```tsx
{
  layout.sections.map((section) => (
    <RecordFormSection
      key={section.id}
      title={section.heading}
      columns={section.columns}
    >
      {section.fieldNames.map((name) => (
        <RecordFormField key={name} name={name} />
      ))}
    </RecordFormSection>
  ))
}
```

## Rules

- Put in `fields` only the fields the form shows. An error for a field the page doesn't draw is listed with the record's errors, under its label, or under its API name when it isn't in `fields`.
- Pass `errors` from state, a new object for each failed save. An edited field hides its error until the next save.
- Leave out a field people can't edit; never pass it to show it disabled.
- Pass `null` for an empty value, never `""` or 0. A percent is a fraction: 0.6 for 60%. Divide a Salesforce percent field's 60 by 100.
- A required address needs every part, and a required name its last name. The asterisk is on the legend, and on Last Name for a name. Each empty part gets its own "Complete this field."; an error from the app for the field shows under the whole group.
- An address or a name submits every part, `null` for an empty one, and counts as changed when any part changed.
- A form never edits a relative time ("3 hours ago"); that's a read-only view of an instant.
- Pass a datetime as an instant, never as a local date and time, and set `timeZone` to the user's time zone. Pass a time as Salesforce returns it; it's never moved by `timeZone`.
- A custom control goes inside `RecordFormField`, which draws its label, error and undo. Spread `controlProps` on the element people focus, and never draw a label of its own.
- Pass a custom control's entry that isn't a value as `onValueChange(null, { error })`, never as a guessed value, so the save stops on it.
- Keep the footer inside `RecordForm`: Save is a submit button, and Save & New submits the form it's in.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `RecordForm` | [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form) |  |
| `RecordFormMessages` | [Alert](https://ui.wisty.ai/alert#api-Alert) | The errors for the whole record, above the sections. Renders nothing without any. |
| `RecordFormRequiredLegend` | [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p) | The legend for the required marker: "* = Required Information". |
| `RecordFormSection` | [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset) | A titled section of fields, in one or two columns. |
| `RecordFormField` | [Field](https://ui.wisty.ai/field#api-Field) | One field by API name, drawn as its type's control, with its label, help and errors. |
| `RecordFormFooter` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | The row of buttons under the sections on a page. In a dialog, use DialogFooter. |
| `RecordFormSubmit` | [Button](https://ui.wisty.ai/button#api-Button) | Save, or Save & New with `intent="save-and-new"`. Shows a spinner while the save it started is pending. Enter in a field always saves. |

### RecordForm

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` | `RecordFormFields` |  | Every field the form can show, keyed by API name. |
| `defaultValues`? | `RecordFormDefaultValues` | `{}` | The record's values. Change the form's `key` to start again, after Save & New. |
| `errors`? | `RecordFormErrors` |  | A failed save's errors. Pass a new object for each save, from state. |
| `pending`? | `boolean` | `false` | The save is running: Save shows a spinner and the buttons are disabled. |
| `onSubmit`? | `( values: RecordFormValues, details: RecordFormSubmitDetails ) => void` |  | Called with valid values when Save or Save & New is pressed. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers and dates. Default "en-US". |
| `currency`? | `string` | `"USD"` | An ISO 4217 code for currency fields. Default "USD". |
| `timeZone`? | `string` | `"UTC"` | An IANA time zone whose clock datetime fields show and are typed in. Default "UTC". |
| `highlightChanges`? | `boolean` | `false` | Marks each field whose value differs from `defaultValues`, with an undo button. Default false. |
| `autoFocusField`? | `string` |  | The API name of the field whose control takes focus when the form mounts. |
| `onInvalidFields`? | `(names: string[]) => void` |  | Called with the fields the form's own checks stopped a save for, in page order, before focus moves. |

### RecordFormMessages

The errors for the whole record, above the sections. Renders nothing without any.

| Prop | Type | Default |
| --- | --- | --- |
| `title`? | `string` | `"We hit a snag."` |

### RecordFormRequiredLegend

The legend for the required marker: "* = Required Information".

| Prop | Type | Default |
| --- | --- | --- |
| `children`? | `ReactNode` | `"Required Information"` |

### RecordFormSection

A titled section of fields, in one or two columns.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` |  | The section's heading, as the page layout names it. |
| `columns`? | `1 \| 2` | `2` | Two columns, dropping to one in a narrow section. Default 2. |

### RecordFormField

One field by API name, drawn as its type's control, with its label, help and errors.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children`? | `React.ReactNode` |  | A custom control that calls useRecordFormControl, never for an address or a name; omit it for the type's own. |
| `name` | `string` |  | The field's API name, a key of the form's `fields`. |
| `undoLabel`? | `string` | `"Undo"` | The word before the field's label in the undo button's name. Default "Undo". |
| `layout`? | `"stacked" \| "horizontal" \| "auto"` | `"auto"` |  |

### RecordFormSubmit

Save, or Save & New with `intent="save-and-new"`. Shows a spinner while the save it started is pending. Enter in a field always saves.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `intent`? | `RecordFormIntent` | `"save"` | Which save the button starts. Default "save". |

### useRecordFormControl

Joins a custom control to its RecordFormField: the form's checks, changes, undo and focus.

Returns `RecordFormControl`.

### RecordFormOption

A picklist value and its label.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | What's stored. |
| `label` | `string` |  | What's shown. |

### RecordFormFieldDescription

How a field is drawn, read and edited: Record detail's description, with what editing needs.

```ts
type RecordFormFieldDescription =
  | (Described<"text" | "email" | "phone" | "url" | "textarea"> & {
      required?: boolean
      maxLength?: number
    })
  | (Described<"number" | "currency" | "percent"> & {
      required?: boolean
    })
  | (Described<"date"> & {
      required?: boolean
      min?: string
      max?: string
    })
  | (Described<"datetime" | "time"> & {
      required?: boolean
    })
  | (Described<"picklist"> & {
      required?: boolean
    })
  | Described<"boolean">
  | (Described<"address"> & {
      required?: boolean
      labels?: Partial<Record<RecordFormAddressPart, string>>
    })
  | (Described<"name"> & {
      required?: boolean
      salutations?: readonly RecordFormOption[]
      labels?: Partial<Record<RecordFormNamePart, string>>
    })
  | (Described<"lookup"> & {
      required?: boolean
      onSearch?: LookupSearch
      icon?: LookupIcon
      placeholder?: string
    })
```

### RecordFormFieldType

A field's type; never "relative", which only a read-only view shows.

```ts
type RecordFormFieldType = RecordFormFieldDescription["type"]
```

### RecordFormFields

The fields on the form, keyed by API name.

```ts
type RecordFormFields = Record<string, RecordFormFieldDescription>
```

### RecordFormValue

A submitted value: null when empty, a lookup's record id, a percent as a fraction, a datetime as an ISO 8601 instant, a time as "HH:mm:ss.SSSZ", a compound field's parts.

```ts
type RecordFormValue =
  | string
  | number
  | boolean
  | RecordFormAddressValue
  | RecordFormNameValue
  | null
```

### RecordFormValues

```ts
type RecordFormValues = Record<string, RecordFormValue>
```

### RecordFormDefaultValues

The record's values, keyed by API name: a lookup's is its record, a compound field's its parts.

```ts
type RecordFormDefaultValues = RecordDetailValues
```

### RecordFormIntent

```ts
type RecordFormIntent = "save" | "save-and-new"
```

### RecordFormSubmitDetails

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `intent` | `RecordFormIntent` |  | The button that saved: Save, or Save & New. |
| `changed` | `RecordFormValues` |  | The values that differ from defaultValues, as updateRecord takes them. |

### RecordFormErrors

A failed save's errors, as the app returns them.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `form`? | `string \| readonly string[]` |  | Errors for the whole record, like a validation rule's. |
| `fields`? | `Record<string, string \| readonly string[]>` |  | Errors per field, keyed by API name. |

### RecordFormControl

What a custom control inside RecordFormField reads and calls.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `RecordFormValue` |  | The value as the form submits it: null when empty, a lookup's id, a percent as a fraction. |
| `onValueChange` | `(value: RecordFormValue, details?: { error?: string }) => void` |  | Sets the value; pass `error` with `null` while the entry isn't a value, and a save stops on it. |
| `controlProps` | `{ id: string "aria-required": true \| undefined "aria-invalid": true \| undefined "aria-describedby": string \| undefined }` |  | Spread on the element people focus, so the label names it and a failed save focuses it. |

## SLDS mapping

- `RecordFormSection` is a static `slds-section__title` bar in `slds-theme_shade`, its title the size of Expandable section's, over an `slds-form` of `slds-form__row` rows and `slds-form__item` items, as a `fieldset` with the title as its legend.
- `RecordFormField` is a stacked form element (`slds-form-element_stacked`) with the control for its type: Input for text, email, phone and url, Textarea, Input group with the currency symbol or % for numbers, Date picker, Time picker, Select for a picklist, Lookup, and Checkbox under its label.
- A datetime is Datetime picker's compound form element: a FieldSet whose FieldLegend is the field's label, over the date picker and the timepicker (`slds-timepicker`) side by side, each with its own label.
- An address or a name is a compound form element (`slds-form-element_compound`, with `slds-form-element_address` for an address): a FieldSet whose FieldLegend is `slds-form-element__legend`, over `slds-form-element__row` rows of labelled parts. An address's street is a Textarea across, then City beside State/Province and Zip/Postal Code beside Country, four sixths and two. A name's salutation is a Select beside First Name, then Middle Name, then Last Name beside Suffix.
- A required field's label starts with `slds-required`, and `RecordFormRequiredLegend` is SLDS's legend for it. Help text is `slds-form-element__icon`'s `utility:info` button with a tooltip, as `lightning-helptext` draws it.
- `RecordFormMessages` is an error Alert (`slds-theme_error`). Each field's error is its Field's error.
- With `highlightChanges`, a changed field is `slds-is-edited`, with `slds-form-element__undo`'s `utility:undo` button at the end of its label's line.
- `RecordFormSubmit` is a brand button for Save and a neutral one for Save & New, with Spinner inside while the save runs.

Known gaps:

- No multi-select picklist, rich text or geolocation fields. Draw a scalar one with `useRecordFormControl`; an address, a name or a datetime takes no custom control.
- A datetime or a time edits hours and minutes. An untouched datetime submits its stored instant as it was. A time's stored seconds are dropped from what the form submits, though an untouched field isn't in `changed`.
- An address's parts and order are Salesforce's default (en-US) for every country, with free-text state and country; Lightning's country formats and state and country picklists aren't drawn. A name always shows all five parts, where an org without middle names and suffixes shows three.
- Sections don't collapse.
- No read-only fields in edit mode: leave out what people can't edit. Record inline edit draws them beside the form's fields.
- No error popover in the footer ("We hit a snag." next to the buttons). The record's errors show above the sections, as `lightning-messages` does.
- A number shows as typed, with the symbol beside it, where Lightning formats it when the field loses focus.

## Keyboard interactions

| Key                              | Action                                                                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Enter in a field                 | Saves, as Save does, even in a form with Save & New. In a lookup or picklist with its list open, Enter picks the option instead. |
| Escape in a lookup, date or time | Closes its list or calendar first. In a dialog, a second Escape closes the dialog.                                               |

## Accessibility

- Every control is named by its label, and each section is a group named by its title.
- An address or a name is a group named by its legend, so a part reads as "Mailing Address, Mailing City". A failed save focuses the first empty required part.
- A datetime is a group named by its label, and its halves are named after it, "Start Date" and "Start Time". A failed save focuses the half that's empty or can't be read, or the date when both are empty.
- A required field's control is `required` (a picklist's is `aria-required`). The asterisk is part of its label.
- An invalid field's control is `aria-invalid` and described by its error.
- A save that fails moves focus to the first field with an error, or to the record's errors when none belongs to a field on the page. Errors the form opens with don't take focus.
- A custom control is named by its field's label, required and invalid through `controlProps`, as long as the control spreads them on the element people focus.
- A field's help text is its help button's accessible description, so it's announced without opening the tooltip.
- An undo button is named "Undo" and the field's label, like "Undo Amount". It goes away once pressed, so focus moves to the field's control.
- While `pending`, the form is `aria-busy`, and the button that started the save holds a spinner named "Loading".

## Responsive behavior

- A two-column section drops to one column when each would be narrower than 280px, by the section's own width, so it fits a narrow panel or modal.
- Labels follow Salesforce's display density: above the controls, and beside them from a 48rem screen when the page is compact (`data-density="compact"` on `<html>`). A field's `layout` (`"stacked"` or `"horizontal"`) fixes it for that field.

## Example code

### New Contact

The contact layout's two sections in two columns: Last Name required, an account lookup, a picklist with help, a checkbox, and Save & New.

```tsx
import { Button } from "@/components/ui/button"
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
} from "@/components/wisty/record-form"
import { recordFormContactFields } from "@/components/wisty/record-form-data"

export default function RecordFormDefault() {
  return (
    <RecordForm fields={recordFormContactFields} className="w-full max-w-3xl">
      <RecordFormRequiredLegend />
      <RecordFormMessages />
      <RecordFormSection title="Contact Information">
        <RecordFormField name="FirstName" />
        <RecordFormField name="LastName" />
        <RecordFormField name="AccountId" />
        <RecordFormField name="Title" />
        <RecordFormField name="Email" />
        <RecordFormField name="Phone" />
      </RecordFormSection>
      <RecordFormSection title="Additional Information">
        <RecordFormField name="LeadSource" />
        <RecordFormField name="DoNotCall" />
      </RecordFormSection>
      <RecordFormFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <RecordFormSubmit intent="save-and-new">
          Save &amp; New
        </RecordFormSubmit>
        <RecordFormSubmit>Save</RecordFormSubmit>
      </RecordFormFooter>
    </RecordForm>
  )
}
```

### Edit Opportunity

An opportunity's values in every control: an amount in `currency`, a percent, a close date, and Description in a one-column section.

```tsx
import { Button } from "@/components/ui/button"
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
} from "@/components/wisty/record-form"
import {
  recordFormOpportunity,
  recordFormOpportunityFields,
} from "@/components/wisty/record-form-data"

export default function RecordFormEdit() {
  return (
    <RecordForm
      fields={recordFormOpportunityFields}
      defaultValues={recordFormOpportunity}
      locale="en-US"
      currency="USD"
      className="w-full max-w-3xl"
    >
      <RecordFormRequiredLegend />
      <RecordFormMessages />
      <RecordFormSection title="Opportunity Information">
        <RecordFormField name="Name" />
        <RecordFormField name="AccountId" />
        <RecordFormField name="CloseDate" />
        <RecordFormField name="StageName" />
        <RecordFormField name="Amount" />
        <RecordFormField name="Probability" />
        <RecordFormField name="NextStep" />
      </RecordFormSection>
      <RecordFormSection title="Description Information" columns={1}>
        <RecordFormField name="Description" />
      </RecordFormSection>
      <RecordFormFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <RecordFormSubmit>Save</RecordFormSubmit>
      </RecordFormFooter>
    </RecordForm>
  )
}
```

### Name and address

Edit Contact's compound fields: Name as a salutation picklist and four inputs, and Mailing Address as five labelled parts.

```tsx
import { Button } from "@/components/ui/button"
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
} from "@/components/wisty/record-form"
import {
  recordFormContact,
  recordFormContactNameFields,
} from "@/components/wisty/record-form-data"

export default function RecordFormNameAndAddress() {
  return (
    <RecordForm
      fields={recordFormContactNameFields}
      defaultValues={recordFormContact}
      className="w-full max-w-3xl"
    >
      <RecordFormRequiredLegend />
      <RecordFormMessages />
      <RecordFormSection title="Contact Information">
        <RecordFormField name="Name" />
        <RecordFormField name="AccountId" />
        <RecordFormField name="Title" />
        <RecordFormField name="Email" />
      </RecordFormSection>
      <RecordFormSection title="Address Information">
        <RecordFormField name="MailingAddress" />
      </RecordFormSection>
      <RecordFormFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <RecordFormSubmit>Save</RecordFormSubmit>
      </RecordFormFooter>
    </RecordForm>
  )
}
```

### New Event

An event's Start and End as datetime fields, each a date and a time, shown on Austin's clock with `timeZone` and submitted as instants.

```tsx
import { Button } from "@/components/ui/button"
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
} from "@/components/wisty/record-form"
import {
  recordFormEvent,
  recordFormEventFields,
} from "@/components/wisty/record-form-data"

export default function RecordFormEvent() {
  return (
    <RecordForm
      fields={recordFormEventFields}
      defaultValues={recordFormEvent}
      timeZone="America/Chicago"
      className="w-full max-w-3xl"
    >
      <RecordFormRequiredLegend />
      <RecordFormMessages />
      <RecordFormSection title="Calendar Details">
        <RecordFormField name="Subject" />
        <RecordFormField name="Location" />
        <RecordFormField name="StartDateTime" />
        <RecordFormField name="EndDateTime" />
      </RecordFormSection>
      <RecordFormSection title="Description Information" columns={1}>
        <RecordFormField name="Description" />
      </RecordFormSection>
      <RecordFormFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <RecordFormSubmit>Save</RecordFormSubmit>
      </RecordFormFooter>
    </RecordForm>
  )
}
```

### Custom control

A multi-select picklist the page draws with Combobox, joined to the form by `useRecordFormControl`: required check, error focus and the edited state.

```tsx
"use client"

import { Fragment } from "react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
  useRecordFormControl,
  type RecordFormFields,
} from "@/components/wisty/record-form"
import { recordFormContactFields } from "@/components/wisty/record-form-data"

const fields = {
  ...recordFormContactFields,
  Languages__c: { label: "Languages", type: "text", required: true },
} satisfies RecordFormFields

const languages = [
  "English",
  "French",
  "German",
  "Japanese",
  "Portuguese",
  "Spanish",
]

function LanguagesPicklist() {
  const { value, onValueChange, controlProps } = useRecordFormControl()
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      multiple
      items={languages}
      value={typeof value === "string" ? value.split(";") : []}
      onValueChange={(next: string[]) => onValueChange(next.join(";") || null)}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <Fragment>
              {values.map((language) => (
                <ComboboxChip key={language}>{language}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                {...controlProps}
                placeholder="Add languages..."
              />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No languages found.</ComboboxEmpty>
        <ComboboxList>
          {(language: string) => (
            <ComboboxItem key={language} value={language}>
              {language}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function RecordFormCustomControl() {
  return (
    <RecordForm
      fields={fields}
      defaultValues={{
        FirstName: "Rose",
        LastName: "Gonzalez",
        Email: "rose@edge.example",
        Languages__c: "English;Spanish",
      }}
      highlightChanges
      className="w-full max-w-3xl"
    >
      <RecordFormRequiredLegend />
      <RecordFormMessages />
      <RecordFormSection title="Contact Information">
        <RecordFormField name="FirstName" />
        <RecordFormField name="LastName" />
        <RecordFormField name="Email" />
        <RecordFormField name="Languages__c">
          <LanguagesPicklist />
        </RecordFormField>
      </RecordFormSection>
      <RecordFormFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <RecordFormSubmit>Save</RecordFormSubmit>
      </RecordFormFooter>
    </RecordForm>
  )
}
```

### In a dialog

The New Record modal: the form wraps the body and the footer, so the footer's buttons submit it, and Preferred Call Time is a time field.

```tsx
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  RecordForm,
  RecordFormField,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
} from "@/components/wisty/record-form"
import { recordFormContactFields } from "@/components/wisty/record-form-data"

export default function RecordFormDialog() {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        New Contact
      </DialogTrigger>
      <DialogContent className="sm:max-w-300 md:w-[70%] md:min-w-160">
        <DialogHeader>
          <DialogTitle>New Contact</DialogTitle>
        </DialogHeader>
        <RecordForm fields={recordFormContactFields} className="contents">
          <div
            role="region"
            aria-label="Contact details"
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region must be reachable by keyboard.
            tabIndex={0}
            className="-mx-4 -my-1 flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-4 py-1"
          >
            <RecordFormRequiredLegend />
            <RecordFormMessages />
            <RecordFormSection title="Contact Information">
              <RecordFormField name="FirstName" />
              <RecordFormField name="LastName" />
              <RecordFormField name="AccountId" />
              <RecordFormField name="Title" />
              <RecordFormField name="Email" />
              <RecordFormField name="Phone" />
            </RecordFormSection>
            <RecordFormSection title="Additional Information">
              <RecordFormField name="LeadSource" />
              <RecordFormField name="DoNotCall" />
              <RecordFormField name="PreferredCallTime__c" />
            </RecordFormSection>
          </div>
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: "outline" })}>
              Cancel
            </DialogClose>
            <RecordFormSubmit intent="save-and-new">
              Save &amp; New
            </RecordFormSubmit>
            <RecordFormSubmit>Save</RecordFormSubmit>
          </DialogFooter>
        </RecordForm>
      </DialogContent>
    </Dialog>
  )
}
```

### After a failed save

The app's `errors`: the cleared required name has its message, and a validation rule's message for the record sits above the sections.

```tsx
import { Button } from "@/components/ui/button"
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
} from "@/components/wisty/record-form"
import {
  recordFormOpportunityErrors,
  recordFormOpportunityFailed,
  recordFormOpportunityFields,
} from "@/components/wisty/record-form-data"

export default function RecordFormErrors() {
  return (
    <RecordForm
      fields={recordFormOpportunityFields}
      defaultValues={recordFormOpportunityFailed}
      errors={recordFormOpportunityErrors}
      locale="en-US"
      currency="USD"
      className="w-full max-w-3xl"
    >
      <RecordFormRequiredLegend />
      <RecordFormMessages />
      <RecordFormSection title="Opportunity Information">
        <RecordFormField name="Name" />
        <RecordFormField name="AccountId" />
        <RecordFormField name="CloseDate" />
        <RecordFormField name="StageName" />
        <RecordFormField name="Amount" />
        <RecordFormField name="Probability" />
        <RecordFormField name="NextStep" />
      </RecordFormSection>
      <RecordFormSection title="Description Information" columns={1}>
        <RecordFormField name="Description" />
      </RecordFormSection>
      <RecordFormFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <RecordFormSubmit>Save</RecordFormSubmit>
      </RecordFormFooter>
    </RecordForm>
  )
}
```

### Saving

With `pending`, Save shows a spinner and is disabled, so it can't save twice, and every value stays as it was submitted.

```tsx
import { Button } from "@/components/ui/button"
import {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
} from "@/components/wisty/record-form"
import {
  recordFormOpportunity,
  recordFormOpportunityFields,
} from "@/components/wisty/record-form-data"

export default function RecordFormPending() {
  return (
    <RecordForm
      fields={recordFormOpportunityFields}
      defaultValues={recordFormOpportunity}
      pending
      locale="en-US"
      currency="USD"
      className="w-full max-w-3xl"
    >
      <RecordFormRequiredLegend />
      <RecordFormMessages />
      <RecordFormSection title="Opportunity Information">
        <RecordFormField name="Name" />
        <RecordFormField name="AccountId" />
        <RecordFormField name="CloseDate" />
        <RecordFormField name="StageName" />
        <RecordFormField name="Amount" />
        <RecordFormField name="Probability" />
        <RecordFormField name="NextStep" />
      </RecordFormSection>
      <RecordFormSection title="Description Information" columns={1}>
        <RecordFormField name="Description" />
      </RecordFormSection>
      <RecordFormFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <RecordFormSubmit>Save</RecordFormSubmit>
      </RecordFormFooter>
    </RecordForm>
  )
}
```
