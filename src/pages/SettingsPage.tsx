import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { LogOut, Save, Shield, User, Sliders, Moon, Sun, Monitor, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    defaultTone: profile?.preferences?.defaultTone || 'professional',
    publicationName: profile?.preferences?.publicationName || '',
    topicsOfInterest: profile?.preferences?.topicsOfInterest?.join(', ') || '',
    theme: profile?.preferences?.theme || 'dark'
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        defaultTone: profile.preferences?.defaultTone || 'professional',
        publicationName: profile.preferences?.publicationName || '',
        topicsOfInterest: profile.preferences?.topicsOfInterest?.join(', ') || '',
        theme: profile.preferences?.theme || 'dark'
      })
    }
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('bcc_profiles')
        .update({
          full_name: formData.full_name,
          preferences: {
            defaultTone: formData.defaultTone,
            publicationName: formData.publicationName,
            topicsOfInterest: formData.topicsOfInterest.split(',').map(s => s.trim()).filter(Boolean),
            theme: formData.theme
          }
        })
        .eq('id', user.id)

      if (error) throw error
      await refreshProfile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <header className="mb-10">
        <h1 className="text-4xl font-heading font-bold text-beagle-text-heading mb-2">Settings</h1>
        <p className="text-beagle-text-muted">Manage your account preferences and AI writing style.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Account Section */}
        <div className="beagle-glass rounded-beagle border border-beagle-border overflow-hidden">
          <div className="px-6 py-4 border-b border-beagle-border bg-white/[0.02] flex items-center gap-3">
            <User size={18} className="text-beagle-primary" />
            <h2 className="font-heading font-bold uppercase tracking-widest text-xs text-beagle-text-muted">Account Profile</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-3">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full bg-beagle-surface border border-beagle-border rounded-full px-5 py-3 text-beagle-text-dimmed cursor-not-allowed opacity-60"
                />
                <p className="mt-2 text-[10px] text-beagle-text-faint italic">Email cannot be changed (Google OAuth)</p>
              </div>
              <div>
                <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-3">Full Name</label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Your Name"
                  className="w-full bg-beagle-surface border border-beagle-border rounded-full px-5 py-3 text-beagle-text-body focus:border-beagle-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-beagle-border/50">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={16} className={profile?.role === 'admin' ? 'text-beagle-primary' : 'text-beagle-text-muted'} />
                <span className="text-xs font-bold uppercase tracking-widest text-beagle-text-muted">Access Role</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-beagle-surface border border-beagle-border rounded-full">
                <div className={`w-2 h-2 rounded-full ${profile?.role === 'admin' ? 'bg-beagle-primary' : 'bg-green-400'}`} />
                <span className="text-xs font-bold text-beagle-text-body capitalize">{profile?.role || 'editor'}</span>
              </div>
              <p className="mt-3 text-xs text-beagle-text-dimmed leading-relaxed">
                {profile?.role === 'admin' 
                  ? 'You have full access to publish posts and manage global dashboard settings.' 
                  : 'You can create and edit drafts. Publishing to live sites requires approval from an administrator.'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Writing Section */}
        <div className="beagle-glass rounded-beagle border border-beagle-border overflow-hidden">
          <div className="px-6 py-4 border-b border-beagle-border bg-white/[0.02] flex items-center gap-3">
            <Sliders size={18} className="text-beagle-primary" />
            <h2 className="font-heading font-bold uppercase tracking-widest text-xs text-beagle-text-muted">Writing Preferences</h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-3">Default Writing Tone</label>
                <select 
                  value={formData.defaultTone}
                  onChange={(e) => setFormData({...formData, defaultTone: e.target.value as any})}
                  className="w-full bg-beagle-surface border border-beagle-border rounded-full px-5 py-3 text-beagle-text-body focus:border-beagle-primary outline-none appearance-none cursor-pointer"
                >
                  <option value="professional">Professional & Authoritative</option>
                  <option value="casual">Casual & Conversational</option>
                  <option value="technical">Technical & Detailed</option>
                  <option value="creative">Creative & Story-driven</option>
                </select>
              </div>
              <div>
                <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-3">Publication Name</label>
                <input 
                  type="text" 
                  value={formData.publicationName}
                  onChange={(e) => setFormData({...formData, publicationName: e.target.value})}
                  placeholder="e.g. Beagle AI News"
                  className="w-full bg-beagle-surface border border-beagle-border rounded-full px-5 py-3 text-beagle-text-body focus:border-beagle-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-3">Topics of Interest (comma-separated)</label>
              <textarea 
                value={formData.topicsOfInterest}
                onChange={(e) => setFormData({...formData, topicsOfInterest: e.target.value})}
                placeholder="AI, SaaS, Engineering, Product Management"
                rows={3}
                className="w-full bg-beagle-surface border border-beagle-border rounded-2xl px-5 py-4 text-beagle-text-body focus:border-beagle-primary outline-none transition-all resize-none"
              />
              <p className="mt-2 text-[10px] text-beagle-text-dimmed uppercase tracking-wider font-bold">These topics will guide the AI research agent when generating your briefs.</p>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="beagle-glass rounded-beagle border border-beagle-border overflow-hidden">
          <div className="px-6 py-4 border-b border-beagle-border bg-white/[0.02] flex items-center gap-3">
            <Monitor size={18} className="text-beagle-primary" />
            <h2 className="font-heading font-bold uppercase tracking-widest text-xs text-beagle-text-muted">Appearance</h2>
          </div>
          <div className="p-8">
            <div className="flex gap-4">
              {[
                { id: 'light', icon: Sun, label: 'Light' },
                { id: 'dark', icon: Moon, label: 'Dark' },
                { id: 'system', icon: Monitor, label: 'System' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({...formData, theme: t.id as any})}
                  className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                    formData.theme === t.id 
                    ? 'bg-beagle-primary/10 border-beagle-primary text-beagle-primary' 
                    : 'bg-beagle-surface border-beagle-border text-beagle-text-muted hover:border-beagle-border-hover hover:text-beagle-text-body'
                  }`}
                >
                  <t.icon size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-beagle-primary text-white font-bold rounded-full px-8 py-4 uppercase tracking-widest text-sm hover:bg-beagle-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-beagle-primary/25 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {success ? 'Settings Saved!' : 'Save All Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => signOut()}
            className="px-8 py-4 rounded-full border border-beagle-border text-beagle-text-muted hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/5 transition-all font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </form>
    </motion.section>
  )
}
