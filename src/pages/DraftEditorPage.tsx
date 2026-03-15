import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import DraftEditor from '../components/DraftEditor'
import PublishControls from '../components/PublishControls'

export default function DraftEditorPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto"
    >
      <h1 className="text-beagle-text-heading font-heading font-semibold text-4xl mb-8">
        Draft Editor {id ? `— ${id.slice(0, 8)}` : ''}
      </h1>
      <p className="text-beagle-text-muted mb-6">
        Blog + LinkedIn tabs and Markdown editor (BP-403). Load topic by id from Supabase.
      </p>
      <DraftEditor />
      <PublishControls topicId={id ?? ''} status="review" draftContent="" linkedinDraft="" />
    </motion.section>
  )
}
