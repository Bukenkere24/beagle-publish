export type DocumentTheme = 'dark' | 'light'

export function applyDocumentTheme(theme: DocumentTheme | undefined) {
  const t = theme === 'light' ? 'light' : 'dark'
  document.documentElement.dataset.theme = t
}
