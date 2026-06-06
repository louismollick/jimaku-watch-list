import {
  getLearnNativelyJlptEquivalent,
  getLearnNativelyLevelNumber,
} from "@/features/anime-list/server/load-anime-difficulty-snapshots"
import {
  matchAnime,
  matchJpdbAnimeDifficulty,
  matchLearnNativelyAnimationLevel,
} from "@/features/anime-list/server/matching"
import { statusOrder } from "@/lib/status"
import type {
  AnimeEntry,
  Completeness,
  JimakuEntry,
  JpdbAnimeDifficultyEntry,
  LearnNativelyAnimationLevelEntry,
  OverlapResult,
} from "@/lib/types"

export function getAnimeListCompleteness(
  entry: AnimeEntry,
  fileCount: number
): Completeness {
  if (entry.media.status === "FINISHED") {
    return typeof entry.media.episodes === "number"
      ? fileCount >= entry.media.episodes
        ? "complete"
        : "incomplete"
      : "unknown"
  }

  if (entry.media.status === "RELEASING") {
    return typeof entry.media.releasedEpisodes === "number"
      ? fileCount >= entry.media.releasedEpisodes
        ? "complete"
        : "incomplete"
      : "unknown"
  }

  return "unknown"
}

export function sortAnimeListOverlapResults(results: OverlapResult[]) {
  return [...results].sort((left, right) => {
    const statusDelta =
      statusOrder[left.entry.status] - statusOrder[right.entry.status]

    if (statusDelta !== 0) {
      return statusDelta
    }

    return (left.entry.media.title.primary ?? "").localeCompare(
      right.entry.media.title.primary ?? ""
    )
  })
}

export function buildAnimeListOverlapResults(
  entries: AnimeEntry[],
  jimakuEntries: JimakuEntry[],
  jpdbEntries: JpdbAnimeDifficultyEntry[],
  learnNativelyEntries: LearnNativelyAnimationLevelEntry[]
) {
  return entries.map((entry) => {
    const matched = matchAnime(entry, jimakuEntries)
    const matchedLearnNativelyBase = matchLearnNativelyAnimationLevel(
      entry,
      learnNativelyEntries
    )
    const jlptEquivalent = matchedLearnNativelyBase
      ? getLearnNativelyJlptEquivalent(matchedLearnNativelyBase.entry.level)
      : null
    const levelNumber = matchedLearnNativelyBase
      ? getLearnNativelyLevelNumber(matchedLearnNativelyBase.entry.level)
      : null

    return {
      entry,
      matchedJimaku: matched?.matchedJimaku ?? null,
      alternates: matched?.alternates ?? [],
      matchScore: matched?.matchScore ?? null,
      matchReason: matched?.matchReason ?? null,
      isAmbiguous: matched?.isAmbiguous ?? false,
      completeness: matched
        ? getAnimeListCompleteness(entry, matched.matchedJimaku.fileCount)
        : "unknown",
      matchedJpdb: matchJpdbAnimeDifficulty(entry, jpdbEntries) ?? undefined,
      matchedLearnNatively:
        matchedLearnNativelyBase && jlptEquivalent && levelNumber !== null
          ? { ...matchedLearnNativelyBase, jlptEquivalent, levelNumber }
          : undefined,
    }
  })
}
