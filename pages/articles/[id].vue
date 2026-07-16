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

const { isAuthenticated } = useAuth()
const { isBookmarked, getByArticleId, addBookmark, removeBookmark } = await useBookmarks()

const isSaved = computed(() => (article.value ? isBookmarked(article.value.id) : false))
const bookmarkPending = ref(false)
const bookmarkError = ref<string | null>(null)

const imageFailed = ref(false)
const showImage = computed(() => Boolean(article.value?.imageUrl) && !imageFailed.value)

async function toggleSaved() {
  if (!article.value) return

  if (!isAuthenticated.value) {
    await router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }

  bookmarkPending.value = true
  bookmarkError.value = null

  try {
    if (isSaved.value) {
      const bookmark = getByArticleId(article.value.id)
      if (bookmark) await removeBookmark(bookmark.id)
    } else {
      await addBookmark(article.value.id)
    }
  } catch (caught) {
    bookmarkError.value = caught instanceof Error ? caught.message : 'Something went wrong. Please try again.'
  } finally {
    bookmarkPending.value = false
  }
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

          <BookmarkButton v-if="article" :bookmarked="isSaved" :pending="bookmarkPending" @toggle="toggleSaved" />
          <div v-else class="h-9 w-9" />
        </div>

        <p v-if="bookmarkError" class="mb-4 text-sm font-medium text-red-300" role="alert">{{ bookmarkError }}</p>

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
          v-else-if="showImage"
          :src="article?.imageUrl ?? undefined"
          :alt="article?.title ?? ''"
          class="aspect-[16/10] w-full rounded-xl object-cover shadow-lg"
          @error="imageFailed = true"
        >

        <div
          v-else-if="article"
          class="flex aspect-[16/10] w-full items-center justify-center rounded-xl bg-gray-200 text-gray-400 shadow-lg"
        >
          <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
            />
          </svg>
        </div>
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
