"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        // The focus outline is drawn on the root's ::after, so the scrollbar can't cover it.
        "relative isolate overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] has-[[data-slot=scroll-area-viewport]:focus-visible]:after:outline-2 has-[[data-slot=scroll-area-viewport]:focus-visible]:after:-outline-offset-2 has-[[data-slot=scroll-area-viewport]:focus-visible]:after:outline-(--focus) has-[[data-slot=scroll-area-viewport]:focus-visible]:after:outline-solid",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none bg-clip-padding p-px transition-colors select-none hover:bg-(--scrollbar-track-hover) data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-horizontal:px-1 data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent data-vertical:py-1",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-(--radius-pill) bg-(--scrollbar-thumb) transition-colors hover:bg-(--scrollbar-thumb-hover) active:bg-(--scrollbar-thumb-hover)"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
