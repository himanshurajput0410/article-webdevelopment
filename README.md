# Articles — Web Developer Challenge

An SSR Nuxt 3 application that lists articles from a mock news API and provides a
detail view for each, built around real-world data problems: missing fields,
inconsistent content, loading/empty/error states, and no stable article id.

## Tech Stack

- [Nuxt 3](https://nuxt.com/) (SSR)
- TypeScript, strict mode (`any` is disallowed by both `tsconfig` and an ESLint rule)
- Vue 3 Composition API (`<script setup>`)
- [Pinia](https://pinia.vuejs.org/) for the shared article cache
- Native `useFetch`, wrapped in a centralized composable — never called directly from a page/component
- Tailwind CSS (`@nuxtjs/tailwindcss`)
- ESLint (`@nuxt/eslint`)

## Project Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build       # production build (SSR)
npm run preview     # preview the production build locally
npm run typecheck
npm run lint
```

No environment variables are required — the API endpoint defaults to the one
provided in the brief. To point at a different feed, set:

```bash
NUXT_PUBLIC_ARTICLES_API_URL=https://your-endpoint
```

## Project Structure

```
components/
  ui/            Pure, feature-agnostic UI primitives (Button, Spinner, SkeletonLine)
  common/        Reusable app-agnostic composites (EmptyState, ErrorState)
  ArticleCard.vue, ArticleSkeletonCard.vue   Feature-specific presentational components
composables/
  useAPI.ts      Centralized API communication — the only place useFetch is called
  useArticles.ts Fetches the article feed, maps + caches it in the Pinia store
  useArticle.ts  Looks up a single article by id, reusing useArticles()
layouts/         App shell (default.vue)
models/
  api/           Raw API response shapes (ApiArticle, ApiArticlesResponse)
  domain/        Mapped, UI-friendly shape (Article)
pages/
  index.vue           Article list
  articles/[id].vue    Article detail
stores/
  articles.ts    Pinia store — single source of truth for the fetched article list
types/           Shared cross-cutting types (ApiError)
utils/           Pure helpers — id derivation, date formatting, content cleanup, raw→domain mapping
assets/css/      Tailwind entrypoint
```

## API & Composable Strategy

- **`useAPI<T>()`** is the single choke point for HTTP calls. It wraps `useFetch`,
  and normalizes whatever error comes back into a typed `ApiError` (`{ message, statusCode }`)
  so nothing downstream ever touches a raw `FetchError`. No page or component calls
  `useFetch` directly.
- **`useArticles()`** is the feature composable for the list: it calls `useAPI`
  with a stable `key: 'articles-list'`, maps each raw `ApiArticle` to the domain
  `Article` shape via `mapApiArticleToDomain`, and writes the result into the
  Pinia store. It returns `{ articles, pending, error, refresh }` sourced from
  the store, so every consumer sees the same cached list.
- **`useArticle(id)`** builds on `useArticles()` rather than fetching independently,
  then looks the id up in the store via a getter. Because it reuses the same
  fetch key, navigating list → detail does not trigger a second network
  request — Nuxt's payload/asyncData cache and the Pinia store both dedupe it.
  A direct load of `/articles/:id` (no prior list visit) still fetches over SSR
  through the same path, so the detail page works standalone too.
- Both composables are `async` and are `await`-ed in `<script setup>`, which is
  what makes Nuxt block SSR until the data resolves — the page never ships
  without its data on first render.

## Typing & Modeling Decisions

- `any` is forbidden everywhere: `strict: true` in `nuxt.config.ts`/`tsconfig.json`
  (plus `noUncheckedIndexedAccess`) and `@typescript-eslint/no-explicit-any: 'error'`
  in `eslint.config.mjs`.
- **`models/api/article.ts`** mirrors the API exactly, including the parts that
  are unreliable in practice — `author`, `description`, `urlToImage`, and
  `source.name` are all `string | null` because the live feed omits them on a
  meaningful fraction of articles (checked against the real payload: ~10% of
  entries are missing an image, ~10% are missing an author).
- **`models/domain/article.ts`** is what the UI actually renders: every field
  has a defined fallback applied once, in `utils/article.ts`, instead of every
  template needing its own `?? 'Unknown'` logic.
- **There is no article id in the API.** Each article does have a unique `url`,
  so `utils/id.ts` derives a short, deterministic id from it (`hashToId`) purely
  so articles are routable at `/articles/:id` without a second endpoint.

## Error Handling Approach

- `useAPI` normalizes any fetch failure into `{ message, statusCode }` — pages
  branch on `pending` / `error` / not-found / empty explicitly, so each state
  has its own visual treatment (`ArticleSkeletonCard`, `CommonErrorState` with a
  retry action, `CommonEmptyState`) instead of one generic fallback.
- The list page and detail page distinguish **three** different "nothing to
  show" cases that are easy to conflate: a genuinely empty feed, a fetch error,
  and (detail page only) a valid response where the requested id simply isn't
  in it — each gets its own message.
- The feed's `content` field is truncated by the API with a `[+N chars]`
  marker; this particular mock appends unrelated filler text after that marker.
  `utils/format.ts#cleanArticleContent` cuts the string at the marker so the
  UI never displays that inconsistent trailing text.
- A root `error.vue` catches anything unhandled (e.g. a thrown Nitro error)
  so the app never shows a blank screen.

## Assumptions

- The API has no per-article endpoint — only the full list. The detail route
  is therefore served by fetching/caching the same list and looking up by the
  derived id, rather than a second request per article.
- The Figma design link in the brief requires an authenticated session and
  couldn't be opened programmatically in this environment. The mobile list/grid
  screens were instead matched against exported screenshots and icon assets
  (card color `#233D46`, calendar/grid/list/search icons in `public/icons/`);
  screens not yet screenshotted (article detail) use my own interpretation
  pending reference images.
- The feed is loaded in full on first render (SSR) and paginated client-side
  ("Load More", 8 at a time) rather than requesting pages from the API, since
  the mock endpoint has no pagination parameters of its own.
- `urlToImage` is treated as optional and unreliable (missing for ~10% of
  articles, and a few present URLs still 404) — the card/detail views fall
  back to a placeholder rather than trusting the field.

## What I'd Improve With More Time

- Match the remaining screens (article detail) to Figma once those screenshots
  are available.
- Add unit tests for the pure utils (`hashToId`, `cleanArticleContent`,
  `mapApiArticleToDomain`) and component tests for the loading/error/empty
  branches, via Vitest + `@vue/test-utils`.
- Swap client-side "Load More" slicing for real API pagination if the feed
  gains pagination parameters.
- Wire up CI (typecheck + lint + build) via GitHub Actions.
- Deploy to Vercel/Netlify for a live preview link.
