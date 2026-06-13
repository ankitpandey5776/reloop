import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Sun, Moon } from 'lucide-react'

function getInitial() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(getInitial)
  const btnRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    try { localStorage.setItem('reloop-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  function handleToggle() {
    const apply = () => setDark(d => !d)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Fall back to an instant swap where View Transitions aren't supported.
    if (!document.startViewTransition || reduce) { apply(); return }

    const rect = btnRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40
    const y = rect ? rect.top + rect.height / 2 : 40
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => flushSync(apply))
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleToggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#022c22] ${dark ? 'bg-emerald-500/25' : 'bg-white/15'} ${className}`}
    >
      {/* static track icons */}
      <Sun size={13} className={`absolute left-1.5 transition-opacity duration-300 ${dark ? 'opacity-40 text-gray-300' : 'opacity-0'}`} />
      <Moon size={13} className={`absolute right-1.5 transition-opacity duration-300 ${dark ? 'opacity-0' : 'opacity-40 text-gray-200'}`} />
      {/* sliding knob */}
      <span
        className={`relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${dark ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {dark
          ? <Moon size={14} className="text-emerald-600" />
          : <Sun size={14} className="text-amber-500" />}
      </span>
    </button>
  )
}
