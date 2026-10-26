"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type GroupItem = {
  index: number
  count: number
  active: boolean
  setActive: (index: number) => void
}

const PillGroupItemContext = React.createContext<GroupItem | null>(null)

const pillLabel = "min-w-0 truncate"

function Pill({
  href,
  icon,
  onRemove,
  removeLabel = "Remove",
  invalid = false,
  className,
  children,
  onFocus,
  ...props
}: Omit<React.ComponentProps<"span">, "onKeyDown"> & {
  /** Makes the label a link. */
  href?: string
  /** An Icon or Avatar before the label. */
  icon?: React.ReactNode
  /** Shows a remove control, and is called when it's used. */
  onRemove?: () => void
  /** The remove button's accessible name. */
  removeLabel?: string
  /** Marks the pill as an error. */
  invalid?: boolean
}) {
  const item = React.useContext(PillGroupItemContext)
  const title = typeof children === "string" ? children : undefined

  const iconSlot = icon ? (
    <span
      data-slot="pill-icon"
      className={cn(
        "flex size-4 shrink-0 *:size-4 *:shrink-0 [&_svg]:size-4 [&_[data-slot=avatar-fallback]]:text-[0.625rem]",
        href ? "absolute start-2 top-1/2 -translate-y-1/2" : "me-1"
      )}
    >
      {icon}
    </span>
  ) : null

  const pillClasses = cn(
    "group/pill relative inline-flex h-6 max-w-full items-center rounded-(--radius-pill) bg-(--pill-background) text-(length:--pill-font-size) leading-(--pill-line-height) text-foreground hover:bg-(--pill-background-hover) [[data-slot=pill]+&]:ms-1",
    href
      ? "items-stretch has-[a:focus-visible]:shadow-(--pill-shadow-focus)"
      : "border border-border-strong ps-2",
    invalid && "border-(--pill-border-invalid) hover:bg-secondary",
    className
  )
  const labelClasses = cn(
    pillLabel,
    invalid && "font-normal text-(--pill-foreground-invalid)"
  )

  if (item) {
    const optionsOf = (element: HTMLElement) => [
      ...(element
        .closest("[role=listbox]")
        ?.querySelectorAll<HTMLElement>("[role=option]") ?? []),
    ]
    // Focus the pill that takes this one's place: the next one, or the
    // previous one when this is the last. The only pill leaves focus on the
    // listbox.
    const remove = (option: HTMLElement) => {
      if (!onRemove) return
      const last = item.index === item.count - 1
      const target = last ? item.index - 1 : item.index + 1
      if (item.count === 1) {
        option.closest<HTMLElement>("[role=listbox]")?.focus()
      } else {
        optionsOf(option)[target]?.focus()
        item.setActive(last ? target : item.index)
      }
      onRemove()
    }

    return (
      <span
        data-slot="pill"
        data-invalid={invalid || undefined}
        role="option"
        aria-selected="true"
        tabIndex={item.active ? 0 : -1}
        className={cn(
          pillClasses,
          "outline-none focus-visible:shadow-(--pill-shadow-focus)"
        )}
        onFocus={(event) => {
          onFocus?.(event)
          item.setActive(item.index)
        }}
        onKeyDown={(event) => {
          const move = (to: number) => {
            const next = (to + item.count) % item.count
            item.setActive(next)
            optionsOf(event.currentTarget)[next]?.focus()
          }
          if (event.key === "ArrowRight") move(item.index + 1)
          else if (event.key === "ArrowLeft") move(item.index - 1)
          else if (event.key === "Backspace" || event.key === "Delete")
            remove(event.currentTarget)
          else return
          event.preventDefault()
        }}
        {...props}
      >
        {iconSlot}
        <span data-slot="pill-label" className={labelClasses} title={title}>
          {children}
        </span>
        {onRemove && (
          <span
            data-slot="pill-remove"
            aria-hidden="true"
            title={removeLabel}
            className="box-content flex size-4 shrink-0 items-center justify-start rounded-(--icon-radius) p-1 leading-none text-(--icon-foreground)"
            onClick={(event) =>
              remove(event.currentTarget.closest<HTMLElement>("[role=option]")!)
            }
          >
            <XIcon className="size-3" />
          </span>
        )}
      </span>
    )
  }

  return (
    <span
      data-slot="pill"
      data-invalid={invalid || undefined}
      className={pillClasses}
      {...props}
    >
      {iconSlot}
      {href ? (
        <a
          data-slot="pill-action"
          href={href}
          title={title}
          className={cn(
            "flex min-w-0 grow overflow-hidden rounded-[inherit] border border-input py-1 ps-2 text-ellipsis whitespace-nowrap text-link no-underline outline-none hover:text-link-hover focus-visible:text-link-hover",
            icon && "ps-7",
            onRemove && "pe-6"
          )}
        >
          <span
            data-slot="pill-label"
            className={cn(labelClasses, "self-center")}
          >
            {children}
          </span>
        </a>
      ) : (
        <span data-slot="pill-label" className={labelClasses} title={title}>
          {children}
        </span>
      )}
      {onRemove && (
        <Button
          data-slot="pill-remove"
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={removeLabel}
          title={removeLabel}
          className={cn(
            "box-content size-4 shrink-0 justify-start p-1 text-(length:--pill-font-size) leading-none whitespace-normal text-(--button-icon-foreground) focus-visible:shadow-(--shadow-focus)",
            href && "absolute end-0 top-1/2 -translate-y-1/2",
            invalid && "text-destructive"
          )}
          onClick={onRemove}
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </span>
  )
}

function PillGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Names the group for screen readers, like "Selected accounts". */
  "aria-label": string
}) {
  const hintId = React.useId()
  const [active, setActive] = React.useState(0)
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const tabStop = Math.min(active, items.length - 1)

  return (
    <div
      data-slot="pill-group"
      className={cn(
        "flex min-h-[calc(1.625rem+2px)] rounded-(--radius-4) border border-input bg-(--pill-container-background) p-1",
        className
      )}
    >
      <span id={hintId} className="sr-only">
        Press delete or backspace to remove
      </span>
      <div
        data-slot="pill-list"
        role="listbox"
        aria-orientation="horizontal"
        aria-describedby={hintId}
        tabIndex={-1}
        className="inline-flex min-w-0 flex-wrap items-center gap-y-0.5 outline-none"
        {...props}
      >
        {items.map((child, index) => (
          <div
            key={child.key ?? index}
            role="presentation"
            className="flex max-w-full [&+&]:ps-0.5"
          >
            <PillGroupItemContext
              value={{
                index,
                count: items.length,
                active: index === tabStop,
                setActive,
              }}
            >
              {child}
            </PillGroupItemContext>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Pill, PillGroup }
