"use client"

import * as React from "react"
import { ClockIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"

type TimePickerError = "format" | "min" | "max"

type TimePickerChangeDetails = {
  /** The field's text when the value changed. */
  text: string
  /** Why the text isn't a time the field accepts. Unset when it is. */
  error?: TimePickerError
}

type TimePickerParse = (
  text: string,
  options: { locale: string; seconds: boolean }
) => string | null

type TimePickerStyle = "short" | "medium"

type TimePickerContextValue = {
  text: string
  setText: (text: string) => void
  commitText: () => void
  /** Whether people have typed since the text was last read. */
  typing: boolean
  error: TimePickerError | undefined
  /** What the input's validity says, or "" when it's valid. */
  validityMessage: string
  open: boolean
  setOpen: (open: boolean) => void
  /** The times the list shows: every step, narrowed by typed text. */
  times: readonly string[]
  /** A time as the field and the list show it. */
  label: (time: string) => string
  highlighted: React.RefObject<string | undefined>
  disabled: boolean
  readOnly: boolean
  required: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
}

const TimePickerContext = React.createContext<TimePickerContextValue | null>(
  null
)

function useTimePickerContext(part: string) {
  const context = React.useContext(TimePickerContext)
  if (!context) throw new Error(`${part} must be used inside <TimePicker>.`)
  return context
}

const timePattern = /^(\d{2}):(\d{2})(?::(\d{2}))?$/

// A time as seconds since midnight, or null when it isn't "HH:MM" or
// "HH:MM:SS" naming a time of day: "24:00" and "9:30" are no times here.
function toSeconds(value: string | null | undefined) {
  if (!value) return null
  const match = timePattern.exec(value)
  if (!match) return null
  const [hours, minutes, seconds] = [match[1], match[2], match[3] ?? "0"].map(
    Number
  ) as [number, number, number]
  if (hours > 23 || minutes > 59 || seconds > 59) return null
  return hours * 3600 + minutes * 60 + seconds
}

function fromSeconds(total: number, seconds: boolean) {
  const parts = [Math.floor(total / 3600), Math.floor(total / 60) % 60]
  if (seconds) parts.push(total % 60)
  return parts.map((part) => String(part).padStart(2, "0")).join(":")
}

// One format per locale and style: the list formats every time it shows.
const timeFormats = new Map<string, Intl.DateTimeFormat>()

// Formatted in UTC so the time never shifts with the browser's zone. Intl
// puts a narrow no-break space before AM in some locales; people type a
// plain one, and the list filters by what they type.
function formatTime(total: number, locale: string, timeStyle: TimePickerStyle) {
  const key = `${locale}|${timeStyle}`
  let format = timeFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { timeStyle, timeZone: "UTC" })
    timeFormats.set(key, format)
  }
  return format.format(new Date(total * 1000)).replace(/[  ]/g, " ")
}

// The locale's own digits (Arabic's ٠–٩, say) as 0–9, so the field reads back what it shows.
function asciiDigits(text: string, locale: string) {
  const digits = new Intl.NumberFormat(locale, { useGrouping: false }).format(
    9876543210
  )
  const value = new Map([...digits].map((digit, index) => [digit, 9 - index]))
  return text.replace(/\p{Nd}/gu, (digit) => String(value.get(digit) ?? digit))
}

// Lowercase letters only, so "P.M." and "p. m." read as "pm".
function squash(text: string, locale: string) {
  return text.toLocaleLowerCase(locale).replace(/[^\p{L}\p{M}]/gu, "")
}

// What the list filters on: lowercase, with spaces and dots gone, so
// "9:30p" and "9.30 P.M." both find 9:30 PM.
function filterKey(text: string, locale: string) {
  return asciiDigits(text, locale)
    .toLocaleLowerCase(locale)
    .replace(/[\s.]/g, "")
}

type TimeWords = { am: string[]; pm: string[]; literals: Set<string> }

const timeWordsByLocale = new Map<string, TimeWords>()

// The locale's words for AM and PM, with English's always, and the letters
// between its numbers (French Canadian's "21 h 30"), which typing may repeat.
function timeWords(locale: string): TimeWords {
  const cached = timeWordsByLocale.get(locale)
  if (cached) return cached
  const period = (hour: number) =>
    new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: true,
      timeZone: "UTC",
    })
      .formatToParts(new Date(Date.UTC(1970, 0, 1, hour)))
      .find((part) => part.type === "dayPeriod")?.value
  const am = period(9)
  const pm = period(21)
  const literals = new Set<string>()
  for (const timeStyle of ["short", "medium"] as const) {
    new Intl.DateTimeFormat(locale, { timeStyle, timeZone: "UTC" })
      .formatToParts(new Date(Date.UTC(1970, 0, 1, 21, 30, 15)))
      .filter((part) => part.type === "literal")
      .forEach((part) =>
        part.value
          .toLocaleLowerCase(locale)
          .match(/[\p{L}\p{M}]+/gu)
          ?.forEach((word) => literals.add(word))
      )
  }
  const words = {
    am: ["am", ...(am ? [squash(am, locale)] : [])],
    pm: ["pm", ...(pm ? [squash(pm, locale)] : [])],
    literals,
  }
  timeWordsByLocale.set(locale, words)
  return words
}

/**
 * Reads a typed time, in the locale's style or not: "9:30p" and "2130" are
 * "21:30", "9" is "09:00". Returns "HH:MM:SS" with `seconds`, and null when
 * the text isn't a time.
 */
function parseTime(
  text: string,
  { locale, seconds }: { locale: string; seconds: boolean }
) {
  const plain = asciiDigits(text.trim(), locale).toLocaleLowerCase(locale)
  const words = timeWords(locale)
  let period: "am" | "pm" | undefined
  const numbers: string[] = []
  // Numbers, and what's between them: separators, AM or PM in a word or a
  // letter (p.m., 午後, p), or the locale's own letters (21 h 30).
  for (const segment of plain.split(/(\d+)/)) {
    if (/^\d+$/.test(segment)) {
      numbers.push(segment)
      continue
    }
    const letters = segment.replace(/[^\p{L}\p{M}]/gu, "")
    if (!letters) continue
    const am = words.am.some((word) => word.startsWith(letters))
    const pm = words.pm.some((word) => word.startsWith(letters))
    if (am !== pm && !period) {
      period = am ? "am" : "pm"
      continue
    }
    const parts = segment.match(/[\p{L}\p{M}]+/gu) ?? []
    if (parts.every((part) => words.literals.has(part))) continue
    return null
  }

  let parts: string[]
  if (numbers.length === 1) {
    // Digits with no separator: an hour, then two digits each for minutes
    // and seconds (930, 2130, 213015).
    const [digits] = numbers as [string]
    if (digits.length > (seconds ? 6 : 4)) return null
    const hours = digits.length % 2 === 0 ? 2 : 1
    parts = [digits.slice(0, Math.min(hours, digits.length))]
    for (let index = hours; index < digits.length; index += 2) {
      parts.push(digits.slice(index, index + 2))
    }
  } else if (numbers.length === 2 || (numbers.length === 3 && seconds)) {
    parts = numbers
  } else {
    return null
  }
  if (parts[0]!.length > 2 || parts.slice(1).some((part) => part.length !== 2))
    return null

  let [hours, minutes = 0, secs = 0] = parts.map(Number) as [
    number,
    number?,
    number?,
  ]
  if (period) {
    if (hours < 1 || hours > 12) return null
    hours = (hours % 12) + (period === "pm" ? 12 : 0)
  }
  if (hours > 23 || minutes > 59 || secs > 59) return null
  return fromSeconds(hours * 3600 + minutes * 60 + secs, seconds)
}

function timeOptions(
  step: number,
  min: number | null,
  max: number | null,
  seconds: boolean
) {
  const size = Math.max(1, Math.round(step * 60))
  const times: string[] = []
  for (let total = min ?? 0; total <= (max ?? 86399); total += size) {
    times.push(fromSeconds(total, seconds))
  }
  return times
}

function TimePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 15,
  locale = "en-US",
  timeStyle = "short",
  parse = parseTime,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  children,
}: {
  /** The time of day as 24-hour "HH:MM", or null when the field is empty or its text isn't a time. */
  value?: string | null
  /** The time at first, when uncontrolled. */
  defaultValue?: string | null
  /** Called with the new time, or null and the reason the text isn't one. */
  onValueChange?: (
    value: string | null,
    details: TimePickerChangeDetails
  ) => void
  /** The earliest time people can pick or type, as "HH:MM" or "HH:MM:SS"; the list starts here. */
  min?: string
  /** The latest time people can pick or type, as "HH:MM" or "HH:MM:SS". */
  max?: string
  /** Minutes between the times in the list. Typed times aren't rounded to it. */
  step?: number
  /** Formats and reads times, and sets the 12- or 24-hour clock. */
  locale?: string
  /** "medium" shows seconds, and takes and reports "HH:MM:SS". */
  timeStyle?: TimePickerStyle
  /** Reads typed text into "HH:MM" or "HH:MM:SS", or null when it isn't a time. */
  parse?: TimePickerParse
  /** Submits the value with a form, from a hidden input. */
  name?: string
  /** Required with a form. */
  required?: boolean
  /** Disables the field and its list. */
  disabled?: boolean
  /** Shows the time without the list; it can't be changed. */
  readOnly?: boolean
  /** The input and the list. */
  children?: React.ReactNode
}) {
  const seconds = timeStyle === "medium"
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp === undefined ? uncontrolled : valueProp
  const minSeconds = toSeconds(min)
  const maxSeconds = toSeconds(max)
  const label = (time: string) => {
    const total = toSeconds(time)
    return total === null ? time : formatTime(total, locale, timeStyle)
  }

  // A value outside min and max is marked invalid, never moved into range.
  const errorFor = (total: number | null): TimePickerError | undefined => {
    if (total === null) return "format"
    if (minSeconds !== null && total < minSeconds) return "min"
    if (maxSeconds !== null && total > maxSeconds) return "max"
    return undefined
  }
  const total = toSeconds(value)
  const valueError = value ? errorFor(total) : undefined
  // The value as the list and a form see it, when it's one the field accepts.
  const accepted =
    total !== null && !valueError ? fromSeconds(total, seconds) : null

  // Typed text is kept with the value it was typed for, so a value set from
  // outside replaces it and a parent echoing null doesn't.
  const [edited, setEdited] = React.useState<{
    text: string
    error?: TimePickerError
    /** What people typed since the list last showed every time. */
    query: string | null
    for: { value: string | null; locale: string; timeStyle: string }
  } | null>(null)
  const current =
    edited &&
    edited.for.value === value &&
    edited.for.locale === locale &&
    edited.for.timeStyle === timeStyle
      ? edited
      : null
  const text = current
    ? current.text
    : value
      ? total === null
        ? value
        : label(value)
      : ""
  const error = current ? current.error : valueError
  const query = current?.query ?? null

  const [wantOpen, setWantOpen] = React.useState(false)
  const highlighted = React.useRef<string | undefined>(undefined)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const all = timeOptions(step, minSeconds, maxSeconds, seconds)
  // Typed text narrows the list to times whose label or 24-hour value starts
  // with it: "9" shows 9:00 AM to 9:45 PM in en-US, "2130" the times from 21:30.
  const typed = query ? filterKey(query, locale) : ""
  const times = typed
    ? all.filter(
        (time) =>
          filterKey(label(time), locale).startsWith(typed) ||
          time.startsWith(typed) ||
          time.replace(/:/g, "").startsWith(typed)
      )
    : all
  const open = wantOpen && !disabled && !readOnly && times.length > 0

  const setText = (nextText: string) => {
    setEdited({
      text: nextText,
      error,
      query: nextText,
      for: { value, locale, timeStyle },
    })
    setWantOpen(true)
  }

  const change = (
    next: string | null,
    nextText: string,
    nextError?: TimePickerError
  ) => {
    const same = next === accepted && nextError === error
    setEdited({
      text: nextText,
      error: nextError,
      query: null,
      for: { value: same ? value : next, locale, timeStyle },
    })
    if (same) return
    setUncontrolled(next)
    onValueChange?.(next, { text: nextText, error: nextError })
  }

  const commitText = () => {
    if (text.trim() === "") return change(null, text)
    const parsed = parse(text, { locale, seconds })
    const parsedTotal = toSeconds(parsed)
    if (!parsed || parsedTotal === null) return change(null, text, "format")
    const time = fromSeconds(parsedTotal, seconds)
    const parsedError = errorFor(parsedTotal)
    if (parsedError) return change(null, label(time), parsedError)
    change(time, label(time))
  }

  const errorMessages: Record<TimePickerError, string> = {
    format: "Enter a valid time.",
    min: `Value must be ${min ? label(min) : ""} or later.`,
    max: `Value must be ${max ? label(max) : ""} or earlier.`,
  }

  const context: TimePickerContextValue = {
    text,
    setText,
    commitText,
    typing: query !== null,
    error,
    validityMessage: error ? errorMessages[error] : "",
    open,
    setOpen: (next) => {
      if (next && (disabled || readOnly)) return
      setWantOpen(next)
    },
    times,
    label,
    highlighted,
    disabled,
    readOnly,
    required,
    inputRef,
  }

  return (
    <TimePickerContext.Provider value={context}>
      <Combobox<string>
        items={times}
        filter={null}
        value={accepted}
        onValueChange={(next, details) => {
          // Escape keeps the field's time (the combobox would clear it) and goes
          // on to close a dialog around the field, as it does around a plain input.
          if (details.reason === "escape-key") {
            details.allowPropagation()
            return
          }
          if (typeof next !== "string") return
          highlighted.current = undefined
          change(next, label(next))
          setWantOpen(false)
        }}
        inputValue={text}
        onInputValueChange={(nextText, details) => {
          // Only typing changes the text: the combobox also writes it when a time
          // is picked and clears it when the list closes, and the picker does both.
          if (details.reason !== "input-change") return
          setText(nextText)
        }}
        open={open}
        onOpenChange={(next) => {
          if (!next) highlighted.current = undefined
          context.setOpen(next)
        }}
        onItemHighlighted={(time) => {
          highlighted.current = time
        }}
        itemToStringLabel={label}
        disabled={disabled}
        readOnly={readOnly}
      >
        {children}
      </Combobox>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={accepted ?? ""}
          disabled={disabled}
        />
      ) : null}
    </TimePickerContext.Provider>
  )
}

function TimePickerInput({
  className,
  ref,
  onKeyDown,
  onBlur,
  children,
  "aria-invalid": ariaInvalid,
  ...props
}: Omit<
  React.ComponentProps<typeof ComboboxInput>,
  | "value"
  | "defaultValue"
  | "type"
  | "name"
  | "required"
  | "disabled"
  | "readOnly"
  | "showTrigger"
  | "showClear"
>) {
  const context = useTimePickerContext("TimePickerInput")
  const { inputRef, validityMessage } = context
  // The ref callback runs again when the message changes, so the input's
  // validity follows the error.
  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      node?.setCustomValidity(validityMessage)
      if (typeof ref === "function") {
        // A ref callback may return a cleanup (React 19): run it, and clear
        // the picker's own ref with it.
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
    // Keeps the input-group-control slot, which InputGroup styles its control by.
    <ComboboxInput
      ref={setInputRef}
      showTrigger={false}
      autoComplete="off"
      aria-invalid={context.error ? true : ariaInvalid}
      required={context.required}
      disabled={context.disabled}
      readOnly={context.readOnly}
      className={cn(className)}
      onBlur={(event) => {
        onBlur?.(event)
        context.commitText()
        // Leaving the field closes the list wherever focus goes; the combobox
        // keeps it open when focus leaves for no element.
        context.setOpen(false)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || event.key !== "Enter") return
        // A highlighted time is the combobox's to pick. Otherwise Enter reads the
        // typed text and closes the list, or with nothing typed, opens or closes it.
        if (context.open && context.highlighted.current !== undefined) return
        event.preventDefault()
        const typing = context.typing
        context.commitText()
        context.setOpen(!typing && !context.open)
      }}
      {...props}
    >
      {/* The clock is decorative; a click on it opens the list. */}
      {context.readOnly ? null : (
        <InputGroupAddon
          align="inline-end"
          data-slot="time-picker-icon"
          className="group-has-[[data-slot][aria-invalid=true]]/input-group:text-destructive"
          onClick={() => {
            context.inputRef.current?.focus()
            context.setOpen(true)
          }}
        >
          <ClockIcon aria-hidden="true" />
        </InputGroupAddon>
      )}
      {children}
    </ComboboxInput>
  )
}

function TimePickerContent({
  ...props
}: React.ComponentProps<typeof ComboboxContent>) {
  return <ComboboxContent data-slot="time-picker-content" {...props} />
}

// Opens with the picked time at the top of the list, not wherever the
// combobox's scroll to the highlight leaves it.
function scrollToSelected(list: HTMLDivElement | null) {
  const selected = list?.querySelector<HTMLElement>('[aria-selected="true"]')
  if (!list || !selected) return
  list.scrollTop =
    selected.offsetTop - parseFloat(getComputedStyle(list).paddingTop)
}

function TimePickerList({
  children,
  ref,
  ...props
}: React.ComponentProps<typeof ComboboxList>) {
  const setListRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollToSelected(node)
      if (typeof ref === "function") return ref(node)
      if (ref) ref.current = node
    },
    [ref]
  )
  return (
    <ComboboxList ref={setListRef} data-slot="time-picker-list" {...props}>
      {children ??
        ((time: string) => <TimePickerItem key={time} value={time} />)}
    </ComboboxList>
  )
}

function TimePickerItem({
  value,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxItem>, "value"> & {
  /** The time, as "HH:MM" or "HH:MM:SS". */
  value: string
}) {
  const context = useTimePickerContext("TimePickerItem")
  return (
    <ComboboxItem data-slot="time-picker-item" value={value} {...props}>
      {children ?? context.label(value)}
    </ComboboxItem>
  )
}

export {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerItem,
  TimePickerList,
  parseTime,
  type TimePickerChangeDetails,
  type TimePickerError,
  type TimePickerParse,
}
