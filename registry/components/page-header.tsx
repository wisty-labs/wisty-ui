import * as React from "react"

import { cn } from "@/lib/utils"

function PageHeader({
  joined = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Draws no frame of its own, so the header and the list below it share one from the page. */
  joined?: boolean
}) {
  return (
    <div
      data-slot="page-header"
      data-joined={joined || undefined}
      className={cn(
        "flex flex-col rounded-(--page-header-radius) border-(length:--page-header-border-width) border-(--page-header-border) bg-(--page-header-background) bg-clip-padding px-(--page-header-spacing-inline) py-(--page-header-spacing-block) text-(length:--font-size-base) text-foreground shadow-(--page-header-shadow) data-joined:rounded-none data-joined:border-0 data-joined:shadow-none",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-row"
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-2", className)}
      {...props}
    />
  )
}

function PageHeaderFigure({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-figure"
      className={cn("me-1 flex shrink-0", className)}
      {...props}
    />
  )
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-heading"
      className={cn(
        "grid min-w-0 flex-1 basis-48 grid-cols-[minmax(0,max-content)_auto_auto] items-end justify-start gap-x-2 pe-3",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-eyebrow"
      className={cn(
        "col-span-full truncate leading-none text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn(
        "truncate text-(length:--page-title-size) leading-(--page-title-line-height) font-(--page-title-weight) text-heading",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

function PageHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

function PageHeaderMeta({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-meta"
      className={cn(
        "min-w-0 flex-1 basis-48 leading-(--line-height-base) text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDetails({
  className,
  ...props
}: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="page-header-details"
      className={cn(
        "-mx-(--page-header-spacing-inline) mt-(--page-header-spacing-block) -mb-(--page-header-spacing-block) rounded-b-(--page-header-radius) bg-(--page-header-detail-background) flex flex-wrap gap-x-[clamp(1.5rem,7%,4rem)] gap-y-3 p-(--page-header-spacing-inline)",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDetail({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-detail"
      className={cn(
        "min-w-0 max-w-[max(calc(25%-3rem),min(calc(50%-0.75rem),11rem))]",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDetailLabel({
  className,
  ...props
}: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="page-header-detail-label"
      className={cn(
        "truncate text-(length:--metric-label-size) leading-(--metric-label-line-height) text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDetailValue({
  className,
  ...props
}: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="page-header-detail-value"
      className={cn("truncate leading-(--line-height-base)", className)}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderActions,
  PageHeaderDetail,
  PageHeaderDetailLabel,
  PageHeaderDetails,
  PageHeaderDetailValue,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderRow,
  PageHeaderTitle,
}
