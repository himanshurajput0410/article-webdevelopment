<script setup lang="ts">
import type { Post } from '~/types/post'

defineProps<{
  post: Post
}>()
</script>

<template>
  <article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h3 class="font-semibold text-gray-900">{{ post.title }}</h3>
    <p class="mt-1 text-sm text-gray-600">{{ post.body }}</p>
  </article>
</template>
