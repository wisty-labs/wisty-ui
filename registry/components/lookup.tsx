"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Icon } from "@/components/wisty/icon"
import { Pill, PillGroup } from "@/components/wisty/pill"

type IconName = React.ComponentProps<typeof Icon>["name"]

type LookupRecord = {
  /** Unique id, like a Salesforce record id. Selection compares ids. */
  id: string
  /** The record's name: in results, in the field and in pills. */
  name: string
  /** A second line under the name in results, like "Account • Austin, TX". */
  meta?: string
  /** The object icon, like "standard:account". Defaults to the lookup's icon. */
  icon?: IconName
  /** Shown in results, but can't be picked. */
  disabled?: boolean
}

type LookupSearch = (
  term: string,
  options: { signal: AbortSignal }
) => Promise<readonly LookupRecord[]>

type LookupProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "children" | "type"
> & {
  /** Records to show. Without onSearch they're filtered by name as people type. */
  records?: readonly LookupRecord[]
  /** Finds records for a term of two characters or more; its signal aborts when a newer search starts. */
  onSearch?: LookupSearch
  /** The object icon for records that don't name their own. */
  icon?: IconName
  /** Classes for the lookup's wrapper. Other props go to the input. */
  className?: string
} & (
    | {
        /** One record, shown in the field. */
        multiple?: false
        value?: LookupRecord | null
        defaultValue?: LookupRecord | null
        onValueChange?: (value: LookupRecord | null) => void
      }
    | {
        /** Several records, shown as pills below the field. */
        multiple: true
        value?: readonly LookupRecord[]
        defaultValue?: readonly LookupRecord[]
        onValueChange?: (value: LookupRecord[]) => void
      }
  )

const minSearchLength = 2
const searchDelay = 300

type SearchState =
  | { status: "idle" }
  | { status: "loading"; records?: readonly LookupRecord[] }
  | { status: "done"; records: readonly LookupRecord[] }
  | { status: "error" }

const matches = (record: LookupRecord, term: string) =>
  record.name.toLocaleLowerCase().includes(term.toLocaleLowerCase())

// The name with the first match of the term in bold.
function LookupRecordName({ name, term }: { name: string; term: string }) {
  const start = term
    ? name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())
    : -1
  if (start < 0) return name
  const end = start + term.length
  return (
    <>
      {name.slice(0, start)}
      <mark className="bg-transparent font-(--lookup-mark-weight) text-inherit">
        {name.slice(start, end)}
      </mark>
      {name.slice(end)}
    </>
  )
}

function Lookup({
  records = [],
  onSearch,
  icon,
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
  name,
  ref,
  className,
  placeholder,
  onKeyDown,
  ...props
}: LookupProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") return ref(node)
      if (ref) ref.current = node
    },
    [ref]
  )

  // Selected records, always as a list: one at most without `multiple`.
  const toList = (
    value: LookupRecord | readonly LookupRecord[] | null | undefined
  ) =>
    value == null
      ? []
      : Array.isArray(value)
        ? [...value]
        : [value as LookupRecord]
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    toList(defaultValue)
  )
  const selected = valueProp !== undefined ? toList(valueProp) : uncontrolled
  const select = (next: LookupRecord[]) => {
    if (valueProp === undefined) setUncontrolled(next)
    if (multiple) (onValueChange as (value: LookupRecord[]) => void)?.(next)
    else
      (onValueChange as (value: LookupRecord | null) => void)?.(next[0] ?? null)
  }
  const single = !multiple ? (selected[0] ?? null) : null

  const [term, setTerm] = React.useState("")
  const [wantOpen, setWantOpen] = React.useState(false)
  const [search, setSearch] = React.useState<SearchState>({ status: "idle" })

  // The pending search: its timer and the controller that aborts it.
  const pending = React.useRef<{
    timer?: ReturnType<typeof setTimeout>
    controller?: AbortController
  }>({})
  const cancelSearch = React.useCallback(() => {
    clearTimeout(pending.current.timer)
    pending.current.controller?.abort()
    pending.current = {}
  }, [])
  // Cancels a pending search when the lookup unmounts.
  const rootRef = React.useCallback(() => cancelSearch, [cancelSearch])

  const startSearch = (text: string) => {
    cancelSearch()
    const query = text.trim()
    if (!onSearch || query.length < minSearchLength) {
      setSearch({ status: "idle" })
      return
    }
    setSearch((previous) => ({
      status: "loading",
      records:
        previous.status === "done" || previous.status === "loading"
          ? previous.records
          : undefined,
    }))
    pending.current.timer = setTimeout(() => {
      const controller = new AbortController()
      pending.current.controller = controller
      onSearch(query, { signal: controller.signal }).then(
        (found) => {
          if (controller.signal.aborted) return
          setSearch({ status: "done", records: found })
        },
        () => {
          if (controller.signal.aborted) return
          setSearch({ status: "error" })
        }
      )
    }, searchDelay)
  }

  const query = term.trim()
  const searching = !!onSearch && query.length >= minSearchLength
  let shown: readonly LookupRecord[]
  if (!searching) {
    shown = onSearch
      ? records
      : records.filter((record) => matches(record, query))
  } else if (search.status === "done") {
    shown = search.records
  } else if (search.status === "loading") {
    // Earlier results, narrowed to the new term, until the search returns.
    shown = (search.records ?? []).filter((record) => matches(record, query))
  } else {
    shown = []
  }
  const selectedIds = new Set(selected.map((record) => record.id))
  shown = shown.filter((record) => !selectedIds.has(record.id))

  const loading = search.status === "loading" && searching
  let message: string | null = null
  if (searching && search.status === "error") {
    message = "Something went wrong. Try again."
  } else if (shown.length === 0 && query && !loading) {
    message = `No results for "${query}"`
  }
  const status =
    searching && search.status === "done" && shown.length > 0
      ? `${shown.length} ${shown.length === 1 ? "result" : "results"}`
      : loading
        ? "Loading results"
        : ""

  const open =
    wantOpen && !single && !disabled && (shown.length > 0 || message !== null)

  const clear = () => {
    select([])
    setTerm("")
    inputRef.current?.focus()
  }

  const recordIcon = (record: LookupRecord) => record.icon ?? icon

  return (
    <div
      ref={rootRef}
      data-slot="lookup"
      className={cn("flex w-full min-w-0 flex-col", className)}
    >
      <Combobox<LookupRecord, boolean>
        items={shown}
        filter={null}
        multiple={multiple}
        value={multiple ? selected : single}
        onValueChange={(next) => {
          cancelSearch()
          setSearch({ status: "idle" })
          setTerm("")
          // Base UI also clears a closed field's value on Escape; with
          // nothing selected, that only clears the text.
          const picked = toList(next as LookupRecord | LookupRecord[] | null)
          const ids = (list: LookupRecord[]) =>
            list.map((record) => record.id).join("\n")
          if (ids(picked) !== ids(selected)) select(picked)
          // A pick closes the list; Base UI keeps a multiple list open after a click.
          setWantOpen(false)
        }}
        inputValue={single ? single.name : term}
        onInputValueChange={(text, details) => {
          // Only typing changes the term: Base UI also writes the input on a
          // pick and clears it when the list closes.
          if (single || details.reason !== "input-change") return
          setTerm(text)
          startSearch(text)
        }}
        open={open}
        onOpenChange={setWantOpen}
        itemToStringLabel={(record) => record.name}
        itemToStringValue={(record) => record.id}
        isItemEqualToValue={(record, value) => record.id === value.id}
        readOnly={!!single}
        disabled={disabled}
        required={required}
        name={name}
      >
        {/* The input's own end addon holds nothing here. */}
        <ComboboxInput
          ref={setInputRef}
          showTrigger={false}
          placeholder={single ? undefined : placeholder}
          disabled={disabled}
          className={cn(
            "*:data-[align=inline-end]:empty:hidden",
            single &&
              "has-[>[data-align=inline-start]]:[&>input]:ps-3 has-[>input[readonly]]:border-border-strong has-[>input[readonly]]:bg-background has-[>input[readonly]]:shadow-(--lookup-selection-shadow) has-[>input[readonly]:focus]:border-transparent has-[>input[readonly]:focus]:shadow-(--input-shadow-focus)"
          )}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (
              single &&
              !disabled &&
              (event.key === "Backspace" || event.key === "Delete")
            ) {
              event.preventDefault()
              clear()
            }
          }}
          {...props}
        >
          {single && recordIcon(single) && (
            <InputGroupAddon align="inline-start" className="ps-1">
              <Icon
                name={recordIcon(single)!}
                size="small"
                className="[&_svg]:size-5"
              />
            </InputGroupAddon>
          )}
          <InputGroupAddon align="inline-end" className="gap-0.5">
            {single ? (
              <InputGroupButton
                size="icon-xs"
                aria-label="Remove selected option"
                title="Remove selected option"
                disabled={disabled}
                onClick={clear}
              >
                <XIcon className="size-3.5" />
              </InputGroupButton>
            ) : (
              <>
                {loading && (
                  <Spinner
                    aria-hidden="true"
                    className="me-4 rotate-90 text-(--lookup-spinner)"
                  />
                )}
                <SearchIcon />
              </>
            )}
          </InputGroupAddon>
          {/* An explicit aria-live: Base UI hides everything outside the field
              and list while the list is open, except aria-live elements. */}
          <output aria-live="polite" className="sr-only">
            {status}
          </output>
        </ComboboxInput>
        <ComboboxContent>
          <ComboboxEmpty>{message}</ComboboxEmpty>
          <ComboboxList>
            {(record: LookupRecord) => (
              <ComboboxItem
                key={record.id}
                value={record}
                disabled={record.disabled}
                className={cn(
                  "gap-2 py-1 ps-3",
                  record.meta ? "items-start" : "items-center"
                )}
              >
                {recordIcon(record) && (
                  <Icon
                    name={recordIcon(record)!}
                    size="small"
                    className={cn(
                      record.meta && "mt-1",
                      record.disabled && "bg-current"
                    )}
                  />
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="mb-0.5 truncate" title={record.name}>
                    <LookupRecordName name={record.name} term={query} />
                  </span>
                  {record.meta && (
                    <span className="-mt-1 truncate text-muted-foreground in-data-disabled:text-current">
                      {record.meta}
                    </span>
                  )}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {multiple && selected.length > 0 && (
        <PillGroup
          aria-label="Selected records"
          className="min-h-0 rounded-none border-0 bg-transparent p-0 pb-0.5 [&_[data-slot=pill-list]]:gap-y-0 [&_[role=presentation]]:px-0.5 [&_[role=presentation]]:pt-0.5"
        >
          {selected.map((record) => (
            <Pill
              key={record.id}
              icon={recordIcon(record) && <Icon name={recordIcon(record)!} />}
              onRemove={
                disabled
                  ? undefined
                  : () => {
                      const rest = selected.filter(
                        (other) => other.id !== record.id
                      )
                      // Focus returns to the field when the last pill goes.
                      if (rest.length === 0) inputRef.current?.focus()
                      select(rest)
                    }
              }
            >
              {record.name}
            </Pill>
          ))}
        </PillGroup>
      )}
    </div>
  )
}

export { Lookup, type LookupRecord, type LookupSearch }
