import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getResultTitle } from "@/features/anime-list/lib/result-presenters"
import { statusDotClassName, statusLabel } from "@/lib/status"
import type { OverlapResult } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ResultCardSummary({ result }: { result: OverlapResult }) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-background shadow-[0_18px_40px_-30px_rgba(0,0,0,0.95)]">
        <img
          alt={getResultTitle(result)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          src={result.entry.media.coverImage.large}
        />
        <DifficultyBadge result={result} />
      </div>
      <div className="flex items-start gap-2.5 px-0.5">
        <StatusDot status={result.entry.status} />
        <h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-5 text-muted-foreground">
          {getResultTitle(result)}
        </h3>
        {result.matchedJimaku && result.completeness === "incomplete" ? (
          <WarningDot />
        ) : null}
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: keyof typeof statusLabel }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={statusLabel[status]}
          className={cn(
            "mt-1 size-2.5 shrink-0 self-start rounded-full shadow-[0_0_0_3px_rgba(7,15,28,0.55)]",
            statusDotClassName[status]
          )}
          role="img"
        />
      </TooltipTrigger>
      <TooltipContent>{statusLabel[status]}</TooltipContent>
    </Tooltip>
  )
}

function WarningDot() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label="Incomplete Jimaku subtitles"
          className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white"
          role="img"
        >
          !
        </span>
      </TooltipTrigger>
      <TooltipContent>Incomplete Jimaku subtitles</TooltipContent>
    </Tooltip>
  )
}

function DifficultyBadge({ result }: { result: OverlapResult }) {
  if (!result.matchedJpdb && !result.matchedLearnNatively) {
    return null
  }

  return (
    <div className="absolute bottom-2 left-0">
      <div className="h-auto min-w-[90px] rounded-r-md border border-border bg-background/90 px-2.5 py-2 text-xs font-semibold text-foreground shadow-[0_12px_24px_-16px_rgba(0,0,0,0.9)] backdrop-blur-sm">
        {result.matchedJpdb ? (
          <div>{result.matchedJpdb.entry.averageDifficulty}/100</div>
        ) : null}
        {result.matchedLearnNatively ? (
          <div>{result.matchedLearnNatively.jlptEquivalent}</div>
        ) : null}
      </div>
    </div>
  )
}
