# Output field

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/output-field](https://ui.wisty.ai/output-field) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a field's label and formatted value read-only, with an edit pencil.

```bash
npx shadcn@latest add @wisty/output-field
```

## Examples

- `default` (Annual Revenue): One currency field with `fractionDigits={0}`, as the field's scale has no cents, and the pencil `OutputFieldEdit` adds for inline edit.
- `types` (Value types): A lead's email, phone and website as links, a date, a date and time in its `timeZone`, and two checkboxes for true and false.
- `numbers` (Numbers): An amount by its code with `currencyDisplay`, decimals bounded by `minimumFractionDigits` and `maximumFractionDigits`, and 18 digits passed as a string.
- `dates` (Date styles): Days in the four `dateStyle` values from short to full, an instant on a 24-hour clock with `hour12={false}`, and one with its zone from `timeZoneName`.
- `time` (Time): Times of day as `type="time"`: the short style, a 24-hour clock with `hour12={false}`, and seconds with `timeStyle="medium"`.
- `links` (Link labels): A website shown as `linkLabel`, opening in a new tab with `linkTarget` and a hover title from `linkTitle`, and an email shown by its label.
- `locale` (Locale and currency): An opportunity in `locale="de-DE"`, `currency="EUR"` and `timeZone="Europe/Berlin"`: euros, a percent, yen by code with no decimals, a date and a date and time.
- `address` (Address): Two `address` values on their lines: a street over two lines, then city, state and postal code, then country, and one missing its street and state.
- `name` (Name): A contact's `name` on one line, salutation, first and last name and suffix in order, with the empty middle name left out.
- `relative` (Relative time): Instants as `type="relative"` from a fixed `now`: 3 hours ago, yesterday and in 2 days, each with its date and time in a title.
- `horizontal` (Label beside the value): An account's fields with `layout="horizontal"`, and help beside one label from its `help`. Below a 48rem screen the labels stack.

## When to use

- A page shows a record's field read-only: a label over or beside its value, as a record's Details tab does. It does what `lightning-output-field` does.
- The value has a type that formats it: currency, percent, number, date, date and time, time of day, URL, email, phone or checkbox, as the `lightning-formatted-*` components show them. Links get the right scheme.
- A field needs its own format: a currency's code, a set number of decimals, a short or full date, a 24-hour clock or the time zone's name.
- A link reads as other words than its address, or opens in a new tab, as `lightning-formatted-url`'s `label` and `target` do.
- The field is an address or a name, Salesforce's compound fields, as `lightning-formatted-address` and `lightning-formatted-name` show them.
- A date and time reads better as "3 hours ago", as `lightning-relative-date-time` shows it.
- People can edit the field in place. The pencil is the trigger, and you build the editing form.
- A field needs help text in a tooltip beside its label.

## When not to use

- A whole record's sections and columns of fields. Use Record detail, which lays out output fields in SLDS's form layout.
- People type into the field. Use Field with an Input.
- Many records with the same fields. Use Data table, which formats values the same way.

## Usage

```text
OutputField
├── OutputFieldLabel
├── OutputFieldValue
├── OutputFieldEdit
└── FieldDescription
```

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"
```

```tsx
<OutputField>
  <OutputFieldLabel>Close Date</OutputFieldLabel>
  <OutputFieldValue type="date" value="2026-11-14" />
</OutputField>
```

A label's `help` shows help text in a tooltip from an info button beside it.

A lookup shows the related record's name and links to it with `href`. With `loading`, the value draws a placeholder and the pencil hides until the record arrives:

```tsx
<OutputField loading={isLoading}>
  <OutputFieldLabel>Account Name</OutputFieldLabel>
  <OutputFieldValue value={account?.name} href={account?.url} />
  <OutputFieldEdit onClick={() => edit("AccountId")} />
</OutputField>
```

An address or a name takes its parts, and a relative time an instant and the `now` it counts from:

```tsx
<OutputFieldValue
  type="address"
  value={{ street: "312 Constitution Place", city: "Austin", state: "TX" }}
/>
```

```tsx
<OutputFieldValue type="relative" value={account.lastModified} now={now} />
```

A field's format is its own: its decimals, a currency's code, a date's and a time's style, the clock and the zone's name. The org user's `locale`, `currency` and `timeZone` are the same on every field. A link's words, tab and hover title are `linkLabel`, `linkTarget` and `linkTitle`, and the value stays its address:

```tsx
<OutputFieldValue
  type="datetime"
  value={event.start}
  timeZone={user.timeZone}
  dateStyle="short"
  timeZoneName="short"
/>
```

The data table formats its columns with the same `formatOutputValue`, so you can format a value as text anywhere with it. It takes the same format keys, and a data table column takes them in its `meta`. It writes an address on one line, its parts joined by ", ".

`OutputFieldCompactValue` draws a value with no field around it, as a table cell or a record header's detail shows it: a true checkbox is a check and a false one blank, and a relative time and a link read as they do in `OutputFieldValue`. The data table's cells and Record header's fields use it:

```tsx
<OutputFieldCompactValue type="boolean" value={opportunity.isWon} />
```

## Rules

- Pass plain values. A percent is a fraction: 0.6 shows as 60%, so divide a Salesforce percent field's 60 by 100.
- A date is a day (`"2026-11-14"`) and a datetime an instant; pick the type that matches the field, or a day can move across midnight.
- An `address` is `{ street, city, state, postalCode, country }` and a `name` is `{ salutation, firstName, middleName, lastName, suffix }`, any part `null` or left out. An address shows its street's lines, then "City, State PostalCode", then the country, and a name shows its parts in that order; a missing part drops out with its comma. One with no parts renders blank.
- A `relative` value is an instant, counted from `now`. Pass `now` from the page (one value for every field) for a render that stays the same; without it, the current time is read at render, so a server and a browser render can differ. It counts in the largest unit that fits: under 45 seconds is "now", then minutes, hours under 22, days under 26, months under 11, then years. "Yesterday" means the day before in `timeZone`.
- Pass `null` for a field that's empty in the record, which renders blank. Leave out a field people can't read; don't render it blank.
- A `url` value that starts with `/`, `./`, `../`, `#` or `?` links as it is, relative to the page. One with no scheme links with `https://`, a host with a port included (`intranet.acme.com:8443`), and so does a protocol-relative `//host`. One with another scheme than http, https, mailto or tel, like `javascript:`, shows as text and doesn't link.
- `linkLabel`, `linkTarget` and `linkTitle` apply only to a value that links. `linkTarget="_blank"` adds `rel="noopener noreferrer"`, and a blank label shows the value.
- A `time` value is a time of day, `"HH:mm"`, `"HH:mm:ss"` or `"HH:mm:ss.SSS"`, as Salesforce returns a Time field; a `Z` or an offset after it is ignored. It never moves with `timeZone`, and other text shows as stored.
- A `phone` value of 10 digits, or 11 starting with 1, reads "(425) 555-0155" in an en-US or en-CA `locale`. Anything else shows as stored, `+1` numbers and separators included.
- Pass an amount over 15 digits as a decimal string, like `"123456789012345678.90"`, to show every digit. A number keeps about 15.
- `timeZoneName` adds the zone after a `datetime` in the short or medium `timeStyle`; long and full already name it. A maximum under the minimum reads as the minimum.
- `formatOutputValue` formats in en-US, USD and UTC unless you pass `locale`, `currency` or `timeZone`, the same defaults as `OutputFieldValue`. Pass the org user's values to both, or a record page reads one instant on two days.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `OutputField` | [Field](https://ui.wisty.ai/field#api-Field) |  |
| `OutputFieldLabel` | [FieldTitle](https://ui.wisty.ai/field#api-FieldTitle) |  |
| `OutputFieldValue` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |
| `OutputFieldCompactValue` |  | A value on one line, as a table cell or a header detail shows it: a true boolean is a check, false is blank. |
| `OutputFieldEdit` | [Button](https://ui.wisty.ai/button#api-Button) |  |

### OutputField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading`? | `boolean` | `false` | Still loading: the value is a placeholder, the edit button hides, the field is aria-busy. |
| `layout`? | `"stacked" \| "horizontal" \| "auto"` | `"stacked"` |  |

### OutputFieldLabel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `help`? | `React.ReactNode` |  | Help text, in a tooltip from an info button beside the label. |
| `helpLabel`? | `string` | `"Help for"` | The words before the label in the help button's name. Defaults to "Help for". |

### OutputFieldValue

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type`? | `OutputFieldType` | `"text"` | How the value formats. Defaults to "text". |
| `value`? | `OutputFieldPlainValue` |  | The plain value: a percent as a fraction, a time as "HH:mm:ss", an address or name as its parts. null renders blank. |
| `href`? | `string` |  | Links the value, like a lookup's record page or an address's map. url, email and phone link on their own. |
| `linkLabel`? | `string` |  | Words the link shows instead of the value, like "Visit website". The value stays its address. |
| `linkTarget`? | `"_blank" \| "_self" \| "_parent" \| "_top"` |  | Where the link opens; "_blank" adds rel="noopener noreferrer". Defaults to the same tab. |
| `linkTitle`? | `string` |  | The link's hover text. |
| `locale`? | `string` | `outputFieldFormatDefaults.locale` | A BCP 47 locale. Defaults to "en-US". |
| `currency`? | `string` | `outputFieldFormatDefaults.currency` | An ISO 4217 code for "currency" values. Defaults to "USD". |
| `timeZone`? | `string` | `outputFieldFormatDefaults.timeZone` | An IANA time zone for "datetime" values, and the calendar a "relative" value counts days in. Defaults to "UTC". |
| `now`? | `string \| number \| Date` |  | The instant a "relative" value counts from, as ISO 8601. Defaults to the current time at render; pass it for a stable render. |
| `fractionDigits`? | `number` |  | Digits after the decimal point, a field's scale, as both the fewest and the most. Unset, Intl's default. |
| `minimumFractionDigits`? | `number` |  | The fewest digits after the decimal point, over fractionDigits. |
| `maximumFractionDigits`? | `number` |  | The most digits after the decimal point, over fractionDigits; under the minimum, it reads as the minimum. |
| `currencyDisplay`? | `"symbol" \| "code" \| "name"` | `outputFieldFormatDefaults.currencyDisplay` | A currency as its symbol ("$"), its code ("USD") or its name ("US dollars"). Defaults to "symbol". |
| `dateStyle`? | `OutputFieldDateStyle` | `outputFieldFormatDefaults.dateStyle` | The day's style in "date" and "datetime" values. Defaults to "medium": "Jun 18, 2026". |
| `timeStyle`? | `OutputFieldDateStyle` | `outputFieldFormatDefaults.timeStyle` | The time's style in "datetime" and "time" values. Defaults to "short": "3:30 PM". |
| `hour12`? | `boolean` |  | true for a 12-hour clock, false for 24 hours. Unset, the locale's own clock. |
| `timeZoneName`? | `"short" \| "long"` |  | The zone's name after a "datetime" value, "EDT" or "Eastern Daylight Time". Unset, none. |

### OutputFieldCompactValue

A value on one line, as a table cell or a header detail shows it: a true boolean is a check, false is blank.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type`? | `OutputFieldType` | `"text"` | How the value formats. Defaults to "text". |
| `value`? | `OutputFieldPlainValue` |  | The plain value: a percent as a fraction, a time as "HH:mm:ss", an address or name as its parts. null renders blank. |
| `href`? | `string` |  | Links the value, like a lookup's record page or an address's map. url, email and phone link on their own. |
| `linkLabel`? | `string` |  | Words the link shows instead of the value, like "Visit website". The value stays its address. |
| `linkTarget`? | `"_blank" \| "_self" \| "_parent" \| "_top"` |  | Where the link opens; "_blank" adds rel="noopener noreferrer". Defaults to the same tab. |
| `linkTitle`? | `string` |  | The link's hover text. |
| `locale`? | `string` |  | A BCP 47 locale. Defaults to "en-US". |
| `currency`? | `string` |  | An ISO 4217 code for "currency" values. Defaults to "USD". |
| `timeZone`? | `string` |  | An IANA time zone for "datetime" values, and the calendar a "relative" value counts days in. Defaults to "UTC". |
| `now`? | `string \| number \| Date` |  | The instant a "relative" value counts from, as ISO 8601. Defaults to the current time at render; pass it for a stable render. |
| `fractionDigits`? | `number` |  | Digits after the decimal point, a field's scale, as both the fewest and the most. Unset, Intl's default. |
| `minimumFractionDigits`? | `number` |  | The fewest digits after the decimal point, over fractionDigits. |
| `maximumFractionDigits`? | `number` |  | The most digits after the decimal point, over fractionDigits; under the minimum, it reads as the minimum. |
| `currencyDisplay`? | `"symbol" \| "code" \| "name"` |  | A currency as its symbol ("$"), its code ("USD") or its name ("US dollars"). Defaults to "symbol". |
| `dateStyle`? | `OutputFieldDateStyle` |  | The day's style in "date" and "datetime" values. Defaults to "medium": "Jun 18, 2026". |
| `timeStyle`? | `OutputFieldDateStyle` |  | The time's style in "datetime" and "time" values. Defaults to "short": "3:30 PM". |
| `hour12`? | `boolean` |  | true for a 12-hour clock, false for 24 hours. Unset, the locale's own clock. |
| `timeZoneName`? | `"short" \| "long"` |  | The zone's name after a "datetime" value, "EDT" or "Eastern Daylight Time". Unset, none. |

### OutputFieldEdit

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`? | `string` | `"Edit"` | The word before the field's label in the button's name. Defaults to "Edit". |

### compareOutputTimes

Orders two "time" values by the clock: negative, zero or positive, or undefined when either isn't a time.

| Parameter | Type | Default |
| --- | --- | --- |
| `a` | `unknown` |  |
| `b` | `unknown` |  |

Returns `number | undefined`.

### formatOutputValue

Formats a value as its type shows it: a percent from a fraction (0.6 is 60%), a day in its style, an instant in its zone, a time of day, a phone number in the locale's form, an address on one line, a relative value counted from `now`. Text the type can't read passes through; empty values are "".

| Parameter | Type | Default |
| --- | --- | --- |
| `value` | `unknown` |  |
| `type`? | `OutputFieldType` | `"text"` |
| `options`? | `OutputFieldFormatOptions` |  |

Returns `string`.

### outputValueHref

The link for a url, email or phone value, or undefined. A relative URL stays as it is, a URL with no scheme gets https://, and one with a scheme other than http, https, mailto or tel gets no link.

| Parameter | Type | Default |
| --- | --- | --- |
| `value` | `unknown` |  |
| `type`? | `OutputFieldType` | `"text"` |

Returns `string | undefined`.

### OutputFieldType

```ts
type OutputFieldType =
  | "text"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "datetime"
  | "time"
  | "relative"
  | "url"
  | "email"
  | "phone"
  | "boolean"
  | "address"
  | "name"
```

### OutputFieldAddress

A compound address field's parts, like Billing Address. Any part may be missing.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `street`? | `string \| null` |  | The street, with a line break between lines. |
| `city`? | `string \| null` |  | The city or town. |
| `state`? | `string \| null` |  | The state or province. |
| `postalCode`? | `string \| null` |  | The postal or ZIP code. |
| `country`? | `string \| null` |  | The country's name. |
| `latitude`? | `number \| null` |  | The geocode's latitude, which isn't shown. |
| `longitude`? | `number \| null` |  | The geocode's longitude, which isn't shown. |

### OutputFieldName

A compound name field's parts, like a contact's Name. Empty parts are left out.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `salutation`? | `string \| null` |  | "Mr.", "Ms.", "Dr." |
| `firstName`? | `string \| null` |  | The given name. |
| `middleName`? | `string \| null` |  | The middle name or initial. |
| `lastName`? | `string \| null` |  | The family name. |
| `suffix`? | `string \| null` |  | "Jr.", "III", "PhD" |

### OutputFieldPlainValue

A plain value of any type: an address or a name is its parts.

```ts
type OutputFieldPlainValue =
  | string
  | number
  | boolean
  | Date
  | OutputFieldAddress
  | OutputFieldName
  | null
```

### OutputFieldDateStyle

A named style for a day or a time of day: "short" ("6/18/26"), "medium", "long" or "full".

```ts
type OutputFieldDateStyle = "short" | "medium" | "long" | "full"
```

### OutputFieldStyleOptions

How one field shows its value; a key its type doesn't read is ignored.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `fractionDigits`? | `number` |  | Digits after the decimal point, a field's scale, as both the fewest and the most. Unset, Intl's default. |
| `minimumFractionDigits`? | `number` |  | The fewest digits after the decimal point, over fractionDigits. |
| `maximumFractionDigits`? | `number` |  | The most digits after the decimal point, over fractionDigits; under the minimum, it reads as the minimum. |
| `currencyDisplay`? | `"symbol" \| "code" \| "name"` |  | A currency as its symbol ("$"), its code ("USD") or its name ("US dollars"). Defaults to "symbol". |
| `dateStyle`? | `OutputFieldDateStyle` |  | The day's style in "date" and "datetime" values. Defaults to "medium": "Jun 18, 2026". |
| `timeStyle`? | `OutputFieldDateStyle` |  | The time's style in "datetime" and "time" values. Defaults to "short": "3:30 PM". |
| `hour12`? | `boolean` |  | true for a 12-hour clock, false for 24 hours. Unset, the locale's own clock. |
| `timeZoneName`? | `"short" \| "long"` |  | The zone's name after a "datetime" value, "EDT" or "Eastern Daylight Time". Unset, none. |

### OutputFieldFormatOptions

Options for formatOutputValue; a key left out or set to undefined takes its default.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `locale`? | `string` |  | A BCP 47 locale. Defaults to "en-US". |
| `currency`? | `string` |  | An ISO 4217 code for "currency" values. Defaults to "USD". |
| `timeZone`? | `string` |  | An IANA time zone for "datetime" values, and the calendar a "relative" value counts days in. Defaults to "UTC". |
| `now`? | `string \| number \| Date` |  | The instant a "relative" value counts from, as ISO 8601. Defaults to the current time at render; pass it for a stable render. |
| `fractionDigits`? | `number` |  | Digits after the decimal point, a field's scale, as both the fewest and the most. Unset, Intl's default. |
| `minimumFractionDigits`? | `number` |  | The fewest digits after the decimal point, over fractionDigits. |
| `maximumFractionDigits`? | `number` |  | The most digits after the decimal point, over fractionDigits; under the minimum, it reads as the minimum. |
| `currencyDisplay`? | `"symbol" \| "code" \| "name"` |  | A currency as its symbol ("$"), its code ("USD") or its name ("US dollars"). Defaults to "symbol". |
| `dateStyle`? | `OutputFieldDateStyle` |  | The day's style in "date" and "datetime" values. Defaults to "medium": "Jun 18, 2026". |
| `timeStyle`? | `OutputFieldDateStyle` |  | The time's style in "datetime" and "time" values. Defaults to "short": "3:30 PM". |
| `hour12`? | `boolean` |  | true for a 12-hour clock, false for 24 hours. Unset, the locale's own clock. |
| `timeZoneName`? | `"short" \| "long"` |  | The zone's name after a "datetime" value, "EDT" or "Eastern Daylight Time". Unset, none. |

### OutputFieldLinkOptions

How a value reads when it links: url, email and phone on their own, anything with href.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `linkLabel`? | `string` |  | Words the link shows instead of the value, like "Visit website". The value stays its address. |
| `linkTarget`? | `"_blank" \| "_self" \| "_parent" \| "_top"` |  | Where the link opens; "_blank" adds rel="noopener noreferrer". Defaults to the same tab. |
| `linkTitle`? | `string` |  | The link's hover text. |

## SLDS mapping

- `OutputField` is `slds-form-element slds-form-element_readonly`, with `slds-form-element_edit` and `slds-hint-parent` when it holds an `OutputFieldEdit`. `layout="horizontal"` is `slds-form-element_horizontal`, and `layout="auto"` is the same on a compact page (`data-density="compact"`), Lightning's compact display density.
- `OutputFieldLabel` is `slds-form-element__label`, a span in SLDS and a `FieldTitle` here.
- `OutputFieldValue` is `slds-form-element__static`. A checkbox value is `slds-checkbox_faux`, drawn checked or empty. An address is the static value on its lines.
- `OutputFieldEdit` is the `slds-button_icon` with `slds-button__icon_hint`. A label's `help` is `slds-form-element__icon` with its tooltip.

Known gaps:

- An address and a name follow Salesforce's default (en-US) order for every country and locale; Lightning's per-country and per-locale formats aren't drawn.
- An address doesn't link to a map on its own. Pass the map page as `href`.
- The edited state (`slds-is-edited`) and its undo button (`slds-form-element__undo`) belong to the editing form: Record form draws them with `highlightChanges`, and Record inline edit switches output fields to it.
- Rich text and the user avatar beside a lookup aren't drawn.
- A phone number formats only in en-US and en-CA, as "(425) 555-0155". Other countries' formats aren't drawn.
- `lightning-formatted-email`'s envelope icon isn't drawn. Put an Icon beside the value.
- `lightning-formatted-number`'s significant and integer digits, and `lightning-formatted-date-time`'s separate weekday, era and field options, aren't taken. The four date and time styles cover record pages.

## Accessibility

- `OutputField` is a group named by its label, so a screen reader hears "Annual Revenue" and then the value. Put only the label's words in `OutputFieldLabel`; help goes in `help`.
- The pencil is named "Edit" and the label, like "Edit Annual Revenue", and the help button "Help for" and the label. Translate the words with `label` on `OutputFieldEdit` and `helpLabel` on `OutputFieldLabel`.
- A checkbox value is read as "True" or "False".
- A relative time is read with its date and time after it, like "3 hours ago, Oct 13, 2026, 8:00 AM", which is also its title.
- A `linkLabel` is the link's name, read in place of the address, so make it say where the link goes. Nothing says a link opens a new tab; say it in the label when it matters.

## Example code

### Annual Revenue

One currency field with `fractionDigits={0}`, as the field's scale has no cents, and the pencil `OutputFieldEdit` adds for inline edit.

```tsx
import {
  OutputField,
  OutputFieldEdit,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldDefault() {
  return (
    <OutputField className="max-w-sm">
      <OutputFieldLabel>Annual Revenue</OutputFieldLabel>
      <OutputFieldValue type="currency" value={139000000} fractionDigits={0} />
      <OutputFieldEdit />
    </OutputField>
  )
}
```

### Value types

A lead's email, phone and website as links, a date, a date and time in its `timeZone`, and two checkboxes for true and false.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldTypes() {
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Email</OutputFieldLabel>
        <OutputFieldValue type="email" value="bertha@fcof.example" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Phone</OutputFieldLabel>
        <OutputFieldValue type="phone" value="8506444200" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Website</OutputFieldLabel>
        <OutputFieldValue type="url" value="www.fcof.example" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Last Activity</OutputFieldLabel>
        <OutputFieldValue type="date" value="2026-09-28" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Created Date</OutputFieldLabel>
        <OutputFieldValue
          type="datetime"
          value="2026-08-14T15:30:00Z"
          timeZone="America/New_York"
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Do Not Call</OutputFieldLabel>
        <OutputFieldValue type="boolean" value={true} />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Email Opt Out</OutputFieldLabel>
        <OutputFieldValue type="boolean" value={false} />
      </OutputField>
    </div>
  )
}
```

### Numbers

An amount by its code with `currencyDisplay`, decimals bounded by `minimumFractionDigits` and `maximumFractionDigits`, and 18 digits passed as a string.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldNumbers() {
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Amount</OutputFieldLabel>
        <OutputFieldValue
          type="currency"
          value={75000}
          currencyDisplay="code"
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Sales Price</OutputFieldLabel>
        <OutputFieldValue
          type="currency"
          value={12.34567}
          minimumFractionDigits={2}
          maximumFractionDigits={4}
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Discount</OutputFieldLabel>
        <OutputFieldValue
          type="percent"
          value={0.125}
          minimumFractionDigits={0}
          maximumFractionDigits={2}
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Total Contract Value</OutputFieldLabel>
        <OutputFieldValue type="currency" value="123456789012345678.90" />
      </OutputField>
    </div>
  )
}
```

### Date styles

Days in the four `dateStyle` values from short to full, an instant on a 24-hour clock with `hour12={false}`, and one with its zone from `timeZoneName`.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldDates() {
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Close Date</OutputFieldLabel>
        <OutputFieldValue type="date" value="2026-11-14" dateStyle="short" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Last Activity</OutputFieldLabel>
        <OutputFieldValue type="date" value="2026-09-28" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Contract End Date</OutputFieldLabel>
        <OutputFieldValue type="date" value="2027-11-13" dateStyle="long" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Renewal Date</OutputFieldLabel>
        <OutputFieldValue type="date" value="2027-11-14" dateStyle="full" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Created Date</OutputFieldLabel>
        <OutputFieldValue
          type="datetime"
          value="2026-08-14T15:30:00Z"
          timeZone="America/New_York"
          hour12={false}
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Webinar Start</OutputFieldLabel>
        <OutputFieldValue
          type="datetime"
          value="2026-10-21T17:00:00Z"
          timeZone="America/New_York"
          timeZoneName="short"
        />
      </OutputField>
    </div>
  )
}
```

### Time

Times of day as `type="time"`: the short style, a 24-hour clock with `hour12={false}`, and seconds with `timeStyle="medium"`.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldTime() {
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Shift Start</OutputFieldLabel>
        <OutputFieldValue type="time" value="08:00:00.000Z" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Shift End</OutputFieldLabel>
        <OutputFieldValue type="time" value="17:30:00.000Z" hour12={false} />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Preferred Call Time</OutputFieldLabel>
        <OutputFieldValue
          type="time"
          value="14:15:30.000Z"
          timeStyle="medium"
        />
      </OutputField>
    </div>
  )
}
```

### Link labels

A website shown as `linkLabel`, opening in a new tab with `linkTarget` and a hover title from `linkTitle`, and an email shown by its label.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldLinks() {
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Website</OutputFieldLabel>
        <OutputFieldValue
          type="url"
          value="www.edgecomm.example"
          linkLabel="Visit website"
          linkTarget="_blank"
          linkTitle="www.edgecomm.example, in a new tab"
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Support Email</OutputFieldLabel>
        <OutputFieldValue
          type="email"
          value="support@edgecomm.example"
          linkLabel="Email support"
        />
      </OutputField>
    </div>
  )
}
```

### Locale and currency

An opportunity in `locale="de-DE"`, `currency="EUR"` and `timeZone="Europe/Berlin"`: euros, a percent, yen by code with no decimals, a date and a date and time.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldLocale() {
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Amount</OutputFieldLabel>
        <OutputFieldValue
          type="currency"
          value={15000}
          locale="de-DE"
          currency="EUR"
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Probability (%)</OutputFieldLabel>
        <OutputFieldValue type="percent" value={0.6} locale="de-DE" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Local Amount</OutputFieldLabel>
        <OutputFieldValue
          type="currency"
          value={2400000}
          locale="de-DE"
          currency="JPY"
          currencyDisplay="code"
          fractionDigits={0}
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Close Date</OutputFieldLabel>
        <OutputFieldValue type="date" value="2026-06-18" locale="de-DE" />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Created Date</OutputFieldLabel>
        <OutputFieldValue
          type="datetime"
          value="2026-08-14T15:30:00Z"
          locale="de-DE"
          timeZone="Europe/Berlin"
        />
      </OutputField>
    </div>
  )
}
```

### Address

Two `address` values on their lines: a street over two lines, then city, state and postal code, then country, and one missing its street and state.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldAddress() {
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Billing Address</OutputFieldLabel>
        <OutputFieldValue
          type="address"
          value={{
            street: "312 Constitution Place\nSuite 400",
            city: "Austin",
            state: "TX",
            postalCode: "78767",
            country: "USA",
          }}
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Shipping Address</OutputFieldLabel>
        <OutputFieldValue
          type="address"
          value={{
            street: null,
            city: "Austin",
            state: null,
            postalCode: "78767",
            country: "USA",
          }}
        />
      </OutputField>
    </div>
  )
}
```

### Name

A contact's `name` on one line, salutation, first and last name and suffix in order, with the empty middle name left out.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldName() {
  return (
    <OutputField className="max-w-sm">
      <OutputFieldLabel>Name</OutputFieldLabel>
      <OutputFieldValue
        type="name"
        value={{
          salutation: "Ms.",
          firstName: "Rose",
          middleName: null,
          lastName: "Gonzalez",
          suffix: "Jr.",
        }}
      />
    </OutputField>
  )
}
```

### Relative time

Instants as `type="relative"` from a fixed `now`: 3 hours ago, yesterday and in 2 days, each with its date and time in a title.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldRelative() {
  const now = "2026-10-13T15:00:00Z"
  return (
    <div className="grid w-full max-w-sm">
      <OutputField>
        <OutputFieldLabel>Last Modified Date</OutputFieldLabel>
        <OutputFieldValue
          type="relative"
          value="2026-10-13T12:00:00Z"
          now={now}
          timeZone="America/New_York"
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Last Viewed Date</OutputFieldLabel>
        <OutputFieldValue
          type="relative"
          value="2026-10-12T14:00:00Z"
          now={now}
          timeZone="America/New_York"
        />
      </OutputField>
      <OutputField>
        <OutputFieldLabel>Follow-up Due</OutputFieldLabel>
        <OutputFieldValue
          type="relative"
          value="2026-10-15T16:00:00Z"
          now={now}
          timeZone="America/New_York"
        />
      </OutputField>
    </div>
  )
}
```

### Label beside the value

An account's fields with `layout="horizontal"`, and help beside one label from its `help`. Below a 48rem screen the labels stack.

```tsx
import {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
} from "@/components/wisty/output-field"

export default function OutputFieldHorizontal() {
  return (
    <div className="grid w-full max-w-xl">
      <OutputField layout="horizontal">
        <OutputFieldLabel>Type</OutputFieldLabel>
        <OutputFieldValue value="Customer - Direct" />
      </OutputField>
      <OutputField layout="horizontal">
        <OutputFieldLabel>Industry</OutputFieldLabel>
        <OutputFieldValue value="Electronics" />
      </OutputField>
      <OutputField layout="horizontal">
        <OutputFieldLabel help="Gross yearly revenue, as of the last fiscal year.">
          Annual Revenue
        </OutputFieldLabel>
        <OutputFieldValue
          type="currency"
          value={139000000}
          fractionDigits={0}
        />
      </OutputField>
      <OutputField layout="horizontal">
        <OutputFieldLabel>Employees</OutputFieldLabel>
        <OutputFieldValue type="number" value={1000} />
      </OutputField>
    </div>
  )
}
```
