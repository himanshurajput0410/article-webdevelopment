<script setup lang="ts">
const { articles, pending, error, refresh } = await useArticles()

const viewMode = ref<'list' | 'grid'>('list')
const searchOpen = ref(false)
const query = ref('')

function toggleViewMode() {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) query.value = ''
}

const filteredArticles = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return articles.value
  return articles.value.filter((article) => article.title.toLowerCase().includes(term))
})

const PAGE_SIZE = 8
const visibleCount = ref(PAGE_SIZE)

watch(query, () => {
  visibleCount.value = PAGE_SIZE
})

const visibleArticles = computed(() => filteredArticles.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredArticles.value.length)

function loadMore() {
  visibleCount.value += PAGE_SIZE
}

const gridClasses = computed(() =>
  viewMode.value === 'list'
    ? 'grid grid-cols-1 gap-4'
    : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4',
)
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-gray-900">Articles</h1>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="rounded-full p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :aria-label="viewMode === 'list' ? 'Switch to grid view' : 'Switch to list view'"
          @click="toggleViewMode"
        >
          <img
            v-if="viewMode === 'list'"
            src="/icons/grid.png"
            alt=""
            class="h-5 w-5"
          >
          <img v-else src="/icons/list.png" alt="" class="h-5 w-5">
        </button>

        <button
          type="button"
          class="rounded-full p-2 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-label="Search articles"
          @click="toggleSearch"
        >
          <img src="/icons/search.png" alt="" class="h-5 w-5">
        </button>
      </div>
    </div>

    <input
      v-if="searchOpen"
      v-model="query"
      type="search"
      placeholder="Search articles by title"
      class="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
    >

    <div v-if="pending && articles.length === 0" :class="gridClasses">
      <ArticleSkeletonCard v-for="n in 6" :key="n" :variant="viewMode" />
    </div>

    <CommonErrorState
      v-else-if="error"
      :message="error.message"
      @retry="refresh()"
    />

    <CommonEmptyState
      v-else-if="articles.length === 0"
      title="No articles yet"
      message="Check back later for new articles."
    />

    <CommonEmptyState
      v-else-if="filteredArticles.length === 0"
      title="No matches"
      :message="`Nothing found for &quot;${query}&quot;.`"
    />

    <template v-else>
      <div :class="gridClasses">
        <ArticleCard
          v-for="article in visibleArticles"
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
