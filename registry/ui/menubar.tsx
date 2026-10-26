"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Menubar as MenubarPrimitive } from "radix-ui"

import { CheckIcon, ChevronRightIcon } from "lucide-react"

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-(--context-bar-height) items-stretch gap-(--context-bar-gap) border-b-(length:--context-bar-border-width) border-b-(color:--context-bar-border) bg-background py-(--context-bar-padding-block) text-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    // An open trigger keeps the hover look: the bar has no open state of its own.
    // Radix sets disabled, Base UI sets aria-disabled; the classes key on both.
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "relative block max-w-(--context-bar-item-max-width) content-center overflow-x-clip rounded-(--context-bar-item-radius) px-3 text-(length:--font-size-base) leading-(--line-height-base) font-(--context-bar-item-weight) text-ellipsis whitespace-nowrap text-foreground outline-hidden select-none transition-[background-color] duration-250 ease-[cubic-bezier(0.39,0.575,0.565,1)] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-(--context-bar-indicator-size) after:h-(--context-bar-indicator-size) after:rounded-(--context-bar-item-radius) after:bg-(--context-bar-indicator-hover) after:opacity-0 hover:bg-(--context-bar-item-background-hover) hover:after:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-6 focus-visible:outline-solid focus-visible:outline-(--context-bar-focus) focus-visible:[text-decoration-line:var(--context-bar-focus-decoration)] aria-expanded:bg-(--context-bar-item-background-hover) aria-expanded:after:opacity-100 disabled:text-(--menu-disabled) disabled:hover:bg-transparent disabled:after:hidden aria-disabled:text-(--menu-disabled) aria-disabled:hover:bg-transparent aria-disabled:after:hidden",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = 0,
  sideOffset = 3,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    // Radix sets --radix-menubar-content-available-height; Base UI sets
    // --available-height, so the fallback reads the same on both.
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-[var(--radix-menubar-content-available-height,var(--available-height))] w-max max-w-80 min-w-24 overflow-x-hidden overflow-y-auto rounded-(--radius-2) bg-popover py-1 text-(length:--menu-font-size) text-popover-foreground shadow-(--elevation-2) outline-none",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/menubar-item relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled) data-[variant=destructive]:not-aria-disabled:text-destructive data-[variant=destructive]:not-aria-disabled:[&>svg:not([class*='text-'])]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled)",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none flex size-4 items-center justify-center text-(--menu-check)">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled)",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none flex size-4 items-center justify-center text-(--menu-check)">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-3 py-2 text-(length:--menu-font-size) font-(--menu-label-weight) data-inset:ps-9",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("pointer-events-none my-2 h-px bg-border", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ms-auto text-(length:--menu-font-size) text-muted-foreground in-data-highlighted:text-current",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 px-3 py-2 leading-(--line-height-base) text-popover-foreground outline-hidden select-none data-highlighted:bg-accent focus-visible:not-aria-disabled:not-hover:rounded-[6px] focus-visible:not-aria-disabled:not-hover:shadow-(--menu-item-shadow-focus) data-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:text-(--menu-disabled) aria-disabled:data-highlighted:bg-transparent data-inset:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-(--menu-icon) aria-disabled:[&_svg]:text-(--menu-disabled) aria-expanded:bg-accent",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto rtl:rotate-180" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-menubar-content-available-height,var(--available-height))] w-max max-w-80 min-w-24 overflow-x-hidden overflow-y-auto rounded-(--radius-2) bg-popover py-1 text-(length:--menu-font-size) text-popover-foreground shadow-(--elevation-2) outline-none",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
