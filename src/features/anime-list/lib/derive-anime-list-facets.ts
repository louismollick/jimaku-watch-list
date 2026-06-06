import { learnNativelyJlptEquivalents } from "@/features/anime-list/domain/anime-list-enums"
import type { LookupResponse } from "@/features/anime-list/domain/lookup-response"
import {
  getNumericBounds,
  type NumericRange,
} from "@/features/anime-list/lib/range-utils"
import { normalizeGenreValue } from "@/features/anime-list/lib/result-presenters"

export type AnimeListFacets = {
  availableGenres: Array<{ label: string; value: string }>
  availableJpdbDifficultyBounds: NumericRange | null
  availableLearnNativelyLevelBounds: NumericRange | null
  availableLearnNativelyJlptBounds: NumericRange | null
}

export function deriveAnimeListFacets(
  lookupState: LookupResponse | null
): AnimeListFacets {
  if (!lookupState?.ok) {
    return {
      availableGenres: [],
      availableJpdbDifficultyBounds: null,
      availableLearnNativelyLevelBounds: null,
      availableLearnNativelyJlptBounds: null,
    }
  }

  const availableGenres = [
    ...new Map(
      lookupState.results
        .flatMap((result) => result.entry.media.genres)
        .map((genre) => [normalizeGenreValue(genre), genre] as const)
    ).entries(),
  ]
    .map(([value, label]) => ({ label, value }))
    .sort((left, right) => left.label.localeCompare(right.label))

  const availableLearnNativelyLevelBounds = getNumericBounds(
    lookupState.results
      .map((result) => result.matchedLearnNatively?.levelNumber)
      .filter((value): value is number => typeof value === "number")
  )

  return {
    availableGenres,
    availableJpdbDifficultyBounds: getNumericBounds(
      lookupState.results
        .map((result) => result.matchedJpdb?.entry.averageDifficulty)
        .filter((value): value is number => typeof value === "number")
    ),
    availableLearnNativelyLevelBounds,
    availableLearnNativelyJlptBounds: availableLearnNativelyLevelBounds
      ? [0, learnNativelyJlptEquivalents.length - 1]
      : null,
  }
}
