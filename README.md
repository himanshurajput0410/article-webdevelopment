# Articles

A Nuxt 3 app that started as a read-only article viewer (Part 1) and is now an authenticated Article Manager: log in, search a large paginated catalogue, and keep a personal collection of bookmarks with notes. SSR, strict TypeScript, Pinia, no `any` anywhere, and now a proper domain/infrastructure split, a Nitro-backed "backend," and a real test suite.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run preview
npm run typecheck
npm run lint
npm run test            # unit + component tests (Vitest)
npm run test:coverage   # same, with a coverage report
npm run test:e2e        # Playwright happy path (starts its own dev server)
```

No `.env` needed. There's no external API anymore - the whole "backend" (articles, auth, bookmarks) is Nitro server routes backed by an in-memory dataset and in-memory sessions/bookmarks, seeded on startup. That also means sessions and bookmarks reset whenever the dev server restarts - fine for this challenge, called out again below.

**Please check it on both a phone-sized viewport and a normal desktop window**, same as Part 1 - the layout is still mobile-first.

## Logging in

There's no signup, just a few seeded accounts (see `server/utils/users.ts`), all with the same password:

| Email | Password |
|---|---|
| ada@example.com | password123 |
| grace@example.com | password123 |
| alan@example.com | password123 |

## How it's organised

```
models/
  api/           what the Nitro routes actually return
  domain/        what the UI actually uses
  domain/ports/  ArticleRepository, BookmarkRepository, AuthRepository interfaces -
                 plain TypeScript, no Nuxt/Vue imports allowed (enforced by an ESLint rule)
infrastructure/
  http/          nitroRequest - the one place that calls the injected fetcher and
                 turns transport errors into domain error types
  repositories/  Nitro*Repository - implements the ports above against /api/**
usecases/        optimistic add/edit/remove + rollback, search cancellation, login/logout -
                 orchestration that used to live in composables, now framework-free and
                 testable with a fake repository instead of a real one
plugins/
  repositories.ts   builds the three repositories once per request and injects them
  auth.server.ts    seeds the auth store from the request's session before the app renders
composables/
  useAPI.ts              (Part 1) wraps useFetch - still there, nothing new calls it
  useArticleRepository.ts, useBookmarkRepository.ts, useAuthRepository.ts
                         thin - just pull the injected repository out of the Nuxt app
  useArticle.ts, useArticleSearch.ts, useAuth.ts, useBookmarks.ts
                         what pages actually call; each wires a repository + use-case
                         + Pinia store together
middleware/
  auth.ts        redirects to /login if you're not authenticated
server/
  api/           auth/*, articles/*, bookmarks/* - the mock backend
  middleware/session.ts   reads the session cookie on every request
  utils/         seeded users, in-memory session/bookmark stores, the article dataset
  data/articles.json      seeded dataset (see "Assumptions" below)
stores/
  bookmarks.ts   your bookmarks (replaces Part 1's localStorage-only favorites store)
  auth.ts        the current user, if any
components/
  ui/, common/           (Part 1) generic pieces
  ArticleCard.vue, ArticleSkeletonCard.vue, BookmarkButton.vue, BookmarkNoteForm.vue
pages/
  index.vue, articles/[id].vue, login.vue, bookmarks.vue (protected)
tests/
  unit/          utils, mappers, repositories (mocked transport), use-cases (fake repository)
  component/     key UI states via @nuxt/test-utils
  e2e/           one Playwright happy path
utils/           (Part 1: id/format/article mapper) + debounce, validateNote, error mapping,
                 bookmark/user mappers
```

## Why there's now a domain/infrastructure split

Part 1's composables called `useFetch` directly. That's fine for a read-only app, but the brief specifically wants to see dependency inversion, not just a folder layout, so this stage adds a real seam:

- `models/domain/ports/*Repository.ts` are plain interfaces - `search`, `getById`, `add`, `update`, `remove`, `login`, `logout`, `me`. No Vue, no Nuxt, no `$fetch`. An ESLint rule (`no-restricted-imports` scoped to `models/domain/**`) actually enforces that, so it's not just a promise.
- `infrastructure/repositories/Nitro*Repository.ts` implement those interfaces against the Nitro routes. They take their HTTP client (a `$fetch`-shaped function) as a constructor argument instead of importing `$fetch` themselves - more on why below.
- `usecases/*` hold the orchestration that used to live in composables: the optimistic add/edit/remove + rollback for bookmarks, the "abort the previous search before starting a new one" logic, login/logout. These are plain functions that take a repository (and, for bookmarks, a small state port) as arguments - no framework dependency, so they're unit-tested against a fake repository instead of Nitro.
- `plugins/repositories.ts` builds the three repositories once and provides them (`$articleRepository`, `$bookmarkRepository`, `$authRepository`). Composables pull them out via `useNuxtApp()` - they depend on the interface, never on `NitroArticleRepository` directly. Swapping REST for GraphQL later means touching `infrastructure/`, not the composables, stores, or pages.

One thing this refactor genuinely fixed rather than just reorganised: repositories take their fetcher as a constructor argument instead of calling the global `$fetch`. That's not just for testability (though it helps - repository tests just pass a `vi.fn()`) - it's also what makes SSR auth actually work. An internal `$fetch` call made during server-side rendering doesn't carry the browser's cookies unless you forward them explicitly. `plugins/repositories.ts` injects `useRequestFetch()` on the server and plain `$fetch` on the client, so a logged-in user's bookmarks load correctly on the very first server-rendered paint. I only found this because the bookmarks page was quietly 401ing during SSR while the header showed the right user - worth mentioning since it's an easy mistake to ship silently.

## Auth flow, and why there's no flash

Login posts credentials to `/api/auth/login`, which checks them against the seeded list and sets an httpOnly, `sameSite: lax` session cookie (an opaque UUID mapped to a user server-side - a JWT would've added a signing secret for no real benefit here, since there's one process and one source of truth anyway). `server/middleware/session.ts` reads that cookie on every request and attaches the user (or `null`) to `event.context.auth`.

The no-flash part: `plugins/auth.server.ts` is a server-only plugin that reads `event.context.auth` and seeds the `auth` Pinia store *before* the app renders. Pinia's Nuxt module already serializes store state into the SSR payload and rehydrates it client-side, so the client picks up the same authenticated state Vue just rendered with - no separate client-side check, no redirect-then-flash. `middleware/auth.ts` reads that same store; because it's already correct at SSR time, refreshing a protected page renders authenticated immediately.

## Bookmarks: optimistic updates and what happens when they fail

Add/edit/remove all follow the same shape in `usecases/bookmarkUseCases.ts`: snapshot the current state, apply the change to the store immediately, call the repository, then either replace the optimistic entry with the real one (success) or restore the exact pre-change snapshot (failure) and re-throw so the UI can show an error. The composable/component layer just awaits the call in a `try/catch` - no unhandled rejections, no broken UI on failure.

Notes are validated in `utils/validateNote.ts` (trimmed, capped at 500 characters) - checked client-side before the optimistic update even happens, and re-checked server-side in the Nitro route, since the client can't be trusted.

## Search: why it's server-driven now

Part 1's list loaded the full feed and filtered/paginated it in the browser - it even says so in its own "Assumptions" section, because the mock API didn't support page parameters. Part 2's `/api/articles` route does (`?q=&page=`), backed by a locally seeded dataset (see below) with an artificial delay so cancellation actually has something to race against.

`utils/debounce.ts` delays the search by 350ms after the last keystroke. `usecases/articleSearchUseCases.ts` owns the cancellation: each call aborts the previous in-flight request's `AbortController` before starting a new one, so a slow, superseded response can never land after a newer one and overwrite it with stale results. The repository/`nitroRequest` layer treats an aborted request as a `CancelledError`, which the composable explicitly ignores rather than showing as an error.

The detail page also changed here: Part 1 deliberately had no per-article endpoint and reused the already-loaded list. Once the list only ever holds the current page of search results, that stops working for an article that's scrolled off-page (or reached by a direct link), so `server/api/articles/[id].get.ts` and a rewritten `useArticle` bring back a real per-article fetch. Necessary, but worth flagging since it reverses something Part 1 specifically explained.

## Typing

Same as Part 1: strict mode everywhere, `any` banned by both `tsconfig` and ESLint. The api↔domain split and pure mapper convention (`utils/article.ts`) is extended to bookmarks (`utils/bookmark.ts`) and users (`utils/user.ts`) rather than reinvented.

## Handling things going wrong

Same philosophy as Part 1's read side, extended to writes: every composable/use-case surfaces `pending`/`error` (or throws a typed error the caller catches), and every page/component branches on loading, error, empty, and success explicitly. `models/domain/errors.ts` gives repositories a small set of real error types (`NotFoundError`, `UnauthorizedError`, `ValidationError`, `CancelledError`) instead of leaking raw fetch failures, so a component can tell "you're not logged in" apart from "the note was too long" apart from "the network died."

## Testing

- **Unit (Vitest, `tests/unit/`)**: pure utils (debounce with fake timers, note validation - empty/whitespace-only/boundary/far-over-limit), mappers (round-trip + malformed-payload cases), the server-side `searchArticles`/`findArticleById` pagination logic (first page, last partial page, past-the-end page, no duplicate/missing articles across pages, case-insensitive matching), repositories against a mocked fetcher (right endpoint/method/query/body, error translation, cancellation, and malformed rejections - `null`, a plain string, a real `Error` - that shouldn't crash the client), and use-cases against a fake repository (optimistic transition *and* rollback, plus a dedicated search race-condition test where a slower, superseded response is proven to lose even though it would otherwise resolve last). No component mounting, no real network. `utils/`, `models/`, `server/utils/articles-data.ts`, `infrastructure/`, and `usecases/` are at 100% coverage (`npm run test:coverage`).
- **Component (`tests/component/`, via `@nuxt/test-utils`)**: loading, error, empty, success, and a dedicated optimistic-then-rollback test for the bookmark toggle.
- **E2E (`tests/e2e/`, Playwright)**: the happy path (log in, search, bookmark an article, see it in the collection), plus invalid login, an unauthenticated visit to a protected route, logout, and - checking the raw SSR response body directly, not just the hydrated DOM - that refreshing a protected page after login renders authenticated with no flash.

## Assumptions I made

- No Figma for Part 2 - the login, bookmarks, and search UI reuse Part 1's existing visual language (card/accent colors, `Button`/`EmptyState`/`ErrorState`) rather than inventing a new design system.
- The article dataset is a one-time snapshot of Part 1's mock feed (`scripts/seed-articles.mjs`), duplicated to ~300 rows so pagination has something real to page through - not fetched live on every request.
- Sessions and bookmarks are in-memory (a `Map`, per the brief) and reset on server restart. SQLite persistence is called out as a bonus in the brief and wasn't implemented here.
- Bookmarking requires being logged in. Clicking the heart while logged out redirects to `/login?redirect=...` rather than hiding the button.
- Mock credentials use plaintext password comparison (`server/utils/users.ts`) - acceptable for a seeded demo list, not something to carry into anything real.
- Git history for this stage is local commits only, not pushed - by request, so this could be reviewed before anything went to the remote.

## What I'd improve with more time

- SQLite (or at least a JSON file) for bookmarks so they survive a server restart.
- CI running typecheck/lint/test on every push.
- A basic rate limit on `/api/auth/login`.
- `NuxtErrorBoundary` around the bookmark list/note-editing area specifically.
- An accessibility pass on the login and note forms (they work with a keyboard and screen reader today, but haven't had a dedicated audit).
- Broader Playwright coverage beyond the one happy path (logout, a failed login, the rollback-on-network-failure case).
- A live deployment - skipped for this stage by request.
