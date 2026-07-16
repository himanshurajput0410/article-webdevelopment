// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BookmarkButton from '~/components/BookmarkButton.vue'

describe('BookmarkButton', () => {
  it('shows the add-bookmark icon and label when not bookmarked (success/idle state)', async () => {
    const wrapper = await mountSuspended(BookmarkButton, { props: { bookmarked: false } })

    expect(wrapper.get('button').attributes('aria-label')).toBe('Add bookmark')
    expect(wrapper.find('img[src="/icons/heart.png"]').exists()).toBe(true)
  })

  it('shows the remove-bookmark icon and label when bookmarked', async () => {
    const wrapper = await mountSuspended(BookmarkButton, { props: { bookmarked: true } })

    expect(wrapper.get('button').attributes('aria-label')).toBe('Remove bookmark')
    expect(wrapper.find('img[src="/icons/heart-minus.png"]').exists()).toBe(true)
  })

  it('disables the button while pending (optimistic update in flight)', async () => {
    const wrapper = await mountSuspended(BookmarkButton, { props: { bookmarked: false, pending: true } })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('emits toggle when clicked', async () => {
    const wrapper = await mountSuspended(BookmarkButton, { props: { bookmarked: false } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })
})
