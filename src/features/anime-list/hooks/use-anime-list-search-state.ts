import { useCallback, useEffect, useRef, useState } from "react"
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
  const hiddenStatusesRef = useRef<
    LookupSearchState["selectedStatuses"] | null
  >(null)

  useEffect(() => {
    if (!isControlled && searchState) {
      setLocalSearchState(searchState)
    }
  }, [isControlled, searchState])

  const activeSearchState = isControlled ? searchState : localSearchState

  const updateSearchState = useCallback(
    (updater: (previousState: LookupSearchState) => LookupSearchState) => {
      const wrapUpdater = (previousState: LookupSearchState) => {
        const nextState = updater(previousState)

        if (
          previousState.myAnimeFilterMode !== "hideMine" &&
          nextState.myAnimeFilterMode === "hideMine"
        ) {
          hiddenStatusesRef.current = previousState.selectedStatuses

          return {
            ...nextState,
            selectedStatuses: defaultLookupSearchState.selectedStatuses,
          }
        }

        if (
          previousState.myAnimeFilterMode === "hideMine" &&
          nextState.myAnimeFilterMode !== "hideMine" &&
          hiddenStatusesRef.current
        ) {
          const restoredStatuses = hiddenStatusesRef.current
          hiddenStatusesRef.current = null

          return {
            ...nextState,
            selectedStatuses: restoredStatuses,
          }
        }

        return nextState
      }

      if (isControlled) {
        onSearchStateChange(wrapUpdater)
        return
      }

      setLocalSearchState(wrapUpdater)
    },
    [isControlled, onSearchStateChange]
  )

  return { activeSearchState, updateSearchState }
}
