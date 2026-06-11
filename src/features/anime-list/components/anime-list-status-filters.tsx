import { AnimeListMultiFilter } from "@/features/anime-list/components/anime-list-multi-filter"
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

export function AnimeListStatusFilters({
  searchState,
  updateSearchState,
}: {
  searchState: LookupSearchState
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  return (
    <>
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
      {searchState.myAnimeFilterMode !== "hideMine" ? (
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
      ) : null}
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
    </>
  )
}
