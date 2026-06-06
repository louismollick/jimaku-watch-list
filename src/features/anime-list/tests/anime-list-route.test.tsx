import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { renderAnimeList } from "@/features/anime-list/tests/render-anime-list"
import { successResponse } from "@/features/anime-list/tests/test-data"

describe("AnimeListRoute", () => {
  it("auto-runs lookup for initial username and shows freshness", async () => {
    const lookup = vi.fn().mockResolvedValue(successResponse())
    renderAnimeList({ lookup, searchState: { username: "mollicl" } })

    await waitFor(() =>
      expect(lookup).toHaveBeenCalledWith({
        data: { source: "anilist", username: "mollicl" },
      })
    )
    expect(await screen.findByText(/entries scanned/i)).toBeInTheDocument()
  })

  it("writes search state through the route callback", async () => {
    const states: string[] = []
    renderAnimeList({
      onSearchState: (state) => states.push(state.username),
    })

    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: "orb" },
    })

    await waitFor(() => expect(states.at(-1)).toBe("orb"))
  })
})
