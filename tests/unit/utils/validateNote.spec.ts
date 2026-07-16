import { describe, it, expect } from 'vitest'
import { validateNote, NOTE_MAX_LENGTH } from '~/utils/validateNote'

describe('validateNote', () => {
  it('accepts an empty note', () => {
    expect(validateNote('')).toEqual({ valid: true, value: '' })
  })

  it('trims a whitespace-only note down to an empty string', () => {
    expect(validateNote('   \n\t  ')).toEqual({ valid: true, value: '' })
  })

  it('trims leading and trailing whitespace', () => {
    expect(validateNote('  hello  ')).toEqual({ valid: true, value: 'hello' })
  })

  it('accepts a note exactly at the max length', () => {
    const note = 'a'.repeat(NOTE_MAX_LENGTH)
    expect(validateNote(note)).toEqual({ valid: true, value: note })
  })

  it('rejects a note one character over the max length', () => {
    const note = 'a'.repeat(NOTE_MAX_LENGTH + 1)
    const result = validateNote(note)

    expect(result.valid).toBe(false)
    expect(result.valid ? null : result.message).toMatch(/500/)
  })
})
