import { useState, useEffect } from 'react'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { getListings, getRecommendations } from '../api/client.js'
import ListingCard from '../components/marketplace/ListingCard.jsx'
import ListingFilters from '../components/marketplace/ListingFilters.jsx'
import { CardSkeleton } from '../components/common/Skeleton.jsx'

// Fixed demo customer — in production this comes from auth context
const DEMO_CUSTOMER_ID = 'cust-001'

export default function MarketplacePage() {
  const [listings, setListings] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ search: '', category: 'all', grade: 'all', sort: 'newest' })

  useEffect(() => { document.title = 'ReLoop — Marketplace' }, [])

  // Load recommendations once on mount (personalised, separate from filters)
  useEffect(() => {
    getRecommendations(DEMO_CUSTOMER_ID, 4)
      .then(r => setRecommendations(r.recommendations || []))
      .catch(() => {})  // recommendations are non-critical, fail silently
  }, [])

  useEffect(() => {
    setLoading(true)
    getListings({ category: filters.category, grade: filters.grade, search: filters.search })
      .then(r => {
        let data = r.listings || []
        if (filters.sort === 'price_asc') data = [...data].sort((a, b) => (a.valuation?.resale_price || 0) - (b.valuation?.resale_price || 0))
        if (filters.sort === 'price_desc') data = [...data].sort((a, b) => (b.valuation?.resale_price || 0) - (a.valuation?.resale_price || 0))
        if (filters.sort === 'grade') data = [...data].sort((a, b) => (a.grading?.grade || 'Z').localeCompare(b.grading?.grade || 'Z'))
        setListings(data)
      })
      .catch(() => setError('Failed to load listings. Please try again.'))
      .finally(() => setLoading(false))
  }, [filters])

  // IDs already shown in recommendations — exclude from main grid to avoid duplication
  const recIds = new Set(recommendations.map(r => r.twin_id))
  const mainListings = listings.filter(t => !recIds.has(t.twin_id))

  return (
    <div className="animate-fadeInUp">
      <ListingFilters filters={filters} onChange={setFilters} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Recommendations carousel ─────────────────────────────────── */}
        {recommendations.length > 0 && !filters.search && filters.category === 'all' && filters.grade === 'all' && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-violet-500" />
              <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Recommended for You</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500">Based on your purchase history</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendations.map((twin, i) => (
                <div key={twin.twin_id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="relative">
                    {/* Recommended pill overlay */}
                    <div className="absolute -top-2 left-3 z-10 bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      Recommended
                    </div>
                    <ListingCard twin={twin} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-100 dark:border-gray-800" />
          </div>
        )}

        {/* ── Main grid ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={22} className="text-emerald-600" />
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {filters.search || filters.category !== 'all' || filters.grade !== 'all' ? 'Search Results' : 'All Listings'}
          </h1>
          {!loading && <span className="text-sm text-gray-500 dark:text-gray-400">{mainListings.length} items</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : mainListings.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No listings found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {mainListings.map((twin, i) => (
              <div key={twin.twin_id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 0.06, 0.5)}s` }}>
                <ListingCard twin={twin} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
