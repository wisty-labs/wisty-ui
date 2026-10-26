"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip as TooltipPrimitive } from "radix-ui"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "isolate z-50 w-fit max-w-(--tooltip-max-width) rounded-(--radius-2) bg-(--tooltip) px-3 py-2.5 text-(length:--tooltip-font-size) leading-(--line-height-base) break-words text-(--tooltip-foreground) shadow-(--tooltip-shadow) transition-opacity duration-100 ease-linear data-closed:opacity-0 starting:opacity-0",
          className
        )}
        {...props}
      >
        {children}
        {/* The arrow is scaled past its layout size, so the tooltip keeps its
            distance and the tip almost touches the trigger. */}
        <TooltipPrimitive.Arrow className="-z-1 block size-3 scale-[1.3333] rotate-45 bg-(--tooltip) fill-(--tooltip) shadow-(--tooltip-nubbin-shadow) not-data-[side]:-translate-y-1/2 data-[side=bottom]:-top-1.5 data-[side=bottom]:rotate-[225deg] data-[side=left]:-right-1.5 data-[side=left]:-rotate-45 data-[side=right]:-left-1.5 data-[side=right]:rotate-[135deg] data-[side=top]:-bottom-1.5" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
