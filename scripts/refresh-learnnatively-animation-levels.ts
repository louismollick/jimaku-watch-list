import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

type LearnNativelyAnimationLevelEntry = {
  learnnativelyUrl: string
  name: string
  level: string
}

type LearnNativelySearchPage = {
  num_of_pages: number
  page: number
  results: LearnNativelySearchResult[]
  total_count: number
}

type LearnNativelySearchResult = {
  item?: {
    rating?: {
      lvl?: number
    }
    title?: string
    url?: string
  }
}

const rootDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(
  rootDirectory,
  "../src/data/learnnatively-animation-levels.json"
)
const baseUrl = "https://learnnatively.com/api/ninja/search/videos/"
const expectedPageCount = 52
const delayMs = 1500
const jitterMs = 500

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

function randomDelay() {
  return delayMs + Math.floor(Math.random() * (jitterMs + 1))
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "nani-next/1.0 (+https://github.com/louismollick/nani-next)",
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`)
  }

  return (await response.json()) as LearnNativelySearchPage
}

function createPageUrl(page: number) {
  const url = new URL(baseUrl)
  url.searchParams.set("language", "jpn")
  url.searchParams.set("p", String(page))
  url.searchParams.set("ntags", "animation")
  return url.toString()
}

function parsePageEntries(
  page: LearnNativelySearchPage
): LearnNativelyAnimationLevelEntry[] {
  return page.results.map((result, index) => {
    const item = result.item

    if (!item) {
      throw new Error(
        `Missing item payload on page ${page.page} at result index ${index}`
      )
    }

    if (!item.url) {
      throw new Error(
        `Missing item.url on page ${page.page} at result index ${index}`
      )
    }

    if (!item.title) {
      throw new Error(
        `Missing item.title for ${item.url} on page ${page.page} at result index ${index}`
      )
    }

    if (typeof item.rating?.lvl !== "number") {
      throw new Error(
        `Missing item.rating.lvl for ${item.url} on page ${page.page} at result index ${index}`
      )
    }

    return {
      learnnativelyUrl: new URL(
        item.url,
        "https://learnnatively.com"
      ).toString(),
      name: item.title,
      level: `L${item.rating.lvl}`,
    }
  })
}

async function main() {
  const entries: LearnNativelyAnimationLevelEntry[] = []
  const seenUrls = new Set<string>()
  let totalCount: number | null = null
  let expectedResultsCount = 0

  for (let pageNumber = 1; pageNumber <= expectedPageCount; pageNumber += 1) {
    const page = await fetchJson(createPageUrl(pageNumber))

    if (page.page !== pageNumber) {
      throw new Error(`Expected page ${pageNumber}, got ${page.page}`)
    }

    if (page.num_of_pages !== expectedPageCount) {
      throw new Error(
        `Expected ${expectedPageCount} pages, got ${page.num_of_pages}`
      )
    }

    if (totalCount === null) {
      totalCount = page.total_count
    } else if (page.total_count !== totalCount) {
      throw new Error(
        `Advertised total changed from ${totalCount} to ${page.total_count} on page ${pageNumber}`
      )
    }

    const pageEntries = parsePageEntries(page)

    if (pageEntries.length === 0) {
      throw new Error(`No results returned on page ${pageNumber}`)
    }

    expectedResultsCount += pageEntries.length

    for (const entry of pageEntries) {
      if (seenUrls.has(entry.learnnativelyUrl)) {
        throw new Error(`Duplicate learnnativelyUrl: ${entry.learnnativelyUrl}`)
      }

      seenUrls.add(entry.learnnativelyUrl)
      entries.push(entry)
    }

    console.log(
      `Collected ${entries.length}/${page.total_count} entries after page ${pageNumber}/${page.num_of_pages}`
    )

    if (pageNumber < expectedPageCount) {
      await sleep(randomDelay())
    }
  }

  if (totalCount === null) {
    throw new Error("Did not determine total count")
  }

  if (entries.length !== totalCount) {
    console.warn(
      `Advertised total_count ${totalCount} did not match collected entries ${entries.length}; writing collected results`
    )
  }

  if (expectedResultsCount !== totalCount) {
    console.warn(
      `Advertised total_count ${totalCount} did not match summed page results ${expectedResultsCount}; writing collected results`
    )
  }

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8")
  console.log(`Wrote ${entries.length} entries to ${outputPath}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
