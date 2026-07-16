import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '~/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not call the function before the delay elapses', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(99)

    expect(fn).not.toHaveBeenCalled()
  })

  it('calls the function once after the delay elapses', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('collapses rapid repeated calls into a single trailing call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('a')
    vi.advanceTimersByTime(50)
    debounced('b')
    vi.advanceTimersByTime(50)
    debounced('c')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('runs on the next tick when the delay is zero', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 0)

    debounced()
    vi.advanceTimersByTime(0)

    expect(fn).toHaveBeenCalledTimes(1)
  })
})
