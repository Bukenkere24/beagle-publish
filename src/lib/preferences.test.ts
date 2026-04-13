import { describe, expect, it } from 'vitest'
import { mergePreferences } from './preferences'
import { DEFAULT_PREFERENCES } from '../types/preferences'

describe('mergePreferences', () => {
  it('returns defaults for nullish input', () => {
    expect(mergePreferences(null)).toEqual(DEFAULT_PREFERENCES)
    expect(mergePreferences(undefined)).toEqual(DEFAULT_PREFERENCES)
  })

  it('merges partial objects safely', () => {
    const merged = mergePreferences({
      defaultTone: 'casual',
      topicsOfInterest: ['AI', 'startups'],
      unknownField: 'ignored',
    })
    expect(merged.defaultTone).toBe('casual')
    expect(merged.topicsOfInterest).toEqual(['AI', 'startups'])
    expect(merged.theme).toBe(DEFAULT_PREFERENCES.theme)
  })

  it('filters invalid tone and topics', () => {
    expect(
      mergePreferences({
        defaultTone: 'nope',
        topicsOfInterest: ['ok', 1, '', '  ', 'x'],
      }).defaultTone,
    ).toBe(DEFAULT_PREFERENCES.defaultTone)
    expect(
      mergePreferences({
        topicsOfInterest: ['ok', 1, '', '  ', 'x'],
      }).topicsOfInterest,
    ).toEqual(['ok', 'x'])
  })
})
