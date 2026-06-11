import { describe, expect, it } from "vitest"
import {
  canonicalizeLookupSearch,
  defaultLookupSearchState,
  validateLookupSearch,
} from "@/lib/search-state"

describe("anime-list-search-state", () => {
  it("uses defaults for omitted params", () => {
    expect(validateLookupSearch({})).toEqual(defaultLookupSearchState)
  })

  it("omits defaults from canonical output", () => {
    expect(canonicalizeLookupSearch(defaultLookupSearchState)).toEqual({})
  })

  it("keeps normalized non-default values only", () => {
    expect(
      canonicalizeLookupSearch({
        ...defaultLookupSearchState,
        source: "myanimelist",
        username: "  Mollicl  ",
        titleQuery: "  apothecary!! ",
        selectedStatuses: ["CURRENT", "PLANNING"],
        selectedMediaStatuses: ["RELEASING"],
        selectedFormats: ["MOVIE", "TV"],
        selectedGenres: ["Mystery", "Comedy", "Mystery"],
        yearRange: [1980, 2024],
      })
    ).toEqual({
      source: "myanimelist",
      username: "Mollicl",
      titleQuery: "apothecary!!",
      selectedStatuses: ["CURRENT", "PLANNING"],
      selectedMediaStatuses: ["RELEASING"],
      selectedFormats: ["TV", "MOVIE"],
      selectedGenres: ["comedy", "mystery"],
      yearRange: [1980, 2024],
    })
  })

  it("omits watch status selections from canonical output while hideMine is active", () => {
    expect(
      canonicalizeLookupSearch({
        ...defaultLookupSearchState,
        myAnimeFilterMode: "hideMine",
        selectedStatuses: ["CURRENT"],
      })
    ).toEqual({
      myAnimeFilterMode: "hideMine",
    })
  })

  it("accepts case-insensitive enum values", () => {
    expect(
      validateLookupSearch({
        source: "MYANIMELIST",
        sortDirection: "ASC",
        myAnimeFilterMode: "SHOWALL",
      })
    ).toEqual({
      ...defaultLookupSearchState,
      source: "myanimelist",
      myAnimeFilterMode: "showAll",
      sortDirection: "asc",
    })
  })

  it("accepts new metadata filters", () => {
    expect(
      validateLookupSearch({
        selectedFormats: ["movie", "tv"],
        yearRange: [2024, 1980],
        episodeRange: [150, 12],
        durationRange: [180, 24],
      })
    ).toEqual({
      ...defaultLookupSearchState,
      selectedFormats: ["MOVIE", "TV"],
      yearRange: [1980, 2024],
      episodeRange: [12, 150],
      durationRange: [24, 180],
    })
  })
})
