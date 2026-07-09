<script setup lang="ts">
const FAVORITES_STORAGE_KEY = 'favorite-article-ids'

// Read localStorage only in onMounted: Vue guarantees this fires strictly
// after this component's subtree (including Suspense-wrapped async pages)
// finishes hydrating, so the first client render still matches the
// server render and no hydration mismatch is thrown.
onMounted(() => {
  const favorites = useFavoritesStore()

  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
  if (stored) {
    try {
      const parsed: unknown = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        favorites.hydrate(parsed.filter((id): id is string => typeof id === 'string'))
      }
    } catch {
      // corrupt storage, ignore and start fresh
    }
  }

  favorites.$subscribe(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites.ids))
  })
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
