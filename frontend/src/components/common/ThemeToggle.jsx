import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

function getInitial() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(getInitial)

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('reloop-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark(d => !d)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl text-gray-200 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${className}`}
    >
      <Sun size={18} className={`absolute transition-all duration-300 ${dark ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-amber-300'}`} />
      <Moon size={18} className={`absolute transition-all duration-300 ${dark ? 'opacity-100 rotate-0 scale-100 text-emerald-300' : 'opacity-0 rotate-90 scale-0'}`} />
    </button>
  )
}
