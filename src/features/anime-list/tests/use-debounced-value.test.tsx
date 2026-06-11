import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useDebouncedValue } from "@/features/anime-list/hooks/use-debounced-value"

afterEach(() => {
  vi.useRealTimers()
})

describe("useDebouncedValue", () => {
  it("only commits the latest rapid change after the debounce window", async () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      {
        initialProps: { value: "a" },
      }
    )

    rerender({ value: "ab" })
    rerender({ value: "abc" })

    expect(result.current).toBe("a")

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(result.current).toBe("abc")
  })
})
