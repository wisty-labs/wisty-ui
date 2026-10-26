# Record detail

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/record-detail](https://ui.wisty.ai/record-detail) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A record's Details tab, read-only, for a standard or custom object. Same field descriptions as Record form and Record inline edit.

```bash
npx shadcn@latest add @wisty/record-detail
```

## Examples

- `default` (Opportunity details): An opportunity's Opportunity Information and Additional Information in two columns, with a pencil on each field `onEdit` lets people change.
- `account` (Account with addresses): An account's Billing and Shipping Address on their lines, a missing country left out, and Last Modified Date as `type="relative"` from a fixed `now`.
- `one-column` (One column): The same record with `columns={1}` and `layout="horizontal"`, labels beside values, as for a narrow region or compact density.
- `loading` (Loading): With `loading` and no values yet, the labels stay and each value is a placeholder until the record arrives.
- `empty` (Empty fields): A new opportunity whose Amount, Next Step, Type and Lead Source are `null`: they render blank, as an empty field does.

## When to use

- A record page's Details tab: the fields of one record in the page layout's sections, the way Lightning's record detail shows an opportunity, an account or a custom object's record.
- A pencil on each field opens an edit elsewhere, like a modal with Record form. `onEdit` says which field was pressed.
- The same field descriptions serve Record form and Record inline edit, so one set covers view, edit and inline edit.

## When not to use

- One field, or your own arrangement of fields. Use Output field.
- People edit the fields in place, with Cancel and Save at the bottom. Use Record inline edit.
- People create or edit the record in a form. Use Record form.
- Many records side by side. Use Data table.

## Usage

```tsx
import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
```

```text
RecordDetail
└── RecordDetailSection
    └── RecordDetailField
```

`fields` describes every field, keyed by API name: its label, type and help, with `editable: false` for a field people can't change and `href` for a lookup's link. A description also takes the Output field format keys its type reads: `scale`, `minimumFractionDigits` and `maximumFractionDigits` on a number, plus `currencyDisplay` on a currency, `dateStyle` on a date, the date and time styles, `hour12` and `timeZoneName` on a datetime, and `linkLabel`, `linkTarget` and `linkTitle` on an email, phone or URL. Record form and Record inline edit take the same descriptions, with what editing needs added. `values` is the record. Each `RecordDetailField` draws one field by `name`, its value formatted by the field's type.

```tsx
<RecordDetail
  fields={{
    Name: { label: "Account Name", type: "text" },
    OwnerId: {
      label: "Account Owner",
      type: "lookup",
      href: (record) => `/users/${record.id}`,
      editable: false,
    },
    AnnualRevenue: { label: "Annual Revenue", type: "currency", scale: 0 },
    LastModifiedDate: {
      label: "Last Modified Date",
      type: "relative",
      editable: false,
    },
  }}
  values={{
    Name: "Edge Communications",
    OwnerId: { id: "005Dn00000EllenH", name: "Ellen Hart" },
    AnnualRevenue: 139000000,
    LastModifiedDate: "2026-10-13T12:00:00Z",
  }}
  now={now}
  onEdit={(name) => openEditForm(name)}
>
  <RecordDetailSection title="Account Information">
    <RecordDetailField name="Name" />
    <RecordDetailField name="OwnerId" />
    <RecordDetailField name="AnnualRevenue" />
  </RecordDetailSection>
  <RecordDetailSection title="System Information" defaultOpen={false}>
    <RecordDetailField name="LastModifiedDate" />
  </RecordDetailSection>
</RecordDetail>
```

Fields fill each row left to right, then down, as a page layout's rows do. To lay out a page layout loaded at runtime, map its sections to `RecordDetailSection` and their field names to `RecordDetailField`, as Record form's Usage does.

## Rules

- Name only fields in `fields`; a name that isn't there throws. Leave out a field the user can't read rather than passing it as `null`.
- `null` is an empty field and renders blank. Never pass 0, a dash or "None" for it.
- A percent is a fraction: divide a Salesforce percent field's value by 100. A date is a day (`"2026-11-20"`), a datetime an instant. A lookup's value is its record (`{ id, name }`).
- Pass `scale` from the field's definition, so whole-dollar fields don't show cents. An explicit `minimumFractionDigits` or `maximumFractionDigits` wins over it on its end.
- An `address` is `{ street, city, state, postalCode, country }` and shows on its lines: the street, then "City, State PostalCode", then the country, a missing part dropping out with its comma. A `name` is `{ salutation, firstName, middleName, lastName, suffix }` on one line. Both follow Salesforce's en-US order for every country and locale. One with no parts renders blank.
- A `relative` field must be `editable: false`. A `datetime` value is an instant, shown in `timeZone`; a `time` value is a time of day as Salesforce returns it (`"09:30:00.000Z"`), never moved by `timeZone`. A `relative` value is an instant: pass `now`, one value for the page, so the text stays the same between the server and the browser.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `RecordDetail` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | A record's fields, read-only, in the page layout's collapsible sections. |
| `RecordDetailSection` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | A collapsible section of the page layout. |
| `RecordDetailField` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | One field by API name: its label and formatted value, with a pencil when `onEdit` is set. |

### RecordDetail

A record's fields, read-only, in the page layout's collapsible sections.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` | `RecordDetailFields` |  | Every field the layout can show, keyed by API name. |
| `values`? | `RecordDetailValues` | `{}` | The record's values, keyed by API name. A missing or null value shows blank. |
| `columns`? | `1 \| 2` | `2` | Fields per row. Default 2. Two columns fall to one in a narrow container. |
| `layout`? | `"auto" \| "stacked" \| "horizontal"` | `"auto"` | Label above the value, or beside it from a 48rem screen. Default "auto": beside it when the page is compact (`data-density="compact"`), above it otherwise. |
| `loading`? | `boolean` | `false` | Holds every value's place while the record loads. Without children, draws placeholder fields. |
| `headingLevel`? | `2 \| 3 \| 4` | `2` | The level of each section's heading. Default 2, under a record page's h1. |
| `onEdit`? | `(name: string) => void` |  | Called with the field's API name when its pencil is pressed. Without it, no pencils show. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers and dates. Default "en-US". |
| `currency`? | `string` | `"USD"` | An ISO 4217 code for currency fields. Default "USD". |
| `timeZone`? | `string` | `"UTC"` | An IANA time zone for datetime fields. Default "UTC". |
| `now`? | `string \| number \| Date` |  | The instant relative fields count from, as ISO 8601. Defaults to the current time at render. |

### RecordDetailSection

A collapsible section of the page layout.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` |  | The section's heading, as the page layout names it. |
| `defaultOpen`? | `boolean` | `true` | Whether the section starts open, uncontrolled. Default true. |
| `open`? | `boolean` |  | Whether the section is open, controlled. |
| `onOpenChange`? | `(open: boolean) => void` |  | Called when the toggle opens or closes the section. |
| `columns`? | `1 \| 2` |  | Fields per row, over the root's `columns`. |

### RecordDetailField

One field by API name: its label and formatted value, with a pencil when `onEdit` is set.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children`? | `React.ReactNode` |  | Drawn after the value and its pencil, like a lock on a field people can't edit. |
| `name` | `string` |  | The field's API name, a key of the root's `fields`. |

### RecordDetailOption

A picklist value and its label.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | What's stored. |
| `label` | `string` |  | What's shown. |

### RecordDetailFieldDescription

What a field is and how it reads; Record form's description extends it for editing.

```ts
type RecordDetailFieldDescription = RecordDetailFieldBase &
  (
    | { type: "text" | "textarea" }
    | ({ type: "email" | "phone" | "url" } & OutputFieldLinkOptions)
    | ({ type: "number" | "percent" } & RecordDetailDigits)
    | ({ type: "currency" } & RecordDetailDigits &
        Pick<OutputFieldStyleOptions, "currencyDisplay">)
    | ({
        type: "date"
      } & Pick<OutputFieldStyleOptions, "dateStyle">)
    | {
        type: "picklist"
        options: readonly RecordDetailOption[]
      }
    | { type: "boolean" }
    | {
        type: "address"
      }
    | {
        type: "name"
      }
    | {
        type: "lookup"
        records?: readonly LookupRecord[]
        href?: (record: LookupRecord) => string | undefined
      }
    | ({
        type: "datetime"
      } & Pick<
        OutputFieldStyleOptions,
        "dateStyle" | "timeStyle" | "hour12" | "timeZoneName"
      >)
    | ({
        type: "time"
      } & Pick<OutputFieldStyleOptions, "timeStyle" | "hour12">)
    | ({
        type: "relative"
        editable: false
      } & Pick<OutputFieldStyleOptions, "dateStyle" | "timeStyle" | "hour12">)
  )
```

### RecordDetailValues

The record's values, keyed by API name: a lookup's is its record, a compound field's its parts, an instant ISO 8601.

```ts
type RecordDetailValues = Record<
  string,
  | string
  | number
  | boolean
  | LookupRecord
  | OutputFieldAddress
  | OutputFieldName
  | null
  | undefined
>
```

### RecordDetailFields

The record's fields, keyed by API name.

```ts
type RecordDetailFields = Record<string, RecordDetailFieldDescription>
```

## Accessibility

- Each section's title is a heading with the toggle inside it: `h2` by default, for a record page whose header is the `h1`. Under another heading, set `headingLevel` one level below it.
- Each section's fields are a list, one item per field, and each field is a group named by its label. A pencil is named after its field, like "Edit Amount".
- While loading, the block is busy and every value is a placeholder.

## Responsive behavior

- Two columns need about 584px. In a narrower container the fields stack in one column, in the same order.
- Labels follow Salesforce's display density by default (`layout="auto"`): above the values, and beside them when the page is compact (`data-density="compact"` on `<html>`). `layout="stacked"` or `"horizontal"` fixes it for one block.
- Beside means from a 48rem screen, whatever the block's own width; below that they stack.

## Example code

### Opportunity details

An opportunity's Opportunity Information and Additional Information in two columns, with a pencil on each field `onEdit` lets people change.

```tsx
"use client"

import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
import {
  recordDetailOpportunity,
  recordDetailOpportunityFields,
} from "@/components/wisty/record-detail-data"

export default function RecordDetailDefault() {
  return (
    <RecordDetail
      fields={recordDetailOpportunityFields}
      values={recordDetailOpportunity}
      className="w-full max-w-3xl"
      onEdit={(name) => console.info(`Edit ${name}`)}
    >
      <RecordDetailSection title="Opportunity Information">
        <RecordDetailField name="OwnerId" />
        <RecordDetailField name="Amount" />
        <RecordDetailField name="IsPrivate" />
        <RecordDetailField name="ExpectedRevenue" />
        <RecordDetailField name="Name" />
        <RecordDetailField name="CloseDate" />
        <RecordDetailField name="AccountId" />
        <RecordDetailField name="NextStep" />
        <RecordDetailField name="Type" />
        <RecordDetailField name="StageName" />
        <RecordDetailField name="LeadSource" />
        <RecordDetailField name="Probability" />
      </RecordDetailSection>
      <RecordDetailSection title="Additional Information">
        <RecordDetailField name="OrderNumber__c" />
        <RecordDetailField name="MainCompetitors__c" />
        <RecordDetailField name="CurrentGenerators__c" />
        <RecordDetailField name="DeliveryInstallationStatus__c" />
        <RecordDetailField name="TrackingNumber__c" />
        <RecordDetailField name="Description" />
      </RecordDetailSection>
    </RecordDetail>
  )
}
```

### Account with addresses

An account's Billing and Shipping Address on their lines, a missing country left out, and Last Modified Date as `type="relative"` from a fixed `now`.

```tsx
"use client"

import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
import {
  recordDetailAccount,
  recordDetailAccountFields,
} from "@/components/wisty/record-detail-data"

export default function RecordDetailAccount() {
  return (
    <RecordDetail
      fields={recordDetailAccountFields}
      values={recordDetailAccount}
      now="2026-10-13T15:00:00Z"
      timeZone="America/New_York"
      className="w-full max-w-3xl"
      onEdit={(name) => console.info(`Edit ${name}`)}
    >
      <RecordDetailSection title="Account Information">
        <RecordDetailField name="OwnerId" />
        <RecordDetailField name="Phone" />
        <RecordDetailField name="Name" />
        <RecordDetailField name="Website" />
        <RecordDetailField name="Type" />
        <RecordDetailField name="AnnualRevenue" />
      </RecordDetailSection>
      <RecordDetailSection title="Address Information">
        <RecordDetailField name="BillingAddress" />
        <RecordDetailField name="ShippingAddress" />
      </RecordDetailSection>
      <RecordDetailSection title="System Information">
        <RecordDetailField name="LastModifiedDate" />
        <RecordDetailField name="CreatedDate" />
      </RecordDetailSection>
    </RecordDetail>
  )
}
```

### One column

The same record with `columns={1}` and `layout="horizontal"`, labels beside values, as for a narrow region or compact density.

```tsx
"use client"

import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
import {
  recordDetailOpportunity,
  recordDetailOpportunityFields,
} from "@/components/wisty/record-detail-data"

export default function RecordDetailOneColumn() {
  return (
    <RecordDetail
      fields={recordDetailOpportunityFields}
      values={recordDetailOpportunity}
      columns={1}
      layout="horizontal"
      className="w-full max-w-xl"
      onEdit={(name) => console.info(`Edit ${name}`)}
    >
      <RecordDetailSection title="Opportunity Information">
        <RecordDetailField name="OwnerId" />
        <RecordDetailField name="Amount" />
        <RecordDetailField name="IsPrivate" />
        <RecordDetailField name="ExpectedRevenue" />
        <RecordDetailField name="Name" />
        <RecordDetailField name="CloseDate" />
        <RecordDetailField name="AccountId" />
        <RecordDetailField name="NextStep" />
        <RecordDetailField name="Type" />
        <RecordDetailField name="StageName" />
        <RecordDetailField name="LeadSource" />
        <RecordDetailField name="Probability" />
      </RecordDetailSection>
      <RecordDetailSection title="Additional Information">
        <RecordDetailField name="OrderNumber__c" />
        <RecordDetailField name="MainCompetitors__c" />
        <RecordDetailField name="CurrentGenerators__c" />
        <RecordDetailField name="DeliveryInstallationStatus__c" />
        <RecordDetailField name="TrackingNumber__c" />
        <RecordDetailField name="Description" />
      </RecordDetailSection>
    </RecordDetail>
  )
}
```

### Loading

With `loading` and no values yet, the labels stay and each value is a placeholder until the record arrives.

```tsx
"use client"

import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
import { recordDetailOpportunityFields } from "@/components/wisty/record-detail-data"

export default function RecordDetailLoading() {
  return (
    <RecordDetail
      fields={recordDetailOpportunityFields}
      loading
      className="w-full max-w-3xl"
    >
      <RecordDetailSection title="Opportunity Information">
        <RecordDetailField name="OwnerId" />
        <RecordDetailField name="Amount" />
        <RecordDetailField name="Name" />
        <RecordDetailField name="CloseDate" />
        <RecordDetailField name="AccountId" />
        <RecordDetailField name="StageName" />
      </RecordDetailSection>
    </RecordDetail>
  )
}
```

### Empty fields

A new opportunity whose Amount, Next Step, Type and Lead Source are `null`: they render blank, as an empty field does.

```tsx
"use client"

import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
import {
  recordDetailNewOpportunity,
  recordDetailOpportunityFields,
} from "@/components/wisty/record-detail-data"

export default function RecordDetailEmpty() {
  return (
    <RecordDetail
      fields={recordDetailOpportunityFields}
      values={recordDetailNewOpportunity}
      className="w-full max-w-3xl"
      onEdit={(name) => console.info(`Edit ${name}`)}
    >
      <RecordDetailSection title="Opportunity Information">
        <RecordDetailField name="OwnerId" />
        <RecordDetailField name="Amount" />
        <RecordDetailField name="Name" />
        <RecordDetailField name="CloseDate" />
        <RecordDetailField name="AccountId" />
        <RecordDetailField name="NextStep" />
        <RecordDetailField name="Type" />
        <RecordDetailField name="StageName" />
        <RecordDetailField name="LeadSource" />
      </RecordDetailSection>
    </RecordDetail>
  )
}
```
