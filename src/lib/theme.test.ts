import { describe, expect, it } from 'vitest'
import { applyDocumentTheme } from './theme'

describe('applyDocumentTheme', () => {
  it('sets data-theme on the document element', () => {
    applyDocumentTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    applyDocumentTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('defaults unknown values to dark', () => {
    applyDocumentTheme(undefined)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
