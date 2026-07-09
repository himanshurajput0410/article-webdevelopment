<script setup lang="ts">
import type { Article } from '~/models/domain/article'

const props = defineProps<{
  article: Article
}>()

const imageFailed = ref(false)

const showImage = computed(() => Boolean(props.article.imageUrl) && !imageFailed.value)
</script>

<template>
  <NuxtLink
    :to="`/articles/${article.id}`"
    class="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
  >
    <div class="aspect-video w-full shrink-0 bg-gray-100">
      <img
        v-if="showImage"
        :src="article.imageUrl!"
        :alt="article.title"
        class="h-full w-full object-cover"
        loading="lazy"
        @error="imageFailed = true"
      >
      <div v-else class="flex h-full w-full items-center justify-center text-gray-300">
        <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
          />
        </svg>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <div class="flex items-center justify-between gap-2 text-xs text-gray-500">
        <span class="truncate font-medium">{{ article.sourceName || 'Unknown source' }}</span>
        <span class="shrink-0">{{ formatPublishedDate(article.publishedAt) }}</span>
      </div>

      <h2 class="line-clamp-2 font-semibold text-gray-900 group-hover:text-gray-700">
        {{ article.title }}
      </h2>

      <p v-if="article.description" class="line-clamp-2 text-sm text-gray-600">
        {{ article.description }}
      </p>
    </div>
  </NuxtLink>
</template>
