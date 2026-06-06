import { useRef } from "react"
import { AnimeListPage } from "@/features/anime-list/components/anime-list-page"
import {
  type AnimeListLookup,
  useAnimeListController,
} from "@/features/anime-list/hooks/use-anime-list-controller"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { getLookupIdentity } from "@/features/anime-list/lib/anime-list-search-state-identity"

export function AnimeListRoute({
  lookup,
  onSearchStateChange,
  searchState,
}: {
  lookup: AnimeListLookup
  onSearchStateChange: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
  searchState: LookupSearchState
}) {
  const initialAutoLookupIdentity = useRef(
    searchState.username.trim() ? getLookupIdentity(searchState) : null
  )
  const controller = useAnimeListController({
    autoLookupIdentity: initialAutoLookupIdentity.current,
    lookup,
    onSearchStateChange,
    searchState,
  })

  return <AnimeListPage controller={controller} />
}
