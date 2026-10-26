import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-(--badge-radius) border border-transparent px-2 py-1 text-(length:--badge-font-size) leading-[normal] font-normal whitespace-nowrap transition-[color,box-shadow] outline-hidden focus-visible:shadow-(--shadow-focus-outset) aria-invalid:border-destructive empty:p-0 [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-container text-muted-foreground [a&]:hover:text-heading",
        secondary:
          "border-border bg-background text-muted-foreground [a&]:hover:bg-secondary",
        destructive: "bg-error-container text-on-error",
        outline:
          "border-border bg-background text-muted-foreground [a&]:hover:bg-secondary",
        ghost:
          "text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-link underline-offset-4 [a&]:hover:underline",
        inverse: "bg-neutral text-inverse-foreground",
        success: "bg-success-container text-on-success",
        warning: "bg-warning-container text-on-warning",
        info: "bg-info-container text-on-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
