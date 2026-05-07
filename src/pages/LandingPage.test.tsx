import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'

describe('LandingPage', () => {
  it('renders the hero and feature grid without HN/Reddit ingest claims', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /Content Pipeline/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Topic queue/i)).toBeInTheDocument()
    expect(screen.queryByText(/Hacker News/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Reddit/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/auto-ingest/i)).not.toBeInTheDocument()
  })
})
