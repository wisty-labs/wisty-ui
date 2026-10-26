"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-border not-first:border-t", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      {/* Disabled rules read data-disabled: Base UI never sets disabled, and
          Radix sets aria-disabled on an open trigger that cannot collapse. */}
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex min-w-0 flex-1 items-center justify-start gap-2 rounded-(--button-radius) p-(--accordion-spacing) text-start text-(length:--accordion-title-size) leading-(--accordion-title-line-height) font-(--accordion-title-weight) text-foreground transition-[transform,box-shadow] duration-150 ease-in-out outline-none select-none not-data-disabled:hover:text-(--accordion-title-foreground-hover) not-data-disabled:focus:text-(--accordion-title-foreground-hover) focus-visible:me-(--accordion-spacing) focus-visible:rounded-(--radius-3) focus-visible:shadow-(--accordion-trigger-shadow-focus) data-disabled:pointer-events-none data-disabled:text-(--accordion-disabled) lg:block lg:truncate lg:ps-[calc(var(--accordion-spacing)+--spacing(3.5)+--spacing(2))]",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none order-first size-3.5 shrink-0 fill-current group-aria-[expanded=false]/accordion-trigger:-rotate-90 rtl:group-aria-[expanded=false]/accordion-trigger:rotate-90 lg:absolute lg:start-(--accordion-spacing) lg:top-1/2 lg:-translate-y-1/2"
        />
        <ChevronUpIcon data-slot="accordion-trigger-icon" className="hidden" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="text-(length:--font-size-base) leading-(--line-height-base) text-muted-foreground"
      {...props}
    >
      <div
        className={cn(
          "px-(--accordion-spacing) pb-(--accordion-spacing) [&_a]:text-(--link) [&_a]:hover:text-(--link-hover) [&_a]:hover:underline [&_p:not(:last-child)]:mb-3",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
