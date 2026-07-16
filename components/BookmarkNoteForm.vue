<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    note: string
    pending?: boolean
    errorMessage?: string | null
  }>(),
  {
    pending: false,
    errorMessage: null,
  },
)

const emit = defineEmits<{
  save: [string]
}>()

const draft = ref(props.note)

watch(
  () => props.note,
  (value) => {
    draft.value = value
  },
)

function onSubmit() {
  emit('save', draft.value)
}
</script>

<template>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
    <textarea
      v-model="draft"
      rows="2"
      maxlength="500"
      placeholder="Add a note…"
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
    />

    <p v-if="errorMessage" class="text-sm font-medium text-red-700" role="alert">{{ errorMessage }}</p>

    <div>
      <UiButton type="submit" variant="secondary" :disabled="pending">
        {{ pending ? 'Saving…' : 'Save note' }}
      </UiButton>
    </div>
  </form>
</template>
