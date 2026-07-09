<script setup lang="ts">
const { articles, pending, error, refresh } = await useArticles()
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Latest articles</h1>

    <div
      v-if="pending && articles.length === 0"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ArticleSkeletonCard v-for="n in 6" :key="n" />
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

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </div>
  </div>
</template>
