import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LayoutList, FileEdit, Share2, Rocket, ArrowRight } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-beagle-bg text-beagle-text-body overflow-hidden">
      {/* Navbar Overlay */}
      <nav className="fixed top-0 w-full z-50 border-b border-beagle-border bg-beagle-bg/80 backdrop-blur-md">
        <div className="max-w-beagle mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-beagle-primary rounded-sm flex items-center justify-center">
              <span className="text-white font-bold leading-none">B</span>
            </div>
            <span className="text-beagle-text-heading font-heading font-bold text-xl tracking-tight uppercase">
              Blog Command Center
            </span>
          </div>
          <Link 
            to="/login"
            className="text-beagle-white hover:text-beagle-primary transition-colors font-medium flex items-center gap-1"
          >
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-beagle-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-beagle mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-beagle-primary/30 bg-beagle-primary/5 text-beagle-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
              The Next Gen of Content Ops
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-beagle-text-heading leading-[0.95] tracking-tighter mb-6 sm:mb-8 max-w-4xl mx-auto">
              Control your <span className="text-beagle-primary italic">Content Pipeline</span>
            </h1>
            <p className="text-beagle-text-sub text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed pt-4">
              Integrated dashboard to scout topics, generate AI drafts, and publish directly to your blog and LinkedIn. One source of truth for your entire content strategy.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                to="/topics"
                className="w-full md:w-auto bg-beagle-primary hover:bg-beagle-primary-hover text-white rounded-beagle-btn px-10 py-5 uppercase tracking-[0.15em] font-bold transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(69,82,255,0.3)]"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/login"
                className="w-full md:w-auto border border-beagle-border hover:border-beagle-border-hover bg-white/[0.02] text-beagle-white rounded-beagle-btn px-10 py-5 uppercase tracking-[0.15em] font-bold transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-beagle-border">
        <div className="max-w-beagle mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <LayoutList size={24} />,
                title: "Topic Scouting",
                desc: "Auto-ingest trending topics from Hacker News and Reddit directly into your queue.",
                to: "/topics",
              },
              {
                icon: <FileEdit size={24} />,
                title: "Draft Manager",
                desc: "Live Markdown previews and split-pane editing for blog and LinkedIn drafts.",
                to: "/topics",
              },
              {
                icon: <Share2 size={24} />,
                title: "AI Generation",
                desc: "Convert blog posts into LinkedIn drafts in seconds with Gemini 2.0 integration.",
                to: "/topics?intent=ai",
              },
              {
                icon: <Rocket size={24} />,
                title: "Unified Publish",
                desc: "Official adapters to push live at the click of a button or schedule for later.",
                to: "/topics?intent=publish",
              }
            ].map((feature, i) => (
              <Link
                key={feature.title}
                to={feature.to}
                className="block"
              >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-beagle-border rounded-beagle p-6 sm:p-8 group hover:border-beagle-primary/50 transition-all cursor-pointer h-full"
              >
                <div className="w-12 h-12 bg-beagle-primary/10 rounded-sm flex items-center justify-center text-beagle-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-beagle-text-heading mb-3 uppercase tracking-wider italic">
                  {feature.title}
                </h3>
                <p className="text-beagle-text-muted leading-relaxed text-sm sm:text-base">
                  {feature.desc}
                </p>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Segment */}
      <footer className="py-12 px-6 border-t border-beagle-border opacity-50">
        <div className="max-w-beagle mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale brightness-50">
            <div className="w-6 h-6 bg-beagle-primary rounded-sm flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">B</span>
            </div>
            <span className="text-beagle-text-heading font-heading font-bold text-xs uppercase tracking-tighter">
              BCC · Beagle Publish 2026
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-beagle-text-faint">
            Internal Operations Tool · Beagle AI Solutions
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
