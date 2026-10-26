"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { iconColors } from "@/components/wisty/icon-colors"
import { cn } from "@/lib/utils"

type IconCategory = "standard" | "custom" | "action" | "doctype" | "utility"

const IconContext = React.createContext({ basePath: "/assets/icons" })

/**
 * Where the app serves @salesforce-ux/icons'
 * dist/salesforce-lightning-design-system-icons folder. Default "/assets/icons".
 */
function IconProvider({
  basePath,
  children,
}: {
  basePath: string
  children?: React.ReactNode
}) {
  const value = React.useMemo(
    () => ({ basePath: basePath.replace(/\/+$/, "") }),
    [basePath]
  )
  return <IconContext value={value}>{children}</IconContext>
}

const iconVariants = cva(
  "inline-block shrink-0 rounded-(--icon-radius) leading-none",
  {
    variants: {
      category: {
        standard: "bg-(--icon-background) text-white",
        custom: "bg-(--icon-background) text-white",
        action: "rounded-[100%] bg-(--icon-background) p-2 text-white",
        doctype: "text-(--icon-inverse)",
        utility: "",
      },
      variant: {
        default: "",
        inverse: "",
        warning: "",
        error: "",
        success: "",
      },
    },
    compoundVariants: [
      {
        category: "utility",
        variant: "default",
        className: "text-(--icon-foreground)",
      },
      {
        category: "utility",
        variant: "inverse",
        className: "text-(--icon-inverse)",
      },
      {
        category: "utility",
        variant: "warning",
        className: "text-(--icon-warning)",
      },
      {
        category: "utility",
        variant: "error",
        className: "text-(--icon-error)",
      },
      {
        category: "utility",
        variant: "success",
        className: "text-(--icon-success)",
      },
    ],
    defaultVariants: {
      category: "utility",
      variant: "default",
    },
  }
)

const iconSizes = {
  "xx-small": "size-3.5",
  "x-small": "size-4",
  small: "size-6",
  medium: "size-8",
  large: "size-12",
}

function Icon({
  name,
  size = "medium",
  variant = "default",
  label,
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** An SLDS icon name, category and symbol: "standard:account", "utility:down". */
  name: `${IconCategory}:${string}`
  size?: keyof typeof iconSizes
  /** The color of a utility icon. Object and doctype icons ignore it. */
  variant?: "default" | "inverse" | "warning" | "error" | "success"
  /** Assistive text. Without it the icon is decorative and hidden. */
  label?: string
}) {
  const { basePath } = React.useContext(IconContext)
  const [category, symbol = ""] = name.split(":") as [IconCategory, string]
  const background = iconColors[`${category}-${symbol.replace(/_/g, "-")}`]

  return (
    <span
      data-slot="icon"
      aria-hidden={label ? undefined : true}
      className={cn(iconVariants({ category, variant }), className)}
      style={
        background
          ? ({
              "--icon-background": background,
              ...style,
            } as React.CSSProperties)
          : style
      }
      {...props}
    >
      <svg
        aria-hidden="true"
        className={cn("inline-flex fill-current", iconSizes[size])}
      >
        <use
          href={`${basePath}/${category}-sprite/svg/symbols.svg#${symbol}`}
        />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}

export { Icon, IconProvider, iconVariants }
