import { AnimeListDifficultyFilter } from "@/features/anime-list/components/anime-list-difficulty-filter"
import { AnimeListDurationRangeFilter } from "@/features/anime-list/components/anime-list-duration-range-filter"
import { AnimeListEpisodeRangeFilter } from "@/features/anime-list/components/anime-list-episode-range-filter"
import { AnimeListFormatFilter } from "@/features/anime-list/components/anime-list-format-filter"
import { AnimeListGenreFilter } from "@/features/anime-list/components/anime-list-genre-filter"
import { AnimeListScopeFilter } from "@/features/anime-list/components/anime-list-scope-filter"
import { AnimeListSortControls } from "@/features/anime-list/components/anime-list-sort-controls"
import { AnimeListStatusFilters } from "@/features/anime-list/components/anime-list-status-filters"
import { AnimeListTitleFilter } from "@/features/anime-list/components/anime-list-title-filter"
import { AnimeListYearRangeFilter } from "@/features/anime-list/components/anime-list-year-range-filter"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"

export function AnimeListFilters({
  activeDifficultyBounds,
  activeDifficultyRange,
  availableGenres,
  searchState,
  updateSearchState,
}: {
  activeDifficultyBounds: [number, number] | null
  activeDifficultyRange: [number, number] | null
  availableGenres: Array<{ label: string; value: string }>
  searchState: LookupSearchState
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  return (
    <aside className="h-fit space-y-6 pt-1">
      <p className="text-sm font-semibold text-foreground">Filters</p>
      <AnimeListTitleFilter
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
      {searchState.source === "anilist" ? (
        <AnimeListScopeFilter
          searchState={searchState}
          updateSearchState={updateSearchState}
        />
      ) : null}
      <AnimeListStatusFilters
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
      <AnimeListFormatFilter
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
      <AnimeListYearRangeFilter
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
      <AnimeListEpisodeRangeFilter
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
      <AnimeListDurationRangeFilter
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
      {availableGenres.length > 0 ? (
        <AnimeListGenreFilter
          availableGenres={availableGenres}
          searchState={searchState}
          updateSearchState={updateSearchState}
        />
      ) : null}
      <AnimeListDifficultyFilter
        activeDifficultyBounds={activeDifficultyBounds}
        activeDifficultyRange={activeDifficultyRange}
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
      <AnimeListSortControls
        searchState={searchState}
        updateSearchState={updateSearchState}
      />
    </aside>
  )
}
