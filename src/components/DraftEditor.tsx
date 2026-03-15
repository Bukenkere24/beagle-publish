export default function DraftEditor() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-beagle border border-beagle-border bg-beagle-surface p-4 mb-8">
      <div className="border border-beagle-border rounded-beagle p-4 bg-beagle-surface">
        <p className="text-beagle-text-muted text-sm mb-2">Markdown (left)</p>
        <textarea
          placeholder="Blog draft content..."
          className="w-full h-64 bg-beagle-surface border border-beagle-border rounded-beagle p-4 text-beagle-white font-mono text-sm resize-none"
          readOnly
        />
      </div>
      <div className="border border-beagle-border rounded-beagle p-4 bg-beagle-surface">
        <p className="text-beagle-text-muted text-sm mb-2">Preview (right)</p>
        <div className="w-full h-64 overflow-auto prose prose-invert max-w-none p-4 text-beagle-text-body">
          Preview with react-markdown (BP-403).
        </div>
      </div>
    </div>
  )
}
