export const NOTE_MAX_LENGTH = 500

export type NoteValidationResult = { valid: true; value: string } | { valid: false; message: string }

export function validateNote(rawNote: string): NoteValidationResult {
  const trimmed = rawNote.trim()

  if (trimmed.length > NOTE_MAX_LENGTH) {
    return { valid: false, message: `Notes can be up to ${NOTE_MAX_LENGTH} characters.` }
  }

  return { valid: true, value: trimmed }
}
