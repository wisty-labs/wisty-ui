"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type VisualPickerContextValue = {
  type: "single" | "multiple"
  name: string
  size: "small" | "medium" | "large"
  variant: "default" | "vertical"
  disabled: boolean
  required: boolean
  invalid: React.AriaAttributes["aria-invalid"]
  form?: string
  isChecked: (value: string) => boolean
  setChecked: (value: string, checked: boolean) => void
}

const VisualPickerContext =
  React.createContext<VisualPickerContextValue | null>(null)

function useVisualPickerContext(part: string) {
  const context = React.useContext(VisualPickerContext)
  if (!context) throw new Error(`${part} must be used inside <VisualPicker>.`)
  return context
}

const visualPickerVariants = cva("flex", {
  variants: {
    variant: {
      default: "flex-wrap gap-x-4",
      vertical: "flex-col gap-4",
    },
    // The cards' size; read by VisualPickerFigure and VisualPickerBody.
    size: {
      small: "",
      medium: "",
      large: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "medium",
  },
})

type VisualPickerProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "role"
> &
  VariantProps<typeof visualPickerVariants> & {
    /** The inputs' name, to submit the choice with a form. Generated when not given, so the radios still form one group. */
    name?: string
    /** Disables every card. */
    disabled?: boolean
    /** A choice must be made before the form submits: one card, or at least one with `type="multiple"`. */
    required?: boolean
    /** The id of a form the inputs belong to, outside it. */
    form?: string
    /** Set on every input, for a field with an error. */
    "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  } & (
    | {
        /** Choose one card: radios. */
        type?: "single"
        /** The chosen card's value, controlled. `null` for none. */
        value?: string | null
        defaultValue?: string
        onValueChange?: (value: string) => void
      }
    | {
        /** Choose any number of cards: checkboxes. */
        type: "multiple"
        /** The chosen cards' values, controlled. */
        value?: readonly string[]
        defaultValue?: readonly string[]
        onValueChange?: (value: string[]) => void
      }
  )

// A single picker's value or a multiple one's list, as a list.
function toList(value: string | readonly string[] | null | undefined) {
  return value == null ? [] : typeof value === "string" ? [value] : [...value]
}

function VisualPicker({
  className,
  type = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  required = false,
  form,
  size,
  variant,
  "aria-invalid": invalid,
  ...props
}: VisualPickerProps) {
  const generatedName = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(() =>
    toList(defaultValue)
  )
  const controlled = valueProp !== undefined
  const selected = controlled ? toList(valueProp) : uncontrolled

  function setChecked(value: string, checked: boolean) {
    if (type === "single") {
      if (!checked) return
      if (!controlled) setUncontrolled([value])
      ;(onValueChange as ((value: string) => void) | undefined)?.(value)
      return
    }
    const next = checked
      ? [...selected.filter((item) => item !== value), value]
      : selected.filter((item) => item !== value)
    if (!controlled) setUncontrolled(next)
    ;(onValueChange as ((value: string[]) => void) | undefined)?.(next)
  }

  const resolvedSize = size ?? "medium"
  const resolvedVariant = variant ?? "default"

  return (
    <VisualPickerContext.Provider
      value={{
        type,
        name: name ?? generatedName,
        size: resolvedSize,
        variant: resolvedVariant,
        disabled,
        // A checkbox group is required while nothing in it is chosen.
        required: required && (type === "single" || selected.length === 0),
        invalid,
        form,
        isChecked: (value) => selected.includes(value),
        setChecked,
      }}
    >
      <div
        role={type === "single" ? "radiogroup" : "group"}
        aria-required={type === "single" && required ? true : undefined}
        data-slot="visual-picker"
        data-type={type}
        data-size={resolvedSize}
        data-variant={resolvedVariant}
        data-disabled={disabled || undefined}
        className={cn(visualPickerVariants({ variant, size }), className)}
        {...props}
      />
    </VisualPickerContext.Provider>
  )
}

function VisualPickerItem({
  className,
  value,
  disabled = false,
  id,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "id"> & {
  /** The value this card stands for, submitted with the form. */
  value: string
  /** Disables this card alone. */
  disabled?: boolean
  /** The input's id. Generated when not given. */
  id?: string
}) {
  const context = useVisualPickerContext("VisualPickerItem")
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const checked = context.isChecked(value)

  return (
    <div
      data-slot="visual-picker-item"
      className={cn(
        "group/visual-picker-item relative inline-flex flex-col text-center",
        context.variant === "vertical" && "flex w-100 max-w-full",
        className
      )}
      {...props}
    >
      <input
        id={inputId}
        type={context.type === "single" ? "radio" : "checkbox"}
        data-slot="visual-picker-input"
        name={context.name}
        value={value}
        checked={checked}
        disabled={context.disabled || disabled}
        required={context.required}
        form={context.form}
        aria-invalid={context.invalid}
        className="sr-only"
        onChange={(event) => context.setChecked(value, event.target.checked)}
      />
      <label
        htmlFor={inputId}
        data-slot="visual-picker-label"
        className="flex cursor-pointer flex-col group-has-[>input:disabled]/visual-picker-item:cursor-not-allowed"
      >
        {children}
      </label>
    </div>
  )
}

// Hover and :active draw the checked border and ring; keyboard focus keeps
// its own ring under the pointer.
const figureVariants = cva(
  [
    "group/visual-picker-figure relative flex flex-col items-center justify-center rounded-(--radius-2) border border-border bg-background font-normal shadow-(--visual-picker-shadow)",
    "group-hover/visual-picker-item:group-has-[>input:enabled]/visual-picker-item:border-(--visual-picker-accent) group-hover/visual-picker-item:group-has-[>input:enabled:not(:focus-visible)]/visual-picker-item:shadow-(--visual-picker-shadow-selected)",
    "group-active/visual-picker-item:group-has-[>input:enabled]/visual-picker-item:border-(--visual-picker-accent) group-active/visual-picker-item:group-has-[>input:enabled:not(:focus-visible)]/visual-picker-item:shadow-(--visual-picker-shadow-selected)",
    "group-has-[>input:enabled:checked]/visual-picker-item:border-(--visual-picker-accent) group-has-[>input:enabled:checked]/visual-picker-item:has-[[data-slot=visual-picker-icon]]:bg-(--visual-picker-accent) group-has-[>input:enabled:checked:not(:focus-visible)]/visual-picker-item:not-has-[[data-slot=visual-picker-icon]]:shadow-(--visual-picker-shadow-selected)",
    "group-has-[>input:focus-visible]/visual-picker-item:border-(--visual-picker-accent) group-has-[>input:focus-visible]/visual-picker-item:shadow-(--shadow-focus-outset)",
    "group-has-[>input:disabled]/visual-picker-item:border-(--visual-picker-disabled) group-has-[>input:disabled]/visual-picker-item:bg-(--disabled-container-strong) group-has-[>input:disabled]/visual-picker-item:text-(--disabled-strong) group-has-[>input:disabled]/visual-picker-item:shadow-none",
  ],
  {
    variants: {
      size: {
        small: "size-34",
        medium: "size-48",
        large: "size-60",
      },
      variant: {
        default: "",
        // A minimum height, not a fixed one, so longer text stays inside the border.
        vertical: "min-h-24 w-full items-stretch p-4 text-start",
      },
    },
  }
)

function VisualPickerFigure({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const context = useVisualPickerContext("VisualPickerFigure")

  return (
    <span
      data-slot="visual-picker-figure"
      className={cn(
        figureVariants({
          size: context.variant === "vertical" ? null : context.size,
          variant: context.variant,
        }),
        className
      )}
      {...props}
    >
      {/* A text card's check: a triangle over the top-end corner. */}
      <span
        data-slot="visual-picker-check"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -end-px -top-px hidden size-8 group-not-has-[[data-slot=visual-picker-icon]]/visual-picker-figure:group-has-[>input:checked]/visual-picker-item:block",
          "before:absolute before:inset-0 before:rounded-se-(--radius-2) before:border-[1rem] before:border-transparent before:border-e-(--visual-picker-accent) before:border-t-(--visual-picker-accent)",
          "group-has-[>input:disabled]/visual-picker-item:before:border-e-(--visual-picker-disabled) group-has-[>input:disabled]/visual-picker-item:before:border-t-(--visual-picker-disabled)"
        )}
      >
        <CheckIcon className="absolute end-0.5 top-[0.1rem] size-4 text-(--visual-picker-check)" />
      </span>
      {children}
    </span>
  )
}

function VisualPickerIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="visual-picker-icon"
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center text-(--icon-foreground) group-has-[>input:disabled]/visual-picker-item:text-(--disabled-strong) [&_svg:not([class*='size-'])]:size-12",
        className
      )}
      {...props}
    >
      <span className="flex group-has-[>input:checked]/visual-picker-item:hidden">
        {children}
      </span>
      <CheckIcon className="hidden text-(--visual-picker-check) group-has-[>input:checked]/visual-picker-item:block" />
    </span>
  )
}

const bodyVariants = cva(
  "flex flex-col px-2 py-4 group-has-[>input:disabled]/visual-picker-item:text-(--disabled-strong)",
  {
    variants: {
      size: {
        small: "w-34",
        medium: "w-48",
        large: "w-60",
      },
      variant: {
        default: "",
        vertical: "w-full text-start",
      },
    },
  }
)

function VisualPickerBody({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const context = useVisualPickerContext("VisualPickerBody")

  return (
    <span
      data-slot="visual-picker-body"
      className={cn(
        bodyVariants({
          size: context.variant === "vertical" ? null : context.size,
          variant: context.variant,
        }),
        className
      )}
      {...props}
    />
  )
}

function VisualPickerTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="visual-picker-title"
      className={cn(
        "block text-(length:--visual-picker-title-size) leading-(--visual-picker-line-height) in-data-[slot=visual-picker-figure]:text-(length:--visual-picker-title-size-figure) in-data-[slot=visual-picker-figure]:not-last:mb-2",
        className
      )}
      {...props}
    />
  )
}

function VisualPickerDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  // A disabled card dims the description only inside the card.
  return (
    <span
      data-slot="visual-picker-description"
      className={cn(
        "block text-(length:--visual-picker-description-size) leading-(--visual-picker-line-height) text-muted-foreground group-has-[>input:disabled]/visual-picker-item:in-data-[slot=visual-picker-figure]:text-(--disabled-strong)",
        className
      )}
      {...props}
    />
  )
}

export {
  VisualPicker,
  VisualPickerBody,
  VisualPickerDescription,
  VisualPickerFigure,
  VisualPickerIcon,
  VisualPickerItem,
  VisualPickerTitle,
  visualPickerVariants,
}
