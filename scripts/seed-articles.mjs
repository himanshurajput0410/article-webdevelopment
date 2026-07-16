// One-time generator for server/data/articles.json. Takes a snapshot of
// the Part 1 mock feed (79 articles) and duplicates it a few times with
// unique urls/titles, so the search API has enough rows to page through.
import { writeFileSync } from 'node:fs'

const SOURCE_URL = 'https://mocki.io/v1/38c57ea8-5688-4a36-9629-8c9616754eb8'
const OUTPUT_PATH = new URL('../server/data/articles.json', import.meta.url)
const COPIES = 4

const response = await fetch(SOURCE_URL)
const feed = await response.json()

const duplicated = []
for (let copy = 0; copy < COPIES; copy++) {
  for (const article of feed.articles) {
    duplicated.push(
      copy === 0
        ? article
        : {
            ...article,
            title: `${article.title} (${copy + 1})`,
            url: `${article.url}#copy-${copy + 1}`,
          },
    )
  }
}

writeFileSync(OUTPUT_PATH, JSON.stringify(duplicated, null, 2))
console.log(`Wrote ${duplicated.length} articles to ${OUTPUT_PATH.pathname}`)
