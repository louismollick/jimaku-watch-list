import * as SliderPrimitive from "@radix-ui/react-slider"
import type * as React from "react"
import { cn } from "@/lib/utils"

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        className
      )}
      data-slot="slider"
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-800"
        data-slot="slider-track"
      >
        <SliderPrimitive.Range
          className="absolute h-full rounded-full bg-sky-400"
          data-slot="slider-range"
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block size-4 rounded-full border border-sky-200/80 bg-sky-400 shadow-[0_0_0_4px_rgba(8,17,29,0.85)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:pointer-events-none disabled:opacity-50"
        data-slot="slider-thumb"
      />
      <SliderPrimitive.Thumb
        className="block size-4 rounded-full border border-sky-200/80 bg-sky-400 shadow-[0_0_0_4px_rgba(8,17,29,0.85)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:pointer-events-none disabled:opacity-50"
        data-slot="slider-thumb"
      />
    </SliderPrimitive.Root>
  )
}

export { Slider }
