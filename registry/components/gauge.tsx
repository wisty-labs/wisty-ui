import * as React from "react"

import { cn } from "@/lib/utils"

type GaugeBand =
  | {
      /** The band runs up to this value. The value itself starts the next band. */
      to: number
      /** The band's color: success, warning or error. */
      tone: "success" | "warning" | "error"
      /** The band's name, shown by the value, like "On track". */
      label: string
    }
  | {
      to: number
      /** No tone: the value keeps its default color. */
      tone?: undefined
      /** An optional name, shown by the value. */
      label?: string
    }

type GaugeTone = NonNullable<GaugeBand["tone"]>

const toneColors: Record<GaugeTone, string> = {
  success: "var(--chart-positive)",
  warning: "var(--chart-warning)",
  error: "var(--chart-negative)",
}

// In a 100 by 100 box, the ring's outer edge sits 2 inside so the reference
// tick can reach past it.
const stroke = 7.5
const radius = 50 - 2 - stroke / 2
const tickInner = radius - stroke / 2 - 2
const tickOuter = 50

// Round caps reach stroke / 2 past the arc's ends; below max the arc stops
// short of them, so a value just under max never looks full.
const circumference = 2 * Math.PI * radius
const mostBelowMax = 1 - (stroke + 1.5) / circumference

// A fixed locale, so server and client print the same text.
const oneDecimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })
const formatValue = (value: number) => oneDecimal.format(value)

const pointAt = (fraction: number, r: number) => {
  const angle = fraction * 2 * Math.PI
  return { x: 50 + r * Math.sin(angle), y: 50 - r * Math.cos(angle) }
}

// The dial is a half ring in a 200 by 108 box, around its hub at (100, 100).
const dial = { width: 200, height: 108, cx: 100, cy: 100, radius: 84 }
const dialStroke = 14
const dialInner = dial.radius - dialStroke / 2
const labelRadius = dialInner - 22
const needleLength = dialInner - 38
const scaleSteps = 10

const round = (n: number) => Math.round(n * 1000) / 1000
const dialPoint = (fraction: number, r: number) => {
  const angle = Math.PI * (1 - fraction)
  return {
    x: round(dial.cx + r * Math.cos(angle)),
    y: round(dial.cy - r * Math.sin(angle)),
  }
}
const dialArc = (from: number, to: number) => {
  const start = dialPoint(from, dial.radius)
  const end = dialPoint(to, dial.radius)
  return `M ${start.x} ${start.y} A ${dial.radius} ${dial.radius} 0 0 1 ${end.x} ${end.y}`
}

const sweep =
  "duration-800 ease-[cubic-bezier(0.42,0,0.58,1)] motion-reduce:transition-none"

type GaugeProps = Omit<
  React.ComponentProps<"div">,
  | "children"
  | "role"
  | "aria-labelledby"
  | "aria-valuemin"
  | "aria-valuemax"
  | "aria-valuenow"
  | "aria-valuetext"
> & {
  /** Names the gauge. Shown under a dial or a ring, or above a bar or a rating. */
  label: React.ReactNode
  /** The value. It may pass max; the drawing stops at max, the text doesn't. null shows noDataLabel. */
  value: number | null
  /** The end of the scale, which starts at 0: the goal on a ring or a bar, the number of dots on a rating. Default 100, or 5 on a rating. */
  max?: number
  /** A half dial with a needle (dial), a ring (polar), a bar (flat) or a row of dots (rating). */
  variant?: "dial" | "polar" | "flat" | "rating"
  /** A point to compare the value with, like a target or an average. Keep it within max, or it has no mark. */
  reference?: number
  /** The reference's name, shown with it, like "Target" or "Avg". */
  referenceLabel?: string
  /** Value ranges, lowest first. A dial draws them on its scale; the other variants take the color of the one the value is in. */
  bands?: GaugeBand[]
  /** Shown and read when value is null, or max isn't above 0. */
  noDataLabel?: string
  /** Formats the value, the reference and a dial's scale. Default rounded to one decimal. */
  valueFormatter?: (value: number) => string
  /** A unit after the value and the reference, like "%" or "days". */
  unit?: string
}

function Gauge({
  label,
  value,
  variant = "dial",
  max: maxProp,
  reference,
  referenceLabel = "Target",
  noDataLabel = "No data",
  valueFormatter = formatValue,
  unit,
  bands,
  className,
  ...props
}: GaugeProps) {
  const labelId = React.useId()
  const max = maxProp ?? (variant === "rating" ? 5 : 100)
  // No number, or no scale, draws nothing and says noDataLabel; the meter
  // stays valid on 0..100.
  const hasScale = Number.isFinite(max) && max > 0
  const hasData = hasScale && value !== null && Number.isFinite(value)
  const scaleMax = hasScale ? max : 100
  const clamp = (v: number) => Math.min(scaleMax, Math.max(0, v))
  const fraction = hasData ? clamp(value) / scaleMax : 0
  const compareTo =
    reference !== undefined && Number.isFinite(reference) ? reference : null
  // A reference past max keeps its text but gets no mark: a mark at the end
  // would say a full gauge meets it.
  const referenceFraction =
    compareTo !== null && hasScale && compareTo >= 0 && compareTo <= scaleMax
      ? compareTo / scaleMax
      : undefined
  const band =
    hasData && bands?.length
      ? (bands.find((range) => value < range.to) ?? bands[bands.length - 1])
      : undefined
  const color = band?.tone
    ? toneColors[band.tone]
    : "var(--gauge-color, var(--chart-1))"

  // A word unit takes a space ("41 days"); a sign doesn't ("72%").
  const unitText = unit ? (/^\p{L}/u.test(unit) ? ` ${unit}` : unit) : ""
  const format = (v: number) => `${valueFormatter(v)}${unitText}`
  const referenceText =
    compareTo !== null ? `${referenceLabel} ${format(compareTo)}` : undefined
  const valueText = [
    hasData ? format(value) : noDataLabel,
    band?.label,
    referenceText,
  ]
    .filter(Boolean)
    .join(", ")

  const linear = variant === "flat" || variant === "rating"
  const unitPart = unit ? (
    <span
      data-slot="gauge-unit"
      className={cn(
        "text-muted-foreground",
        linear
          ? "text-(length:--chart-text-size)"
          : "text-(length:--chart-unit-size)"
      )}
    >
      {unitText}
    </span>
  ) : null
  const bandPart = band?.label ? (
    <span
      data-slot="gauge-band"
      data-tone={band.tone}
      className="text-(length:--metric-label-size) leading-(--metric-label-line-height)"
      style={{ color }}
    >
      {band.label}
    </span>
  ) : null
  const valuePart = (
    <span
      data-slot="gauge-value"
      className={cn(
        "whitespace-nowrap text-foreground tabular-nums",
        linear
          ? "shrink-0 text-(length:--gauge-bar-value-size) leading-6"
          : "text-(length:--chart-value-size) leading-(--metric-value-line-height)"
      )}
    >
      {hasData ? valueFormatter(value) : noDataLabel}
      {hasData && unitPart}
    </span>
  )

  const meter = {
    "data-slot": "gauge",
    "data-variant": variant,
    role: "meter",
    "aria-labelledby": labelId,
    "aria-valuemin": 0,
    "aria-valuemax": scaleMax,
    "aria-valuenow": hasData ? clamp(value) : 0,
    "aria-valuetext": valueText,
  }

  if (linear) {
    const dots = Math.max(1, Math.round(scaleMax))
    // A rating's dots have a fixed gap, so a point on the scale sits at its
    // share of the row plus the gaps before it.
    const along = (share: number) =>
      variant === "rating"
        ? `calc((100% + 0.375rem) * ${share} - 0.1875rem)`
        : `${share * 100}%`
    const referenceAt =
      compareTo !== null ? (clamp(compareTo) / scaleMax) * 100 : 0

    return (
      <div
        {...props}
        {...meter}
        className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span id={labelId} data-slot="gauge-label">
            {label}
          </span>
          {bandPart}
        </div>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "relative flex min-w-0 flex-col gap-1",
              variant === "flat" && "flex-1"
            )}
          >
            {variant === "flat" ? (
              <div
                data-slot="gauge-track"
                className="h-6 w-full overflow-hidden rounded-full bg-(--progress-track)"
              >
                <div
                  data-slot="gauge-indicator"
                  className="h-full rounded-full"
                  style={{
                    width: `${fraction * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            ) : (
              <div
                data-slot="gauge-track"
                className="flex h-6 items-center gap-1.5"
              >
                {Array.from({ length: dots }, (_, dot) => (
                  <span
                    key={dot}
                    data-slot="gauge-dot"
                    className="relative aspect-square w-4 min-w-0 shrink overflow-hidden rounded-full bg-(--progress-track)"
                  >
                    <span
                      data-slot="gauge-indicator"
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${Math.min(1, Math.max(0, fraction * dots - dot)) * 100}%`,
                        backgroundColor: color,
                      }}
                    />
                  </span>
                ))}
              </div>
            )}
            {referenceFraction !== undefined && (
              <div
                data-slot="gauge-reference"
                className="absolute top-0 h-6 w-0 -translate-x-1/2 border-l-2 border-dashed border-foreground"
                style={{ left: along(referenceFraction) }}
              />
            )}
            {referenceText && (
              <div className="relative h-4">
                <span
                  data-slot="gauge-reference-label"
                  className={cn(
                    "absolute top-0 rounded-sm bg-muted-foreground px-1 text-(length:--chart-text-size) leading-4 whitespace-nowrap text-background",
                    referenceAt < 15
                      ? "translate-x-0"
                      : referenceAt > 85
                        ? "-translate-x-full"
                        : "-translate-x-1/2"
                  )}
                  style={{ left: along(referenceAt / 100) }}
                >
                  {referenceText}
                </span>
              </div>
            )}
          </div>
          {valuePart}
        </div>
      </div>
    )
  }

  const readout = (
    <>
      {valuePart}
      {bandPart}
      {referenceText && (
        <span
          data-slot="gauge-reference-label"
          className="text-(length:--metric-label-size) leading-(--metric-label-line-height) text-muted-foreground"
        >
          {referenceText}
        </span>
      )}
    </>
  )

  if (variant === "dial") {
    let from = 0
    const ranges = hasScale
      ? (bands ?? []).flatMap((range, index, all) => {
          const start = from
          const end =
            index === all.length - 1
              ? 1
              : Math.max(start, clamp(range.to) / scaleMax)
          from = end
          return end > start ? [{ range, start, end }] : []
        })
      : []
    const rangeColor = (range: GaugeBand) =>
      range.tone ? toneColors[range.tone] : "var(--progress-track)"
    const capStart = dialPoint(0, dial.radius)
    const capEnd = dialPoint(1, dial.radius)
    const tickFrom =
      referenceFraction !== undefined
        ? dialPoint(referenceFraction, dialInner - 1)
        : null
    const tickTo =
      referenceFraction !== undefined
        ? dialPoint(referenceFraction, dial.radius + dialStroke / 2 + 5)
        : null

    return (
      <div
        {...props}
        {...meter}
        className={cn(
          "flex w-full max-w-72 flex-col items-center gap-2",
          className
        )}
      >
        <div className="@container relative w-full">
          <svg
            viewBox={`0 0 ${dial.width} ${dial.height}`}
            aria-hidden="true"
            className="block w-full overflow-visible"
          >
            {ranges.length ? (
              <>
                {ranges.map(({ range, start, end }) => (
                  <path
                    key={start}
                    data-slot="gauge-range"
                    data-tone={range.tone}
                    d={dialArc(start, end)}
                    fill="none"
                    stroke={rangeColor(range)}
                    strokeWidth={dialStroke}
                  />
                ))}
                <circle
                  cx={capStart.x}
                  cy={capStart.y}
                  r={dialStroke / 2}
                  fill={rangeColor(ranges[0]!.range)}
                />
                <circle
                  cx={capEnd.x}
                  cy={capEnd.y}
                  r={dialStroke / 2}
                  fill={rangeColor(ranges[ranges.length - 1]!.range)}
                />
              </>
            ) : (
              <>
                <path
                  data-slot="gauge-track"
                  d={dialArc(0, 1)}
                  fill="none"
                  stroke="var(--progress-track)"
                  strokeWidth={dialStroke}
                  strokeLinecap="round"
                />
                {hasData && fraction > 0 && (
                  <path
                    data-slot="gauge-indicator"
                    d={dialArc(0, 1)}
                    fill="none"
                    stroke={color}
                    strokeWidth={dialStroke}
                    strokeLinecap="round"
                    pathLength={100}
                    className={cn(
                      "[stroke-dasharray:var(--gauge-fill)_100] transition-[stroke-dasharray] starting:[stroke-dasharray:0_100]",
                      sweep
                    )}
                    style={
                      {
                        "--gauge-fill": round(fraction * 100),
                      } as React.CSSProperties
                    }
                  />
                )}
              </>
            )}
            {Array.from({ length: scaleSteps + 1 }, (_, step) => {
              const outer = dialPoint(step / scaleSteps, dialInner - 3)
              const inner = dialPoint(
                step / scaleSteps,
                dialInner - (step % 2 ? 6 : 9)
              )
              return (
                <line
                  key={step}
                  data-slot="gauge-scale-tick"
                  x1={outer.x}
                  y1={outer.y}
                  x2={inner.x}
                  y2={inner.y}
                  className={cn(
                    "stroke-border",
                    step % 2 === 1 && "@max-[12rem]:hidden"
                  )}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
            {tickFrom && tickTo && (
              <line
                data-slot="gauge-reference"
                x1={tickFrom.x}
                y1={tickFrom.y}
                x2={tickTo.x}
                y2={tickTo.y}
                className="stroke-foreground"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            )}
            {hasData && (
              <g
                data-slot="gauge-needle"
                className={cn(
                  "origin-[100px_100px] rotate-(--gauge-angle) fill-foreground transition-[rotate] starting:rotate-0",
                  sweep
                )}
                style={
                  {
                    "--gauge-angle": `${round(fraction * 180)}deg`,
                  } as React.CSSProperties
                }
              >
                <polygon
                  points={`${dial.cx - needleLength},${dial.cy} ${dial.cx},${dial.cy - 4.5} ${dial.cx},${dial.cy + 4.5}`}
                />
                <circle cx={dial.cx} cy={dial.cy} r={7} />
              </g>
            )}
          </svg>
          <div data-slot="gauge-scale" aria-hidden="true">
            {Array.from({ length: scaleSteps / 2 + 1 }, (_, step) => {
              const at = dialPoint((step * 2) / scaleSteps, labelRadius)
              return (
                <span
                  key={step}
                  className={cn(
                    "absolute -translate-1/2 text-(length:--chart-text-size) whitespace-nowrap text-muted-foreground tabular-nums",
                    step > 0 && step < scaleSteps / 2 && "@max-[12rem]:hidden"
                  )}
                  style={{
                    left: `${(at.x / dial.width) * 100}%`,
                    top: `${(at.y / dial.height) * 100}%`,
                  }}
                >
                  {valueFormatter(((step * 2) / scaleSteps) * scaleMax)}
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col items-center text-center">{readout}</div>
        <span id={labelId} data-slot="gauge-label" className="text-center">
          {label}
        </span>
      </div>
    )
  }

  const drawn = fraction < 1 ? Math.min(fraction, mostBelowMax) : 1
  const tickFrom =
    referenceFraction !== undefined
      ? pointAt(referenceFraction, tickInner)
      : null
  const tickTo =
    referenceFraction !== undefined
      ? pointAt(referenceFraction, tickOuter)
      : null

  return (
    <div
      {...props}
      {...meter}
      className={cn(
        "flex w-full max-w-56 flex-col items-center gap-2",
        className
      )}
    >
      <div className="relative aspect-square w-full">
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="block size-full overflow-visible"
        >
          <circle
            data-slot="gauge-track"
            cx={50}
            cy={50}
            r={radius}
            fill="none"
            stroke="var(--progress-track)"
            strokeWidth={stroke}
          />
          {fraction > 0 && (
            <circle
              data-slot="gauge-indicator"
              cx={50}
              cy={50}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${drawn * 100} 100`}
              transform="rotate(-90 50 50)"
            />
          )}
          {tickFrom && tickTo && (
            <line
              data-slot="gauge-reference"
              x1={tickFrom.x}
              y1={tickFrom.y}
              x2={tickTo.x}
              y2={tickTo.y}
              className="stroke-foreground"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {readout}
        </div>
      </div>
      <span id={labelId} data-slot="gauge-label" className="text-center">
        {label}
      </span>
    </div>
  )
}

export { Gauge, type GaugeBand, type GaugeProps }
