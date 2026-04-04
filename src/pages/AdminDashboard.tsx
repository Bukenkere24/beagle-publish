import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, Search, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { TopicRow } from '../types/topic'
import TopicCard from '../components/TopicCard'
import StatusBadge from '../components/StatusBadge'

export default function AdminDashboard() {
  const [topics, setTopics] = useState<TopicRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ total: 0, pending: 0, published: 0 })

  const fetchAllTopics = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_topic_queue')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      const allTopics = data as TopicRow[]
      setTopics(allTopics)

      setStats({
        total: allTopics.length,
        pending: allTopics.filter(t => t.status === 'queued' || t.status === 'drafting').length,
        published: allTopics.filter(t => t.status === 'published').length,
      })
    } catch (err) {
      console.error('Failed to fetch admin topics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllTopics()
  }, [fetchAllTopics])

  const filteredTopics = topics.filter(t => 
    t.topic.toLowerCase().includes(search.toLowerCase()) ||
    t.created_by?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto"
    >
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="beagle-glass p-6 rounded-beagle border border-beagle-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-beagle-primary/10 rounded-lg text-beagle-primary">
              <Users size={20} />
            </div>
            <span className="text-beagle-text-muted text-sm font-semibold uppercase tracking-widest">Global Topics</span>
          </div>
          <div className="text-4xl font-heading font-bold text-beagle-text-heading">{stats.total}</div>
        </div>
        
        <div className="beagle-glass p-6 rounded-beagle border border-beagle-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
              <FileText size={20} />
            </div>
            <span className="text-beagle-text-muted text-sm font-semibold uppercase tracking-widest">Awaiting Review</span>
          </div>
          <div className="text-4xl font-heading font-bold text-beagle-text-heading">{stats.pending}</div>
        </div>

        <div className="beagle-glass p-6 rounded-beagle border border-beagle-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-400/10 rounded-lg text-green-400">
              <StatusBadge status="published" className="h-2 w-2" />
            </div>
            <span className="text-beagle-text-muted text-sm font-semibold uppercase tracking-widest">Live Posts</span>
          </div>
          <div className="text-4xl font-heading font-bold text-beagle-text-heading">{stats.published}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-beagle-text-dimmed" />
          <input
            type="text"
            placeholder="Search by topic or creator email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-beagle-surface border border-beagle-border rounded-full pl-12 pr-4 py-3 text-beagle-text-body focus:outline-none focus:border-beagle-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-beagle-border text-beagle-text-muted hover:text-beagle-text-heading hover:bg-beagle-border transition-all font-bold">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-beagle-surface rounded-beagle border border-beagle-border" />
          ))}
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="relative group">
              <div className="absolute -top-3 -right-3 z-10 hidden group-hover:block transition-all">
                <div className="bg-beagle-primary text-[10px] text-white px-2 py-1 rounded-md font-bold shadow-lg">
                  {topic.created_by?.split('@')[0]}
                </div>
              </div>
              <TopicCard 
                topic={topic} 
                onClick={() => window.location.href = `/drafts/${topic.id}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 beagle-glass rounded-beagle border border-beagle-border">
          <p className="text-beagle-text-muted text-lg">No topics found matching your query.</p>
        </div>
      )}
    </motion.section>
  )
}
