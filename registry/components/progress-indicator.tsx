"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { BanIcon, CircleCheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ProgressIndicatorStatus = "complete" | "current" | "incomplete" | "error"

type ProgressIndicatorContextValue = {
  orientation: "horizontal" | "vertical"
  value: number
  onValueChange?: (value: number) => void
  selectAhead: boolean
}

const ProgressIndicatorContext =
  React.createContext<ProgressIndicatorContextValue | null>(null)

// Each step's position in the list, given by the root.
const ProgressIndicatorStepIndex = React.createContext(-1)

function useProgressIndicator() {
  const context = React.useContext(ProgressIndicatorContext)
  if (!context) {
    throw new Error(
      "ProgressIndicatorStep must be used within a ProgressIndicator."
    )
  }
  return context
}

const progressIndicatorVariants = cva("relative w-full", {
  variants: {
    orientation: {
      horizontal: "m-auto max-w-[70%] flex-auto",
      vertical: "",
    },
    // --marker-surface is the surface behind complete, current and error
    // markers and around the current one; --marker-ring the ring around
    // incomplete markers, and --marker-check-ring a complete one's border.
    variant: {
      base: "[--marker-check-ring:transparent] [--marker-ring:var(--progress-indicator-marker-border)] [--marker-surface:var(--background)]",
      shade:
        "[--marker-check-ring:var(--muted)] [--marker-ring:var(--muted)] [--marker-surface:var(--muted)]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "base",
  },
})

function ProgressIndicator({
  orientation = "horizontal",
  variant = "base",
  value,
  onValueChange,
  selectAhead = false,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> &
  VariantProps<typeof progressIndicatorVariants> & {
    /** The current step's index, from 0; earlier steps are complete. The step count completes all. */
    value: number
    /** Called with a step's index when it's clicked. Makes the markers selectable. */
    onValueChange?: (value: number) => void
    /** Lets people select steps after the current one. */
    selectAhead?: boolean
    /** Names the process for screen readers, like "New opportunity". */
    "aria-label": string
  }) {
  const steps = React.Children.toArray(children).filter(React.isValidElement)
  const context = React.useMemo<ProgressIndicatorContextValue>(
    () => ({
      orientation: orientation ?? "horizontal",
      value,
      onValueChange,
      selectAhead,
    }),
    [orientation, value, onValueChange, selectAhead]
  )

  if (steps.length === 0) return null

  // The bar runs from the first marker to the last, so the current step's
  // share is its index over the gaps between steps.
  const share =
    steps.length > 1
      ? Math.min(Math.max(value / (steps.length - 1), 0), 1)
      : value >= 1
        ? 1
        : 0
  const percent = share * 100

  return (
    <div
      data-slot="progress-indicator"
      data-orientation={orientation}
      className={cn(
        progressIndicatorVariants({ orientation, variant }),
        className
      )}
      {...props}
    >
      <TooltipProvider>
        <ol
          data-slot="progress-indicator-list"
          aria-label={ariaLabel}
          className={cn(
            "relative z-1 m-auto h-full",
            orientation === "vertical"
              ? "block"
              : "flex items-center justify-between"
          )}
        >
          <ProgressIndicatorContext value={context}>
            {steps.map((step, index) => (
              <ProgressIndicatorStepIndex key={step.key} value={index}>
                {step}
              </ProgressIndicatorStepIndex>
            ))}
          </ProgressIndicatorContext>
        </ol>
      </TooltipProvider>
      {/* Drawn here, not with Progress: Base UI's Progress wraps its bar in a
          second element, so one file can't style the bar on both bases. */}
      <div
        data-slot="progress-indicator-track"
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        className={
          orientation === "vertical"
            ? "sr-only"
            : "absolute top-1/2 -mt-px block h-0.5 w-full bg-(--neutral)"
        }
      >
        <div
          data-slot="progress-indicator-value"
          className="block h-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

const markerVariants = cva(
  "relative flex size-4 items-center justify-center rounded-full border-4 border-(--marker-ring) bg-(--neutral) align-middle outline-none focus-visible:shadow-(--shadow-focus-outset)",
  {
    variants: {
      status: {
        incomplete: "",
        current:
          "border-primary bg-(--marker-surface) shadow-[0_0_0_0.25rem_var(--marker-surface)] hover:border-(--progress-indicator-marker-border-hover) focus:border-(--progress-indicator-marker-border-hover) focus-visible:shadow-(--shadow-focus-outset)",
        complete:
          "size-auto border-(--marker-check-ring) bg-(--marker-surface) leading-0 text-primary",
        error:
          "size-auto border-transparent bg-(--marker-surface) leading-0 text-destructive",
      },
      orientation: {
        horizontal: "",
        vertical: "z-5 me-4 min-w-4",
      },
    },
    compoundVariants: [
      {
        orientation: "vertical",
        status: ["complete", "error"],
        className: "border-x-0",
      },
      {
        orientation: "vertical",
        status: "complete",
        className: "text-(--progress-indicator-check-vertical)",
      },
    ],
  }
)

// The line between vertical markers: the half above a marker is colored
// up to the current step, the half below up to the step before it.
const lineClasses: Record<ProgressIndicatorStatus, string> = {
  complete: "before:bg-primary after:bg-primary",
  current: "before:bg-primary",
  error: "before:bg-primary",
  incomplete: "",
}

// Hidden state words: after the label on a horizontal marker ("Contact -
// Completed"), alone in a vertical one.
const stateWords: Record<
  ProgressIndicatorStatus,
  { horizontal: string; vertical: string | null }
> = {
  complete: { horizontal: " - Completed", vertical: "Complete" },
  current: { horizontal: " - Active", vertical: "Active" },
  error: { horizontal: " - Error", vertical: "Error" },
  incomplete: { horizontal: "", vertical: null },
}

function ProgressIndicatorMarkerIcon({
  status,
}: {
  status: ProgressIndicatorStatus
}) {
  if (status === "complete") {
    // A filled circle with the check cut out in the marker's surface.
    return (
      <CircleCheckIcon
        aria-hidden="true"
        className="size-3.5 fill-current [&_path]:stroke-(--marker-surface)"
      />
    )
  }
  if (status === "error") {
    // Flipped so the slash runs from bottom left to top right.
    return (
      <BanIcon
        aria-hidden="true"
        strokeWidth={2.75}
        className="size-3.5 -scale-x-100"
      />
    )
  }
  return null
}

function ProgressIndicatorStep({
  label,
  error = false,
  disabled = false,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & {
  /** The step's name: the marker's tooltip and name, or the text beside a vertical marker. */
  label: React.ReactNode
  /** Marks the step as having an error, wherever it is. */
  error?: boolean
  /** Keeps people from selecting the step. */
  disabled?: boolean
}) {
  const { orientation, value, onValueChange, selectAhead } =
    useProgressIndicator()
  const index = React.useContext(ProgressIndicatorStepIndex)
  const current = index === value
  const status: ProgressIndicatorStatus = error
    ? "error"
    : index < value
      ? "complete"
      : current
        ? "current"
        : "incomplete"

  if (orientation === "vertical") {
    const word = stateWords[status].vertical
    return (
      <li
        data-slot="progress-indicator-step"
        data-status={status}
        aria-current={current ? "step" : undefined}
        className={cn(
          "relative flex items-center p-0",
          "before:absolute before:start-[calc(0.5rem-1px)] before:top-0 before:bottom-1/2 before:w-0.5 before:bg-(--neutral) before:content-['']",
          "after:absolute after:start-[calc(0.5rem-1px)] after:top-1/2 after:bottom-0 after:w-0.5 after:bg-(--neutral) after:content-['']",
          "first:before:hidden last:after:hidden",
          lineClasses[status],
          className
        )}
        {...props}
      >
        <span
          data-slot="progress-indicator-marker"
          className={cn(markerVariants({ status, orientation }))}
        >
          <ProgressIndicatorMarkerIcon status={status} />
          {word && <span className="sr-only">{word}</span>}
        </span>
        {children ?? (
          <ProgressIndicatorContent>{label}</ProgressIndicatorContent>
        )}
      </li>
    )
  }

  const interactive = onValueChange !== undefined
  const selectable =
    interactive && !disabled && !current && (index < value || selectAhead)
  const unavailable = disabled || (interactive && !current && !selectable)

  return (
    <li
      data-slot="progress-indicator-step"
      data-status={status}
      aria-current={current ? "step" : undefined}
      className={cn("inline-flex self-center", className)}
      {...props}
    >
      <Tooltip>
        {/* aria-disabled, not disabled, so the tooltip still opens on hover. */}
        <TooltipTrigger
          type="button"
          aria-disabled={unavailable || undefined}
          className={cn(
            markerVariants({ status, orientation }),
            selectable && "cursor-pointer"
          )}
          onClick={() => {
            if (selectable) onValueChange?.(index)
          }}
        >
          <ProgressIndicatorMarkerIcon status={status} />
          <span className="sr-only">
            {label}
            {stateWords[status].horizontal}
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </li>
  )
}

function ProgressIndicatorContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="progress-indicator-content"
      className={cn(
        "mt-3 flex flex-1 items-center justify-between pb-3",
        className
      )}
      {...props}
    />
  )
}

export {
  ProgressIndicator,
  ProgressIndicatorContent,
  ProgressIndicatorStep,
  progressIndicatorVariants,
}
