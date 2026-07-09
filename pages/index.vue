<script setup lang="ts">
const { data: posts, pending, error, refresh } = await usePosts()
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Posts</h1>
      <button
        class="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
        @click="refresh()"
      >
        Refresh
      </button>
    </div>

    <div v-if="pending" class="space-y-3">
      <div v-for="n in 3" :key="n" class="h-16 animate-pulse rounded-lg bg-gray-200" />
    </div>

    <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Couldn't load posts: {{ error.statusMessage || error.message }}
    </div>

    <div v-else-if="!posts || posts.length === 0" class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
      No posts yet.
    </div>

    <div v-else class="space-y-3">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
