<script setup lang="ts">
const FAVORITES_STORAGE_KEY = 'favorite-article-ids'

// Wait until after mount to touch localStorage. Doing it any earlier
// causes a hydration mismatch, since the server has no localStorage to
// read from.
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
  <NuxtLoadingIndicator color="#195A94" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
