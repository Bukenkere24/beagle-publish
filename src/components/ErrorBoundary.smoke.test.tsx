import { Component, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

/** Minimal boundary for smoke-testing fallback rendering (production uses BP-612). */
class SmokeErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div role="alert">Something went wrong</div>
    }
    return this.props.children
  }
}

function ThrowingChild(): never {
  throw new Error('smoke-test-throw')
}

describe('Error boundary smoke', () => {
  it('renders fallback UI when a child throws during render', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <SmokeErrorBoundary>
        <ThrowingChild />
      </SmokeErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    spy.mockRestore()
  })
})
