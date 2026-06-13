import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { Recycle, Menu, X } from 'lucide-react'
import CreditBadge from './components/common/CreditBadge.jsx'
import ThemeToggle from './components/common/ThemeToggle.jsx'
import LandingPage from './pages/LandingPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ReturnFlowPage from './pages/ReturnFlowPage.jsx'
import MarketplacePage from './pages/MarketplacePage.jsx'
import ListingDetailPage from './pages/ListingDetailPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/checkout', label: 'Checkout' },
  { to: '/return', label: 'Return' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/dashboard', label: 'Dashboard' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-40 bg-[#022c22] transition-shadow duration-300 ${scrolled ? 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group flex items-center gap-2.5 font-display font-bold text-xl">
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-[#022c22] shadow-md shadow-emerald-500/30 transition-transform duration-500 group-hover:rotate-180">
              <Recycle size={20} />
            </span>
            <span className="text-emerald-400">ReLoop</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-emerald-400" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <CreditBadge credits={350} />
            <button className="md:hidden p-2 rounded-lg text-gray-200 hover:bg-white/10" onClick={() => setOpen(!open)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#022c22] px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-gray-300 hover:bg-white/5'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/return" element={<ReturnFlowPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:twinId" element={<ListingDetailPage />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <p className="font-display text-7xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</p>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Page not found</p>
                <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <footer className="relative text-gray-400 py-10 overflow-hidden" style={{ background: 'var(--gradient-dark)' }}>
          <div className="relative max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 font-display font-semibold text-white">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-[#022c22]">
                <Recycle size={15} />
              </span>
              ReLoop
            </div>
            <p>Built for HackOn with Amazon Season 6.0 · Second Life Commerce</p>
            <p className="text-gray-500">Every product deserves a second life 🌱</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
