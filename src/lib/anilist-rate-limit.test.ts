import { describe, expect, it } from "vitest"
import { getAniListRateLimitMeta } from "@/lib/anilist-rate-limit"

describe("getAniListRateLimitMeta", () => {
  it("uses retry-after when present", () => {
    const nowMs = Date.parse("2026-06-10T12:00:00.000Z")

    const headers = new Headers({
      "retry-after": "12",
    })

    expect(getAniListRateLimitMeta(headers, nowMs)).toEqual({
      retryAfterMs: 12_000,
      resetAtMs: undefined,
      cooldownUntilMs: nowMs + 12_000,
    })
  })

  it("uses reset header when it is later than retry-after", () => {
    const nowMs = Date.parse("2026-06-10T12:00:00.000Z")

    const headers = new Headers({
      "retry-after": "5",
      "x-ratelimit-reset": `${Math.floor((nowMs + 18_000) / 1000)}`,
    })

    expect(getAniListRateLimitMeta(headers, nowMs)).toEqual({
      retryAfterMs: 5_000,
      resetAtMs: nowMs + 18_000,
      cooldownUntilMs: nowMs + 18_000,
    })
  })

  it("falls back safely when headers are missing or malformed", () => {
    const nowMs = Date.parse("2026-06-10T12:00:00.000Z")

    const headers = new Headers({
      "retry-after": "wat",
      "x-ratelimit-reset": "-1",
    })

    expect(getAniListRateLimitMeta(headers, nowMs)).toEqual({
      retryAfterMs: 10_000,
      resetAtMs: undefined,
      cooldownUntilMs: nowMs + 10_000,
    })
  })
})
