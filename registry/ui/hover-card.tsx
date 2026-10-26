"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { HoverCard as HoverCardPrimitive } from "radix-ui"

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    // The fade is a CSS transition from @starting-style. Base UI waits for it
    // and fades the card out too; Radix removes the card at once.
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 flex w-80 flex-col gap-2 rounded-(--radius-2) border-(length:--popover-border-width) border-solid border-border bg-popover px-3 pt-3 pb-2 text-(length:--font-size-base) leading-(--line-height-base) break-words text-(--popover-body-foreground) shadow-(--popover-shadow) outline-hidden transition-opacity duration-100 ease-linear data-closed:opacity-0 starting:opacity-0",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
