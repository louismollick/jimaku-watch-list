import { AlertCircle } from "lucide-react"
import { LookupFreshness } from "@/features/anime-list/components/lookup-freshness"

export function AnimeListLookupStatus({
  lookupState,
}: {
  lookupState: {
    ok: boolean
    code?: string
    fetchedAt?: string
    message?: string
    totalAnime?: number
    userListAnimeCount?: number
    browseMeta?: {
      isGlobalBrowse: boolean
    }
  } | null
}) {
  if (lookupState && !lookupState.ok) {
    if (lookupState.code === "RATE_LIMITED") {
      return null
    }

    return (
      <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-lg border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-200">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <p>{lookupState.message}</p>
      </div>
    )
  }

  if (lookupState?.ok && lookupState.fetchedAt) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="flex flex-wrap items-center justify-center gap-1.5">
          {lookupState.userListAnimeCount !== undefined ? (
            <>
              <span>{lookupState.userListAnimeCount} anime in user list</span>
              <span aria-hidden="true">•</span>
            </>
          ) : null}
          <LookupFreshness fetchedAt={lookupState.fetchedAt} />
        </span>
      </div>
    )
  }

  return null
}
