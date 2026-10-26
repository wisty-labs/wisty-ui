"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/wisty/icon"
import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
  type RecordDetailFieldDescription,
  type RecordDetailValues,
} from "@/components/wisty/record-detail"
import {
  RecordForm,
  RecordFormField,
  RecordFormMessages,
  RecordFormSubmit,
  type RecordFormErrors,
  type RecordFormFieldDescription,
  type RecordFormFields,
  type RecordFormValues,
} from "@/components/wisty/record-form"

/** How a field is drawn, read and edited: Record form's description, or a relative time, which is only shown. */
type RecordInlineEditFieldDescription =
  | RecordFormFieldDescription
  | Extract<RecordDetailFieldDescription, { type: "relative" }>

/** The record's fields, keyed by API name. */
type RecordInlineEditFields = Record<string, RecordInlineEditFieldDescription>

/** The record's values, keyed by API name: a lookup's is its record, a compound field's its parts, an instant ISO 8601. */
type RecordInlineEditValues = RecordDetailValues

type RecordInlineEditMode = "view" | "edit"

interface RecordInlineEditSubmitDetails {
  /** The values that differ from `values`, as updateRecord takes them. */
  changed: RecordFormValues
}

// A section's own open state and the failure count when it was set.
type SectionState = { open: boolean; failures: number }

// Failed saves so far, and the count when the latest one opened every section.
type Reveal = { failures: number; openedAt: number | null }

type RecordInlineEditContextValue = {
  fields: RecordInlineEditFields
  editing: boolean
  pending: boolean
  layout: "auto" | "stacked" | "horizontal"
  edit: (name: string) => void
  cancel: () => void
  sectionOpen: (key: string, defaultOpen: boolean) => boolean
  setSectionOpen: (key: string, open: boolean) => void
}

const RecordInlineEditContext =
  React.createContext<RecordInlineEditContextValue | null>(null)

function useRecordInlineEdit(part: string) {
  const context = React.useContext(RecordInlineEditContext)
  if (!context)
    throw new Error(`${part} must be used inside <RecordInlineEdit>.`)
  return context
}

function hasErrors(errors: RecordFormErrors | undefined) {
  if (!errors) return false
  const form = errors.form
  if (typeof form === "string" ? form !== "" : (form?.length ?? 0) > 0)
    return true
  return Object.values(errors.fields ?? {}).some((list) =>
    typeof list === "string" ? list !== "" : list.length > 0
  )
}

// A relative time is never drawn as a form field, but its label still names an error returned for it.
function toFormFields(fields: RecordInlineEditFields): RecordFormFields {
  return Object.fromEntries(
    Object.entries(fields).map(([name, field]) => [
      name,
      field.type === "relative"
        ? { type: "text", label: field.label, helpText: field.helpText }
        : field,
    ])
  )
}

interface RecordInlineEditProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "defaultValue"
> {
  /** Every field the layout can show, keyed by API name. */
  fields: RecordInlineEditFields
  /** The record's values. After a save, pass the new values with mode "view". */
  values?: RecordInlineEditValues
  /** View or edit, controlled. A save needs it controlled, so the app can return to view. */
  mode?: RecordInlineEditMode
  /** The mode it starts in, uncontrolled. Default "view". */
  defaultMode?: RecordInlineEditMode
  /** Called when a pencil asks for edit mode, or Cancel for view mode. */
  onModeChange?: (mode: RecordInlineEditMode) => void
  /** The save is running: Save shows a spinner and is disabled. */
  pending?: boolean
  /** A failed save's errors. Pass a new object for each save, from state. */
  errors?: RecordFormErrors
  /** Called with valid values when Save is pressed. */
  onSubmit?: (
    values: RecordFormValues,
    details: RecordInlineEditSubmitDetails
  ) => void
  /** The user can't edit the record: no pencils, and view mode only. */
  readOnly?: boolean
  /** Fields per row. Default 2. Two columns fall to one in a narrow container. */
  columns?: 1 | 2
  /** Label above the value, or beside it from a 48rem screen. Default "auto": beside it when the page is compact (`data-density="compact"`), above it otherwise. */
  layout?: "auto" | "stacked" | "horizontal"
  /** The level of each section's heading. Default 2, under a record page's h1. */
  headingLevel?: 2 | 3 | 4
  /** Holds every value's place while the record loads, with no pencils. Without children, draws placeholder fields. */
  loading?: boolean
  /** A BCP 47 locale for numbers and dates. Default "en-US". */
  locale?: string
  /** An ISO 4217 code for currency fields. Default "USD". */
  currency?: string
  /** An IANA time zone whose clock datetime fields show and are edited in. Default "UTC". */
  timeZone?: string
}

function RecordInlineEdit({
  fields,
  values = {},
  mode: modeProp,
  defaultMode = "view",
  onModeChange,
  pending = false,
  errors,
  onSubmit,
  readOnly = false,
  columns = 2,
  layout = "auto",
  headingLevel = 2,
  loading = false,
  locale = "en-US",
  currency = "USD",
  timeZone = "UTC",
  className,
  children,
  ...props
}: RecordInlineEditProps) {
  const [uncontrolledMode, setUncontrolledMode] = React.useState(defaultMode)
  const mode = modeProp ?? uncontrolledMode
  const editing = mode === "edit" && !readOnly && !loading
  const setMode = (next: RecordInlineEditMode) => {
    if (modeProp === undefined) setUncontrolledMode(next)
    onModeChange?.(next)
  }

  // Each entry into edit mode is a new session, so the form's drafts restart from the current values.
  const [session, setSession] = React.useState(0)
  // A pencil's request for edit mode, dropped if the parent doesn't act on it in the same commit.
  const [request, setRequest] = React.useState<string>()
  // The field whose pencil started the session: focused on mount, its pencil refocused at the end.
  const [origin, setOrigin] = React.useState<string>()
  // Errors left over from an earlier session are ignored until a new object arrives.
  const [staleErrors, setStaleErrors] = React.useState<RecordFormErrors>()
  // A failed save opens every section until the session ends.
  const [reveal, setReveal] = React.useState<Reveal>(() =>
    hasErrors(editing ? errors : undefined)
      ? { failures: 1, openedAt: 1 }
      : { failures: 0, openedAt: null }
  )
  const revealAll = () =>
    setReveal((current) => ({
      failures: current.failures + 1,
      openedAt: current.failures + 1,
    }))
  const [shownEditing, setShownEditing] = React.useState(editing)
  // Adjusted during render, so the session's first pass never treats the stale errors as new ones.
  let stale = staleErrors
  if (editing !== shownEditing) {
    setShownEditing(editing)
    if (editing) {
      setSession(session + 1)
      stale = errors
      setStaleErrors(errors)
      setOrigin(request)
      setRequest(undefined)
    } else {
      setReveal({ ...reveal, openedAt: null })
    }
  } else if (!editing && request !== undefined) {
    // A request the parent didn't act on in the same commit is refused.
    setRequest(undefined)
  }
  const formErrors = editing && errors !== stale ? errors : undefined
  const [shownErrors, setShownErrors] = React.useState(formErrors)
  if (formErrors !== shownErrors) {
    setShownErrors(formErrors)
    if (hasErrors(formErrors)) revealAll()
  }
  const [sections, setSections] = React.useState<Record<string, SectionState>>(
    {}
  )

  // When the session ends, focus returns to the pencil that started it, or to its
  // section's toggle when that section was collapsed meanwhile, but only if focus was in the block.
  const formRef = React.useRef<HTMLFormElement>(null)
  const wasEditing = React.useRef(editing)
  React.useEffect(() => {
    const ended = wasEditing.current && !editing
    wasEditing.current = editing
    const form = formRef.current
    if (!ended || !form) return
    const active = document.activeElement
    if (active && active !== document.body && !form.contains(active)) return
    const hidden = (element: Element) => element.closest("[hidden]") !== null
    const field =
      origin === undefined
        ? null
        : form.querySelector(`[data-field=${JSON.stringify(origin)}]`)
    if (field && hidden(field)) {
      field
        .closest("[data-slot=record-detail-section]")
        ?.querySelector<HTMLElement>(
          "[data-slot=record-detail-section-trigger]"
        )
        ?.focus()
      return
    }
    const pencil =
      field?.querySelector<HTMLElement>("[data-slot=output-field-edit]") ??
      [
        ...form.querySelectorAll<HTMLElement>("[data-slot=output-field-edit]"),
      ].find((candidate) => !hidden(candidate))
    pencil?.focus()
  }, [editing, origin])

  const formFields = React.useMemo(() => toFormFields(fields), [fields])

  const edit = (name: string) => {
    setRequest(name)
    setMode("edit")
  }

  const context: RecordInlineEditContextValue = {
    fields,
    editing,
    pending: editing && pending,
    layout,
    edit,
    cancel: () => setMode("view"),
    sectionOpen: (key, defaultOpen) => {
      const state = sections[key]
      if (
        reveal.openedAt !== null &&
        (!state || state.failures < reveal.openedAt)
      )
        return true
      return state ? state.open : defaultOpen
    },
    setSectionOpen: (key, open) =>
      setSections((current) => ({
        ...current,
        [key]: { open, failures: reveal.failures },
      })),
  }

  return (
    <RecordInlineEditContext.Provider value={context}>
      <RecordDetail
        data-slot="record-inline-edit"
        data-mode={editing ? "edit" : "view"}
        fields={fields}
        values={values}
        columns={columns}
        layout={layout}
        loading={loading}
        headingLevel={headingLevel}
        onEdit={editing || readOnly ? undefined : edit}
        locale={locale}
        currency={currency}
        timeZone={timeZone}
        className={cn("isolate", className)}
        {...props}
      >
        {loading && React.Children.count(children) === 0 ? null : (
          <RecordForm
            key={session}
            ref={formRef}
            fields={formFields}
            defaultValues={values}
            errors={formErrors}
            pending={editing && pending}
            onSubmit={(submitted, { changed }) =>
              onSubmit?.(submitted, { changed })
            }
            onInvalidFields={revealAll}
            highlightChanges
            autoFocusField={editing ? origin : undefined}
            locale={locale}
            currency={currency}
            timeZone={timeZone}
            className="flow-root"
          >
            {children}
          </RecordForm>
        )}
      </RecordDetail>
    </RecordInlineEditContext.Provider>
  )
}

/** The errors for the whole record, above the sections in edit mode. Renders nothing without any. */
function RecordInlineEditMessages({
  className,
  ...props
}: React.ComponentProps<typeof RecordFormMessages>) {
  const block = useRecordInlineEdit("RecordInlineEditMessages")
  if (!block.editing) return null
  return (
    <RecordFormMessages
      data-slot="record-inline-edit-messages"
      className={cn("mt-2", className)}
      {...props}
    />
  )
}

/** A collapsible section of the page layout, drawn the same in both modes. */
function RecordInlineEditSection({
  title,
  value,
  defaultOpen = true,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof RecordDetailSection>,
  "open" | "onOpenChange"
> & {
  /** A stable key for its open state, like the layout section's id. Without it, the title keys it. */
  value?: string
}) {
  const block = useRecordInlineEdit("RecordInlineEditSection")
  const key = value ?? title

  return (
    <RecordDetailSection
      title={title}
      open={block.sectionOpen(key, defaultOpen)}
      onOpenChange={(open) => block.setSectionOpen(key, open)}
      className={cn(
        block.editing && "**:data-[slot=record-detail-fields]:gap-y-2",
        className
      )}
      {...props}
    />
  )
}

/** One field by API name: its value with a pencil in view mode, the form field or a locked value in edit mode. */
function RecordInlineEditField({
  name,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The field's API name, a key of the root's `fields`. */
  name: string
  /** A custom control for edit mode that calls useRecordFormControl; omit it for the type's own. */
  children?: React.ReactNode
}) {
  const block = useRecordInlineEdit("RecordInlineEditField")
  const field = block.fields[name]
  if (!field) throw new Error(`"${name}" isn't in the inline edit's fields.`)

  if (block.editing && field.editable !== false) {
    return (
      <div
        role="listitem"
        data-slot="record-inline-edit-item"
        className="flex min-w-0"
      >
        <RecordFormField
          name={name}
          layout={block.layout}
          className={className}
          {...props}
        >
          {children}
        </RecordFormField>
      </div>
    )
  }

  return (
    <RecordDetailField name={name} className={className} {...props}>
      {/* Qualified by its own data-slot to outrank Field's *:w-full and *:col-start-2. */}
      {block.editing ? (
        <span
          data-slot="record-inline-edit-lock"
          className={cn(
            "-my-0.5 flex size-6 items-center justify-center self-end data-[slot=record-inline-edit-lock]:w-6",
            block.layout === "horizontal" &&
              "md:data-[slot=record-inline-edit-lock]:col-start-4",
            block.layout === "auto" &&
              "compact:md:data-[slot=record-inline-edit-lock]:col-start-4"
          )}
        >
          <Icon
            name="utility:lock"
            size="xx-small"
            label={`Locked ${field.label}`}
            style={{ color: "var(--button-icon-foreground)" }}
          />
        </span>
      ) : null}
    </RecordDetailField>
  )
}

/** The buttons docked at the bottom of the block in edit mode: Cancel and Save, or its children. */
function RecordInlineEditFooter({
  cancelLabel = "Cancel",
  saveLabel = "Save",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The Cancel button's text, without children. Default "Cancel". */
  cancelLabel?: string
  /** The Save button's text, without children. Default "Save". */
  saveLabel?: string
  /** Buttons in place of Cancel and Save; leave it out for the defaults. */
  children?: React.ReactNode
}) {
  const block = useRecordInlineEdit("RecordInlineEditFooter")
  if (!block.editing) return null
  return (
    <div
      data-slot="record-inline-edit-footer"
      className={cn(
        "sticky bottom-0 z-10 mt-2 flex flex-wrap justify-center gap-1 bg-(--docked-form-footer-background) py-2 shadow-(--docked-form-footer-shadow)",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <RecordInlineEditCancel>{cancelLabel}</RecordInlineEditCancel>
          <RecordFormSubmit>{saveLabel}</RecordFormSubmit>
        </>
      )}
    </div>
  )
}

/** Cancel: back to view mode, dropping the edits. Disabled while the save runs. */
function RecordInlineEditCancel({
  variant = "outline",
  disabled,
  onClick,
  children = "Cancel",
  ...props
}: React.ComponentProps<typeof Button>) {
  const block = useRecordInlineEdit("RecordInlineEditCancel")
  return (
    <Button
      data-slot="record-inline-edit-cancel"
      type="button"
      variant={variant}
      disabled={block.pending || disabled}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) block.cancel()
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export {
  RecordInlineEdit,
  RecordInlineEditCancel,
  RecordInlineEditField,
  RecordInlineEditFooter,
  RecordInlineEditMessages,
  RecordInlineEditSection,
}
export type {
  RecordInlineEditFieldDescription,
  RecordInlineEditFields,
  RecordInlineEditMode,
  RecordInlineEditProps,
  RecordInlineEditSubmitDetails,
  RecordInlineEditValues,
}
