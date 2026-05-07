import { Component, type ReactNode } from 'react'

type State = { hasError: boolean }

export class GlobalErrorBoundary extends Component<{ children: ReactNode }, State> {
  state = { hasError: false }
  
  static getDerivedStateFromError() { 
    return { hasError: true } 
  }
  
  componentDidCatch(err: Error, info: unknown) {
    if (import.meta.env.DEV) {
      console.error('[GlobalErrorBoundary]', err, info)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-white">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
            <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-2 tracking-tight">Something went wrong.</h1>
          <p className="text-sm text-beagle-text-muted mb-8 max-w-xs text-center leading-relaxed">
            A critical error occurred. The application state has been preserved for debugging.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-beagle-primary text-white rounded-full uppercase tracking-widest text-xs font-bold hover:bg-beagle-primary-hover transition-all shadow-lg shadow-beagle-primary/20"
          >
            Reload Application
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
