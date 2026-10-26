"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type TreeItem = {
  /** Unique across the tree: what selection and expansion are keyed by. */
  name: string
  label: string
  /** A second line under the label, like a type or a city. */
  metatext?: string
  /** Makes the label a link. It opens on click or Enter, never on arrow keys. */
  href?: string
  /** Can't be focused, selected or opened, and neither can anything under it. */
  disabled?: boolean
  /** Before the label. Decorative: put the meaning in the label or metatext. */
  icon?: React.ReactNode
  /** After the label, at the row's end. Decorative, as icon. */
  endIcon?: React.ReactNode
  /** A branch whose children are on their way: it opens to a spinner. */
  loading?: boolean
  /** Children. An item without any is a leaf, unless it's loading. */
  items?: TreeItem[]
}

type TreeRow = {
  item: TreeItem
  level: number
  parent: string | null
  disabled: boolean
  branch: boolean
  open: boolean
}

const typeaheadTimeout = 500

const normalize = (text: string) => text.toLocaleLowerCase()

const searchTerm = (filter: string | undefined) =>
  filter ? normalize(filter.trim()) : ""

const matches = (item: TreeItem, term: string) =>
  normalize(item.label).includes(term) ||
  (item.metatext !== undefined && normalize(item.metatext).includes(term))

/**
 * The items a filter leaves: every item whose label or metatext contains it
 * (ignoring case) with all of its children, and the items above each one.
 * An empty filter leaves them all. Check `.length` for an empty result.
 */
function filterTreeItems(items: TreeItem[], filter?: string): TreeItem[] {
  const term = searchTerm(filter)
  if (!term) return items
  const visit = (list: TreeItem[]): TreeItem[] =>
    list.flatMap((item) => {
      if (matches(item, term)) return [item]
      const children = visit(item.items ?? [])
      return children.length ? [{ ...item, items: children }] : []
    })
  return visit(items)
}

// The names of the items above a match, which a filter shows open.
function openedByFilter(items: TreeItem[], term: string) {
  const opened = new Set<string>()
  const visit = (item: TreeItem): boolean => {
    let below = false
    for (const child of item.items ?? []) {
      if (visit(child)) below = true
    }
    if (below) opened.add(item.name)
    return below || matches(item, term)
  }
  items.forEach(visit)
  return opened
}

// The names from the top of the tree down to the item's parent.
function ancestorsOf(items: TreeItem[], name: string): string[] | null {
  for (const item of items) {
    if (item.name === name) return []
    const below = ancestorsOf(item.items ?? [], name)
    if (below) return [item.name, ...below]
  }
  return null
}

// The first occurrence of the term in the text, in a <mark>.
function Highlight({ text, term }: { text: string; term: string }) {
  const start = term ? normalize(text).indexOf(term) : -1
  if (start < 0) return text
  const end = start + term.length
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-(--tree-mark) text-(--tree-mark-foreground)">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  )
}

function Tree({
  items,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  filter,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "onSelect"> & {
  /** The tree's items, nested through each item's `items`. */
  items: TreeItem[]
  /** The selected item's name. `null` selects none. */
  selected?: string | null
  defaultSelected?: string | null
  /** Called with the item's name when a click or a key selects another item. */
  onSelectedChange?: (name: string) => void
  /** The names of the open items. */
  expanded?: string[]
  /** The names of the open items at first. The selected item's parents open too. */
  defaultExpanded?: string[]
  /** Called with every open item's name when one opens or closes. */
  onExpandedChange?: (names: string[]) => void
  /** Shows only the items whose label or metatext contains it, their parents open and the text marked. */
  filter?: string
}) {
  const [selectedState, setSelectedState] = React.useState(defaultSelected)
  const selected = selectedProp !== undefined ? selectedProp : selectedState
  // The selected item starts in view: its parents join the default ones.
  const [expandedState, setExpandedState] = React.useState(() => {
    const initial = selectedProp ?? defaultSelected
    const parents = initial ? (ancestorsOf(items, initial) ?? []) : []
    return [...new Set([...defaultExpanded, ...parents])]
  })
  const expanded = expandedProp ?? expandedState
  const expandedNames = new Set(expanded)

  // A filter opens the items above a match without touching `expanded`;
  // closing one of them is remembered for this filter only.
  const term = searchTerm(filter)
  const shownItems = filterTreeItems(items, filter)
  const opened = term ? openedByFilter(items, term) : new Set<string>()
  const [overrides, setOverrides] = React.useState<{
    term: string
    open: Record<string, boolean>
  }>({ term: "", open: {} })
  const filterOpen = overrides.term === term ? overrides.open : {}

  const isOpen = (name: string) =>
    term && name in filterOpen
      ? filterOpen[name]!
      : expandedNames.has(name) || opened.has(name)

  const elements = React.useRef(new Map<string, HTMLElement>())
  const typeahead = React.useRef({ text: "", time: -Infinity })

  const rows: TreeRow[] = []
  const rowByItem = new Map<TreeItem, TreeRow>()
  const walk = (
    list: TreeItem[],
    level: number,
    parent: string | null,
    parentDisabled: boolean
  ) => {
    for (const item of list) {
      const disabled = parentDisabled || Boolean(item.disabled)
      const branch = Boolean(item.loading) || Boolean(item.items?.length)
      const open = branch && isOpen(item.name)
      const row = { item, level, parent, disabled, branch, open }
      rows.push(row)
      rowByItem.set(item, row)
      if (open) walk(item.items ?? [], level + 1, item.name, disabled)
    }
  }
  walk(shownItems, 1, null, false)
  const enabledRows = rows.filter((row) => !row.disabled)
  const rowOf = (name: string | null) =>
    enabledRows.find((row) => row.item.name === name)

  // One tab stop: the selected item, or the nearest open item above it
  // when it's hidden, or the first item.
  const tabStop = (() => {
    if (rowOf(selected)) return selected
    const above = selected ? (ancestorsOf(items, selected) ?? []) : []
    for (let level = above.length - 1; level >= 0; level--) {
      if (rowOf(above[level]!)) return above[level]!
    }
    return enabledRows[0]?.item.name ?? null
  })()

  const select = (name: string) => {
    if (name === selected) return
    if (selectedProp === undefined) setSelectedState(name)
    onSelectedChange?.(name)
  }

  const setOpen = (names: string[], open: boolean) => {
    const filtered = term ? names.filter((name) => opened.has(name)) : []
    const own = names.filter((name) => !filtered.includes(name))
    if (filtered.length) {
      setOverrides({
        term,
        open: {
          ...filterOpen,
          ...Object.fromEntries(filtered.map((name) => [name, open])),
        },
      })
    }
    if (!own.length) return
    const next = open
      ? [...new Set([...expanded, ...own])]
      : expanded.filter((name) => !own.includes(name))
    if (next.length === expanded.length) return
    if (expandedProp === undefined) setExpandedState(next)
    onExpandedChange?.(next)
  }

  const toggle = (row: TreeRow) => {
    const element = elements.current.get(row.item.name)
    // Focus inside an item that closes moves to the item.
    if (
      row.open &&
      element &&
      element !== document.activeElement &&
      element.contains(document.activeElement)
    ) {
      element.focus()
    }
    setOpen([row.item.name], !row.open)
  }

  const moveTo = (row: TreeRow | undefined) => {
    if (!row) return
    elements.current.get(row.item.name)?.focus()
    select(row.item.name)
  }

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    row: TreeRow
  ) => {
    // Keys reach an item from the items nested in it too.
    if (event.target !== event.currentTarget) return
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const index = enabledRows.indexOf(row)
    if (index < 0) return

    const key = event.key
    const handled = () => event.preventDefault()
    if (key === "ArrowDown") {
      handled()
      moveTo(enabledRows[index + 1])
    } else if (key === "ArrowUp") {
      handled()
      moveTo(enabledRows[index - 1])
    } else if (key === "Home") {
      handled()
      moveTo(enabledRows[0])
    } else if (key === "End") {
      handled()
      moveTo(enabledRows[enabledRows.length - 1])
    } else if (key === "ArrowRight") {
      handled()
      if (!row.branch) return
      if (!row.open) setOpen([row.item.name], true)
      else moveTo(enabledRows.find((child) => child.parent === row.item.name))
    } else if (key === "ArrowLeft") {
      handled()
      if (row.open) setOpen([row.item.name], false)
      else moveTo(rowOf(row.parent))
    } else if (key === "Enter") {
      handled()
      // A link opens as a click on it would, which also selects the item.
      const link = event.currentTarget.querySelector<HTMLAnchorElement>(
        ':scope > [data-slot="tree-item-row"] a[href]'
      )
      if (link) link.click()
      else select(row.item.name)
    } else if (key === "*") {
      handled()
      setOpen(
        enabledRows
          .filter((other) => other.parent === row.parent && other.branch)
          .map((other) => other.item.name),
        true
      )
    } else if (key.length === 1) {
      handled()
      const buffer = typeahead.current
      const typing = event.timeStamp - buffer.time < typeaheadTimeout
      // Space selects, unless it's part of a label being typed.
      if (key === " " && !typing) {
        select(row.item.name)
        return
      }
      buffer.text = typing ? buffer.text + key : key
      buffer.time = event.timeStamp
      const text = normalize(buffer.text)
      // The same letter again moves on to the next item that starts with it.
      const query = [...text].every((letter) => letter === text[0])
        ? text[0]!
        : text
      const start = query.length === 1 ? index + 1 : index
      moveTo(
        [...enabledRows.slice(start), ...enabledRows.slice(0, start)].find(
          (other) => normalize(other.item.label).startsWith(query)
        )
      )
    }
  }
  const renderItems = (
    list: TreeItem[],
    level: number,
    parentDisabled: boolean
  ): React.ReactNode =>
    list.map((item) => {
      const row = rowByItem.get(item)
      if (!row) return null
      const { disabled, branch, open } = row
      const isSelected = item.name === selected
      const children = item.items ?? []
      return (
        <div
          key={item.name}
          ref={(element) => {
            if (!element) return
            elements.current.set(item.name, element)
            return () => {
              if (elements.current.get(item.name) === element)
                elements.current.delete(item.name)
            }
          }}
          data-slot="tree-item"
          role="treeitem"
          aria-level={level}
          aria-expanded={branch ? open : undefined}
          aria-selected={isSelected}
          aria-disabled={item.disabled && !parentDisabled ? true : undefined}
          aria-label={
            item.metatext ? `${item.label}: ${item.metatext}` : item.label
          }
          tabIndex={disabled ? undefined : item.name === tabStop ? 0 : -1}
          onKeyDown={(event) => onKeyDown(event, row)}
          // Focus styles reach the row through a child selector, so a focused
          // item never styles the rows nested inside it.
          className={cn(
            "outline-none [&:focus>[data-slot=tree-item-row]]:cursor-pointer [&:focus>[data-slot=tree-item-row]]:underline",
            item.disabled && "text-(--select-disabled)",
            isSelected
              ? "[&:focus-visible>[data-slot=tree-item-row]]:[box-shadow:inset_4px_0_0_var(--tree-accent),var(--select-item-shadow-focus)] rtl:[&:focus-visible>[data-slot=tree-item-row]]:[box-shadow:inset_-4px_0_0_var(--tree-accent),var(--select-item-shadow-focus)]"
              : "[&:focus>[data-slot=tree-item-row]]:bg-(--muted) [&:focus-visible>[data-slot=tree-item-row]]:[box-shadow:var(--select-item-shadow-focus)]"
          )}
        >
          <div
            data-slot="tree-item-row"
            className={cn(
              "flex py-[calc(0.25rem+2px)] ps-[calc(var(--tree-level)*1rem)] pe-0",
              disabled ? "hover:cursor-default" : "hover:cursor-pointer",
              isSelected
                ? "bg-(--selected) [box-shadow:inset_4px_0_0_var(--tree-accent)] rtl:[box-shadow:inset_-4px_0_0_var(--tree-accent)]"
                : !disabled && "hover:bg-(--tree-item-hover)"
            )}
            style={{ "--tree-level": level } as React.CSSProperties}
            // Focus moves with the selection on click, not on mousedown,
            // so a pressed row doesn't flash the focus gray between the
            // hover color and the selected one.
            onMouseDown={(event) => {
              if (event.button === 0) event.preventDefault()
            }}
            onClick={() => {
              if (disabled) return
              elements.current.get(item.name)?.focus()
              select(item.name)
            }}
          >
            <span
              data-slot="tree-item-toggle"
              aria-hidden="true"
              className={cn(
                "relative me-2 mt-0.5 inline-flex shrink-0 self-start border border-transparent text-(--tree-toggle) before:absolute before:-inset-1.5 hover:text-(--tree-toggle-hover)",
                !branch && "invisible"
              )}
              // A click opens or closes the item without moving focus.
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation()
                if (branch && !disabled) toggle(row)
              }}
            >
              <ChevronRightIcon
                className={cn(
                  "-m-1 size-5 transition-transform duration-200 ease-[ease-in-out] motion-reduce:transition-none",
                  open
                    ? "[transform:rotate(90deg)]"
                    : branch &&
                        "[transform:rotate(0deg)] rtl:[transform:rotate(180deg)]"
                )}
              />
            </span>
            {item.icon && (
              <span
                data-slot="tree-item-icon"
                aria-hidden="true"
                className="me-2 inline-flex h-[1lh] shrink-0 items-center"
              >
                {item.icon}
              </span>
            )}
            <span data-slot="tree-item-content" className="min-w-0 flex-1">
              {item.href && !disabled ? (
                <a
                  data-slot="tree-item-link"
                  href={item.href}
                  tabIndex={-1}
                  className="text-(--link) transition-colors duration-100 ease-linear hover:text-(--link-hover) hover:underline"
                >
                  <span data-slot="tree-item-label" className="block truncate">
                    <Highlight text={item.label} term={term} />
                  </span>
                </a>
              ) : (
                <span
                  data-slot="tree-item-label"
                  className="block truncate text-(--tree-foreground)"
                >
                  <Highlight text={item.label} term={term} />
                </span>
              )}
              {item.metatext && (
                <span
                  data-slot="tree-item-meta"
                  className={cn(
                    "block truncate",
                    !disabled && "text-(--muted-foreground)"
                  )}
                >
                  <Highlight text={item.metatext} term={term} />
                </span>
              )}
            </span>
            {item.endIcon && (
              <span
                data-slot="tree-item-end-icon"
                aria-hidden="true"
                className="mx-2 inline-flex h-[1lh] shrink-0 items-center"
              >
                {item.endIcon}
              </span>
            )}
          </div>
          {open && (
            <div
              data-slot="tree-group"
              role="group"
              aria-busy={item.loading || undefined}
            >
              {renderItems(children, level + 1, disabled)}
              {item.loading && (
                <div
                  data-slot="tree-item-loading"
                  className="flex py-[calc(0.25rem+2px)] ps-[calc(var(--tree-level)*1rem)]"
                  style={{ "--tree-level": level + 1 } as React.CSSProperties}
                >
                  <Spinner />
                </div>
              )}
            </div>
          )}
        </div>
      )
    })

  return (
    <div
      data-slot="tree-container"
      className={cn("w-full min-w-30", className)}
      {...props}
    >
      <div
        data-slot="tree"
        role="tree"
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {renderItems(shownItems, 1, false)}
      </div>
    </div>
  )
}

/** A title above a tree. Give it an id and pass that to the tree's `aria-labelledby`. */
function TreeHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tree-header"
      className={cn(
        "text-(length:--font-size-base) font-(--tree-header-weight)",
        className
      )}
      {...props}
    />
  )
}

export { Tree, TreeHeader, filterTreeItems, type TreeItem }
