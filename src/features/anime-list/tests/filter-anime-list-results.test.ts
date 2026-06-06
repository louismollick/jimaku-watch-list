import { describe, expect, it } from "vitest"
import { defaultLookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { deriveAnimeListFacets } from "@/features/anime-list/lib/derive-anime-list-facets"
import { filterAnimeListResults } from "@/features/anime-list/lib/filter-anime-list-results"
import { successResponse } from "@/features/anime-list/tests/test-data"

describe("filter-anime-list-results", () => {
  it("filters by title and genre intersection", () => {
    const response = successResponse()
    if (!response.ok) throw new Error("expected success response")
    const facets = deriveAnimeListFacets(response)

    expect(
      filterAnimeListResults(
        response.results,
        {
          ...defaultLookupSearchState,
          selectedGenres: ["drama", "mystery"],
          titleQuery: "apothecary",
        },
        facets
      ).map((result) => result.entry.id)
    ).toEqual([3])
  })

  it("filters by subtitle availability and difficulty", () => {
    const response = successResponse()
    if (!response.ok) throw new Error("expected success response")
    const facets = deriveAnimeListFacets(response)

    expect(
      filterAnimeListResults(
        response.results,
        {
          ...defaultLookupSearchState,
          difficultyFilterMode: "jpdbAverageDifficulty",
          jpdbDifficultyRange: [20, 30],
          selectedStatuses: ["CURRENT", "PLANNING", "PAUSED"],
          selectedSubtitleAvailability: ["all"],
        },
        facets
      ).map((result) => result.entry.id)
    ).toEqual([1])
  })
})
