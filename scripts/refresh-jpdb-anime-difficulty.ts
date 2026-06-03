import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

type JpdbAnimeDifficultyEntry = {
  name: string
  jpdbUrl: string
  lengthInWords: number
  uniqueWords: number
  uniqueWordsUsedOnce: number
  uniqueWordsUsedOncePercent: number
  uniqueKanji: number
  uniqueKanjiUsedOnce: number
  uniqueKanjiReadings: number
  averageDifficulty: number
  peakDifficulty90thPercentile: number
}

type CardFields = Omit<JpdbAnimeDifficultyEntry, "name" | "jpdbUrl">

const rootDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(
  rootDirectory,
  "../src/data/jpdb-anime-difficulty.json"
)
const baseUrl = "https://jpdb.io/anime-difficulty-list"
const pageSize = 50
const delayMs = 1500
const jitterMs = 500

const fieldMap = {
  "Length (in words)": "lengthInWords",
  "Unique words": "uniqueWords",
  "Unique words (used once)": "uniqueWordsUsedOnce",
  "Unique words (used once %)": "uniqueWordsUsedOncePercent",
  "Unique kanji": "uniqueKanji",
  "Unique kanji (used once)": "uniqueKanjiUsedOnce",
  "Unique kanji readings": "uniqueKanjiReadings",
  "Average difficulty": "averageDifficulty",
  "Peak difficulty (90th percentile)": "peakDifficulty90thPercentile",
} satisfies Record<string, keyof CardFields>

const zeroDefaultFields = new Set<keyof CardFields>([
  "uniqueWordsUsedOnce",
  "uniqueWordsUsedOncePercent",
])

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10))
    )
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ")
}

function stripTags(value: string) {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, "")
    .trim()
}

function normalizeUrl(value: string) {
  return new URL(decodeHtmlEntities(value), "https://jpdb.io").toString()
}

function parseInteger(value: string, fieldName: string, entryName: string) {
  const normalized = value.replaceAll(",", "").trim()

  if (!/^\d+$/.test(normalized)) {
    throw new Error(
      `Invalid integer for ${fieldName} in "${entryName}": ${JSON.stringify(value)}`
    )
  }

  return Number.parseInt(normalized, 10)
}

function parsePercent(value: string, fieldName: string, entryName: string) {
  const match = value.trim().match(/^(\d+)%$/)

  if (!match) {
    throw new Error(
      `Invalid percent for ${fieldName} in "${entryName}": ${JSON.stringify(value)}`
    )
  }

  return Number.parseInt(match[1], 10)
}

function parseDifficulty(value: string, fieldName: string, entryName: string) {
  const match = value.trim().match(/^(\d+)\/100$/)

  if (!match) {
    throw new Error(
      `Invalid difficulty for ${fieldName} in "${entryName}": ${JSON.stringify(value)}`
    )
  }

  return Number.parseInt(match[1], 10)
}

function parseFieldValue(
  fieldName: keyof CardFields,
  value: string,
  entryName: string
) {
  switch (fieldName) {
    case "uniqueWordsUsedOncePercent":
      return parsePercent(value, fieldName, entryName)
    case "averageDifficulty":
    case "peakDifficulty90thPercentile":
      return parseDifficulty(value, fieldName, entryName)
    default:
      return parseInteger(value, fieldName, entryName)
  }
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

function randomDelay() {
  return delayMs + Math.floor(Math.random() * (jitterMs + 1))
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "jimaku-watch-list/1.0 (+https://github.com/mollicl/jimaku-watch-list)",
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`)
  }

  return response.text()
}

function parseTotalCount(html: string) {
  const match = html.match(/Showing\s+\d+\.\.\d+\s+from\s+([\d,]+)\s+entries/)

  if (!match) {
    throw new Error("Could not parse advertised total count")
  }

  return Number.parseInt(match[1].replaceAll(",", ""), 10)
}

function parseCardTable(tableHtml: string, entryName: string) {
  const rows = [
    ...tableHtml.matchAll(/<tr><th>(.*?)<\/th><td>(.*?)<\/td><\/tr>/g),
  ]
  const fields: Partial<CardFields> = {}

  for (const row of rows) {
    const rawLabel = stripTags(row[1])
    const rawValue = stripTags(row[2])
    const mappedField = fieldMap[rawLabel as keyof typeof fieldMap]

    if (!mappedField) {
      continue
    }

    fields[mappedField] = parseFieldValue(mappedField, rawValue, entryName)
  }

  for (const fieldName of Object.values(fieldMap)) {
    if (fields[fieldName] === undefined) {
      if (zeroDefaultFields.has(fieldName)) {
        fields[fieldName] = 0
        continue
      }

      throw new Error(`Missing ${fieldName} for "${entryName}"`)
    }
  }

  return fields as CardFields
}

function parsePageEntries(html: string) {
  const entryRegex =
    /<div style="opacity: 0\.5">Anime<\/div><h5[^>]*>(.*?)<\/h5><div[^>]*><table class="cross-table data-right-align">(.*?)<\/table>[\s\S]*?<a href="([^"]+)" class="outline">Show details\.\.\.<\/a>/g

  const entries: JpdbAnimeDifficultyEntry[] = []

  for (const match of html.matchAll(entryRegex)) {
    const name = stripTags(match[1])
    const tableHtml = match[2]
    const jpdbUrl = normalizeUrl(match[3])

    if (!name) {
      throw new Error("Encountered entry with missing name")
    }

    entries.push({
      name,
      jpdbUrl,
      ...parseCardTable(tableHtml, name),
    })
  }

  if (entries.length === 0) {
    throw new Error("Could not parse any anime entries from page")
  }

  return entries
}

async function main() {
  const entries: JpdbAnimeDifficultyEntry[] = []
  const seenUrls = new Set<string>()
  let totalCount: number | null = null

  for (
    let offset = 0;
    totalCount === null || entries.length < totalCount;
    offset += pageSize
  ) {
    const url = `${baseUrl}?offset=${offset}`
    const html = await fetchText(url)
    const pageTotal = parseTotalCount(html)

    if (totalCount === null) {
      totalCount = pageTotal
    } else if (pageTotal !== totalCount) {
      throw new Error(
        `Advertised total changed from ${totalCount} to ${pageTotal} at offset ${offset}`
      )
    }

    const pageEntries = parsePageEntries(html)

    for (const entry of pageEntries) {
      if (seenUrls.has(entry.jpdbUrl)) {
        throw new Error(`Duplicate jpdbUrl: ${entry.jpdbUrl}`)
      }

      seenUrls.add(entry.jpdbUrl)
      entries.push(entry)
    }

    console.log(`Collected ${entries.length}/${totalCount} entries`)

    if (entries.length < totalCount) {
      await sleep(randomDelay())
    }
  }

  if (totalCount === null) {
    throw new Error("Did not determine total count")
  }

  if (entries.length !== totalCount) {
    throw new Error(
      `Collected ${entries.length} entries, expected ${totalCount}`
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
