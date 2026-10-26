"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type PathStepLook =
  | "incomplete"
  | "complete"
  | "current"
  | "current-first"
  | "active"
  | "won"
  | "lost"

// Background of the item and its halves, link color, and hover.
const looks: Record<PathStepLook, string> = {
  incomplete:
    "[--path-bg:var(--path-incomplete)] [--path-fg:var(--path-incomplete-foreground)] hover:[--path-bg:var(--path-incomplete-hover)]",
  complete:
    "[--path-bg:var(--path-complete)] [--path-fg:var(--path-complete-foreground)] hover:[--path-bg:var(--path-complete-hover)]",
  // The line around the item: the halves draw it with gradients. Hover moves
  // the gradients' stop, not their tile, which only makes the line solid.
  current:
    "[--path-bg:var(--background)] [--path-fg:var(--path-current-foreground)] [--path-line-width:var(--path-border-width)] [--path-line-stop:var(--path-border-width)] [--path-line:var(--path-current-border)] before:bg-no-repeat after:bg-no-repeat before:bg-[image:linear-gradient(90deg,var(--path-line),var(--path-line)_var(--path-line-stop),transparent_var(--path-line-stop)),linear-gradient(90deg,var(--path-line),var(--path-line)_var(--path-line-stop),transparent_var(--path-line-stop)),linear-gradient(var(--path-line),var(--path-line)_var(--path-line-stop),transparent_var(--path-line-stop))] after:bg-[image:linear-gradient(90deg,var(--path-line),var(--path-line)_var(--path-line-stop),transparent_var(--path-line-stop)),linear-gradient(90deg,var(--path-line),var(--path-line)_var(--path-line-stop),transparent_var(--path-line-stop)),linear-gradient(var(--path-line),var(--path-line)_var(--path-line-stop),transparent_var(--path-line-stop))] before:[background-size:var(--path-line-width)_100%,var(--path-line-width)_100%,100%_var(--path-line-width)] after:[background-size:var(--path-line-width)_100%,var(--path-line-width)_100%,100%_var(--path-line-width)] before:[background-position:top_right,top_left,top_left] after:[background-position:top_right,top_left,bottom_left] hover:[--path-line-stop:0.125rem] hover:[--path-line:var(--path-current-border-hover)]",
  // The first stage, current: the item has the line as a border, and the
  // halves only draw it on their end.
  "current-first":
    "[--path-bg:var(--background)] [--path-fg:var(--path-current-foreground)] [--path-line:var(--path-current-border)] border-(length:--path-border-width) border-e-0 border-solid border-(--path-line) before:-top-(--path-border-width) after:-bottom-(--path-border-width) before:bg-transparent after:bg-transparent before:bg-no-repeat after:bg-no-repeat before:bg-[image:linear-gradient(90deg,var(--path-line),var(--path-line)_var(--path-border-width),transparent_var(--path-border-width))] after:bg-[image:linear-gradient(90deg,var(--path-line),var(--path-line)_var(--path-border-width),transparent_var(--path-border-width))] before:[background-size:var(--path-border-width)_100%] after:[background-size:var(--path-border-width)_100%] before:[background-position:top_right] after:[background-position:top_right] hover:[--path-line:var(--path-current-border-hover)]",
  active:
    "[--path-bg:var(--path-active)] [--path-fg:var(--path-active-foreground)] hover:[--path-bg:var(--path-active-hover)]",
  won: "[--path-bg:var(--path-won)] [--path-fg:var(--path-complete-foreground)]",
  lost: "[--path-bg:var(--path-lost)] [--path-fg:var(--path-lost-foreground)]",
}

// A complete stage shows the check, and flips to the title on hover.
const flip =
  "transition-[transform] duration-200 ease-linear backface-hidden motion-reduce:transition-none"
const stageShown =
  "[transform:translate(-50%,-50%)_rotateX(0deg)] group-hover/path-item:[transform:translate(-50%,-50%)_rotateX(-180deg)]"
const stageHidden = "[transform:translate(-50%,-50%)_rotateX(-180deg)]"
// A selected stage's hidden check moves on Y only, so it stays put when selected.
const stageSelected = "[transform:translateY(-50%)_rotateX(-180deg)]"
const titleHidden =
  "[transform:rotateX(180deg)] group-hover/path-item:[transform:rotateX(0deg)]"

function Path({
  steps,
  current,
  value: valueProp,
  defaultValue,
  onValueChange,
  status,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** The stages, in order. */
  steps: { value: string; label: string }[]
  /** The stage the record is at. Earlier stages show as complete. */
  current: string
  /** The selected stage. Defaults to the current one. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Closes the path at the current stage as won or lost. */
  status?: "won" | "lost"
  /** Names the stages for screen readers, like "Lead status". */
  "aria-label": string
  /** The action area after the stages, usually a Button. */
  children?: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? current
  )
  const value = valueProp ?? uncontrolled
  const select = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }
  const currentIndex = steps.findIndex((step) => step.value === current)
  const selectedIndex = Math.max(
    0,
    steps.findIndex((step) => step.value === value)
  )

  const lookOf = (index: number): PathStepLook => {
    if (index === currentIndex && status) return status
    if (index === selectedIndex) return "active"
    if (index === currentIndex) return index === 0 ? "current-first" : "current"
    if (index < currentIndex && status !== "lost") return "complete"
    return "incomplete"
  }

  return (
    <div data-slot="path" className={cn("w-full", className)} {...props}>
      <div className="flex flex-wrap items-start lg:flex-nowrap lg:items-stretch">
        <div className="flex flex-1 basis-full overflow-hidden lg:basis-auto">
          <div className="max-w-full flex-1 overflow-hidden">
            <div
              data-slot="path-list"
              role="listbox"
              aria-label={ariaLabel}
              aria-orientation="horizontal"
              className="flex items-start overflow-hidden"
            >
              {steps.map((step, index) => {
                const look = lookOf(index)
                const selected = index === selectedIndex
                const assistive =
                  look === "complete"
                    ? "Stage Complete"
                    : index === currentIndex
                      ? "Current Stage:"
                      : null
                return (
                  <div
                    key={step.value}
                    data-slot="path-item"
                    role="presentation"
                    className={cn(
                      "group/path-item relative ms-1.5 me-[0.4375rem] min-w-20 flex-1 bg-(color:--path-bg) text-center",
                      "before:absolute before:-start-1 before:-end-[0.3125rem] before:top-0 before:h-[1.0313rem] before:cursor-pointer before:bg-(color:--path-bg) before:content-[''] before:[transform:skew(28deg)_translate3d(0,0,0)]",
                      "after:absolute after:-start-1 after:-end-[0.3125rem] after:bottom-0 after:h-4 after:cursor-pointer after:bg-(color:--path-bg) after:content-[''] after:[transform:skew(-30deg)_translate3d(0,0,0)]",
                      "rtl:before:[transform:skew(-30deg)_translate3d(0,0,0)] rtl:after:[transform:skew(28deg)_translate3d(0,0,0)]",
                      "first:ms-0 first:rounded-s-[2rem] first:ps-2.5 first:before:start-[1.125rem] first:after:start-[1.125rem]",
                      "last:me-0 last:rounded-e-[2rem] last:pe-2.5 last:before:end-2.5 last:after:end-2.5",
                      looks[look]
                    )}
                  >
                    <div
                      data-slot="path-step"
                      role="option"
                      aria-selected={selected}
                      tabIndex={selected ? 0 : -1}
                      className={cn(
                        "relative z-5 flex h-8 cursor-pointer items-center justify-center py-2 ps-2 pe-1 text-(--path-fg) outline-none focus-visible:shadow-(--shadow-focus-inset) group-last/path-item:ps-1",
                        look === "current-first" && "h-(--path-current-height)"
                      )}
                      onClick={() => select(step.value)}
                      onKeyDown={(event) => {
                        const to =
                          event.key === "ArrowRight"
                            ? index + 1
                            : event.key === "ArrowLeft"
                              ? index - 1
                              : null
                        if (to === null) return
                        event.preventDefault()
                        const target = steps[to]
                        if (!target) return
                        select(target.value)
                        const options =
                          event.currentTarget
                            .closest("[role=listbox]")
                            ?.querySelectorAll<HTMLElement>("[role=option]") ??
                          []
                        options[to]?.focus()
                      }}
                    >
                      <span
                        data-slot="path-stage"
                        className={cn(
                          "absolute top-1/2 left-1/2 block",
                          flip,
                          selected
                            ? stageSelected
                            : look === "complete"
                              ? stageShown
                              : stageHidden
                        )}
                      >
                        <CheckIcon
                          className="inline-flex size-4"
                          aria-hidden="true"
                        />
                        {assistive && (
                          <span className="sr-only">{assistive}</span>
                        )}
                      </span>
                      <span
                        data-slot="path-title"
                        className={cn(
                          "block max-w-full truncate [transform:translate3d(0,0,0)]",
                          flip,
                          look === "complete" && titleHidden
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {children !== undefined && (
          <div
            data-slot="path-action"
            className="ms-0 flex shrink-0 grow basis-full flex-col items-center *:data-[slot=button]:w-full *:data-[slot=button]:min-w-52 *:data-[slot=button]:justify-center *:data-[slot=button]:h-[1.875rem] *:data-[slot=button]:border-0 md:mt-4 md:flex-row md:justify-between md:*:data-[slot=button]:w-auto lg:mt-0 lg:ms-6 lg:grow-0 lg:basis-auto lg:items-[normal]"
          >
            <span
              data-slot="path-stage-name"
              className="my-3 block font-bold md:m-0 lg:hidden"
            >
              {`Stage: ${steps[selectedIndex]?.label ?? ""}`}
            </span>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export { Path }
