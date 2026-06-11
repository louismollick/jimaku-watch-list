import {
  type AnimeFormat,
  animeFormats,
} from "@/features/anime-list/domain/anime-list-enums"
import type { NumericRange } from "@/features/anime-list/lib/range-utils"

export const minAnimeYear = 1970
export const maxEpisodeFilterValue = 150
export const maxDurationFilterValue = 180

export const episodeFilterBounds = [0, maxEpisodeFilterValue] as NumericRange
export const durationFilterBounds = [0, maxDurationFilterValue] as NumericRange

export const animeFormatLabels: Record<AnimeFormat, string> = {
  TV: "TV Show",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
}

const myAnimeListToAniListFormat: Record<string, AnimeFormat | null> = {
  tv: "TV",
  tv_special: "SPECIAL",
  movie: "MOVIE",
  special: "SPECIAL",
  ova: "OVA",
  ona: "ONA",
  music: "MUSIC",
}

export function getCurrentAnimeYear(now = new Date()) {
  return now.getFullYear()
}

export function getYearFilterBounds(now = new Date()) {
  return [minAnimeYear, getCurrentAnimeYear(now)] as NumericRange
}

export function getAnimeFormatOptions() {
  return animeFormats.map((value) => ({
    label: animeFormatLabels[value],
    value,
  }))
}

export function normalizeAnimeFormat(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const normalizedValue = value.trim().toUpperCase().replaceAll("-", "_")

  if (animeFormats.includes(normalizedValue as AnimeFormat)) {
    return normalizedValue as AnimeFormat
  }

  return myAnimeListToAniListFormat[value.trim().toLowerCase()] ?? null
}

export function serializeAnimeFormatValues(values: Iterable<string>) {
  const allowedSet = new Set<string>(animeFormats)

  return [...new Set(values)]
    .filter((value): value is AnimeFormat => allowedSet.has(value))
    .sort(
      (left, right) => animeFormats.indexOf(left) - animeFormats.indexOf(right)
    )
}

export function getEffectiveSelectedFormats(selectedFormats: string[]) {
  return selectedFormats.length > 0 ? selectedFormats : [...animeFormats]
}

export function hasUnboundedUpperBound(range: NumericRange, maxValue: number) {
  return range[1] >= maxValue
}
