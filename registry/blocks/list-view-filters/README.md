# List view filter panel

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/list-view-filters](https://ui.wisty.ai/list-view-filters) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A list view's filter panel, with owner scope, saved filters and filter logic.

```bash
npx shadcn@latest add @wisty/list-view-filters
```

## Examples

- `default` (Account filters): Three filters combined by the filter logic (1 OR 2) AND 3, with changes kept in a draft until Save. Show filters closes and reopens the panel.
- `opportunities` (Opportunity criteria): Closed, Amount and Close Date filters with typed values, combined by the filter logic 1 AND (2 OR 3).
- `locked` (Locked filters): A required filter stays in place with its reason, and Remove All clears only the editable ones.
- `locked-first` (Locked filters first): The panel's JSX edited over useListViewFilters: locked filters above the editable ones, with no Filter by Owner or filter logic.
- `unavailable` (Unavailable criteria): A saved filter on a field the list no longer offers is named as an error and can be removed without guessing its value.

## When to use

- Beside a list view's table, to filter its records by owner and by field, as Lightning's Show filters panel does.
- When people add, edit and remove filters as a draft, and the list changes only when they press Save.
- When filters combine through numbered filter logic, like `1 AND (2 OR 3)`, checked and renumbered as Lightning's are.
- When the page decides which fields can be filtered, with which operators, and who the signed-in user is.
- When a view has filters people can see but not remove, with the reason beside them.

## When not to use

- For the whole list page, with its header and table. Use List view, and dock this panel beside its table.
- For filters in an overlay that covers the page. Use Sheet.
- For nested groups of conditions, or cross-object filters. This panel is a flat, numbered list.
- To search the rows by text. Use List view header's search.
- For a field kind it doesn't take, like a date and time, a multi-select picklist or a relative date such as "this week".

## Usage

```tsx
import { ListViewFilters } from "@/components/wisty/list-view-filters"
import { applyListViewFilters } from "@/components/wisty/list-view-filtering"
```

```tsx
<ListViewFilters
  id={filtersId}
  schema={accountFilterSchema}
  value={filters}
  onValueChange={setFilters}
  open={filtersOpen}
  onOpenChange={setFiltersOpen}
/>
```

The install writes the panel's code into the project: `list-view-filters.tsx` holds `ListViewFilters` and the `useListViewFilters` hook, and `list-view-filters-editor.tsx` holds the filter's Field, Operator and Value editor and the owner's radio group. The panel is plain JSX over Filter's parts, so to drop Filter by Owner, put the locked filters first or swap an editor for one with a lookup, edit those lines. `useListViewFilters` keeps the draft, its errors and Save in one place, as the Locked filters first example shows.

`schema` lists the fields people can filter by, the owner choice and any locked filters, and `value` is the saved `{ owner, filters, logic }`. Both are List view filtering's types, and its page has the field kinds, the filter logic syntax with its messages, and how removing a filter renumbers the rest.

The editor's Save changes the panel's draft, and its Cancel drops the editor's changes but keeps a new filter. The owner's editor applies its choice on Done. The panel's Save calls `onValueChange` with the whole value, and its Cancel brings back the saved one. Apply the saved value to the rows before the table gets them, and show the result's state before a count:

```tsx
const { props: filtered } = applyListViewFilters(
  accounts,
  filters,
  accountFilterSchema
)
const list = useListView({ records: filtered.records, columns, getRowId })
```

The panel checks the filter logic when the field loses focus, when a filter is added or removed, and on Save. Typing alone doesn't change the error shown. Add Filter hides at 10 filters, and the field stops at 120 characters. Removing the last filter turns filter logic off, and Save drops a new filter that has no field yet, through the same rewrite.

Close the panel by passing `open={false}`. It keeps its draft until it opens again. Give the button that opens it `aria-controls` with the panel's `id`, `aria-expanded` and `aria-pressed`, and move focus back to it in `onOpenChange`.

## Rules

- Keep `undefined` for a field the app didn't read and `null` for a blank one, in the schema's `read`. Unread values never match, so the result is `partial` instead of a guess.
- Locked filters always apply, outside the filter logic. They're how the page shows a filter, not a permission check: enforce access where the data is read.
- Call `useListViewFilters` where it stays mounted while the panel is closed, as `ListViewFilters` does, or closing loses the draft.
- Never pass `asChild` or `render`.

## API reference

### ListViewFilters

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `schema` | `ListViewFilterSchema<Row> \| null` |  | What people may filter by, or null while it isn't available. |
| `value`? | `ListViewFiltersValue` |  | The saved filters, controlled. Only the panel's Save calls onValueChange; editors change the draft. |
| `defaultValue`? | `ListViewFiltersValue` |  | The saved filters at first, uncontrolled. Default: all records, no filters. |
| `onValueChange`? | `(value: ListViewFiltersValue) => void` |  | Called with the filters when Save succeeds. |
| `open`? | `boolean` | `true` | Shows the panel. Closed, it keeps changes not yet saved. Default true. |
| `onOpenChange`? | `(open: boolean) => void` |  | Called when the close button is pressed; the button shows only with it. |
| `title`? | `string` | `"Filters"` | The panel's heading. |
| `locale`? | `string` | `"en-US"` | Formats numbers, amounts and dates. |

Also takes every [`<section>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section) prop.

### useListViewFilters

Holds a list view's saved filters and the panel's draft of them, with Lightning's checks and rewrites.

| Parameter | Type | Default |
| --- | --- | --- |
| `__0` | `UseListViewFiltersOptions<Row>` |  |

Returns `UseListViewFiltersResult`.

### UseListViewFiltersOptions

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `schema` | `ListViewFilterSchema<Row> \| null` |  | What people may filter by, or null while it isn't available. |
| `value`? | `ListViewFiltersValue` |  | The saved filters, controlled. Save calls onValueChange. |
| `defaultValue`? | `ListViewFiltersValue` |  | The saved filters at first, uncontrolled. Default: all records, no filters. |
| `onValueChange`? | `(value: ListViewFiltersValue) => void` |  | Called with the filters when Save succeeds. |

### ListViewFiltersRow

A filter as the panel shows it, with its error once it should show.

```ts
type ListViewFiltersRow = DraftRow & {
  error: string | undefined
}
```

### ListViewFiltersSaveResult

What Save did: saved, found nothing to save, or refused with the first filter key in error, else "logic", else "owner".

```ts
type ListViewFiltersSaveResult =
  | "saved"
  | "unchanged"
  | "conflict"
  | { invalid: number | "logic" | "owner" }
```

### UseListViewFiltersResult

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `readonly ListViewFiltersRow[]` |  | The editable filters, numbered by position from 1. |
| `owner` | `"all" \| "mine"` |  | The owner scope shown. |
| `ownerChanged` | `boolean` |  | The owner scope was changed in this draft. |
| `ownerError` | `string` |  | Why the owner scope can't be applied, once it should show. |
| `lockedError` | `(key: string) => string` |  | Why a locked filter can't be applied, by its key. |
| `logic` | `string \| null` |  | The filter logic shown, or null while it's off. |
| `logicError` | `string` |  | The logic's error, as it was when last checked. |
| `numbered` | `boolean` |  | The logic has text, so the filters show their numbers. |
| `dirty` | `boolean` |  | Something differs from the saved filters. |
| `conflict` | `boolean` |  | The saved filters changed under this draft, so Save is refused. |
| `hasErrors` | `boolean` |  | Some error shows, so the panel says the filters can't be applied. |
| `canAdd` | `boolean` |  | Fewer filters than the limit, so Add Filter can add one. |
| `add` | `() => number \| null` |  | Appends a blank new filter and returns its key, or null at the limit. |
| `replace` | `(key: number, condition: ListViewFilterCondition) => void` |  | Replaces a filter's condition, marking it changed when it differs. |
| `remove` | `(key: number) => void` |  | Removes a filter, renumbering the rest and rewriting the logic. |
| `removeAll` | `() => void` |  | Removes every editable filter and turns logic off. |
| `setOwner` | `(owner: "all" \| "mine") => void` |  | Sets the owner scope in the draft. |
| `addLogic` | `() => void` |  | Turns logic on, with every filter ANDed. |
| `removeLogic` | `() => void` |  | Turns logic off. |
| `typeLogic` | `(logic: string) => void` |  | Changes the logic text without checking it. |
| `checkLogic` | `() => void` |  | Checks the logic as it is now. |
| `save` | `() => ListViewFiltersSaveResult` |  | Drops blank filters, then saves the draft unless it's invalid or the saved filters changed under it. |
| `cancel` | `() => void` |  | Drops the draft, back to the saved filters. |

## SLDS mapping

The panel is Lightning's list view filter panel, built from plain SLDS parts: `slds-panel slds-panel_docked slds-panel_docked-right` with `slds-panel__header` (the title and `slds-panel__close`, or Cancel and Save while there are changes), a gray scroll area holding the white `slds-panel__body`, and the filter logic under it. Each filter is a Filter, `slds-filters__item`, with `slds-is-new` while it's new or changed, `slds-has-error` when it can't be applied and `slds-is-locked` for a locked filter. The editor is `slds-popover slds-popover_large` with `slds-nubbin_right-bottom`, the assistive heading "Choose filter criteria", picklists drawn as `slds-combobox`, and Cancel and Save. The owner's editor is an `slds-radio` group with Done.

Known gaps:

- The panel uses lucide's X, trash and info glyphs where Lightning draws `utility:close`, `utility:delete` and `utility:info`.
- Lightning's Save has a menu with Save As. This panel saves only the list view it shows.
- Filter logic is one text field, without the expression builder's AND and OR rows.
- The panel doesn't animate in. It shows and hides with `open`.

## Keyboard interactions

| Key          | Action                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enter, Space | On a filter, opens its editor.                                                                                                                                |
| Escape       | Closes an open picker or calendar first, then the editor, without keeping its changes. The panel stays open.                                                  |
| Tab          | Moves through the editor's fields, Cancel and Save. In Radix projects focus stays in the editor until it closes. In Base UI projects Tab past Save closes it. |

## Accessibility

- The panel is a region named by its heading. When it opens from closed, focus moves to its close button, or to the heading while it holds changes that aren't saved. After Save or Cancel focus returns to the heading.
- After a filter is removed, focus moves to the next filter, or to Add Filter after the last one. After the editor's Save, focus moves to the panel's Cancel.
- A filter that can't be applied describes its button with the error, and Save focuses the first one.
- A new or changed filter shows an asterisk and its yellow background, and tells screen readers "Not saved" or "Changed, not saved" in words. A changed owner scope is yellow too.
- Add Filter Logic moves focus to the Filter Logic field.
- A locked filter's button is disabled, so its reason is shown as text under it.
- Two panels on one page need different headings, so their regions have different names. Pass `title`.

## Responsive behavior

- The panel takes its container's width and has no minimum. Give it `w-80` against a table's right edge on a wide page, and the full width under the table on a narrow one, with a container query.
- Give the panel a height or a `max-h-*`. Its body then scrolls under the header. To run it the table's full height without stretching the table, put it in a `relative` wrapper beside the table and give it `absolute inset-0`, as the Accounts page does.
- The editor is 25rem wide, or narrower on a small screen. It opens to the panel's left, pointing at the filter, and to another side when the left has no room.

## Example code

### Account filters

Three filters combined by the filter logic (1 OR 2) AND 3, with changes kept in a draft until Save. Show filters closes and reopens the panel.

Installing List view filter panel writes these files. The example renders the first.

#### components/wisty/list-view-filters.tsx

```tsx
"use client"

import * as React from "react"
import { InfoIcon, LockIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Filter,
  FilterContent,
  FilterError,
  FilterItem,
  FilterMarker,
  FilterPredicate,
  FilterProperty,
  FilterRemove,
  FilterStatus,
  FilterTrigger,
} from "@/components/wisty/filter"
import {
  checkFilterLogic,
  describeFilterCondition,
  listViewFilterLimits,
  normalizeFilterLogic,
  removeFilterFromLogic,
  validateListViewFilters,
  type ListViewFilterCondition,
  type ListViewFilterIssue,
  type ListViewFilterSchema,
  type ListViewFiltersDraftValue,
  type ListViewFiltersValue,
} from "@/components/wisty/list-view-filtering"
import {
  ListViewFilterEditor,
  ListViewOwnerEditor,
} from "@/components/wisty/list-view-filters-editor"

type ListViewFiltersProps<Row> = Omit<
  React.ComponentProps<"section">,
  "children" | "defaultValue" | "onChange" | "title" | "hidden"
> & {
  /** What people may filter by, or null while it isn't available. */
  schema: ListViewFilterSchema<Row> | null
  /** The saved filters, controlled. Only the panel's Save calls onValueChange; editors change the draft. */
  value?: ListViewFiltersValue
  /** The saved filters at first, uncontrolled. Default: all records, no filters. */
  defaultValue?: ListViewFiltersValue
  /** Called with the filters when Save succeeds. */
  onValueChange?: (value: ListViewFiltersValue) => void
  /** Shows the panel. Closed, it keeps changes not yet saved. Default true. */
  open?: boolean
  /** Called when the close button is pressed; the button shows only with it. */
  onOpenChange?: (open: boolean) => void
  /** The panel's heading. */
  title?: string
  /** Formats numbers, amounts and dates. */
  locale?: string
}

type DraftRow =
  | { key: number; state: "new"; condition: ListViewFilterCondition | null }
  | {
      key: number
      state: "changed" | "unchanged"
      condition: ListViewFilterCondition
    }

type Draft = {
  base: ListViewFiltersValue
  owner: "all" | "mine"
  ownerChanged: boolean
  rows: readonly DraftRow[]
  logic: string | null
  lastCheckedLogic: string | null
  nextKey: number
  submitted: boolean
}

type DraftEvent =
  | { type: "add" }
  | { type: "replace"; key: number; condition: ListViewFilterCondition }
  | { type: "remove"; key: number }
  | { type: "remove-all" }
  | { type: "owner"; owner: "all" | "mine" }
  | { type: "logic"; logic: string | null }
  | { type: "type-logic"; logic: string }
  | { type: "check-logic" }
  | { type: "submit" }
  | { type: "reset" }

const emptyValue: ListViewFiltersValue = {
  owner: "all",
  filters: [],
  logic: null,
}

function sameCondition(
  a: ListViewFilterCondition | null,
  b: ListViewFilterCondition | null
) {
  return (
    a !== null &&
    b !== null &&
    a.field === b.field &&
    a.type === b.type &&
    a.operator === b.operator &&
    a.value === b.value
  )
}

function sameValue(a: ListViewFiltersDraftValue, b: ListViewFiltersDraftValue) {
  return (
    a.owner === b.owner &&
    a.logic === b.logic &&
    a.filters.length === b.filters.length &&
    a.filters.every((condition, index) =>
      sameCondition(condition, b.filters[index]!)
    )
  )
}

function valueOf(draft: Draft): ListViewFiltersDraftValue {
  return {
    owner: draft.owner,
    filters: draft.rows.map((row) => row.condition),
    logic: draft.logic,
  }
}

function isDirty(draft: Draft | null): draft is Draft {
  return draft !== null && !sameValue(valueOf(draft), draft.base)
}

function liveDraft(draft: Draft | null, saved: ListViewFiltersValue) {
  if (draft === null) return null
  const unchecked =
    draft.lastCheckedLogic !== draft.logic && sameValue(draft.base, saved)
  return isDirty(draft) || unchecked ? draft : null
}

function startDraft(saved: ListViewFiltersValue): Draft {
  return {
    base: saved,
    owner: saved.owner,
    ownerChanged: false,
    rows: saved.filters.map((condition, key) => ({
      key,
      state: "unchanged",
      condition,
    })),
    logic: saved.logic,
    lastCheckedLogic: saved.logic,
    nextKey: saved.filters.length,
    submitted: false,
  }
}

function removeRow(draft: Draft, index: number): Draft {
  const rows = draft.rows.filter((_, other) => other !== index)
  const logic =
    rows.length === 0 ? null : removeFilterFromLogic(draft.logic, index + 1)
  return {
    ...draft,
    rows,
    logic,
    lastCheckedLogic: logic,
  }
}

function applyDraftEvent(
  current: Draft,
  event: Exclude<DraftEvent, { type: "reset" }>
): Draft {
  switch (event.type) {
    case "add":
      if (current.rows.length >= listViewFilterLimits.filters) return current
      return {
        ...current,
        rows: [
          ...current.rows,
          { key: current.nextKey, state: "new", condition: null },
        ],
        lastCheckedLogic: current.logic,
        nextKey: current.nextKey + 1,
      }
    case "replace":
      return {
        ...current,
        rows: current.rows.map((row): DraftRow => {
          if (row.key !== event.key) return row
          if (row.state === "new") return { ...row, condition: event.condition }
          return {
            key: row.key,
            state: sameCondition(row.condition, event.condition)
              ? row.state
              : "changed",
            condition: event.condition,
          }
        }),
      }
    case "remove":
      return removeRow(
        current,
        current.rows.findIndex((row) => row.key === event.key)
      )
    case "remove-all":
      return { ...current, rows: [], logic: null, lastCheckedLogic: null }
    case "owner":
      return {
        ...current,
        owner: event.owner,
        ownerChanged: current.ownerChanged || event.owner !== current.owner,
      }
    case "logic":
      return { ...current, logic: event.logic, lastCheckedLogic: event.logic }
    case "type-logic":
      return { ...current, logic: event.logic }
    case "check-logic":
      return { ...current, lastCheckedLogic: current.logic }
    case "submit": {
      const next = current.rows.reduceRight(
        (draft, row, index) =>
          row.condition === null ? removeRow(draft, index) : draft,
        current
      )
      return { ...next, lastCheckedLogic: next.logic, submitted: true }
    }
  }
}

function reduceDraft(
  draft: Draft | null,
  { saved, event }: { saved: ListViewFiltersValue; event: DraftEvent }
): Draft | null {
  if (event.type === "reset") return null
  return applyDraftEvent(liveDraft(draft, saved) ?? startDraft(saved), event)
}

function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : inner
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [current, set] as const
}

interface UseListViewFiltersOptions<Row> {
  /** What people may filter by, or null while it isn't available. */
  schema: ListViewFilterSchema<Row> | null
  /** The saved filters, controlled. Save calls onValueChange. */
  value?: ListViewFiltersValue
  /** The saved filters at first, uncontrolled. Default: all records, no filters. */
  defaultValue?: ListViewFiltersValue
  /** Called with the filters when Save succeeds. */
  onValueChange?: (value: ListViewFiltersValue) => void
}

/** A filter as the panel shows it, with its error once it should show. */
type ListViewFiltersRow = DraftRow & {
  /** Why it can't be applied, after a Save on a draft, or at rest. */
  error: string | undefined
}

/** What Save did: saved, found nothing to save, or refused with the first filter key in error, else "logic", else "owner". */
type ListViewFiltersSaveResult =
  | "saved"
  | "unchanged"
  | "conflict"
  | { invalid: number | "logic" | "owner" }

interface UseListViewFiltersResult {
  /** The editable filters, numbered by position from 1. */
  rows: readonly ListViewFiltersRow[]
  /** The owner scope shown. */
  owner: "all" | "mine"
  /** The owner scope was changed in this draft. */
  ownerChanged: boolean
  /** Why the owner scope can't be applied, once it should show. */
  ownerError: string | undefined
  /** Why a locked filter can't be applied, by its key. */
  lockedError: (key: string) => string | undefined
  /** The filter logic shown, or null while it's off. */
  logic: string | null
  /** The logic's error, as it was when last checked. */
  logicError: string | undefined
  /** The logic has text, so the filters show their numbers. */
  numbered: boolean
  /** Something differs from the saved filters. */
  dirty: boolean
  /** The saved filters changed under this draft, so Save is refused. */
  conflict: boolean
  /** Some error shows, so the panel says the filters can't be applied. */
  hasErrors: boolean
  /** Fewer filters than the limit, so Add Filter can add one. */
  canAdd: boolean
  /** Appends a blank new filter and returns its key, or null at the limit. */
  add: () => number | null
  /** Replaces a filter's condition, marking it changed when it differs. */
  replace: (key: number, condition: ListViewFilterCondition) => void
  /** Removes a filter, renumbering the rest and rewriting the logic. */
  remove: (key: number) => void
  /** Removes every editable filter and turns logic off. */
  removeAll: () => void
  /** Sets the owner scope in the draft. */
  setOwner: (owner: "all" | "mine") => void
  /** Turns logic on, with every filter ANDed. */
  addLogic: () => void
  /** Turns logic off. */
  removeLogic: () => void
  /** Changes the logic text without checking it. */
  typeLogic: (logic: string) => void
  /** Checks the logic as it is now. */
  checkLogic: () => void
  /** Drops blank filters, then saves the draft unless it's invalid or the saved filters changed under it. */
  save: () => ListViewFiltersSaveResult
  /** Drops the draft, back to the saved filters. */
  cancel: () => void
}

/** Holds a list view's saved filters and the panel's draft of them, with Lightning's checks and rewrites. */
function useListViewFilters<Row>({
  schema,
  value,
  defaultValue = emptyValue,
  onValueChange,
}: UseListViewFiltersOptions<Row>): UseListViewFiltersResult {
  const [saved, setSaved] = useControllableState(
    value,
    defaultValue,
    onValueChange
  )
  const [draft, dispatchDraft] = React.useReducer(reduceDraft, null)
  const dispatch = (event: DraftEvent) => dispatchDraft({ saved, event })
  const active = isDirty(draft) ? draft : null
  const view = liveDraft(draft, saved) ?? startDraft(saved)
  const shown = valueOf(view)
  const issues = schema ? validateListViewFilters(shown, schema) : null
  const showErrors = !active || active.submitted
  const logicError =
    view.lastCheckedLogic === null
      ? undefined
      : checkFilterLogic(view.lastCheckedLogic, view.rows.length)
  const errorOf = (match: (issue: ListViewFilterIssue) => boolean) =>
    issues?.find(match)?.message

  return {
    rows: view.rows.map((row, index) => ({
      ...row,
      error: showErrors
        ? errorOf((issue) => issue.filterNumber === index + 1)
        : undefined,
    })),
    owner: shown.owner,
    ownerChanged: !!active?.ownerChanged,
    ownerError: showErrors
      ? errorOf((issue) => issue.scope === "owner")
      : undefined,
    lockedError: (key) => errorOf((issue) => issue.lockedKey === key),
    logic: shown.logic,
    logicError,
    numbered: !!shown.logic?.trim(),
    dirty: active !== null,
    conflict: active !== null && !sameValue(active.base, saved),
    hasErrors:
      !!issues &&
      (!!logicError ||
        issues.some(
          (issue) =>
            issue.scope === "locked" || (showErrors && issue.scope !== "logic")
        )),
    canAdd: view.rows.length < listViewFilterLimits.filters,
    add: () => {
      if (view.rows.length >= listViewFilterLimits.filters) return null
      dispatch({ type: "add" })
      return view.nextKey
    },
    replace: (key, condition) => dispatch({ type: "replace", key, condition }),
    remove: (key) => dispatch({ type: "remove", key }),
    removeAll: () => dispatch({ type: "remove-all" }),
    setOwner: (owner) => dispatch({ type: "owner", owner }),
    addLogic: () =>
      dispatch({
        type: "logic",
        logic:
          view.rows.length > 1
            ? view.rows.map((_, index) => index + 1).join(" AND ")
            : "",
      }),
    removeLogic: () => dispatch({ type: "logic", logic: null }),
    typeLogic: (logic) => dispatch({ type: "type-logic", logic }),
    checkLogic: () => dispatch({ type: "check-logic" }),
    save: () => {
      if (!active || !schema) return "unchanged"
      if (!sameValue(active.base, saved)) return "conflict"
      const next = applyDraftEvent(active, { type: "submit" })
      const result = validateListViewFilters(valueOf(next), schema)
      if (result.length > 0) {
        dispatch({ type: "submit" })
        const first = next.rows.find((_, index) =>
          result.some((issue) => issue.filterNumber === index + 1)
        )
        return {
          invalid: first
            ? first.key
            : result.some((issue) => issue.scope === "logic")
              ? "logic"
              : "owner",
        }
      }
      setSaved({
        owner: next.owner,
        filters: next.rows.map((row) => row.condition!),
        logic: normalizeFilterLogic(next.logic),
      })
      dispatch({ type: "reset" })
      return "saved"
    },
    cancel: () => dispatch({ type: "reset" }),
  }
}

const linkButtonClass = "h-auto px-0 py-0 font-normal"

const logicHelp =
  "Filter logic governs how and when filters apply to your list view. Use AND and OR operators to fine-tune your results."

function ListViewFilters<Row>({
  schema,
  value,
  defaultValue,
  onValueChange,
  open = true,
  onOpenChange,
  title = "Filters",
  locale = "en-US",
  className,
  ...props
}: ListViewFiltersProps<Row>) {
  const filters = useListViewFilters({
    schema,
    value,
    defaultValue,
    onValueChange,
  })
  const [closedOnce, setClosedOnce] = React.useState(false)
  if (!open && !closedOnce) setClosedOnce(true)
  const titleId = React.useId()

  return (
    <section
      data-slot="list-view-filters"
      aria-labelledby={titleId}
      hidden={!open}
      className={cn(
        "flex min-h-0 flex-col rounded-none bg-(--panel-background) text-(length:--font-size-base) leading-(--line-height-base) text-(--panel-foreground) shadow-(--panel-shadow-right)",
        className
      )}
      {...props}
    >
      {open ? (
        <FiltersPanel
          schema={schema as ListViewFilterSchema<never> | null}
          filters={filters}
          onClose={onOpenChange ? () => onOpenChange(false) : undefined}
          title={title}
          titleId={titleId}
          locale={locale}
          takeFocus={closedOnce}
        />
      ) : null}
    </section>
  )
}

function FiltersPanel({
  schema,
  filters,
  onClose,
  title,
  titleId,
  locale,
  takeFocus,
}: {
  schema: ListViewFilterSchema<never> | null
  filters: UseListViewFiltersResult
  onClose: (() => void) | undefined
  title: string
  titleId: string
  locale: string
  takeFocus: boolean
}) {
  const [editing, setEditing] = React.useState<number | "owner" | null>(null)
  const focusRequest = React.useRef<string | null>(
    takeFocus ? (filters.dirty || !onClose ? "title" : "close") : null
  )
  const focusOn = (key: string) => (node: HTMLElement | null) => {
    if (node && focusRequest.current === key) {
      focusRequest.current = null
      node.focus()
    }
  }
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  // The popover returns focus where it came from when it closes, so focus meant for Cancel is moved on arrival.
  const focusCancelNext = React.useRef(false)
  const alertId = React.useId()
  const logicId = React.useId()
  const criteriaId = React.useId()
  const { rows } = filters
  const fieldOf = (id: string) =>
    schema?.fields.find((field) => field.id === id)
  const locked = schema?.lockedFilters ?? []

  const save = () => {
    const result = filters.save()
    if (result === "saved") focusRequest.current = "title"
    else if (typeof result === "object") {
      focusRequest.current =
        typeof result.invalid === "number"
          ? `edit-${result.invalid}`
          : result.invalid
    }
  }

  const cancel = () => {
    focusRequest.current = "title"
    setEditing(null)
    filters.cancel()
  }

  const add = () => setEditing(filters.add())

  const remove = (key: number) => {
    const index = rows.findIndex((row) => row.key === key)
    const next = rows[index + 1]
    focusRequest.current = next ? `edit-${next.key}` : "add"
    filters.remove(key)
  }

  const removeAll = () => {
    focusRequest.current = "add"
    filters.removeAll()
  }

  return (
    <>
      <div
        data-slot="list-view-filters-header"
        className="flex shrink-0 items-center gap-2 border-b border-(--panel-border) p-3"
      >
        <h2
          ref={focusOn("title")}
          id={titleId}
          tabIndex={-1}
          data-slot="list-view-filters-title"
          className={cn(
            "min-w-0 grow truncate text-(length:--panel-title-size) leading-tight outline-none",
            filters.dirty && "sr-only"
          )}
        >
          {title}
        </h2>
        {filters.dirty ? (
          <>
            <Button
              ref={cancelRef}
              type="button"
              variant="outline"
              onClick={cancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="ms-auto"
              disabled={editing !== null || filters.conflict}
              onClick={save}
            >
              Save
            </Button>
          </>
        ) : onClose ? (
          <Button
            ref={focusOn("close")}
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Close ${title.toLocaleLowerCase(locale)}`}
            className="text-link"
            onClick={onClose}
          >
            <XIcon className="size-4" />
          </Button>
        ) : null}
      </div>
      <div
        data-slot="list-view-filters-body"
        onPointerDown={() => (focusCancelNext.current = false)}
        onFocus={(event) => {
          if (
            focusCancelNext.current &&
            event.currentTarget.contains(event.target)
          ) {
            focusCancelNext.current = false
            cancelRef.current?.focus()
          }
        }}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-(--list-view-filters-body-background)"
      >
        <div className="flex flex-col bg-(--panel-background) p-3">
          {filters.hasErrors ? (
            <p
              id={alertId}
              role="alert"
              data-slot="list-view-filters-error"
              className="mb-3 text-destructive"
            >
              Filters could not be applied. Please fix the validation errors
              below.
            </p>
          ) : null}
          {filters.conflict ? (
            <p role="status" className="mb-3 text-destructive">
              These filters changed elsewhere. Cancel to load the latest
              filters.
            </p>
          ) : null}
          {schema === null ? (
            <p data-slot="list-view-filters-unavailable">
              Filters aren&apos;t available right now.
            </p>
          ) : (
            <>
              {schema.owner ? (
                <ol data-slot="list-view-filters-owner" className="mb-4">
                  <li>
                    <Filter
                      status={filters.ownerChanged ? "changed" : "unchanged"}
                      invalid={!!filters.ownerError}
                      open={editing === "owner"}
                      onOpenChange={(next) => setEditing(next ? "owner" : null)}
                    >
                      <FilterItem>
                        <FilterTrigger ref={focusOn("owner")}>
                          <span className="sr-only">Edit filter:</span>
                          <FilterProperty className="text-(--list-view-filters-owner-label)">
                            Filter by Owner
                          </FilterProperty>
                          <FilterPredicate>
                            {filters.owner === "mine"
                              ? schema.owner.mineLabel
                              : schema.owner.allLabel}
                          </FilterPredicate>
                        </FilterTrigger>
                      </FilterItem>
                      <FilterError>{filters.ownerError}</FilterError>
                      <FilterContent aria-labelledby={`${criteriaId}-owner`}>
                        <h2 id={`${criteriaId}-owner`} className="sr-only">
                          Choose filter criteria
                        </h2>
                        <ListViewOwnerEditor
                          owner={schema.owner}
                          value={filters.owner}
                          onDone={(owner) => {
                            setEditing(null)
                            filters.setOwner(owner)
                          }}
                        />
                      </FilterContent>
                    </Filter>
                  </li>
                </ol>
              ) : null}
              {rows.length > 0 ? (
                <>
                  <h3 className="mb-2">
                    {filters.numbered
                      ? "Matching these filters"
                      : "Matching all of these filters"}
                  </h3>
                  <ol
                    data-slot="list-view-filters-list"
                    className="flex flex-col gap-4 pt-3"
                  >
                    {rows.map((row, index) => {
                      const field = row.condition
                        ? fieldOf(row.condition.field)
                        : undefined
                      const property = row.condition
                        ? (field?.label ?? row.condition.field)
                        : "New Filter"
                      const predicate = row.condition
                        ? describeFilterCondition(row.condition, field, locale)
                        : ""
                      return (
                        <li key={row.key} value={index + 1}>
                          <Filter
                            status={row.state}
                            invalid={!!row.error}
                            open={editing === row.key}
                            onOpenChange={(next) =>
                              setEditing(next ? row.key : null)
                            }
                          >
                            {filters.numbered ? (
                              <FilterMarker>{index + 1}.</FilterMarker>
                            ) : null}
                            <FilterItem>
                              <FilterTrigger ref={focusOn(`edit-${row.key}`)}>
                                <span className="sr-only">
                                  {filters.numbered
                                    ? `Edit filter ${index + 1}:`
                                    : "Edit filter:"}
                                </span>
                                <FilterProperty>
                                  {property}
                                  <FilterStatus />
                                </FilterProperty>
                                {predicate ? (
                                  <FilterPredicate>{predicate}</FilterPredicate>
                                ) : null}
                              </FilterTrigger>
                              <FilterRemove
                                aria-label={`Remove filter: ${property}${predicate ? ` ${predicate}` : ""}`}
                                onClick={() => remove(row.key)}
                              />
                            </FilterItem>
                            <FilterError>{row.error}</FilterError>
                            <FilterContent
                              aria-labelledby={`${criteriaId}-${row.key}`}
                            >
                              <h2
                                id={`${criteriaId}-${row.key}`}
                                className="sr-only"
                              >
                                Choose filter criteria
                              </h2>
                              <ListViewFilterEditor
                                fields={schema.fields}
                                condition={row.condition}
                                locale={locale}
                                onCancel={() => setEditing(null)}
                                onSave={(condition) => {
                                  setEditing(null)
                                  focusCancelNext.current = true
                                  filters.replace(row.key, condition)
                                }}
                              />
                            </FilterContent>
                          </Filter>
                        </li>
                      )
                    })}
                  </ol>
                </>
              ) : null}
              {locked.length > 0 ? (
                <>
                  <h3 className="mt-4 mb-2 flex items-center gap-2">
                    Locked Filters
                    <LockIcon aria-hidden="true" className="size-3" />
                  </h3>
                  <ol
                    data-slot="list-view-filters-locked"
                    className="flex flex-col gap-4 pt-3"
                  >
                    {locked.map((filter) => {
                      const field = fieldOf(filter.condition.field)
                      const error = filters.lockedError(filter.key)
                      return (
                        <li key={filter.key}>
                          <Filter locked invalid={!!error}>
                            <FilterItem>
                              <FilterTrigger>
                                <FilterProperty>
                                  {field?.label ?? filter.condition.field}
                                </FilterProperty>
                                <FilterPredicate>
                                  {describeFilterCondition(
                                    filter.condition,
                                    field,
                                    locale
                                  )}
                                </FilterPredicate>
                              </FilterTrigger>
                            </FilterItem>
                            <p className="mt-1 text-xs">{filter.reason}</p>
                            <FilterError>{error}</FilterError>
                          </Filter>
                        </li>
                      )
                    })}
                  </ol>
                </>
              ) : null}
              <div className="flex items-center justify-between gap-4 pt-2">
                <Button
                  ref={focusOn("add")}
                  type="button"
                  variant="link"
                  className={cn(
                    linkButtonClass,
                    !filters.canAdd && "invisible"
                  )}
                  onClick={add}
                >
                  Add Filter
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className={linkButtonClass}
                  disabled={rows.length === 0}
                  onClick={removeAll}
                >
                  Remove All
                </Button>
              </div>
            </>
          )}
        </div>
        {schema && filters.logic !== null && rows.length > 0 ? (
          <Field
            data-slot="list-view-filters-logic"
            data-invalid={!!filters.logicError}
            className="p-3"
          >
            <div className="flex items-center gap-1">
              <FieldLabel
                htmlFor={logicId}
                className="font-normal text-(--panel-foreground)"
              >
                Filter Logic
              </FieldLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    aria-label="Help for Filter Logic"
                    aria-describedby={`${logicId}-help`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon-xs" }),
                      "text-link"
                    )}
                  >
                    <InfoIcon className="size-4" />
                    <span id={`${logicId}-help`} hidden>
                      {logicHelp}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{logicHelp}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                type="button"
                variant="link"
                className={cn(linkButtonClass, "ms-auto")}
                onClick={filters.removeLogic}
              >
                Remove <span className="sr-only">Filter Logic</span>
              </Button>
            </div>
            <Textarea
              ref={focusOn("logic")}
              id={logicId}
              value={filters.logic}
              maxLength={listViewFilterLimits.logicLength}
              aria-invalid={!!filters.logicError}
              aria-describedby={
                filters.logicError ? `${logicId}-error` : undefined
              }
              className="min-h-12"
              onChange={(event) => filters.typeLogic(event.target.value)}
              onBlur={filters.checkLogic}
            />
            {filters.logicError ? (
              <FieldError id={`${logicId}-error`}>
                {filters.logicError}
              </FieldError>
            ) : null}
          </Field>
        ) : schema && rows.length > 0 ? (
          <div data-slot="list-view-filters-logic" className="p-3">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 hover:no-underline"
              onClick={() => {
                focusRequest.current = "logic"
                filters.addLogic()
              }}
            >
              Add Filter Logic
            </Button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export {
  ListViewFilters,
  useListViewFilters,
  type ListViewFiltersProps,
  type ListViewFiltersRow,
  type ListViewFiltersSaveResult,
  type UseListViewFiltersOptions,
  type UseListViewFiltersResult,
}
```

#### components/wisty/list-view-filters-editor.tsx

```tsx
"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroupAddon } from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  parseDate,
} from "@/components/wisty/date-picker"
import {
  allowedFilterOperators,
  checkFilterCondition,
  filterOperatorLabels,
  type ListViewFilterCondition,
  type ListViewFilterField,
  type ListViewFilterOperator,
  type ListViewFilterOwner,
} from "@/components/wisty/list-view-filtering"
import {
  NumberInput,
  NumberInputField,
  parseNumber,
  toFraction,
  toPercentage,
} from "@/components/wisty/number-input"

type AnyField = ListViewFilterField<never>

type PickerOption = { token: string; label: string }

function Picker({
  id,
  options,
  value,
  placeholder,
  invalid,
  onValueChange,
}: {
  id: string
  options: readonly PickerOption[]
  value: string
  placeholder?: string
  invalid?: boolean
  onValueChange: (token: string) => void
}) {
  const selected = options.find((option) => option.token === value)
  return (
    <Select
      value={selected ? selected.token : ""}
      onValueChange={(next: unknown) => {
        if (typeof next === "string") onValueChange(next)
      }}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid || undefined}
        className="w-full"
      >
        <SelectValue placeholder={placeholder}>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.token} value={option.token}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Filter by Owner's editor: the two owner choices as radios, applied on Done. */
function ListViewOwnerEditor({
  owner,
  value,
  onDone,
}: {
  owner: ListViewFilterOwner<never>
  value: "all" | "mine"
  onDone: (value: "all" | "mine") => void
}) {
  const [choice, setChoice] = React.useState(value)
  const id = React.useId()
  return (
    <>
      <RadioGroup
        value={choice}
        aria-label="Filter by Owner"
        onValueChange={(next: unknown) =>
          setChoice(next === "mine" ? "mine" : "all")
        }
      >
        {(["all", "mine"] as const).map((token) => (
          <Field key={token} orientation="horizontal">
            <RadioGroupItem value={token} id={`${id}-${token}`} />
            <FieldLabel htmlFor={`${id}-${token}`}>
              {token === "mine" ? owner.mineLabel : owner.allLabel}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <div className="flex justify-end">
        <Button type="button" onClick={() => onDone(choice)}>
          Done
        </Button>
      </div>
    </>
  )
}

function initialText(
  condition: ListViewFilterCondition | null,
  field: AnyField | undefined
) {
  if (!condition || !field || condition.value === null) return ""
  if (field.type === "picklist") {
    const index = field.options.findIndex(
      (option) => option.value === condition.value
    )
    return index < 0 ? "" : String(index)
  }
  if (field.type === "text") return String(condition.value)
  if (field.type === "boolean") return condition.value ? "true" : "false"
  return ""
}

const booleanOptions: readonly PickerOption[] = [
  { token: "true", label: "True" },
  { token: "false", label: "False" },
]

/** A filter's editor: Field, Operator and a typed Value, with Cancel and Save. */
function ListViewFilterEditor({
  fields,
  condition,
  locale,
  onCancel,
  onSave,
}: {
  fields: readonly AnyField[]
  condition: ListViewFilterCondition | null
  locale: string
  onCancel: () => void
  onSave: (condition: ListViewFilterCondition) => void
}) {
  const startField = condition
    ? fields.findIndex((field) => field.id === condition.field)
    : fields.length > 0
      ? 0
      : -1
  const [fieldIndex, setFieldIndex] = React.useState(startField)
  const field = fields[fieldIndex]
  const operators = field ? allowedFilterOperators(field) : []
  const [operatorChoice, setOperator] = React.useState<
    ListViewFilterOperator | undefined
  >(condition && startField >= 0 ? condition.operator : undefined)
  const operator =
    operatorChoice && operators.includes(operatorChoice)
      ? operatorChoice
      : operators[0]
  const [blank, setBlank] = React.useState(
    startField >= 0 && condition?.value === null
  )
  const [text, setText] = React.useState(() =>
    initialText(condition, fields[startField])
  )
  const [error, setError] = React.useState<{
    at: "field" | "value"
    message: string
  }>()
  const valueRef = React.useRef<HTMLInputElement>(null)
  const fieldId = React.useId()
  const operatorId = React.useId()
  const valueId = React.useId()
  const blankId = React.useId()
  const canBeBlank =
    !!field?.nullable && (operator === "equals" || operator === "not-equal")
  const isBlank = canBeBlank && blank
  const initialNumber =
    condition &&
    field &&
    condition.field === field.id &&
    typeof condition.value === "number"
      ? field.type === "percent"
        ? toPercentage(condition.value)
        : condition.value
      : null
  const initialDay =
    condition &&
    field?.type === "date" &&
    condition.field === field.id &&
    typeof condition.value === "string"
      ? condition.value
      : null

  const read = ():
    | { condition: ListViewFilterCondition }
    | { at: "field" | "value"; message: string } => {
    if (!field || !operator) return { at: "field", message: "Choose a field." }
    let value: string | number | boolean | null = null
    if (!isBlank) {
      if (field.type === "text") {
        if (text === "") return { at: "value", message: "Enter a value." }
        value = text
      } else if (field.type === "picklist" || field.type === "boolean") {
        if (text === "") return { at: "value", message: "Choose a value." }
        value =
          field.type === "boolean"
            ? text === "true"
            : field.options[Number(text)]!.value
      } else if (field.type === "date") {
        const typed = valueRef.current?.value.trim() ?? ""
        if (typed === "") return { at: "value", message: "Enter a date." }
        const day = parseDate(typed, { locale })
        if (day === null) {
          return { at: "value", message: "Enter a date like Sep 30, 2026." }
        }
        value = day
      } else {
        const number = parseNumber(valueRef.current?.value ?? "", locale, {
          shortcuts: true,
        })
        if (number === null) return { at: "value", message: "Enter a value." }
        if (number === undefined) {
          return { at: "value", message: "Enter a number." }
        }
        value = field.type === "percent" ? toFraction(number) : number
      }
    }
    const next = {
      field: field.id,
      type: field.type,
      operator,
      value,
    } as ListViewFilterCondition
    const message = checkFilterCondition(next, field)
    return message ? { at: "value", message } : { condition: next }
  }

  const save = () => {
    const result = read()
    if ("condition" in result) onSave(result.condition)
    else setError(result)
  }

  const valueInvalid = error?.at === "value"
  const valueControl = !field ? null : field.type === "text" ? (
    <Input
      id={valueId}
      value={text}
      aria-invalid={valueInvalid}
      onChange={(event) => setText(event.target.value)}
    />
  ) : field.type === "picklist" || field.type === "boolean" ? (
    <Picker
      id={valueId}
      options={
        field.type === "boolean"
          ? booleanOptions
          : field.options.map((option, index) => ({
              token: String(index),
              label: option.label,
            }))
      }
      value={text}
      placeholder="Select a value"
      invalid={valueInvalid}
      onValueChange={(token) => {
        setText(token)
        setError(undefined)
      }}
    />
  ) : field.type === "date" ? (
    <DatePicker
      key={field.id}
      defaultValue={initialDay}
      locale={locale}
      today={field.today}
    >
      <DatePickerControl>
        <DatePickerInput
          ref={valueRef}
          id={valueId}
          aria-invalid={valueInvalid || undefined}
        />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerCalendar />
      </DatePickerContent>
    </DatePicker>
  ) : (
    <NumberInput key={field.id} defaultValue={initialNumber} locale={locale}>
      <NumberInputField
        ref={valueRef}
        id={valueId}
        aria-invalid={valueInvalid || undefined}
      />
      {field.type === "percent" ? (
        <InputGroupAddon align="inline-end">%</InputGroupAddon>
      ) : null}
    </NumberInput>
  )

  return (
    <>
      <Field data-invalid={error?.at === "field" || undefined}>
        <FieldLabel htmlFor={fieldId}>Field</FieldLabel>
        <Picker
          id={fieldId}
          options={fields.map((option, index) => ({
            token: String(index),
            label: option.label,
          }))}
          value={fieldIndex < 0 ? "" : String(fieldIndex)}
          placeholder="Select a field"
          invalid={error?.at === "field"}
          onValueChange={(token) => {
            setFieldIndex(Number(token))
            setOperator(undefined)
            setBlank(false)
            setText("")
            setError(undefined)
          }}
        />
        {error?.at === "field" ? (
          <FieldError>{error.message}</FieldError>
        ) : null}
      </Field>
      {field ? (
        <>
          <Field>
            <FieldLabel htmlFor={operatorId}>Operator</FieldLabel>
            <Picker
              id={operatorId}
              options={operators.map((option) => ({
                token: option,
                label: filterOperatorLabels[option],
              }))}
              value={operator ?? ""}
              placeholder="Select an operator"
              onValueChange={(token) => {
                setOperator(operators.find((option) => option === token))
                setError(undefined)
              }}
            />
          </Field>
          {canBeBlank ? (
            <Field orientation="horizontal">
              <Checkbox
                id={blankId}
                checked={blank}
                onCheckedChange={(checked) => {
                  setBlank(checked === true)
                  setError(undefined)
                }}
              />
              <FieldLabel htmlFor={blankId}>Blank value</FieldLabel>
            </Field>
          ) : null}
          {isBlank ? null : (
            <Field data-invalid={valueInvalid || undefined}>
              <FieldLabel htmlFor={valueId}>Value</FieldLabel>
              {valueControl}
              {valueInvalid ? <FieldError>{error!.message}</FieldError> : null}
            </Field>
          )}
        </>
      ) : null}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={save}>
          Save
        </Button>
      </div>
    </>
  )
}

export { ListViewFilterEditor, ListViewOwnerEditor }
```

#### components/wisty/list-view-filters-data.ts

```ts
import type {
  ListViewFilterSchema,
  ListViewFiltersValue,
} from "@/components/wisty/list-view-filtering"

/** An account row, as an All Accounts list view holds it. */
export interface ListViewFiltersAccountRow {
  /** The account's name. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, or null. */
  type: string | null
  /** The owner's user Id, or undefined when it wasn't read. */
  ownerId?: string | null
}

/** An opportunity row, as an All Opportunities list view holds it. */
export interface ListViewFiltersOpportunityRow {
  /** The opportunity's name. */
  name: string
  /** The Stage picklist value. */
  stage: string
  /** The amount in USD, or null. */
  amount: number | null
  /** The probability as a fraction, 0.6 for 60%. */
  probability: number | null
  /** The close date, as "YYYY-MM-DD". */
  closeDate: string
  /** Whether the opportunity is closed. */
  closed: boolean
  /** The owner's user Id. */
  ownerId: string
}

/** A case row, as a Cases list view holds it. */
export interface ListViewFiltersCaseRow {
  /** The case's subject. */
  subject: string
  /** The Status picklist value. */
  status: string
  /** The Priority picklist value. */
  priority: string
  /** The owner's user Id. */
  ownerId: string
}

const signedInUserId = "005Dn000003EllenH"

export const listViewFiltersAccountSchema: ListViewFilterSchema<ListViewFiltersAccountRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Account Name",
        type: "text",
        read: (account) => account.name,
      },
      {
        id: "Phone",
        label: "Phone",
        type: "text",
        nullable: true,
        read: (account) => account.phone,
      },
      {
        id: "Type",
        label: "Type",
        type: "picklist",
        nullable: true,
        options: [
          { value: "Customer - Direct", label: "Customer - Direct" },
          { value: "Customer - Channel", label: "Customer - Channel" },
          { value: "Prospect", label: "Prospect" },
          { value: "Partner", label: "Partner" },
        ],
        read: (account) => account.type,
      },
    ],
    owner: {
      allLabel: "All accounts",
      mineLabel: "My accounts",
      currentUserId: signedInUserId,
      read: (account) => account.ownerId,
    },
  }

export const listViewFiltersDirectCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
  ],
  logic: null,
}

export const listViewFiltersCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Channel",
    },
    {
      field: "Name",
      type: "text",
      operator: "not-contains",
      value: "Test",
    },
  ],
  logic: "(1 OR 2) AND 3",
}

export const listViewFiltersOpportunitySchema: ListViewFilterSchema<ListViewFiltersOpportunityRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Opportunity Name",
        type: "text",
        read: (opportunity) => opportunity.name,
      },
      {
        id: "StageName",
        label: "Stage",
        type: "picklist",
        options: [
          { value: "Prospecting", label: "Prospecting" },
          { value: "Qualification", label: "Qualification" },
          { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
          { value: "Negotiation/Review", label: "Negotiation/Review" },
          { value: "Closed Won", label: "Closed Won" },
          { value: "Closed Lost", label: "Closed Lost" },
        ],
        read: (opportunity) => opportunity.stage,
      },
      {
        id: "Amount",
        label: "Amount",
        type: "currency",
        currencyCode: "USD",
        nullable: true,
        read: (opportunity) => opportunity.amount,
      },
      {
        id: "Probability",
        label: "Probability (%)",
        type: "percent",
        nullable: true,
        read: (opportunity) => opportunity.probability,
      },
      {
        id: "CloseDate",
        label: "Close Date",
        type: "date",
        today: "2026-06-18",
        read: (opportunity) => opportunity.closeDate,
      },
      {
        id: "IsClosed",
        label: "Closed",
        type: "boolean",
        read: (opportunity) => opportunity.closed,
      },
    ],
    owner: {
      allLabel: "All opportunities",
      mineLabel: "My opportunities",
      currentUserId: signedInUserId,
      read: (opportunity) => opportunity.ownerId,
    },
  }

export const listViewFiltersOpenPipeline: ListViewFiltersValue = {
  owner: "mine",
  filters: [
    {
      field: "IsClosed",
      type: "boolean",
      operator: "equals",
      value: false,
    },
    {
      field: "Amount",
      type: "currency",
      operator: "greater-than",
      value: 50000,
    },
    {
      field: "CloseDate",
      type: "date",
      operator: "less-or-equal",
      value: "2026-09-30",
    },
  ],
  logic: "1 AND (2 OR 3)",
}

export const listViewFiltersCaseSchema: ListViewFilterSchema<ListViewFiltersCaseRow> =
  {
    fields: [
      {
        id: "Subject",
        label: "Subject",
        type: "text",
        read: (supportCase) => supportCase.subject,
      },
      {
        id: "Status",
        label: "Status",
        type: "picklist",
        options: [
          { value: "New", label: "New" },
          { value: "Working", label: "Working" },
          { value: "Escalated", label: "Escalated" },
          { value: "Closed", label: "Closed" },
        ],
        read: (supportCase) => supportCase.status,
      },
      {
        id: "Priority",
        label: "Priority",
        type: "picklist",
        options: [
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ],
        read: (supportCase) => supportCase.priority,
      },
    ],
    owner: {
      allLabel: "All cases",
      mineLabel: "My cases",
      currentUserId: signedInUserId,
      read: (supportCase) => supportCase.ownerId,
    },
    lockedFilters: [
      {
        key: "open-cases",
        condition: {
          field: "Status",
          type: "picklist",
          operator: "not-equal",
          value: "Closed",
        },
        reason: "This view shows open cases only.",
      },
    ],
  }
```

### Opportunity criteria

Closed, Amount and Close Date filters with typed values, combined by the filter logic 1 AND (2 OR 3).

```tsx
"use client"

import { ListViewFilters } from "@/components/wisty/list-view-filters"
import { listViewFiltersOpportunitySchema } from "@/components/wisty/list-view-filters-data"

export default function ListViewFiltersOpportunities() {
  return (
    <ListViewFilters
      schema={listViewFiltersOpportunitySchema}
      defaultValue={{
        owner: "mine",
        filters: [
          {
            field: "IsClosed",
            type: "boolean",
            operator: "equals",
            value: false,
          },
          {
            field: "Amount",
            type: "currency",
            operator: "greater-than",
            value: 50000,
          },
          {
            field: "CloseDate",
            type: "date",
            operator: "less-or-equal",
            value: "2026-09-30",
          },
        ],
        logic: "1 AND (2 OR 3)",
      }}
      className="ms-auto w-80 max-w-full"
    />
  )
}
```

It imports this file, which installing List view filter panel writes too.

#### components/wisty/list-view-filters-data.ts

```ts
import type {
  ListViewFilterSchema,
  ListViewFiltersValue,
} from "@/components/wisty/list-view-filtering"

/** An account row, as an All Accounts list view holds it. */
export interface ListViewFiltersAccountRow {
  /** The account's name. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, or null. */
  type: string | null
  /** The owner's user Id, or undefined when it wasn't read. */
  ownerId?: string | null
}

/** An opportunity row, as an All Opportunities list view holds it. */
export interface ListViewFiltersOpportunityRow {
  /** The opportunity's name. */
  name: string
  /** The Stage picklist value. */
  stage: string
  /** The amount in USD, or null. */
  amount: number | null
  /** The probability as a fraction, 0.6 for 60%. */
  probability: number | null
  /** The close date, as "YYYY-MM-DD". */
  closeDate: string
  /** Whether the opportunity is closed. */
  closed: boolean
  /** The owner's user Id. */
  ownerId: string
}

/** A case row, as a Cases list view holds it. */
export interface ListViewFiltersCaseRow {
  /** The case's subject. */
  subject: string
  /** The Status picklist value. */
  status: string
  /** The Priority picklist value. */
  priority: string
  /** The owner's user Id. */
  ownerId: string
}

const signedInUserId = "005Dn000003EllenH"

export const listViewFiltersAccountSchema: ListViewFilterSchema<ListViewFiltersAccountRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Account Name",
        type: "text",
        read: (account) => account.name,
      },
      {
        id: "Phone",
        label: "Phone",
        type: "text",
        nullable: true,
        read: (account) => account.phone,
      },
      {
        id: "Type",
        label: "Type",
        type: "picklist",
        nullable: true,
        options: [
          { value: "Customer - Direct", label: "Customer - Direct" },
          { value: "Customer - Channel", label: "Customer - Channel" },
          { value: "Prospect", label: "Prospect" },
          { value: "Partner", label: "Partner" },
        ],
        read: (account) => account.type,
      },
    ],
    owner: {
      allLabel: "All accounts",
      mineLabel: "My accounts",
      currentUserId: signedInUserId,
      read: (account) => account.ownerId,
    },
  }

export const listViewFiltersDirectCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
  ],
  logic: null,
}

export const listViewFiltersCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Channel",
    },
    {
      field: "Name",
      type: "text",
      operator: "not-contains",
      value: "Test",
    },
  ],
  logic: "(1 OR 2) AND 3",
}

export const listViewFiltersOpportunitySchema: ListViewFilterSchema<ListViewFiltersOpportunityRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Opportunity Name",
        type: "text",
        read: (opportunity) => opportunity.name,
      },
      {
        id: "StageName",
        label: "Stage",
        type: "picklist",
        options: [
          { value: "Prospecting", label: "Prospecting" },
          { value: "Qualification", label: "Qualification" },
          { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
          { value: "Negotiation/Review", label: "Negotiation/Review" },
          { value: "Closed Won", label: "Closed Won" },
          { value: "Closed Lost", label: "Closed Lost" },
        ],
        read: (opportunity) => opportunity.stage,
      },
      {
        id: "Amount",
        label: "Amount",
        type: "currency",
        currencyCode: "USD",
        nullable: true,
        read: (opportunity) => opportunity.amount,
      },
      {
        id: "Probability",
        label: "Probability (%)",
        type: "percent",
        nullable: true,
        read: (opportunity) => opportunity.probability,
      },
      {
        id: "CloseDate",
        label: "Close Date",
        type: "date",
        today: "2026-06-18",
        read: (opportunity) => opportunity.closeDate,
      },
      {
        id: "IsClosed",
        label: "Closed",
        type: "boolean",
        read: (opportunity) => opportunity.closed,
      },
    ],
    owner: {
      allLabel: "All opportunities",
      mineLabel: "My opportunities",
      currentUserId: signedInUserId,
      read: (opportunity) => opportunity.ownerId,
    },
  }

export const listViewFiltersOpenPipeline: ListViewFiltersValue = {
  owner: "mine",
  filters: [
    {
      field: "IsClosed",
      type: "boolean",
      operator: "equals",
      value: false,
    },
    {
      field: "Amount",
      type: "currency",
      operator: "greater-than",
      value: 50000,
    },
    {
      field: "CloseDate",
      type: "date",
      operator: "less-or-equal",
      value: "2026-09-30",
    },
  ],
  logic: "1 AND (2 OR 3)",
}

export const listViewFiltersCaseSchema: ListViewFilterSchema<ListViewFiltersCaseRow> =
  {
    fields: [
      {
        id: "Subject",
        label: "Subject",
        type: "text",
        read: (supportCase) => supportCase.subject,
      },
      {
        id: "Status",
        label: "Status",
        type: "picklist",
        options: [
          { value: "New", label: "New" },
          { value: "Working", label: "Working" },
          { value: "Escalated", label: "Escalated" },
          { value: "Closed", label: "Closed" },
        ],
        read: (supportCase) => supportCase.status,
      },
      {
        id: "Priority",
        label: "Priority",
        type: "picklist",
        options: [
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ],
        read: (supportCase) => supportCase.priority,
      },
    ],
    owner: {
      allLabel: "All cases",
      mineLabel: "My cases",
      currentUserId: signedInUserId,
      read: (supportCase) => supportCase.ownerId,
    },
    lockedFilters: [
      {
        key: "open-cases",
        condition: {
          field: "Status",
          type: "picklist",
          operator: "not-equal",
          value: "Closed",
        },
        reason: "This view shows open cases only.",
      },
    ],
  }
```

### Locked filters

A required filter stays in place with its reason, and Remove All clears only the editable ones.

```tsx
"use client"

import { ListViewFilters } from "@/components/wisty/list-view-filters"
import { listViewFiltersCaseSchema } from "@/components/wisty/list-view-filters-data"

export default function ListViewFiltersLocked() {
  return (
    <ListViewFilters
      schema={listViewFiltersCaseSchema}
      defaultValue={{
        owner: "all",
        filters: [
          {
            field: "Priority",
            type: "picklist",
            operator: "equals",
            value: "High",
          },
        ],
        logic: null,
      }}
      className="ms-auto w-80 max-w-full"
    />
  )
}
```

It imports this file, which installing List view filter panel writes too.

#### components/wisty/list-view-filters-data.ts

```ts
import type {
  ListViewFilterSchema,
  ListViewFiltersValue,
} from "@/components/wisty/list-view-filtering"

/** An account row, as an All Accounts list view holds it. */
export interface ListViewFiltersAccountRow {
  /** The account's name. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, or null. */
  type: string | null
  /** The owner's user Id, or undefined when it wasn't read. */
  ownerId?: string | null
}

/** An opportunity row, as an All Opportunities list view holds it. */
export interface ListViewFiltersOpportunityRow {
  /** The opportunity's name. */
  name: string
  /** The Stage picklist value. */
  stage: string
  /** The amount in USD, or null. */
  amount: number | null
  /** The probability as a fraction, 0.6 for 60%. */
  probability: number | null
  /** The close date, as "YYYY-MM-DD". */
  closeDate: string
  /** Whether the opportunity is closed. */
  closed: boolean
  /** The owner's user Id. */
  ownerId: string
}

/** A case row, as a Cases list view holds it. */
export interface ListViewFiltersCaseRow {
  /** The case's subject. */
  subject: string
  /** The Status picklist value. */
  status: string
  /** The Priority picklist value. */
  priority: string
  /** The owner's user Id. */
  ownerId: string
}

const signedInUserId = "005Dn000003EllenH"

export const listViewFiltersAccountSchema: ListViewFilterSchema<ListViewFiltersAccountRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Account Name",
        type: "text",
        read: (account) => account.name,
      },
      {
        id: "Phone",
        label: "Phone",
        type: "text",
        nullable: true,
        read: (account) => account.phone,
      },
      {
        id: "Type",
        label: "Type",
        type: "picklist",
        nullable: true,
        options: [
          { value: "Customer - Direct", label: "Customer - Direct" },
          { value: "Customer - Channel", label: "Customer - Channel" },
          { value: "Prospect", label: "Prospect" },
          { value: "Partner", label: "Partner" },
        ],
        read: (account) => account.type,
      },
    ],
    owner: {
      allLabel: "All accounts",
      mineLabel: "My accounts",
      currentUserId: signedInUserId,
      read: (account) => account.ownerId,
    },
  }

export const listViewFiltersDirectCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
  ],
  logic: null,
}

export const listViewFiltersCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Channel",
    },
    {
      field: "Name",
      type: "text",
      operator: "not-contains",
      value: "Test",
    },
  ],
  logic: "(1 OR 2) AND 3",
}

export const listViewFiltersOpportunitySchema: ListViewFilterSchema<ListViewFiltersOpportunityRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Opportunity Name",
        type: "text",
        read: (opportunity) => opportunity.name,
      },
      {
        id: "StageName",
        label: "Stage",
        type: "picklist",
        options: [
          { value: "Prospecting", label: "Prospecting" },
          { value: "Qualification", label: "Qualification" },
          { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
          { value: "Negotiation/Review", label: "Negotiation/Review" },
          { value: "Closed Won", label: "Closed Won" },
          { value: "Closed Lost", label: "Closed Lost" },
        ],
        read: (opportunity) => opportunity.stage,
      },
      {
        id: "Amount",
        label: "Amount",
        type: "currency",
        currencyCode: "USD",
        nullable: true,
        read: (opportunity) => opportunity.amount,
      },
      {
        id: "Probability",
        label: "Probability (%)",
        type: "percent",
        nullable: true,
        read: (opportunity) => opportunity.probability,
      },
      {
        id: "CloseDate",
        label: "Close Date",
        type: "date",
        today: "2026-06-18",
        read: (opportunity) => opportunity.closeDate,
      },
      {
        id: "IsClosed",
        label: "Closed",
        type: "boolean",
        read: (opportunity) => opportunity.closed,
      },
    ],
    owner: {
      allLabel: "All opportunities",
      mineLabel: "My opportunities",
      currentUserId: signedInUserId,
      read: (opportunity) => opportunity.ownerId,
    },
  }

export const listViewFiltersOpenPipeline: ListViewFiltersValue = {
  owner: "mine",
  filters: [
    {
      field: "IsClosed",
      type: "boolean",
      operator: "equals",
      value: false,
    },
    {
      field: "Amount",
      type: "currency",
      operator: "greater-than",
      value: 50000,
    },
    {
      field: "CloseDate",
      type: "date",
      operator: "less-or-equal",
      value: "2026-09-30",
    },
  ],
  logic: "1 AND (2 OR 3)",
}

export const listViewFiltersCaseSchema: ListViewFilterSchema<ListViewFiltersCaseRow> =
  {
    fields: [
      {
        id: "Subject",
        label: "Subject",
        type: "text",
        read: (supportCase) => supportCase.subject,
      },
      {
        id: "Status",
        label: "Status",
        type: "picklist",
        options: [
          { value: "New", label: "New" },
          { value: "Working", label: "Working" },
          { value: "Escalated", label: "Escalated" },
          { value: "Closed", label: "Closed" },
        ],
        read: (supportCase) => supportCase.status,
      },
      {
        id: "Priority",
        label: "Priority",
        type: "picklist",
        options: [
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ],
        read: (supportCase) => supportCase.priority,
      },
    ],
    owner: {
      allLabel: "All cases",
      mineLabel: "My cases",
      currentUserId: signedInUserId,
      read: (supportCase) => supportCase.ownerId,
    },
    lockedFilters: [
      {
        key: "open-cases",
        condition: {
          field: "Status",
          type: "picklist",
          operator: "not-equal",
          value: "Closed",
        },
        reason: "This view shows open cases only.",
      },
    ],
  }
```

### Locked filters first

The panel's JSX edited over useListViewFilters: locked filters above the editable ones, with no Filter by Owner or filter logic.

```tsx
"use client"

import { useId, useState } from "react"
import { LockIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Filter,
  FilterContent,
  FilterError,
  FilterItem,
  FilterPredicate,
  FilterProperty,
  FilterRemove,
  FilterStatus,
  FilterTrigger,
} from "@/components/wisty/filter"
import { describeFilterCondition } from "@/components/wisty/list-view-filtering"
import { useListViewFilters } from "@/components/wisty/list-view-filters"
import { listViewFiltersCaseSchema } from "@/components/wisty/list-view-filters-data"
import { ListViewFilterEditor } from "@/components/wisty/list-view-filters-editor"

export default function ListViewFiltersLockedFirst() {
  const id = useId()
  const schema = listViewFiltersCaseSchema
  const filters = useListViewFilters({
    schema,
    defaultValue: {
      owner: "all",
      filters: [
        {
          field: "Priority",
          type: "picklist",
          operator: "equals",
          value: "High",
        },
      ],
      logic: null,
    },
  })
  const [editing, setEditing] = useState<number | null>(null)
  const fieldOf = (fieldId: string) =>
    schema.fields.find((field) => field.id === fieldId)

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="ms-auto flex w-80 max-w-full flex-col bg-(--panel-background) text-(--panel-foreground) shadow-(--panel-shadow-right)"
    >
      <div className="flex items-center gap-2 border-b border-(--panel-border) p-3">
        <h2
          id={`${id}-title`}
          className={cn(
            "grow text-(length:--panel-title-size) leading-tight",
            filters.dirty && "sr-only"
          )}
        >
          Filters
        </h2>
        {filters.dirty ? (
          <>
            <Button variant="outline" onClick={filters.cancel}>
              Cancel
            </Button>
            <Button
              className="ms-auto"
              disabled={editing !== null || filters.conflict}
              onClick={() => filters.save()}
            >
              Save
            </Button>
          </>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 p-3">
        {filters.hasErrors ? (
          <p role="alert" className="text-destructive">
            Filters could not be applied. Please fix the validation errors
            below.
          </p>
        ) : null}
        <h3 className="flex items-center gap-2">
          Locked Filters
          <LockIcon aria-hidden="true" className="size-3" />
        </h3>
        <ol className="flex flex-col gap-4">
          {(schema.lockedFilters ?? []).map((locked) => {
            const field = fieldOf(locked.condition.field)
            return (
              <li key={locked.key}>
                <Filter locked>
                  <FilterItem>
                    <FilterTrigger>
                      <FilterProperty>{field?.label}</FilterProperty>
                      <FilterPredicate>
                        {describeFilterCondition(locked.condition, field)}
                      </FilterPredicate>
                    </FilterTrigger>
                  </FilterItem>
                  <p className="mt-1 text-xs">{locked.reason}</p>
                </Filter>
              </li>
            )
          })}
        </ol>
        {filters.rows.length > 0 ? (
          <h3>Matching all of these filters</h3>
        ) : null}
        <ol className="flex flex-col gap-4">
          {filters.rows.map((row) => {
            const field = row.condition
              ? fieldOf(row.condition.field)
              : undefined
            const property = field?.label ?? "New Filter"
            const predicate = row.condition
              ? describeFilterCondition(row.condition, field)
              : ""
            return (
              <li key={row.key}>
                <Filter
                  status={row.state}
                  invalid={!!row.error}
                  open={editing === row.key}
                  onOpenChange={(next) => setEditing(next ? row.key : null)}
                >
                  <FilterItem>
                    <FilterTrigger>
                      <span className="sr-only">Edit filter:</span>
                      <FilterProperty>
                        {property}
                        <FilterStatus />
                      </FilterProperty>
                      {predicate ? (
                        <FilterPredicate>{predicate}</FilterPredicate>
                      ) : null}
                    </FilterTrigger>
                    <FilterRemove
                      aria-label={`Remove filter: ${property}${predicate ? ` ${predicate}` : ""}`}
                      onClick={() => filters.remove(row.key)}
                    />
                  </FilterItem>
                  <FilterError>{row.error}</FilterError>
                  <FilterContent aria-label="Choose filter criteria">
                    <ListViewFilterEditor
                      fields={schema.fields}
                      condition={row.condition}
                      locale="en-US"
                      onCancel={() => setEditing(null)}
                      onSave={(condition) => {
                        setEditing(null)
                        filters.replace(row.key, condition)
                      }}
                    />
                  </FilterContent>
                </Filter>
              </li>
            )
          })}
        </ol>
        <Button
          variant="link"
          className={cn(
            "h-auto self-start p-0 font-normal",
            !filters.canAdd && "invisible"
          )}
          onClick={() => setEditing(filters.add())}
        >
          Add Filter
        </Button>
      </div>
    </section>
  )
}
```

It imports these files, which installing List view filter panel writes too.

#### components/wisty/list-view-filters-editor.tsx

```tsx
"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroupAddon } from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  parseDate,
} from "@/components/wisty/date-picker"
import {
  allowedFilterOperators,
  checkFilterCondition,
  filterOperatorLabels,
  type ListViewFilterCondition,
  type ListViewFilterField,
  type ListViewFilterOperator,
  type ListViewFilterOwner,
} from "@/components/wisty/list-view-filtering"
import {
  NumberInput,
  NumberInputField,
  parseNumber,
  toFraction,
  toPercentage,
} from "@/components/wisty/number-input"

type AnyField = ListViewFilterField<never>

type PickerOption = { token: string; label: string }

function Picker({
  id,
  options,
  value,
  placeholder,
  invalid,
  onValueChange,
}: {
  id: string
  options: readonly PickerOption[]
  value: string
  placeholder?: string
  invalid?: boolean
  onValueChange: (token: string) => void
}) {
  const selected = options.find((option) => option.token === value)
  return (
    <Select
      value={selected ? selected.token : ""}
      onValueChange={(next: unknown) => {
        if (typeof next === "string") onValueChange(next)
      }}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid || undefined}
        className="w-full"
      >
        <SelectValue placeholder={placeholder}>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.token} value={option.token}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Filter by Owner's editor: the two owner choices as radios, applied on Done. */
function ListViewOwnerEditor({
  owner,
  value,
  onDone,
}: {
  owner: ListViewFilterOwner<never>
  value: "all" | "mine"
  onDone: (value: "all" | "mine") => void
}) {
  const [choice, setChoice] = React.useState(value)
  const id = React.useId()
  return (
    <>
      <RadioGroup
        value={choice}
        aria-label="Filter by Owner"
        onValueChange={(next: unknown) =>
          setChoice(next === "mine" ? "mine" : "all")
        }
      >
        {(["all", "mine"] as const).map((token) => (
          <Field key={token} orientation="horizontal">
            <RadioGroupItem value={token} id={`${id}-${token}`} />
            <FieldLabel htmlFor={`${id}-${token}`}>
              {token === "mine" ? owner.mineLabel : owner.allLabel}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <div className="flex justify-end">
        <Button type="button" onClick={() => onDone(choice)}>
          Done
        </Button>
      </div>
    </>
  )
}

function initialText(
  condition: ListViewFilterCondition | null,
  field: AnyField | undefined
) {
  if (!condition || !field || condition.value === null) return ""
  if (field.type === "picklist") {
    const index = field.options.findIndex(
      (option) => option.value === condition.value
    )
    return index < 0 ? "" : String(index)
  }
  if (field.type === "text") return String(condition.value)
  if (field.type === "boolean") return condition.value ? "true" : "false"
  return ""
}

const booleanOptions: readonly PickerOption[] = [
  { token: "true", label: "True" },
  { token: "false", label: "False" },
]

/** A filter's editor: Field, Operator and a typed Value, with Cancel and Save. */
function ListViewFilterEditor({
  fields,
  condition,
  locale,
  onCancel,
  onSave,
}: {
  fields: readonly AnyField[]
  condition: ListViewFilterCondition | null
  locale: string
  onCancel: () => void
  onSave: (condition: ListViewFilterCondition) => void
}) {
  const startField = condition
    ? fields.findIndex((field) => field.id === condition.field)
    : fields.length > 0
      ? 0
      : -1
  const [fieldIndex, setFieldIndex] = React.useState(startField)
  const field = fields[fieldIndex]
  const operators = field ? allowedFilterOperators(field) : []
  const [operatorChoice, setOperator] = React.useState<
    ListViewFilterOperator | undefined
  >(condition && startField >= 0 ? condition.operator : undefined)
  const operator =
    operatorChoice && operators.includes(operatorChoice)
      ? operatorChoice
      : operators[0]
  const [blank, setBlank] = React.useState(
    startField >= 0 && condition?.value === null
  )
  const [text, setText] = React.useState(() =>
    initialText(condition, fields[startField])
  )
  const [error, setError] = React.useState<{
    at: "field" | "value"
    message: string
  }>()
  const valueRef = React.useRef<HTMLInputElement>(null)
  const fieldId = React.useId()
  const operatorId = React.useId()
  const valueId = React.useId()
  const blankId = React.useId()
  const canBeBlank =
    !!field?.nullable && (operator === "equals" || operator === "not-equal")
  const isBlank = canBeBlank && blank
  const initialNumber =
    condition &&
    field &&
    condition.field === field.id &&
    typeof condition.value === "number"
      ? field.type === "percent"
        ? toPercentage(condition.value)
        : condition.value
      : null
  const initialDay =
    condition &&
    field?.type === "date" &&
    condition.field === field.id &&
    typeof condition.value === "string"
      ? condition.value
      : null

  const read = ():
    | { condition: ListViewFilterCondition }
    | { at: "field" | "value"; message: string } => {
    if (!field || !operator) return { at: "field", message: "Choose a field." }
    let value: string | number | boolean | null = null
    if (!isBlank) {
      if (field.type === "text") {
        if (text === "") return { at: "value", message: "Enter a value." }
        value = text
      } else if (field.type === "picklist" || field.type === "boolean") {
        if (text === "") return { at: "value", message: "Choose a value." }
        value =
          field.type === "boolean"
            ? text === "true"
            : field.options[Number(text)]!.value
      } else if (field.type === "date") {
        const typed = valueRef.current?.value.trim() ?? ""
        if (typed === "") return { at: "value", message: "Enter a date." }
        const day = parseDate(typed, { locale })
        if (day === null) {
          return { at: "value", message: "Enter a date like Sep 30, 2026." }
        }
        value = day
      } else {
        const number = parseNumber(valueRef.current?.value ?? "", locale, {
          shortcuts: true,
        })
        if (number === null) return { at: "value", message: "Enter a value." }
        if (number === undefined) {
          return { at: "value", message: "Enter a number." }
        }
        value = field.type === "percent" ? toFraction(number) : number
      }
    }
    const next = {
      field: field.id,
      type: field.type,
      operator,
      value,
    } as ListViewFilterCondition
    const message = checkFilterCondition(next, field)
    return message ? { at: "value", message } : { condition: next }
  }

  const save = () => {
    const result = read()
    if ("condition" in result) onSave(result.condition)
    else setError(result)
  }

  const valueInvalid = error?.at === "value"
  const valueControl = !field ? null : field.type === "text" ? (
    <Input
      id={valueId}
      value={text}
      aria-invalid={valueInvalid}
      onChange={(event) => setText(event.target.value)}
    />
  ) : field.type === "picklist" || field.type === "boolean" ? (
    <Picker
      id={valueId}
      options={
        field.type === "boolean"
          ? booleanOptions
          : field.options.map((option, index) => ({
              token: String(index),
              label: option.label,
            }))
      }
      value={text}
      placeholder="Select a value"
      invalid={valueInvalid}
      onValueChange={(token) => {
        setText(token)
        setError(undefined)
      }}
    />
  ) : field.type === "date" ? (
    <DatePicker
      key={field.id}
      defaultValue={initialDay}
      locale={locale}
      today={field.today}
    >
      <DatePickerControl>
        <DatePickerInput
          ref={valueRef}
          id={valueId}
          aria-invalid={valueInvalid || undefined}
        />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerCalendar />
      </DatePickerContent>
    </DatePicker>
  ) : (
    <NumberInput key={field.id} defaultValue={initialNumber} locale={locale}>
      <NumberInputField
        ref={valueRef}
        id={valueId}
        aria-invalid={valueInvalid || undefined}
      />
      {field.type === "percent" ? (
        <InputGroupAddon align="inline-end">%</InputGroupAddon>
      ) : null}
    </NumberInput>
  )

  return (
    <>
      <Field data-invalid={error?.at === "field" || undefined}>
        <FieldLabel htmlFor={fieldId}>Field</FieldLabel>
        <Picker
          id={fieldId}
          options={fields.map((option, index) => ({
            token: String(index),
            label: option.label,
          }))}
          value={fieldIndex < 0 ? "" : String(fieldIndex)}
          placeholder="Select a field"
          invalid={error?.at === "field"}
          onValueChange={(token) => {
            setFieldIndex(Number(token))
            setOperator(undefined)
            setBlank(false)
            setText("")
            setError(undefined)
          }}
        />
        {error?.at === "field" ? (
          <FieldError>{error.message}</FieldError>
        ) : null}
      </Field>
      {field ? (
        <>
          <Field>
            <FieldLabel htmlFor={operatorId}>Operator</FieldLabel>
            <Picker
              id={operatorId}
              options={operators.map((option) => ({
                token: option,
                label: filterOperatorLabels[option],
              }))}
              value={operator ?? ""}
              placeholder="Select an operator"
              onValueChange={(token) => {
                setOperator(operators.find((option) => option === token))
                setError(undefined)
              }}
            />
          </Field>
          {canBeBlank ? (
            <Field orientation="horizontal">
              <Checkbox
                id={blankId}
                checked={blank}
                onCheckedChange={(checked) => {
                  setBlank(checked === true)
                  setError(undefined)
                }}
              />
              <FieldLabel htmlFor={blankId}>Blank value</FieldLabel>
            </Field>
          ) : null}
          {isBlank ? null : (
            <Field data-invalid={valueInvalid || undefined}>
              <FieldLabel htmlFor={valueId}>Value</FieldLabel>
              {valueControl}
              {valueInvalid ? <FieldError>{error!.message}</FieldError> : null}
            </Field>
          )}
        </>
      ) : null}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={save}>
          Save
        </Button>
      </div>
    </>
  )
}

export { ListViewFilterEditor, ListViewOwnerEditor }
```

#### components/wisty/list-view-filters-data.ts

```ts
import type {
  ListViewFilterSchema,
  ListViewFiltersValue,
} from "@/components/wisty/list-view-filtering"

/** An account row, as an All Accounts list view holds it. */
export interface ListViewFiltersAccountRow {
  /** The account's name. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, or null. */
  type: string | null
  /** The owner's user Id, or undefined when it wasn't read. */
  ownerId?: string | null
}

/** An opportunity row, as an All Opportunities list view holds it. */
export interface ListViewFiltersOpportunityRow {
  /** The opportunity's name. */
  name: string
  /** The Stage picklist value. */
  stage: string
  /** The amount in USD, or null. */
  amount: number | null
  /** The probability as a fraction, 0.6 for 60%. */
  probability: number | null
  /** The close date, as "YYYY-MM-DD". */
  closeDate: string
  /** Whether the opportunity is closed. */
  closed: boolean
  /** The owner's user Id. */
  ownerId: string
}

/** A case row, as a Cases list view holds it. */
export interface ListViewFiltersCaseRow {
  /** The case's subject. */
  subject: string
  /** The Status picklist value. */
  status: string
  /** The Priority picklist value. */
  priority: string
  /** The owner's user Id. */
  ownerId: string
}

const signedInUserId = "005Dn000003EllenH"

export const listViewFiltersAccountSchema: ListViewFilterSchema<ListViewFiltersAccountRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Account Name",
        type: "text",
        read: (account) => account.name,
      },
      {
        id: "Phone",
        label: "Phone",
        type: "text",
        nullable: true,
        read: (account) => account.phone,
      },
      {
        id: "Type",
        label: "Type",
        type: "picklist",
        nullable: true,
        options: [
          { value: "Customer - Direct", label: "Customer - Direct" },
          { value: "Customer - Channel", label: "Customer - Channel" },
          { value: "Prospect", label: "Prospect" },
          { value: "Partner", label: "Partner" },
        ],
        read: (account) => account.type,
      },
    ],
    owner: {
      allLabel: "All accounts",
      mineLabel: "My accounts",
      currentUserId: signedInUserId,
      read: (account) => account.ownerId,
    },
  }

export const listViewFiltersDirectCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
  ],
  logic: null,
}

export const listViewFiltersCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Channel",
    },
    {
      field: "Name",
      type: "text",
      operator: "not-contains",
      value: "Test",
    },
  ],
  logic: "(1 OR 2) AND 3",
}

export const listViewFiltersOpportunitySchema: ListViewFilterSchema<ListViewFiltersOpportunityRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Opportunity Name",
        type: "text",
        read: (opportunity) => opportunity.name,
      },
      {
        id: "StageName",
        label: "Stage",
        type: "picklist",
        options: [
          { value: "Prospecting", label: "Prospecting" },
          { value: "Qualification", label: "Qualification" },
          { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
          { value: "Negotiation/Review", label: "Negotiation/Review" },
          { value: "Closed Won", label: "Closed Won" },
          { value: "Closed Lost", label: "Closed Lost" },
        ],
        read: (opportunity) => opportunity.stage,
      },
      {
        id: "Amount",
        label: "Amount",
        type: "currency",
        currencyCode: "USD",
        nullable: true,
        read: (opportunity) => opportunity.amount,
      },
      {
        id: "Probability",
        label: "Probability (%)",
        type: "percent",
        nullable: true,
        read: (opportunity) => opportunity.probability,
      },
      {
        id: "CloseDate",
        label: "Close Date",
        type: "date",
        today: "2026-06-18",
        read: (opportunity) => opportunity.closeDate,
      },
      {
        id: "IsClosed",
        label: "Closed",
        type: "boolean",
        read: (opportunity) => opportunity.closed,
      },
    ],
    owner: {
      allLabel: "All opportunities",
      mineLabel: "My opportunities",
      currentUserId: signedInUserId,
      read: (opportunity) => opportunity.ownerId,
    },
  }

export const listViewFiltersOpenPipeline: ListViewFiltersValue = {
  owner: "mine",
  filters: [
    {
      field: "IsClosed",
      type: "boolean",
      operator: "equals",
      value: false,
    },
    {
      field: "Amount",
      type: "currency",
      operator: "greater-than",
      value: 50000,
    },
    {
      field: "CloseDate",
      type: "date",
      operator: "less-or-equal",
      value: "2026-09-30",
    },
  ],
  logic: "1 AND (2 OR 3)",
}

export const listViewFiltersCaseSchema: ListViewFilterSchema<ListViewFiltersCaseRow> =
  {
    fields: [
      {
        id: "Subject",
        label: "Subject",
        type: "text",
        read: (supportCase) => supportCase.subject,
      },
      {
        id: "Status",
        label: "Status",
        type: "picklist",
        options: [
          { value: "New", label: "New" },
          { value: "Working", label: "Working" },
          { value: "Escalated", label: "Escalated" },
          { value: "Closed", label: "Closed" },
        ],
        read: (supportCase) => supportCase.status,
      },
      {
        id: "Priority",
        label: "Priority",
        type: "picklist",
        options: [
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ],
        read: (supportCase) => supportCase.priority,
      },
    ],
    owner: {
      allLabel: "All cases",
      mineLabel: "My cases",
      currentUserId: signedInUserId,
      read: (supportCase) => supportCase.ownerId,
    },
    lockedFilters: [
      {
        key: "open-cases",
        condition: {
          field: "Status",
          type: "picklist",
          operator: "not-equal",
          value: "Closed",
        },
        reason: "This view shows open cases only.",
      },
    ],
  }
```

### Unavailable criteria

A saved filter on a field the list no longer offers is named as an error and can be removed without guessing its value.

```tsx
"use client"

import { ListViewFilters } from "@/components/wisty/list-view-filters"
import { listViewFiltersAccountSchema } from "@/components/wisty/list-view-filters-data"

export default function ListViewFiltersUnavailable() {
  return (
    <ListViewFilters
      schema={listViewFiltersAccountSchema}
      defaultValue={{
        owner: "all",
        filters: [
          {
            field: "Type",
            type: "picklist",
            operator: "equals",
            value: "Customer - Direct",
          },
          {
            field: "Industry",
            type: "picklist",
            operator: "equals",
            value: "Banking",
          },
        ],
        logic: null,
      }}
      className="ms-auto w-80 max-w-full"
    />
  )
}
```

It imports this file, which installing List view filter panel writes too.

#### components/wisty/list-view-filters-data.ts

```ts
import type {
  ListViewFilterSchema,
  ListViewFiltersValue,
} from "@/components/wisty/list-view-filtering"

/** An account row, as an All Accounts list view holds it. */
export interface ListViewFiltersAccountRow {
  /** The account's name. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, or null. */
  type: string | null
  /** The owner's user Id, or undefined when it wasn't read. */
  ownerId?: string | null
}

/** An opportunity row, as an All Opportunities list view holds it. */
export interface ListViewFiltersOpportunityRow {
  /** The opportunity's name. */
  name: string
  /** The Stage picklist value. */
  stage: string
  /** The amount in USD, or null. */
  amount: number | null
  /** The probability as a fraction, 0.6 for 60%. */
  probability: number | null
  /** The close date, as "YYYY-MM-DD". */
  closeDate: string
  /** Whether the opportunity is closed. */
  closed: boolean
  /** The owner's user Id. */
  ownerId: string
}

/** A case row, as a Cases list view holds it. */
export interface ListViewFiltersCaseRow {
  /** The case's subject. */
  subject: string
  /** The Status picklist value. */
  status: string
  /** The Priority picklist value. */
  priority: string
  /** The owner's user Id. */
  ownerId: string
}

const signedInUserId = "005Dn000003EllenH"

export const listViewFiltersAccountSchema: ListViewFilterSchema<ListViewFiltersAccountRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Account Name",
        type: "text",
        read: (account) => account.name,
      },
      {
        id: "Phone",
        label: "Phone",
        type: "text",
        nullable: true,
        read: (account) => account.phone,
      },
      {
        id: "Type",
        label: "Type",
        type: "picklist",
        nullable: true,
        options: [
          { value: "Customer - Direct", label: "Customer - Direct" },
          { value: "Customer - Channel", label: "Customer - Channel" },
          { value: "Prospect", label: "Prospect" },
          { value: "Partner", label: "Partner" },
        ],
        read: (account) => account.type,
      },
    ],
    owner: {
      allLabel: "All accounts",
      mineLabel: "My accounts",
      currentUserId: signedInUserId,
      read: (account) => account.ownerId,
    },
  }

export const listViewFiltersDirectCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
  ],
  logic: null,
}

export const listViewFiltersCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Channel",
    },
    {
      field: "Name",
      type: "text",
      operator: "not-contains",
      value: "Test",
    },
  ],
  logic: "(1 OR 2) AND 3",
}

export const listViewFiltersOpportunitySchema: ListViewFilterSchema<ListViewFiltersOpportunityRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Opportunity Name",
        type: "text",
        read: (opportunity) => opportunity.name,
      },
      {
        id: "StageName",
        label: "Stage",
        type: "picklist",
        options: [
          { value: "Prospecting", label: "Prospecting" },
          { value: "Qualification", label: "Qualification" },
          { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
          { value: "Negotiation/Review", label: "Negotiation/Review" },
          { value: "Closed Won", label: "Closed Won" },
          { value: "Closed Lost", label: "Closed Lost" },
        ],
        read: (opportunity) => opportunity.stage,
      },
      {
        id: "Amount",
        label: "Amount",
        type: "currency",
        currencyCode: "USD",
        nullable: true,
        read: (opportunity) => opportunity.amount,
      },
      {
        id: "Probability",
        label: "Probability (%)",
        type: "percent",
        nullable: true,
        read: (opportunity) => opportunity.probability,
      },
      {
        id: "CloseDate",
        label: "Close Date",
        type: "date",
        today: "2026-06-18",
        read: (opportunity) => opportunity.closeDate,
      },
      {
        id: "IsClosed",
        label: "Closed",
        type: "boolean",
        read: (opportunity) => opportunity.closed,
      },
    ],
    owner: {
      allLabel: "All opportunities",
      mineLabel: "My opportunities",
      currentUserId: signedInUserId,
      read: (opportunity) => opportunity.ownerId,
    },
  }

export const listViewFiltersOpenPipeline: ListViewFiltersValue = {
  owner: "mine",
  filters: [
    {
      field: "IsClosed",
      type: "boolean",
      operator: "equals",
      value: false,
    },
    {
      field: "Amount",
      type: "currency",
      operator: "greater-than",
      value: 50000,
    },
    {
      field: "CloseDate",
      type: "date",
      operator: "less-or-equal",
      value: "2026-09-30",
    },
  ],
  logic: "1 AND (2 OR 3)",
}

export const listViewFiltersCaseSchema: ListViewFilterSchema<ListViewFiltersCaseRow> =
  {
    fields: [
      {
        id: "Subject",
        label: "Subject",
        type: "text",
        read: (supportCase) => supportCase.subject,
      },
      {
        id: "Status",
        label: "Status",
        type: "picklist",
        options: [
          { value: "New", label: "New" },
          { value: "Working", label: "Working" },
          { value: "Escalated", label: "Escalated" },
          { value: "Closed", label: "Closed" },
        ],
        read: (supportCase) => supportCase.status,
      },
      {
        id: "Priority",
        label: "Priority",
        type: "picklist",
        options: [
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ],
        read: (supportCase) => supportCase.priority,
      },
    ],
    owner: {
      allLabel: "All cases",
      mineLabel: "My cases",
      currentUserId: signedInUserId,
      read: (supportCase) => supportCase.ownerId,
    },
    lockedFilters: [
      {
        key: "open-cases",
        condition: {
          field: "Status",
          type: "picklist",
          operator: "not-equal",
          value: "Closed",
        },
        reason: "This view shows open cases only.",
      },
    ],
  }
```
