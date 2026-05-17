import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockUseAuth = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

import AuthGuard from './AuthGuard'

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      loading: false,
    })

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>,
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when no user', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={['/topics']}>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>,
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('shows loading state while auth is resolving', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(
      <MemoryRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </MemoryRouter>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
