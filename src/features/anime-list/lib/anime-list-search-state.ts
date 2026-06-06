import type {
  AnimeSource,
  DifficultyFilterMode,
  MediaStatus,
  SortDirection,
  SortOption,
  SubtitleAvailabilityOption,
  WatchStatus,
} from "@/features/anime-list/domain/anime-list-enums"
import { mediaStatuses } from "@/features/anime-list/domain/anime-list-enums"
import type { NumericRange } from "@/features/anime-list/lib/range-utils"

export type LookupSearchState = {
  source: AnimeSource
  username: string
  titleQuery: string
  selectedStatuses: WatchStatus[]
  selectedMediaStatuses: Exclude<MediaStatus, null>[]
  selectedGenres: string[]
  selectedSubtitleAvailability: SubtitleAvailabilityOption[]
  difficultyFilterMode: DifficultyFilterMode
  jpdbDifficultyRange: NumericRange | null
  learnNativelyLevelRange: NumericRange | null
  learnNativelyJlptRange: NumericRange | null
  sortBy: SortOption
  sortDirection: SortDirection
}

export const defaultLookupSearchState: LookupSearchState = {
  source: "anilist",
  username: "",
  titleQuery: "",
  selectedStatuses: ["PLANNING", "PAUSED"],
  selectedMediaStatuses: [...mediaStatuses],
  selectedGenres: [],
  selectedSubtitleAvailability: ["all"],
  difficultyFilterMode: "none",
  jpdbDifficultyRange: null,
  learnNativelyLevelRange: null,
  learnNativelyJlptRange: null,
  sortBy: "averageScore",
  sortDirection: "desc",
}

export function serializeSelectedValues<TValue extends string>(
  values: Iterable<TValue>,
  allowedValues: readonly TValue[]
) {
  const allowedSet = new Set<string>(allowedValues)

  return [...new Set(values)]
    .filter((value): value is TValue => allowedSet.has(value))
    .sort(
      (left, right) =>
        allowedValues.indexOf(left) - allowedValues.indexOf(right)
    )
}

export function serializeGenreValues(values: Iterable<string>) {
  return [
    ...new Set(
      [...values].map((value) => value.trim().toLowerCase()).filter(Boolean)
    ),
  ].sort((left, right) => left.localeCompare(right))
}
