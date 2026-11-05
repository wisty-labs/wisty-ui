"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroupAddon } from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  parseDate,
} from "@/components/wisty/date-picker"
import {
  allowedFilterOperators,
  checkFilterCondition,
  filterOperatorLabels,
  type ListViewFilterCondition,
  type ListViewFilterField,
  type ListViewFilterOperator,
  type ListViewFilterOwner,
} from "@/components/wisty/list-view-filtering"
import {
  NumberInput,
  NumberInputField,
  parseNumber,
  toFraction,
  toPercentage,
} from "@/components/wisty/number-input"

type AnyField = ListViewFilterField<never>

type PickerOption = { token: string; label: string }

function Picker({
  id,
  options,
  value,
  placeholder,
  invalid,
  onValueChange,
}: {
  id: string
  options: readonly PickerOption[]
  value: string
  placeholder?: string
  invalid?: boolean
  onValueChange: (token: string) => void
}) {
  const selected = options.find((option) => option.token === value)
  return (
    <Select
      value={selected ? selected.token : ""}
      onValueChange={(next: unknown) => {
        if (typeof next === "string") onValueChange(next)
      }}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid || undefined}
        className="w-full"
      >
        <SelectValue placeholder={placeholder}>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.token} value={option.token}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Filter by Owner's editor: the two owner choices as radios, applied on Done. */
function ListViewOwnerEditor({
  owner,
  value,
  onDone,
}: {
  owner: ListViewFilterOwner<never>
  value: "all" | "mine"
  onDone: (value: "all" | "mine") => void
}) {
  const [choice, setChoice] = React.useState(value)
  const id = React.useId()
  return (
    <>
      <RadioGroup
        value={choice}
        aria-label="Filter by Owner"
        onValueChange={(next: unknown) =>
          setChoice(next === "mine" ? "mine" : "all")
        }
      >
        {(["all", "mine"] as const).map((token) => (
          <Field key={token} orientation="horizontal">
            <RadioGroupItem value={token} id={`${id}-${token}`} />
            <FieldLabel htmlFor={`${id}-${token}`}>
              {token === "mine" ? owner.mineLabel : owner.allLabel}
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
      <div className="flex justify-end">
        <Button type="button" onClick={() => onDone(choice)}>
          Done
        </Button>
      </div>
    </>
  )
}

function initialText(
  condition: ListViewFilterCondition | null,
  field: AnyField | undefined
) {
  if (!condition || !field || condition.value === null) return ""
  if (field.type === "picklist") {
    const index = field.options.findIndex(
      (option) => option.value === condition.value
    )
    return index < 0 ? "" : String(index)
  }
  if (field.type === "text") return String(condition.value)
  if (field.type === "boolean") return condition.value ? "true" : "false"
  return ""
}

const booleanOptions: readonly PickerOption[] = [
  { token: "true", label: "True" },
  { token: "false", label: "False" },
]

/** A filter's editor: Field, Operator and a typed Value, with Cancel and Save. */
function ListViewFilterEditor({
  fields,
  condition,
  locale,
  onCancel,
  onSave,
}: {
  fields: readonly AnyField[]
  condition: ListViewFilterCondition | null
  locale: string
  onCancel: () => void
  onSave: (condition: ListViewFilterCondition) => void
}) {
  const startField = condition
    ? fields.findIndex((field) => field.id === condition.field)
    : fields.length > 0
      ? 0
      : -1
  const [fieldIndex, setFieldIndex] = React.useState(startField)
  const field = fields[fieldIndex]
  const operators = field ? allowedFilterOperators(field) : []
  const [operatorChoice, setOperator] = React.useState<
    ListViewFilterOperator | undefined
  >(condition && startField >= 0 ? condition.operator : undefined)
  const operator =
    operatorChoice && operators.includes(operatorChoice)
      ? operatorChoice
      : operators[0]
  const [blank, setBlank] = React.useState(
    startField >= 0 && condition?.value === null
  )
  const [text, setText] = React.useState(() =>
    initialText(condition, fields[startField])
  )
  const [error, setError] = React.useState<{
    at: "field" | "value"
    message: string
  }>()
  const valueRef = React.useRef<HTMLInputElement>(null)
  const fieldId = React.useId()
  const operatorId = React.useId()
  const valueId = React.useId()
  const blankId = React.useId()
  const canBeBlank =
    !!field?.nullable && (operator === "equals" || operator === "not-equal")
  const isBlank = canBeBlank && blank
  const initialNumber =
    condition &&
    field &&
    condition.field === field.id &&
    typeof condition.value === "number"
      ? field.type === "percent"
        ? toPercentage(condition.value)
        : condition.value
      : null
  const initialDay =
    condition &&
    field?.type === "date" &&
    condition.field === field.id &&
    typeof condition.value === "string"
      ? condition.value
      : null

  const read = ():
    | { condition: ListViewFilterCondition }
    | { at: "field" | "value"; message: string } => {
    if (!field || !operator) return { at: "field", message: "Choose a field." }
    let value: string | number | boolean | null = null
    if (!isBlank) {
      if (field.type === "text") {
        if (text === "") return { at: "value", message: "Enter a value." }
        value = text
      } else if (field.type === "picklist" || field.type === "boolean") {
        if (text === "") return { at: "value", message: "Choose a value." }
        value =
          field.type === "boolean"
            ? text === "true"
            : field.options[Number(text)]!.value
      } else if (field.type === "date") {
        const typed = valueRef.current?.value.trim() ?? ""
        if (typed === "") return { at: "value", message: "Enter a date." }
        const day = parseDate(typed, { locale })
        if (day === null) {
          return { at: "value", message: "Enter a date like Sep 30, 2026." }
        }
        value = day
      } else {
        const number = parseNumber(valueRef.current?.value ?? "", locale, {
          shortcuts: true,
        })
        if (number === null) return { at: "value", message: "Enter a value." }
        if (number === undefined) {
          return { at: "value", message: "Enter a number." }
        }
        value = field.type === "percent" ? toFraction(number) : number
      }
    }
    const next = {
      field: field.id,
      type: field.type,
      operator,
      value,
    } as ListViewFilterCondition
    const message = checkFilterCondition(next, field)
    return message ? { at: "value", message } : { condition: next }
  }

  const save = () => {
    const result = read()
    if ("condition" in result) onSave(result.condition)
    else setError(result)
  }

  const valueInvalid = error?.at === "value"
  const valueControl = !field ? null : field.type === "text" ? (
    <Input
      id={valueId}
      value={text}
      aria-invalid={valueInvalid}
      onChange={(event) => setText(event.target.value)}
    />
  ) : field.type === "picklist" || field.type === "boolean" ? (
    <Picker
      id={valueId}
      options={
        field.type === "boolean"
          ? booleanOptions
          : field.options.map((option, index) => ({
              token: String(index),
              label: option.label,
            }))
      }
      value={text}
      placeholder="Select a value"
      invalid={valueInvalid}
      onValueChange={(token) => {
        setText(token)
        setError(undefined)
      }}
    />
  ) : field.type === "date" ? (
    <DatePicker
      key={field.id}
      defaultValue={initialDay}
      locale={locale}
      today={field.today}
    >
      <DatePickerControl>
        <DatePickerInput
          ref={valueRef}
          id={valueId}
          aria-invalid={valueInvalid || undefined}
        />
        <DatePickerTrigger />
      </DatePickerControl>
      <DatePickerContent>
        <DatePickerCalendar />
      </DatePickerContent>
    </DatePicker>
  ) : (
    <NumberInput key={field.id} defaultValue={initialNumber} locale={locale}>
      <NumberInputField
        ref={valueRef}
        id={valueId}
        aria-invalid={valueInvalid || undefined}
      />
      {field.type === "percent" ? (
        <InputGroupAddon align="inline-end">%</InputGroupAddon>
      ) : null}
    </NumberInput>
  )

  return (
    <>
      <Field data-invalid={error?.at === "field" || undefined}>
        <FieldLabel htmlFor={fieldId}>Field</FieldLabel>
        <Picker
          id={fieldId}
          options={fields.map((option, index) => ({
            token: String(index),
            label: option.label,
          }))}
          value={fieldIndex < 0 ? "" : String(fieldIndex)}
          placeholder="Select a field"
          invalid={error?.at === "field"}
          onValueChange={(token) => {
            setFieldIndex(Number(token))
            setOperator(undefined)
            setBlank(false)
            setText("")
            setError(undefined)
          }}
        />
        {error?.at === "field" ? (
          <FieldError>{error.message}</FieldError>
        ) : null}
      </Field>
      {field ? (
        <>
          <Field>
            <FieldLabel htmlFor={operatorId}>Operator</FieldLabel>
            <Picker
              id={operatorId}
              options={operators.map((option) => ({
                token: option,
                label: filterOperatorLabels[option],
              }))}
              value={operator ?? ""}
              placeholder="Select an operator"
              onValueChange={(token) => {
                setOperator(operators.find((option) => option === token))
                setError(undefined)
              }}
            />
          </Field>
          {canBeBlank ? (
            <Field orientation="horizontal">
              <Checkbox
                id={blankId}
                checked={blank}
                onCheckedChange={(checked) => {
                  setBlank(checked === true)
                  setError(undefined)
                }}
              />
              <FieldLabel htmlFor={blankId}>Blank value</FieldLabel>
            </Field>
          ) : null}
          {isBlank ? null : (
            <Field data-invalid={valueInvalid || undefined}>
              <FieldLabel htmlFor={valueId}>Value</FieldLabel>
              {valueControl}
              {valueInvalid ? <FieldError>{error!.message}</FieldError> : null}
            </Field>
          )}
        </>
      ) : null}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={save}>
          Save
        </Button>
      </div>
    </>
  )
}

export { ListViewFilterEditor, ListViewOwnerEditor }
