import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import {
  type NumericRange,
  normalizeStoredRange,
} from "@/features/anime-list/lib/range-utils"

export function AnimeListMetadataRangeFilter({
  ariaLabel,
  bounds,
  currentRange,
  formatTickLabel,
  formatValueLabel,
  label,
  searchStateKey,
  updateSearchState,
}: {
  ariaLabel: string
  bounds: NumericRange
  currentRange: NumericRange
  formatTickLabel: (value: number, isUpperBound?: boolean) => string
  formatValueLabel: (value: number, isUpperBound?: boolean) => string
  label: string
  searchStateKey: "yearRange" | "episodeRange" | "durationRange"
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-label text-muted-foreground">{label}</Label>
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Allowed range</span>
          <span className="font-medium text-foreground">
            {formatValueLabel(currentRange[0])} -{" "}
            {formatValueLabel(currentRange[1], true)}
          </span>
        </div>
      </div>
      <Slider
        aria-label={ariaLabel}
        className="py-1"
        max={bounds[1]}
        min={bounds[0]}
        onValueChange={(nextRange) =>
          updateSearchState((previousState) =>
            applyMetadataRange(previousState, nextRange, bounds, searchStateKey)
          )
        }
        step={1}
        value={currentRange}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatTickLabel(bounds[0])}</span>
        <span>{formatTickLabel(bounds[1], true)}</span>
      </div>
    </div>
  )
}

function applyMetadataRange(
  previousState: LookupSearchState,
  nextRange: number[],
  bounds: NumericRange,
  searchStateKey: "yearRange" | "episodeRange" | "durationRange"
) {
  if (nextRange.length !== 2) {
    return previousState
  }

  const normalizedNextRange = [
    Math.min(nextRange[0], nextRange[1]),
    Math.max(nextRange[0], nextRange[1]),
  ] as NumericRange

  return {
    ...previousState,
    [searchStateKey]: normalizeStoredRange(normalizedNextRange, bounds),
  }
}
