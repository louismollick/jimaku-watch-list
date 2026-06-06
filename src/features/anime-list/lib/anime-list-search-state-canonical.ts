import {
  mediaStatuses,
  subtitleAvailabilityOptions,
  watchStatuses,
} from "@/features/anime-list/domain/anime-list-enums"
import {
  defaultLookupSearchState,
  type LookupSearchState,
  serializeGenreValues,
  serializeSelectedValues,
} from "@/features/anime-list/lib/anime-list-search-state"
import { rangesEqual } from "@/features/anime-list/lib/range-utils"

function arraysEqual<TValue>(
  left: readonly TValue[],
  right: readonly TValue[]
) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  )
}

export function canonicalizeLookupSearch(search: LookupSearchState) {
  const normalizedStatuses = serializeSelectedValues(
    search.selectedStatuses,
    watchStatuses
  )
  const normalizedMediaStatuses = serializeSelectedValues(
    search.selectedMediaStatuses,
    mediaStatuses
  )
  const normalizedSubtitleAvailability = serializeSelectedValues(
    search.selectedSubtitleAvailability,
    subtitleAvailabilityOptions
  )
  const canonicalSearch: Partial<LookupSearchState> = {}

  if (search.source !== defaultLookupSearchState.source)
    canonicalSearch.source = search.source
  if (search.username.trim()) canonicalSearch.username = search.username.trim()
  if (search.titleQuery.trim())
    canonicalSearch.titleQuery = search.titleQuery.trim()
  if (
    !arraysEqual(normalizedStatuses, defaultLookupSearchState.selectedStatuses)
  ) {
    canonicalSearch.selectedStatuses = normalizedStatuses
  }
  if (
    !arraysEqual(
      normalizedMediaStatuses,
      defaultLookupSearchState.selectedMediaStatuses
    )
  ) {
    canonicalSearch.selectedMediaStatuses = normalizedMediaStatuses
  }
  const normalizedGenres = serializeGenreValues(search.selectedGenres)
  if (normalizedGenres.length > 0)
    canonicalSearch.selectedGenres = normalizedGenres
  if (
    !arraysEqual(
      normalizedSubtitleAvailability,
      defaultLookupSearchState.selectedSubtitleAvailability
    )
  ) {
    canonicalSearch.selectedSubtitleAvailability =
      normalizedSubtitleAvailability
  }
  if (
    search.difficultyFilterMode !==
    defaultLookupSearchState.difficultyFilterMode
  ) {
    canonicalSearch.difficultyFilterMode = search.difficultyFilterMode
  }
  if (
    !rangesEqual(
      search.jpdbDifficultyRange,
      defaultLookupSearchState.jpdbDifficultyRange
    )
  ) {
    canonicalSearch.jpdbDifficultyRange = search.jpdbDifficultyRange
  }
  if (
    !rangesEqual(
      search.learnNativelyLevelRange,
      defaultLookupSearchState.learnNativelyLevelRange
    )
  ) {
    canonicalSearch.learnNativelyLevelRange = search.learnNativelyLevelRange
  }
  if (
    !rangesEqual(
      search.learnNativelyJlptRange,
      defaultLookupSearchState.learnNativelyJlptRange
    )
  ) {
    canonicalSearch.learnNativelyJlptRange = search.learnNativelyJlptRange
  }
  if (search.sortBy !== defaultLookupSearchState.sortBy)
    canonicalSearch.sortBy = search.sortBy
  if (search.sortDirection !== defaultLookupSearchState.sortDirection) {
    canonicalSearch.sortDirection = search.sortDirection
  }

  return canonicalSearch
}
