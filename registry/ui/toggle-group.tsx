"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { toggleVariants } from "@/components/ui/toggle"

// Radix marks a single group's items with aria-checked; Base UI always sets aria-pressed.
const checked =
  "aria-checked:border-primary aria-checked:bg-primary aria-checked:text-primary-foreground aria-checked:[&_svg]:text-current aria-checked:hover:border-primary-hover aria-checked:hover:bg-primary-hover aria-checked:hover:text-(--button-brand-foreground-hover) aria-checked:hover:not-active:not-focus-visible:shadow-(--button-brand-shadow-hover) aria-checked:hover:not-active:not-focus-visible:[transform:var(--button-brand-transform-hover)] aria-checked:focus-visible:border-primary-hover aria-checked:focus-visible:bg-primary-hover aria-checked:focus-visible:text-(--button-brand-foreground-hover) aria-checked:disabled:border-disabled-border aria-checked:disabled:bg-disabled-container-strong aria-checked:disabled:text-disabled-strong"

const joined =
  "group-data-horizontal/toggle-group:data-[spacing=0]:not-first:rounded-s-none group-data-horizontal/toggle-group:data-[spacing=0]:not-last:rounded-e-none group-data-vertical/toggle-group:data-[spacing=0]:not-first:rounded-t-none group-data-vertical/toggle-group:data-[spacing=0]:not-last:rounded-b-none"

// An aria-label marks an icon-only item; joined text and icon-only items are
// two different groups.
const joinedText =
  "group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:not-first:-ms-px group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:not-first:-mt-px data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:focus-visible:border-border-strong data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:disabled:border-border-strong data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:focus-visible:shadow-none data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:focus-visible:outline-2 data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:focus-visible:outline-solid data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:focus-visible:-outline-offset-1 data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:focus-visible:outline-ring data-[spacing=0]:data-[variant=outline]:[&:not([aria-label],[aria-pressed=true],[aria-checked=true])]:focus-visible:text-link data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:[&:is([aria-pressed=true],[aria-checked=true])]:border-border-strong data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:[&:is([aria-pressed=true],[aria-checked=true])]:hover:border-t-primary-hover data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:[&:is([aria-pressed=true],[aria-checked=true])]:hover:border-b-primary-active data-[spacing=0]:data-[variant=outline]:[&:not([aria-label])]:[&:is([aria-pressed=true],[aria-checked=true])]:focus-visible:shadow-[inset_0_0_0_3px_var(--button-group-inset)]"

const joinedIcon =
  "group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:not-last:border-e-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:not-last:border-b-0 data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:focus-visible:shadow-none data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:focus-visible:outline-2 data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:focus-visible:outline-solid data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:focus-visible:-outline-offset-2 data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:focus-visible:outline-ring data-[spacing=0]:data-[variant=outline]:[&[aria-label]:not([aria-pressed=true],[aria-checked=true])]:focus-visible:bg-background data-[spacing=0]:data-[variant=outline]:[&[aria-label]]:[&:is([aria-pressed=true],[aria-checked=true])]:focus-visible:shadow-[inset_0_0_0_3px_var(--button-group-inset)]"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
})

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 focus:z-10 focus-visible:z-10",
        checked,
        joined,
        joinedText,
        joinedIcon,
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
