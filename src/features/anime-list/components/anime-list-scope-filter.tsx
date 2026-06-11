import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { myAnimeFilterModes } from "@/features/anime-list/domain/anime-list-enums"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import { myAnimeFilterModeLabels } from "@/features/anime-list/lib/labels"

export function AnimeListScopeFilter({
  searchState,
  updateSearchState,
}: {
  searchState: LookupSearchState
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-label text-muted-foreground">AniList scope</Label>
      <Select
        onValueChange={(value) =>
          updateSearchState((previousState) => ({
            ...previousState,
            myAnimeFilterMode: value as LookupSearchState["myAnimeFilterMode"],
          }))
        }
        value={searchState.myAnimeFilterMode}
      >
        <SelectTrigger aria-label="AniList scope" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="w-[var(--radix-select-trigger-width)]"
          position="popper"
        >
          {myAnimeFilterModes.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {myAnimeFilterModeLabels[mode]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
