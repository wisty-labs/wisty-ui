import { cn } from "@/lib/utils"

// Dot angles, clockwise from the left; each bounces a sixth of a second after the last.
const dots = [180, 240, 300, 0, 60, 120]

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="-8 -8 16 16"
      className={cn(
        "size-4 shrink-0 overflow-visible fill-current text-(--spinner) in-data-[slot=button]:text-current [&_circle]:animate-spinner-dot motion-reduce:[&_circle]:animate-none",
        className
      )}
      {...props}
    >
      {dots.map((angle, index) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <circle
            cx="8"
            r="2"
            style={{ animationDelay: `${(index * 2 - 1) / 12}s` }}
          />
        </g>
      ))}
    </svg>
  )
}

export { Spinner }
