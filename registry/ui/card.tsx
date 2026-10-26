import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing-block) overflow-hidden rounded-(--card-radius) border border-(--card-border) bg-card bg-clip-padding py-(--card-spacing-block) text-(length:--font-size-base) text-card-foreground shadow-(--card-shadow) in-data-[slot=card]:border-transparent in-data-[slot=card]:shadow-none has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-(--card-radius)",
        "data-[size=sm]:gap-2 data-[size=sm]:rounded-(--card-sm-radius) data-[size=sm]:py-2 data-[size=sm]:has-data-[slot=card-footer]:pb-0 data-[size=sm]:*:[img:first-child]:rounded-t-(--card-sm-radius)",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-0.5 px-(--card-spacing-inline) group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing-block)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-(length:--card-title-size) leading-(--card-title-line-height) font-(--card-title-weight) text-heading group-data-[size=sm]/card:text-(length:--card-sm-title-size) group-data-[size=sm]/card:font-(--card-sm-title-weight)",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-(length:--card-description-size) text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex items-center gap-1 self-center justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-(--card-body-spacing-inline) group-data-[size=sm]/card:px-3",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-center border-t border-border px-(--card-spacing-inline) py-(--card-spacing-block) group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:py-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
