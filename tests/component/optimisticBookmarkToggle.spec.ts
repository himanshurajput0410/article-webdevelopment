// @vitest-environment nuxt
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import BookmarkButton from '~/components/BookmarkButton.vue'

// Mirrors the optimistic add/remove wiring on the article detail page,
// isolated from its other, unrelated data dependencies.
function createHarness(toggle: () => Promise<void>) {
  return defineComponent({
    components: { BookmarkButton },
    setup() {
      const bookmarked = ref(false)
      const pending = ref(false)
      const errorMessage = ref<string | null>(null)

      async function onToggle() {
        pending.value = true
        errorMessage.value = null
        const previous = bookmarked.value
        bookmarked.value = !previous

        try {
          await toggle()
        } catch (error) {
          bookmarked.value = previous
          errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
        } finally {
          pending.value = false
        }
      }

      return { bookmarked, pending, errorMessage, onToggle }
    },
    template: `
      <div>
        <BookmarkButton :bookmarked="bookmarked" :pending="pending" @toggle="onToggle" />
        <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
      </div>
    `,
  })
}

describe('optimistic bookmark toggle', () => {
  it('flips the icon immediately, then reverts and shows an error when the save fails', async () => {
    let rejectToggle: ((error: Error) => void) | undefined
    const toggle = vi.fn(
      () =>
        new Promise<void>((_, reject) => {
          rejectToggle = reject
        }),
    )
    const wrapper = await mountSuspended(createHarness(toggle))

    await wrapper.get('button').trigger('click')

    expect(wrapper.find('img[src="/icons/heart-minus.png"]').exists()).toBe(true)
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()

    rejectToggle?.(new Error('Something went wrong. Please try again.'))
    await flushPromises()

    expect(wrapper.find('img[src="/icons/heart.png"]').exists()).toBe(true)
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toBe('Something went wrong. Please try again.')
  })

  it('keeps the optimistic state once the save succeeds', async () => {
    const toggle = vi.fn().mockResolvedValue(undefined)
    const wrapper = await mountSuspended(createHarness(toggle))

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.find('img[src="/icons/heart-minus.png"]').exists()).toBe(true)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
