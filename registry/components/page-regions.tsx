import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** A page laid out as a Lightning page template: a header, then its regions. */
function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page"
      className={cn(
        "@container/page flex w-full min-w-0 flex-col gap-4",
        className
      )}
      {...props}
    />
  )
}

const pageRegionsVariants = cva("grid items-start gap-4", {
  variants: {
    layout: {
      one: "grid-cols-1",
      "right-sidebar":
        "@min-[54rem]/page:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]",
      "left-sidebar":
        "@min-[54rem]/page:grid-cols-[minmax(22rem,1fr)_minmax(0,2fr)]",
      "two-equal": "@min-[48rem]/page:grid-cols-2",
      three: "@min-[64rem]/page:grid-cols-3",
    },
  },
  defaultVariants: {
    layout: "right-sidebar",
  },
})

function PageRegions({
  className,
  layout = "right-sidebar",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageRegionsVariants>) {
  return (
    <div
      data-slot="page-regions"
      data-layout={layout}
      className={cn(pageRegionsVariants({ layout }), className)}
      {...props}
    />
  )
}

function PageRegion({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-region"
      className={cn("flex min-w-0 flex-col gap-4", className)}
      {...props}
    />
  )
}

export { Page, PageRegion, PageRegions, pageRegionsVariants }
