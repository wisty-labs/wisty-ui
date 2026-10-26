"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background text-(length:--calendar-font-size) [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 p-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 text-(--button-icon-foreground) select-none aria-disabled:pointer-events-none aria-disabled:text-disabled",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 text-(--button-icon-foreground) select-none aria-disabled:pointer-events-none aria-disabled:text-disabled",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "m-1 flex h-(--cell-size) items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-2",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative h-(--control-height) rounded-(--input-radius) border border-input bg-background has-focus-visible:border-(--input-border-focus) has-focus-visible:shadow-(--input-shadow-focus)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-normal select-none",
          captionLayout === "label"
            ? "text-popover-foreground"
            : "flex h-full items-center gap-2 ps-2 pe-1.5 text-popover-foreground [&>svg]:size-3.5 [&>svg]:text-(--select-icon)",
          defaultClassNames.caption_label
        ),
        month_grid: cn(
          "w-full border-collapse [--day-bg-hover:var(--selected)] [--day-bg:transparent] [--day-ring:0_0_#0000] [--day-fg:var(--calendar-day-foreground)] [--day-focus:var(--calendar-day-shadow-focus)]",
          defaultClassNames.month_grid
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 p-2 text-center font-normal text-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "box-content w-(--cell-size) p-1 select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "p-1 text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative p-1 text-center select-none",
          defaultClassNames.day
        ),
        selected: cn(
          "data-[selected=true]:[--day-bg-hover:var(--primary)] data-[selected=true]:[--day-bg:var(--primary)] data-[selected=true]:[--day-fg:var(--primary-foreground)] data-[selected=true]:[--day-focus:var(--shadow-focus-outset)]",
          defaultClassNames.selected
        ),
        range_start: cn(
          "before:absolute before:inset-y-1 before:start-[var(--strip-start,0)] before:end-[var(--strip-end,0)] before:bg-primary [--day-ring:var(--today-ring,0_0_#0000)] [--strip-start:50%]",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "before:absolute before:inset-y-1 before:start-[var(--strip-start,0)] before:end-[var(--strip-end,0)] before:bg-primary [--day-ring:var(--today-ring,0_0_#0000)]",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "before:absolute before:inset-y-1 before:start-[var(--strip-start,0)] before:end-[var(--strip-end,0)] before:bg-primary [--day-ring:var(--today-ring,0_0_#0000)] [--strip-end:50%]",
          defaultClassNames.range_end
        ),
        today: cn(
          "[--day-bg:var(--selected)] [--day-fg:var(--link)] [--today-ring:inset_0_0_0_1px_var(--border-inverse)]",
          defaultClassNames.today
        ),
        outside: cn(
          "[--day-fg:var(--muted-foreground)]",
          defaultClassNames.outside
        ),
        disabled: cn(
          "[--day-bg-hover:transparent] [--day-fg:var(--calendar-day-disabled)]",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-3.5 rtl:rotate-180", className)}
                {...props}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-3.5 rtl:rotate-180", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-3.5", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex size-(--cell-size) min-w-(--cell-size) flex-col gap-1 rounded-full border-0 bg-(--day-bg) p-0 text-(length:--calendar-font-size) leading-none font-normal text-(--day-fg) shadow-(--day-ring) hover:bg-(--day-bg-hover) hover:text-(--day-fg) focus-visible:text-(--day-fg) focus-visible:shadow-(--day-focus) active:text-(--day-fg) disabled:text-(--day-fg) [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
