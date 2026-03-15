import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-beagle-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8"
      >
        <h1 className="text-beagle-text-heading font-heading font-semibold text-2xl mb-6 text-center">
          Blog Command Center
        </h1>
        <p className="text-beagle-text-muted text-center mb-6">
          Login form (BP-407). Email/password via Supabase Auth.
        </p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-beagle-surface border border-beagle-border rounded-beagle px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-beagle-surface border border-beagle-border rounded-beagle px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed"
            disabled
          />
          <button
            type="button"
            className="w-full bg-beagle-primary text-white rounded-beagle-btn px-6 py-4 uppercase tracking-wider font-medium hover:bg-beagle-primary-hover"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  )
}
