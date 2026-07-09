# Web Dev Challenge

> Scaffold in progress. This README will be expanded once the full challenge brief (feature requirements) is added to the repo.

## Tech Stack

- [Nuxt 3](https://nuxt.com/) (SSR enabled)
- TypeScript (strict mode)
- Vue 3 Composition API (`<script setup>`)
- [Pinia](https://pinia.vuejs.org/) for shared client state
- Native `useFetch` for data fetching, wrapped in typed composables
- [Tailwind CSS](https://tailwindcss.com/) via `@nuxtjs/tailwindcss`
- ESLint (`@nuxt/eslint`)

## Project Setup

```bash
npm install
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build (SSR)
npm run preview  # preview the production build locally
npm run typecheck
npm run lint
```

## Project Structure

```
components/    Reusable presentational components (e.g. PostCard.vue)
composables/   Typed wrappers around useFetch and other reusable logic
layouts/       App-wide layouts (default.vue)
pages/         File-based routes
server/api/    Nitro server routes (mock backend used during development)
stores/        Pinia stores for cross-component client state
types/         Shared TypeScript interfaces/models
assets/css/    Tailwind entrypoint
```

## API & Composable Strategy

- All HTTP calls go through `composables/useApi.ts`, a thin generic wrapper around Nuxt's native `useFetch` that centralizes the API base URL (via `runtimeConfig.public.apiBase`) and forwards `UseFetchOptions`.
- Feature-specific composables (e.g. `usePosts.ts`) call `useApi<T>()` with the concrete response type, so components never call `useFetch` directly and never see untyped responses.
- During development, `server/api/*` provides mock Nitro endpoints so the frontend can be built against a realistic async/SSR data flow before a real backend is wired in. Swap `apiBase` (or the composable's URL) to point at a real API without touching page code.

## Typing & Modelling Decisions

- TypeScript strict mode is enabled (`nuxt.config.ts` + `tsconfig.json`), plus `noUncheckedIndexedAccess` for safer array/object access.
- Domain shapes live in `types/*.ts` and are imported wherever a response is typed, keeping a single source of truth for each model.

## Error Handling Approach

- `useFetch`-based composables return `{ data, pending, error, refresh }`; pages branch on `pending` / `error` / empty-data explicitly rather than relying on try/catch, keeping loading, error and empty states visually distinct (see `pages/index.vue`).
- Server routes throw typed `createError()` errors with proper status codes; unhandled errors surface through Nuxt's `error.vue` page.

## Assumptions

- No real backend/API was provided yet; `server/api/posts.ts` is a placeholder mock used to validate the SSR + `useFetch` + composable pipeline end to end.
- This document and the app structure will be revised once the actual challenge requirements document is added.

## Improvements With More Time

- Replace mock Nitro endpoints with the real API once available.
- Add unit/component tests (Vitest + @vue/test-utils) and e2e coverage.
- Add CI (lint + typecheck + build) via GitHub Actions.
