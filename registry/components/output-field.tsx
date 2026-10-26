"use client"

import * as React from "react"
import { CheckIcon, InfoIcon, PencilIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldTitle } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type OutputFieldType =
  | "text"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "datetime"
  | "time"
  | "relative"
  | "url"
  | "email"
  | "phone"
  | "boolean"
  | "address"
  | "name"

/** A compound address field's parts, like Billing Address. Any part may be missing. */
interface OutputFieldAddress {
  /** The street, with a line break between lines. */
  street?: string | null
  /** The city or town. */
  city?: string | null
  /** The state or province. */
  state?: string | null
  /** The postal or ZIP code. */
  postalCode?: string | null
  /** The country's name. */
  country?: string | null
  /** The geocode's latitude, which isn't shown. */
  latitude?: number | null
  /** The geocode's longitude, which isn't shown. */
  longitude?: number | null
}

/** A compound name field's parts, like a contact's Name. Empty parts are left out. */
interface OutputFieldName {
  /** "Mr.", "Ms.", "Dr." */
  salutation?: string | null
  /** The given name. */
  firstName?: string | null
  /** The middle name or initial. */
  middleName?: string | null
  /** The family name. */
  lastName?: string | null
  /** "Jr.", "III", "PhD" */
  suffix?: string | null
}

/** A plain value of any type: an address or a name is its parts. */
type OutputFieldPlainValue =
  | string
  | number
  | boolean
  | Date
  | OutputFieldAddress
  | OutputFieldName
  | null

/** A named style for a day or a time of day: "short" ("6/18/26"), "medium", "long" or "full". */
type OutputFieldDateStyle = "short" | "medium" | "long" | "full"

/** How one field shows its value; a key its type doesn't read is ignored. */
interface OutputFieldStyleOptions {
  /** Digits after the decimal point, a field's scale, as both the fewest and the most. Unset, Intl's default. */
  fractionDigits?: number
  /** The fewest digits after the decimal point, over fractionDigits. */
  minimumFractionDigits?: number
  /** The most digits after the decimal point, over fractionDigits; under the minimum, it reads as the minimum. */
  maximumFractionDigits?: number
  /** A currency as its symbol ("$"), its code ("USD") or its name ("US dollars"). Defaults to "symbol". */
  currencyDisplay?: "symbol" | "code" | "name"
  /** The day's style in "date" and "datetime" values. Defaults to "medium": "Jun 18, 2026". */
  dateStyle?: OutputFieldDateStyle
  /** The time's style in "datetime" and "time" values. Defaults to "short": "3:30 PM". */
  timeStyle?: OutputFieldDateStyle
  /** true for a 12-hour clock, false for 24 hours. Unset, the locale's own clock. */
  hour12?: boolean
  /** The zone's name after a "datetime" value, "EDT" or "Eastern Daylight Time". Unset, none. */
  timeZoneName?: "short" | "long"
}

/** Options for formatOutputValue; a key left out or set to undefined takes its default. */
interface OutputFieldFormatOptions extends OutputFieldStyleOptions {
  /** A BCP 47 locale. Defaults to "en-US". */
  locale?: string
  /** An ISO 4217 code for "currency" values. Defaults to "USD". */
  currency?: string
  /** An IANA time zone for "datetime" values, and the calendar a "relative" value counts days in. Defaults to "UTC". */
  timeZone?: string
  /** The instant a "relative" value counts from, as ISO 8601. Defaults to the current time at render; pass it for a stable render. */
  now?: string | number | Date
}

/** How a value reads when it links: url, email and phone on their own, anything with href. */
interface OutputFieldLinkOptions {
  /** Words the link shows instead of the value, like "Visit website". The value stays its address. */
  linkLabel?: string
  /** Where the link opens; "_blank" adds rel="noopener noreferrer". Defaults to the same tab. */
  linkTarget?: "_blank" | "_self" | "_parent" | "_top"
  /** The link's hover text. */
  linkTitle?: string
}

type OutputFieldValueProps = {
  /** How the value formats. Defaults to "text". */
  type?: OutputFieldType
  /** The plain value: a percent as a fraction, a time as "HH:mm:ss", an address or name as its parts. null renders blank. */
  value?: OutputFieldPlainValue
  /** Links the value, like a lookup's record page or an address's map. url, email and phone link on their own. */
  href?: string
} & OutputFieldLinkOptions &
  OutputFieldFormatOptions

// One set of defaults for the helper and the component, so a value formats
// the same through either.
const outputFieldFormatDefaults = {
  locale: "en-US",
  currency: "USD",
  currencyDisplay: "symbol",
  timeZone: "UTC",
  dateStyle: "medium",
  timeStyle: "short",
} as const satisfies OutputFieldFormatOptions

// Every option with its default, the digit bounds settled and hour12 as
// Intl's hourCycle, so "00:05" never reads "24:05".
function resolveFormat(options: OutputFieldFormatOptions = {}) {
  const minimum = options.minimumFractionDigits ?? options.fractionDigits
  const maximum = options.maximumFractionDigits ?? options.fractionDigits
  return {
    locale: options.locale ?? outputFieldFormatDefaults.locale,
    currency: options.currency ?? outputFieldFormatDefaults.currency,
    currencyDisplay:
      options.currencyDisplay ?? outputFieldFormatDefaults.currencyDisplay,
    timeZone: options.timeZone ?? outputFieldFormatDefaults.timeZone,
    now: options.now,
    minimumFractionDigits: minimum,
    // Intl throws on a maximum under the minimum, which a table cell can't.
    maximumFractionDigits:
      minimum !== undefined && maximum !== undefined
        ? Math.max(minimum, maximum)
        : maximum,
    dateStyle: options.dateStyle ?? outputFieldFormatDefaults.dateStyle,
    timeStyle: options.timeStyle ?? outputFieldFormatDefaults.timeStyle,
    hourCycle:
      options.hour12 === undefined
        ? undefined
        : options.hour12
          ? ("h12" as const)
          : ("h23" as const),
    timeZoneName: options.timeZoneName,
  }
}

type ResolvedFormat = ReturnType<typeof resolveFormat>

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === ""

const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/

// A YYYY-MM-DD string is a calendar date, read as local midnight, so it
// shows on the same day in every time zone.
function toDate(value: unknown) {
  if (value instanceof Date) return value
  if (typeof value === "number") return new Date(value)
  if (typeof value !== "string") return null
  const day = dateOnly.exec(value)
  if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]))
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const decimal = /^[+-]?\d+(\.\d+)?$/

// A decimal string stays a string, which Intl formats exactly, so 18 digits
// keep all 18. Other numeric text, like "1e3", reads as a number.
function toNumeric(value: unknown): number | string | null {
  if (typeof value === "number") return value
  if (typeof value !== "string" || value.trim() === "") return null
  if (decimal.test(value)) return value
  const number = Number(value)
  return Number.isNaN(number) ? null : number
}

const clock =
  /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|[+-]\d{2}:\d{2})?$/

// Milliseconds since midnight. A time of day has no zone, so a Z or an offset
// is ignored.
function clockTime(value: unknown) {
  if (typeof value !== "string") return null
  const match = clock.exec(value)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3] ?? 0)
  if (hours > 23 || minutes > 59 || seconds > 59) return null
  const milliseconds = Number((match[4] ?? "").padEnd(3, "0"))
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds
}

/** Orders two "time" values by the clock: negative, zero or positive, or undefined when either isn't a time. */
function compareOutputTimes(a: unknown, b: unknown): number | undefined {
  const x = clockTime(a)
  const y = clockTime(b)
  return x === null || y === null ? undefined : x - y
}

const nanpLocale = /^en-(us|ca)(-|$)/i
const nanpNumber = /^1?(\d{3})(\d{3})(\d{4})$/

// In en-US and en-CA, ten digits, or eleven starting with 1, read
// "(425) 555-0155". Anything else shows as stored.
function phoneText(text: string, locale: string) {
  const digits = nanpLocale.test(locale) ? nanpNumber.exec(text) : null
  return digits ? `(${digits[1]}) ${digits[2]}-${digits[3]}` : text
}

const isParts = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !(value instanceof Date)

const partText = (value: unknown) =>
  typeof value === "string"
    ? value.trim()
    : typeof value === "number"
      ? String(value)
      : ""

// The street's lines, then "City, State PostalCode", then the country. A
// missing part takes its separator with it: "Austin 78701" with no state.
function addressLines(address: OutputFieldAddress) {
  const street = partText(address.street)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const city = partText(address.city)
  const region = [partText(address.state), partText(address.postalCode)]
    .filter(Boolean)
    .join(" ")
  const locality =
    city && partText(address.state)
      ? `${city}, ${region}`
      : [city, region].filter(Boolean).join(" ")
  return [...street, locality, partText(address.country)].filter(Boolean)
}

// A name's parts in order, empty ones left out: "Ms. Rose Gonzalez Jr.".
function nameText(name: OutputFieldName) {
  return [
    name.salutation,
    name.firstName,
    name.middleName,
    name.lastName,
    name.suffix,
  ]
    .map(partText)
    .filter(Boolean)
    .join(" ")
}

// Intl formatters are slow to create, so one is kept per locale and options.
// The key is written from the options Intl gets, so no option can miss it.
function cachedFormat<Options, Format>(
  cache: Map<string, Format>,
  create: (locale: string, options: Options) => Format,
  locale: string,
  options: Options
) {
  const key = `${locale}|${JSON.stringify(options)}`
  let format = cache.get(key)
  if (!format) {
    format = create(locale, options)
    cache.set(key, format)
  }
  return format
}

const numberFormats = new Map<string, Intl.NumberFormat>()
const newNumberFormat = (locale: string, options: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale, options)

const dateFormats = new Map<string, Intl.DateTimeFormat>()
const newDateFormat = (locale: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, options)

const relativeFormats = new Map<string, Intl.RelativeTimeFormat>()
const newRelativeFormat = (
  locale: string,
  options: Intl.RelativeTimeFormatOptions
) => new Intl.RelativeTimeFormat(locale, options)

// The first unit whose rounded count is under its threshold, as moment's
// humanize does; under 45 seconds is "now".
type RelativeUnit = "second" | "minute" | "hour" | "day" | "month" | "year"
const daysPerMonth = 146097 / 4800

function relativeCount(milliseconds: number): [number, RelativeUnit] {
  const days = milliseconds / 864e5
  const units: [RelativeUnit, number, number][] = [
    ["second", Math.round(milliseconds / 1000), 45],
    ["minute", Math.round(milliseconds / 6e4), 45],
    ["hour", Math.round(milliseconds / 36e5), 22],
    ["day", Math.round(days), 26],
    ["month", Math.round(days / daysPerMonth), 11],
  ]
  for (const [unit, count, threshold] of units)
    if (Math.abs(count) < threshold)
      return [unit === "second" ? 0 : count, unit]
  return [Math.round(days / daysPerMonth / 12), "year"]
}

// A calendar position in a time zone, in days, months or years, so
// "yesterday" is said only of the day before, not of 23 hours ago.
function calendarIndex(date: Date, unit: RelativeUnit, timeZone: string) {
  const format = cachedFormat(dateFormats, newDateFormat, "en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })
  const parts = Object.fromEntries(
    format.formatToParts(date).map((part) => [part.type, Number(part.value)])
  )
  if (unit === "year") return parts.year!
  if (unit === "month") return parts.year! * 12 + parts.month!
  return Date.UTC(parts.year!, parts.month! - 1, parts.day!) / 864e5
}

// "yesterday", "last month" or "next year" only when it's the one before or
// after on the calendar in the time zone; otherwise "1 day ago".
function relativeText(date: Date, { locale, timeZone, now }: ResolvedFormat) {
  const from = now === undefined ? new Date() : toDate(now)
  if (!from) return ""
  const [count, unit] = relativeCount(date.getTime() - from.getTime())
  let numeric: "auto" | "always" = "auto"
  if (Math.abs(count) === 1 && unit !== "minute" && unit !== "hour") {
    const steps =
      calendarIndex(date, unit, timeZone) - calendarIndex(from, unit, timeZone)
    if (steps !== count) numeric = "always"
  }
  return cachedFormat(relativeFormats, newRelativeFormat, locale, {
    numeric,
  }).format(count, unit)
}

function numberFormat(
  type: "number" | "currency" | "percent",
  format: ResolvedFormat
) {
  const digits = {
    minimumFractionDigits: format.minimumFractionDigits,
    maximumFractionDigits: format.maximumFractionDigits,
  }
  return cachedFormat(
    numberFormats,
    newNumberFormat,
    format.locale,
    type === "currency"
      ? {
          style: "currency",
          currency: format.currency,
          currencyDisplay: format.currencyDisplay,
          ...digits,
        }
      : type === "percent"
        ? { style: "percent", ...digits }
        : digits
  )
}

// A date is a day, so it never takes a time zone; a datetime is an instant in
// its zone; a time is a clock reading, formatted in UTC so no zone moves it.
function dateFormat(
  type: "date" | "datetime" | "time",
  format: ResolvedFormat
) {
  const { dateStyle, timeStyle, hourCycle } = format
  return cachedFormat(
    dateFormats,
    newDateFormat,
    format.locale,
    type === "date"
      ? { dateStyle }
      : type === "datetime"
        ? { dateStyle, timeStyle, hourCycle, timeZone: format.timeZone }
        : {
            // Long and full would name the UTC zone a time doesn't have.
            timeStyle: timeStyle === "short" ? timeStyle : "medium",
            hourCycle,
            timeZone: "UTC",
          }
  )
}

// Intl takes no zone name beside a named style, so it's read on its own and
// added after the text. Long and full time styles already name the zone.
function zoneSuffix(date: Date, format: ResolvedFormat) {
  if (!format.timeZoneName) return ""
  if (format.timeStyle === "long" || format.timeStyle === "full") return ""
  const name = cachedFormat(dateFormats, newDateFormat, format.locale, {
    timeZone: format.timeZone,
    timeZoneName: format.timeZoneName,
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value
  return name ? ` ${name}` : ""
}

/**
 * Formats a value as its type shows it: a percent from a fraction (0.6 is
 * 60%), a day in its style, an instant in its zone, a time of day, a phone
 * number in the locale's form, an address on one line, a relative value
 * counted from `now`. Text the type can't read passes through; empty values
 * are "".
 */
function formatOutputValue(
  value: unknown,
  type: OutputFieldType = "text",
  options?: OutputFieldFormatOptions
): string {
  if (isEmpty(value)) return ""
  const format = resolveFormat(options)
  switch (type) {
    case "number":
    case "currency":
    case "percent": {
      const numeric = toNumeric(value)
      if (numeric === null) return String(value)
      // Intl formats a decimal string exactly, which older lib types don't declare.
      return numberFormat(type, format).format(numeric as number)
    }
    case "date":
    case "datetime": {
      const date = toDate(value)
      if (!date) return String(value)
      const text = dateFormat(type, format).format(date)
      return type === "datetime" ? text + zoneSuffix(date, format) : text
    }
    case "time": {
      const time = clockTime(value)
      if (time === null) return String(value)
      return dateFormat(type, format).format(new Date(time))
    }
    case "relative": {
      const date = toDate(value)
      if (!date) return String(value)
      return relativeText(date, format)
    }
    case "phone":
      return phoneText(String(value), format.locale)
    case "address":
      return isParts(value)
        ? addressLines(value as OutputFieldAddress).join(", ")
        : String(value)
    case "name":
      return isParts(value) ? nameText(value as OutputFieldName) : String(value)
    case "boolean":
      return value ? "True" : "False"
    default:
      return String(value)
  }
}

const safeScheme = /^(https?|mailto|tel):/i
// A scheme is letters before a colon that a digit doesn't follow:
// "javascript:alert(1)" has one, "localhost:3000" and
// "intranet.acme.com:8443/portal" are a host and a port.
const otherScheme = /^[a-z][a-z\d+.-]*:(?!\d)/i
const relative = /^(\/(?!\/)|\.\.?\/|#|\?)/

/**
 * The link for a url, email or phone value, or undefined. A relative URL stays
 * as it is, a URL with no scheme gets https://, and one with a scheme other
 * than http, https, mailto or tel gets no link.
 */
function outputValueHref(
  value: unknown,
  type: OutputFieldType = "text"
): string | undefined {
  if (isEmpty(value)) return undefined
  const text = String(value).trim()
  switch (type) {
    case "url":
      if (safeScheme.test(text) || relative.test(text)) return text
      if (text.startsWith("//")) return `https:${text}`
      return otherScheme.test(text) ? undefined : `https://${text}`
    case "email":
      return `mailto:${text}`
    case "phone":
      return `tel:${text.replace(/\s+/g, "")}`
    default:
      return undefined
  }
}

const OutputFieldContext = React.createContext<{
  labelId: string
  loading: boolean
} | null>(null)

function useOutputField(part: string) {
  const context = React.useContext(OutputFieldContext)
  if (!context) throw new Error(`${part} must be used within OutputField.`)
  return context
}

// Each line is as tall as the body text's, even where the label or value is
// smaller, so stacked fields keep one rhythm.
const stacked =
  "[--output-field-line:calc(var(--font-size-base)*1.5)] grid grid-cols-[minmax(0,1fr)_auto] content-start gap-y-0 border-b px-1 *:data-[slot=field-description]:col-span-full *:data-[slot=field-label]:col-span-full *:data-[slot=output-field-edit]:w-6"

const horizontal =
  "py-(--field-horizontal-spacing-block) md:grid-cols-[calc(33%-1.25rem)_1.25rem_minmax(0,1fr)_auto] md:gap-x-0 md:*:data-[slot=field-description]:col-span-2 md:*:data-[slot=field-description]:col-start-3 md:*:data-[slot=field-label]:col-span-1 md:*:data-[slot=output-field-edit]:col-start-4 md:*:data-[slot=output-field-value]:col-start-3"

// The same, when the page is compact.
const auto =
  "compact:py-(--field-horizontal-spacing-block) compact:md:grid-cols-[calc(33%-1.25rem)_1.25rem_minmax(0,1fr)_auto] compact:md:gap-x-0 compact:md:*:data-[slot=field-description]:col-span-2 compact:md:*:data-[slot=field-description]:col-start-3 compact:md:*:data-[slot=field-label]:col-span-1 compact:md:*:data-[slot=output-field-edit]:col-start-4 compact:md:*:data-[slot=output-field-value]:col-start-3"

function OutputField({
  layout = "stacked",
  loading = false,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Field>, "orientation"> & {
  /** Still loading: the value is a placeholder, the edit button hides, the field is aria-busy. */
  loading?: boolean
}) {
  const labelId = React.useId()
  const context = React.useMemo(
    () => ({ labelId, loading }),
    [labelId, loading]
  )

  return (
    <OutputFieldContext.Provider value={context}>
      <Field
        data-slot="output-field"
        layout={layout}
        aria-labelledby={labelId}
        aria-busy={loading || undefined}
        className={cn(
          stacked,
          layout === "horizontal" && horizontal,
          layout === "auto" && auto,
          className
        )}
        {...props}
      />
    </OutputFieldContext.Provider>
  )
}

function OutputFieldLabel({
  help,
  helpLabel = "Help for",
  className,
  children,
  ...props
}: React.ComponentProps<typeof FieldTitle> & {
  /** Help text, in a tooltip from an info button beside the label. */
  help?: React.ReactNode
  /** The words before the label in the help button's name. Defaults to "Help for". */
  helpLabel?: string
}) {
  const { labelId, loading } = useOutputField("OutputFieldLabel")
  const wordId = React.useId()
  const helpId = React.useId()

  if (loading && children == null) {
    // The group's aria-labelledby still points at the span, so the field
    // keeps a name ("Loading") until the label comes.
    return (
      <FieldTitle
        className={cn("pt-1 leading-(--output-field-line)", className)}
        {...props}
      >
        <span id={labelId} className="sr-only">
          Loading
        </span>
        <Skeleton data-loading="" className="my-[0.25em] h-[1em] w-[10ch]" />
      </FieldTitle>
    )
  }

  return (
    <FieldTitle
      className={cn("pt-1 leading-(--output-field-line)", className)}
      {...props}
    >
      <span id={labelId}>{children}</span>
      {help != null && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-labelledby={`${wordId} ${labelId}`}
              aria-describedby={helpId}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-xs" }),
                "-my-1 size-5 text-(--button-icon-foreground) focus-visible:shadow-(--shadow-focus)"
              )}
            >
              <InfoIcon aria-hidden="true" />
              <span id={wordId} hidden>
                {helpLabel}
              </span>
              <span id={helpId} hidden>
                {help}
              </span>
            </TooltipTrigger>
            <TooltipContent>{help}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </FieldTitle>
  )
}

const linkClass = "text-link hover:underline focus-visible:underline"

// The anchor both value parts draw. A label shows in place of the value's
// text, but a blank one would leave the link without a name.
function ValueLink({
  href,
  text,
  linkLabel,
  linkTarget,
  linkTitle,
}: OutputFieldLinkOptions & { href: string; text: string }) {
  return (
    <a
      className={linkClass}
      href={href}
      target={linkTarget}
      rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
      title={linkTitle}
    >
      {linkLabel?.trim() ? linkLabel : text}
    </a>
  )
}

// The absolute date and time sit in the title for a pointer and after the
// text for a screen reader.
function RelativeTime({
  value,
  text,
  options,
}: {
  value: unknown
  text: string
  options: OutputFieldFormatOptions
}) {
  const date = toDate(value)
  if (!date) return text
  const absolute = formatOutputValue(value, "datetime", options)
  // Without `now` the text depends on the clock, so a server and a browser
  // render can differ by a unit.
  return (
    <>
      <time
        dateTime={date.toISOString()}
        title={absolute}
        suppressHydrationWarning={options.now === undefined}
      >
        {text}
      </time>
      <span className="sr-only">{`, ${absolute}`}</span>
    </>
  )
}

function OutputFieldValue({
  type = "text",
  value,
  href,
  linkLabel,
  linkTarget,
  linkTitle,
  locale = outputFieldFormatDefaults.locale,
  currency = outputFieldFormatDefaults.currency,
  timeZone = outputFieldFormatDefaults.timeZone,
  now,
  fractionDigits,
  minimumFractionDigits,
  maximumFractionDigits,
  currencyDisplay = outputFieldFormatDefaults.currencyDisplay,
  dateStyle = outputFieldFormatDefaults.dateStyle,
  timeStyle = outputFieldFormatDefaults.timeStyle,
  hour12,
  timeZoneName,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & OutputFieldValueProps) {
  const { loading } = useOutputField("OutputFieldValue")
  const options = {
    locale,
    currency,
    timeZone,
    now,
    fractionDigits,
    minimumFractionDigits,
    maximumFractionDigits,
    currencyDisplay,
    dateStyle,
    timeStyle,
    hour12,
    timeZoneName,
  }
  // An address shows on its lines, which whitespace-pre-line keeps.
  const text =
    type === "address" && isParts(value)
      ? addressLines(value as OutputFieldAddress).join("\n")
      : formatOutputValue(value, type, options)
  const link = href ?? outputValueHref(value, type)

  let content: React.ReactNode = text || null
  if (loading) {
    content = (
      <Skeleton data-loading="" className="my-[0.25em] h-[1em] w-[16ch]" />
    )
  } else if (type === "boolean" && !isEmpty(value)) {
    // A drawn checkbox, not a control.
    content = (
      <>
        <span
          aria-hidden="true"
          data-checked={value ? "" : undefined}
          className="inline-flex size-4 items-center justify-center rounded-(--checkbox-radius) border border-(--checkbox-border) bg-(--checkbox-background) align-middle text-(--checkbox-foreground-checked) data-checked:bg-(--checkbox-background-checked) data-checked:shadow-(--checkbox-shadow-checked)"
        >
          {value ? <CheckIcon className="size-3 stroke-[3.5]" /> : null}
        </span>
        <span className="sr-only">{text}</span>
      </>
    )
  } else if (type === "relative" && text) {
    content = <RelativeTime value={value} text={text} options={options} />
  } else if (text && link) {
    content = (
      <ValueLink
        href={link}
        text={text}
        linkLabel={linkLabel}
        linkTarget={linkTarget}
        linkTitle={linkTitle}
      />
    )
  }

  // An empty value keeps a filled one-line value's height, so the bottom
  // borders of two fields in a row stay level when one is blank.
  return (
    <div
      data-slot="output-field-value"
      data-type={type}
      className={cn(
        "min-w-0 py-0.5 text-(length:--field-static-size) leading-(--output-field-line) font-normal wrap-break-word whitespace-pre-line text-(--field-static-foreground) empty:min-h-[calc(1lh+--spacing(1))]",
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

/** A value on one line, as a table cell or a header detail shows it: a true boolean is a check, false is blank. */
function OutputFieldCompactValue({
  type = "text",
  value,
  href,
  linkLabel,
  linkTarget,
  linkTitle,
  ...options
}: OutputFieldValueProps) {
  const text = formatOutputValue(value, type, options)
  if (text === "") return null
  if (type === "boolean")
    return value ? (
      <>
        <CheckIcon
          aria-hidden="true"
          className="size-4 align-middle text-(--icon-foreground)"
        />
        <span className="sr-only">{text}</span>
      </>
    ) : null
  if (type === "relative")
    return <RelativeTime value={value} text={text} options={options} />
  const link = href ?? outputValueHref(value, type)
  return link ? (
    <ValueLink
      href={link}
      text={text}
      linkLabel={linkLabel}
      linkTarget={linkTarget}
      linkTitle={linkTitle}
    />
  ) : (
    text
  )
}

function OutputFieldEdit({
  label = "Edit",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  /** The word before the field's label in the button's name. Defaults to "Edit". */
  label?: string
}) {
  const { labelId, loading } = useOutputField("OutputFieldEdit")
  const wordId = React.useId()
  if (loading) return null

  return (
    <Button
      data-slot="output-field-edit"
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-labelledby={props["aria-label"] ? undefined : `${wordId} ${labelId}`}
      className={cn(
        "-my-0.5 self-end text-(--button-icon-foreground) group-hover/field:text-secondary-foreground group-focus-within/field:text-secondary-foreground focus-visible:shadow-(--shadow-focus)",
        className
      )}
      {...props}
    >
      <PencilIcon aria-hidden="true" />
      <span id={wordId} hidden>
        {label}
      </span>
    </Button>
  )
}

export {
  OutputField,
  OutputFieldLabel,
  OutputFieldValue,
  OutputFieldCompactValue,
  OutputFieldEdit,
  compareOutputTimes,
  formatOutputValue,
  outputValueHref,
  type OutputFieldAddress,
  type OutputFieldDateStyle,
  type OutputFieldFormatOptions,
  type OutputFieldLinkOptions,
  type OutputFieldName,
  type OutputFieldPlainValue,
  type OutputFieldStyleOptions,
  type OutputFieldType,
}
