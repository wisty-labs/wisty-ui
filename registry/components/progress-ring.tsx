import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { BanIcon, CheckIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const progressRingVariants = cva(
  "relative inline-block shrink-0 rounded-full bg-(--progress-track) [--ring-content:var(--background)]",
  {
    variants: {
      variant: {
        base: "[--ring-fill:var(--chart-positive)]",
        "base-autocomplete": "[--ring-fill:var(--chart-positive)]",
        "active-step": "[--ring-fill:var(--progress-ring-active-step)]",
        warning: "[--ring-fill:var(--chart-warning)]",
        expired: "[--ring-fill:var(--chart-negative)]",
        complete:
          "[--ring-content:var(--chart-positive)] [--ring-fill:var(--chart-positive)]",
      },
      size: {
        medium: "size-6",
        large: "size-8",
      },
    },
    defaultVariants: {
      variant: "base",
      size: "medium",
    },
  }
)

type ProgressRingVariant = NonNullable<
  VariantProps<typeof progressRingVariants>["variant"]
>

const iconWords: Partial<Record<ProgressRingVariant, string>> = {
  warning: "Warning",
  expired: "Expired",
  complete: "Complete",
}

// The pie slice from 12 o'clock: a drain sweeps one way to the value's
// angle, a fill the other way to 100 minus it.
function progressRingArc(percent: number, direction: "fill" | "drain") {
  const filling = direction === "fill"
  const turn = (filling ? 100 - percent : percent) / 100
  const x = Math.cos(2 * Math.PI * turn)
  const y = Math.sin(2 * Math.PI * turn)
  const large = percent > 50 ? 1 : 0
  const sweep = filling ? 0 : 1
  return { d: `M 1 0 A 1 1 0 ${large} ${sweep} ${x} ${y} L 0 0`, x, y }
}

type ProgressRingLabel =
  | {
      /** Names what the ring measures, like "Upload progress". */
      "aria-label": string
      "aria-labelledby"?: string
    }
  | {
      "aria-label"?: string
      /** The id of visible text that names what the ring measures. */
      "aria-labelledby": string
    }

function ProgressRing({
  value,
  direction = "fill",
  variant = "base",
  size = "medium",
  iconLabel,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: Omit<
  React.ComponentProps<"div">,
  | "role"
  | "aria-valuenow"
  | "aria-valuemin"
  | "aria-valuemax"
  | "aria-valuetext"
> &
  VariantProps<typeof progressRingVariants> &
  ProgressRingLabel & {
    /** How much is done, from 0 to 100. Clamped. null when it isn't known. */
    value: number | null
    /** fill grows the ring clockwise; drain empties it counterclockwise. */
    direction?: "fill" | "drain"
    /** Replaces the icon's hidden word ("Warning", "Expired", "Complete"). */
    iconLabel?: string
    /** A step number or one glyph inside the ring. Not shown with an icon. */
    children?: React.ReactNode
  }) {
  const percent =
    value === null || !Number.isFinite(value)
      ? null
      : Math.min(Math.max(value, 0), 100)
  const look: ProgressRingVariant =
    variant === "base-autocomplete" && percent === 100
      ? "complete"
      : (variant ?? "base")
  const word = iconWords[look]
  const arc =
    percent !== null && percent > 0 && percent < 100
      ? progressRingArc(percent, direction)
      : null

  return (
    <div
      data-slot="progress-ring"
      data-variant={look}
      data-size={size}
      className={cn(progressRingVariants({ variant: look, size }), className)}
      {...props}
    >
      <div
        data-slot="progress-ring-progress"
        role="progressbar"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
        className="absolute inset-0 [transform:scale(-1,1)_rotate(-90deg)]"
      >
        <svg viewBox="-1 -1 2 2" aria-hidden="true" className="block size-full">
          {/* At 100 the arc's ends would meet and SVG draws nothing. */}
          {percent === 100 ? (
            <circle
              data-slot="progress-ring-path"
              cx="0"
              cy="0"
              r="1"
              className="fill-(--ring-fill)"
            />
          ) : arc ? (
            <path
              data-slot="progress-ring-path"
              d={arc.d}
              className="fill-(--ring-fill)"
            />
          ) : null}
        </svg>
      </div>
      <div
        data-slot="progress-ring-content"
        className={cn(
          "absolute inset-[0.1875rem] flex items-center justify-center rounded-full bg-(--ring-content) font-(--progress-ring-content-weight)",
          size === "large"
            ? "text-(length:--progress-ring-content-size-large)"
            : "text-(length:--progress-ring-content-size)",
          "leading-none"
        )}
      >
        {word ? (
          <>
            <ProgressRingIcon variant={look} size={size} />
            <span className="sr-only">{iconLabel ?? word}</span>
          </>
        ) : (
          children
        )}
      </div>
      {arc && (
        <div
          data-slot="progress-ring-head"
          aria-hidden="true"
          className="absolute -inset-[0.1875rem] [transform:scale(-1,1)_rotate(-90deg)]"
        >
          <svg viewBox="-1 -1 2 2" className="block size-full">
            <circle
              cx={0.7 * arc.x}
              cy={0.7 * arc.y}
              r="0.2"
              className="fill-(--ring-fill)"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

function ProgressRingIcon({
  variant,
  size,
}: {
  variant: ProgressRingVariant
  size: "medium" | "large" | null
}) {
  const sizeClass = size === "large" ? "size-4" : "size-3"
  if (variant === "warning") {
    // A filled triangle with the exclamation mark cut out in the content's
    // color.
    return (
      <TriangleAlertIcon
        aria-hidden="true"
        className={cn(
          sizeClass,
          "fill-current text-(--ring-fill) [&_path:not(:first-child)]:stroke-(--ring-content)"
        )}
      />
    )
  }
  if (variant === "expired") {
    return (
      <BanIcon
        aria-hidden="true"
        strokeWidth={2.75}
        className={cn(sizeClass, "-scale-x-100 text-(--ring-fill)")}
      />
    )
  }
  return (
    <CheckIcon
      aria-hidden="true"
      strokeWidth={3}
      className={cn(sizeClass, "text-(--background)")}
    />
  )
}

export { ProgressRing, progressRingVariants }
