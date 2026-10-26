import * as React from "react"

import { cn } from "@/lib/utils"

type DynamicIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Says what's happening, like "Score is recalculating". Decorative without one. */
  label?: string
}

function DynamicIconRoot({
  label,
  className,
  children,
  ...props
}: DynamicIconProps & { children: React.ReactNode }) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      {children}
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}

function DynamicIconEllie({ className, ...props }: DynamicIconProps) {
  return (
    <DynamicIconRoot
      data-slot="dynamic-icon-ellie"
      className={cn(
        "size-3.5 motion-safe:animate-dynamic-icon-ellie-pop",
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 14 14" aria-hidden="true" className="block size-full">
        <circle
          cx="7"
          cy="7"
          r="4"
          className="fill-(--dynamic-icon-accent) stroke-(--dynamic-icon-accent) stroke-4 motion-safe:animate-dynamic-icon-ellie-outer"
        />
        <circle
          cx="7"
          cy="7"
          r="3"
          className="fill-(--dynamic-icon-on-accent) stroke-(--dynamic-icon-on-accent) stroke-1 motion-safe:animate-dynamic-icon-ellie-inner"
        />
      </svg>
    </DynamicIconRoot>
  )
}

function DynamicIconEq({
  playing = true,
  className,
  ...props
}: DynamicIconProps & {
  /** Bounces the bars. false stops them at rest. */
  playing?: boolean
}) {
  const bar = cn(
    "absolute bottom-0 w-1 origin-bottom bg-(--dynamic-icon-accent)",
    playing && "motion-safe:h-0.75 motion-safe:animate-dynamic-icon-eq"
  )
  return (
    <DynamicIconRoot
      data-slot="dynamic-icon-eq"
      data-playing={playing}
      className={cn("relative size-3.5", className)}
      {...props}
    >
      <span
        data-slot="dynamic-icon-eq-bar"
        className={cn(bar, "start-0 h-2.25")}
      />
      <span
        data-slot="dynamic-icon-eq-bar"
        className={cn(
          bar,
          "start-1.25 h-3.5 motion-safe:[animation-duration:0.65s]"
        )}
      />
      <span
        data-slot="dynamic-icon-eq-bar"
        className={cn(
          bar,
          "start-2.5 h-3 motion-safe:[animation-duration:0.35s]"
        )}
      />
    </DynamicIconRoot>
  )
}

function DynamicIconScore({
  value,
  className,
  ...props
}: DynamicIconProps & {
  /** positive draws a filled green dot, negative an empty red one. */
  value: "positive" | "negative"
}) {
  return (
    <DynamicIconRoot
      data-slot="dynamic-icon-score"
      data-value={value}
      className={cn("size-1.25", className)}
      {...props}
    >
      <svg viewBox="0 0 5 5" aria-hidden="true" className="block size-full">
        <circle
          cx="2.5"
          cy="2.5"
          r="1.875"
          className={cn(
            "stroke-[1.125] transition-[fill,stroke] duration-400 ease-in-out motion-reduce:transition-none",
            value === "positive"
              ? "fill-(--chart-positive) stroke-(--chart-positive)"
              : "fill-transparent stroke-(--chart-negative)"
          )}
        />
      </svg>
    </DynamicIconRoot>
  )
}

function DynamicIconStrength({
  value,
  className,
  ...props
}: DynamicIconProps & {
  /** How many of the three dots fill: green above 0, red below 0. */
  value: -3 | -2 | -1 | 0 | 1 | 2 | 3
}) {
  return (
    <DynamicIconRoot
      data-slot="dynamic-icon-strength"
      data-value={value}
      className={cn("h-1.75 w-6.75", className)}
      {...props}
    >
      <svg viewBox="0 0 27 7" aria-hidden="true" className="block size-full">
        {[3.5, 13.5, 23.5].map((cx, index) => (
          <circle
            key={cx}
            cx={cx}
            cy="3.5"
            r="3.025"
            className={cn(
              "stroke-[0.95] transition-[fill,stroke] duration-400 ease-in-out motion-reduce:transition-none",
              index >= Math.abs(value)
                ? "fill-transparent stroke-(--border-strong)"
                : value > 0
                  ? "fill-(--chart-positive) stroke-(--chart-positive)"
                  : "fill-(--error-container) stroke-(--chart-negative)"
            )}
          />
        ))}
      </svg>
    </DynamicIconRoot>
  )
}

const trendClasses = {
  up: "-rotate-45 text-(--chart-positive)",
  down: "rotate-45 text-(--chart-negative)",
  neutral: "text-muted-foreground",
}

function DynamicIconTrend({
  direction,
  className,
  ...props
}: DynamicIconProps & {
  /** Points the arrow: up in green, down in red, neutral straight ahead. */
  direction: "up" | "down" | "neutral"
}) {
  return (
    <DynamicIconRoot
      data-slot="dynamic-icon-trend"
      data-direction={direction}
      className={cn("size-4", trendClasses[direction], className)}
      {...props}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="block size-full fill-none stroke-current stroke-[1.125] [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <path
          d="M.75 8H11M8 4.5 11.5 8 8 11.5"
          className="[stroke-dasharray:39.175px] [stroke-dashoffset:0.1px] motion-safe:animate-dynamic-icon-trend-arrow"
        />
        {/* A ring with a gap just below the arrow's tail. */}
        <path
          d="M1.489 11.462A7.375 7.375 0 1 0 .635 7.614"
          className="[stroke-dasharray:42.34px_46.34px] motion-safe:animate-dynamic-icon-trend-ring"
        />
      </svg>
    </DynamicIconRoot>
  )
}

export {
  DynamicIconEllie,
  DynamicIconEq,
  DynamicIconScore,
  DynamicIconStrength,
  DynamicIconTrend,
}
