import { ResultCard } from "@/features/anime-list/components/result-card"
import type { OverlapResult } from "@/features/anime-list/domain/lookup-response"

export function AnimeListResults({
  lookupStateOk,
  results,
}: {
  lookupStateOk: boolean
  results: OverlapResult[]
}) {
  return (
    <section className="space-y-4">
      {lookupStateOk ? (
        <div className="text-sm text-muted-foreground">
          Showing {results.length} result{results.length === 1 ? "" : "s"}
        </div>
      ) : null}
      {results.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
          {results.map((result) => (
            <ResultCard
              key={`${result.entry.source}-${result.entry.id}`}
              result={result}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
