"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icon } from "@/components/wisty/icon"
import { cn } from "@/lib/utils"

type DualListboxOption = {
  /** What the option submits, and what `value` holds. */
  value: string
  /** What the option shows. */
  label: string
}

type ListName = "source" | "selected"

type DualListboxProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "role"
> & {
  /** Every option, in the order the source list shows them. */
  options: readonly DualListboxOption[]
  /** The source list's label, like "Available". */
  sourceLabel: string
  /** The selected list's label, like "Selected". */
  selectedLabel: string
  /** The selected options' values, in the selected list's order. Controlled. */
  value?: readonly string[]
  defaultValue?: readonly string[]
  /** Called with the selected values after a move or a reorder. */
  onValueChange?: (value: string[]) => void
  /** Values that are always selected and can't be removed. They lead the selected list, with a lock. */
  requiredOptions?: readonly string[]
  /** The fewest options the selected list may hold. A move that leaves fewer is refused. */
  min?: number
  /** The most options the selected list may hold. A move that adds more is refused. */
  max?: number
  /** At least one option must be selected. */
  required?: boolean
  /** Disables both lists and every button. */
  disabled?: boolean
  /** Hides the up and down buttons. */
  disableReordering?: boolean
  /** How many options each list shows before it scrolls. */
  size?: number
  /** Covers the source list with a spinner and disables the move buttons. */
  loading?: boolean
  /** Submits the selected values with a form, one entry per value; an invalid selection blocks the submit. */
  name?: string
  /** The id of a form the values belong to, outside it. */
  form?: string
  /** The add button's name and tooltip. Defaults to "Move selection to" and the selected list's label. */
  addButtonLabel?: string
  /** The remove button's name and tooltip. Defaults to "Move selection to" and the source list's label. */
  removeButtonLabel?: string
  upButtonLabel?: string
  downButtonLabel?: string
  /** The error when `required` and nothing is selected. */
  messageWhenValueMissing?: string
  /** The error when more than `max` options would be selected. */
  messageWhenRangeOverflow?: string
  /** The error when fewer than `min` options would be selected. */
  messageWhenRangeUnderflow?: string
}

const instructions =
  "Press Control and the right or left arrow to move the selected options between the lists, or Command and the arrows on a Mac. Space selects or clears an option, and Shift with the arrows selects a range."

// The same letter typed again moves to the next match, as a native select's
// type-ahead does; other letters typed within this time add to the search.
const typeAheadTimeout = 500

const plural = (count: number, one: string, many: string) =>
  count === 1 ? one : many

function DualListbox({
  className,
  options,
  sourceLabel,
  selectedLabel,
  value: valueProp,
  defaultValue,
  onValueChange,
  requiredOptions = [],
  min = 0,
  max,
  required = false,
  disabled = false,
  disableReordering = false,
  size,
  loading = false,
  name,
  form,
  addButtonLabel = `Move selection to ${selectedLabel}`,
  removeButtonLabel = `Move selection to ${sourceLabel}`,
  upButtonLabel = "Move selection up",
  downButtonLabel = "Move selection down",
  messageWhenValueMissing = "An option must be selected.",
  messageWhenRangeOverflow,
  messageWhenRangeUnderflow,
  onBlur,
  ...props
}: DualListboxProps) {
  const id = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState<readonly string[]>(
    () => defaultValue ?? []
  )
  const controlled = valueProp !== undefined
  const raw = controlled ? valueProp : uncontrolled

  // Locked options lead the selected list; values without an option are left out.
  const byValue = new Map(options.map((option) => [option.value, option]))
  const locked = new Set(requiredOptions.filter((value) => byValue.has(value)))
  const selectedValues = [
    ...new Set([...locked, ...raw.filter((value) => byValue.has(value))]),
  ]
  const selectedSet = new Set(selectedValues)
  const lists: Record<ListName, DualListboxOption[]> = {
    source: options.filter((option) => !selectedSet.has(option.value)),
    selected: selectedValues.map((value) => byValue.get(value)!),
  }
  const removable = selectedValues.filter((value) => !locked.has(value))

  // The highlight: options marked in one list at a time, to move or reorder.
  const [highlight, setHighlight] = React.useState<{
    list: ListName
    values: readonly string[]
  }>({ list: "source", values: [] })
  // Each list's Tab stop: the option focused last.
  const [active, setActive] = React.useState<Record<ListName, string | null>>({
    source: null,
    selected: null,
  })
  const [error, setError] = React.useState<string | null>(null)
  const [announcement, setAnnouncement] = React.useState("")

  const nodes = React.useRef(new Map<string, HTMLElement>())
  const pendingFocus = React.useRef<string | null>(null)
  const anchor = React.useRef<{ list: ListName; value: string } | null>(null)
  const typeAhead = React.useRef({ text: "", time: -Infinity })

  const valuesOf = (list: ListName) => lists[list].map((option) => option.value)
  const highlighted = (list: ListName) =>
    highlight.list === list
      ? valuesOf(list).filter(
          (value) => highlight.values.includes(value) && !locked.has(value)
        )
      : []
  const tabStop = (list: ListName) => {
    const values = valuesOf(list)
    const last = active[list]
    return last !== null && values.includes(last) ? last : (values[0] ?? null)
  }

  const underflowMessage =
    messageWhenRangeUnderflow ??
    (required
      ? plural(
          min,
          "At least 1 option must be selected.",
          `At least ${min} options must be selected.`
        )
      : plural(
          min,
          "Select at least 1 option.",
          `Select at least ${min} options.`
        ))
  const overflowMessage =
    messageWhenRangeOverflow ??
    plural(
      max ?? 0,
      "Select at most 1 option.",
      `Select at most ${max} options.`
    )
  const messageFor = (count: number) => {
    if (required && count === 0) return messageWhenValueMissing
    if (count < min) return underflowMessage
    if (max !== undefined && count > max) return overflowMessage
    return null
  }

  // Registers an element by key, and focuses it if a move asked for it.
  // The callback is new each render, so React runs it after every commit.
  const register = (key: string) => (node: HTMLElement | null) => {
    if (!node) return
    nodes.current.set(key, node)
    if (pendingFocus.current === key) {
      pendingFocus.current = null
      node.focus()
    }
    return () => {
      if (nodes.current.get(key) === node) nodes.current.delete(key)
    }
  }

  function announce(text: string) {
    // A repeated message only reads again if the text changes.
    setAnnouncement((previous) => (previous === text ? `${text} ` : text))
  }

  function commit(next: string[]) {
    if (!controlled) setUncontrolled(next)
    onValueChange?.(next)
    if (error !== null) setError(messageFor(next.length))
  }

  function focusOption(list: ListName, value: string) {
    setActive((previous) => ({ ...previous, [list]: value }))
    nodes.current.get(`${list}:${value}`)?.focus()
  }

  function selectOnly(list: ListName, value: string) {
    if (locked.has(value)) return
    anchor.current = { list, value }
    setHighlight({ list, values: [value] })
  }

  function toggle(list: ListName, value: string) {
    if (locked.has(value)) return
    anchor.current = { list, value }
    const current = highlighted(list)
    setHighlight({
      list,
      values: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    })
  }

  // Highlights every option from the anchor to `value`, replacing the
  // highlight. Without an anchor in this list, `from` becomes the anchor.
  function selectRange(list: ListName, value: string, from: string) {
    const values = valuesOf(list)
    if (
      anchor.current?.list !== list ||
      !values.includes(anchor.current.value)
    ) {
      anchor.current = { list, value: from }
    }
    const start = values.indexOf(anchor.current.value)
    const end = values.indexOf(value)
    const [low, high] = start < end ? [start, end] : [end, start]
    setHighlight({
      list,
      values: values.slice(low, high + 1).filter((item) => !locked.has(item)),
    })
  }

  function toggleAll(list: ListName) {
    const selectable = valuesOf(list).filter((value) => !locked.has(value))
    const current = highlighted(list)
    setHighlight({
      list,
      values: current.length === selectable.length ? [] : selectable,
    })
  }

  // A move that breaks max, min or required is refused and shows why. From
  // the keyboard the moved options stay highlighted and the first takes
  // focus; from a button the highlight clears and the button keeps focus.
  function move(to: ListName, from: "keyboard" | "button") {
    if (disabled || loading) return
    const source = to === "selected" ? "source" : "selected"
    const moving = highlighted(source)
    if (moving.length === 0) return
    const next =
      to === "selected"
        ? [...selectedValues, ...moving]
        : selectedValues.filter((value) => !moving.includes(value))
    const problem =
      to === "selected"
        ? max !== undefined && next.length > max
          ? overflowMessage
          : null
        : required && next.length === 0
          ? messageWhenValueMissing
          : next.length < min
            ? underflowMessage
            : null
    if (problem) {
      setError(problem)
      return
    }
    commit(next)
    const labels = moving.map((value) => byValue.get(value)!.label)
    announce(
      `${labels.join(", ")} moved to ${to === "selected" ? selectedLabel : sourceLabel}.`
    )
    // The first moved option in the order its new list shows them.
    const first =
      to === "selected"
        ? moving[0]!
        : options.find((option) => moving.includes(option.value))!.value
    const disablesButton =
      to === "selected"
        ? lists.source.length === moving.length
        : removable.length === moving.length
    if (from === "keyboard") {
      anchor.current = { list: to, value: first }
      setHighlight({ list: to, values: moving })
    } else {
      anchor.current = null
      setHighlight({ list: to, values: [] })
    }
    if (from === "keyboard" || disablesButton) {
      setActive((previous) => ({ ...previous, [to]: first }))
      pendingFocus.current = `${to}:${first}`
    }
  }

  // Moves the highlighted options in the selected list up or down by one,
  // as a block, never past a locked option or the end. They stay highlighted.
  function reorder(step: -1 | 1) {
    if (disabled) return
    const moving = highlighted("selected")
    if (moving.length === 0) return
    const values = [...selectedValues]
    const indexes = moving.map((value) => values.indexOf(value))
    const edge = step < 0 ? indexes[0]! : indexes[indexes.length - 1]!
    const neighbor = values[edge + step]
    if (neighbor === undefined || locked.has(neighbor)) return
    // Down moves the last one first; toReversed needs a newer lib target.
    const order =
      step < 0
        ? indexes
        : indexes.map((_, i) => indexes[indexes.length - 1 - i]!)
    for (const index of order) {
      ;[values[index], values[index + step]] = [
        values[index + step]!,
        values[index]!,
      ]
    }
    commit(values)
    announce(
      moving
        .map(
          (value) =>
            `${byValue.get(value)!.label} moved to position ${values.indexOf(value) + 1}.`
        )
        .join(" ")
    )
  }

  function onOptionKeyDown(
    event: React.KeyboardEvent<HTMLElement>,
    list: ListName,
    index: number
  ) {
    if (disabled) return
    pendingFocus.current = null
    const items = lists[list]
    const option = items[index]!
    const { key, shiftKey, altKey } = event
    const mod = event.ctrlKey || event.metaKey
    const handled = () => {
      event.preventDefault()
      event.stopPropagation()
    }

    if (mod && (key === "ArrowRight" || key === "ArrowLeft")) {
      handled()
      move(key === "ArrowRight" ? "selected" : "source", "keyboard")
      return
    }

    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "Home" ||
      key === "End"
    ) {
      handled()
      const target =
        key === "Home"
          ? 0
          : key === "End"
            ? items.length - 1
            : index + (key === "ArrowUp" ? -1 : 1)
      const next = items[target]
      if (!next) return
      focusOption(list, next.value)
      if (shiftKey) selectRange(list, next.value, option.value)
      else if (!mod) selectOnly(list, next.value)
      return
    }

    if (key === " " || key === "Enter") {
      handled()
      if (shiftKey) selectRange(list, option.value, option.value)
      else toggle(list, option.value)
      return
    }

    if (mod && !shiftKey && key.toLowerCase() === "a") {
      handled()
      toggleAll(list)
      return
    }

    if (!mod && !altKey && key.length === 1 && /[\p{L}\p{N}]/u.test(key)) {
      handled()
      const text =
        event.timeStamp - typeAhead.current.time < typeAheadTimeout
          ? typeAhead.current.text + key.toLowerCase()
          : key.toLowerCase()
      typeAhead.current = { text, time: event.timeStamp }
      // "aaa" cycles through the options that start with "a".
      const search = /^(.)\1+$/u.test(text) ? text[0]! : text
      const start = search.length === 1 ? index + 1 : index
      for (let offset = 0; offset < items.length; offset++) {
        const candidate = items[(start + offset) % items.length]!
        if (candidate.label.toLowerCase().startsWith(search)) {
          focusOption(list, candidate.value)
          return
        }
      }
    }
  }

  function onOptionClick(
    event: React.MouseEvent<HTMLElement>,
    list: ListName,
    value: string
  ) {
    if (disabled) return
    pendingFocus.current = null
    if (event.shiftKey) selectRange(list, value, value)
    else if (event.ctrlKey || event.metaKey) toggle(list, value)
    else selectOnly(list, value)
  }

  const addDisabled = disabled || loading || lists.source.length === 0
  const removeDisabled = disabled || loading || removable.length === 0
  const reorderDisabled = disabled || removable.length < 2

  const describedBy = error
    ? `${id}-instructions ${id}-error`
    : `${id}-instructions`

  function column(list: ListName) {
    const items = lists[list]
    const stop = tabStop(list)
    const marked = highlighted(list)
    const label = list === "source" ? sourceLabel : selectedLabel

    return (
      <div
        data-slot="dual-listbox-column"
        data-list={list}
        className="relative inline-flex w-60 min-w-24 flex-[1_1_15rem] flex-col flex-wrap overflow-hidden"
      >
        <span
          id={`${id}-${list}-label`}
          data-slot="dual-listbox-label"
          className="inline-block me-2 mb-(--label-gap) pt-1 text-(length:--label-font-size) leading-(--line-height-base) font-(--label-font-weight) break-words text-(--label-foreground)"
        >
          {label}
        </span>
        <div
          data-slot="dual-listbox-options"
          className={cn(
            "h-60 max-w-full overflow-auto rounded-(--radius-2) border py-1 text-(length:--font-size-base) leading-(--line-height-base)",
            disabled
              ? "border-disabled-border hover:cursor-not-allowed bg-disabled-container text-(--select-disabled)"
              : "border-border-strong bg-background"
          )}
          style={size ? { height: `${size * 2.25 + 1}rem` } : undefined}
        >
          <div
            role="listbox"
            id={`${id}-${list}`}
            data-slot="dual-listbox-list"
            aria-labelledby={`${id}-${list}-label`}
            aria-describedby={describedBy}
            aria-multiselectable="true"
            aria-disabled={disabled || undefined}
            aria-invalid={error ? true : undefined}
            aria-required={(list === "selected" && required) || undefined}
            aria-busy={(list === "source" && loading) || undefined}
            className="select-none"
          >
            {items.map((option, index) => {
              const isLocked = locked.has(option.value)
              return (
                <div
                  key={option.value}
                  ref={register(`${list}:${option.value}`)}
                  role="option"
                  data-slot="dual-listbox-option"
                  aria-selected={!disabled && marked.includes(option.value)}
                  aria-disabled={isLocked || undefined}
                  tabIndex={
                    disabled ? undefined : option.value === stop ? 0 : -1
                  }
                  className={cn(
                    "flex items-start px-3 py-2 outline-hidden",
                    disabled
                      ? "hover:cursor-not-allowed"
                      : "focus-visible:rounded-[6px] focus-visible:[box-shadow:var(--select-item-shadow-focus)]",
                    !disabled &&
                      (isLocked
                        ? "cursor-default text-(--select-disabled)"
                        : "hover:cursor-pointer hover:bg-accent focus:bg-accent aria-selected:bg-primary aria-selected:text-(--dual-listbox-selected-foreground) aria-selected:hover:bg-(--dual-listbox-selected-hover) aria-selected:hover:text-inverse-foreground aria-selected:focus:bg-(--dual-listbox-selected-hover) aria-selected:focus:text-inverse-foreground aria-selected:focus-visible:[box-shadow:var(--shadow-focus-inset)]")
                  )}
                  onClick={(event) => {
                    if (!isLocked) onOptionClick(event, list, option.value)
                  }}
                  onKeyDown={(event) => onOptionKeyDown(event, list, index)}
                  onFocus={() =>
                    setActive((previous) =>
                      previous[list] === option.value
                        ? previous
                        : { ...previous, [list]: option.value }
                    )
                  }
                >
                  <span className="min-w-0 flex-[0_1_auto]">
                    <span
                      className="inline-block max-w-full truncate align-middle"
                      title={option.label}
                    >
                      {option.label}
                    </span>
                  </span>
                  {isLocked ? (
                    <span className="mx-2 shrink-0">
                      <Icon
                        name="utility:lock"
                        size="x-small"
                        label={`: item cannot be removed from ${selectedLabel}`}
                        className="text-current"
                      />
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
        {list === "source" && loading ? (
          <div
            data-slot="dual-listbox-loading"
            className="absolute inset-0 z-1 flex items-center justify-center bg-(--dual-listbox-loading-overlay)"
          >
            <Spinner
              aria-label="Loading"
              className="size-6 text-(--dual-listbox-spinner)"
            />
          </div>
        ) : null}
      </div>
    )
  }

  function press(action: () => void) {
    pendingFocus.current = null
    action()
  }

  const validity = disabled ? null : messageFor(selectedValues.length)

  return (
    <TooltipProvider>
      <div
        role="group"
        data-slot="dual-listbox"
        data-disabled={disabled || undefined}
        data-invalid={error ? true : undefined}
        className={cn("flex flex-col", className)}
        onBlur={(event) => {
          onBlur?.(event)
          const root = event.currentTarget
          if (root.contains(event.relatedTarget)) return
          // A move can disable the focused button and send focus on, so
          // wait for focus to settle before validating.
          const count = selectedValues.length
          setTimeout(() => {
            if (!root.contains(document.activeElement)) {
              setError(messageFor(count))
            }
          })
        }}
        {...props}
      >
        <div data-slot="dual-listbox-lists" className="flex">
          <div aria-live="polite" className="sr-only">
            {announcement}
          </div>
          <div id={`${id}-instructions`} className="sr-only">
            {instructions}
          </div>
          {column("source")}
          <div
            data-slot="dual-listbox-actions"
            className="inline-flex flex-col"
          >
            <DualListboxAction
              ref={register("button:add")}
              label={addButtonLabel}
              disabled={addDisabled}
              onClick={() => press(() => move("selected", "button"))}
            >
              <ChevronRightIcon />
            </DualListboxAction>
            <DualListboxAction
              ref={register("button:remove")}
              label={removeButtonLabel}
              disabled={removeDisabled}
              onClick={() => press(() => move("source", "button"))}
            >
              <ChevronLeftIcon />
            </DualListboxAction>
          </div>
          {column("selected")}
          {disableReordering ? null : (
            <div
              data-slot="dual-listbox-actions"
              className="inline-flex flex-col"
            >
              <DualListboxAction
                ref={register("button:up")}
                label={upButtonLabel}
                disabled={reorderDisabled}
                onClick={() => press(() => reorder(-1))}
              >
                <ChevronUpIcon />
              </DualListboxAction>
              <DualListboxAction
                ref={register("button:down")}
                label={downButtonLabel}
                disabled={reorderDisabled}
                onClick={() => press(() => reorder(1))}
              >
                <ChevronDownIcon />
              </DualListboxAction>
            </div>
          )}
        </div>
        {error ? (
          <FieldError id={`${id}-error`} className="mt-0.5">
            {error}
          </FieldError>
        ) : null}
        {name !== undefined ? (
          <>
            {selectedValues.map((value) => (
              <input
                key={value}
                type="hidden"
                name={name}
                value={value}
                form={form}
                disabled={disabled}
              />
            ))}
            {/* Holds the selection's validity, so a form won't submit while
                it's invalid; the error shows in place of the browser's. */}
            <input
              ref={(node) => node?.setCustomValidity(validity ?? "")}
              hidden
              tabIndex={-1}
              aria-hidden="true"
              form={form}
              disabled={disabled}
              onInvalid={(event) => {
                event.preventDefault()
                setError(validity)
                const list = lists.source.length ? "source" : "selected"
                const stop = tabStop(list)
                if (stop !== null) focusOption(list, stop)
              }}
            />
          </>
        ) : null}
      </div>
    </TooltipProvider>
  )
}

// A disabled button is a plain Button: a disabled button shows no tooltip,
// and Base UI's tooltip trigger reads `disabled` as the tooltip's own.
function DualListboxAction({
  ref,
  label,
  disabled,
  onClick,
  children,
}: {
  ref: React.Ref<HTMLButtonElement>
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const spacing = "m-1 first-of-type:mt-6"
  const content = (
    <>
      {children}
      <span className="sr-only">{label}</span>
    </>
  )
  if (disabled) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        className={spacing}
      >
        {content}
      </Button>
    )
  }
  return (
    <Tooltip>
      <TooltipTrigger
        ref={ref}
        type="button"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          spacing
        )}
        onClick={onClick}
      >
        {content}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export { DualListbox, type DualListboxOption }
