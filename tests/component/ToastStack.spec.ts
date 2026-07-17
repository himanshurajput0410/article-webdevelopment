// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ToastStack from '~/components/ToastStack.vue'
import { useToast } from '~/composables/useToast'

describe('ToastStack', () => {
  it('shows a success toast and can dismiss it', async () => {
    const toast = useToast()
    toast.success('Bookmark added')

    const wrapper = await mountSuspended(ToastStack)

    expect(wrapper.text()).toContain('Bookmark added')

    await wrapper.get('button[aria-label="Dismiss notification"]').trigger('click')
    expect(wrapper.text()).not.toContain('Bookmark added')
  })

  it('shows an error toast', async () => {
    const toast = useToast()
    toast.error('Something went wrong')

    const wrapper = await mountSuspended(ToastStack)

    expect(wrapper.text()).toContain('Something went wrong')
  })
})
