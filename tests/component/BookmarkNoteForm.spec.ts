// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BookmarkNoteForm from '~/components/BookmarkNoteForm.vue'

describe('BookmarkNoteForm', () => {
  it('emits save with the current draft text (success path)', async () => {
    const wrapper = await mountSuspended(BookmarkNoteForm, { props: { note: 'initial' } })

    await wrapper.get('textarea').setValue('updated note')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('save')).toEqual([['updated note']])
  })

  it('shows an inline error message when errorMessage is set', async () => {
    const wrapper = await mountSuspended(BookmarkNoteForm, {
      props: { note: '', errorMessage: 'Notes can be up to 500 characters.' },
    })

    expect(wrapper.text()).toContain('Notes can be up to 500 characters.')
  })

  it('shows no error message by default', async () => {
    const wrapper = await mountSuspended(BookmarkNoteForm, { props: { note: '' } })

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('disables the save button and shows a saving label while pending (loading state)', async () => {
    const wrapper = await mountSuspended(BookmarkNoteForm, { props: { note: '', pending: true } })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Saving…')
  })
})
