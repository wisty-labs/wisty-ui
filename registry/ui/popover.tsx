"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  onEscapeKeyDown,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      {/* With a combobox open inside, Escape closes only its list; a cmdk
          input is always expanded, so there it still closes the popover. */}
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 flex w-80 flex-col gap-2 rounded-(--radius-2) border-(length:--popover-border-width) border-solid border-border bg-popover px-3 pt-3 pb-2 text-(length:--font-size-base) leading-(--line-height-base) break-words text-(--popover-body-foreground) shadow-(--popover-shadow) outline-hidden",
          className
        )}
        {...props}
        onEscapeKeyDown={(event) => {
          if (
            event.target instanceof Element &&
            event.target.matches(
              "[role=combobox][aria-expanded=true]:not([cmdk-input])"
            )
          ) {
            event.preventDefault()
          }
          onEscapeKeyDown?.(event)
        }}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn(
        "text-(length:--popover-title-size) leading-(--popover-title-line-height) font-(--popover-title-weight) text-(--popover-title-foreground)",
        className
      )}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p data-slot="popover-description" className={cn(className)} {...props} />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
