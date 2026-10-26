"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { CheckIcon, ChevronRightIcon } from "lucide-react"

function DropdownMenu({
  modal = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return (
    <DropdownMenuPrimitive.Root
      data-slot="dropdown-menu"
      modal={modal}
      {...props}
    />
  )
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 2,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    // Radix sets --radix-dropdown-menu-content-available-height; Base UI sets
    // --available-height, so the fallback reads the same on both.
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height,var(--available-height))] w-max max-w-80 min-w-24 overflow-x-hidden overflow-y-auto rounded-(--radius-2) bg-popover py-1 text-(length:--menu-font-size) text-popover-foreground shadow-(--elevation-2) outline-none",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled) data-[variant=destructive]:not-aria-disabled:text-destructive data-[variant=destructive]:not-aria-disabled:[&>svg:not([class*='text-'])]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled)",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none flex size-4 items-center justify-center text-(--menu-check)"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled)",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none flex size-4 items-center justify-center text-(--menu-check)"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 py-2 text-(length:--menu-font-size) font-(--menu-label-weight) data-inset:ps-9",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("pointer-events-none my-2 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto text-(length:--menu-font-size) text-muted-foreground in-data-highlighted:text-current",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled) aria-expanded:bg-accent",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto rtl:rotate-180" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height,var(--available-height))] w-max max-w-80 min-w-24 overflow-x-hidden overflow-y-auto rounded-(--radius-2) bg-popover py-1 text-(length:--menu-font-size) text-popover-foreground shadow-(--elevation-2) outline-none",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
