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
