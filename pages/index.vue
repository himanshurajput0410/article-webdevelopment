<script setup lang="ts">
const { articles, query, pending, error, hasMore, loadMore, retry } = await useArticleSearch()

// Cookie (not localStorage) so the preference survives a refresh *and*
// renders correctly on the very first SSR paint, no post-mount flash.
const viewMode = useCookie<'list' | 'grid'>('view-mode', {
  default: () => 'list',
  maxAge: 60 * 60 * 24 * 365,
})
// useState, not ref: this page remounts every time you come back from an
// article (router.back() tears down and re-runs this script), so a plain
// ref would forget whether the search box was open. useArticleSearch does
// the same for the query/results themselves.
const searchOpen = useState('articles-search-open', () => false)
const searchInput = ref<HTMLInputElement | null>(null)
const searchToggleButton = ref<HTMLButtonElement | null>(null)

function toggleViewMode() {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

async function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) {
    query.value = ''
    // The input is about to disappear (v-if). If it still has focus,
    // that focus would otherwise fall back to <body> with no warning
    // to a keyboard/screen-reader user, so send it somewhere sensible.
    searchToggleButton.value?.focus()
    return
  }
  await nextTick()
  searchInput.value?.focus()
}

const gridClasses = computed(() =>
  viewMode.value === 'list'
    ? 'grid grid-cols-1 gap-4'
    : 'grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4',
)
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h1 class="text-3xl font-bold text-gray-900">Articles</h1>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-full p-2 text-gray-700 transition-[background-color,transform] hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-90"
          :aria-label="viewMode === 'list' ? 'Switch to grid view' : 'Switch to list view'"
          @click="toggleViewMode"
        >
          <img
            v-if="viewMode === 'list'"
            src="/icons/grid.png"
            alt=""
            class="h-10 w-10"
          >
          <img v-else src="/icons/list.png" alt="" class="h-10 w-10">
        </button>

        <button
          ref="searchToggleButton"
          type="button"
          class="rounded-full p-2 transition-[background-color,transform] hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-90"
          :aria-label="searchOpen ? 'Close search' : 'Search articles'"
          @click="toggleSearch"
        >
          <img src="/icons/search.png" alt="" class="h-10 w-10">
        </button>
      </div>
    </div>

    <input
      v-if="searchOpen"
      ref="searchInput"
      v-model="query"
      type="search"
      aria-label="Search articles by title"
      placeholder="Search articles by title"
      class="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      @keydown.escape="toggleSearch"
    >

    <div v-if="pending && !error && articles.length === 0" :class="gridClasses">
      <ArticleSkeletonCard v-for="n in 6" :key="n" :variant="viewMode" />
    </div>

    <CommonErrorState
      v-else-if="error"
      :message="error.message"
      :retrying="pending"
      @retry="retry()"
    />

    <CommonEmptyState
      v-else-if="articles.length === 0 && query.trim()"
      title="No matches"
      :message="`Nothing found for &quot;${query.trim()}&quot;.`"
    />

    <CommonEmptyState
      v-else-if="articles.length === 0"
      title="No articles yet"
      message="Check back later for new articles."
    />

    <template v-else>
      <div :class="gridClasses">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          :variant="viewMode"
        />
      </div>

      <div v-if="hasMore" class="mt-6 flex justify-center">
        <UiButton variant="accent" @click="loadMore">Load More</UiButton>
      </div>
    </template>
  </div>
</template>
