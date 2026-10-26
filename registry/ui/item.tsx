import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

import { Separator } from "@/components/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-2 has-[>[data-slot=item-separator]]:gap-0",
        className
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-(--radius-2) border text-(length:--font-size-base) leading-(--line-height-base) text-foreground transition-[color,background-color,border-color,box-shadow] duration-100 outline-none focus-visible:border-(--item-border-hover) focus-visible:shadow-(--item-shadow-hover) [a]:transition-[color,background-color,border-color,box-shadow]",
  {
    variants: {
      variant: {
        default: "border-transparent [a]:hover:bg-muted",
        outline:
          "border-border [a]:hover:border-(--item-border-hover) [a]:hover:shadow-(--item-shadow-hover)",
        muted:
          "border-border bg-muted [a]:hover:border-(--item-border-hover) [a]:hover:shadow-(--item-shadow-hover)",
      },
      size: {
        default: "gap-3 p-4",
        sm: "gap-2 p-3",
        xs: "gap-2 p-2 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 rounded-(--radius-2) bg-muted text-(--icon-foreground) group-data-[variant=muted]/item:bg-background group-data-[size=sm]/item:size-6 group-data-[size=xs]/item:size-5 [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/item:[&_svg:not([class*='size-'])]:size-3.5",
        image:
          "size-8 overflow-hidden rounded-(--avatar-radius) group-data-[size=sm]/item:size-6 group-data-[size=xs]/item:size-5 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    // A title holding a badge or icon wraps instead of truncating, so neither
    // is clipped and the icon keeps its size.
    <div
      data-slot="item-title"
      className={cn(
        "truncate text-(length:--font-size-base) leading-(--line-height-base) font-normal text-foreground has-[>[data-slot=badge],>svg]:flex has-[>[data-slot=badge],>svg]:items-center has-[>[data-slot=badge],>svg]:gap-2 has-[>[data-slot=badge],>svg]:whitespace-normal [&>svg]:shrink-0 [&>[data-slot=badge]]:shrink-0 [&_a]:text-link [&_a]:transition-colors [&_a]:duration-100 [&_a]:ease-linear [&_a:focus-visible]:text-link-hover [&_a:focus-visible]:underline [&_a:focus-visible]:outline-(--focus) [&_a:focus-visible]:outline-offset-0 [&_a:hover]:text-link-hover [&_a:hover]:underline",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left text-(length:--item-description-size) leading-(--line-height-base) font-normal text-muted-foreground [&>a]:text-link [&>a]:underline [&>a:focus-visible]:text-link-hover has-[>a:focus-visible]:-m-1 has-[>a:focus-visible]:p-1 [&>a:focus-visible]:outline-(--focus) [&>a:hover]:text-link-hover",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    // min-w-0 keeps a long truncating title from widening the row past the item.
    <div
      data-slot="item-header"
      className={cn(
        "flex min-w-0 basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex min-w-0 basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
