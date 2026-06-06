import { Label } from "@/components/ui/label"
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox"
import type { LookupSearchState } from "@/features/anime-list/lib/anime-list-search-state"

export function AnimeListMultiFilter({
  ariaLabel,
  label,
  options,
  selectedValues,
  updateSearchState,
  updateState,
}: {
  ariaLabel: string
  label: string
  options: Array<{ label: string; value: string }>
  selectedValues: Set<string>
  updateSearchState: (
    updater: (previousState: LookupSearchState) => LookupSearchState
  ) => void
  updateState: (nextSelectedValues: Set<string>) => Partial<LookupSearchState>
}) {
  return (
    <div className="space-y-2">
      <Label className="text-label text-muted-foreground">{label}</Label>
      <MultiSelectCombobox
        ariaLabel={ariaLabel}
        onSelectedValuesChange={(nextSelectedValues) =>
          updateSearchState((previousState) => ({
            ...previousState,
            ...updateState(nextSelectedValues as Set<string>),
          }))
        }
        options={options}
        placeholder="Any"
        searchPlaceholder={`Search ${label.toLowerCase()}...`}
        selectedValues={selectedValues}
      />
    </div>
  )
}
