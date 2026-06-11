import { AnimeListMultiFilter } from "@/features/anime-list/components/anime-list-multi-filter"
import { animeFormats } from "@/features/anime-list/domain/anime-list-enums"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import {
  getAnimeFormatOptions,
  getEffectiveSelectedFormats,
  serializeAnimeFormatValues,
} from "@/features/anime-list/lib/anime-metadata-filters"

export function AnimeListFormatFilter({
  searchState,
  updateSearchState,
}: {
  searchState: LookupSearchState
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  return (
    <AnimeListMultiFilter
      ariaLabel="Format"
      label="Format"
      options={getAnimeFormatOptions()}
      selectedValues={
        new Set(getEffectiveSelectedFormats(searchState.selectedFormats))
      }
      updateSearchState={updateSearchState}
      updateState={(nextSelectedValues) => {
        const normalizedFormats = serializeAnimeFormatValues(nextSelectedValues)

        return {
          selectedFormats:
            normalizedFormats.length === animeFormats.length
              ? []
              : normalizedFormats,
        }
      }}
    />
  )
}
