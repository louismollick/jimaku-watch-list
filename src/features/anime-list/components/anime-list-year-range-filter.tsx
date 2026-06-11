import { AnimeListMetadataRangeFilter } from "@/features/anime-list/components/anime-list-metadata-range-filter"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { getYearFilterBounds } from "@/features/anime-list/lib/anime-metadata-filters"
import { formatYearRangeValue } from "@/features/anime-list/lib/result-presenters"

export function AnimeListYearRangeFilter({
  searchState,
  updateSearchState,
}: {
  searchState: LookupSearchState
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  const bounds = getYearFilterBounds()
  const currentRange = searchState.yearRange ?? bounds

  return (
    <AnimeListMetadataRangeFilter
      ariaLabel="Year range"
      bounds={bounds}
      currentRange={currentRange}
      formatTickLabel={formatYearRangeValue}
      formatValueLabel={formatYearRangeValue}
      label="Year"
      searchStateKey="yearRange"
      updateSearchState={updateSearchState}
    />
  )
}
