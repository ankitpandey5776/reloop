import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white focus:ring-emerald-500 shadow-sm hover:shadow-md hover:shadow-emerald-500/25',
  secondary: 'bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 focus:ring-gray-400',
  danger: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-400',
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
