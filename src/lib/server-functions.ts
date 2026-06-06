import { createServerFn } from "@tanstack/react-start"
import { findAnimeListOverlap } from "@/features/anime-list/server/lookup-anime-list"
import type { AnimeSource } from "@/lib/types"

export const lookupOverlap = createServerFn({ method: "GET" })
  .inputValidator((data: { source: AnimeSource; username: string }) => data)
  .handler(
    async ({ data }: { data: { source: AnimeSource; username: string } }) =>
      findAnimeListOverlap(data.source, data.username)
  )
