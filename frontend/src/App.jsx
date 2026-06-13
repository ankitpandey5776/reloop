import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { Recycle, Menu, X } from 'lucide-react'
import CreditBadge from './components/common/CreditBadge.jsx'
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
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass border-b border-emerald-100/60 shadow-[0_4px_24px_-12px_rgba(16,185,129,0.35)]' : 'bg-white/80 border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group flex items-center gap-2 font-bold text-xl">
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 transition-transform duration-500 group-hover:rotate-180">
              <Recycle size={20} />
            </span>
            <span className="text-gradient">ReLoop</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <CreditBadge credits={350} />
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(!open)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
                <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
                <p className="text-xl font-semibold text-gray-700 mb-2">Page not found</p>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <footer className="relative bg-gray-900 text-gray-400 py-10 overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
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
