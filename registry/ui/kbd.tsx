import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 w-fit items-center justify-center gap-1 rounded-(--radius-1) bg-muted px-1 align-middle font-sans text-(length:--kbd-font-size) leading-none font-normal text-secondary-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 align-middle", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
