import { describe, expect, it } from 'vitest'
import { formatScheduledAt } from './time'

describe('formatScheduledAt', () => {
  it('formats an ISO timestamp in a stable, human-readable way', () => {
    const s = formatScheduledAt('2026-05-07T12:30:00.000Z')
    expect(s).toMatch(/2026/)
    expect(s).toMatch(/May|05/)
  })
})
