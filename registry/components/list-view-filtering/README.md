# List view filtering

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/list-view-filtering](https://ui.wisty.ai/list-view-filtering) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

The rows a list view's saved filters keep, with Lightning's filter logic. The list view filter panel checks its filters with it.

```bash
npx shadcn@latest add @wisty/list-view-filtering
```

## When to use

- A list view page has saved filters and needs the rows they keep before the table gets them, with a count it can trust.
- Code checks or edits filter logic like `1 AND (2 OR 3)` outside the filter panel, with Lightning's messages and its renumbering when a filter goes.
- A read-only list applies a saved filter value without installing the panel.

## When not to use

- To let people edit filters. Use List view filter panel, which checks its draft with this helper.
- To query the org. It filters the rows the page already has, so build the query's `WHERE` from the saved value yourself.
- For nested condition groups, cross-object filters, or a field kind it doesn't take, like a date and time, a multi-select picklist or a relative date such as "this week".

## Usage

```ts
import { applyListViewFilters } from "@/components/wisty/list-view-filtering"

const { props: filtered, issues } = applyListViewFilters(
  accounts,
  { owner: "all", filters: [typeIsDirect, nameIsNotTest], logic: "1 AND 2" },
  accountFilterSchema
)
const list = useListView({ records: filtered.records, columns, getRowId })
```

The schema lists the fields people can filter by. Each has an `id`, a `label`, a `type` (`text`, `picklist`, `number`, `currency`, `percent`, `date` or `boolean`) and a `read` that takes a row and returns its value: `null` for blank, `undefined` when the field wasn't read. `operators` narrows the ones a field offers, and `nullable` lets a filter match a blank value. `owner` adds My accounts, with the signed-in user's id, and `lockedFilters` adds filters that always apply.

`props.status` is `ready`, `partial` when some rows couldn't be checked because a field wasn't read, `invalid` when the saved filters can't be applied, or `unavailable` without rows or a schema. Neither `invalid` nor `unavailable` means zero matches, and `props.records` is `null` for both. `issues` says why, each with its `scope` and, for a filter, its `filterNumber`. `props.filteredBy` is for the list view header's `filteredBy`. It lists every filter's field label in order, locked filters first, with repeats kept and never the owner scope: "Type, Type, Account Name". With no filters it's `undefined`, even with My accounts.

### The value

`filters` is an ordered list of at most 10 conditions. A filter's number is its position, counted from 1, and filter logic refers to filters by those numbers. Filters have no ids. `logic` is `null` when filter logic is off, and then every filter must match. An empty or blank `logic` means the same.

### Filter logic

- The words are `AND`, `OR` and `NOT`, in any case, and the numbers are one or two digits (`02` is 2). Parentheses group. Spaces and line breaks separate the words, so `1AND2` is a typo.
- `NOT` applies to the number or parenthesized group after it. `AND` binds tighter than `OR`, but an `OR` beside an `AND` needs parentheses: `1 AND 2 OR 3` is refused, and `(1 AND 2) OR 3` is fine.
- Every filter must appear at least once. A number may repeat.
- The logic is at most 120 characters, `listViewFilterLimits.logicLength`.
- `checkFilterLogic(text, count)` returns one problem at a time. Typos come first, then numbers out of range, then filters the logic never names, then the grammar, read from the left. An error inside the right side of an `AND` or `OR` shows as that operator's missing right operand.

| Problem                                             | Message                                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| A word that isn't a number, operator or parenthesis | Check the spelling in your filter logic.                                    |
| A number below 1 or above the filter count          | The filter logic references an undefined filter: 4.                         |
| A filter the logic never names                      | Some filter conditions are defined but not referenced in your filter logic. |
| An `AND` or `OR` with nothing valid after it        | Your filter is missing right operand to AND or OR.                          |
| A `(` group that doesn't end in `)`                 | Your filter is missing a parenthesis.                                       |
| `AND` and `OR` mixed without parentheses            | Your filter must use parentheses around successive AND and OR expressions.  |
| Nothing after a `NOT`, with no filters              | Your filter is missing an operand.                                          |
| A stray `)`, `AND` or `OR`, or words left over      | Check the spelling in your filter logic.                                    |

`normalizeFilterLogic` gives the logic as Save stores it: trimmed, line breaks as spaces and leading zeros dropped (`1 AND 02` is `1 AND 2`), its case kept, and `null` when empty.

### Removing a filter

`removeFilterFromLogic(logic, k)` rewrites the logic once filter k is gone. Every filter after k moves up one number. Every reference to k goes, an `AND` or `OR` that loses one side becomes its other side, two `NOT`s cancel, and numbers above k drop by one. A parenthesized group keeps its parentheses when it collapses, so the result never needs new ones: `1 OR (2 AND 3 AND 4)` without filter 2 becomes `1 OR (2 AND 3)`. The rewrite prints in upper case with single spaces.

- `1 AND (2 OR 3)` without filter 1 becomes `(1 OR 2)`, and without filter 3 becomes `1 AND 2`.
- `1 AND NOT (2 OR 3)` without filter 1 becomes `NOT(1 OR 2)`.
- When one filter number without `NOT` is all that's left, the logic becomes `""`, which still means every filter must match.
- Logic that doesn't parse, like `1 AND 2 OR 3`, comes back as it is.
- `null` stays `null`.

## Rules

- Keep `undefined` for a field the app didn't read and `null` for a blank one. Unread values never match, even under NOT or not equal to, so the result is `partial` instead of a guess.
- A percent is a fraction, 0.35 for 35%, and an amount is in the field's `currencyCode`. A date is `"YYYY-MM-DD"`.
- A filter's number is its position. Code that keeps logic beside the filters must rewrite it with `removeFilterFromLogic` when one goes, or the logic names the wrong filters.
- Locked filters always apply, outside the filter logic. They're how the page shows a filter, not a permission check: enforce access where the data is read.
- It filters the rows the page has loaded. When more rows exist, say so beside the count.

## API reference

### allowedFilterOperators

The operators a field offers: its kind's, narrowed by the field's own list.

| Parameter | Type | Default |
| --- | --- | --- |
| `field` | `AnyField` |  |

Returns `readonly ListViewFilterOperator[]`.

### checkFilterCondition

Why a condition can't be applied to its field, or undefined when it can.

| Parameter | Type | Default |
| --- | --- | --- |
| `condition` | `ListViewFilterCondition` |  |
| `field` | `AnyField` |  |

Returns `string | undefined`.

### checkFilterLogic

The first problem with filter logic over this many filters, or undefined when it's valid.

| Parameter | Type | Default |
| --- | --- | --- |
| `text` | `string` |  |
| `count` | `number` |  |

Returns `string | undefined`.

### removeFilterFromLogic

Rewrites filter logic once filter `number` is gone, renumbering the rest. Unparseable logic stays as it is.

| Parameter | Type | Default |
| --- | --- | --- |
| `logic` | `string \| null` |  |
| `number` | `number` |  |

Returns `string | null`.

### normalizeFilterLogic

Filter logic as Save stores it: trimmed, one line, no leading zeros, and null when empty.

| Parameter | Type | Default |
| --- | --- | --- |
| `logic` | `string \| null` |  |

Returns `string | null`.

### validateListViewFilters

Every reason a value can't be applied with this schema, in order. A null filter isn't checked.

| Parameter | Type | Default |
| --- | --- | --- |
| `value` | `ListViewFiltersDraftValue` |  |
| `schema` | `ListViewFilterSchema<Row>` |  |

Returns `ListViewFilterIssue[]`.

### describeFilterCondition

A condition's operator and value in words, as `equals "Acme"` or `less than $50,000`.

| Parameter | Type | Default |
| --- | --- | --- |
| `condition` | `ListViewFilterCondition` |  |
| `field` | `AnyField` |  |
| `locale`? | `string` | `"en-US"` |

Returns `string`.

### applyListViewFilters

Keeps the rows saved filters match, and counts the rows it couldn't check.

| Parameter | Type | Default |
| --- | --- | --- |
| `records` | `Row[] \| null` |  |
| `value` | `ListViewFiltersValue` |  |
| `schema` | `ListViewFilterSchema<Row> \| null` |  |
| `__3`? | `{ locale?: string }` | `{}` |

Returns `{ props: ListViewFilterResult<Row>; issues: ListViewFilterIssue[]; }`.

### ListViewFilterType

A filterable field's kind, which decides its operators and its value's type.

```ts
type ListViewFilterType =
  | "text"
  | "picklist"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "boolean"
```

### ListViewFilterEqualityOperator

Operators every kind of field takes.

```ts
type ListViewFilterEqualityOperator = "equals" | "not-equal"
```

### ListViewFilterTextOperator

Operators a text field takes.

```ts
type ListViewFilterTextOperator =
  | ListViewFilterEqualityOperator
  | "contains"
  | "not-contains"
  | "starts-with"
```

### ListViewFilterRangeOperator

Operators a number, currency, percent or date field takes.

```ts
type ListViewFilterRangeOperator =
  | ListViewFilterEqualityOperator
  | "less-than"
  | "greater-than"
  | "less-or-equal"
  | "greater-or-equal"
```

### ListViewFilterOperator

Every operator a filter can use.

```ts
type ListViewFilterOperator =
  | ListViewFilterTextOperator
  | ListViewFilterRangeOperator
```

### ListViewFilterOption

A picklist value and its label.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | What the records hold. |
| `label` | `string` |  | What the panel shows. |

### ListViewFilterField

A field people can filter by: its id, label, kind and reader, as the page allows it.

```ts
type ListViewFilterField<Row> =
  | (ListViewFilterFieldBase<Row, string> & {
      type: "text"
      caseSensitive?: boolean
    })
  | (ListViewFilterFieldBase<Row, string> & {
      type: "picklist"
      options: readonly ListViewFilterOption[]
    })
  | (ListViewFilterFieldBase<Row, number> & {
      type: "number"
    })
  | (ListViewFilterFieldBase<Row, number> & {
      type: "currency"
      currencyCode?: string
    })
  | (ListViewFilterFieldBase<Row, number> & {
      type: "percent"
    })
  | (ListViewFilterFieldBase<Row, string> & {
      type: "date"
      today?: string
    })
  | (ListViewFilterFieldBase<Row, boolean> & {
      type: "boolean"
    })
```

### ListViewFilterCondition

One criterion: a field, an operator and a typed value. null is an intentional blank.

```ts
type ListViewFilterCondition =
  | {
      field: string
      type: "text"
      operator: ListViewFilterTextOperator
      value: string | null
    }
  | {
      field: string
      type: "picklist"
      operator: ListViewFilterEqualityOperator
      value: string | null
    }
  | {
      field: string
      type: "number"
      operator: ListViewFilterRangeOperator
      value: number | null
    }
  | {
      field: string
      type: "currency"
      operator: ListViewFilterRangeOperator
      value: number | null
    }
  | {
      field: string
      type: "percent"
      operator: ListViewFilterRangeOperator
      value: number | null
    }
  | {
      field: string
      type: "date"
      operator: ListViewFilterRangeOperator
      value: string | null
    }
  | {
      field: string
      type: "boolean"
      operator: ListViewFilterEqualityOperator
      value: boolean | null
    }
```

### ListViewLockedFilter

A filter the page applies that people can see but not change or remove.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` |  | Unique among the locked filters. |
| `condition` | `ListViewFilterCondition` |  | What the filter matches. |
| `reason` | `string` |  | Why it's locked, shown under it: "This view shows open cases only." |

### ListViewFiltersValue

A list view's saved filters, as Save hands them over.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `owner` | `"all" \| "mine"` |  | Everyone's records, or the signed-in user's. |
| `filters` | `readonly ListViewFilterCondition[]` |  | The filters people can change, numbered from 1 by position for filter logic. |
| `logic` | `string \| null` |  | How the filters combine, as "1 AND (2 OR 3)". null matches all of them. |

### ListViewFilterOwner

Filter by Owner: whose records are "mine", and the two choices' words.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `allLabel` | `string` |  | The choice for everyone's records: "All accounts". |
| `mineLabel` | `string` |  | The choice for the signed-in user's records: "My accounts". |
| `currentUserId` | `string \| null` |  | The signed-in user's id. Without it, "mine" can't be applied. |
| `read` | `(row: Row) => string \| null` |  | Reads a row's owner id: null when it has none, undefined when it wasn't read. |

### ListViewFilterSchema

What people may filter by, as the page allows it.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` | `readonly ListViewFilterField<Row>[]` |  | The fields people can filter by, in the order the field menu lists them. |
| `owner`? | `ListViewFilterOwner<Row>` |  | Shows Filter by Owner. Leave it out for records without owners. |
| `lockedFilters`? | `readonly ListViewLockedFilter[]` |  | Filters that always apply, ANDed with everything else. |

### ListViewFilterIssue

Why filters can't be applied, or rows the filters couldn't check.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `"schema" \| "owner" \| "filter" \| "locked" \| "logic" \| "data"` |  | What the issue is about. |
| `message` | `string` |  | The issue in words, for people. |
| `filterNumber`? | `number` |  | The editable filter it's about, by its number: its position from 1. |
| `lockedKey`? | `string` |  | The locked filter it's about. |
| `fieldId`? | `string` |  | The field it's about. |

### ListViewFilterResult

The rows saved filters keep. Unavailable and invalid never mean zero matches.

```ts
type ListViewFilterResult<Row> =
  | (ListViewFilterResultBase & {
      status: "ready"
      records: Row[]
      indeterminateCount: 0
    })
  | (ListViewFilterResultBase & {
      status: "partial"
      records: Row[]
      indeterminateCount: number
    })
  | (ListViewFilterResultBase & {
      status: "unavailable" | "invalid"
      records: null
      indeterminateCount: 0
    })
```

### ListViewFiltersDraftValue

A value being edited, where a null filter is one whose field isn't chosen yet.

```ts
type ListViewFiltersDraftValue = Omit<
  ListViewFiltersValue,
  "filters"
> & {
  filters: readonly (ListViewFilterCondition | null)[]
}
```

### AnyField

```ts
type AnyField = ListViewFilterField<never>
```
