# Record header

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/record-header](https://ui.wisty.ai/record-header) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

The top of a record page: its name, key fields and actions. Lightning's highlights panel, for a standard or custom object.

```bash
npx shadcn@latest add @wisty/record-header
```

## Examples

- `default` (Opportunity): An Edge Communications opportunity with Follow, three actions and the rest in a menu, and five compact layout fields formatted by `type`.
- `case` (Case): A case followed by the user, its number as the name, and a datetime field in the `timeZone` given.
- `account` (Account): An account whose Billing Address is one line and whose Last Modified Date is `type="relative"`, counted from the `now` given.
- `partial` (Long name and empty fields): A long name truncates with its full text in `title`, and the close date and amount are `null`, so they show blank.
- `loading` (Loading): With `loading`, the object's label and the field labels stay, and the name, values and actions wait.

## When to use

- At the top of a record page: an opportunity, a case, an account or a custom object's record.
- In place of Lightning's highlights panel: the record's name, Follow, its actions, and the compact layout's fields.
- When the page starts from one record read and the object's compact layout, passed in as plain values.

## When not to use

- For a list of records. Use List view header above a Data table.
- For a page that isn't one record, like a report or a setup page. Use Page header.
- For every field on the record. The header holds the few that identify it. The rest belong in the record's detail section.

## Usage

```tsx
import { RecordHeader } from "@/components/wisty/record-header"
```

```tsx
<RecordHeader
  icon="standard:account"
  objectLabel="Account"
  name="GenePoint"
  fields={[
    { id: "Type", label: "Type", value: "Customer - Channel" },
    { id: "Phone", label: "Phone", value: "(650) 867-3450", type: "phone" },
    {
      id: "AnnualRevenue",
      label: "Annual Revenue",
      value: 30_000_000,
      type: "currency",
    },
  ]}
  actions={[
    { value: "edit", label: "Edit" },
    { value: "new-contact", label: "New Contact" },
  ]}
  onAction={runAction}
/>
```

A field's `type` uses Output field's value types, `address`, `name`, `time` and `relative` included, plus `reference` for a related record, linked through `href`. Values format and link with `locale`, `currency` and `timeZone` through Output field's `formatOutputValue` and `outputValueHref`, the same way the data table and Record detail write them: a URL with no scheme links with `https://`, one with another scheme than http, https, mailto or tel stays text. A field also takes Output field's format and link keys, like `{ type: "date", dateStyle: "short" }` or `{ type: "url", linkLabel: "Visit website", linkTarget: "_blank" }`; its hover title stays the value. The first `visibleActions` actions are buttons; the rest go in the menu at the end of the group. Follow shows when both `following` and `onFollowingChange` are passed, and toggles through `onFollowingChange`.

## Rules

- Pass the compact layout's fields in its order, after the name. Up to six fit in a row, as Lightning shows; which fields are highlights is the org's choice, so take it from the layout, not from this block.
- Pass raw values with a `type`: numbers for amounts and percents (a percent as a fraction), `YYYY-MM-DD` for dates. Never pass formatted strings, which can't follow `locale`.
- Pass `null` for an empty field. It shows blank, as Salesforce shows it. Never pass a dash, "None" or 0.
- An `address` is `{ street, city, state, postalCode, country }` and shows on one line, its parts joined by ", ". A `name` is `{ salutation, firstName, middleName, lastName, suffix }`, in that order. Empty parts drop out; one with no parts shows blank.
- A `relative` value is an instant, shown as "3 hours ago" with its date and time on hover. Pass `now` from the page, or the current time is read at render and a server and a browser render can differ.
- Pass amounts in one currency and set `currency` to match.
- The object icons come from `@salesforce-ux/icons`, a dependency licensed CC BY-ND 4.0: use them unaltered, and credit them.
- Never pass `asChild` or `render`.

## API reference

### RecordHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | ``standard:${string}` \| `custom:${string}` \| `action:${string}` \| `doctype:${string}` \| `utility:${string}`` |  | The object's icon: "standard:opportunity". |
| `objectLabel` | `string` |  | The object's label, singular: "Opportunity". |
| `name` | `string` |  | The record's name. It's the page's h1, and truncates to one line. |
| `fields`? | `RecordHeaderField[]` | `[]` | The compact layout's fields after the name, in order. Up to six fit. |
| `actions`? | `RecordHeaderAction[]` | `[]` | The record's actions, in order. |
| `visibleActions`? | `number` | `3` | How many actions show as buttons; the rest go in the menu. Default 3. |
| `onAction`? | `(action: RecordHeaderAction) => void` |  | Runs with the action that's chosen. |
| `following`? | `boolean` |  | Whether the user follows the record. |
| `onFollowingChange`? | `(following: boolean) => void` |  | Runs with the new state when Follow is pressed; Follow shows only with this and following. |
| `loading`? | `boolean` | `false` | Holds every slot's size with placeholders while the record loads. |
| `currency`? | `string` | `"USD"` | An ISO 4217 code for currency fields. Default "USD". |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for numbers and dates. Default "en-US". |
| `timeZone`? | `string` | `"UTC"` | An IANA time zone for datetime fields. Default "UTC". |
| `now`? | `string \| number \| Date` |  | The instant relative fields count from, as ISO 8601. Defaults to the current time at render. |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### RecordHeaderFieldType

```ts
type RecordHeaderFieldType = OutputFieldType | "reference"
```

### RecordHeaderField

One field from the compact layout, with how its value reads.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` |  | A stable key, like the field's API name: "CloseDate". |
| `label` | `string` |  | The field's label, as the org names it: "Close Date". |
| `value` | `string \| number \| boolean \| OutputFieldAddress \| OutputFieldName \| null` |  | The plain value: a percent as a fraction, a date as YYYY-MM-DD, an instant as ISO 8601; null shows blank. |
| `type`? | `RecordHeaderFieldType` |  | How the value reads. Default "text". |
| `href`? | `string` |  | For a reference, where the related record's name links. |
| `fractionDigits`? | `number` |  | Digits after the decimal point, a field's scale, as both the fewest and the most. Unset, Intl's default. |
| `minimumFractionDigits`? | `number` |  | The fewest digits after the decimal point, over fractionDigits. |
| `maximumFractionDigits`? | `number` |  | The most digits after the decimal point, over fractionDigits; under the minimum, it reads as the minimum. |
| `currencyDisplay`? | `"symbol" \| "code" \| "name"` |  | A currency as its symbol ("$"), its code ("USD") or its name ("US dollars"). Defaults to "symbol". |
| `dateStyle`? | `OutputFieldDateStyle` |  | The day's style in "date" and "datetime" values. Defaults to "medium": "Jun 18, 2026". |
| `timeStyle`? | `OutputFieldDateStyle` |  | The time's style in "datetime" and "time" values. Defaults to "short": "3:30 PM". |
| `hour12`? | `boolean` |  | true for a 12-hour clock, false for 24 hours. Unset, the locale's own clock. |
| `timeZoneName`? | `"short" \| "long"` |  | The zone's name after a "datetime" value, "EDT" or "Eastern Daylight Time". Unset, none. |
| `linkLabel`? | `string` |  | Words the link shows instead of the value, like "Visit website". The value stays its address. |
| `linkTarget`? | `"_blank" \| "_self" \| "_parent" \| "_top"` |  | Where the link opens; "_blank" adds rel="noopener noreferrer". Defaults to the same tab. |
| `linkTitle`? | `string` |  | The link's hover text. |

### RecordHeaderAction

One of the record's actions, as a button or a menu item.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Identifies the action in onAction: "edit", "clone". |
| `label` | `string` |  | The action's name, in title case: "Change Owner". |
| `disabled`? | `boolean` |  | Shows the action but doesn't let it run. |

## Accessibility

- The record's name is the page's h1, so render one record header per page.
- The action group is named for the object ("Opportunity actions"), and the menu trigger is named "More actions".
- Follow is a toggle button: it reads as pressed while the user follows the record.
- While loading, the header is busy and has no heading yet. The field labels stay readable.

## Responsive behavior

- The name stays on one line and truncates, with the full name on hover.
- When the actions don't fit beside the name, they move under it.
- The fields wrap when they don't fit in one row, and go two to a row on a narrow page. A long value truncates, with its full text on hover.

## Example code

### Opportunity

An Edge Communications opportunity with Follow, three actions and the rest in a menu, and five compact layout fields formatted by `type`.

```tsx
"use client"

import { useState } from "react"

import { RecordHeader } from "@/components/wisty/record-header"

export default function RecordHeaderDefault() {
  const [following, setFollowing] = useState(false)
  return (
    <RecordHeader
      icon="standard:opportunity"
      objectLabel="Opportunity"
      name="Edge Emergency Generator"
      fields={[
        {
          id: "AccountId",
          label: "Account Name",
          value: "Edge Communications",
          type: "reference",
          href: "#001-edge-communications",
        },
        {
          id: "CloseDate",
          label: "Close Date",
          value: "2027-01-18",
          type: "date",
        },
        { id: "Amount", label: "Amount", value: 75_000, type: "currency" },
        { id: "StageName", label: "Stage", value: "Id. Decision Makers" },
        {
          id: "OwnerId",
          label: "Opportunity Owner",
          value: "Ellen Hart",
          type: "reference",
          href: "#005-ellen-hart",
        },
      ]}
      actions={[
        { value: "edit", label: "Edit" },
        { value: "new-note", label: "New Note" },
        { value: "clone", label: "Clone" },
        { value: "change-owner", label: "Change Owner" },
        { value: "submit-for-approval", label: "Submit for Approval" },
        { value: "delete", label: "Delete" },
      ]}
      following={following}
      onFollowingChange={setFollowing}
      currency="USD"
      locale="en-US"
      timeZone="America/New_York"
      className="w-full"
    />
  )
}
```

### Case

A case followed by the user, its number as the name, and a datetime field in the `timeZone` given.

```tsx
"use client"

import { useState } from "react"

import { RecordHeader } from "@/components/wisty/record-header"
import { recordHeaderCaseFixture } from "@/components/wisty/record-header-data"

export default function RecordHeaderCase() {
  const [following, setFollowing] = useState(recordHeaderCaseFixture.following)
  return (
    <RecordHeader
      {...recordHeaderCaseFixture}
      following={following}
      onFollowingChange={setFollowing}
      className="w-full"
    />
  )
}
```

### Account

An account whose Billing Address is one line and whose Last Modified Date is `type="relative"`, counted from the `now` given.

```tsx
"use client"

import { useState } from "react"

import { RecordHeader } from "@/components/wisty/record-header"
import { recordHeaderAccountFixture } from "@/components/wisty/record-header-data"

export default function RecordHeaderAccount() {
  const [following, setFollowing] = useState(
    recordHeaderAccountFixture.following
  )
  return (
    <RecordHeader
      {...recordHeaderAccountFixture}
      following={following}
      onFollowingChange={setFollowing}
      className="w-full"
    />
  )
}
```

### Long name and empty fields

A long name truncates with its full text in `title`, and the close date and amount are `null`, so they show blank.

```tsx
"use client"

import { useState } from "react"

import { RecordHeader } from "@/components/wisty/record-header"
import { recordHeaderPartialFixture } from "@/components/wisty/record-header-data"

export default function RecordHeaderPartial() {
  const [following, setFollowing] = useState(
    recordHeaderPartialFixture.following
  )
  return (
    <RecordHeader
      {...recordHeaderPartialFixture}
      following={following}
      onFollowingChange={setFollowing}
      className="w-full"
    />
  )
}
```

### Loading

With `loading`, the object's label and the field labels stay, and the name, values and actions wait.

```tsx
"use client"

import { useState } from "react"

import { RecordHeader } from "@/components/wisty/record-header"
import { recordHeaderFixture } from "@/components/wisty/record-header-data"

export default function RecordHeaderLoading() {
  const [following, setFollowing] = useState(recordHeaderFixture.following)
  return (
    <RecordHeader
      {...recordHeaderFixture}
      following={following}
      onFollowingChange={setFollowing}
      loading
      className="w-full"
    />
  )
}
```
