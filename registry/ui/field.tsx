"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-2 has-[>[data-slot=checkbox-group]]:gap-1 has-[>[data-slot=radio-group]]:gap-1",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1 text-(length:--field-legend-size) font-(--field-legend-weight) data-[variant=label]:mb-(--label-gap) data-[variant=label]:text-(--label-foreground)",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-2 data-[slot=checkbox-group]:gap-0.5 *:data-[slot=field-group]:gap-2",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-(--label-gap)", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center gap-2 has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col @md/field-group:gap-2 *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
    layout: {
      stacked: "",
      horizontal: "",
      auto: "",
    },
  },
  // layout applies to a vertical field only; a horizontal orientation already
  // puts the control beside its label.
  compoundVariants: [
    {
      orientation: "vertical",
      layout: "horizontal",
      className:
        "px-(--field-horizontal-spacing-inline) py-(--field-horizontal-spacing-block) md:grid md:grid-cols-[calc(33%-1.25rem)_minmax(0,1fr)] md:items-start md:gap-x-5 md:*:col-start-2 md:*:data-[slot=field-label]:col-start-1 md:*:data-[slot=field-label]:max-w-full md:*:data-[slot=field-label]:hyphens-auto md:*:data-[slot=field-label]:wrap-anywhere",
    },
    {
      orientation: "vertical",
      layout: "auto",
      className:
        "compact:px-(--field-horizontal-spacing-inline) compact:py-(--field-horizontal-spacing-block) compact:md:grid compact:md:grid-cols-[calc(33%-1.25rem)_minmax(0,1fr)] compact:md:items-start compact:md:gap-x-5 compact:md:*:col-start-2 compact:md:*:data-[slot=field-label]:col-start-1 compact:md:*:data-[slot=field-label]:max-w-full compact:md:*:data-[slot=field-label]:hyphens-auto compact:md:*:data-[slot=field-label]:wrap-anywhere",
    },
  ],
  defaultVariants: {
    orientation: "vertical",
    layout: "stacked",
  },
})

function Field({
  className,
  orientation = "vertical",
  layout = "stacked",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      data-layout={layout}
      className={cn(fieldVariants({ orientation, layout }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 group-data-[orientation=horizontal]/field:font-normal group-data-[orientation=vertical]/field:pt-1 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border has-[>[data-slot=field]]:font-normal has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-muted has-[>[data-slot=field]]:has-[:focus-visible]:shadow-(--shadow-focus) has-data-checked:border-primary has-data-checked:bg-selected *:data-[slot=field]:p-3",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-(length:--label-font-size) leading-snug font-(--label-font-weight) text-(--label-foreground)",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-start text-(length:--field-description-size) leading-(--line-height-base) font-normal text-(--field-description-foreground) group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1",
        "last:mt-0",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-1 h-5 text-(length:--field-description-size) group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "text-(length:--field-description-size) font-normal text-destructive",
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
