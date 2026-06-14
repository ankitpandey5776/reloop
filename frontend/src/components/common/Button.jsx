import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white focus-visible:ring-emerald-500 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5',
  secondary: 'bg-white border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 focus-visible:ring-emerald-400',
  danger: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white focus-visible:ring-rose-500 shadow-lg shadow-rose-500/25 hover:-translate-y-0.5',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 focus-visible:ring-gray-400',
  // Inverted/solid white button for dark backgrounds. Transparent border keeps
  // it the exact same height as `glass` when the two sit side by side.
  white: 'bg-white border-2 border-transparent text-[#04150f] shadow-lg hover:bg-emerald-50 hover:-translate-y-0.5 focus-visible:ring-emerald-300',
  // Translucent outline button for dark backgrounds.
  glass: 'bg-white/10 border-2 border-white/25 text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 focus-visible:ring-white/50',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ variant = 'primary', size = 'md', loading = false, disabled, onClick, children, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
