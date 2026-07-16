// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ArticleSkeletonCard from '~/components/ArticleSkeletonCard.vue'
import CommonErrorState from '~/components/common/ErrorState.vue'
import CommonEmptyState from '~/components/common/EmptyState.vue'

describe('loading state', () => {
  it('renders a skeleton card that is hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(ArticleSkeletonCard)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })
})

describe('error state', () => {
  it('shows the message and lets the user retry', async () => {
    const wrapper = await mountSuspended(CommonErrorState, { props: { message: 'Network error.' } })

    expect(wrapper.get('[role="alert"]').text()).toContain('Network error.')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('shows a retrying label while a retry is in flight', async () => {
    const wrapper = await mountSuspended(CommonErrorState, { props: { message: 'Network error.', retrying: true } })

    expect(wrapper.text()).toContain('Retrying…')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})

describe('empty state', () => {
  it('shows the given title and message', async () => {
    const wrapper = await mountSuspended(CommonEmptyState, {
      props: { title: 'No bookmarks yet', message: 'Articles you bookmark will show up here.' },
    })

    expect(wrapper.text()).toContain('No bookmarks yet')
    expect(wrapper.text()).toContain('Articles you bookmark will show up here.')
  })
})
