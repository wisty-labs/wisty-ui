"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ExpandableSectionContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
}

const ExpandableSectionContext =
  React.createContext<ExpandableSectionContextValue | null>(null)

function useExpandableSection(part: string) {
  const context = React.useContext(ExpandableSectionContext)
  if (!context)
    throw new Error(`${part} must be used inside <ExpandableSection>.`)
  return context
}

/** A titled section of a page that people open and close from its title. */
function ExpandableSection({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Whether the section is open, controlled. */
  open?: boolean
  /** Whether the section starts open, uncontrolled. Default false. */
  defaultOpen?: boolean
  /** Called when the title opens or closes the section. */
  onOpenChange?: (open: boolean) => void
}) {
  const contentId = React.useId()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  return (
    <ExpandableSectionContext.Provider value={{ open, setOpen, contentId }}>
      <div
        data-slot="expandable-section"
        data-open={open ? "" : undefined}
        data-closed={open ? undefined : ""}
        className={cn("my-2", className)}
        {...props}
      />
    </ExpandableSectionContext.Provider>
  )
}

/** The section's title: a heading holding the button that opens and closes it. */
function ExpandableSectionTrigger({
  headingLevel = 2,
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  /** The level of the heading around the button. Default 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}) {
  const section = useExpandableSection("ExpandableSectionTrigger")
  const Heading = `h${headingLevel}` as const

  return (
    <Heading
      data-slot="expandable-section-title"
      className="flex items-center rounded-(--radius-2) border border-transparent text-(length:--section-title-size) leading-[1.875rem]"
    >
      <button
        type="button"
        data-slot="expandable-section-trigger"
        aria-expanded={section.open}
        aria-controls={section.contentId}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) section.setOpen(!section.open)
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-(--radius-2) border border-transparent bg-muted px-2 text-start font-(--section-title-weight) text-foreground outline-none focus-visible:shadow-(--shadow-focus) aria-[expanded=false]:[&>svg]:-rotate-90 [&>svg]:size-3.5 [&>svg]:shrink-0",
          className
        )}
        {...props}
      >
        <ChevronDownIcon aria-hidden="true" />
        <span className="min-w-0 truncate">{children}</span>
      </button>
    </Heading>
  )
}

/** What the section holds. It stays mounted while closed, hidden. */
function ExpandableSectionContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const section = useExpandableSection("ExpandableSectionContent")

  return (
    <div
      id={section.contentId}
      data-slot="expandable-section-content"
      hidden={!section.open}
      className={cn("pt-2", className)}
      {...props}
    />
  )
}

export { ExpandableSection, ExpandableSectionContent, ExpandableSectionTrigger }
