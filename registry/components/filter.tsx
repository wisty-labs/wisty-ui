"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Trash2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type FilterState = "unchanged" | "new" | "changed"

type FilterContextValue = {
  status: FilterState
  invalid: boolean
  locked: boolean
  errorId: string
}

const FilterContext = React.createContext<FilterContextValue | null>(null)

function useFilter() {
  const context = React.useContext(FilterContext)
  if (!context) throw new Error("Filter parts must be inside a Filter.")
  return context
}

const filterItemVariants = cva(
  "flex items-center gap-2 rounded-(--radius-2) border p-3 hover:bg-(--filter-item-background-hover)",
  {
    variants: {
      look: {
        unchanged: "bg-(--panel-background)",
        edited:
          "bg-(--field-edited-background) text-(--field-static-foreground)",
        locked: "bg-(--filter-item-background-locked)",
      },
      invalid: {
        true: "border-(--input-border-invalid)",
        false: "border-border",
      },
    },
    defaultVariants: { look: "unchanged", invalid: false },
  }
)

/** One criterion people press to edit: its item, an optional marker, its error and its editor. */
function Filter({
  status = "unchanged",
  invalid = false,
  locked = false,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Whether the criterion is saved, new or changed since it was saved. Default "unchanged". */
  status?: FilterState
  /** The criterion can't be applied; write its reason in FilterError. */
  invalid?: boolean
  /** Shown but never edited or removed: the trigger is disabled and the editor never opens. */
  locked?: boolean
  /** Whether the editor is open, controlled. */
  open?: boolean
  /** Whether the editor is open at first, uncontrolled. */
  defaultOpen?: boolean
  /** Called when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void
}) {
  const errorId = React.useId()
  const context = React.useMemo(
    () => ({ status, invalid, locked, errorId }),
    [status, invalid, locked, errorId]
  )
  return (
    <FilterContext.Provider value={context}>
      <Popover
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <div
          data-slot="filter"
          className={cn(
            "grid grid-cols-[auto_minmax(0,1fr)] has-[>[data-slot=filter-marker]]:gap-x-2 [&>:not([data-slot=filter-marker])]:col-start-2",
            className
          )}
          {...props}
        />
      </Popover>
    </FilterContext.Provider>
  )
}

function FilterMarker({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="filter-marker"
      aria-hidden="true"
      className={cn("col-start-1 row-start-1 w-4 pt-3.25 text-end", className)}
      {...props}
    />
  )
}

function FilterItem({ className, ...props }: React.ComponentProps<"div">) {
  const { status, invalid, locked } = useFilter()
  return (
    <div
      data-slot="filter-item"
      className={cn(
        filterItemVariants({
          look: locked
            ? "locked"
            : status === "unchanged"
              ? "unchanged"
              : "edited",
          invalid,
        }),
        className
      )}
      {...props}
    />
  )
}

function FilterTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { status, invalid, locked, errorId } = useFilter()
  const shared = {
    "data-slot": "filter-trigger",
    type: "button" as const,
    "aria-describedby": invalid ? errorId : undefined,
    className: cn(
      "-my-3 -ms-3 flex min-w-0 grow flex-col items-start self-stretch rounded-(--radius-2) py-3 ps-3 text-start outline-none focus-visible:shadow-(--shadow-focus)",
      className
    ),
  }
  const content = (
    <>
      {children}
      {status === "unchanged" ? null : (
        <>
          {" "}
          <span className="sr-only">
            {status === "new" ? "Not saved" : "Changed, not saved"}
          </span>
        </>
      )}
    </>
  )
  if (locked) {
    return (
      <button {...shared} disabled {...props}>
        {content}
      </button>
    )
  }
  return (
    <PopoverTrigger {...shared} {...props}>
      {content}
    </PopoverTrigger>
  )
}

function FilterProperty({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <>
      {" "}
      <span
        data-slot="filter-property"
        className={cn("text-xs", className)}
        {...props}
      />
    </>
  )
}

function FilterStatus(props: React.ComponentProps<"span">) {
  const { status } = useFilter()
  if (status === "unchanged") return null
  return (
    <span data-slot="filter-status" aria-hidden="true" {...props}>
      *
    </span>
  )
}

function FilterPredicate(props: React.ComponentProps<"span">) {
  return (
    <>
      {" "}
      <span data-slot="filter-predicate" {...props} />
    </>
  )
}

function FilterRemove({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { locked } = useFilter()
  if (locked) return null
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      data-slot="filter-remove"
      className={cn("text-link", className)}
      {...props}
    >
      {children ?? <Trash2Icon className="size-4" />}
    </Button>
  )
}

function FilterError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { errorId } = useFilter()
  if (!children) return null
  return (
    <p
      id={errorId}
      data-slot="filter-error"
      className={cn("mt-1 text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function FilterContent({
  side = "left",
  align = "end",
  sideOffset = 10,
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const { locked } = useFilter()
  if (locked) return null
  return (
    <PopoverContent
      data-slot="filter-content"
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "w-[min(25rem,calc(100vw-2rem))] gap-6 px-5 pt-6 pb-2 before:absolute before:-right-2 before:bottom-4 before:hidden before:size-4 before:rotate-45 before:bg-inherit after:absolute after:-right-2 after:bottom-4 after:-z-10 after:hidden after:size-4 after:rotate-45 after:bg-inherit after:shadow-(--filter-content-nubbin-shadow) data-[side=left]:before:block data-[side=left]:after:block",
        className
      )}
      {...props}
    />
  )
}

export {
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
}
