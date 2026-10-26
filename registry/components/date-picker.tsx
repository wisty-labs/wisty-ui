"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type DatePickerError = "format" | "min" | "max"

type DatePickerChangeDetails = {
  /** The field's text when the value changed. */
  text: string
  /** Why the text isn't a date the field accepts. Unset when it is. */
  error?: DatePickerError
}

type DatePickerParse = (
  text: string,
  options: { locale: string }
) => string | null

type DatePickerContextValue = {
  value: string | null
  text: string
  setText: (text: string) => void
  commitText: () => void
  select: (value: string) => void
  error: DatePickerError | undefined
  /** What the input's validity says, or "" when it's valid. */
  validityMessage: string
  open: boolean
  openFrom: (source: "input" | "trigger") => void
  setOpen: (open: boolean) => void
  month: Date
  setMonth: (month: Date) => void
  min?: string
  max?: string
  today: string
  locale: string
  disabled: boolean
  readOnly: boolean
  required: boolean
  contentId: string
  controlRef: React.RefObject<HTMLDivElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
  popupRef: React.RefObject<HTMLDivElement | null>
  focusDay: boolean
  container: HTMLElement | undefined
  returnFocus: React.RefObject<boolean>
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(
  null
)

function useDatePickerContext(part: string) {
  const context = React.useContext(DatePickerContext)
  if (!context) throw new Error(`${part} must be used inside <DatePicker>.`)
  return context
}

const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/

function toIso(year: number, month: number, day: number) {
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) return null
  if (day > new Date(Date.UTC(2000, month, 0)).getUTCDate()) return null
  // February 29th only in leap years.
  if (month === 2 && day === 29 && !isLeapYear(year)) return null
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-")
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// A value as "YYYY-MM-DD" naming a real day, or null: "2023-02-29" is no day,
// and Date would roll it to March 1.
function validIso(value: string | null | undefined) {
  if (!value) return null
  const match = isoPattern.exec(value)
  if (!match) return null
  return toIso(Number(match[1]), Number(match[2]), Number(match[3]))
}

// A day as a local Date at midnight, which react-day-picker works in.
function isoToDate(iso: string) {
  const [, year, month, day] = isoPattern.exec(iso)!
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  date.setFullYear(Number(year))
  return date
}

function dateToIso(date: Date) {
  return toIso(date.getFullYear(), date.getMonth() + 1, date.getDate())!
}

function todayIso() {
  return dateToIso(new Date())
}

// The Gregorian calendar, which the grid and "YYYY-MM-DD" count in: Thai's
// default is Buddhist, and its years would read 2569 over a 2026 grid.
function gregorian(locale: string) {
  return new Intl.Locale(locale, { calendar: "gregory" }).toString()
}

// Formats a day in UTC so it never shifts with the browser's time zone.
function formatDate(
  iso: string | null,
  locale: string,
  dateStyle: "short" | "medium" | "long"
) {
  const valid = validIso(iso)
  if (!valid) return ""
  const [, year, month, day] = isoPattern.exec(valid)!
  const date = new Date(Date.UTC(2000, Number(month) - 1, Number(day)))
  date.setUTCFullYear(Number(year))
  return new Intl.DateTimeFormat(gregorian(locale), {
    dateStyle,
    timeZone: "UTC",
  }).format(date)
}

// The order of the day, month and year in a locale's dates.
function partOrder(locale: string, month: "numeric" | "short") {
  return new Intl.DateTimeFormat(gregorian(locale), {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  })
    .formatToParts(new Date(Date.UTC(2000, 10, 22)))
    .map((part) => part.type)
    .filter(
      (type): type is "day" | "month" | "year" =>
        type === "day" || type === "month" || type === "year"
    )
}

// A locale's own digits (Arabic's ٠–٩, say) as 0–9, so the field reads back
// what it shows.
function asciiDigits(text: string, locale: string) {
  const digits = new Intl.NumberFormat(locale, { useGrouping: false }).format(
    9876543210
  )
  const value = new Map([...digits].map((digit, index) => [digit, 9 - index]))
  return text.replace(/\p{Nd}/gu, (digit) => String(value.get(digit) ?? digit))
}

// Letters only: an abbreviation's punctuation goes (Hebrew's בינו׳, Hindi's
// जन॰), and inside a word it joins the word (Thai's ม.ค. reads มค).
function letters(text: string, locale: string) {
  return text
    .toLocaleLowerCase(locale)
    .replace(/(?<=[\p{L}\p{M}])[^\p{L}\p{M}\p{Nd}\s]+(?=[\p{L}\p{M}])/gu, "")
    .replace(/[^\p{L}\p{M}\p{Nd}]+/gu, " ")
}

// Each month's names, on their own and as they appear in a date (Russian's
// июнь, but 18 июня), long and short, letters only; names with digits
// (Japanese's 6月) are left out. Built once per locale: every parse needs it.
const monthNamesByLocale = new Map<string, [string, number][]>()

function monthNames(locale: string) {
  const cached = monthNamesByLocale.get(locale)
  if (cached) return cached
  const formats = [
    { month: "long" },
    { month: "short" },
    { dateStyle: "long" },
    { dateStyle: "medium" },
  ] as const
  const names: [string, number][] = []
  for (let month = 1; month <= 12; month++) {
    const date = new Date(Date.UTC(2000, month - 1, 15))
    for (const options of formats) {
      const parts = new Intl.DateTimeFormat(gregorian(locale), {
        ...options,
        timeZone: "UTC",
      }).formatToParts(date)
      const index = parts.findIndex((part) => part.type === "month")
      if (index < 0) continue
      // Letters glued on before the month count too: Hebrew writes "in
      // January" as בינו׳, with the ב in the literal before it.
      const before = parts[index - 1]?.value.match(/[\p{L}\p{M}]+$/u)?.[0]
      for (const text of [
        parts[index]!.value,
        (before ?? "") + parts[index]!.value,
      ]) {
        const name = letters(text, locale).replace(/ /g, "")
        if (name && !/\p{Nd}/u.test(name)) names.push([name, month])
      }
    }
  }
  monthNamesByLocale.set(locale, names)
  return names
}

/**
 * Reads a typed date: "YYYY-MM-DD", the locale's numeric order, or a month
 * name (cut short too) with a day and a year, in the locale's digits. A
 * two-digit year is in the 2000s. Returns "YYYY-MM-DD", or null when it isn't a date.
 */
function parseDate(text: string, { locale }: { locale: string }) {
  const trimmed = asciiDigits(text.trim(), locale)
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed)
  if (iso) return toIso(Number(iso[1]), Number(iso[2]), Number(iso[3]))

  const tokens = letters(trimmed, locale).match(/[\p{L}\p{M}]+|\d+/gu) ?? []
  const numbers = tokens.filter((token) => /^\d+$/.test(token))
  const names = monthNames(locale)
  const months = new Set(
    tokens
      .filter((token) => !/^\d+$/.test(token))
      .map(
        (word) =>
          names.find(
            ([name]) =>
              name === word || (word.length >= 3 && name.startsWith(word))
          )?.[1]
      )
      .filter((month) => month !== undefined)
  )

  const parts: Partial<Record<"day" | "month" | "year", number>> = {}
  if (months.size === 1 && numbers.length === 2) {
    parts.month = [...months][0]
    // A number of three digits or more is the year, wherever it's typed.
    const long = numbers.findIndex((number) => number.length > 2)
    const order =
      long < 0
        ? partOrder(locale, "short").filter((type) => type !== "month")
        : long === 0
          ? (["year", "day"] as const)
          : (["day", "year"] as const)
    order.forEach((type, index) => (parts[type] = Number(numbers[index])))
  } else if (months.size === 0 && numbers.length === 3) {
    // A year first means year, month, day (2026/06/18), whatever the locale.
    const order =
      numbers[0]!.length > 2
        ? (["year", "month", "day"] as const)
        : partOrder(locale, "numeric")
    order.forEach((type, index) => (parts[type] = Number(numbers[index])))
  } else {
    return null
  }

  const year = parts.year! < 100 ? 2000 + parts.year! : parts.year!
  return toIso(year, parts.month!, parts.day!)
}

const errorMessages: Record<DatePickerError, (bound?: string) => string> = {
  format: () => "Your entry does not match the allowed format.",
  min: (min) => `Value must be ${min} or later.`,
  max: (max) => `Value must be ${max} or earlier.`,
}

// The field's text for a value: the day in the locale's style, or the value
// as it is with a format error when it isn't a day.
function shownFor(
  value: string | null,
  locale: string,
  dateStyle: "short" | "medium" | "long"
): { text: string; error?: DatePickerError } {
  if (!value) return { text: "" }
  const day = validIso(value)
  return day
    ? { text: formatDate(day, locale, dateStyle) }
    : { text: value, error: "format" }
}

function DatePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  today: todayProp,
  locale = "en-US",
  dateStyle = "medium",
  parse = parseDate,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  children,
}: {
  /** The day, as "YYYY-MM-DD", or null when the field is empty or its text isn't accepted. */
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (
    value: string | null,
    details: DatePickerChangeDetails
  ) => void
  /** The earliest day people can pick or type, as "YYYY-MM-DD". */
  min?: string
  /** The latest day people can pick or type, as "YYYY-MM-DD". */
  max?: string
  /** The day the calendar marks as today, as "YYYY-MM-DD". Default the browser's date. */
  today?: string
  /** Formats and reads dates. */
  locale?: string
  /** How the field shows the date. */
  dateStyle?: "short" | "medium" | "long"
  /** Reads typed text into "YYYY-MM-DD", or null when it isn't a date. */
  parse?: DatePickerParse
  /** Submits the value as "YYYY-MM-DD" with a form, from a hidden input. */
  name?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  children?: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp === undefined ? uncontrolled : valueProp
  // An empty value, or one that isn't a day, selects nothing and submits nothing.
  const day = validIso(value)
  const [open, setOpenState] = React.useState(false)
  const [focusDay, setFocusDay] = React.useState(false)
  const [container, setContainer] = React.useState<HTMLElement>()
  const today = todayProp ?? todayIso()
  const [month, setMonth] = React.useState(() => isoToDate(day ?? today))

  // Derived, not synced: text typed for the current value, locale and style
  // stays; anything set from outside is formatted fresh, never re-read.
  const [edited, setEdited] = React.useState<{
    text: string
    error?: DatePickerError
    for: { value: string | null; locale: string; dateStyle: string }
  } | null>(null)
  const shown =
    edited &&
    edited.for.value === value &&
    edited.for.locale === locale &&
    edited.for.dateStyle === dateStyle
      ? edited
      : shownFor(value, locale, dateStyle)
  const { text, error } = shown

  const controlRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const returnFocus = React.useRef(true)
  const contentId = React.useId()

  const setText = (nextText: string) =>
    setEdited({ text: nextText, error, for: { value, locale, dateStyle } })

  const change = (
    next: string | null,
    nextText: string,
    nextError?: DatePickerError
  ) => {
    const same = next === day && nextError === error
    setEdited({
      text: nextText,
      error: nextError,
      for: { value: same ? value : next, locale, dateStyle },
    })
    if (same) return
    setUncontrolled(next)
    onValueChange?.(next, { text: nextText, error: nextError })
  }

  const commitText = () => {
    if (text.trim() === "") return change(null, text)
    const parsed = parse(text, { locale })
    if (!parsed) return change(null, text, "format")
    const formatted = formatDate(parsed, locale, dateStyle)
    if (min && parsed < min) return change(null, formatted, "min")
    if (max && parsed > max) return change(null, formatted, "max")
    change(parsed, formatted)
  }

  // Stable while the value stands: the popup's Escape listener is attached
  // with it (DatePickerContent), once per open.
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (next) setMonth(isoToDate(day ?? today))
      setOpenState(next)
    },
    [day, today]
  )

  const context: DatePickerContextValue = {
    value: day,
    text,
    setText,
    commitText,
    select: (picked) => {
      change(picked, formatDate(picked, locale, dateStyle))
      returnFocus.current = true
      setOpenState(false)
      // Before the popup unmounts, so a dialog around it doesn't take focus
      // back to itself.
      inputRef.current?.focus()
    },
    error,
    validityMessage: error
      ? errorMessages[error](error === "min" ? min : max)
      : "",
    open,
    openFrom: (source) => {
      if (disabled || readOnly) return
      if (source === "trigger" && open) return setOpenState(false)
      setFocusDay(source === "trigger")
      // Inside a dialog, the popup renders in the dialog, so a Radix dialog's
      // focus trap counts the calendar as inside.
      setContainer(
        controlRef.current?.closest<HTMLElement>(
          "[role=dialog], [role=alertdialog]"
        ) ?? undefined
      )
      setOpen(true)
    },
    setOpen,
    month,
    setMonth,
    min,
    max,
    today,
    locale,
    disabled,
    readOnly,
    required,
    contentId,
    controlRef,
    inputRef,
    popupRef,
    focusDay,
    container,
    returnFocus,
  }

  return (
    <DatePickerContext.Provider value={context}>
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(next, details) => {
          // The field and its button sit outside the popup. Pressing them
          // isn't a click away: their own handlers open or toggle it.
          if (
            !next &&
            details.reason === "outside-press" &&
            details.event.target instanceof Node &&
            controlRef.current?.contains(details.event.target)
          ) {
            details.cancel()
            return
          }
          returnFocus.current =
            details.reason !== "outside-press" && details.reason !== "focus-out"
          setOpen(next)
        }}
      >
        {children}
      </PopoverPrimitive.Root>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={day ?? ""}
          disabled={disabled}
        />
      ) : null}
    </DatePickerContext.Provider>
  )
}

function DatePickerControl({
  className,
  ...props
}: React.ComponentProps<typeof InputGroup>) {
  const { controlRef } = useDatePickerContext("DatePickerControl")
  return (
    <InputGroup
      ref={controlRef}
      data-slot="date-picker-control"
      className={cn(className)}
      {...props}
    />
  )
}

function DatePickerInput({
  className,
  ref,
  onChange,
  onKeyDown,
  onClick,
  onBlur,
  "aria-invalid": ariaInvalid,
  ...props
}: Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "type" | "name" | "required" | "disabled"
>) {
  const context = useDatePickerContext("DatePickerInput")
  const { inputRef, validityMessage } = context
  // React runs the ref callback again when the message changes, so the
  // input's validity follows the error state without an effect.
  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      node?.setCustomValidity(validityMessage)
      if (typeof ref === "function") {
        // A consumer's ref may return a cleanup (React 19). Run it with
        // ours, so the picker's own ref still clears on unmount.
        const cleanup = ref(node)
        if (typeof cleanup !== "function") return
        return () => {
          cleanup()
          inputRef.current = null
        }
      }
      if (ref) ref.current = node
    },
    [inputRef, validityMessage, ref]
  )
  return (
    // Keeps the input-group-control data-slot: InputGroup finds its control
    // by it for the focus, error and disabled styles.
    <InputGroupInput
      ref={setInputRef}
      role="combobox"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      aria-autocomplete="none"
      autoComplete="off"
      aria-invalid={context.error ? true : ariaInvalid}
      value={context.text}
      required={context.required}
      disabled={context.disabled}
      readOnly={context.readOnly}
      className={cn(className)}
      onChange={(event) => {
        onChange?.(event)
        if (event.defaultPrevented) return
        context.setText(event.target.value)
      }}
      onBlur={(event) => {
        onBlur?.(event)
        context.commitText()
      }}
      onClick={(event) => {
        onClick?.(event)
        context.openFrom("input")
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.key === "Enter") context.commitText()
        if (event.key === "ArrowDown" && !context.open) {
          event.preventDefault()
          context.openFrom("trigger")
        }
      }}
      {...props}
    />
  )
}

function DatePickerTrigger({
  className,
  children,
  "aria-label": ariaLabel = "Select a date",
  ...props
}: Omit<React.ComponentProps<typeof InputGroupButton>, "onClick">) {
  const context = useDatePickerContext("DatePickerTrigger")
  return (
    <InputGroupAddon align="inline-end">
      {/* The icon button sets its own color, so the addon's error rule doesn't reach it. */}
      <InputGroupButton
        data-slot="date-picker-trigger"
        size="icon-xs"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.open ? context.contentId : undefined}
        disabled={context.disabled || context.readOnly}
        className={cn(
          "group-has-[[data-slot][aria-invalid=true]]/input-group:text-destructive",
          className
        )}
        onClick={() => context.openFrom("trigger")}
        {...props}
      >
        {children ?? <CalendarIcon />}
      </InputGroupButton>
    </InputGroupAddon>
  )
}

// The popup's tabbable elements, for keeping Tab inside it.
function tabbables(popup: HTMLElement) {
  return Array.from(
    popup.querySelectorAll<HTMLElement>(
      "button:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex='-1'])"
    )
  ).filter(
    (element) => element.tabIndex >= 0 && element.checkVisibility?.() !== false
  )
}

function DatePickerContent({
  className,
  onKeyDown,
  ...props
}: Omit<
  PopoverPrimitive.Popup.Props,
  "initialFocus" | "finalFocus" | "render" | "ref"
>) {
  const context = useDatePickerContext("DatePickerContent")
  const { popupRef, inputRef, controlRef, returnFocus, setOpen } = context
  // Escape closes the calendar only: a Radix dialog around it listens on the
  // document in the capture phase and would close too, so the key is taken on
  // the window first. Stable, so the listener is added once per open.
  const popupCallbackRef = React.useCallback(
    (popup: HTMLDivElement | null) => {
      popupRef.current = popup
      if (!popup) return
      const onEscape = (event: KeyboardEvent) => {
        if (event.key !== "Escape" || !(event.target instanceof Node)) return
        if (
          !popup.contains(event.target) &&
          !controlRef.current?.contains(event.target)
        )
          return
        event.stopPropagation()
        event.preventDefault()
        returnFocus.current = true
        setOpen(false)
        inputRef.current?.focus()
      }
      window.addEventListener("keydown", onEscape, { capture: true })
      return () =>
        window.removeEventListener("keydown", onEscape, { capture: true })
    },
    [popupRef, controlRef, returnFocus, setOpen, inputRef]
  )
  return (
    // Out of the layout, so a dialog it renders in doesn't grow by a gap.
    <PopoverPrimitive.Portal container={context.container} className="absolute">
      {/* Above or below the field, never beside it. */}
      <PopoverPrimitive.Positioner
        anchor={context.controlRef}
        side="bottom"
        align="start"
        sideOffset={2}
        collisionAvoidance={{ fallbackAxisSide: "none" }}
        className="isolate z-50"
      >
        {/* Opened from the button or the keyboard, focus goes to the grid's tab
            stop (the selected day, or today); a click in the field keeps focus
            there to type. Tab wraps: Base UI only traps focus in a popover with
            a close button, and this one has none. */}
        <PopoverPrimitive.Popup
          ref={popupCallbackRef}
          id={context.contentId}
          data-slot="date-picker-content"
          aria-label={`Date picker: ${context.month.toLocaleString(gregorian(context.locale), { month: "long" })}`}
          initialFocus={() =>
            context.focusDay
              ? (context.popupRef.current?.querySelector<HTMLElement>(
                  "td button[tabindex='0']"
                ) ?? true)
              : false
          }
          finalFocus={() =>
            context.returnFocus.current ? context.inputRef.current : false
          }
          className={cn(
            "pointer-events-auto flex flex-col rounded-(--radius-2) bg-popover text-(length:--calendar-font-size) text-popover-foreground shadow-(--elevation-2) outline-hidden",
            className
          )}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (event.key !== "Tab" || !popupRef.current) return
            const elements = tabbables(popupRef.current)
            const first = elements[0]
            const last = elements[elements.length - 1]
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault()
              last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first?.focus()
            }
          }}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

// The header with the year picklist: the month centered between the arrows,
// the picklist after the next arrow.
const yearPicklistHeader = [
  "[&_.rdp-nav]:end-17 [&_.rdp-nav]:w-auto",
  String.raw`[&_.rdp-month\_caption]:ps-8 [&_.rdp-month\_caption]:pe-0`,
  "[&_.rdp-dropdowns]:grid [&_.rdp-dropdowns]:grid-cols-[1fr_auto] [&_.rdp-dropdowns]:gap-9 [&_.rdp-dropdowns>span:first-child]:justify-self-center",
  String.raw`[&_.rdp-dropdown\_root]:w-16 [&_.rdp-caption\_label]:justify-between`,
]

// The first day of a locale's week, as react-day-picker counts (Sunday 0).
// Browsers without Intl.Locale's week info get react-day-picker's Sunday.
function firstDayOfWeek(locale: string) {
  const intl = new Intl.Locale(locale) as Intl.Locale & {
    getWeekInfo?: () => { firstDay: number }
    weekInfo?: { firstDay: number }
  }
  const info = intl.getWeekInfo?.() ?? intl.weekInfo
  return info ? ((info.firstDay % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6) : undefined
}

function DatePickerCalendar({
  className,
  captionLayout = "dropdown-years",
  formatters,
  labels,
  disabled: disabledProp,
  ...props
}: Omit<
  React.ComponentProps<typeof Calendar>,
  | "mode"
  | "selected"
  | "onSelect"
  | "required"
  | "month"
  | "onMonthChange"
  | "today"
>) {
  const context = useDatePickerContext("DatePickerCalendar")
  const today = isoToDate(context.today)
  const { locale } = context
  const intl = gregorian(locale)
  const disabled = [
    context.min ? { before: isoToDate(context.min) } : undefined,
    context.max ? { after: isoToDate(context.max) } : undefined,
    ...(Array.isArray(disabledProp) ? disabledProp : [disabledProp]),
  ].filter((matcher) => matcher !== undefined)
  return (
    // Names and digits in the picker's locale through Intl; button names stay
    // English, as react-day-picker's are. The year picklist runs whole years,
    // not min's and max's months: react-day-picker hides the days of months
    // outside the range.
    <Calendar
      data-slot="date-picker-calendar"
      className={cn(
        captionLayout === "dropdown-years" && yearPicklistHeader,
        className
      )}
      lang={locale}
      weekStartsOn={firstDayOfWeek(locale)}
      formatters={{
        formatCaption: (date) =>
          date.toLocaleString(intl, { month: "long", year: "numeric" }),
        formatDay: (date) => date.toLocaleString(intl, { day: "numeric" }),
        formatMonthDropdown: (date) =>
          date.toLocaleString(intl, { month: "long" }),
        formatYearDropdown: (date) =>
          date.toLocaleString(intl, { year: "numeric" }),
        formatWeekdayName: (date) =>
          date.toLocaleString(intl, { weekday: "short" }),
        ...formatters,
      }}
      labels={{
        labelGrid: (date) =>
          date.toLocaleString(intl, { month: "long", year: "numeric" }),
        labelDayButton: (date, modifiers) =>
          [
            date.toLocaleDateString(intl, { dateStyle: "full" }),
            modifiers.today && "today",
            modifiers.selected && "selected",
          ]
            .filter(Boolean)
            .join(", "),
        ...labels,
      }}
      mode="single"
      required
      captionLayout={captionLayout}
      selected={context.value ? isoToDate(context.value) : undefined}
      onSelect={(day) => context.select(dateToIso(day))}
      month={context.month}
      onMonthChange={context.setMonth}
      today={today}
      startMonth={
        new Date(
          context.min
            ? isoToDate(context.min).getFullYear()
            : today.getFullYear() - 100,
          0
        )
      }
      endMonth={
        new Date(
          context.max
            ? isoToDate(context.max).getFullYear()
            : today.getFullYear() + 100,
          11
        )
      }
      disabled={disabled}
      {...props}
    />
  )
}

function DatePickerToday({
  className,
  children = "Today",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  const context = useDatePickerContext("DatePickerToday")
  const outOfRange =
    (context.min !== undefined && context.today < context.min) ||
    (context.max !== undefined && context.today > context.max)
  return (
    <Button
      data-slot="date-picker-today"
      variant="link"
      disabled={outOfRange}
      className={cn(
        "mx-auto text-(length:--calendar-font-size) hover:text-(--link-hover) focus-visible:text-(--link-hover) focus-visible:underline active:text-(--link-hover)",
        className
      )}
      onClick={() => context.select(context.today)}
      {...props}
    >
      {children}
    </Button>
  )
}

export {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
  parseDate,
  type DatePickerChangeDetails,
  type DatePickerError,
  type DatePickerParse,
}
