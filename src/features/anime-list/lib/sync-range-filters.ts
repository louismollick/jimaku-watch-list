import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import type { AnimeListFacets } from "@/features/anime-list/lib/derive-anime-list-facets"
import {
  normalizeStoredRange,
  rangesEqual,
} from "@/features/anime-list/lib/range-utils"

export function syncRangeFilters(
  previousState: LookupSearchState,
  facets: AnimeListFacets
) {
  const nextJpdb = normalizeStoredRange(
    previousState.jpdbDifficultyRange,
    facets.availableJpdbDifficultyBounds
  )
  const nextLevel = normalizeStoredRange(
    previousState.learnNativelyLevelRange,
    facets.availableLearnNativelyLevelBounds
  )
  const nextJlpt = normalizeStoredRange(
    previousState.learnNativelyJlptRange,
    facets.availableLearnNativelyJlptBounds
  )

  return rangesEqual(previousState.jpdbDifficultyRange, nextJpdb) &&
    rangesEqual(previousState.learnNativelyLevelRange, nextLevel) &&
    rangesEqual(previousState.learnNativelyJlptRange, nextJlpt)
    ? previousState
    : {
        ...previousState,
        jpdbDifficultyRange: nextJpdb,
        learnNativelyLevelRange: nextLevel,
        learnNativelyJlptRange: nextJlpt,
      }
}
