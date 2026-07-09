# Articles

A Nuxt 3 app that pulls articles from a mock news API, shows them as a list, and lets you open each one in detail. Built for the Web Developer Challenge brief: SSR, strict TypeScript, Pinia, native `useFetch`, Tailwind, no `any` anywhere.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run preview
npm run typecheck
npm run lint
```

No `.env` needed just to run it. The API URL is already set to the one from the brief. If you ever want to point it at something else:

```bash
NUXT_PUBLIC_ARTICLES_API_URL=https://your-endpoint
```

**Please check it on both a phone-sized viewport and a normal desktop window.** The layout was built mobile-first from the Figma screenshots, then adapted for wider screens. List cards switch from a stacked card to a left-image/right-text row past the `sm` breakpoint, and grid view caps at 3 columns. Worth seeing both to notice the difference.

## How it's organised

```
components/
  ui/            small generic pieces (Button, SkeletonLine)
  common/        EmptyState, ErrorState
  ArticleCard.vue, ArticleSkeletonCard.vue   the actual article card + its loading placeholder
composables/
  useAPI.ts      wraps useFetch, this is the only file that calls it
  useArticles.ts fetches the list, maps it, puts it in the store
  useArticle.ts  finds one article by id (built on top of useArticles)
layouts/         default.vue, just the page shell
models/
  api/           what the API actually returns
  domain/        what the UI actually uses
pages/
  index.vue           the list
  articles/[id].vue    the detail page
stores/
  articles.ts    the fetched articles, shared between list and detail
  favorites.ts   ids of articles you've saved
types/           small shared types (ApiError)
utils/           id generation, date formatting, content cleanup, the raw-to-domain mapper
public/icons/    icons exported from the Figma file
```

## Why it's structured this way

Nothing calls `useFetch` directly except `useAPI`. Every other composable goes through it, so there's one place that turns a failed request into a normal `{ message, statusCode }` object instead of some raw error nobody's checked the shape of.

`useArticles` fetches the feed, maps each raw article into the shape the UI actually wants, and stores it in Pinia. `useArticle(id)` doesn't fetch on its own. It just calls `useArticles` and looks the id up in the store. Going from the list to a detail page doesn't trigger a second request because Nuxt already has the data cached under the same key. Opening a detail page directly still works fine too, since it just fetches fresh over SSR.

Both of these are `async` functions, `await`-ed in the page's `<script setup>`. That's what makes Nuxt wait for the data before it renders, so you don't get a flash of nothing on first load.

## Typing

Strict mode is on everywhere. `any` is banned both by `tsconfig` and by an ESLint rule, so it's not just something someone could ignore.

The raw API model (`models/api/article.ts`) matches what the feed actually sends, including the annoying parts. No `author`, no `description`, no image, on a good chunk of articles. I checked the real payload and roughly 1 in 10 articles is missing an image or an author. The domain model (`models/domain/article.ts`) is what components actually render, with fallbacks already applied once in `utils/article.ts` instead of every template writing its own `?? 'Unknown'`.

There's also no article id in the feed at all, just a `url`, which happens to be unique. `utils/id.ts` turns that url into a short id so articles can have their own route.

## Handling things going wrong

Each composable returns `pending`, `error`, and the data, and every page branches on those explicitly. Loading, error, empty, and "not found" all look different instead of collapsing into one generic message. There's a retry button on the error state, and a root `error.vue` catches anything truly unexpected.

Two specific things worth knowing about:

The feed truncates `content` with a `[+123 chars]` marker, and in this particular mock there's random filler text glued on after that marker. It gets cut off before display.

If the API ever came back with `articles` missing, not an array, or with an entry that has no `url`, the app used to just crash trying to map over it. That's fixed now. A bad response just shows the empty state instead of breaking the page.

## Pinia: what's actually in it and why

The article list is shared state by definition, since both the list and detail pages need it, so that's an easy call. The favorites store is a bit more interesting. It's a heart button on the detail page that saves an article, backed by `localStorage`. It has to be a store rather than a local ref, otherwise it'd forget itself every time you left the page and came back. The localStorage read happens in `app.vue`'s `onMounted` on purpose. Reading it any earlier caused a real hydration mismatch (Vue complaining that server and client rendered different things), because the server has no access to localStorage at all.

## A couple of things I added that weren't strictly asked for

The Figma design has a search icon, and asked that the list not just dump all 79 articles on the page. So there's a working title search, and the list loads 8 at a time with a "Load More" button instead of everything at once.

## Assumptions I made

- There's no per-article endpoint, only the full list. The detail page reuses the cached list instead of hitting a second URL.
- The Figma link needs a login and wouldn't open for me directly, so I matched the mobile screens from the screenshots and icon exports you shared, then adapted the layout for desktop myself.
- The "Article" label in the detail header and the save/heart button aren't backed by any API data. They're just UI, since the feed has no favorites concept.
- Pagination is client-side ("Load More") since the mock API doesn't support page parameters.

## What I'd do with more time

- Unit tests for the small pure functions (id generation, content cleanup, date formatting, the mapper) and a few component tests for the loading/error/empty states.
- Real API pagination instead of client-side slicing, if the feed ever supports it.
- A GitHub Actions workflow running typecheck/lint/build on every push.
- Deploy it somewhere (Vercel/Netlify) so there's a live link, not just a repo.
