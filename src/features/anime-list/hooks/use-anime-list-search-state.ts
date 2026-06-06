import { useCallback, useState } from "react"
import {
  defaultLookupSearchState,
  type LookupSearchState,
} from "@/features/anime-list/lib/anime-list-search-state"

export function useAnimeListSearchState({
  onSearchStateChange,
  searchState,
}: {
  onSearchStateChange?: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
  searchState?: LookupSearchState
}) {
  const [localSearchState, setLocalSearchState] = useState(
    defaultLookupSearchState
  )
  const activeSearchState = searchState ?? localSearchState

  const updateSearchState = useCallback(
    (updater: (previousState: LookupSearchState) => LookupSearchState) => {
      if (onSearchStateChange) {
        onSearchStateChange(updater)
        return
      }

      setLocalSearchState(updater)
    },
    [onSearchStateChange]
  )

  return { activeSearchState, updateSearchState }
}
