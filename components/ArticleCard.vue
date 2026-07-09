<script setup lang="ts">
import type { Article } from '~/models/domain/article'

const props = withDefaults(
  defineProps<{
    article: Article
    variant?: 'list' | 'grid'
  }>(),
  {
    variant: 'list',
  },
)

const imageFailed = ref(false)

const showImage = computed(() => Boolean(props.article.imageUrl) && !imageFailed.value)
</script>

<template>
  <NuxtLink
    :to="`/articles/${article.id}`"
    class="group block overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
  >
    <div :class="variant === 'list' ? 'aspect-[16/10]' : 'aspect-square'" class="w-full bg-gray-200">
      <img
        v-if="showImage"
        :src="article.imageUrl!"
        :alt="article.title"
        class="h-full w-full object-cover"
        loading="lazy"
        @error="imageFailed = true"
      >
      <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
          />
        </svg>
      </div>
    </div>

    <div class="bg-slate-800 p-3" :class="variant === 'list' ? 'space-y-3' : 'space-y-1'">
      <h2
        class="font-semibold text-white group-hover:text-slate-200"
        :class="variant === 'list' ? 'line-clamp-2 text-base' : 'line-clamp-2 text-sm'"
      >
        {{ article.title }}
      </h2>

      <div v-if="variant === 'list'" class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 text-xs text-slate-300">
          <img src="/icons/clock.png" alt="" class="h-4 w-4 shrink-0">
          <span>{{ formatPublishedDate(article.publishedAt) }}</span>
        </div>

        <span
          class="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 py-1 pl-3 pr-1 text-xs font-medium text-white"
          aria-hidden="true"
        >
          Read More
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-600">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
