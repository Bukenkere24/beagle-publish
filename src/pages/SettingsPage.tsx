import { motion } from 'framer-motion'

export default function SettingsPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto"
    >
      <h1 className="text-beagle-text-heading font-heading font-semibold text-4xl mb-8">
        Settings
      </h1>
      <p className="text-beagle-text-muted">User info and role (BP-407).</p>
    </motion.section>
  )
}
