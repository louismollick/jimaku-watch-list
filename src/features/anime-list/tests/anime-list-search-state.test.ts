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
        selectedGenres: ["Mystery", "Comedy", "Mystery"],
      })
    ).toEqual({
      source: "myanimelist",
      username: "Mollicl",
      titleQuery: "apothecary!!",
      selectedStatuses: ["CURRENT", "PLANNING"],
      selectedMediaStatuses: ["RELEASING"],
      selectedGenres: ["comedy", "mystery"],
    })
  })

  it("accepts case-insensitive enum values", () => {
    expect(
      validateLookupSearch({ source: "MYANIMELIST", sortDirection: "ASC" })
    ).toEqual({
      ...defaultLookupSearchState,
      source: "myanimelist",
      sortDirection: "asc",
    })
  })
})
