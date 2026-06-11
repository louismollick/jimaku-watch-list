const defaultRetryAfterMs = 10_000

export type AniListRateLimitMeta = {
  retryAfterMs: number
  resetAtMs?: number
  cooldownUntilMs: number
  rateLimitLimit?: number
  rateLimitRemaining?: number
}

function parseSecondsHeader(value: string | null) {
  if (!value) {
    return null
  }

  const seconds = Number(value)

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null
  }

  return Math.round(seconds * 1000)
}

function parseEpochSecondsHeader(value: string | null) {
  if (!value) {
    return null
  }

  const seconds = Number(value)

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null
  }

  return Math.round(seconds * 1000)
}

function parseIntegerHeader(value: string | null) {
  if (!value) {
    return null
  }

  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null
  }

  return Math.round(parsedValue)
}

export function getAniListRateLimitMeta(
  headers: Headers,
  nowMs = Date.now()
): AniListRateLimitMeta {
  const retryAfterMs =
    parseSecondsHeader(headers.get("retry-after")) ?? defaultRetryAfterMs
  const resetAtMs = parseEpochSecondsHeader(headers.get("x-ratelimit-reset"))
  const rateLimitLimit = parseIntegerHeader(headers.get("x-ratelimit-limit"))
  const rateLimitRemaining = parseIntegerHeader(
    headers.get("x-ratelimit-remaining")
  )
  const cooldownUntilMs = Math.max(nowMs + retryAfterMs, resetAtMs ?? 0)

  return {
    retryAfterMs,
    resetAtMs: resetAtMs ?? undefined,
    cooldownUntilMs,
    rateLimitLimit: rateLimitLimit ?? undefined,
    rateLimitRemaining: rateLimitRemaining ?? undefined,
  }
}
