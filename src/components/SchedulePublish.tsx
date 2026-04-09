import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatScheduledAt } from '../lib/time'
import type { TopicRow } from '../types/topic'

type Props = {
  topic: TopicRow
  onSaved: () => void
}

/** BP-408: persist `scheduled_publish_at`. Auto-publish via n8n (see README). */
export default function SchedulePublish({ topic, onSaved }: Props) {
  const [local, setLocal] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* eslint-disable react-hooks/set-state-in-effect -- mirror server scheduled time into datetime-local */
  useEffect(() => {
    const initial = topic.scheduled_publish_at
    if (!initial) {
      setLocal('')
      return
    }
    const d = new Date(initial)
    const pad = (n: number) => String(n).padStart(2, '0')
    setLocal(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
    )
  }, [topic.scheduled_publish_at])
  /* eslint-enable react-hooks/set-state-in-effect */

  async function persist(iso: string | null) {
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('blog_topic_queue')
      .update({ scheduled_publish_at: iso })
      .eq('id', topic.id)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSaved()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setLocal(v)
    if (!v) {
      void persist(null)
      return
    }
    const ms = new Date(v).getTime()
    if (Number.isNaN(ms)) return
    void persist(new Date(ms).toISOString())
  }

  if (topic.status !== 'review') {
    return topic.scheduled_publish_at ? (
      <p className="text-sm text-beagle-text-dimmed">
        Scheduled: {formatScheduledAt(topic.scheduled_publish_at)}
      </p>
    ) : null
  }

  return (
    <div className="mt-8 rounded-beagle border border-beagle-border-section bg-beagle-surface/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-beagle-text-heading">
            Schedule publish (BP-408)
          </h3>
          <p className="mt-1 text-xs text-beagle-text-dimmed">
            Saves <code className="text-beagle-text-muted">scheduled_publish_at</code>.
            Use n8n or a cron job to auto-publish when due.
          </p>
        </div>
        {saving && (
          <span className="text-xs text-beagle-text-muted">Saving…</span>
        )}
        {saved && (
          <span className="text-xs text-green-400" aria-live="polite">
            Saved
          </span>
        )}
      </div>
      <label className="mt-4 block text-xs uppercase tracking-wider text-beagle-text-dimmed">
        Date &amp; time (local)
      </label>
      <input
        type="datetime-local"
        value={local}
        onChange={handleChange}
        className="mt-2 w-full max-w-sm rounded-beagle border border-beagle-border bg-beagle-bg px-3 py-2 text-sm text-beagle-white focus:border-beagle-border-hover focus:outline-none"
      />
      {topic.scheduled_publish_at && (
        <p className="mt-2 text-xs text-beagle-text-muted">
          Stored: {formatScheduledAt(topic.scheduled_publish_at)}
        </p>
      )}
      <button
        type="button"
        className="mt-3 text-xs text-beagle-primary hover:underline"
        onClick={() => {
          setLocal('')
          void persist(null)
        }}
      >
        Clear schedule
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
