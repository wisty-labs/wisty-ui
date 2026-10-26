"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slider as SliderPrimitive } from "radix-ui"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-default data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-(--slider-track-radius) bg-(--slider-track) data-disabled:bg-(--slider-track-disabled) data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-(--slider-thumb) select-none data-disabled:bg-(--slider-thumb-disabled) data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {/* The thumbs are the sliders, so each takes the root's label. */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-labelledby={props["aria-labelledby"]}
          className="block size-4 shrink-0 rounded-full bg-(--slider-thumb) transition-colors duration-150 ease-in-out outline-none select-none not-data-disabled:hover:bg-(--slider-thumb-hover) not-data-disabled:active:bg-(--slider-thumb-active) focus-visible:bg-(--slider-thumb-focus) focus-visible:shadow-(--slider-thumb-shadow-focus) has-focus-visible:bg-(--slider-thumb-focus) has-focus-visible:shadow-(--slider-thumb-shadow-focus) data-disabled:bg-(--slider-thumb-disabled)"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
