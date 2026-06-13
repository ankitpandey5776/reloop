import { useState } from 'react'
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

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <Recycle size={24} />
            <span>ReLoop</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                }
              >
                {label}
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
        <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400">
          Built for HackOn with Amazon Season 6.0 | Second Life Commerce
        </footer>
      </div>
    </BrowserRouter>
  )
}
