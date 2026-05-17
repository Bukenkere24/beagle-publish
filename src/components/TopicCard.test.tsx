import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import type { TopicRow } from '../types/topic'
import TopicCard from './TopicCard'

vi.mock('framer-motion', () => ({
  motion: {
    article: ({
      children,
      onClick,
      className,
    }: {
      children: React.ReactNode
      onClick?: () => void
      className?: string
    }) => (
      <article onClick={onClick} className={className}>
        {children}
      </article>
    ),
  },
}))

const mockTopic: TopicRow = {
  id: 'topic-1',
  topic: 'How to Build an AI Blog',
  relevance_score: 0.85,
  keywords: ['ai', 'blog'],
  source: 'manual',
  status: 'review',
  draft_content: null,
  draft_title: null,
  slug: null,
  meta_description: null,
  published_at: null,
  created_at: '2026-05-10T00:00:00Z',
  linkedin_draft: null,
  linkedin_post_id: null,
  linkedin_published_at: null,
  scheduled_publish_at: null,
  destination: null,
  created_by: null,
  approved_by: null,
}

describe('TopicCard', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders topic title', () => {
    render(<TopicCard topic={mockTopic} onClick={() => {}} />)
    expect(screen.getByText('How to Build an AI Blog')).toBeInTheDocument()
  })

  it('renders status badge label', () => {
    render(<TopicCard topic={mockTopic} onClick={() => {}} />)
    const card = screen.getByRole('article')
    expect(within(card).getByText('In Review')).toBeInTheDocument()
  })

  it('fires onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<TopicCard topic={mockTopic} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('article'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
