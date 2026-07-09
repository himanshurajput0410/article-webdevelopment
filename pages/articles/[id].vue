<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { article, pending, error, refresh } = await useArticle(id)

useHead(() => ({
  title: article.value ? article.value.title : 'Article',
}))
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <NuxtLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
      <span aria-hidden="true">&larr;</span> Back to articles
    </NuxtLink>

    <div v-if="pending" class="space-y-4">
      <UiSkeletonLine height="1.5rem" width="60%" />
      <div class="aspect-video w-full animate-pulse rounded-lg bg-gray-200" />
      <UiSkeletonLine height="1rem" />
      <UiSkeletonLine height="1rem" width="90%" />
      <UiSkeletonLine height="1rem" width="80%" />
    </div>

    <CommonErrorState v-else-if="error" :message="error.message" @retry="refresh()" />

    <CommonEmptyState
      v-else-if="!article"
      title="Article not found"
      message="This article may have been removed or the link is incorrect."
    />

    <article v-else class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900">{{ article.title }}</h1>

      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
        <span class="font-medium text-gray-700">{{ article.sourceName || 'Unknown source' }}</span>
        <span v-if="article.author">&middot; {{ article.author }}</span>
        <span>&middot; {{ formatPublishedDate(article.publishedAt) }}</span>
      </div>

      <img
        v-if="article.imageUrl"
        :src="article.imageUrl"
        :alt="article.title"
        class="aspect-video w-full rounded-lg object-cover"
      >

      <p v-if="article.description" class="text-base font-medium text-gray-800">
        {{ article.description }}
      </p>

      <p v-if="article.content" class="whitespace-pre-line text-gray-700">
        {{ article.content }}
      </p>

      <a
        :href="article.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700"
      >
        Read full article on {{ article.sourceName || 'source site' }}
        <span aria-hidden="true">&rarr;</span>
      </a>
    </article>
  </div>
</template>
