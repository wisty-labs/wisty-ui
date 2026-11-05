"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  ProgressIndicator,
  ProgressIndicatorContent,
  ProgressIndicatorStep,
} from "@/components/wisty/progress-indicator"
import { ProgressRing } from "@/components/wisty/progress-ring"

/** A button that asks the app to do a step's work, through onAction. */
type SetupAssistantButtonAction = {
  /** Draws an outline brand button. */
  type: "button"
  /** Identifies the action in onAction: "confirm-mapping". */
  value: string
  /** The button's words: "Confirm mapping". */
  label: string
  /** Shows the button but doesn't let it run. */
  disabled?: boolean
}

/** A link to a setup page, an article or a video. Following it never completes a step. */
type SetupAssistantLinkAction = {
  /** Navigates with href, without calling onAction. */
  type: "link"
  /** Identifies the action: "manage-users". */
  value: string
  /** The link's words: "View on Trailhead". */
  label: string
  /** Where the link goes. */
  href: string
  /** "link" draws text, "outline-brand" a button that opens a setup page. Default "link". */
  variant?: "link" | "outline-brand"
  /** Shows the link as weak text, or a disabled button, that goes nowhere. */
  disabled?: boolean
}

/** A switch that turns a setting on or off, through onToggleChange. */
type SetupAssistantToggle = {
  /** Draws a switch, or On or Off as text without onToggleChange. */
  type: "toggle"
  /** Identifies the setting: "opportunity-teams". */
  value: string
  /** The switch's name for screen readers: "Turn on Opportunity Teams". */
  label: string
  /** Shows the switch with its confirmed value but doesn't let it change. */
  disabled?: boolean
} & (
  | {
      /** Whether the setting is on, as the app last confirmed it. null when it couldn't be read. */
      checked: boolean
      unavailableLabel?: never
    }
  | {
      checked: null
      /** Why the setting couldn't be read, shown in place of the switch. */
      unavailableLabel: string
    }
)

type SetupAssistantControl =
  | SetupAssistantButtonAction
  | SetupAssistantLinkAction
  | SetupAssistantToggle

/** What an action is for: a step, or one of a sequence's substeps. */
type SetupAssistantActionTarget = {
  /** The step's id. */
  stepId: string
  /** The substep's id, when the action is a substep's. */
  substepId?: string
}

/** A task's progress. Unknown never counts as not started. */
type SetupAssistantTaskProgress =
  | { value: "untracked" }
  | { value: "not-started"; label: string }
  | { value: "in-progress"; label: string; percent: number | null }
  | { value: "complete"; label: string }
  | { value: "unknown"; label: string }

/** A sequence's progress: how many substeps are done, counted from the first. */
type SetupAssistantSequenceProgress =
  | { value: "known"; completed: number }
  | { value: "unknown"; label: string }

type SetupAssistantStepContent = {
  /** Unique among the steps. Keys the row and names it in callbacks. */
  id: string
  /** The step's heading: "Prepare account data". */
  title: string
  /** One or two sentences on what the step does. */
  description: string
  /** How long it takes, as shown: "10 mins". Never weighs progress. */
  estimatedTime?: string
}

/** One substep of a sequence. Substeps are done in order. */
type SetupAssistantSubstep = {
  /** Unique within its sequence. */
  id: string
  /** What to do: "Confirm field mapping". */
  label: string
  /** A line under the label. */
  description?: string
  /** A button or link for the substep. Later substeps' actions wait for earlier ones. */
  action?: SetupAssistantButtonAction | SetupAssistantLinkAction
}

/** A step done in one go, with an optional button or link. */
type SetupAssistantTask = SetupAssistantStepContent & {
  /** A step done in one go. */
  kind: "task"
  /** How far along it is, or untracked for a step with no ring. */
  progress: SetupAssistantTaskProgress
  /** A button or link that does the step. */
  action?: SetupAssistantButtonAction | SetupAssistantLinkAction
}

/** A step that turns a setting on with a switch. */
type SetupAssistantSetting = SetupAssistantStepContent & {
  /** A step with a switch. */
  kind: "setting"
  /** Completes the step while the switch is on. false draws no ring. */
  tracked: boolean
  /** The switch the step is about. */
  action: SetupAssistantToggle
}

/** A step that expands into substeps done in order. Its ring counts them. */
type SetupAssistantSequence = SetupAssistantStepContent & {
  /** A step that expands into ordered substeps. */
  kind: "sequence"
  /** How many substeps are done, or why that isn't known. */
  progress: SetupAssistantSequenceProgress
  /** At least one substep, in the order they're done. */
  substeps: readonly [SetupAssistantSubstep, ...SetupAssistantSubstep[]]
}

type SetupAssistantStep =
  | SetupAssistantTask
  | SetupAssistantSetting
  | SetupAssistantSequence

/** The steps as read: a list, partial when some couldn't be read, or null when none could. */
type SetupAssistantRead =
  | {
      /** The steps as read, in order. null when they couldn't be read. */
      steps: readonly SetupAssistantStep[]
      /** Set when some steps couldn't be read: the notice above the ones that could. */
      partial?: { message: string }
      unavailableMessage?: never
    }
  | {
      steps: null
      partial?: never
      /** Why the steps couldn't be read. Default "Setup steps aren't available." */
      unavailableMessage?: string
    }

type ReadState =
  | { status: "ready"; steps: readonly SetupAssistantStep[] }
  | { status: "partial"; steps: readonly SetupAssistantStep[]; message: string }
  | { status: "loading" }
  | { status: "unavailable"; message: string }

type SetupAssistantName =
  | {
      /** Names the checklist, like "Sales Setup Assistant". */
      "aria-label": string
      "aria-labelledby"?: string
    }
  | {
      "aria-label"?: string
      /** The id of the visible title that names the checklist. */
      "aria-labelledby": string
    }

type StepState =
  | { value: "untracked" }
  | { value: "unknown"; label: string }
  | {
      value: "not-started" | "in-progress" | "complete"
      label: string
      percent: number | null
    }

type SetupRow = {
  step: SetupAssistantStep
  number: number
  state: StepState
  completed: number | null
}

type SetupSummary = { text: string; percent: number | null }

type SetupModel = {
  read: ReadState
  rows: SetupRow[]
  summary: SetupSummary
}

const unreadable = "Progress couldn't be read."

const rowClasses =
  "border-b border-(--setup-assistant-divider) py-6 first:pt-0 last:border-b-0 last:pb-0"

function taskState(step: SetupAssistantTask): StepState {
  const progress = step.progress
  switch (progress.value) {
    case "untracked":
    case "unknown":
      return progress
    case "not-started":
      return { ...progress, percent: 0 }
    case "complete":
      return { ...progress, percent: 100 }
    case "in-progress": {
      const { percent } = progress
      if (percent === null) return progress
      return Number.isFinite(percent) && percent >= 0 && percent < 100
        ? progress
        : { value: "unknown", label: unreadable }
    }
  }
}

function settingState(step: SetupAssistantSetting): StepState {
  if (!step.tracked) return { value: "untracked" }
  if (step.action.checked === null)
    return { value: "unknown", label: step.action.unavailableLabel }
  return step.action.checked
    ? { value: "complete", label: "Complete", percent: 100 }
    : { value: "not-started", label: "Not started", percent: 0 }
}

function sequenceState(step: SetupAssistantSequence): {
  state: StepState
  completed: number | null
} {
  const progress = step.progress
  if (progress.value === "unknown") return { state: progress, completed: null }
  const { completed } = progress
  const total = step.substeps.length
  if (!Number.isInteger(completed) || completed < 0 || completed > total)
    return { state: { value: "unknown", label: unreadable }, completed: null }
  const percent = (100 * completed) / total
  if (completed === total)
    return {
      state: { value: "complete", label: "Complete", percent },
      completed,
    }
  return {
    state:
      completed === 0
        ? { value: "not-started", label: "Not started", percent }
        : {
            value: "in-progress",
            label: `${completed} of ${total} substeps complete`,
            percent,
          },
    completed,
  }
}

function checkIds(steps: readonly SetupAssistantStep[]) {
  const seen = new Set<string>()
  for (const step of steps) {
    if (!step.id || seen.has(step.id))
      throw new Error(
        `SetupAssistant needs a unique, non-empty id on every step; got "${step.id}".`
      )
    seen.add(step.id)
    if (step.kind !== "sequence") continue
    if (step.substeps.length === 0)
      throw new Error(`SetupAssistant step "${step.id}" has no substeps.`)
    const substeps = new Set(step.substeps.map((substep) => substep.id))
    if (substeps.size !== step.substeps.length || substeps.has(""))
      throw new Error(
        `SetupAssistant step "${step.id}" needs a unique, non-empty id on every substep.`
      )
  }
}

function summarize(
  read: ReadState,
  rows: SetupRow[],
  loading: boolean
): SetupSummary {
  if (read.status === "loading")
    return { text: "Loading setup progress…", percent: null }
  if (loading) return { text: "Updating setup progress…", percent: null }
  if (read.status === "unavailable")
    return { text: "Setup progress unavailable.", percent: null }
  if (rows.length === 0 && read.status === "ready")
    return { text: "No setup steps to show.", percent: null }
  const tracked = rows.filter((row) => row.state.value !== "untracked")
  const done = tracked.filter((row) => row.state.value === "complete").length
  if (read.status === "partial")
    return {
      text: `${done} of ${tracked.length} shown steps complete. Overall progress unavailable.`,
      percent: null,
    }
  if (tracked.length === 0)
    return { text: "Progress isn't tracked for these steps.", percent: null }
  if (tracked.some((row) => row.state.value === "unknown"))
    return {
      text: `${done} ${done === 1 ? "step" : "steps"} complete. Overall progress unavailable.`,
      percent: null,
    }
  const noun = tracked.length < rows.length ? "tracked steps" : "steps"
  return {
    text: `${done} of ${tracked.length} ${noun} complete`,
    percent: (100 * done) / tracked.length,
  }
}

function readState(
  steps: readonly SetupAssistantStep[] | null,
  partialMessage: string | undefined,
  unavailableMessage: string | undefined,
  loading: boolean
): ReadState {
  if (loading && !steps?.length) return { status: "loading" }
  if (steps === null)
    return {
      status: "unavailable",
      message: unavailableMessage ?? "Setup steps aren't available.",
    }
  if (partialMessage !== undefined)
    return { status: "partial", steps, message: partialMessage }
  return { status: "ready", steps }
}

function deriveSetup(read: ReadState, loading: boolean): SetupModel {
  const steps =
    read.status === "ready" || read.status === "partial" ? read.steps : []
  checkIds(steps)
  const rows = steps.map((step, index): SetupRow => {
    if (step.kind === "sequence")
      return { step, number: index + 1, ...sequenceState(step) }
    const state = step.kind === "task" ? taskState(step) : settingState(step)
    return { step, number: index + 1, state, completed: null }
  })
  return { read, rows, summary: summarize(read, rows, loading) }
}

type SetupAssistantContextValue = {
  model: SetupModel
  expanded: ReadonlySet<string>
  setExpanded: (stepId: string, open: boolean) => void
  onAction?: (
    action: SetupAssistantButtonAction,
    target: SetupAssistantActionTarget
  ) => void
  onToggleChange?: (stepId: string, checked: boolean) => void
  headingLevel: 2 | 3 | 4 | 5 | 6
}

const SetupAssistantContext =
  React.createContext<SetupAssistantContextValue | null>(null)

function useSetupAssistant(part: string) {
  const context = React.useContext(SetupAssistantContext)
  if (!context) throw new Error(`${part} must be used within a SetupAssistant.`)
  return context
}

/** A setup checklist's data and expanded steps, shared by its summary and list. */
function SetupAssistant({
  steps,
  partial,
  unavailableMessage,
  loading = false,
  value,
  defaultValue,
  onValueChange,
  onAction,
  onToggleChange,
  headingLevel = 2,
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<"section">,
  "defaultValue" | "onChange" | "aria-label" | "aria-labelledby"
> &
  SetupAssistantName &
  SetupAssistantRead & {
    /** Marks the checklist busy: placeholder rows with no steps, or the steps kept while they reload. */
    loading?: boolean
    /** The ids of the open sequences, when controlled. */
    value?: readonly string[]
    /** The ids of the sequences open at first. */
    defaultValue?: readonly string[]
    /** Called with the open sequences' ids, in step order. */
    onValueChange?: (value: string[]) => void
    /** Asks the app to do a button's work. Buttons render only with it. */
    onAction?: (
      action: SetupAssistantButtonAction,
      target: SetupAssistantActionTarget
    ) => void
    /** Asks the app to change a setting. Without it, settings show On or Off as text. */
    onToggleChange?: (stepId: string, checked: boolean) => void
    /** The step titles' heading level. Default 2, 3 under a card's h2 title. */
    headingLevel?: 2 | 3 | 4 | 5 | 6
  }) {
  const partialMessage = partial?.message
  const model = React.useMemo(
    () =>
      deriveSetup(
        readState(steps, partialMessage, unavailableMessage, loading),
        loading
      ),
    [steps, partialMessage, unavailableMessage, loading]
  )
  const [uncontrolled, setUncontrolled] = React.useState(
    () => new Set(defaultValue)
  )
  const expanded = React.useMemo(
    () => (value === undefined ? uncontrolled : new Set(value)),
    [value, uncontrolled]
  )

  const setExpanded = (stepId: string, open: boolean) => {
    if (expanded.has(stepId) === open) return
    const next = model.rows
      .filter(({ step }) => step.kind === "sequence")
      .map(({ step }) => step.id)
      .filter((id) => (id === stepId ? open : expanded.has(id)))
    if (value === undefined) setUncontrolled(new Set(next))
    onValueChange?.(next)
  }

  return (
    <SetupAssistantContext
      value={{
        model,
        expanded,
        setExpanded,
        onAction,
        onToggleChange,
        headingLevel,
      }}
    >
      <section
        data-slot="setup-assistant"
        aria-busy={loading || undefined}
        className={cn("@container", className)}
        {...props}
      >
        {children}
      </section>
    </SetupAssistantContext>
  )
}

/** How many steps are done, as words and a bar, or why that isn't known. */
function SetupAssistantSummary({
  label = "Setup progress",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** Names the bar, shown above it. */
  label?: string
}) {
  const { model } = useSetupAssistant("SetupAssistantSummary")
  const { text, percent } = model.summary
  const labelId = React.useId()

  return (
    <div data-slot="setup-assistant-summary" className={className} {...props}>
      <div
        data-slot="setup-assistant-summary-text"
        className="flex flex-wrap justify-between gap-x-4 pb-2"
      >
        <span id={labelId}>{label}</span>
        <strong aria-hidden={percent !== null || undefined}>{text}</strong>
      </div>
      {percent !== null && (
        <div
          data-slot="setup-assistant-summary-track"
          role="progressbar"
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={text}
          className="block h-2 w-full rounded-(--radius-pill) bg-(--progress-track)"
        >
          <div
            data-slot="setup-assistant-summary-fill"
            className="block h-full rounded-(--radius-pill) bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  )
}

/** The numbered steps, with their rings, actions and substeps. */
function SetupAssistantList({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  const { model } = useSetupAssistant("SetupAssistantList")
  const { read, rows } = model

  return (
    <div
      data-slot="setup-assistant-list"
      className={cn("p-4 text-(length:--font-size-base)", className)}
      {...props}
    >
      {read.status === "partial" && (
        <Alert variant="warning" role="status" className="mb-4">
          <AlertDescription>{read.message}</AlertDescription>
        </Alert>
      )}
      {read.status === "unavailable" && (
        <p
          data-slot="setup-assistant-message"
          className="text-muted-foreground"
        >
          {read.message}
        </p>
      )}
      {read.status === "ready" && rows.length === 0 && (
        <p
          data-slot="setup-assistant-message"
          className="text-muted-foreground"
        >
          No setup steps to show.
        </p>
      )}
      {read.status === "loading" && (
        <div data-slot="setup-assistant-loading">
          <span className="sr-only">Loading setup steps</span>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              aria-hidden="true"
              className={cn(rowClasses, "flex items-start gap-3")}
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2 pt-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}
      {rows.length > 0 && (
        <ol data-slot="setup-assistant-steps">
          {rows.map((row) => (
            <li
              key={row.step.id}
              data-slot="setup-assistant-item"
              data-status={row.state.value}
              className={rowClasses}
            >
              <SetupAssistantRow row={row} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function SetupAssistantRow({ row }: { row: SetupRow }) {
  const { expanded, setExpanded } = useSetupAssistant("SetupAssistantList")
  const id = React.useId()
  const { step } = row
  const ids = {
    title: `${id}-title`,
    status: `${id}-status`,
    panel: `${id}-panel`,
  }

  if (step.kind !== "sequence")
    return (
      <article data-slot="setup-assistant-step" aria-labelledby={ids.title}>
        <StepSummary row={row} ids={ids} />
      </article>
    )

  const open = expanded.has(step.id)
  const toggle = () => setExpanded(step.id, !open)

  return (
    <article
      data-slot="setup-assistant-step"
      aria-labelledby={ids.title}
      className="flex items-start"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        data-slot="setup-assistant-toggle"
        aria-label={`Toggle details for ${step.title}`}
        aria-expanded={open}
        aria-controls={ids.panel}
        onClick={toggle}
        className="me-2 mt-2 size-4 aria-[expanded=false]:[&>svg]:-rotate-90 rtl:aria-[expanded=false]:[&>svg]:rotate-90"
      >
        <ChevronDownIcon aria-hidden="true" />
      </Button>
      <div className="min-w-0 flex-1">
        <StepSummary row={row} ids={ids} open={open} onToggle={toggle} />
        <div
          id={ids.panel}
          data-slot="setup-assistant-details"
          hidden={!open}
          className="ps-11 pt-3 rtl:ps-4 rtl:pe-6"
        >
          <Substeps row={row} step={step} />
        </div>
      </div>
    </article>
  )
}

function StepSummary({
  row,
  ids,
  open,
  onToggle,
}: {
  row: SetupRow
  ids: { title: string; status: string; panel: string }
  open?: boolean
  onToggle?: () => void
}) {
  const { headingLevel } = useSetupAssistant("SetupAssistantList")
  const { step, state } = row
  const Heading = `h${headingLevel}` as const
  const action = step.kind === "sequence" ? undefined : step.action

  return (
    <div data-slot="setup-assistant-step-summary" className="flex items-start">
      {state.value !== "untracked" && (
        <div className="relative top-px me-3 shrink-0">
          <StepRing row={row} statusId={ids.status} />
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-3 @lg:flex-row @lg:gap-0",
          state.value !== "untracked" && "mt-2"
        )}
      >
        <div
          data-slot="setup-assistant-step-content"
          className="min-w-0 flex-1 @lg:me-8"
        >
          <Heading
            id={ids.title}
            data-slot="setup-assistant-step-title"
            className="pb-2 text-(length:--setup-assistant-title-size) leading-(--setup-assistant-title-line-height) font-(--setup-assistant-title-weight)"
          >
            {onToggle ? (
              <button
                type="button"
                data-slot="setup-assistant-title-trigger"
                aria-expanded={open}
                aria-controls={ids.panel}
                onClick={onToggle}
                className="cursor-pointer rounded-(--radius-1) text-start outline-none focus-visible:shadow-(--shadow-focus-outset)"
              >
                {step.title}
              </button>
            ) : (
              step.title
            )}
          </Heading>
          <p data-slot="setup-assistant-step-description">{step.description}</p>
          {state.value !== "untracked" && (
            <p
              id={ids.status}
              data-slot="setup-assistant-step-status"
              className={
                state.value === "unknown" && step.kind !== "setting"
                  ? "pt-1 text-muted-foreground"
                  : "sr-only"
              }
            >
              {state.label}
            </p>
          )}
        </div>
        {(action || step.estimatedTime) && (
          <div
            data-slot="setup-assistant-step-actions"
            className="flex shrink-0 flex-col items-start @lg:ms-3 @lg:items-end @lg:text-end"
          >
            {action && (
              <StepControl
                control={action}
                target={{ stepId: step.id }}
                available
              />
            )}
            {step.estimatedTime && (
              <p
                data-slot="setup-assistant-step-estimate"
                className={cn("text-muted-foreground", action && "pt-4")}
              >
                {step.estimatedTime}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StepRing({ row, statusId }: { row: SetupRow; statusId: string }) {
  const { state, number, step } = row
  if (state.value === "untracked") return null
  const name = `Step ${number}: ${step.title}`

  if (state.value === "complete")
    return (
      <ProgressRing
        size="large"
        variant="complete"
        value={100}
        iconLabel={state.label}
        aria-label={name}
      />
    )
  return (
    <ProgressRing
      size="large"
      variant={state.value === "in-progress" ? "active-step" : "base"}
      value={state.value === "unknown" ? null : state.percent}
      aria-label={name}
      aria-describedby={statusId}
    >
      {number}
    </ProgressRing>
  )
}

function Substeps({
  row,
  step,
}: {
  row: SetupRow
  step: SetupAssistantSequence
}) {
  const { completed } = row
  const last = step.substeps.length - 1
  const name = `${step.title} substeps`

  const content = (
    substep: SetupAssistantSubstep,
    index: number,
    className?: string
  ) => (
    <ProgressIndicatorContent
      data-slot="setup-assistant-substep"
      className={cn(
        "flex-col items-start gap-3 @lg:flex-row @lg:items-center @lg:gap-4",
        className
      )}
    >
      <div className="min-w-0 @lg:basis-3/4">
        <p>{substep.label}</p>
        {substep.description && (
          <p className="text-muted-foreground">{substep.description}</p>
        )}
      </div>
      <div className="flex @lg:basis-1/4 @lg:justify-end">
        {substep.action && (
          <StepControl
            control={substep.action}
            target={{ stepId: step.id, substepId: substep.id }}
            available={completed !== null && index <= completed}
          />
        )}
      </div>
    </ProgressIndicatorContent>
  )

  if (completed === null)
    return (
      <ol
        data-slot="setup-assistant-substeps"
        aria-label={name}
        className="list-decimal ps-4"
      >
        {step.substeps.map((substep, index) => (
          <li key={substep.id} className="ps-1">
            {content(
              substep,
              index,
              index < last ? "border-b border-border" : undefined
            )}
          </li>
        ))}
      </ol>
    )

  return (
    <ProgressIndicator
      data-slot="setup-assistant-substeps"
      orientation="vertical"
      value={completed}
      aria-label={name}
      success
      bordered
      track={null}
    >
      {step.substeps.map((substep, index) => (
        <ProgressIndicatorStep key={substep.id} label={substep.label}>
          {content(substep, index)}
        </ProgressIndicatorStep>
      ))}
    </ProgressIndicator>
  )
}

function StepControl({
  control,
  target,
  available,
}: {
  control: SetupAssistantControl
  target: SetupAssistantActionTarget
  available: boolean
}) {
  const { onAction, onToggleChange } = useSetupAssistant("SetupAssistantList")

  if (control.type === "toggle") {
    if (control.checked === null)
      return (
        <p
          data-slot="setup-assistant-setting-state"
          className="text-muted-foreground"
        >
          <span className="sr-only">{control.label}: </span>
          {control.unavailableLabel}
        </p>
      )
    if (!onToggleChange)
      return (
        <p data-slot="setup-assistant-setting-state">
          <span className="sr-only">{control.label}: </span>
          {control.checked ? "On" : "Off"}
        </p>
      )
    return (
      <div
        data-slot="setup-assistant-switch"
        className="flex flex-col items-start gap-1"
      >
        <Switch
          aria-label={control.label}
          checked={control.checked}
          disabled={control.disabled}
          onCheckedChange={(checked) => onToggleChange(target.stepId, checked)}
        />
        <span
          aria-hidden="true"
          className="text-(length:--setup-assistant-toggle-text-size) text-muted-foreground"
        >
          {control.checked ? "On" : "Off"}
        </span>
      </div>
    )
  }

  if (control.type === "link") {
    const variant = control.variant ?? "link"
    if (!available || control.disabled)
      return variant === "link" ? (
        <span
          data-slot="setup-assistant-action"
          className="text-muted-foreground"
        >
          {control.label}
        </span>
      ) : (
        <Button
          type="button"
          variant="outline-brand"
          data-slot="setup-assistant-action"
          disabled
        >
          {control.label}
        </Button>
      )
    return (
      <a
        data-slot="setup-assistant-action"
        href={control.href}
        className={
          variant === "link"
            ? "rounded-(--radius-1) text-link outline-none hover:text-link-hover hover:underline focus-visible:underline focus-visible:shadow-(--shadow-focus)"
            : buttonVariants({ variant: "outline-brand" })
        }
      >
        {control.label}
      </a>
    )
  }

  if (!onAction) return null
  return (
    <Button
      type="button"
      variant="outline-brand"
      data-slot="setup-assistant-action"
      disabled={control.disabled || !available}
      onClick={() => onAction(control, target)}
    >
      {control.label}
    </Button>
  )
}

export { SetupAssistant, SetupAssistantList, SetupAssistantSummary }
export type {
  SetupAssistantActionTarget,
  SetupAssistantButtonAction,
  SetupAssistantControl,
  SetupAssistantLinkAction,
  SetupAssistantRead,
  SetupAssistantSequence,
  SetupAssistantSequenceProgress,
  SetupAssistantSetting,
  SetupAssistantStep,
  SetupAssistantSubstep,
  SetupAssistantTask,
  SetupAssistantTaskProgress,
  SetupAssistantToggle,
}
