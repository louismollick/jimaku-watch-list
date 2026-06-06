import { useServerFn } from "@tanstack/react-start"
import { useCallback, useState } from "react"
import type { AnimeSource } from "@/features/anime-list/domain/anime-list-enums"
import type { LookupResponse } from "@/features/anime-list/domain/lookup-response"
import type { AnimeListLookup } from "@/features/anime-list/hooks/use-anime-list-controller"

export function useAnimeListLookup(lookup: AnimeListLookup) {
  const lookupFn = useServerFn(lookup)
  const [lookupState, setLookupState] = useState<LookupResponse | null>(null)
  const [isPending, setIsPending] = useState(false)

  const runLookup = useCallback(
    async (source: AnimeSource, username: string) => {
      const nextUsername = username.trim()

      if (!nextUsername) {
        setLookupState({
          ok: false,
          code: "UPSTREAM_ERROR",
          message: "Enter a username.",
        })
        return
      }

      setIsPending(true)

      try {
        setLookupState(
          await lookupFn({ data: { source, username: nextUsername } })
        )
      } finally {
        setIsPending(false)
      }
    },
    [lookupFn]
  )

  return { isPending, lookupState, runLookup }
}
