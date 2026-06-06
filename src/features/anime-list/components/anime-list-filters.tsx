import { AnimeListDifficultyFilter } from "@/features/anime-list/components/anime-list-difficulty-filter"
import { AnimeListGenreFilter } from "@/features/anime-list/components/anime-list-genre-filter"
import { AnimeListMultiFilter } from "@/features/anime-list/components/anime-list-multi-filter"
import { AnimeListSortControls } from "@/features/anime-list/components/anime-list-sort-controls"
import { AnimeListTitleFilter } from "@/features/anime-list/components/anime-list-title-filter"
import {
  mediaStatuses,
  subtitleAvailabilityOptions,
  watchStatuses,
} from "@/features/anime-list/domain/anime-list-enums"
import {
  type LookupSearchState,
  serializeSelectedValues,
} from "@/features/anime-list/lib/anime-list-search-state"
import { subtitleAvailabilityLabels } from "@/features/anime-list/lib/labels"
import { mediaStatusLabel, statusLabel } from "@/lib/status"

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
      <AnimeListMultiFilter
        ariaLabel="Japanese subtitle availability"
        label="Japanese subtitle availability"
        options={subtitleAvailabilityOptions.map((option) => ({
          label: subtitleAvailabilityLabels[option],
          value: option,
        }))}
        selectedValues={new Set(searchState.selectedSubtitleAvailability)}
        updateState={(nextSelectedValues) => ({
          selectedSubtitleAvailability: serializeSelectedValues(
            nextSelectedValues as Set<
              LookupSearchState["selectedSubtitleAvailability"][number]
            >,
            subtitleAvailabilityOptions
          ),
        })}
        updateSearchState={updateSearchState}
      />
      <AnimeListMultiFilter
        ariaLabel="Watch status"
        label="Watch status"
        options={watchStatuses.map((status) => ({
          label: statusLabel[status],
          value: status,
        }))}
        selectedValues={new Set(searchState.selectedStatuses)}
        updateState={(nextSelectedValues) => ({
          selectedStatuses: serializeSelectedValues(
            nextSelectedValues as Set<
              LookupSearchState["selectedStatuses"][number]
            >,
            watchStatuses
          ),
        })}
        updateSearchState={updateSearchState}
      />
      <AnimeListMultiFilter
        ariaLabel="Airing status"
        label="Airing status"
        options={mediaStatuses.map((status) => ({
          label: mediaStatusLabel[status],
          value: status,
        }))}
        selectedValues={new Set(searchState.selectedMediaStatuses)}
        updateState={(nextSelectedValues) => ({
          selectedMediaStatuses: serializeSelectedValues(
            nextSelectedValues as Set<
              LookupSearchState["selectedMediaStatuses"][number]
            >,
            mediaStatuses
          ),
        })}
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
