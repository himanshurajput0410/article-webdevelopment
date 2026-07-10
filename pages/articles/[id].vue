<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { article, pending, error, refresh } = await useArticle(id)

// The inline "Article not found" state below already handles this without
// a jarring full-page swap to error.vue, but the response still needs to
// actually say 404 — otherwise it's a soft 404 (200 OK on a missing page).
if (!pending.value && !article.value && !error.value) {
  setResponseStatus(404)
}

const favorites = useFavoritesStore()
const isSaved = computed(() => (article.value ? favorites.isSaved(article.value.id) : false))

function toggleSaved() {
  if (article.value) favorites.toggle(article.value.id)
}

// A push to "/" is a brand new forward navigation, so vue-router has no
// savedPosition for it and always scrolls to top. Going back() instead
// triggers the same popstate path as the browser's own back button,
// which is what actually restores the list's scroll position.
function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}

useHead(() => ({
  title: article.value ? article.value.title : 'Article',
}))
</script>

<template>
  <div>
    <div class="bg-card">
      <div class="mx-auto max-w-3xl px-4 pb-14 pt-4 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between">
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90"
            aria-label="Back to articles"
            @click="goBack"
          >
            <img src="/icons/arrow-left.png" alt="" class="h-6 w-6">
          </button>

          <span class="text-xl font-medium text-white">Article</span>

          <button
            v-if="article"
            type="button"
            class="flex h-8 w-10 items-center justify-center transition-transform active:scale-90"
            :aria-label="isSaved ? 'Remove from favorites' : 'Add to favorites'"
            @click="toggleSaved"
          >
            <img v-if="!isSaved" src="/icons/heart.png" alt="" class="h-8 w-10">
            <img v-else src="/icons/heart-minus.png" alt="" class="h-8 w-10">
          </button>
          <div v-else class="h-9 w-9" />
        </div>

        <template v-if="pending">
          <UiSkeletonLine height="1.75rem" class="mb-2 bg-white/20" />
          <UiSkeletonLine height="1.75rem" width="70%" class="bg-white/20" />
        </template>

        <template v-else-if="article">
          <h1 class="break-words text-2xl font-bold leading-snug text-white">{{ article.title }}</h1>
          <div class="mt-3 flex items-center gap-1.5 text-sm text-white/70">
            <img src="/icons/clock.png" alt="" class="h-4 w-4">
            <span>{{ formatRelativeTime(article.publishedAt) }}</span>
          </div>
        </template>
      </div>
    </div>

    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="-mt-10">
        <div v-if="pending" class="aspect-[16/10] w-full animate-pulse rounded-xl bg-gray-200 shadow-lg" />
        <img
          v-else-if="article?.imageUrl"
          :src="article.imageUrl"
          :alt="article.title"
          class="aspect-[16/10] w-full rounded-xl object-cover shadow-lg"
        >
      </div>

      <div class="py-6">
        <CommonErrorState v-if="error" :message="error.message" :retrying="pending" @retry="refresh()" />

        <CommonEmptyState
          v-else-if="!pending && !article"
          title="Article not found"
          message="This article may have been removed or the link is incorrect."
        />

        <template v-else-if="article">
          <p v-if="article.description" class="mb-4 text-base font-medium text-gray-800">
            {{ article.description }}
          </p>

          <p v-if="article.content" class="whitespace-pre-line leading-relaxed text-gray-700">
            {{ article.content }}
          </p>

          <a
            :href="article.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            Read full article on {{ article.sourceName || 'source site' }}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
