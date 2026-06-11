import lookupResponseFixture from "@/features/anime-list/tests/fixtures/lookup-response.json"
import type { LookupResponse } from "@/lib/types"

export function successResponse(): LookupResponse {
  const response = structuredClone(
    lookupResponseFixture as unknown as LookupResponse
  )

  if (!response.ok) {
    return response
  }

  return {
    ...response,
    userListAnimeCount: response.totalAnime,
    browseMeta: {
      mode: "onlyMine",
      isGlobalBrowse: false,
      isApproximateWatchStatusSort: false,
      isAniListBrowseCap: false,
    },
    results: response.results.map((result) => ({
      ...result,
      userList: {
        inList: result.entry.status !== null,
        status: result.entry.status,
        score: result.entry.score,
        progress: result.entry.progress,
      },
    })),
  }
}
