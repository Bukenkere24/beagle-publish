import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../hooks/useAuth'
import AuthGuard from './AuthGuard'

const mockedUseAuth = vi.mocked(useAuth)

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when user is authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      loading: false,
    } as ReturnType<typeof useAuth>)

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
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
    } as ReturnType<typeof useAuth>)

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
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
    } as ReturnType<typeof useAuth>)

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
