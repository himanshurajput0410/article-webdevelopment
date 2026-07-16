import { describe, it, expect } from 'vitest'
import { createBookmarkUseCases } from '~/usecases/bookmarkUseCases'
import { FakeBookmarkRepository } from '../../fakes/FakeBookmarkRepository'
import { FakeBookmarkState } from '../../fakes/FakeBookmarkState'

describe('bookmarkUseCases.add', () => {
  it('applies the bookmark optimistically before the repository resolves', async () => {
    const repository = new FakeBookmarkRepository()
    const state = new FakeBookmarkState()
    const useCases = createBookmarkUseCases(repository, state)

    let releaseAdd: (() => void) | undefined
    const originalAdd = repository.add.bind(repository)
    repository.add = (input) =>
      new Promise((resolve) => {
        releaseAdd = () => resolve(originalAdd(input))
      })

    const pending = useCases.add({ articleId: 'a1', note: 'note' })

    expect(state.items).toHaveLength(1)
    expect(state.items[0]?.articleId).toBe('a1')
    expect(state.items[0]?.id).toMatch(/^optimistic:/)

    releaseAdd?.()
    await pending

    expect(state.items).toHaveLength(1)
    expect(state.items[0]?.id).not.toMatch(/^optimistic:/)
  })

  it('rolls back to the pre-call snapshot when the repository rejects', async () => {
    const repository = new FakeBookmarkRepository()
    repository.addError = new Error('boom')
    const state = new FakeBookmarkState()
    const useCases = createBookmarkUseCases(repository, state)

    await expect(useCases.add({ articleId: 'a1', note: 'note' })).rejects.toThrow('boom')
    expect(state.items).toHaveLength(0)
  })
})

describe('bookmarkUseCases.update', () => {
  it('applies the new note optimistically before the repository resolves', async () => {
    const repository = new FakeBookmarkRepository()
    const state = new FakeBookmarkState()
    const existing = await repository.add({ articleId: 'a1', note: 'old' })
    state.upsert(existing)

    const useCases = createBookmarkUseCases(repository, state)

    let releaseUpdate: (() => void) | undefined
    const originalUpdate = repository.update.bind(repository)
    repository.update = (id, input) =>
      new Promise((resolve) => {
        releaseUpdate = () => resolve(originalUpdate(id, input))
      })

    const pending = useCases.update(existing.id, { note: 'new' })
    expect(state.items[0]?.note).toBe('new')

    releaseUpdate?.()
    await pending
  })

  it('still calls the repository when the bookmark is not present in local state', async () => {
    const repository = new FakeBookmarkRepository()
    const state = new FakeBookmarkState()
    const existing = await repository.add({ articleId: 'a1', note: 'old' })
    // note: state is deliberately left empty here

    const useCases = createBookmarkUseCases(repository, state)
    const saved = await useCases.update(existing.id, { note: 'new' })

    expect(saved.note).toBe('new')
    expect(state.items).toHaveLength(1)
  })

  it('rolls back the note when the repository rejects', async () => {
    const repository = new FakeBookmarkRepository()
    const state = new FakeBookmarkState()
    const existing = await repository.add({ articleId: 'a1', note: 'old' })
    state.upsert(existing)
    repository.updateError = new Error('boom')

    const useCases = createBookmarkUseCases(repository, state)

    await expect(useCases.update(existing.id, { note: 'new' })).rejects.toThrow('boom')
    expect(state.items[0]?.note).toBe('old')
  })
})

describe('bookmarkUseCases.remove', () => {
  it('removes optimistically before the repository resolves', async () => {
    const repository = new FakeBookmarkRepository()
    const state = new FakeBookmarkState()
    const existing = await repository.add({ articleId: 'a1', note: '' })
    state.upsert(existing)

    const useCases = createBookmarkUseCases(repository, state)
    await useCases.remove(existing.id)

    expect(state.items).toHaveLength(0)
  })

  it('restores the bookmark when the repository rejects', async () => {
    const repository = new FakeBookmarkRepository()
    const state = new FakeBookmarkState()
    const existing = await repository.add({ articleId: 'a1', note: '' })
    state.upsert(existing)
    repository.removeError = new Error('boom')

    const useCases = createBookmarkUseCases(repository, state)

    await expect(useCases.remove(existing.id)).rejects.toThrow('boom')
    expect(state.items).toHaveLength(1)
  })
})
