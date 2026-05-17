import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockResolved = { data: [], error: null }

function createThenableBuilder(resolved = mockResolved) {
  const builder: {
    select: ReturnType<typeof vi.fn>
    order: ReturnType<typeof vi.fn>
    eq: ReturnType<typeof vi.fn>
    insert: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    single: ReturnType<typeof vi.fn>
    then: (
      onFulfilled: (value: typeof mockResolved) => unknown,
    ) => Promise<typeof mockResolved>
  } = {
    select: vi.fn(),
    order: vi.fn(),
    eq: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    single: vi.fn().mockResolvedValue(resolved),
    then(onFulfilled) {
      return Promise.resolve(resolved).then(onFulfilled)
    },
  }

  builder.select.mockReturnValue(builder)
  builder.order.mockReturnValue(builder)
  builder.eq.mockReturnValue(builder)
  builder.insert.mockReturnValue(builder)
  builder.update.mockReturnValue(builder)

  return builder
}

vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../supabase'
import { getTopics, createTopic, updateTopic } from './topics'

const mockedFrom = vi.mocked(supabase.from)

describe('topics data access layer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getTopics queries blog_topic_queue with select and order', async () => {
    const builder = createThenableBuilder()
    mockedFrom.mockReturnValue(builder as never)

    await getTopics()

    expect(mockedFrom).toHaveBeenCalledWith('blog_topic_queue')
    expect(builder.select).toHaveBeenCalledWith('*')
    expect(builder.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('getTopics filters by user_id for non-admin users', async () => {
    const builder = createThenableBuilder()
    mockedFrom.mockReturnValue(builder as never)

    await getTopics('user-123', false)

    expect(builder.eq).toHaveBeenCalledWith('user_id', 'user-123')
  })

  it('createTopic inserts into blog_topic_queue', async () => {
    const builder = createThenableBuilder({ data: { id: 'new-1' }, error: null })
    mockedFrom.mockReturnValue(builder as never)

    await createTopic({ topic: 'Test Topic', status: 'queued' })

    expect(mockedFrom).toHaveBeenCalledWith('blog_topic_queue')
    expect(builder.insert).toHaveBeenCalledWith({ topic: 'Test Topic', status: 'queued' })
    expect(builder.single).toHaveBeenCalled()
  })

  it('updateTopic updates blog_topic_queue by id', async () => {
    const builder = createThenableBuilder({ data: { id: 'topic-123' }, error: null })
    mockedFrom.mockReturnValue(builder as never)

    await updateTopic('topic-123', { status: 'published' })

    expect(mockedFrom).toHaveBeenCalledWith('blog_topic_queue')
    expect(builder.update).toHaveBeenCalledWith({ status: 'published' })
    expect(builder.eq).toHaveBeenCalledWith('id', 'topic-123')
    expect(builder.single).toHaveBeenCalled()
  })
})
