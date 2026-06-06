import lookupResponseFixture from "@/features/anime-list/tests/fixtures/lookup-response.json"
import type { LookupResponse } from "@/lib/types"

export function successResponse(): LookupResponse {
  return structuredClone(lookupResponseFixture as LookupResponse)
}
