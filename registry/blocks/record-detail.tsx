"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  ExpandableSection,
  ExpandableSectionContent,
  ExpandableSectionTrigger,
} from "@/components/wisty/expandable-section"
import type { LookupRecord } from "@/components/wisty/lookup"
import {
  OutputField,
  OutputFieldEdit,
  OutputFieldLabel,
  OutputFieldValue,
  type OutputFieldAddress,
  type OutputFieldLinkOptions,
  type OutputFieldName,
  type OutputFieldPlainValue,
  type OutputFieldStyleOptions,
  type OutputFieldType,
} from "@/components/wisty/output-field"

/** A picklist value and its label. */
interface RecordDetailOption {
  /** What's stored. */
  value: string
  /** What's shown. */
  label: string
}

interface RecordDetailFieldBase {
  /** The field's label, as the org names it: "Last Name". */
  label: string
  /** Inline help, in a tooltip after the label. */
  helpText?: string
  /** Whether people can edit the field. Default true. */
  editable?: boolean
}

type RecordDetailDigits = Pick<
  OutputFieldStyleOptions,
  "minimumFractionDigits" | "maximumFractionDigits"
> & {
  /** Decimal places the field shows. A percent's are the percentage's: 0.6 reads "60" at scale 0. */
  scale?: number
}

/** What a field is and how it reads; Record form's description extends it for editing. */
type RecordDetailFieldDescription = RecordDetailFieldBase &
  (
    | { type: "text" | "textarea" }
    | ({ type: "email" | "phone" | "url" } & OutputFieldLinkOptions)
    | ({ type: "number" | "percent" } & RecordDetailDigits)
    | ({ type: "currency" } & RecordDetailDigits &
        Pick<OutputFieldStyleOptions, "currencyDisplay">)
    | ({
        /** A day, as "YYYY-MM-DD". */
        type: "date"
      } & Pick<OutputFieldStyleOptions, "dateStyle">)
    | {
        type: "picklist"
        /** The picklist's values, in order. */
        options: readonly RecordDetailOption[]
      }
    | { type: "boolean" }
    | {
        /** A compound address, like Billing Address: street, city, state or province, postal code and country. */
        type: "address"
      }
    | {
        /** A compound name, like a contact's Name: salutation, first, middle and last name, and suffix. */
        type: "name"
      }
    | {
        type: "lookup"
        /** Records to read an id's name from, and to pick from when editing. */
        records?: readonly LookupRecord[]
        /** The related record's page, linking its name. */
        href?: (record: LookupRecord) => string | undefined
      }
    | ({
        /** An instant, as ISO 8601, shown as its date and time in `timeZone`. */
        type: "datetime"
      } & Pick<
        OutputFieldStyleOptions,
        "dateStyle" | "timeStyle" | "hour12" | "timeZoneName"
      >)
    | ({
        /** A time of day, as "HH:mm:ss.SSSZ", never moved by `timeZone`. */
        type: "time"
      } & Pick<OutputFieldStyleOptions, "timeStyle" | "hour12">)
    | ({
        /** An instant, counted from `now`, like "3 hours ago". */
        type: "relative"
        /** Never editable: a relative time is only shown. */
        editable: false
      } & Pick<OutputFieldStyleOptions, "dateStyle" | "timeStyle" | "hour12">)
  )

/** The record's values, keyed by API name: a lookup's is its record, a compound field's its parts, an instant ISO 8601. */
type RecordDetailValues = Record<
  string,
  | string
  | number
  | boolean
  | LookupRecord
  | OutputFieldAddress
  | OutputFieldName
  | null
  | undefined
>

/** The record's fields, keyed by API name. */
type RecordDetailFields = Record<string, RecordDetailFieldDescription>

const outputTypes: Record<
  RecordDetailFieldDescription["type"],
  OutputFieldType
> = {
  text: "text",
  textarea: "text",
  email: "email",
  phone: "phone",
  url: "url",
  number: "number",
  currency: "currency",
  percent: "percent",
  date: "date",
  datetime: "datetime",
  time: "time",
  relative: "relative",
  boolean: "boolean",
  picklist: "text",
  lookup: "text",
  address: "address",
  name: "name",
}

function isLookupRecord(value: unknown): value is LookupRecord {
  return typeof value === "object" && value !== null && "id" in value
}

// A value as it reads: a lookup's record name, a picklist value's label.
function toOutput(
  field: RecordDetailFieldDescription,
  value: RecordDetailValues[string]
): { value: OutputFieldPlainValue; href?: string } {
  if (field.type === "lookup") {
    const record = isLookupRecord(value)
      ? value
      : typeof value === "string"
        ? (field.records?.find((item) => item.id === value) ?? {
            id: value,
            name: value,
          })
        : null
    return record
      ? { value: record.name, href: field.href?.(record) }
      : { value: null }
  }
  if (isLookupRecord(value) || value === undefined) return { value: null }
  if (field.type === "picklist" && typeof value === "string")
    return {
      value:
        field.options.find((option) => option.value === value)?.label ?? value,
    }
  return { value }
}

// The keys a field's type reads, named one by one: a description also carries
// keys for editing, like a lookup's records, that mustn't reach the value.
function formatOf(
  field: RecordDetailFieldDescription
): OutputFieldStyleOptions & OutputFieldLinkOptions {
  switch (field.type) {
    case "number":
    case "percent":
    case "currency":
      return {
        fractionDigits: field.scale,
        minimumFractionDigits: field.minimumFractionDigits,
        maximumFractionDigits: field.maximumFractionDigits,
        currencyDisplay:
          field.type === "currency" ? field.currencyDisplay : undefined,
      }
    case "date":
      return { dateStyle: field.dateStyle }
    case "datetime":
      return {
        dateStyle: field.dateStyle,
        timeStyle: field.timeStyle,
        hour12: field.hour12,
        timeZoneName: field.timeZoneName,
      }
    case "relative":
      return {
        dateStyle: field.dateStyle,
        timeStyle: field.timeStyle,
        hour12: field.hour12,
      }
    case "time":
      return { timeStyle: field.timeStyle, hour12: field.hour12 }
    case "email":
    case "phone":
    case "url":
      return {
        linkLabel: field.linkLabel,
        linkTarget: field.linkTarget,
        linkTitle: field.linkTitle,
      }
    default:
      return {}
  }
}

type RecordDetailContextValue = {
  fields: RecordDetailFields
  values: RecordDetailValues
  columns: 1 | 2
  layout: "auto" | "stacked" | "horizontal"
  loading: boolean
  headingLevel: 2 | 3 | 4
  onEdit?: (name: string) => void
  locale: string
  currency: string
  timeZone: string
  now?: string | number | Date
}

const RecordDetailContext =
  React.createContext<RecordDetailContextValue | null>(null)

function useRecordDetail(part: string) {
  const context = React.useContext(RecordDetailContext)
  if (!context) throw new Error(`${part} must be used inside <RecordDetail>.`)
  return context
}

function FieldList({
  columns,
  children,
}: {
  columns: 1 | 2
  children: React.ReactNode
}) {
  return (
    <div className="@container/record-detail-section">
      <div
        data-slot="record-detail-fields"
        role="list"
        className={cn(
          "grid gap-x-6",
          columns === 2 && "@min-[36.5rem]/record-detail-section:grid-cols-2"
        )}
      >
        {children}
      </div>
    </div>
  )
}

function FieldItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="listitem"
      data-slot="record-detail-item"
      className="flex min-w-0"
    >
      {children}
    </div>
  )
}

interface RecordDetailProps extends React.ComponentProps<"div"> {
  /** Every field the layout can show, keyed by API name. */
  fields: RecordDetailFields
  /** The record's values, keyed by API name. A missing or null value shows blank. */
  values?: RecordDetailValues
  /** Fields per row. Default 2. Two columns fall to one in a narrow container. */
  columns?: 1 | 2
  /** Label above the value, or beside it from a 48rem screen. Default "auto": beside it when the page is compact (`data-density="compact"`), above it otherwise. */
  layout?: "auto" | "stacked" | "horizontal"
  /** Holds every value's place while the record loads. Without children, draws placeholder fields. */
  loading?: boolean
  /** The level of each section's heading. Default 2, under a record page's h1. */
  headingLevel?: 2 | 3 | 4
  /** Called with the field's API name when its pencil is pressed. Without it, no pencils show. */
  onEdit?: (name: string) => void
  /** A BCP 47 locale for numbers and dates. Default "en-US". */
  locale?: string
  /** An ISO 4217 code for currency fields. Default "USD". */
  currency?: string
  /** An IANA time zone for datetime fields. Default "UTC". */
  timeZone?: string
  /** The instant relative fields count from, as ISO 8601. Defaults to the current time at render. */
  now?: string | number | Date
}

/** A record's fields, read-only, in the page layout's collapsible sections. */
function RecordDetail({
  fields,
  values = {},
  columns = 2,
  layout = "auto",
  loading = false,
  headingLevel = 2,
  onEdit,
  locale = "en-US",
  currency = "USD",
  timeZone = "UTC",
  now,
  className,
  children,
  ...props
}: RecordDetailProps) {
  const context: RecordDetailContextValue = {
    fields,
    values,
    columns,
    layout,
    loading,
    headingLevel,
    onEdit,
    locale,
    currency,
    timeZone,
    now,
  }

  return (
    <RecordDetailContext.Provider value={context}>
      <div
        data-slot="record-detail"
        aria-busy={loading || undefined}
        className={cn("flow-root", className)}
        {...props}
      >
        {loading && React.Children.count(children) === 0 ? (
          <FieldList columns={columns}>
            {Array.from({ length: 6 }, (_, index) => (
              <FieldItem key={index}>
                <OutputField layout={layout} loading className="w-full">
                  <OutputFieldLabel>{null}</OutputFieldLabel>
                  <OutputFieldValue />
                </OutputField>
              </FieldItem>
            ))}
          </FieldList>
        ) : (
          children
        )}
      </div>
    </RecordDetailContext.Provider>
  )
}

/** A collapsible section of the page layout. */
function RecordDetailSection({
  title,
  defaultOpen = true,
  columns,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** The section's heading, as the page layout names it. */
  title: string
  /** Whether the section starts open, uncontrolled. Default true. */
  defaultOpen?: boolean
  /** Whether the section is open, controlled. */
  open?: boolean
  /** Called when the toggle opens or closes the section. */
  onOpenChange?: (open: boolean) => void
  /** Fields per row, over the root's `columns`. */
  columns?: 1 | 2
}) {
  const block = useRecordDetail("RecordDetailSection")

  return (
    <ExpandableSection
      data-slot="record-detail-section"
      defaultOpen={defaultOpen}
      {...props}
    >
      <ExpandableSectionTrigger
        data-slot="record-detail-section-trigger"
        headingLevel={block.headingLevel}
        className="text-(length:--record-section-title-size)"
      >
        {title}
      </ExpandableSectionTrigger>
      <ExpandableSectionContent data-slot="record-detail-section-content">
        <FieldList columns={columns ?? block.columns}>{children}</FieldList>
      </ExpandableSectionContent>
    </ExpandableSection>
  )
}

/** One field by API name: its label and formatted value, with a pencil when `onEdit` is set. */
function RecordDetailField({
  name,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The field's API name, a key of the root's `fields`. */
  name: string
  /** Drawn after the value and its pencil, like a lock on a field people can't edit. */
  children?: React.ReactNode
}) {
  const block = useRecordDetail("RecordDetailField")
  const field = block.fields[name]
  if (!field) throw new Error(`"${name}" isn't in the record detail's fields.`)
  const output = toOutput(field, block.values[name])
  const onEdit = field.editable === false ? undefined : block.onEdit

  return (
    <FieldItem>
      <OutputField
        layout={block.layout}
        loading={block.loading}
        data-field={name}
        className={cn("w-full", className)}
        {...props}
      >
        <OutputFieldLabel help={field.helpText}>{field.label}</OutputFieldLabel>
        <OutputFieldValue
          {...formatOf(field)}
          type={outputTypes[field.type]}
          value={output.value}
          href={output.href}
          locale={block.locale}
          currency={block.currency}
          timeZone={block.timeZone}
          now={block.now}
        />
        {onEdit ? <OutputFieldEdit onClick={() => onEdit(name)} /> : null}
        {children}
      </OutputField>
    </FieldItem>
  )
}

export { RecordDetail, RecordDetailField, RecordDetailSection }
export type {
  RecordDetailFieldDescription,
  RecordDetailFields,
  RecordDetailOption,
  RecordDetailProps,
  RecordDetailValues,
}
