import { AnimeListMetadataRangeFilter } from "@/features/anime-list/components/anime-list-metadata-range-filter"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { durationFilterBounds } from "@/features/anime-list/lib/anime-metadata-filters"
import { formatDurationRangeValue } from "@/features/anime-list/lib/result-presenters"

export function AnimeListDurationRangeFilter({
  searchState,
  updateSearchState,
}: {
  searchState: LookupSearchState
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  return (
    <AnimeListMetadataRangeFilter
      ariaLabel="Duration range"
      bounds={durationFilterBounds}
      currentRange={searchState.durationRange ?? durationFilterBounds}
      formatTickLabel={formatDurationRangeValue}
      formatValueLabel={formatDurationRangeValue}
      label="Duration"
      searchStateKey="durationRange"
      updateSearchState={updateSearchState}
    />
  )
}
