import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useAnimeListSearchState } from "@/features/anime-list/hooks/use-anime-list-search-state"
import { defaultLookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"

describe("useAnimeListSearchState", () => {
  it("uses controlled-mode callback without mutating local state", () => {
    const searchState = {
      ...defaultLookupSearchState,
      username: "controlled-user",
    }
    const onSearchStateChange = vi.fn()
    const { result } = renderHook(() =>
      useAnimeListSearchState({ searchState, onSearchStateChange })
    )

    act(() => {
      result.current.updateSearchState((previousState) => ({
        ...previousState,
        username: "updated-user",
      }))
    })

    expect(onSearchStateChange).toHaveBeenCalledOnce()

    const updater = onSearchStateChange.mock.calls[0]?.[0]
    expect(updater).toBeTypeOf("function")
    expect(
      updater({
        ...defaultLookupSearchState,
        username: "before-update",
      }).username
    ).toBe("updated-user")
    expect(result.current.activeSearchState).toBe(searchState)
    expect(result.current.activeSearchState.username).toBe("controlled-user")
  })

  it("treats searchState without onSearchStateChange as uncontrolled after init", () => {
    const initialSearchState = {
      ...defaultLookupSearchState,
      username: "initial-user",
    }
    const { result } = renderHook(() =>
      useAnimeListSearchState({ searchState: initialSearchState })
    )

    act(() => {
      result.current.updateSearchState((previousState) => ({
        ...previousState,
        username: "updated-user",
      }))
    })

    expect(result.current.activeSearchState.username).toBe("updated-user")
  })

  it("syncs local state when uncontrolled searchState input changes", () => {
    const { result, rerender } = renderHook(
      ({ searchState }: { searchState: typeof defaultLookupSearchState }) =>
        useAnimeListSearchState({ searchState }),
      {
        initialProps: {
          searchState: {
            ...defaultLookupSearchState,
            username: "first-user",
          },
        },
      }
    )

    rerender({
      searchState: {
        ...defaultLookupSearchState,
        username: "second-user",
      },
    })

    expect(result.current.activeSearchState.username).toBe("second-user")
  })
})
