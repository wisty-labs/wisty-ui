"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"

import { CheckIcon, ChevronRightIcon } from "lucide-react"

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("select-none", className)}
      {...props}
    />
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    // Radix sets --radix-context-menu-content-available-height; Base UI sets
    // --available-height, so the fallback reads the same on both.
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "z-50 max-h-[var(--radix-context-menu-content-available-height,var(--available-height))] w-max max-w-80 min-w-24 overflow-x-hidden overflow-y-auto rounded-(--radius-2) bg-popover py-1 text-(length:--menu-font-size) text-popover-foreground shadow-(--elevation-2) outline-none",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/context-menu-item relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:not-focus-visible:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 not-aria-disabled:[&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled) data-[variant=destructive]:not-aria-disabled:text-destructive data-[variant=destructive]:not-aria-disabled:[&>svg:not([class*='text-'])]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:not-focus-visible:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 not-aria-disabled:[&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled) aria-expanded:bg-accent",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto box-content pl-1 rtl:rotate-180" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

function ContextMenuSubContent({
  className,
  sideOffset = 4,
  alignOffset = 2,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={cn(
        "z-50 max-h-[var(--radix-context-menu-content-available-height,var(--available-height))] w-max max-w-80 min-w-24 overflow-x-hidden overflow-y-auto rounded-(--radius-2) bg-popover py-1 text-(length:--menu-font-size) text-popover-foreground shadow-(--elevation-2) outline-none",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:not-focus-visible:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 not-aria-disabled:[&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled)",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none flex size-4 items-center justify-center text-(--menu-check)">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:not-focus-visible:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 not-aria-disabled:[&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled)",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none flex size-4 items-center justify-center text-(--menu-check)">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 py-2 text-(length:--menu-font-size) font-(--menu-label-weight) data-inset:ps-9",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("pointer-events-none my-2 h-px bg-border", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto text-(length:--menu-font-size) text-muted-foreground in-data-highlighted:text-current",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
