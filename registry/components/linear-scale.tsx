"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type LinearScaleTone = "error" | "warning" | "success"

type LinearScaleBand = {
  /** The band's first number, included. */
  from: number
  /** The band's last number, included. */
  to: number
  /** The band's color, as a strip over each of its numbers. */
  tone: LinearScaleTone
}

type LinearScaleContextValue = {
  setLabelsId: (id: string | undefined) => void
}

const LinearScaleContext = React.createContext<LinearScaleContextValue | null>(
  null
)

function useLinearScaleContext(part: string) {
  const context = React.useContext(LinearScaleContext)
  if (!context) throw new Error(`${part} must be used inside <LinearScale>.`)
  return context
}

function scaleOptions(min: number, max: number) {
  if (!Number.isInteger(min) || !Number.isInteger(max))
    throw new Error(
      `LinearScale needs whole numbers for min and max, got ${min} and ${max}.`
    )
  if (max < min)
    throw new Error(`LinearScale's max (${max}) is below its min (${min}).`)
  return Array.from({ length: max - min + 1 }, (_, index) =>
    String(min + index)
  )
}

function bandTones(
  bands: readonly LinearScaleBand[],
  min: number,
  max: number
) {
  const tones = new Map<string, LinearScaleTone>()
  for (const { from, to, tone } of bands) {
    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      from > to ||
      from < min ||
      to > max
    )
      throw new Error(
        `LinearScale's band ${from} to ${to} needs whole numbers from ${min} to ${max}, in order.`
      )
    for (let number = from; number <= to; number++) {
      if (tones.has(String(number)))
        throw new Error(`LinearScale's bands overlap at ${number}.`)
      tones.set(String(number), tone)
    }
  }
  return tones
}

const item =
  "group/linear-scale-item relative flex not-first:-ms-px has-[>input:focus-visible]:z-10 data-[tone=error]:[--linear-scale-band:var(--chart-negative)] data-[tone=success]:[--linear-scale-band:var(--chart-positive)] data-[tone=warning]:[--linear-scale-band:var(--chart-warning)]"

const itemLabel = cn(
  "relative inline-flex h-(--control-height) w-full cursor-pointer items-center justify-center overflow-hidden rounded-(--button-radius) border border-border-strong bg-background px-2 font-(--button-font-weight) text-(length:--font-size-base) leading-none whitespace-nowrap text-link tabular-nums transition-[transform,box-shadow] duration-150 ease-in-out select-none group-not-first/linear-scale-item:rounded-s-none group-not-last/linear-scale-item:rounded-e-none active:shadow-(--button-shadow-active)",
  "peer-not-checked:hover:bg-secondary peer-not-checked:hover:text-(--button-foreground-hover) peer-not-checked:hover:not-active:[transform:var(--button-bordered-transform-hover)] peer-not-checked:peer-not-focus-visible:hover:not-active:shadow-(--button-bordered-shadow-hover) peer-not-checked:active:bg-secondary peer-not-checked:active:text-primary-active",
  "peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:hover:border-t-primary-hover peer-checked:hover:border-b-primary-active peer-checked:hover:bg-primary-hover peer-checked:hover:text-(--button-brand-foreground-hover) peer-checked:peer-not-focus-visible:hover:not-active:shadow-(--button-brand-shadow-hover) peer-checked:peer-not-focus-visible:hover:not-active:[transform:var(--button-brand-transform-hover)]",
  "peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-1 peer-focus-visible:outline-ring peer-focus-visible:outline-solid peer-not-checked:peer-focus-visible:bg-secondary peer-checked:peer-focus-visible:bg-primary-hover peer-checked:peer-focus-visible:text-(--button-brand-foreground-hover) peer-checked:peer-focus-visible:shadow-[inset_0_0_0_3px_var(--button-group-inset)]",
  "peer-disabled:pointer-events-none peer-disabled:shadow-none peer-not-checked:peer-disabled:bg-disabled-container peer-not-checked:peer-disabled:text-disabled-strong peer-checked:peer-disabled:bg-disabled-container-strong peer-checked:peer-disabled:text-disabled-strong",
  "group-data-tone/linear-scale-item:before:absolute group-data-tone/linear-scale-item:before:inset-x-0 group-data-tone/linear-scale-item:before:top-0 group-data-tone/linear-scale-item:before:h-1 group-data-tone/linear-scale-item:before:bg-(--linear-scale-band) peer-disabled:group-data-tone/linear-scale-item:before:bg-disabled-border"
)

type LinearScaleProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "role"
> & {
  /** The first number on the scale, a whole number. */
  min?: number
  /** The last number on the scale, a whole number, no lower than `min`. */
  max?: number
  /** Colored ranges of numbers. Numbers outside every band keep the plain look. */
  bands?: readonly LinearScaleBand[]
  /** The chosen number as a string, controlled. `null` for none. */
  value?: string | null
  /** The number chosen at first, uncontrolled. */
  defaultValue?: string
  /** Called with the chosen number as a string. */
  onValueChange?: (value: string) => void
  /** The radios' name, to submit the choice with a form. Generated when not given. */
  name?: string
  /** Disables every number. */
  disabled?: boolean
  /** A number must be chosen before the form submits. */
  required?: boolean
  /** The id of a form the radios belong to, outside it. */
  form?: string
}

/** A row of whole numbers to choose one from, like a 0 to 10 likelihood score. */
function LinearScale({
  className,
  min = 0,
  max = 10,
  bands = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  required = false,
  form,
  "aria-describedby": describedBy,
  children,
  ...props
}: LinearScaleProps) {
  const id = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? null)
  const [labelsId, setLabelsId] = React.useState<string>()
  const checkedValue = valueProp !== undefined ? valueProp : uncontrolled
  const options = scaleOptions(min, max)
  const tones = bandTones(bands, min, max)

  function choose(next: string) {
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <LinearScaleContext.Provider value={{ setLabelsId }}>
      <div
        role="radiogroup"
        aria-required={required || undefined}
        aria-describedby={
          [describedBy, labelsId].filter(Boolean).join(" ") || undefined
        }
        data-slot="linear-scale"
        data-disabled={disabled || undefined}
        className={cn(
          "-m-1 overflow-x-auto p-1 contain-inline-size",
          className
        )}
        {...props}
      >
        <div className="flex w-max flex-col gap-1">
          <div className="grid auto-cols-[minmax(var(--control-height),1fr)] grid-flow-col">
            {options.map((option) => (
              <div
                key={option}
                data-slot="linear-scale-item"
                data-tone={tones.get(option)}
                className={item}
              >
                {/* The radio covers its number, so focusing it scrolls the whole number into view. */}
                <input
                  id={`${id}-${option}`}
                  type="radio"
                  data-slot="linear-scale-input"
                  name={name ?? id}
                  value={option}
                  checked={option === checkedValue}
                  disabled={disabled}
                  required={required}
                  form={form}
                  className="peer pointer-events-none absolute inset-0 m-0 appearance-none opacity-0"
                  onChange={() => choose(option)}
                />
                <label
                  htmlFor={`${id}-${option}`}
                  data-slot="linear-scale-item-label"
                  className={itemLabel}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </LinearScaleContext.Provider>
  )
}

function LinearScaleLabels({
  className,
  id,
  ...props
}: Omit<React.ComponentProps<"div">, "ref">) {
  const { setLabelsId } = useLinearScaleContext("LinearScaleLabels")
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
      data-slot="linear-scale-labels"
      className={cn(
        "flex w-0 min-w-full gap-4 text-(length:--field-description-size) leading-(--line-height-base) text-(--field-description-foreground)",
        className
      )}
      {...props}
    />
  )
}

function LinearScaleLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="linear-scale-label"
      className={cn(
        "min-w-0 flex-1 not-first:last:text-end not-first:not-last:text-center",
        className
      )}
      {...props}
    />
  )
}

export {
  LinearScale,
  LinearScaleLabel,
  LinearScaleLabels,
  type LinearScaleBand,
  type LinearScaleProps,
}
