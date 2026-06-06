import { render } from "@testing-library/react"
import { useState } from "react"
import { vi } from "vitest"
import { AnimeListRoute } from "@/features/anime-list/components/anime-list-route"
import {
  defaultLookupSearchState,
  type LookupSearchState,
} from "@/features/anime-list/lib/anime-list-search-state"
import { successResponse } from "@/features/anime-list/tests/test-data"
import type { LookupResponse } from "@/lib/types"

export function mockViewport({ isMobile }: { isMobile: boolean }) {
  return vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: isMobile && query === "(max-width: 1023px)",
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false
    },
  }))
}

export function renderAnimeList({
  lookup = vi.fn().mockResolvedValue(successResponse()),
  onSearchState,
  searchState = {},
}: {
  lookup?: (input: {
    data: { source: "anilist" | "myanimelist"; username: string }
  }) => Promise<LookupResponse>
  onSearchState?: (state: LookupSearchState) => void
  searchState?: Partial<LookupSearchState>
}) {
  function Harness() {
    const [state, setState] = useState<LookupSearchState>({
      ...defaultLookupSearchState,
      ...searchState,
    })

    return (
      <AnimeListRoute
        lookup={lookup}
        onSearchStateChange={(updater) =>
          setState((previousState) => {
            const nextState = updater(previousState)
            onSearchState?.(nextState)
            return nextState
          })
        }
        searchState={state}
      />
    )
  }

  return { lookup, ...render(<Harness />) }
}
