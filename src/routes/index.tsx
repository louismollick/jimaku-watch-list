import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { AnimeListRoute } from "@/features/anime-list/components/anime-list-route"
import { lookupAnimeList } from "@/features/anime-list/server/lookup-anime-list"
import {
  defaultLookupSearchState,
  type LookupSearchState,
  validateLookupSearch,
} from "@/lib/search-state"

export const Route = createFileRoute("/")({
  search: {
    middlewares: [stripSearchParams(defaultLookupSearchState)],
  },
  validateSearch: validateLookupSearch,
  component: App,
})

function App() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <AnimeListRoute
      lookup={lookupAnimeList}
      onSearchStateChange={(updater) =>
        navigate({
          replace: true,
          resetScroll: false,
          search: (previousSearch) =>
            updater(previousSearch as LookupSearchState),
        })
      }
      searchState={search}
    />
  )
}
