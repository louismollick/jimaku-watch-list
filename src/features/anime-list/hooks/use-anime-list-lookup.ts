import { useServerFn } from "@tanstack/react-start"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { AnimeSource } from "@/features/anime-list/domain/anime-list-enums"
import type { LookupResponse } from "@/features/anime-list/domain/lookup-response"
import type { AnimeListLookup } from "@/features/anime-list/hooks/use-anime-list-controller"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { browseAniListPage } from "@/features/anime-list/server/browse-anilist"

const retryJitterMinMs = 250
const retryJitterRangeMs = 500

type LookupUiStatus = {
  cooldownRemainingMs: number | null
  isRetrying: boolean
  retryAtMs: number | null
  retryMessage: string | null
}

type LookupRequestDescriptor = {
  kind: "lookup"
  source: AnimeSource
  username: string
}

type BrowseRequestDescriptor = {
  kind: "browse"
  page: number
  reset: boolean
  searchState: LookupSearchState
}

type PendingAniListRequest = {
  actionId: number
  ownerId: number
  request: LookupRequestDescriptor | BrowseRequestDescriptor
}

type LookupError = Exclude<LookupResponse, { ok: true }>
type RateLimitedLookupError = LookupError & {
  code: "RATE_LIMITED"
}

let nextOwnerId = 1
let sharedCooldownUntilMs: number | null = null
let sharedPendingAniListRequest: PendingAniListRequest | null = null

const sharedCooldownListeners = new Set<() => void>()

function emitSharedCooldownChange() {
  for (const listener of sharedCooldownListeners) {
    listener()
  }
}

function subscribeToSharedCooldown(listener: () => void) {
  sharedCooldownListeners.add(listener)

  return () => {
    sharedCooldownListeners.delete(listener)
  }
}

function isAniListCooldownActive(nowMs = Date.now()) {
  return sharedCooldownUntilMs !== null && sharedCooldownUntilMs > nowMs
}

function setAniListCooldownUntil(cooldownUntilMs: number | null) {
  sharedCooldownUntilMs = cooldownUntilMs
  emitSharedCooldownChange()
}

function setPendingAniListRequest(request: PendingAniListRequest | null) {
  sharedPendingAniListRequest = request
  emitSharedCooldownChange()
}

function clearPendingAniListRequest(ownerId: number) {
  if (sharedPendingAniListRequest?.ownerId !== ownerId) {
    return
  }

  setPendingAniListRequest(null)
}

function getRetryDelayMs(retryAtMs: number, nowMs = Date.now()) {
  return Math.max(retryAtMs - nowMs, 0)
}

function formatRetryMessage(cooldownRemainingMs: number | null) {
  if (cooldownRemainingMs === null) {
    return null
  }

  const seconds = Math.max(1, Math.ceil(cooldownRemainingMs / 1000))
  return `Rate limited. Retrying in ${seconds}s...`
}

function getLookupUiStatus(nowMs = Date.now()): LookupUiStatus {
  if (!isAniListCooldownActive(nowMs)) {
    return {
      cooldownRemainingMs: null,
      isRetrying: false,
      retryAtMs: null,
      retryMessage: null,
    }
  }

  const retryAtMs = sharedCooldownUntilMs
  const cooldownRemainingMs =
    retryAtMs === null ? null : getRetryDelayMs(retryAtMs, nowMs)

  return {
    cooldownRemainingMs,
    isRetrying: true,
    retryAtMs,
    retryMessage: formatRetryMessage(cooldownRemainingMs),
  }
}

function randomRetryJitterMs() {
  return retryJitterMinMs + Math.round(Math.random() * retryJitterRangeMs)
}

function isRateLimitedError(
  response: LookupError
): response is RateLimitedLookupError {
  return response.code === "RATE_LIMITED"
}

export function useAnimeListLookup(lookup: AnimeListLookup) {
  const lookupFn = useServerFn(lookup)
  const browseFn = useServerFn(browseAniListPage)
  const ownerIdRef = useRef(nextOwnerId++)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)
  const [lookupState, setLookupState] = useState<LookupResponse | null>(null)
  const [browseResults, setBrowseResults] = useState<
    Extract<LookupResponse, { ok: true }>["results"]
  >([])
  const [isPending, setIsPending] = useState(false)
  const [, setCooldownVersion] = useState(0)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const successfulLookupStateRef = useRef<Extract<
    LookupResponse,
    { ok: true }
  > | null>(null)

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToSharedCooldown(() => {
      setCooldownVersion((previous) => previous + 1)
      setNowMs(Date.now())
    })

    return () => {
      unsubscribe()
      clearRetryTimer()
      clearPendingAniListRequest(ownerIdRef.current)
    }
  }, [clearRetryTimer])

  const lookupStatus = useMemo(() => getLookupUiStatus(nowMs), [nowMs])

  useEffect(() => {
    if (!lookupStatus.isRetrying) {
      return
    }

    const intervalId = setInterval(() => {
      setNowMs(Date.now())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [lookupStatus.isRetrying])

  const commitSuccess = useCallback(
    (response: Extract<LookupResponse, { ok: true }>) => {
      successfulLookupStateRef.current = response
      setLookupState(response)
    },
    []
  )

  const commitError = useCallback((response: LookupError) => {
    setLookupState(response)
  }, [])

  const queueAniListRetry = useCallback(
    (
      actionId: number,
      request: LookupRequestDescriptor | BrowseRequestDescriptor,
      response: RateLimitedLookupError
    ) => {
      setAniListCooldownUntil(response.cooldownUntilMs ?? null)
      setPendingAniListRequest({
        actionId,
        ownerId: ownerIdRef.current,
        request,
      })

      if (!successfulLookupStateRef.current) {
        setLookupState(null)
      }
    },
    []
  )

  const executeLookup = useCallback(
    async ({
      actionId,
      source,
      username,
    }: {
      actionId: number
      source: AnimeSource
      username: string
    }) => {
      setIsPending(true)

      try {
        const response = await lookupFn({
          data: { source, username },
        })

        if (requestIdRef.current !== actionId) {
          return
        }

        if (response.ok) {
          commitSuccess(response)
          return
        }

        if (source === "anilist" && isRateLimitedError(response)) {
          queueAniListRetry(
            actionId,
            { kind: "lookup", source, username },
            response
          )
          return
        }

        commitError(response)
      } catch (error) {
        console.error("Anime list lookup failed", error)

        if (requestIdRef.current !== actionId) {
          return
        }

        commitError({
          ok: false,
          code: "UPSTREAM_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Lookup failed. Try again.",
        })
      } finally {
        if (requestIdRef.current === actionId) {
          setIsPending(false)
        }
      }
    },
    [commitError, commitSuccess, lookupFn, queueAniListRetry]
  )

  const executeBrowse = useCallback(
    async ({
      actionId,
      page,
      reset,
      searchState,
    }: {
      actionId: number
      page: number
      reset: boolean
      searchState: LookupSearchState
    }) => {
      setIsPending(true)

      try {
        const response = await browseFn({
          data: {
            username: searchState.username.trim(),
            page,
            search: {
              titleQuery: searchState.titleQuery,
              myAnimeFilterMode: searchState.myAnimeFilterMode,
              selectedGenres: searchState.selectedGenres,
              selectedMediaStatuses: searchState.selectedMediaStatuses,
              selectedFormats: searchState.selectedFormats,
              selectedSubtitleAvailability:
                searchState.selectedSubtitleAvailability,
              yearRange: searchState.yearRange,
              episodeRange: searchState.episodeRange,
              durationRange: searchState.durationRange,
              sortBy: searchState.sortBy,
              sortDirection: searchState.sortDirection,
            },
          },
        })

        if (requestIdRef.current !== actionId) {
          return
        }

        if (response.ok) {
          setBrowseResults((previousResults) => {
            const nextResults = reset
              ? response.results
              : [...previousResults, ...response.results].filter(
                  (result, index, allResults) =>
                    allResults.findIndex(
                      (candidate) =>
                        candidate.entry.media.id === result.entry.media.id
                    ) === index
                )

            const nextLookupState = { ...response, results: nextResults }
            successfulLookupStateRef.current = nextLookupState
            setLookupState(nextLookupState)
            return nextResults
          })
          return
        }

        if (isRateLimitedError(response)) {
          queueAniListRetry(
            actionId,
            { kind: "browse", page, reset, searchState },
            response
          )
          return
        }

        if (reset) {
          setBrowseResults([])
        }

        commitError(response)
      } catch (error) {
        console.error("AniList browse failed", error)

        if (requestIdRef.current !== actionId) {
          return
        }

        commitError({
          ok: false,
          code: "UPSTREAM_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Lookup failed. Try again.",
        })
      } finally {
        if (requestIdRef.current === actionId) {
          setIsPending(false)
        }
      }
    },
    [browseFn, commitError, queueAniListRetry]
  )

  const executePendingAniListRequest = useCallback(async () => {
    const pendingRequest = sharedPendingAniListRequest

    if (
      !pendingRequest ||
      pendingRequest.ownerId !== ownerIdRef.current ||
      isAniListCooldownActive()
    ) {
      return
    }

    clearPendingAniListRequest(ownerIdRef.current)

    if (pendingRequest.request.kind === "lookup") {
      await executeLookup({
        actionId: pendingRequest.actionId,
        source: pendingRequest.request.source,
        username: pendingRequest.request.username,
      })
      return
    }

    await executeBrowse({
      actionId: pendingRequest.actionId,
      page: pendingRequest.request.page,
      reset: pendingRequest.request.reset,
      searchState: pendingRequest.request.searchState,
    })
  }, [executeBrowse, executeLookup])

  useEffect(() => {
    clearRetryTimer()

    if (!lookupStatus.retryAtMs) {
      return
    }

    if (sharedPendingAniListRequest?.ownerId !== ownerIdRef.current) {
      return
    }

    retryTimerRef.current = setTimeout(() => {
      void executePendingAniListRequest()
    }, getRetryDelayMs(lookupStatus.retryAtMs) + randomRetryJitterMs())

    return clearRetryTimer
  }, [clearRetryTimer, executePendingAniListRequest, lookupStatus.retryAtMs])

  const runLookup = useCallback(
    async (source: AnimeSource, username: string) => {
      const trimmedUsername = username.trim()

      if (!trimmedUsername) {
        setLookupState({
          ok: false,
          code: "UPSTREAM_ERROR",
          message: "Enter a username.",
        })
        return
      }

      const actionId = requestIdRef.current + 1
      requestIdRef.current = actionId

      if (source !== "anilist") {
        clearPendingAniListRequest(ownerIdRef.current)
        setIsPending(false)
        await executeLookup({ actionId, source, username: trimmedUsername })
        return
      }

      if (isAniListCooldownActive()) {
        setPendingAniListRequest({
          actionId,
          ownerId: ownerIdRef.current,
          request: { kind: "lookup", source, username: trimmedUsername },
        })
        setIsPending(false)
        setNowMs(Date.now())
        return
      }

      await executeLookup({ actionId, source, username: trimmedUsername })
    },
    [executeLookup]
  )

  const runBrowse = useCallback(
    async ({
      page,
      reset,
      searchState,
    }: {
      page: number
      reset: boolean
      searchState: LookupSearchState
    }) => {
      const trimmedUsername = searchState.username.trim()

      if (!trimmedUsername) {
        setLookupState({
          ok: false,
          code: "UPSTREAM_ERROR",
          message: "Enter a username.",
        })
        return
      }

      const actionId = requestIdRef.current + 1
      requestIdRef.current = actionId
      const nextSearchState = { ...searchState, username: trimmedUsername }

      if (isAniListCooldownActive()) {
        setPendingAniListRequest({
          actionId,
          ownerId: ownerIdRef.current,
          request: {
            kind: "browse",
            page,
            reset,
            searchState: nextSearchState,
          },
        })
        setIsPending(false)
        setNowMs(Date.now())
        return
      }

      await executeBrowse({
        actionId,
        page,
        reset,
        searchState: nextSearchState,
      })
    },
    [executeBrowse]
  )

  const cancelAniListRetry = useCallback(() => {
    clearPendingAniListRequest(ownerIdRef.current)
    setNowMs(Date.now())
  }, [])

  return {
    browseResults,
    cancelAniListRetry,
    isPending,
    lookupState,
    lookupStatus,
    runBrowse,
    runLookup,
  }
}
