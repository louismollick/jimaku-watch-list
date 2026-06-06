import { Label } from "@/components/ui/label"
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox"
import {
  type LookupSearchState,
  serializeGenreValues,
} from "@/features/anime-list/lib/anime-list-search-state"

export function AnimeListGenreFilter({
  availableGenres,
  searchState,
  updateSearchState,
}: {
  availableGenres: Array<{ label: string; value: string }>
  searchState: LookupSearchState
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-label text-muted-foreground">Genres</Label>
      <MultiSelectCombobox
        ariaLabel="Genres"
        onSelectedValuesChange={(nextSelectedValues) =>
          updateSearchState((previousState) => ({
            ...previousState,
            selectedGenres: serializeGenreValues(nextSelectedValues),
          }))
        }
        options={availableGenres}
        placeholder="Any"
        searchPlaceholder="Search genres..."
        selectionMode="intersection"
        selectedValues={new Set(searchState.selectedGenres)}
      />
    </div>
  )
}
