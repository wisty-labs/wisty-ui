"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerToday,
  DatePickerTrigger,
} from "@/components/wisty/date-picker"
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"

type DateTimePickerError = "format" | "min" | "max"

type DateTimePickerPart = "date" | "time"

type DateTimePickerChangeDetails = {
  /** The date half, as "YYYY-MM-DD", or null when it's empty or invalid. */
  date: string | null
  /** The time half, as "HH:MM" or "HH:MM:SS", or null when it's empty or invalid. */
  time: string | null
  /** The empty half, when the other holds a value. */
  missing?: DateTimePickerPart
  /** Why a half isn't accepted: unreadable text, or a date and time outside min or max. */
  error?: DateTimePickerError
  /** The half the error is in. */
  invalid?: DateTimePickerPart
}

type Half = { value: string | null; error?: DateTimePickerError }

type DateTimePickerContextValue = {
  date: Half
  time: Half
  setDate: (value: string | null, error?: DateTimePickerError) => void
  setTime: (value: string | null, error?: DateTimePickerError) => void
  dateBounds: { min?: string; max?: string }
  timeBounds: { min?: string; max?: string }
  locale: string
  dateStyle: "short" | "medium" | "long"
  timeStyle: "short" | "medium"
  step?: number
  today?: string
  required: boolean
  disabled: boolean
  readOnly: boolean
  dateLabel: React.ReactNode
  timeLabel: React.ReactNode
  /** Names the inputs with the field's label first ("Start Date"). */
  labelledBy?: string
  label?: string
  id: string
}

const DateTimePickerContext =
  React.createContext<DateTimePickerContextValue | null>(null)

function useDateTimePickerContext(part: string) {
  const context = React.useContext(DateTimePickerContext)
  if (!context) throw new Error(`${part} must be used inside <DateTimePicker>.`)
  return context
}

const dateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/

// Halves as written, so a bad half shows its own picker's format error; no
// "T" means all date.
function split(value: string | null): { date: Half; time: Half } {
  if (!value) return { date: { value: null }, time: { value: null } }
  const at = value.indexOf("T")
  if (at < 0) return { date: { value }, time: { value: null } }
  return {
    date: { value: value.slice(0, at) },
    time: { value: value.slice(at + 1) },
  }
}

// A value naming a real date and time: "2026-02-30T09:00" doesn't.
function validDateTime(value: string) {
  const match = dateTimePattern.exec(value)
  if (!match) return false
  const [year, month, day, hour, minute, second] = match
    .slice(1, 7)
    .map((part) => Number(part ?? 0)) as [
    number,
    number,
    number,
    number,
    number,
    number,
  ]
  const days = new Date(Date.UTC(2000, month, 0))
  days.setUTCFullYear(year, month, 0)
  return (
    year >= 1 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= days.getUTCDate() &&
    hour <= 23 &&
    minute <= 59 &&
    second <= 59
  )
}

// Seconds always, so "09:00" and "09:00:00" compare equal.
function comparable(value: string) {
  return value.length === 16 ? `${value}:00` : value
}

function DateTimePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  locale = "en-US",
  dateStyle = "medium",
  timeStyle = "short",
  step,
  today,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  dateLabel = "Date",
  timeLabel = "Time",
  className,
  "aria-labelledby": labelledBy,
  "aria-label": label,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "role"> & {
  /** A local date and time, "YYYY-MM-DDTHH:MM", never an instant; null when a half is empty or invalid. */
  value?: string | null
  defaultValue?: string | null
  /** Called when either half changes; the value is null until both are accepted, details say which isn't. */
  onValueChange?: (
    value: string | null,
    details: DateTimePickerChangeDetails
  ) => void
  /** The earliest date and time, as "YYYY-MM-DDTHH:MM". */
  min?: string
  /** The latest date and time, as "YYYY-MM-DDTHH:MM". */
  max?: string
  /** Formats and reads both halves. */
  locale?: string
  /** How the date shows, as the date picker's. */
  dateStyle?: "short" | "medium" | "long"
  /** How the time shows, as the time picker's: "medium" adds seconds. */
  timeStyle?: "short" | "medium"
  /** Minutes between the times in the time list. */
  step?: number
  /** The day the calendar marks as today, as "YYYY-MM-DD". */
  today?: string
  /** Submits the value with a form, from a hidden input. */
  name?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  /** The date input's label, shown above it. */
  dateLabel?: React.ReactNode
  /** The time input's label, shown above it. */
  timeLabel?: React.ReactNode
}) {
  const id = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp === undefined ? uncontrolled : valueProp

  // Typed halves are kept with the value they make, so text survives an
  // incomplete value; a value set from outside replaces them.
  const [halves, setHalves] = React.useState<{
    date: Half
    time: Half
    for: string | null
  } | null>(null)
  const { date, time } = halves && halves.for === value ? halves : split(value)

  const minDate = min?.slice(0, 10)
  const maxDate = max?.slice(0, 10)
  const dateBounds = { min: minDate, max: maxDate }
  // The time picker gets min's and max's times only on their own days.
  const timeBounds = {
    min: min && date.value === minDate ? min.slice(11) : undefined,
    max: max && date.value === maxDate ? max.slice(11) : undefined,
  }

  const report = (next: { date: Half; time: Half }) => {
    const bothSet = next.date.value !== null && next.time.value !== null
    let combined = bothSet ? `${next.date.value}T${next.time.value}` : null
    const details: DateTimePickerChangeDetails = {
      date: next.date.value,
      time: next.time.value,
    }
    const dateError = next.date.error
    let timeError = next.time.error
    // A time that was fine before the day changed can be out of range on
    // min's or max's day: the time half shows the error itself.
    if (combined && dateTimePattern.test(combined)) {
      if (min && comparable(combined) < comparable(min)) timeError = "min"
      if (max && comparable(combined) > comparable(max)) timeError = "max"
    }
    if (dateError) {
      details.error = dateError
      details.invalid = "date"
    } else if (timeError) {
      details.error = timeError
      details.invalid = "time"
    } else if (next.date.value === null && next.time.value !== null) {
      details.missing = "date"
    } else if (next.time.value === null && next.date.value !== null) {
      details.missing = "time"
    }
    if (details.error) combined = null
    setHalves({ ...next, for: combined })
    setUncontrolled(combined)
    onValueChange?.(combined, details)
  }

  const context: DateTimePickerContextValue = {
    date,
    time,
    setDate: (next, error) => report({ date: { value: next, error }, time }),
    setTime: (next, error) => report({ date, time: { value: next, error } }),
    dateBounds,
    timeBounds,
    locale,
    dateStyle,
    timeStyle,
    step,
    today,
    required,
    disabled,
    readOnly,
    dateLabel,
    timeLabel,
    labelledBy,
    label,
    id,
  }

  // What a form gets: the value, when it's a date and a time in range.
  const accepted =
    value &&
    validDateTime(value) &&
    (!min || comparable(value) >= comparable(min)) &&
    (!max || comparable(value) <= comparable(max))
      ? value
      : ""

  return (
    <DateTimePickerContext.Provider value={context}>
      {/* No group role: the page's fieldset groups the halves, and each input carries its own name. */}
      <div
        data-slot="datetime-picker"
        className={cn("grid w-full grid-cols-2 items-start gap-2", className)}
        {...props}
      />
      {name ? (
        <input type="hidden" name={name} value={accepted} disabled={disabled} />
      ) : null}
    </DateTimePickerContext.Provider>
  )
}

// An input's name: the field's label, then the half's own ("Start Date").
function halfName(
  context: DateTimePickerContextValue,
  part: DateTimePickerPart,
  own: string
) {
  const ownLabel = part === "date" ? context.dateLabel : context.timeLabel
  if (context.labelledBy)
    return { "aria-labelledby": `${context.labelledBy} ${own}` }
  if (context.label && typeof ownLabel === "string")
    return { "aria-label": `${context.label} ${ownLabel}` }
  return {}
}

function DateTimePickerDate({
  className,
  id: idProp,
  ...props
}: React.ComponentProps<typeof DatePickerInput>) {
  const context = useDateTimePickerContext("DateTimePickerDate")
  const id = idProp ?? `${context.id}-date`
  const labelId = `${id}-label`
  return (
    <Field data-slot="datetime-picker-date" className={cn(className)}>
      <FieldLabel id={labelId} htmlFor={id}>
        {context.dateLabel}
      </FieldLabel>
      <DatePicker
        value={context.date.value}
        onValueChange={(value, details) =>
          context.setDate(value, details.error)
        }
        min={context.dateBounds.min}
        max={context.dateBounds.max}
        today={context.today}
        locale={context.locale}
        dateStyle={context.dateStyle}
        required={context.required}
        disabled={context.disabled}
        readOnly={context.readOnly}
      >
        <DatePickerControl>
          <DatePickerInput
            id={id}
            {...halfName(context, "date", labelId)}
            {...props}
          />
          {/* Read-only, the field is plain text without its button, as the time half is without its clock. */}
          {context.readOnly ? null : <DatePickerTrigger />}
        </DatePickerControl>
        <DatePickerContent>
          <DatePickerCalendar />
          <DatePickerToday />
        </DatePickerContent>
      </DatePicker>
    </Field>
  )
}

function DateTimePickerTime({
  className,
  id: idProp,
  ...props
}: React.ComponentProps<typeof TimePickerInput>) {
  const context = useDateTimePickerContext("DateTimePickerTime")
  const id = idProp ?? `${context.id}-time`
  const labelId = `${id}-label`
  return (
    <Field data-slot="datetime-picker-time" className={cn(className)}>
      <FieldLabel id={labelId} htmlFor={id}>
        {context.timeLabel}
      </FieldLabel>
      <TimePicker
        value={context.time.value}
        onValueChange={(value, details) =>
          context.setTime(value, details.error)
        }
        min={context.timeBounds.min}
        max={context.timeBounds.max}
        step={context.step}
        locale={context.locale}
        timeStyle={context.timeStyle}
        required={context.required}
        disabled={context.disabled}
        readOnly={context.readOnly}
      >
        <TimePickerInput
          id={id}
          {...halfName(context, "time", labelId)}
          {...props}
        />
        <TimePickerContent>
          <TimePickerList />
        </TimePickerContent>
      </TimePicker>
    </Field>
  )
}

// The parts of an instant on a time zone's clock, 24-hour.
function clockParts(instant: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    era: "short",
  }).formatToParts(new Date(instant))
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((each) => each.type === type)?.value)
  const era = parts.find((each) => each.type === "era")?.value
  const year = era === "BC" || era === "B" ? 1 - part("year") : part("year")
  return [
    year,
    part("month"),
    part("day"),
    part("hour"),
    part("minute"),
    part("second"),
  ] as const
}

// The clock reading as if it were UTC, in milliseconds.
function asUtc(parts: readonly number[]) {
  const [year, month, day, hour, minute, second] = parts as [
    number,
    number,
    number,
    number,
    number,
    number,
  ]
  const date = new Date(Date.UTC(2000, month - 1, day, hour, minute, second))
  date.setUTCFullYear(year)
  return date.getTime()
}

const pad = (number: number, length = 2) => String(number).padStart(length, "0")

/**
 * An instant as a local date and time on a time zone's clock, "YYYY-MM-DDTHH:MM"
 * (with `seconds`, "YYYY-MM-DDTHH:MM:SS"). Null for something that isn't an instant.
 */
function instantToDateTime(
  instant: string | number | Date,
  { timeZone, seconds = false }: { timeZone: string; seconds?: boolean }
) {
  const time = new Date(instant).getTime()
  if (Number.isNaN(time)) return null
  const [year, month, day, hour, minute, second] = clockParts(time, timeZone)
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}${seconds ? `:${pad(second)}` : ""}`
}

/**
 * A local date and time on a time zone's clock as an instant, an ISO string in
 * UTC. A time the clock shows twice is the first; a time it skips moves forward
 * by the gap. Null for a value that isn't a real date and time, like
 * "2026-02-30T10:00".
 */
function dateTimeToInstant(value: string, { timeZone }: { timeZone: string }) {
  if (!validDateTime(value)) return null
  const wanted = dateTimePattern
    .exec(value)!
    .slice(1, 7)
    .map((part) => Number(part ?? 0))
  const target = asUtc(wanted)
  if (Number.isNaN(target)) return null
  const day = 24 * 60 * 60 * 1000
  // The zone's offset a day either side covers any one transition.
  const offsets = [target - day, target + day].map(
    (at) => asUtc(clockParts(at, timeZone)) - at
  )
  const candidates = offsets.map((offset) => target - offset)
  const exact = candidates
    .filter((at) => asUtc(clockParts(at, timeZone)) === target)
    .sort((a, b) => a - b)
  return new Date(exact[0] ?? candidates[0]!).toISOString()
}

export {
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
  dateTimeToInstant,
  instantToDateTime,
  type DateTimePickerChangeDetails,
  type DateTimePickerError,
  type DateTimePickerPart,
}
