import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import type { AnimeListFacets } from "@/features/anime-list/lib/derive-anime-list-facets"
import { normalizeRange } from "@/features/anime-list/lib/range-utils"
import {
  getLearnNativelyJlptEquivalentIndex,
  getSearchableTitles,
  getSubtitleAvailability,
  normalizeGenreValue,
} from "@/features/anime-list/lib/result-presenters"
import { normalizeTitle } from "@/lib/normalize"
import type { OverlapResult } from "@/lib/types"

export function filterAnimeListResults(
  results: OverlapResult[],
  searchState: LookupSearchState,
  facets: AnimeListFacets
) {
  const normalizedTitleQuery = normalizeTitle(searchState.titleQuery)
  const selectedStatuses = new Set(searchState.selectedStatuses)
  const selectedMediaStatuses = new Set(searchState.selectedMediaStatuses)
  const selectedGenres = new Set(searchState.selectedGenres)
  const selectedSubtitleAvailability = new Set(
    searchState.selectedSubtitleAvailability
  )

  return results.filter((result) => {
    if (selectedStatuses.size > 0 && !selectedStatuses.has(result.entry.status))
      return false
    if (
      normalizedTitleQuery &&
      !getSearchableTitles(result.entry).some((title) =>
        normalizeTitle(title).includes(normalizedTitleQuery)
      )
    )
      return false
    if (
      selectedMediaStatuses.size > 0 &&
      result.entry.media.status &&
      !selectedMediaStatuses.has(result.entry.media.status)
    )
      return false
    if (
      selectedGenres.size > 0 &&
      ![...selectedGenres].every((genre) =>
        result.entry.media.genres.map(normalizeGenreValue).includes(genre)
      )
    )
      return false
    if (
      selectedSubtitleAvailability.size > 0 &&
      !selectedSubtitleAvailability.has(getSubtitleAvailability(result))
    )
      return false
    if (searchState.difficultyFilterMode === "jpdbAverageDifficulty") {
      const range =
        normalizeRange(
          searchState.jpdbDifficultyRange,
          facets.availableJpdbDifficultyBounds
        ) ?? facets.availableJpdbDifficultyBounds
      return Boolean(
        result.matchedJpdb &&
          range &&
          result.matchedJpdb.entry.averageDifficulty >= range[0] &&
          result.matchedJpdb.entry.averageDifficulty <= range[1]
      )
    }
    if (searchState.difficultyFilterMode === "learnNativelyLevel") {
      const range =
        normalizeRange(
          searchState.learnNativelyLevelRange,
          facets.availableLearnNativelyLevelBounds
        ) ?? facets.availableLearnNativelyLevelBounds
      return Boolean(
        result.matchedLearnNatively &&
          range &&
          result.matchedLearnNatively.levelNumber >= range[0] &&
          result.matchedLearnNatively.levelNumber <= range[1]
      )
    }
    if (searchState.difficultyFilterMode !== "learnNativelyJlptEquivalent")
      return true
    const range =
      normalizeRange(
        searchState.learnNativelyJlptRange,
        facets.availableLearnNativelyJlptBounds
      ) ?? facets.availableLearnNativelyJlptBounds
    const equivalentIndex = result.matchedLearnNatively
      ? getLearnNativelyJlptEquivalentIndex(
          result.matchedLearnNatively.jlptEquivalent
        )
      : -1

    return Boolean(
      result.matchedLearnNatively &&
        range &&
        equivalentIndex >= range[0] &&
        equivalentIndex <= range[1]
    )
  })
}
