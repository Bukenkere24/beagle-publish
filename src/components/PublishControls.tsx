type PublishControlsProps = {
  topicId: string
  status: string
  draftContent: string
  linkedinDraft: string
}

export default function PublishControls({
  topicId,
  status,
  draftContent,
  linkedinDraft,
}: PublishControlsProps) {
  const canPublishBlog = status === 'review' && !!draftContent
  const canPublishLinkedIn = !!linkedinDraft

  return (
    <div className="flex flex-wrap gap-4 rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6">
      <h3 className="text-beagle-primary text-xl font-semibold w-full">Publish</h3>
      <button
        type="button"
        disabled={!canPublishBlog}
        className="bg-beagle-primary text-white rounded-beagle-btn px-6 py-4 uppercase tracking-wider font-medium hover:bg-beagle-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Publish to Blog
      </button>
      <button
        type="button"
        disabled={!canPublishLinkedIn}
        className="bg-beagle-primary text-white rounded-beagle-btn px-6 py-4 uppercase tracking-wider font-medium hover:bg-beagle-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Post to LinkedIn
      </button>
      <p className="text-beagle-text-muted text-sm w-full">
        Adapter pattern + confirmation modal (BP-405, BP-406).
      </p>
    </div>
  )
}
