import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type SortDirection,
  sortDirections,
} from "@/features/anime-list/domain/anime-list-enums"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"
import {
  sortDirectionLabels,
  sortOptionLabels,
} from "@/features/anime-list/lib/labels"

export function AnimeListSortControls({
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
      <div className="flex items-center justify-between gap-3">
        <Label className="text-label text-muted-foreground">Sort by</Label>
        <Tabs
          className="gap-0"
          onValueChange={(value) =>
            updateSearchState((previousState) => ({
              ...previousState,
              sortDirection: value as SortDirection,
            }))
          }
          value={searchState.sortDirection}
        >
          <TabsList aria-label="Sort direction">
            {sortDirections.map((direction) => (
              <TabsTrigger
                aria-label={sortDirectionLabels[direction]}
                key={direction}
                value={direction}
              >
                {sortDirectionLabels[direction]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <Select
        onValueChange={(value) =>
          updateSearchState((previousState) => ({
            ...previousState,
            sortBy: value as LookupSearchState["sortBy"],
          }))
        }
        value={searchState.sortBy}
      >
        <SelectTrigger aria-label="Sort by" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="w-[var(--radix-select-trigger-width)]"
          position="popper"
        >
          {Object.entries(sortOptionLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
