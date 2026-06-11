import { describe, expect, it } from "vitest"
import { defaultLookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { buildAniListBrowseQueryInput } from "@/features/anime-list/server/browse-anilist"

describe("buildAniListBrowseQueryInput", () => {
  it("maps bounded metadata filters to AniList query variables", () => {
    expect(
      buildAniListBrowseQueryInput({
        hiddenIds: [1, 2],
        page: 3,
        search: {
          ...defaultLookupSearchState,
          myAnimeFilterMode: "hideMine",
          selectedFormats: ["TV", "MOVIE"],
          yearRange: [1980, 2024],
          episodeRange: [12, 24],
          durationRange: [24, 90],
        },
      })
    ).toMatchObject({
      page: 3,
      perPage: 50,
      formatIn: ["TV", "MOVIE"],
      startDateGreater: 19800000,
      startDateLesser: 20250000,
      episodesGreater: 11,
      episodesLesser: 25,
      durationGreater: 23,
      durationLesser: 91,
      idNotIn: [1, 2],
    })
  })

  it("omits upper bounds for 150+ and 3h+", () => {
    const variables = buildAniListBrowseQueryInput({
      hiddenIds: [],
      page: 1,
      search: {
        ...defaultLookupSearchState,
        myAnimeFilterMode: "showAll",
        episodeRange: [0, 150],
        durationRange: [30, 180],
      },
    })

    expect(variables.durationGreater).toBe(29)
    expect(variables.episodesLesser).toBeUndefined()
    expect(variables.durationLesser).toBeUndefined()
  })
})
