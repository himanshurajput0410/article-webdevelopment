<script setup lang="ts">
import type { Article } from '~/models/domain/article'

definePageMeta({ middleware: 'auth' })

const { bookmarks, pending, error, refresh, updateNote, removeBookmark } = await useBookmarks()
const articleRepository = useArticleRepository()

const articlesById = ref<Record<string, Article | null>>({})

async function loadArticles() {
  const entries = await Promise.all(
    bookmarks.value.map(async (bookmark) => [bookmark.articleId, await articleRepository.getById(bookmark.articleId)] as const),
  )
  articlesById.value = Object.fromEntries(entries)
}

await loadArticles()

const noteErrors = ref<Record<string, string | null>>({})
const notePending = ref<Record<string, boolean>>({})
const removePending = ref<Record<string, boolean>>({})

async function onSaveNote(bookmarkId: string, note: string) {
  notePending.value[bookmarkId] = true
  noteErrors.value[bookmarkId] = null

  try {
    await updateNote(bookmarkId, note)
  } catch (caught) {
    noteErrors.value[bookmarkId] = caught instanceof Error ? caught.message : 'Something went wrong. Please try again.'
  } finally {
    notePending.value[bookmarkId] = false
  }
}

async function onRemove(bookmarkId: string) {
  removePending.value[bookmarkId] = true

  try {
    await removeBookmark(bookmarkId)
  } catch {
    // the use-case already rolled the store back - nothing else to do here
  } finally {
    removePending.value[bookmarkId] = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900">Your bookmarks</h1>

    <div v-if="pending" class="mt-6 space-y-4">
      <div v-for="n in 3" :key="n" class="h-24 animate-pulse rounded-2xl bg-gray-200" />
    </div>

    <CommonErrorState v-else-if="error" class="mt-6" :message="error.message" :retrying="pending" @retry="refresh()" />

    <CommonEmptyState
      v-else-if="bookmarks.length === 0"
      class="mt-6"
      title="No bookmarks yet"
      message="Articles you bookmark will show up here."
    />

    <div v-else class="mt-6 space-y-4">
      <div v-for="bookmark in bookmarks" :key="bookmark.id" class="rounded-2xl bg-card p-4">
        <div class="flex items-start justify-between gap-3">
          <NuxtLink
            :to="`/articles/${bookmark.articleId}`"
            class="break-words font-semibold text-white hover:text-slate-200"
          >
            {{ articlesById[bookmark.articleId]?.title ?? 'Untitled article' }}
          </NuxtLink>

          <button
            type="button"
            class="shrink-0 text-sm font-medium text-white/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="removePending[bookmark.id]"
            @click="onRemove(bookmark.id)"
          >
            Remove
          </button>
        </div>

        <div class="mt-3 rounded-xl bg-white p-3">
          <BookmarkNoteForm
            :note="bookmark.note"
            :pending="notePending[bookmark.id]"
            :error-message="noteErrors[bookmark.id]"
            @save="(note) => onSaveNote(bookmark.id, note)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
