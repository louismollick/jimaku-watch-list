import { ResultCardDetails } from "@/features/anime-list/components/result-card-details"
import type { OverlapResult } from "@/lib/types"

export function ResultCardTooltip({
  gap,
  result,
  side,
}: {
  gap: number
  result: OverlapResult
  side: "left" | "right"
}) {
  return (
    <div
      className="pointer-events-none absolute top-0 hidden w-80 animate-in zoom-in-[0.98] rounded-lg border border-border bg-popover px-4 py-3.5 text-sm text-popover-foreground shadow-[0_20px_60px_-32px_rgba(0,0,0,0.95)] duration-400 lg:block"
      id={`result-card-tooltip-${result.entry.source}-${result.entry.id}`}
      role="tooltip"
      style={
        side === "right"
          ? { left: `calc(100% + ${gap}px)` }
          : { right: `calc(100% + ${gap}px)` }
      }
    >
      <ResultCardDetails result={result} />
    </div>
  )
}
