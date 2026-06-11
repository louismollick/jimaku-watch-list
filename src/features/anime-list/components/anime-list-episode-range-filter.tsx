import { AnimeListMetadataRangeFilter } from "@/features/anime-list/components/anime-list-metadata-range-filter"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { episodeFilterBounds } from "@/features/anime-list/lib/anime-metadata-filters"
import { formatEpisodeRangeValue } from "@/features/anime-list/lib/result-presenters"

export function AnimeListEpisodeRangeFilter({
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
      ariaLabel="Episode range"
      bounds={episodeFilterBounds}
      currentRange={searchState.episodeRange ?? episodeFilterBounds}
      formatTickLabel={formatEpisodeRangeValue}
      formatValueLabel={formatEpisodeRangeValue}
      label="Episodes"
      searchStateKey="episodeRange"
      updateSearchState={updateSearchState}
    />
  )
}
