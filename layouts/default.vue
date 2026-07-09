<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <div>
    <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <span class="text-lg font-semibold">Web Dev Challenge</span>
      <button
        class="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        @click="ui.toggleSidebar"
      >
        {{ ui.sidebarOpen ? 'Hide' : 'Show' }} sidebar
      </button>
    </header>
    <div class="flex">
      <aside
        v-if="ui.sidebarOpen"
        class="w-56 shrink-0 border-r border-gray-200 bg-white p-4 text-sm text-gray-500"
      >
        Sidebar (Pinia-driven state demo)
      </aside>
      <main class="min-w-0 flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
