import { useCallback, useEffect, useState } from "react"
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
  const isControlled =
    searchState !== undefined && onSearchStateChange !== undefined
  const [localSearchState, setLocalSearchState] = useState(
    () => searchState ?? defaultLookupSearchState
  )

  useEffect(() => {
    if (!isControlled && searchState) {
      setLocalSearchState(searchState)
    }
  }, [isControlled, searchState])

  const activeSearchState = isControlled ? searchState : localSearchState

  const updateSearchState = useCallback(
    (updater: (previousState: LookupSearchState) => LookupSearchState) => {
      if (isControlled) {
        onSearchStateChange(updater)
        return
      }

      setLocalSearchState(updater)
    },
    [isControlled, onSearchStateChange]
  )

  return { activeSearchState, updateSearchState }
}
