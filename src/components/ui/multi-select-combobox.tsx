"use client"

import { Check, ChevronDown, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Option = {
  label: string
  value: string
}

type MultiSelectComboboxProps = {
  ariaLabel?: string
  emptyText?: string
  onSelectedValuesChange: (selectedValues: Set<string>) => void
  options: Option[]
  placeholder?: string
  searchPlaceholder?: string
  selectionMode?: "intersection" | "union"
  selectedValues: Set<string>
}

export function MultiSelectCombobox({
  ariaLabel,
  emptyText = "No options found.",
  onSelectedValuesChange,
  options,
  placeholder = "Any",
  searchPlaceholder = "Search...",
  selectionMode = "union",
  selectedValues,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const selectedOptions = options.filter((option) =>
    selectedValues.has(option.value)
  )
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase())
  )
  const showPlaceholder =
    selectionMode === "intersection"
      ? selectedOptions.length === 0
      : selectedOptions.length === options.length && options.length > 0

  function normalizeSelectedValues(nextSelectedValues: Set<string>) {
    if (selectionMode === "intersection") {
      return nextSelectedValues
    }

    if (nextSelectedValues.size === 0) {
      return new Set(options.map((option) => option.value))
    }

    return nextSelectedValues
  }

  function removeSelectedValue(value: string) {
    const nextSelectedValues = new Set(selectedValues)
    nextSelectedValues.delete(value)
    onSelectedValuesChange(normalizeSelectedValues(nextSelectedValues))
  }

  return (
    <Popover
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setQuery("")
        }
      }}
      open={open}
    >
      <PopoverTrigger asChild>
        <Button
          aria-label={ariaLabel}
          aria-expanded={open}
          className="h-auto min-h-10 w-full justify-between rounded-md border-border bg-input/60 pr-3 pl-3.5 py-1 text-left text-sm font-normal whitespace-normal text-foreground shadow-none select-text hover:bg-input hover:text-foreground aria-expanded:bg-input aria-expanded:text-foreground"
          role="combobox"
          variant="outline"
        >
          <span className="flex min-w-0 flex-1 items-center">
            {showPlaceholder ? (
              <span className="truncate text-muted-foreground">
                {placeholder}
              </span>
            ) : (
              <span className="-ml-1 flex flex-wrap gap-2">
                {selectedOptions.map((option) => (
                  <span
                    className="inline-flex h-8 max-w-full items-center gap-1.5 rounded-md bg-background/50 p-2 text-sm text-foreground"
                    key={option.value}
                  >
                    <span className="truncate">{option.label}</span>
                    <span
                      aria-hidden="true"
                      className="rounded-sm text-muted-foreground transition hover:text-foreground"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        removeSelectedValue(option.value)
                      }}
                    >
                      <X className="size-2.5" />
                    </span>
                  </span>
                ))}
              </span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 self-center text-muted-foreground opacity-90" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <div className="border-b border-border p-3">
          <Input
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            value={query}
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.has(option.value)

              return (
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground select-text hover:bg-accent hover:text-accent-foreground"
                  key={option.value}
                  onClick={() => {
                    const nextSelectedValues = new Set(selectedValues)

                    if (isSelected) {
                      nextSelectedValues.delete(option.value)
                    } else {
                      nextSelectedValues.add(option.value)
                    }

                    onSelectedValuesChange(
                      normalizeSelectedValues(nextSelectedValues)
                    )
                  }}
                  type="button"
                >
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-sm border border-border",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent text-transparent"
                    )}
                  >
                    <Check className="size-3" />
                  </span>
                  <span>{option.label}</span>
                </button>
              )
            })
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
