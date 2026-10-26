"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

const Toaster = ({
  position = "top-center",
  closeButton = true,
  expand = true,
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      position={position}
      closeButton={closeButton}
      expand={expand}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-6" />,
        info: <InfoIcon className="size-6" />,
        warning: <TriangleAlertIcon className="size-6" />,
        error: <OctagonXIcon className="size-6" />,
        loading: <Loader2Icon className="size-6 motion-safe:animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--info-container)",
          "--normal-text": "var(--on-info)",
          "--normal-border": "transparent",
          "--border-radius": "var(--toast-radius)",
          "--width": "var(--toast-width)",
        } as React.CSSProperties
      }
      toastOptions={{
        // Sonner's own styles are unlayered and beat Tailwind's layers, so each
        // class is marked important.
        classNames: {
          toast:
            "items-center! gap-3! rounded-(--toast-radius)! border-0! py-3! ps-6! pe-12! font-sans! text-(length:--font-size-base)! leading-(--line-height-base)! shadow-(--elevation-3)! focus-visible:shadow-(--shadow-focus)!",
          default: "bg-info-container! text-on-info!",
          info: "bg-info-container! text-on-info!",
          loading: "bg-info-container! text-on-info!",
          success: "bg-success-container! text-on-success!",
          warning: "bg-warning-container! text-on-warning!",
          error: "bg-error-container! text-on-error!",
          icon: "m-0! size-6! self-start! max-[30em]:hidden! [&_svg]:m-0!",
          content:
            "gap-0! [&_a]:text-current! [&_a]:underline! [&_a:hover]:no-underline! [&_a:focus-visible]:rounded-(--radius-1)! [&_a:focus-visible]:no-underline! [&_a:focus-visible]:outline-(--focus)! [&_a:focus-visible]:outline-offset-2!",
          title:
            "text-(length:--toast-title-size)! leading-(--toast-title-line-height)! font-(--toast-title-weight)!",
          description:
            "leading-(--line-height-base)! font-normal! text-inherit! max-[30em]:hidden!",
          closeButton:
            "start-auto! end-3! top-3! size-6! transform-none! rounded-(--radius-1)! border-0! bg-transparent! text-current! outline-hidden hover:text-(--alert-close-hover)! focus-visible:text-(--alert-close-hover)! focus-visible:shadow-(--shadow-focus-inset)! [&_svg]:size-6 [&_svg]:stroke-2",
          actionButton:
            "h-(--control-height)! rounded-(--button-radius)! border! border-border-strong! bg-background! px-(--button-padding-inline)! text-(length:--font-size-base)! font-(--button-font-weight)! text-link! hover:bg-secondary! hover:text-(--button-foreground-hover)! focus-visible:shadow-(--shadow-focus-inset)!",
          cancelButton:
            "h-(--control-height)! bg-transparent! px-0! text-(length:--font-size-base)! font-normal! text-current! underline! hover:no-underline! focus-visible:shadow-(--shadow-focus)!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from "sonner"
