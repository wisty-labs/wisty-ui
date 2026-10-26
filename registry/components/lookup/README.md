# Lookup

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/lookup](https://ui.wisty.ai/lookup) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks records from a search, one in the field or several as pills. Searches records you pass, or a search you run.

```bash
npx shadcn@latest add @wisty/lookup
```

## Examples

- `default` (Account): Filters the accounts in `records` as you type, each with the object icon from `icon` and a meta line, and shows a picked record in the field.
- `selected` (Selected): An account set with `value`, shown in the field with its icon and a remove button.
- `multiple` (Multiple): Several accounts as pills below the field, set with `multiple`, and the selected ones drop out of the results.
- `search` (Search): Recently viewed accounts from `records` before you type, then an `onSearch` search with a spinner and the term in bold.
- `states` (States): A `required` lookup with an error set by `aria-invalid`, and a `disabled` one with a selected contact.
- `dialog` (In a dialog): A Related to field in a Log a call dialog: accounts take the lookup's `icon`, and an opportunity and a case set their own on the record.

## When to use

- People pick a Salesforce record for a relationship field, like the account on a contact or the record a task is related to.
- People pick several records, like the accounts on a campaign. Pass `multiple`, and the records show as pills below the field.
- The records come from a search you run as people type, like a GraphQL or REST query. Pass `onSearch`.
- The records are already in the page, like a short list of recent records. Pass `records` alone, and the lookup filters them by name.
- It replaces `lightning-record-picker` and Salesforce's own lookup fields: object icons, a meta line, the picked record in the field, and several records as pills.

## When not to use

- The options are plain values, not records with an icon and a second line. Use Combobox.
- The list is short and people don't need to type. Use Select.
- The value is any text. Use Input.
- You need to search several objects from one field, like accounts or contacts. Put a Select for the object next to the lookup.

## Usage

The value is the record itself, not its id, so the field can show a record the current results don't hold. Hold it in state to control it:

```tsx
"use client"

import { useState } from "react"

import { Lookup, type LookupRecord } from "@/components/wisty/lookup"
```

```tsx
export function AccountLookup({ accounts }: { accounts: LookupRecord[] }) {
  const [account, setAccount] = useState<LookupRecord | null>(null)

  return (
    <Lookup
      aria-label="Account"
      records={accounts}
      icon="standard:account"
      value={account}
      onValueChange={setAccount}
    />
  )
}
```

`onSearch` gets the trimmed term and an `AbortSignal`, and returns a promise of records. The lookup calls it from two characters, 300ms after typing stops, and aborts the signal when a newer search starts. Pass the signal on, so an aborted request stops on the network too:

```tsx
async function searchAccounts(
  term: string,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/accounts?q=${encodeURIComponent(term)}`, {
    signal,
  })
  const rows: { Id: string; Name: string; BillingCity: string }[] =
    await response.json()
  return rows.map((row) => ({
    id: row.Id,
    name: row.Name,
    meta: `Account • ${row.BillingCity}`,
  }))
}
```

In a form, `name` submits the record's id, or one id per record with `multiple`.

In Radix projects, Lookup is built on Combobox, which uses `@base-ui/react`, so installing it adds that package beside `radix-ui`. The two work side by side.

## Rules

- Use `multiple` for several records. Never build the pills yourself.
- Never pass `asChild` or `render`.

## API reference

### Lookup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple`? | `false \| true` | `false` | One record, shown in the field. |
| `records`? | `readonly LookupRecord[]` | `[]` | Records to show. Without onSearch they're filtered by name as people type. |
| `onSearch`? | `LookupSearch` |  | Finds records for a term of two characters or more; its signal aborts when a newer search starts. |
| `icon`? | `IconName` |  | The object icon for records that don't name their own. |
| `value`? | `LookupRecord \| null \| readonly LookupRecord[]` |  |  |
| `defaultValue`? | `LookupRecord \| null \| readonly LookupRecord[]` |  |  |
| `onValueChange`? | `(value: LookupRecord \| null) => void \| (value: LookupRecord[]) => void` |  |  |
| `disabled`? | `boolean` | `false` |  |
| `required`? | `boolean` | `false` |  |

Also takes every [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) prop.

### IconName

```ts
type IconName = React.ComponentProps<typeof Icon>["name"]
```

### LookupRecord

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` |  | Unique id, like a Salesforce record id. Selection compares ids. |
| `name` | `string` |  | The record's name: in results, in the field and in pills. |
| `meta`? | `string` |  | A second line under the name in results, like "Account • Austin, TX". |
| `icon`? | `IconName` |  | The object icon, like "standard:account". Defaults to the lookup's icon. |
| `disabled`? | `boolean` |  | Shown in results, but can't be picked. |

### LookupSearch

```ts
type LookupSearch = (
  term: string,
  options: { signal: AbortSignal }
) => Promise<readonly LookupRecord[]>
```

## SLDS mapping

The lookup is SLDS's entity autocomplete combobox. The list is `slds-dropdown slds-dropdown_fluid`, and each result shows an object icon, the name and a meta line. A picked record sits in the field with its icon and a remove button. Several records are Pills below the field, in a group without its border. A disabled record takes `slds-icon_disabled` on its icon.

Known gaps:

- No "Search for 'term'" row, no object switcher (`slds-combobox-group`) and no collapsed selection group with "+N more".
- While a search runs, SLDS shows a remove button for the typed text beside the spinner. The lookup keeps its search icon.
- The search icon and the remove X are lucide's, where SLDS draws `utility:search` and `utility:close`.
- The text the lookup adds ("Remove selected option", "Selected records", "No results for…", "Loading results", "… results", "Something went wrong. Try again.") is English.

## Keyboard interactions

| Keys                 | Action                                                                                                                                         |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Typing               | Filters the records, or searches from two characters, and opens the list when there's something to show.                                       |
| Down Arrow, Up Arrow | Opens the list, or moves the highlight.                                                                                                        |
| Enter                | Picks the highlighted record and closes the list. Without `multiple`, the field shows it. With `multiple`, it adds a pill and clears the text. |
| Escape               | Closes the list. On a closed field, clears the typed text. Inside a modal dialog, the first Escape closes only the list.                       |
| Backspace, Delete    | On a field showing a record, removes the record. Focus stays in the field, ready to search.                                                    |

With `multiple`, the pills are the next tab stop. Left and Right Arrow move between them, and Backspace or Delete removes one. When the last pill goes, focus returns to the field.

## Accessibility

- Name the input with a `FieldLabel` whose `htmlFor` is the lookup's `id`, or pass `aria-label`.
- For an error, set `aria-invalid` and point `aria-describedby` at the message. In Cosmos dark the error text reaches about 4.3:1, below WCAG AA's 4.5:1. SLDS's own tokens do the same.
- In Lightning Blue, a highlighted record's meta line is 4.15:1, below WCAG AA's 4.5:1. SLDS's own stylesheet does the same.
- While the list is open, the rest of the page is hidden from screen readers, the field's label included. The input keeps its name.

## Motion

- The spinner's dots bounce while a search runs, and hold still with reduced motion.

## Responsive behavior

- The lookup fills its parent's width, and the list is as wide as the field. Set the width on the parent or the Field.
- Long names and meta lines are cut off with an ellipsis. Each name has a `title` with the full text.

## Performance

- The list renders every record it's given. Keep `records` and search results to tens, and let people narrow a search by typing.

## Example code

### Account

Filters the accounts in `records` as you type, each with the object icon from `icon` and a meta line, and shows a picked record in the field.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Lookup, type LookupRecord } from "@/components/wisty/lookup"

const accounts: LookupRecord[] = [
  {
    id: "001A",
    name: "Burlington Textiles Corp of America",
    meta: "Account • Burlington, NC",
  },
  { id: "001B", name: "Dickenson plc", meta: "Account • Lawrence, KS" },
  { id: "001C", name: "Edge Communications", meta: "Account • Austin, TX" },
  {
    id: "001D",
    name: "Express Logistics and Transport",
    meta: "Account • Portland, OR",
  },
  { id: "001E", name: "GenePoint", meta: "Account • Mountain View, CA" },
]

export default function LookupDefault() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Account</FieldLabel>
      <Lookup
        id={id}
        records={accounts}
        icon="standard:account"
        placeholder="Search Accounts..."
      />
    </Field>
  )
}
```

### Selected

An account set with `value`, shown in the field with its icon and a remove button.

```tsx
"use client"

import { useId, useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Lookup, type LookupRecord } from "@/components/wisty/lookup"

const accounts: LookupRecord[] = [
  { id: "001B", name: "Dickenson plc", meta: "Account • Lawrence, KS" },
  { id: "001C", name: "Edge Communications", meta: "Account • Austin, TX" },
  { id: "001E", name: "GenePoint", meta: "Account • Mountain View, CA" },
]

export default function LookupSelected() {
  const id = useId()
  const [account, setAccount] = useState<LookupRecord | null>(accounts[1]!)

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Account</FieldLabel>
      <Lookup
        id={id}
        records={accounts}
        icon="standard:account"
        placeholder="Search Accounts..."
        value={account}
        onValueChange={setAccount}
      />
    </Field>
  )
}
```

### Multiple

Several accounts as pills below the field, set with `multiple`, and the selected ones drop out of the results.

```tsx
"use client"

import { useId, useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Lookup, type LookupRecord } from "@/components/wisty/lookup"

const accounts: LookupRecord[] = [
  {
    id: "001A",
    name: "Burlington Textiles Corp of America",
    meta: "Account • Burlington, NC",
  },
  { id: "001B", name: "Dickenson plc", meta: "Account • Lawrence, KS" },
  { id: "001C", name: "Edge Communications", meta: "Account • Austin, TX" },
  {
    id: "001D",
    name: "Express Logistics and Transport",
    meta: "Account • Portland, OR",
  },
  { id: "001E", name: "GenePoint", meta: "Account • Mountain View, CA" },
  {
    id: "001F",
    name: "Grand Hotels & Resorts Ltd",
    meta: "Account • Chicago, IL",
  },
]

export default function LookupMultiple() {
  const id = useId()
  const [selected, setSelected] = useState<LookupRecord[]>([
    accounts[0]!,
    accounts[2]!,
    accounts[4]!,
  ])

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Accounts</FieldLabel>
      <Lookup
        id={id}
        multiple
        records={accounts}
        icon="standard:account"
        placeholder="Search Accounts..."
        value={selected}
        onValueChange={setSelected}
      />
    </Field>
  )
}
```

### Search

Recently viewed accounts from `records` before you type, then an `onSearch` search with a spinner and the term in bold.

```tsx
"use client"

import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Lookup, type LookupRecord } from "@/components/wisty/lookup"

const accounts: LookupRecord[] = [
  {
    id: "001A",
    name: "Burlington Textiles Corp of America",
    meta: "Account • Burlington, NC",
  },
  { id: "001B", name: "Dickenson plc", meta: "Account • Lawrence, KS" },
  { id: "001C", name: "Edge Communications", meta: "Account • Austin, TX" },
  {
    id: "001D",
    name: "Express Logistics and Transport",
    meta: "Account • Portland, OR",
  },
  { id: "001E", name: "GenePoint", meta: "Account • Mountain View, CA" },
  {
    id: "001F",
    name: "Grand Hotels & Resorts Ltd",
    meta: "Account • Chicago, IL",
  },
  {
    id: "001G",
    name: "Pyramid Construction Inc.",
    meta: "Account • Paris, France",
  },
  { id: "001H", name: "sForce", meta: "Account • San Francisco, CA" },
  {
    id: "001I",
    name: "United Oil & Gas Corp.",
    meta: "Account • New York, NY",
  },
  { id: "001J", name: "University of Arizona", meta: "Account • Tucson, AZ" },
]

const recent = [accounts[2]!, accounts[4]!, accounts[8]!]

function searchAccounts(term: string, { signal }: { signal: AbortSignal }) {
  return new Promise<LookupRecord[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const lower = term.toLowerCase()
      resolve(accounts.filter((a) => a.name.toLowerCase().includes(lower)))
    }, 600)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

export default function LookupSearch() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Account</FieldLabel>
      <Lookup
        id={id}
        records={recent}
        onSearch={searchAccounts}
        icon="standard:account"
        placeholder="Search Accounts..."
      />
    </Field>
  )
}
```

### States

A `required` lookup with an error set by `aria-invalid`, and a `disabled` one with a selected contact.

```tsx
"use client"

import { useId } from "react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Lookup, type LookupRecord } from "@/components/wisty/lookup"

const accounts: LookupRecord[] = [
  { id: "001B", name: "Dickenson plc", meta: "Account • Lawrence, KS" },
  { id: "001C", name: "Edge Communications", meta: "Account • Austin, TX" },
  { id: "001E", name: "GenePoint", meta: "Account • Mountain View, CA" },
]

const contact: LookupRecord = {
  id: "003A",
  name: "Rose Gonzalez",
  meta: "Contact • Edge Communications",
}

export default function LookupStates() {
  const id = useId()

  return (
    <FieldGroup className="max-w-xs">
      <Field data-invalid="true">
        <FieldLabel htmlFor={`${id}-account`}>
          <span>
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
            Account
          </span>
        </FieldLabel>
        <Lookup
          id={`${id}-account`}
          records={accounts}
          icon="standard:account"
          placeholder="Search Accounts..."
          required
          aria-invalid="true"
          aria-describedby={`${id}-account-error`}
        />
        <FieldError id={`${id}-account-error`}>Complete this field.</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-contact`}>Primary contact</FieldLabel>
        <Lookup
          id={`${id}-contact`}
          icon="standard:contact"
          defaultValue={contact}
          disabled
        />
      </Field>
    </FieldGroup>
  )
}
```

### In a dialog

A Related to field in a Log a call dialog: accounts take the lookup's `icon`, and an opportunity and a case set their own on the record.

```tsx
import { useId } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Lookup, type LookupRecord } from "@/components/wisty/lookup"

const records: LookupRecord[] = [
  { id: "001C", name: "Edge Communications", meta: "Account • Austin, TX" },
  { id: "001E", name: "GenePoint", meta: "Account • Mountain View, CA" },
  {
    id: "006A",
    name: "Edge SLA",
    meta: "Opportunity • $60,000",
    icon: "standard:opportunity",
  },
  {
    id: "500A",
    name: "00001026",
    meta: "Case • Edge Communications",
    icon: "standard:case",
  },
]

export default function LookupDialog() {
  const id = useId()

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Log a call
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a call</DialogTitle>
          <DialogDescription>
            The call is added to the record&apos;s activity.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor={id}>Related to</FieldLabel>
          <Lookup
            id={id}
            records={records}
            icon="standard:account"
            placeholder="Search records..."
          />
        </Field>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```
