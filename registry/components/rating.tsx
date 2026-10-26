"use client"

import * as React from "react"
import { StarIcon, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type RatingContextValue = {
  setLabelsId: (id: string | undefined) => void
}

const RatingContext = React.createContext<RatingContextValue | null>(null)

function useRatingContext(part: string) {
  const context = React.useContext(RatingContext)
  if (!context) throw new Error(`${part} must be used inside <Rating>.`)
  return context
}

// An icon fills up to the chosen one, and the one under a press fills too.
const itemClassName = cn(
  "group/rating-item relative flex text-(--icon-foreground) fill-transparent [--rating-accent:var(--primary)]",
  "[&:is(:has(>input:checked),:has(~*>input:checked))]:fill-(--rating-accent) [&:is(:has(>input:checked),:has(~*>input:checked))]:text-(--rating-accent)",
  "[&:has(>input:enabled):active]:fill-(--rating-accent) [&:has(>input:enabled):active]:text-(--rating-accent)",
  "has-[>input:disabled]:text-(--disabled-strong) has-[>input:disabled]:[--rating-accent:var(--disabled-strong)]"
)

type RatingProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "role"
> & {
  /** The chosen score, "1" to `max`, controlled. `null` for none. */
  value?: string | null
  /** The score chosen at first, when uncontrolled. */
  defaultValue?: string
  /** Called with the chosen score when someone picks an icon. */
  onValueChange?: (value: string) => void
  /** How many icons, and the highest score. A whole number of 1 or more. */
  max?: number
  /** The icon to repeat, from lucide-react. */
  icon?: LucideIcon
  /** The inputs' name, to submit the score with a form. Generated when not given. */
  name?: string
  /** Disables every icon. */
  disabled?: boolean
  /** A score must be chosen before the form submits. */
  required?: boolean
  /** The id of a form the inputs belong to, outside it. */
  form?: string
}

/** A score from 1 to max, picked from a row of icons that fill up to the chosen one. */
function Rating({
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  max = 5,
  icon: Icon = StarIcon,
  name,
  disabled = false,
  required = false,
  form,
  "aria-describedby": describedBy,
  children,
  ...props
}: RatingProps) {
  if (!Number.isInteger(max) || max < 1)
    throw new Error(
      `Rating's max must be a whole number of 1 or more, not ${max}.`
    )

  const generatedName = React.useId()
  const generatedId = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? null)
  const [labelsId, setLabelsId] = React.useState<string>()
  const value = valueProp !== undefined ? valueProp : uncontrolled

  function choose(next: string) {
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  const scores = Array.from({ length: max }, (_, index) => String(index + 1))

  return (
    <RatingContext.Provider value={{ setLabelsId }}>
      <div
        role="radiogroup"
        aria-required={required || undefined}
        aria-describedby={
          [describedBy, labelsId].filter(Boolean).join(" ") || undefined
        }
        data-slot="rating"
        data-disabled={disabled || undefined}
        className={cn("flex w-fit flex-col gap-1", className)}
        {...props}
      >
        <div data-slot="rating-items" className="flex">
          {scores.map((score) => (
            <span key={score} data-slot="rating-item" className={itemClassName}>
              <input
                id={`${generatedId}-${score}`}
                type="radio"
                data-slot="rating-input"
                name={name ?? generatedName}
                value={score}
                checked={value === score}
                disabled={disabled}
                required={required}
                form={form}
                aria-label={`${score} of ${max}`}
                className="sr-only"
                onChange={() => choose(score)}
              />
              <label
                htmlFor={`${generatedId}-${score}`}
                data-slot="rating-item-label"
                className="flex cursor-pointer px-0.5 group-has-[>input:disabled]/rating-item:cursor-not-allowed"
              >
                <Icon
                  aria-hidden="true"
                  className="size-8 rounded-(--radius-2) fill-[inherit] transition-[fill,color] duration-300 ease-[ease] group-has-[>input:focus-visible]/rating-item:shadow-(--shadow-focus-outset)"
                />
              </label>
            </span>
          ))}
        </div>
        {children}
      </div>
    </RatingContext.Provider>
  )
}

function RatingLabels({
  className,
  id,
  ...props
}: Omit<React.ComponentProps<"div">, "ref">) {
  const { setLabelsId } = useRatingContext("RatingLabels")
  const generatedId = React.useId()
  const labelsId = id ?? generatedId
  // The group reads the labels as its description while they're mounted.
  const register = React.useCallback(() => {
    setLabelsId(labelsId)
    return () => setLabelsId(undefined)
  }, [labelsId, setLabelsId])

  return (
    <div
      ref={register}
      id={labelsId}
      data-slot="rating-labels"
      className={cn(
        "flex w-0 min-w-full gap-4 text-(length:--field-description-size) leading-(--line-height-base) text-(--field-description-foreground)",
        className
      )}
      {...props}
    />
  )
}

function RatingLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="rating-label"
      className={cn(
        "min-w-0 flex-1 not-first:last:text-end not-first:not-last:text-center",
        className
      )}
      {...props}
    />
  )
}

export { Rating, RatingLabel, RatingLabels }
