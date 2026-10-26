"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-(--modal-backdrop) backdrop-blur-[5px] transition-opacity duration-400 ease-linear data-closed:opacity-0 starting:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  variant = "default",
  onEscapeKeyDown,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
  variant?: "default" | "destructive" | "warning" | "success" | "info"
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        data-variant={variant}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-4rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-(--modal-radius) bg-(--modal-background) px-(--prompt-padding-inline) pb-4 text-(--modal-foreground) shadow-(--elevation-4) transition-opacity duration-100 ease-linear outline-none data-closed:opacity-0 starting:opacity-0 data-[size=sm]:max-w-80 sm:max-w-160 md:w-1/2 md:min-w-80",
          className
        )}
        {...props}
        onEscapeKeyDown={(event) => {
          // Escape closes only an open combobox's list; Radix hands the key
          // to the dialog first. A command's input is always expanded.
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
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "-mx-(--prompt-padding-inline) grid rounded-t-(--modal-radius) bg-(--modal-background) pt-4 text-foreground [text-align:var(--prompt-title-align)] group-data-[variant=destructive]/alert-dialog-content:bg-error-container group-data-[variant=destructive]/alert-dialog-content:text-on-error group-data-[variant=info]/alert-dialog-content:bg-info-container group-data-[variant=info]/alert-dialog-content:text-on-info group-data-[variant=success]/alert-dialog-content:bg-success-container group-data-[variant=success]/alert-dialog-content:text-on-success group-data-[variant=warning]/alert-dialog-content:bg-warning-container group-data-[variant=warning]/alert-dialog-content:text-on-warning",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "-mx-(--prompt-padding-inline) -mb-4 flex flex-wrap items-center gap-2 rounded-b-(--modal-radius) border-t-(length:--prompt-footer-border-width) border-(--modal-border) bg-(--modal-background) px-4 py-3 text-foreground [justify-content:var(--prompt-footer-align)] group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mx-4 mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-muted text-(--empty-icon) [justify-self:var(--prompt-title-align)] [&_svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "px-4 pb-4 text-(length:--prompt-title-size) leading-(--prompt-title-line-height) font-(--modal-title-weight) break-words hyphens-auto",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "bg-(--modal-background) px-(--prompt-padding-inline) pt-4 text-start text-(--modal-foreground) [&_a]:text-link [&_a]:underline [&_a:focus-visible]:text-link-hover [&_a:hover]:text-link-hover",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
