import { useEffect, useRef } from "react"
import type { AnimeSource } from "@/features/anime-list/domain/anime-list-enums"

export function useAutoLookup({
  activeLookupIdentity,
  autoLookupIdentity,
  runLookup,
  source,
  username,
}: {
  activeLookupIdentity: string
  autoLookupIdentity: string | null
  runLookup: (source: AnimeSource, username: string) => Promise<void>
  source: AnimeSource
  username: string
}) {
  const autoLookupPerformedRef = useRef(false)

  useEffect(() => {
    if (autoLookupPerformedRef.current || !autoLookupIdentity) {
      return
    }

    if (activeLookupIdentity !== autoLookupIdentity) {
      return
    }

    autoLookupPerformedRef.current = true
    void runLookup(source, username)
  }, [activeLookupIdentity, autoLookupIdentity, runLookup, source, username])
}
