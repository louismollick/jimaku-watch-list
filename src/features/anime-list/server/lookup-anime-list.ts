import { createServerFn } from "@tanstack/react-start"
import type { AnimeSource } from "@/features/anime-list/domain/anime-list-enums"
import {
  buildAnimeListOverlapResults,
  sortAnimeListOverlapResults,
} from "@/features/anime-list/server/build-overlap-results"
import { fetchAniListEntries } from "@/features/anime-list/server/fetch-anilist-entries"
import { fetchMyAnimeListEntries } from "@/features/anime-list/server/fetch-myanimelist-entries"
import {
  loadJpdbAnimeDifficultySnapshot,
  loadLearnNativelyAnimationLevelsSnapshot,
} from "@/features/anime-list/server/load-anime-difficulty-snapshots"
import { loadJimakuSnapshot } from "@/features/anime-list/server/load-jimaku-snapshot"
import {
  readCachedLookupResponse,
  writeCachedLookupResponse,
} from "@/features/anime-list/server/runtime-cache"
import type { LookupResponse } from "@/lib/types"

async function fetchSourceEntries(source: AnimeSource, username: string) {
  return source === "myanimelist"
    ? fetchMyAnimeListEntries(username)
    : fetchAniListEntries(username)
}

export async function findAnimeListOverlap(
  source: AnimeSource,
  username: string
): Promise<LookupResponse> {
  const trimmedUsername = username.trim()

  if (!trimmedUsername) {
    return { ok: false, code: "UPSTREAM_ERROR", message: "Enter a username." }
  }

  const cachedResponse = await readCachedLookupResponse(source, trimmedUsername)

  if (cachedResponse) {
    return cachedResponse
  }

  const [entryResult, jimakuEntries, jpdbEntries, learnNativelyEntries] =
    await Promise.all([
      fetchSourceEntries(source, trimmedUsername),
      loadJimakuSnapshot(),
      loadJpdbAnimeDifficultySnapshot(),
      loadLearnNativelyAnimationLevelsSnapshot(),
    ])

  if (!Array.isArray(entryResult)) {
    await writeCachedLookupResponse(source, trimmedUsername, entryResult)
    return entryResult
  }

  const results = sortAnimeListOverlapResults(
    buildAnimeListOverlapResults(
      entryResult,
      jimakuEntries,
      jpdbEntries,
      learnNativelyEntries
    )
  )
  const response = {
    ok: true,
    source,
    username: trimmedUsername,
    fetchedAt: new Date().toISOString(),
    totalAnime: entryResult.length,
    matchedCount: results.filter((result) => result.matchedJimaku).length,
    results,
  } satisfies LookupResponse

  await writeCachedLookupResponse(source, trimmedUsername, response)
  return response
}

export const lookupAnimeList = createServerFn({ method: "GET" })
  .inputValidator((data: { source: AnimeSource; username: string }) => data)
  .handler(async ({ data }) => findAnimeListOverlap(data.source, data.username))
