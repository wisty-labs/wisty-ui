"use client"

import * as React from "react"
import { CircleMinusIcon, CirclePlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type NumberInputError = "format" | "min" | "max"

type NumberInputChangeDetails = {
  /** Typed and committed (blur or Enter), or stepped (buttons and keys). */
  source: "type" | "step"
  /** The field's text when the value changed. */
  text: string
  /** Why the text isn't a number the field accepts. Unset when it is. */
  error?: NumberInputError
}

type NumberInputContextValue = {
  value: number | null
  /** The value in the locale's format, whatever the field shows. */
  valueText: string
  text: string
  setText: (text: string) => void
  commitText: () => void
  showRaw: () => void
  stepBy: (direction: 1 | -1, multiplier: number) => void
  setTo: (bound: number) => void
  canStep: (direction: 1 | -1) => boolean
  error: NumberInputError | undefined
  /** What the input's validity says, or "" when it's valid. */
  validityMessage: string
  min?: number
  max?: number
  disabled: boolean
  readOnly: boolean
  required: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
}

const NumberInputContext = React.createContext<NumberInputContextValue | null>(
  null
)

function useNumberInputContext(part: string) {
  const context = React.useContext(NumberInputContext)
  if (!context) throw new Error(`${part} must be used inside <NumberInput>.`)
  return context
}

// Marks a locale's formatter adds that carry no value: directional marks
// (U+061C before ar-EG's minus, U+200E in fa-IR) and every kind of space,
// including the no-break spaces sv-SE and fr-FR group with.
const silentPattern = /[‎‏؜\s]/gu

const numberSymbols = new Map<
  string,
  {
    ascii: Map<string, string>
    minus: string
    group: string | undefined
    decimal: string
  }
>()

// The locale's digits, minus sign and separators, read once per locale from
// its own formatter, since a form may parse every field on each render.
function symbolsOf(locale: string) {
  const known = numberSymbols.get(locale)
  if (known) return known
  const parts = new Intl.NumberFormat(locale, {
    signDisplay: "always",
    useGrouping: true,
  }).formatToParts(-1234567890.5)
  const digits = [
    ...parts
      .filter((part) => part.type === "integer")
      .map((part) => part.value)
      .join(""),
  ]
  const symbols = {
    ascii: new Map(digits.map((digit, index) => [digit, "1234567890"[index]!])),
    minus:
      parts
        .find((part) => part.type === "minusSign")
        ?.value.replace(silentPattern, "") || "-",
    group: parts
      .find((part) => part.type === "group")
      ?.value.replace(silentPattern, ""),
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
  }
  numberSymbols.set(locale, symbols)
  return symbols
}

const shortcutExponents: Record<string, number> = { k: 3, m: 6, b: 9, t: 12 }

/**
 * Reads a typed number in the locale's separators and digits: "1.234,5" in
 * de-DE is 1234.5. Null for empty text, undefined for text that isn't a
 * number, like "1.5" in de-DE, where a group of one digit is a typo.
 */
function parseNumber(
  text: string,
  locale = "en-US",
  {
    shortcuts = false,
  }: {
    /** When true, also reads the shortcuts 1.5k, 2m, 3b and 4t, and exponents like 2e2. */
    shortcuts?: boolean
  } = {}
): number | null | undefined {
  const squashed = text.replace(silentPattern, "")
  if (squashed === "") return null
  const { ascii, minus, group, decimal } = symbolsOf(locale)
  let plain = [...squashed]
    .map((char) => ascii.get(char) ?? char)
    .join("")
    .split(minus)
    .join("-")
    .replace(/−/g, "-") // U+2212 MINUS SIGN, typed or pasted
  let exponent = 0
  const suffix = shortcuts
    ? /^(.+?)(?:e([-+]?\d+)|([kmbt]))$/i.exec(plain)
    : null
  if (suffix) {
    plain = suffix[1]!
    exponent =
      suffix[2] === undefined
        ? shortcutExponents[suffix[3]!.toLowerCase()]!
        : Number(suffix[2])
  }
  const [whole = "", fraction, ...rest] = plain.split(decimal)
  if (rest.length > 0) return undefined
  // A group separator needs a full group after it: three digits in the last,
  // two or three between (en-IN groups 12,34,567). The first group isn't checked.
  const groups = group ? whole.split(group) : [whole]
  if (
    groups.length > 1 &&
    !groups
      .slice(1)
      .every((run, index, all) =>
        index === all.length - 1 ? /^\d{3}$/.test(run) : /^\d{2,3}$/.test(run)
      )
  )
    return undefined
  const number = `${groups.join("")}${fraction === undefined ? "" : `.${fraction}`}`
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(number)) return undefined
  // The exponent moves the decimal point in the string: 1.1k is 1100, not
  // the 1100.0000000000002 that multiplying gives.
  const value = Number(`${number}e${exponent}`)
  return Number.isFinite(value) ? value : undefined
}

function formatNumber(
  value: number | null,
  locale: string,
  fractionDigits: number | undefined,
  useGrouping = true
) {
  if (value === null) return ""
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits ?? 0,
    maximumFractionDigits: fractionDigits ?? 20,
    useGrouping,
  }).format(value)
}

function decimalsOf(value: number) {
  const [, fraction = "", exponent] =
    /^-?\d*\.?(\d*)(?:e([-+]\d+))?$/.exec(String(value)) ?? []
  return Math.max(0, fraction.length - Number(exponent ?? 0))
}

// Moves the decimal point through the number's string, so no binary
// fraction creeps in: 1.005 shifted by 2 is 100.5, not 100.49999999999999.
function shift(value: number, by: number) {
  const [mantissa, exponent = "0"] = String(value).split("e")
  return Number(`${mantissa}e${Number(exponent) + by}`)
}

// Rounds half away from zero in decimal: 1.005 to two digits is 1.01, not
// the 1.00 that toFixed gives.
function roundTo(value: number, digits: number) {
  return (
    Math.sign(value) *
    shift(Math.round(shift(Math.abs(value), digits)), -digits)
  )
}

/**
 * A percent as the field shows it, from the fraction a record holds:
 * 0.07 is 7, not the 7.000000000000001 that multiplying gives.
 */
function toPercentage(fraction: number) {
  return shift(fraction, 2)
}

/** A typed percentage as the fraction a record holds: 7 is 0.07. */
function toFraction(percentage: number) {
  return shift(percentage, -2)
}

function clamp(value: number, min?: number, max?: number) {
  if (min !== undefined && value < min) return min
  if (max !== undefined && value > max) return max
  return value
}

const errorMessages: Record<NumberInputError, (bound?: number) => string> = {
  format: () => "Enter a valid value.",
  min: (min) => `Value must be greater than or equal to ${min}.`,
  max: (max) => `Value must be less than or equal to ${max}.`,
}

// A value from outside as the field holds it: a finite number or null.
function finite(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function NumberInput({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  locale = "en-US",
  fractionDigits,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof InputGroup>, "defaultValue"> & {
  /** The number, or null when the field is empty or its text isn't one it accepts. */
  value?: number | null
  /** The number at first, when uncontrolled. */
  defaultValue?: number | null
  /** Called with the new number, or null and the reason the text isn't one. */
  onValueChange?: (
    value: number | null,
    details: NumberInputChangeDetails
  ) => void
  /** The smallest number people can step to or type. */
  min?: number
  /** The largest number people can step to or type. */
  max?: number
  /** A step's size. Steps land on multiples of it, counted from `min` or 0. */
  step?: number
  /** Formats and reads numbers. */
  locale?: string
  /** Digits after the decimal point: typed numbers round to them, and the field shows them. */
  fractionDigits?: number
  /** Submits the value as a plain number ("1234.5") with a form, from a hidden input. */
  name?: string
  /** Required with a form. */
  required?: boolean
  /** Disables the field and its buttons. */
  disabled?: boolean
  /** Shows the number without the buttons; it can't be changed. */
  readOnly?: boolean
}) {
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    finite(defaultValue)
  )
  const value = valueProp === undefined ? uncontrolled : finite(valueProp)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Typed text is kept with the value it was typed for, so a value set from
  // outside replaces it and a parent echoing null doesn't.
  const [edited, setEdited] = React.useState<{
    text: string
    error?: NumberInputError
    for: {
      value: number | null
      locale: string
      fractionDigits: number | undefined
    }
  } | null>(null)
  const { text, error } =
    edited &&
    edited.for.value === value &&
    edited.for.locale === locale &&
    edited.for.fractionDigits === fractionDigits
      ? edited
      : { text: formatNumber(value, locale, fractionDigits), error: undefined }

  const round = (number: number) =>
    fractionDigits === undefined ? number : roundTo(number, fractionDigits)

  const change = (
    next: number | null,
    nextText: string,
    source: NumberInputChangeDetails["source"],
    nextError?: NumberInputError
  ) => {
    const same = next === value && nextError === error
    setEdited({
      text: nextText,
      error: nextError,
      for: { value: same ? value : next, locale, fractionDigits },
    })
    if (same) return
    setUncontrolled(next)
    onValueChange?.(next, { source, text: nextText, error: nextError })
  }

  const parse = (from: string) => parseNumber(from, locale, { shortcuts: true })

  const commitText = () => {
    const parsed = parse(text)
    if (parsed === null) return change(null, "", "type")
    if (parsed === undefined) return change(null, text, "type", "format")
    const number = round(parsed)
    const formatted = formatNumber(number, locale, fractionDigits)
    if (min !== undefined && number < min)
      return change(null, formatted, "type", "min")
    if (max !== undefined && number > max)
      return change(null, formatted, "type", "max")
    change(number, formatted, "type")
  }

  // Steps start from the typed text, not the last committed value.
  const current = () => {
    const parsed = parse(text)
    return parsed === undefined || parsed === null ? null : round(parsed)
  }

  const setTo = (number: number) => {
    if (disabled || readOnly) return
    change(number, formatNumber(number, locale, fractionDigits), "step")
  }

  // Steps land on the grid from min (or 0): 7 by 5 goes to 10, not 12. An
  // empty field starts at 0, or the nearest bound when 0 is outside them.
  const stepBy = (direction: 1 | -1, multiplier: number) => {
    if (disabled || readOnly) return
    const from = current()
    let next: number
    if (from === null) {
      next = clamp(0, min, max)
    } else {
      const anchor = min ?? 0
      const size = Math.abs(step) || 1
      const index = (from - anchor) / size
      // Within a millionth of a step counts as on it: 0.1 + 0.2 is on a grid of 0.1.
      const onGrid = Math.abs(index - Math.round(index)) < 1e-6
      const base = onGrid
        ? Math.round(index)
        : direction === 1
          ? Math.floor(index)
          : Math.ceil(index)
      const digits = Math.max(decimalsOf(size), decimalsOf(anchor))
      next = roundTo(anchor + (base + direction * multiplier) * size, digits)
      next = clamp(round(next), min, max)
    }
    setTo(next)
  }

  const canStep = (direction: 1 | -1) => {
    if (disabled || readOnly) return false
    const from = value
    if (from === null) return true
    if (direction === 1) return max === undefined || from < max
    return min === undefined || from > min
  }

  const context: NumberInputContextValue = {
    value,
    valueText: formatNumber(value, locale, fractionDigits),
    text,
    setText: (nextText) =>
      setEdited({
        text: nextText,
        error,
        for: { value, locale, fractionDigits },
      }),
    commitText,
    // Focus shows the number ungrouped, "1250000" for 1,250,000.00, and keeps
    // text with an error so it can be fixed.
    showRaw: () => {
      if (readOnly || error || value === null) return
      setEdited({
        text: formatNumber(value, locale, undefined, false),
        for: { value, locale, fractionDigits },
      })
    },
    stepBy,
    setTo,
    canStep,
    error,
    validityMessage: error
      ? errorMessages[error](error === "min" ? min : max)
      : "",
    min,
    max,
    disabled,
    readOnly,
    required,
    inputRef,
  }

  return (
    <NumberInputContext.Provider value={context}>
      <InputGroup
        data-slot="number-input"
        className={cn(
          "has-[>[data-align]>[data-slot=number-input-decrement]]:[&>input]:ps-3.25 has-[>[data-align]>[data-slot=number-input-increment]]:[&>input]:pe-3.25 has-[>[data-align]>[data-slot=number-input-decrement]]:[&>input]:text-center has-[>[data-align]>[data-slot=number-input-increment]]:[&>input]:text-center",
          className
        )}
        {...props}
      >
        {children}
      </InputGroup>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={value === null ? "" : String(value)}
          disabled={disabled}
        />
      ) : null}
    </NumberInputContext.Provider>
  )
}

function NumberInputField({
  ref,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  "aria-invalid": ariaInvalid,
  ...props
}: Omit<
  React.ComponentProps<"input">,
  | "value"
  | "defaultValue"
  | "type"
  | "name"
  | "required"
  | "disabled"
  | "readOnly"
  | "min"
  | "max"
  | "step"
>) {
  const context = useNumberInputContext("NumberInputField")
  const { inputRef, validityMessage } = context
  // The ref callback runs again when the message changes, so the input's
  // validity follows the error.
  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      node?.setCustomValidity(validityMessage)
      if (typeof ref === "function") {
        // A ref callback may return a cleanup (React 19): run it, and clear
        // the field's own ref with it.
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
    <InputGroupInput
      ref={setInputRef}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      role="spinbutton"
      aria-valuenow={context.value ?? undefined}
      aria-valuetext={context.value === null ? undefined : context.valueText}
      aria-valuemin={context.min}
      aria-valuemax={context.max}
      aria-invalid={context.error ? true : ariaInvalid}
      value={context.text}
      required={context.required}
      disabled={context.disabled}
      readOnly={context.readOnly}
      onChange={(event) => {
        onChange?.(event)
        if (event.defaultPrevented) return
        context.setText(event.target.value)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        context.showRaw()
      }}
      onBlur={(event) => {
        onBlur?.(event)
        context.commitText()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const large = event.shiftKey ? 10 : 1
        switch (event.key) {
          case "Enter":
            context.commitText()
            return
          case "ArrowUp":
            event.preventDefault()
            context.stepBy(1, large)
            return
          case "ArrowDown":
            event.preventDefault()
            context.stepBy(-1, large)
            return
          case "PageUp":
            event.preventDefault()
            context.stepBy(1, 10)
            return
          case "PageDown":
            event.preventDefault()
            context.stepBy(-1, 10)
            return
          case "Home":
            if (context.min === undefined) return
            event.preventDefault()
            context.setTo(context.min)
            return
          case "End":
            if (context.max === undefined) return
            event.preventDefault()
            context.setTo(context.max)
            return
        }
      }}
      {...props}
    />
  )
}

function NumberInputStepper({
  direction,
  className,
  children,
  onClick,
  onMouseDown,
  ...props
}: React.ComponentProps<typeof InputGroupButton> & {
  direction: 1 | -1
}) {
  const context = useNumberInputContext(
    direction === 1 ? "NumberInputIncrement" : "NumberInputDecrement"
  )
  if (context.readOnly) return null
  return (
    // Out of the tab order, since the field's arrow keys step too. The glyph
    // itself turns red on error, so it stays red on hover.
    <InputGroupAddon
      align={direction === 1 ? "inline-end" : "inline-start"}
      className={direction === 1 ? "pe-2.75" : "ps-2.75"}
    >
      <InputGroupButton
        size="icon-xs"
        tabIndex={-1}
        disabled={!context.canStep(direction)}
        className={cn(
          "focus-visible:shadow-(--shadow-focus) group-has-[[data-slot][aria-invalid=true]]/input-group:[&_svg]:text-destructive",
          className
        )}
        onMouseDown={(event) => {
          onMouseDown?.(event)
          // Keeps focus where it is, in the field when it was there.
          event.preventDefault()
        }}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          context.stepBy(direction, 1)
        }}
        {...props}
      >
        {children}
      </InputGroupButton>
    </InputGroupAddon>
  )
}

function NumberInputDecrement({
  children,
  "aria-label": ariaLabel = "Decrement counter",
  ...props
}: Omit<React.ComponentProps<typeof InputGroupButton>, "size">) {
  return (
    <NumberInputStepper
      data-slot="number-input-decrement"
      direction={-1}
      aria-label={ariaLabel}
      {...props}
    >
      {children ?? <CircleMinusIcon />}
    </NumberInputStepper>
  )
}

function NumberInputIncrement({
  children,
  "aria-label": ariaLabel = "Increment counter",
  ...props
}: Omit<React.ComponentProps<typeof InputGroupButton>, "size">) {
  return (
    <NumberInputStepper
      data-slot="number-input-increment"
      direction={1}
      aria-label={ariaLabel}
      {...props}
    >
      {children ?? <CirclePlusIcon />}
    </NumberInputStepper>
  )
}

export {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputIncrement,
  parseNumber,
  toFraction,
  toPercentage,
  type NumberInputChangeDetails,
  type NumberInputError,
}
