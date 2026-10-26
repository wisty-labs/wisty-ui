"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { CircleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  DateTimePicker,
  DateTimePickerDate,
  DateTimePickerTime,
  dateTimeToInstant,
  instantToDateTime,
  type DateTimePickerChangeDetails,
} from "@/components/wisty/datetime-picker"
import { Icon } from "@/components/wisty/icon"
import {
  Lookup,
  type LookupRecord,
  type LookupSearch,
} from "@/components/wisty/lookup"
import {
  parseNumber,
  toFraction,
  toPercentage,
} from "@/components/wisty/number-input"
import type {
  RecordDetailFieldDescription,
  RecordDetailOption,
  RecordDetailValues,
} from "@/components/wisty/record-detail"
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  TimePickerList,
} from "@/components/wisty/time-picker"

type LookupIcon = React.ComponentProps<typeof Lookup>["icon"]

/** A picklist value and its label. */
type RecordFormOption = RecordDetailOption

// Record detail's description of one type or a few.
type Described<T extends RecordDetailFieldDescription["type"]> = Extract<
  RecordDetailFieldDescription,
  { type: T }
>

/** How a field is drawn, read and edited: Record detail's description, with what editing needs. */
type RecordFormFieldDescription =
  | (Described<"text" | "email" | "phone" | "url" | "textarea"> & {
      /** Must be filled in to save. */
      required?: boolean
      /** The most characters the field takes. */
      maxLength?: number
    })
  | (Described<"number" | "currency" | "percent"> & {
      /** Must be filled in to save. */
      required?: boolean
    })
  | (Described<"date"> & {
      /** Must be filled in to save. */
      required?: boolean
      /** The earliest day allowed, as "YYYY-MM-DD". */
      min?: string
      /** The latest day allowed, as "YYYY-MM-DD". */
      max?: string
    })
  | (Described<"datetime" | "time"> & {
      /** Must be filled in to save. */
      required?: boolean
    })
  | (Described<"picklist"> & {
      /** Must be filled in to save. */
      required?: boolean
    })
  // A checkbox is never required: it always holds a value.
  | Described<"boolean">
  | (Described<"address"> & {
      /** Every part must be filled in. The legend carries the asterisk. */
      required?: boolean
      /** Each part's label, like "Billing City". Default: the part's own name. */
      labels?: Partial<Record<RecordFormAddressPart, string>>
    })
  | (Described<"name"> & {
      /** The last name must be filled in. The legend and the last name carry the asterisk. */
      required?: boolean
      /** The salutation picklist's values. Default Mr., Ms., Mrs., Dr. and Prof. */
      salutations?: readonly RecordFormOption[]
      /** Each part's label. Default: the part's own name. */
      labels?: Partial<Record<RecordFormNamePart, string>>
    })
  | (Described<"lookup"> & {
      /** Must be filled in to save. */
      required?: boolean
      /** Finds records for a term, as Lookup's onSearch. */
      onSearch?: LookupSearch
      /** The object icon, like "standard:account". */
      icon?: LookupIcon
      /** Shown while the lookup is empty. */
      placeholder?: string
    })

/** The parts of an address field, in the order they're drawn. */
type RecordFormAddressPart =
  | "street"
  | "city"
  | "state"
  | "postalCode"
  | "country"

/** The parts of a name field, in the order they're drawn. */
type RecordFormNamePart =
  | "salutation"
  | "firstName"
  | "middleName"
  | "lastName"
  | "suffix"

/** A submitted address: each part's text, or null when it's empty. */
type RecordFormAddressValue = Record<RecordFormAddressPart, string | null>

/** A submitted name: each part's text, or null when it's empty. */
type RecordFormNameValue = Record<RecordFormNamePart, string | null>

/** A field's type; never "relative", which only a read-only view shows. */
type RecordFormFieldType = RecordFormFieldDescription["type"]

/** The fields on the form, keyed by API name. */
type RecordFormFields = Record<string, RecordFormFieldDescription>

/** A submitted value: null when empty, a lookup's record id, a percent as a fraction, a datetime as an ISO 8601 instant, a time as "HH:mm:ss.SSSZ", a compound field's parts. */
type RecordFormValue =
  | string
  | number
  | boolean
  | RecordFormAddressValue
  | RecordFormNameValue
  | null

type RecordFormValues = Record<string, RecordFormValue>

/** The record's values, keyed by API name: a lookup's is its record, a compound field's its parts. */
type RecordFormDefaultValues = RecordDetailValues

type RecordFormIntent = "save" | "save-and-new"

interface RecordFormSubmitDetails {
  /** The button that saved: Save, or Save & New. */
  intent: RecordFormIntent
  /** The values that differ from defaultValues, as updateRecord takes them. */
  changed: RecordFormValues
}

/** A failed save's errors, as the app returns them. */
interface RecordFormErrors {
  /** Errors for the whole record, like a validation rule's. */
  form?: string | readonly string[]
  /** Errors per field, keyed by API name. */
  fields?: Record<string, string | readonly string[]>
}

// A compound field's draft: each part's text, "" when empty.
type CompoundDraft = Partial<Record<string, string>>

type Draft = string | boolean | LookupRecord | CompoundDraft | null

type RecordFormContextValue = {
  fields: RecordFormFields
  drafts: Record<string, Draft>
  setDraft: (name: string, draft: Draft, problem?: DraftProblem) => void
  errorsFor: (name: string) => string[]
  partErrorFor: (name: string, part: string) => string | undefined
  formMessages: string[]
  register: (name: string, element: HTMLElement, controlId: string) => void
  unregister: (name: string, element: HTMLElement) => void
  messagesRef: React.RefObject<HTMLDivElement | null>
  requestSubmit: (intent: RecordFormIntent) => void
  submittedIntent: RecordFormIntent
  pending: boolean
  locale: string
  currency: string
  timeZone: string
  highlightChanges: boolean
  isChanged: (name: string) => boolean
  undo: (name: string) => void
  resets: Record<string, number>
}

const RecordFormContext = React.createContext<RecordFormContextValue | null>(
  null
)

function useRecordForm(part: string) {
  const context = React.useContext(RecordFormContext)
  if (!context) throw new Error(`${part} must be used inside <RecordForm>.`)
  return context
}

/** What a custom control inside RecordFormField reads and calls. */
interface RecordFormControl {
  /** The value as the form submits it: null when empty, a lookup's id, a percent as a fraction. */
  value: RecordFormValue
  /** Sets the value; pass `error` with `null` while the entry isn't a value, and a save stops on it. */
  onValueChange: (value: RecordFormValue, details?: { error?: string }) => void
  /** Spread on the element people focus, so the label names it and a failed save focuses it. */
  controlProps: {
    id: string
    "aria-required": true | undefined
    "aria-invalid": true | undefined
    "aria-describedby": string | undefined
  }
}

const RecordFormControlContext = React.createContext<RecordFormControl | null>(
  null
)

/** Joins a custom control to its RecordFormField: the form's checks, changes, undo and focus. */
function useRecordFormControl() {
  const control = React.useContext(RecordFormControlContext)
  if (!control)
    throw new Error(
      "useRecordFormControl must be used inside <RecordFormField>."
    )
  return control
}

const messages = {
  required: "Complete this field.",
  email: "You have entered an invalid format.",
  number: "Enter a valid value.",
  dateFormat: "Your entry does not match the allowed format.",
}

// Why the date picker couldn't take a date: its `details.error`.
type DateProblem = "format" | "min" | "max"

// Why a control holds no value: the date or time picker's reason, or a message, for one of
// a datetime's halves when `part` names it.
type DraftProblem = DateProblem | { error: string; part?: DateTimeHalf }

type DateTimeHalf = "date" | "time"

// How the form reads and writes values: numbers and dates in the locale, instants on the zone's clock.
type Format = { locale: string; timeZone: string }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputTypes: Partial<Record<RecordFormFieldType, string>> = {
  text: "text",
  email: "email",
  phone: "tel",
  url: "url",
}

const addressParts: readonly RecordFormAddressPart[] = [
  "street",
  "city",
  "state",
  "postalCode",
  "country",
]
const nameParts: readonly RecordFormNamePart[] = [
  "salutation",
  "firstName",
  "middleName",
  "lastName",
  "suffix",
]

const dateTimeHalves: readonly DateTimeHalf[] = ["date", "time"]

// The parts of a compound field or a datetime's halves, or null for any other.
function partsOf(type: RecordFormFieldType): readonly string[] | null {
  if (type === "address") return addressParts
  if (type === "name") return nameParts
  if (type === "datetime") return dateTimeHalves
  return null
}

const partLabels: Record<string, string> = {
  street: "Street",
  city: "City",
  state: "State/Province",
  postalCode: "Zip/Postal Code",
  country: "Country",
  salutation: "Salutation",
  firstName: "First Name",
  middleName: "Middle Name",
  lastName: "Last Name",
  suffix: "Suffix",
}

const defaultSalutations: readonly RecordFormOption[] = [
  { value: "Mr.", label: "Mr." },
  { value: "Ms.", label: "Ms." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Dr.", label: "Dr." },
  { value: "Prof.", label: "Prof." },
]

// A compound value's or draft's parts, or null for any other value.
function compoundOf(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" &&
    value !== null &&
    !(value instanceof Date) &&
    !isLookupRecord(value)
    ? (value as Record<string, unknown>)
    : null
}

// A required address needs every part; a required name only its last name.
function requiredParts(field: RecordFormFieldDescription): readonly string[] {
  if (field.type === "address" && field.required) return addressParts
  if (field.type === "name" && field.required) return ["lastName"]
  return []
}

// Two values compare part by part when they're compound, so `changed` and
// the edited highlight see an address whose city changed, not a new object.
function sameValue(a: RecordFormValue, b: RecordFormValue) {
  const x = compoundOf(a)
  const y = compoundOf(b)
  if (x && y) {
    const keys = new Set([...Object.keys(x), ...Object.keys(y)])
    return [...keys].every((key) => (x[key] ?? null) === (y[key] ?? null))
  }
  return a === b
}

// The field a problem's key names: "BillingAddress.city" is the address's.
function fieldOfKey(key: string, fields: RecordFormFields) {
  if (key in fields) return key
  const dot = key.lastIndexOf(".")
  return dot === -1 ? key : key.slice(0, dot)
}

function toList(list: string | readonly string[] | undefined) {
  if (list === undefined) return []
  return typeof list === "string" ? [list] : [...list]
}

function isNumberType(type: RecordFormFieldType) {
  return type === "number" || type === "currency" || type === "percent"
}

// Intl formatters are slow to create, and highlightChanges formats and parses
// every field's default on each render, so they're kept per locale.
const numberFormats = new Map<string, Intl.NumberFormat>()

function formatNumber(
  value: number,
  scale: number | undefined,
  locale: string
) {
  const key = `${locale}|${scale ?? ""}`
  let format = numberFormats.get(key)
  if (!format) {
    format = new Intl.NumberFormat(locale, {
      minimumFractionDigits: scale ?? 0,
      maximumFractionDigits: scale ?? 20,
    })
    numberFormats.set(key, format)
  }
  return format.format(value)
}

function currencySymbol(currency: string, locale: string) {
  return (
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  )
}

function isLookupRecord(value: unknown): value is LookupRecord {
  return typeof value === "object" && value !== null && "id" in value
}

function partOf(draft: Draft, part: string): string {
  const text = compoundOf(draft)?.[part]
  return typeof text === "string" ? text : ""
}

// A time of day as Salesforce stores it, "HH:mm:ss.SSSZ", and the shorter shapes, read as
// "HH:MM" for the time picker; seconds and a zone are dropped, as the field shows minutes.
const clock =
  /^(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/

function clockOf(text: string) {
  const match = clock.exec(text)
  if (!match) return null
  const [, hours, minutes, seconds = "00"] = match
  if (Number(hours) > 23 || Number(minutes) > 59 || Number(seconds) > 59)
    return null
  return `${hours}:${minutes}`
}

function toDraft(
  field: RecordFormFieldDescription,
  value: RecordFormDefaultValues[string],
  { locale }: Format
): Draft {
  switch (field.type) {
    case "boolean":
      return value === true
    case "lookup":
      if (isLookupRecord(value)) return value
      if (typeof value !== "string") return null
      // An id alone falls back to the id as its name, so the value never quietly disappears.
      return (
        field.records?.find((record) => record.id === value) ?? {
          id: value,
          name: value,
        }
      )
    case "number":
    case "currency":
    case "percent":
      return typeof value === "number"
        ? formatNumber(
            field.type === "percent" ? toPercentage(value) : value,
            field.scale,
            locale
          )
        : ""
    case "date":
    case "picklist":
      return typeof value === "string" ? value : null
    // Text that isn't an instant or a time stays, so the picker shows it with its format error.
    case "datetime":
      if (typeof value === "number") return new Date(value).toISOString()
      return typeof value === "string" ? value : null
    case "time":
      return typeof value === "string" ? (clockOf(value) ?? value) : null
    case "address":
    case "name": {
      return Object.fromEntries(
        partsOf(field.type)!.map((part) => {
          const text = compoundOf(value)?.[part]
          return [part, typeof text === "string" ? text : ""]
        })
      )
    }
    default:
      return value === null || value === undefined || isLookupRecord(value)
        ? ""
        : String(value)
  }
}

// A day as the date field shows it, "Jan 1, 2026", in UTC so it never
// shifts with the browser's time zone.
function formatDay(iso: string | undefined, locale: string) {
  if (!iso) return ""
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`))
}

// The canonical value of a draft, or undefined when it can't be read (text that isn't a
// number, a date the picker couldn't take). Whether the value is allowed is readDraft's.
function toValue(
  field: RecordFormFieldDescription,
  draft: Draft,
  problem: DraftProblem | undefined,
  { locale }: Format
): RecordFormValue | undefined {
  if (problem) return undefined
  if (field.type === "boolean") return draft === true
  if (field.type === "address" || field.type === "name")
    return Object.fromEntries(
      partsOf(field.type)!.map((part) => {
        const text = partOf(draft, part)
        return [part, text.trim() === "" ? null : text]
      })
    ) as RecordFormAddressValue | RecordFormNameValue
  if (field.type === "lookup") return isLookupRecord(draft) ? draft.id : null
  if (field.type === "datetime" || field.type === "time") {
    if (typeof draft !== "string" || draft.trim() === "") return null
    if (field.type === "datetime") {
      const time = Date.parse(draft)
      return Number.isNaN(time) ? undefined : new Date(time).toISOString()
    }
    const time = clockOf(draft)
    return time ? `${time}:00.000Z` : undefined
  }
  if (isNumberType(field.type)) {
    const number = parseNumber(typeof draft === "string" ? draft : "", locale)
    if (number === undefined) return undefined
    return field.type === "percent" && number !== null
      ? toFraction(number)
      : number
  }
  if (typeof draft === "string") return draft.trim() === "" ? null : draft
  return null
}

// The canonical value of a draft, or the message that says why there isn't one; a
// compound field's problems are its parts', keyed by part.
function readDraft(
  field: RecordFormFieldDescription,
  draft: Draft,
  problem: DraftProblem | undefined,
  format: Format
):
  | { value: RecordFormValue }
  | { error: string }
  | { partErrors: Record<string, string> } {
  if (typeof problem === "object")
    return problem.part
      ? { partErrors: { [problem.part]: problem.error } }
      : { error: problem.error }
  if (field.type === "boolean") return { value: draft === true }
  if (field.type === "address" || field.type === "name") {
    const value = toValue(field, draft, problem, format) as Record<
      string,
      string | null
    >
    const missing = requiredParts(field).filter((part) => value[part] === null)
    if (missing.length > 0)
      return {
        partErrors: Object.fromEntries(
          missing.map((part) => [part, messages.required])
        ),
      }
    return { value: value as RecordFormValue }
  }
  if (field.type === "date" && problem === "format")
    return { error: messages.dateFormat }
  if (field.type === "date" && problem === "min")
    return {
      error: `Value must be ${formatDay(field.min, format.locale)} or later.`,
    }
  if (field.type === "date" && problem === "max")
    return {
      error: `Value must be ${formatDay(field.max, format.locale)} or earlier.`,
    }

  const value = toValue(field, draft, problem, format)
  // A number that doesn't parse, a time the picker couldn't read, or a default that isn't an
  // instant or a time.
  if (value === undefined)
    return {
      error:
        field.type === "datetime" || field.type === "time"
          ? messages.dateFormat
          : messages.number,
    }
  if (value === null && field.required) return { error: messages.required }
  if (
    field.type === "email" &&
    value !== null &&
    !emailPattern.test(String(value))
  )
    return { error: messages.email }
  return { value }
}

type Registered = Map<string, { element: HTMLElement; controlId: string }>

// The fields on the page, in reading order.
function onPage(registered: Registered) {
  return [...registered.entries()].sort(([, a], [, b]) =>
    a.element.compareDocumentPosition(b.element) &
    Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1
  )
}

// A key like "BillingAddress.city" names a compound field's part, which the part's
// element points at with data-control.
function focusFirst(registered: Registered, names: ReadonlySet<string>) {
  for (const [name, { element, controlId }] of onPage(registered)) {
    if (names.has(name)) {
      document.getElementById(controlId)?.focus()
      return true
    }
    const part = [...element.querySelectorAll<HTMLElement>("[data-part]")].find(
      (candidate) => names.has(`${name}.${candidate.dataset.part}`)
    )
    if (part) {
      document.getElementById(part.dataset.control ?? "")?.focus()
      return true
    }
  }
  return false
}

// Both refs see the element and both are released on cleanup. A function ref may return
// its own cleanup, as React 19 allows; one that doesn't is called with null instead.
function composeRef<T extends HTMLElement>(
  ref: React.Ref<T> | undefined,
  own: (element: T) => void | (() => void)
) {
  return (element: T | null) => {
    if (!element) return
    const release = typeof ref === "function" ? ref(element) : undefined
    if (ref && typeof ref !== "function") ref.current = element
    const cleanup = own(element)
    return () => {
      cleanup?.()
      if (typeof release === "function") release()
      else if (typeof ref === "function") ref(null)
      else if (ref) ref.current = null
    }
  }
}

// A default as the form would submit it untouched, rounded to the field's scale and "" as
// null, so `changed` and the edited highlight never report a field nobody edited.
function canonicalDefault(
  field: RecordFormFieldDescription,
  value: RecordFormDefaultValues[string],
  format: Format
): RecordFormValue {
  return (
    toValue(field, toDraft(field, value, format), undefined, format) ?? null
  )
}

// A datetime half the picker can't read, or an empty half beside a filled one, is that half's problem.
function dateTimeProblem(
  details: DateTimePickerChangeDetails
): DraftProblem | undefined {
  if (details.invalid)
    return { error: messages.dateFormat, part: details.invalid }
  if (details.missing)
    return { error: messages.required, part: details.missing }
  return undefined
}

/** A record edit form: its fields, its values, and what a failed save returns. */
interface RecordFormProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "defaultValue"
> {
  /** Every field the form can show, keyed by API name. */
  fields: RecordFormFields
  /** The record's values. Change the form's `key` to start again, after Save & New. */
  defaultValues?: RecordFormDefaultValues
  /** A failed save's errors. Pass a new object for each save, from state. */
  errors?: RecordFormErrors
  /** The save is running: Save shows a spinner and the buttons are disabled. */
  pending?: boolean
  /** Called with valid values when Save or Save & New is pressed. */
  onSubmit?: (
    values: RecordFormValues,
    details: RecordFormSubmitDetails
  ) => void
  /** A BCP 47 locale for numbers and dates. Default "en-US". */
  locale?: string
  /** An ISO 4217 code for currency fields. Default "USD". */
  currency?: string
  /** An IANA time zone whose clock datetime fields show and are typed in. Default "UTC". */
  timeZone?: string
  /** Marks each field whose value differs from `defaultValues`, with an undo button. Default false. */
  highlightChanges?: boolean
  /** The API name of the field whose control takes focus when the form mounts. */
  autoFocusField?: string
  /** Called with the fields the form's own checks stopped a save for, in page order, before focus moves. */
  onInvalidFields?: (names: string[]) => void
}

function RecordForm({
  fields,
  defaultValues = {},
  errors,
  pending = false,
  onSubmit,
  locale = "en-US",
  currency = "USD",
  timeZone = "UTC",
  highlightChanges = false,
  autoFocusField,
  onInvalidFields,
  className,
  children,
  ref,
  ...props
}: RecordFormProps) {
  const format: Format = { locale, timeZone }
  const [drafts, setDrafts] = React.useState(() =>
    Object.fromEntries(
      Object.entries(fields).map(([name, field]) => [
        name,
        toDraft(field, defaultValues[name], format),
      ])
    )
  )
  // The latest drafts, for a submit in the same event as a change: Enter in
  // the date field commits its text, then submits.
  const latest = React.useRef(drafts)
  const [clientErrors, setClientErrors] = React.useState<
    Record<string, string>
  >({})
  // Fields edited since the app's errors arrived; their errors no longer apply.
  const [edited, setEdited] = React.useState<ReadonlySet<string>>(new Set())
  const [shownErrors, setShownErrors] = React.useState(errors)
  // Adjusted during render, so the first render with new errors hides none of them behind old edits.
  if (errors !== shownErrors) {
    setShownErrors(errors)
    setEdited(new Set())
  }
  const [submittedIntent, setSubmittedIntent] =
    React.useState<RecordFormIntent>("save")
  const intent = React.useRef<RecordFormIntent>("save")
  const formRef = React.useRef<HTMLFormElement>(null)
  const messagesRef = React.useRef<HTMLDivElement>(null)
  // Errors the form opened with are a page's state, not a save's, so they
  // don't take focus.
  const initialErrors = React.useRef(errors)
  const registered = React.useRef<Registered>(new Map())
  // The registered fields' names, as state too, so render can tell an error
  // for a field on the page from one for a field the page doesn't draw.
  const [onPageNames, setOnPageNames] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )
  // Why each field's control holds no value, from its last change, read on submit.
  const draftProblems = React.useRef<Record<string, DraftProblem | undefined>>(
    {}
  )
  // The same, as state, for the edited highlight, which render reads.
  const [shownProblems, setShownProblems] = React.useState<
    Record<string, DraftProblem | undefined>
  >({})
  // A count per field that Undo raises, keying its control so it remounts
  // and drops the text it holds.
  const [resets, setResets] = React.useState<Record<string, number>>({})
  // The field to focus once the form has mounted; later changes don't move
  // focus, as autoFocus doesn't on an input.
  const initialAutoFocus = React.useRef(autoFocusField)

  // Stable, so a field's ref callback is too and runs once per mount, not
  // once per render.
  const register = React.useCallback(
    (name: string, element: HTMLElement, controlId: string) => {
      registered.current.set(name, { element, controlId })
      setOnPageNames((current) =>
        current.has(name) ? current : new Set(current).add(name)
      )
    },
    []
  )
  const unregister = React.useCallback((name: string, element: HTMLElement) => {
    if (registered.current.get(name)?.element !== element) return
    registered.current.delete(name)
    setOnPageNames((current) => {
      if (!current.has(name)) return current
      const next = new Set(current)
      next.delete(name)
      return next
    })
  }, [])
  // The page's ref on the form beside the form's own, which Save & New's
  // requestSubmit needs.
  const setFormRef = React.useMemo(
    () =>
      composeRef<HTMLFormElement>(ref, (form) => {
        formRef.current = form
        return () => {
          formRef.current = null
        }
      }),
    [ref, formRef]
  )

  const setDraft = (name: string, draft: Draft, problem?: DraftProblem) => {
    const previous = latest.current[name] ?? null
    latest.current = { ...latest.current, [name]: draft }
    draftProblems.current[name] = problem
    setDrafts(latest.current)
    setShownProblems((current) =>
      current[name] === problem ? current : { ...current, [name]: problem }
    )
    // The field's error, and the errors of a compound field's parts that
    // changed, so a fixed city clears while an empty street keeps its own. A
    // datetime's draft doesn't hold its halves, so either half's change clears both.
    const stale = (key: string) => {
      if (key === name) return true
      if (!key.startsWith(`${name}.`)) return false
      const part = key.slice(name.length + 1)
      return (
        !compoundOf(draft) || partOf(previous, part) !== partOf(draft, part)
      )
    }
    setClientErrors((current) => {
      if (!Object.keys(current).some(stale)) return current
      return Object.fromEntries(
        Object.entries(current).filter(([key]) => !stale(key))
      )
    })
    setEdited((current) =>
      current.has(name) ? current : new Set(current).add(name)
    )
  }

  // Whether a field's value differs from its default, compared as `changed`
  // compares on submit. An entry that can't be read has changed.
  const isChanged = (name: string) => {
    const field = fields[name]
    if (!field) return false
    const value = toValue(
      field,
      drafts[name] ?? null,
      shownProblems[name],
      format
    )
    return (
      value === undefined ||
      !sameValue(value, canonicalDefault(field, defaultValues[name], format))
    )
  }

  const undo = (name: string) => {
    const field = fields[name]
    if (!field) return
    setDraft(name, toDraft(field, defaultValues[name], format))
    setResets((current) => ({ ...current, [name]: (current[name] ?? 0) + 1 }))
  }

  const errorsFor = (name: string) => {
    if (clientErrors[name]) return [clientErrors[name]]
    if (edited.has(name)) return []
    return toList(errors?.fields?.[name])
  }

  const partErrorFor = (name: string, part: string) =>
    clientErrors[`${name}.${part}`]

  // The record's errors, plus a field's when the page doesn't draw that field, under its
  // label, so no error is lost.
  const formMessages = [
    ...toList(errors?.form),
    ...Object.entries(errors?.fields ?? {})
      .filter(([name]) => !onPageNames.has(name))
      .flatMap(([name, list]) =>
        toList(list).map(
          (message) => `${fields[name]?.label ?? name}: ${message}`
        )
      ),
  ]

  // A failed save moves focus to its first invalid field, or to the form's
  // messages when none of its errors belongs to a field on the page.
  React.useEffect(() => {
    if (!errors || errors === initialErrors.current) return
    const names = new Set(
      Object.entries(errors.fields ?? {})
        .filter(([, list]) => toList(list).length > 0)
        .map(([name]) => name)
    )
    if (!focusFirst(registered.current, names)) messagesRef.current?.focus()
  }, [errors])

  // Fields register in the commit, before effects run, so the control is there to focus.
  // Strict Mode runs this twice; focusing twice is harmless.
  React.useEffect(() => {
    const name = initialAutoFocus.current
    if (name) focusFirst(registered.current, new Set([name]))
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitIntent = intent.current
    intent.current = "save"
    if (pending) return

    const values: RecordFormValues = {}
    const changed: RecordFormValues = {}
    const problems: Record<string, string> = {}
    for (const [name] of onPage(registered.current)) {
      const field = fields[name]
      if (!field) continue
      const result = readDraft(
        field,
        latest.current[name] ?? null,
        draftProblems.current[name],
        format
      )
      if ("error" in result) {
        problems[name] = result.error
        continue
      }
      if ("partErrors" in result) {
        for (const [part, message] of Object.entries(result.partErrors))
          problems[`${name}.${part}`] = message
        continue
      }
      values[name] = result.value
      if (
        !sameValue(
          result.value,
          canonicalDefault(field, defaultValues[name], format)
        )
      )
        changed[name] = result.value
    }

    setClientErrors(problems)
    if (Object.keys(problems).length > 0) {
      const invalid = [
        ...new Set(Object.keys(problems).map((key) => fieldOfKey(key, fields))),
      ]
      // flushSync, so a page that opens a collapsed section here has shown the field before focus moves.
      if (onInvalidFields) flushSync(() => onInvalidFields(invalid))
      focusFirst(registered.current, new Set(Object.keys(problems)))
      return
    }
    setSubmittedIntent(submitIntent)
    onSubmit?.(values, { intent: submitIntent, changed })
  }

  const context: RecordFormContextValue = {
    fields,
    drafts,
    setDraft,
    errorsFor,
    partErrorFor,
    formMessages,
    register,
    unregister,
    messagesRef,
    requestSubmit: (next) => {
      intent.current = next
      formRef.current?.requestSubmit()
    },
    submittedIntent,
    pending,
    locale,
    currency,
    timeZone,
    highlightChanges,
    isChanged,
    undo,
    resets,
  }

  return (
    <RecordFormContext.Provider value={context}>
      <form
        ref={setFormRef}
        data-slot="record-form"
        noValidate
        aria-busy={pending || undefined}
        className={cn("flex flex-col gap-2", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </form>
    </RecordFormContext.Provider>
  )
}

/** The errors for the whole record, above the sections. Renders nothing without any. */
function RecordFormMessages({
  title = "We hit a snag.",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Alert>, "children" | "variant"> & {
  title?: string
}) {
  const { formMessages, messagesRef } = useRecordForm("RecordFormMessages")
  if (formMessages.length === 0) return null
  return (
    <Alert
      ref={messagesRef}
      data-slot="record-form-messages"
      variant="destructive"
      tabIndex={-1}
      className={cn("outline-none", className)}
      {...props}
    >
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {formMessages.length === 1 ? (
          formMessages[0]
        ) : (
          <ul className="list-disc ps-4">
            {formMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}

/** The legend for the required marker: "* = Required Information". */
function RecordFormRequiredLegend({
  className,
  children = "Required Information",
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="record-form-required-legend"
      className={cn(
        "text-end text-(length:--field-description-size) text-(--field-description-foreground)",
        className
      )}
      {...props}
    >
      <abbr title="required" className="me-0.5 text-destructive no-underline">
        *
      </abbr>{" "}
      = {children}
    </p>
  )
}

/** A titled section of fields, in one or two columns. */
function RecordFormSection({
  title,
  columns = 2,
  className,
  children,
  ...props
}: React.ComponentProps<"fieldset"> & {
  /** The section's heading, as the page layout names it. */
  title: string
  /** Two columns, dropping to one in a narrow section. Default 2. */
  columns?: 1 | 2
}) {
  return (
    <FieldSet
      data-slot="record-form-section"
      className={cn("min-w-0 gap-0", className)}
      {...props}
    >
      <FieldLegend className="mb-2 flex h-7.5 w-full items-center rounded-(--radius-2) bg-muted px-3 text-(length:--record-section-title-size) font-(--section-title-weight) text-foreground">
        <span className="truncate">{title}</span>
      </FieldLegend>
      <div className="@container/record-form-section">
        <div
          data-slot="record-form-section-fields"
          className={cn(
            "grid gap-x-6 gap-y-2",
            columns === 2 && "@min-[36.5rem]/record-form-section:grid-cols-2"
          )}
        >
          {children}
        </div>
      </div>
    </FieldSet>
  )
}

/** One field by API name, drawn as its type's control, with its label, help and errors. */
function RecordFormField({
  name,
  undoLabel = "Undo",
  layout = "auto",
  className,
  ref,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Field>, "orientation"> & {
  /** The field's API name, a key of the form's `fields`. */
  name: string
  /** The word before the field's label in the undo button's name. Default "Undo". */
  undoLabel?: string
  /** A custom control that calls useRecordFormControl, never for an address or a name; omit it for the type's own. */
  children?: React.ReactNode
}) {
  const form = useRecordForm("RecordFormField")
  const id = React.useId()
  const { register, unregister } = form
  // A compound field's first part takes the field's focus.
  const parts = form.fields[name] ? partsOf(form.fields[name].type) : null
  const focusId = parts ? `${id}-${parts[0]}` : id
  // Registers the field with the form, beside the page's own ref, so the
  // form can read, check and focus it.
  const setFieldRef = React.useMemo(
    () =>
      composeRef<HTMLDivElement>(ref, (element) => {
        register(name, element, focusId)
        return () => unregister(name, element)
      }),
    [ref, register, unregister, name, focusId]
  )
  const field = form.fields[name]
  if (!field) throw new Error(`"${name}" isn't in the record form's fields.`)

  const errors = form.errorsFor(name)
  const invalid = errors.length > 0
  const errorId = `${id}-error`
  const helpId = `${id}-help`
  const legendId = `${id}-legend`
  const format = { locale: form.locale, timeZone: form.timeZone }
  const draft = form.drafts[name] ?? null
  const setDraft = (next: Draft, problem?: DraftProblem) =>
    form.setDraft(name, next, problem)
  const required = field.type !== "boolean" && field.required === true
  const edited = form.highlightChanges && form.isChanged(name)

  const controlProps = {
    id,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? errorId : undefined,
  }

  const help = field.helpText ? (
    <Tooltip>
      {/* The help is the button's description on both bases: Radix describes the
          trigger by the open tooltip, Base UI doesn't. */}
      <TooltipTrigger
        type="button"
        aria-label={`Help for ${field.label}`}
        aria-describedby={helpId}
        className="mt-1 flex h-[1lh] shrink-0 items-center rounded-full text-(length:--label-font-size) leading-normal outline-hidden focus-visible:shadow-(--shadow-focus)"
      >
        <Icon
          name="utility:info"
          size="xx-small"
          className="flex"
          style={{ color: "var(--button-icon-foreground)" }}
        />
        <span id={helpId} hidden>
          {field.helpText}
        </span>
      </TooltipTrigger>
      <TooltipContent>{field.helpText}</TooltipContent>
    </Tooltip>
  ) : null

  // In layout="horizontal", or "auto" on a compact page, the label takes Field's label column.
  const label = (
    <div className="flex items-start gap-1.5 md:group-data-[layout=horizontal]/field:col-start-1 compact:md:group-data-[layout=auto]/field:col-start-1">
      <FieldLabel htmlFor={id}>
        <span>
          {required ? (
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
          ) : null}
          {field.label}
        </span>
      </FieldLabel>
      {help}
    </div>
  )

  const error = (
    <FieldError id={errorId} errors={errors.map((message) => ({ message }))} />
  )

  // Undo puts the default back, then focuses the remounted control, since the button itself
  // goes away. w-5! beats Field's *:w-full, which a stacked field gives every child.
  const undo = edited ? (
    <Button
      data-slot="record-form-undo"
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={`${undoLabel} ${field.label}`}
      onClick={() => {
        flushSync(() => form.undo(name))
        document.getElementById(focusId)?.focus()
      }}
      className="absolute end-1 top-0 size-5 w-5!"
    >
      <Icon name="utility:undo" size="xx-small" style={{ color: "inherit" }} />
    </Button>
  ) : null

  // The inset is inside the field, so the edited background covers it.
  const fieldProps = {
    layout,
    "data-field": name,
    "data-invalid": invalid || undefined,
    "data-edited": edited || undefined,
    ref: setFieldRef,
    className: cn(
      "relative px-1 data-edited:bg-(--field-edited-background) md:data-edited:data-[layout=horizontal]:pt-5 compact:md:data-edited:data-[layout=auto]:pt-5",
      className
    ),
    ...props,
  }

  if (children !== undefined) {
    if (parts)
      throw new Error(
        `"${name}" draws its own parts, so it takes no custom control.`
      )
    const control: RecordFormControl = {
      value: toValue(field, draft, undefined, format) ?? null,
      onValueChange: (value, details) =>
        setDraft(
          toDraft(field, value, format),
          details?.error ? { error: details.error } : undefined
        ),
      controlProps: { ...controlProps, "aria-required": required || undefined },
    }
    return (
      <Field {...fieldProps}>
        {label}
        <RecordFormControlContext.Provider
          key={form.resets[name] ?? 0}
          value={control}
        >
          {children}
        </RecordFormControlContext.Provider>
        {undo}
        {error}
      </Field>
    )
  }

  // A fieldset, not a Field, for an address, a name or a datetime: the legend
  // names the group of parts. The page's Field props go on it; a layout doesn't apply.
  const fieldset = (content: React.ReactNode, shown: string[]) => {
    const failed = shown.length > 0
    return (
      <FieldSet
        ref={setFieldRef as unknown as React.Ref<HTMLFieldSetElement>}
        data-field={name}
        data-invalid={failed || undefined}
        data-edited={edited || undefined}
        aria-describedby={failed ? errorId : undefined}
        {...(props as React.ComponentProps<"fieldset">)}
        className={cn(
          "relative block min-w-0 px-1 data-edited:bg-(--field-edited-background)",
          className
        )}
      >
        <FieldLegend id={legendId} variant="label" className="float-start pt-1">
          {required ? (
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
          ) : null}
          {field.label}
        </FieldLegend>
        {field.helpText ? (
          <span className="float-start ms-1.5 mt-1 flex">{help}</span>
        ) : null}
        <div
          key={form.resets[name] ?? 0}
          data-slot="record-form-compound"
          className="clear-start"
        >
          {content}
        </div>
        {undo}
        <FieldError
          id={errorId}
          errors={shown.map((message) => ({ message }))}
        />
      </FieldSet>
    )
  }

  if (field.type === "address" || field.type === "name") {
    const draftParts = compoundOf(draft) ?? {}
    const requiredList = requiredParts(field)
    const labels: Partial<Record<string, string>> = field.labels ?? {}
    const setPart = (part: string, text: string) =>
      setDraft({ ...draftParts, [part]: text } as CompoundDraft)

    const partField = (part: string, width: string) => {
      const partId = `${id}-${part}`
      const partError = form.partErrorFor(name, part)
      const partProps = {
        id: partId,
        "aria-invalid": partError ? true : undefined,
        "aria-describedby": partError ? `${partId}-error` : undefined,
      }
      const text = partOf(draft, part)
      let control: React.ReactNode
      if (part === "street") {
        control = (
          <Textarea
            {...partProps}
            value={text}
            onChange={(event) => setPart(part, event.target.value)}
            required={requiredList.includes(part)}
          />
        )
      } else if (part === "salutation" && field.type === "name") {
        const options = field.salutations ?? defaultSalutations
        const all =
          text && !options.some((option) => option.value === text)
            ? [...options, { value: text, label: text }]
            : options
        const selected = all.find((option) => option.value === text)
        control = (
          <Select
            value={selected ? selected.value : noneValue}
            onValueChange={(value: unknown) =>
              setPart(
                part,
                typeof value === "string" && value !== noneValue ? value : ""
              )
            }
          >
            <SelectTrigger {...partProps} className="w-full">
              <SelectValue>{selected ? selected.label : noneLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={noneValue}>{noneLabel}</SelectItem>
              {all.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      } else {
        control = (
          <Input
            {...partProps}
            value={text}
            onChange={(event) => setPart(part, event.target.value)}
            required={requiredList.includes(part)}
          />
        )
      }
      // Only a name's last name is required on its own, so it carries the asterisk; an
      // address's parts all are, so only the legend does.
      const marked = field.type === "name" && requiredList.includes(part)
      return (
        <Field
          key={part}
          data-part={part}
          data-control={partId}
          data-invalid={partError ? true : undefined}
          className={cn("min-w-0 px-1", width)}
        >
          {/* The label is an inline block in a block, so a row's baseline alignment lines
              up the inputs under a label that wraps. */}
          <div>
            <FieldLabel
              htmlFor={partId}
              className="inline-block group-data-[orientation=vertical]/field:pt-0"
            >
              <span>
                {marked ? (
                  <abbr
                    title="required"
                    className="me-0.5 text-destructive no-underline"
                  >
                    *
                  </abbr>
                ) : null}
                {labels[part] ?? partLabels[part]}
              </span>
            </FieldLabel>
          </div>
          {control}
          <FieldError
            id={`${partId}-error`}
            errors={partError ? [{ message: partError }] : undefined}
          />
        </Field>
      )
    }

    const rows: [string, string][][] =
      field.type === "address"
        ? [
            [["street", "w-full"]],
            [
              ["city", "w-4/6"],
              ["state", "w-2/6"],
            ],
            [
              ["postalCode", "w-4/6"],
              ["country", "w-2/6"],
            ],
          ]
        : [
            [
              ["salutation", "w-2/6"],
              ["firstName", "w-4/6"],
            ],
            [["middleName", "w-full"]],
            [
              ["lastName", "w-4/6"],
              ["suffix", "w-2/6"],
            ],
          ]

    return fieldset(
      rows.map((row, index) => (
        <div
          key={index}
          data-slot="record-form-compound-row"
          className={cn(
            "-mx-1 mb-1 flex",
            field.type === "address" && "items-baseline"
          )}
        >
          {row.map(([part, width]) => partField(part, width))}
        </div>
      )),
      errors
    )
  }

  if (field.type === "datetime") {
    // The halves name themselves after the legend ("Start Date"), and a half's
    // error shows under the pair, with the half marked invalid.
    const halfError = (half: DateTimeHalf) => form.partErrorFor(name, half)
    const halfProps = (half: DateTimeHalf) => {
      const failed = invalid || halfError(half) !== undefined
      return {
        id: `${id}-${half}`,
        "data-part": half,
        "data-control": `${id}-${half}`,
        "aria-invalid": failed || undefined,
        "aria-describedby": failed ? errorId : undefined,
      }
    }
    return fieldset(
      <DateTimePicker
        aria-labelledby={legendId}
        value={
          typeof draft === "string"
            ? (instantToDateTime(draft, { timeZone: form.timeZone }) ?? draft)
            : null
        }
        onValueChange={(local, details) =>
          setDraft(
            local === null
              ? null
              : dateTimeToInstant(local, { timeZone: form.timeZone }),
            dateTimeProblem(details)
          )
        }
        locale={form.locale}
        required={required}
      >
        <DateTimePickerDate {...halfProps("date")} />
        <DateTimePickerTime {...halfProps("time")} />
      </DateTimePicker>,
      [...errors, ...dateTimeHalves.flatMap((half) => halfError(half) ?? [])]
    )
  }

  if (field.type === "boolean") {
    return (
      <Field {...fieldProps}>
        {label}
        <div
          key={form.resets[name] ?? 0}
          className="flex h-(--control-height) items-center"
        >
          <Checkbox
            {...controlProps}
            checked={draft === true}
            onCheckedChange={(checked: unknown) => setDraft(checked === true)}
          />
        </div>
        {undo}
        {error}
      </Field>
    )
  }

  let control: React.ReactNode
  switch (field.type) {
    case "textarea":
      control = (
        <Textarea
          {...controlProps}
          value={typeof draft === "string" ? draft : ""}
          onChange={(event) => setDraft(event.target.value)}
          required={required}
          maxLength={field.maxLength}
        />
      )
      break
    case "number":
    case "currency":
    case "percent":
      control = (
        <InputGroup>
          {field.type === "currency" ? (
            <InputGroupAddon>
              <InputGroupText>
                {currencySymbol(form.currency, form.locale)}
              </InputGroupText>
            </InputGroupAddon>
          ) : null}
          <InputGroupInput
            {...controlProps}
            inputMode="decimal"
            value={typeof draft === "string" ? draft : ""}
            onChange={(event) => setDraft(event.target.value)}
            required={required}
          />
          {field.type === "percent" ? (
            <InputGroupAddon align="inline-end">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      )
      break
    case "date":
      control = (
        <DatePicker
          value={typeof draft === "string" ? draft : null}
          onValueChange={(value, details) => setDraft(value, details.error)}
          min={field.min}
          max={field.max}
          locale={form.locale}
          required={required}
        >
          <DatePickerControl>
            <DatePickerInput {...controlProps} />
            <DatePickerTrigger />
          </DatePickerControl>
          <DatePickerContent>
            <DatePickerCalendar />
            <DatePickerToday />
          </DatePickerContent>
        </DatePicker>
      )
      break
    case "time":
      control = (
        <TimePicker
          value={typeof draft === "string" ? draft : null}
          onValueChange={(value, details) => setDraft(value, details.error)}
          locale={form.locale}
          required={required}
        >
          <TimePickerInput {...controlProps} />
          <TimePickerContent>
            <TimePickerList />
          </TimePickerContent>
        </TimePicker>
      )
      break
    case "picklist": {
      // A value that's no longer in the list, like an inactive picklist
      // value, still shows, and stays unless people pick another.
      const options =
        typeof draft === "string" &&
        !field.options.some((option) => option.value === draft)
          ? [...field.options, { value: draft, label: draft }]
          : field.options
      const selected = options.find((option) => option.value === draft)
      control = (
        <Select
          value={selected ? selected.value : noneValue}
          onValueChange={(value: unknown) =>
            setDraft(
              typeof value === "string" && value !== noneValue ? value : null
            )
          }
        >
          <SelectTrigger
            {...controlProps}
            aria-required={required || undefined}
            className="w-full"
          >
            <SelectValue>{selected ? selected.label : noneLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={noneValue}>{noneLabel}</SelectItem>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
      break
    }
    case "lookup":
      control = (
        <Lookup
          {...controlProps}
          value={isLookupRecord(draft) ? draft : null}
          onValueChange={(record) => setDraft(record)}
          records={field.records}
          onSearch={field.onSearch}
          icon={field.icon}
          placeholder={field.placeholder}
          required={required}
        />
      )
      break
    default:
      control = (
        <Input
          {...controlProps}
          type={inputTypes[field.type]}
          value={typeof draft === "string" ? draft : ""}
          onChange={(event) => setDraft(event.target.value)}
          required={required}
          maxLength={field.maxLength}
        />
      )
  }

  return (
    <Field {...fieldProps}>
      {label}
      <React.Fragment key={form.resets[name] ?? 0}>{control}</React.Fragment>
      {undo}
      {error}
    </Field>
  )
}

// Radix can't select an empty string, so the empty option has a value of its own, read back as null.
const noneValue = "__none__"
const noneLabel = "--None--"

/** The row of buttons under the sections on a page. In a dialog, use DialogFooter. */
function RecordFormFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="record-form-footer"
      className={cn(
        "flex flex-wrap items-center justify-end gap-2 pt-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * Save, or Save & New with `intent="save-and-new"`. Shows a spinner while
 * the save it started is pending. Enter in a field always saves.
 */
function RecordFormSubmit({
  intent = "save",
  variant,
  disabled,
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  /** Which save the button starts. Default "save". */
  intent?: RecordFormIntent
}) {
  const form = useRecordForm("RecordFormSubmit")
  const busy = form.pending && form.submittedIntent === intent
  // Only Save is a submit button, so Enter, which presses the form's first submit
  // button, saves even though Save & New comes before it.
  return (
    <Button
      data-slot="record-form-submit"
      type={intent === "save" ? "submit" : "button"}
      variant={variant ?? (intent === "save" ? "default" : "outline")}
      disabled={form.pending || disabled}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || intent === "save") return
        form.requestSubmit(intent)
      }}
      {...props}
    >
      {busy ? <Spinner /> : null}
      {children ?? (intent === "save" ? "Save" : "Save & New")}
    </Button>
  )
}

export {
  RecordForm,
  RecordFormField,
  RecordFormFooter,
  RecordFormMessages,
  RecordFormRequiredLegend,
  RecordFormSection,
  RecordFormSubmit,
  useRecordFormControl,
}
export type {
  RecordFormControl,
  RecordFormDefaultValues,
  RecordFormErrors,
  RecordFormFieldDescription,
  RecordFormFieldType,
  RecordFormFields,
  RecordFormIntent,
  RecordFormOption,
  RecordFormProps,
  RecordFormSubmitDetails,
  RecordFormValue,
  RecordFormValues,
}
