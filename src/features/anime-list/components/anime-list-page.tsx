import { TooltipProvider } from "@/components/ui/tooltip"
import { AnimeListFilters } from "@/features/anime-list/components/anime-list-filters"
import { AnimeListHero } from "@/features/anime-list/components/anime-list-hero"
import { AnimeListResults } from "@/features/anime-list/components/anime-list-results"
import type { AnimeListController } from "@/features/anime-list/hooks/use-anime-list-controller"
import { cn } from "@/lib/utils"

export function AnimeListPage({
  controller,
}: {
  controller: AnimeListController
}) {
  return (
    <TooltipProvider>
      <main className="min-h-svh overflow-x-clip bg-[linear-gradient(180deg,_var(--background)_0%,_#0b1622_30%,_#0b1622_100%)] bg-fixed text-foreground">
        <section
          className={cn(
            "mx-auto flex min-h-svh w-full max-w-[1520px] flex-col px-4 py-8 sm:px-6 lg:px-8",
            controller.hasResultsState ? "gap-8" : "justify-center"
          )}
        >
          <AnimeListHero
            handleSubmit={controller.handleSubmit}
            hasResultsState={controller.hasResultsState}
            isPending={controller.isPending}
            lookupState={controller.lookupState}
            searchState={controller.searchState}
            updateSearchState={controller.updateSearchState}
          />
          {controller.hasResultsState ? (
            <div className="grid gap-6 animate-in fade-in fill-mode-both duration-500 ease-out lg:grid-cols-[260px_minmax(0,1fr)]">
              <AnimeListFilters
                activeDifficultyBounds={controller.activeDifficultyBounds}
                activeDifficultyRange={controller.activeDifficultyRange}
                availableGenres={controller.facets.availableGenres}
                searchState={controller.searchState}
                updateSearchState={controller.updateSearchState}
              />
              <AnimeListResults
                lookupStateOk={controller.lookupState?.ok === true}
                results={controller.visibleResults}
              />
            </div>
          ) : null}
        </section>
      </main>
    </TooltipProvider>
  )
}
