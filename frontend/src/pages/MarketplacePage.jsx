import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { getListings } from '../api/client.js'
import ListingCard from '../components/marketplace/ListingCard.jsx'
import ListingFilters from '../components/marketplace/ListingFilters.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'

export default function MarketplacePage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ search: '', category: 'all', grade: 'all', sort: 'newest' })

  useEffect(() => { document.title = 'ReLoop — Marketplace' }, [])

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

  return (
    <div>
      <ListingFilters filters={filters} onChange={setFilters} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={22} className="text-emerald-600" />
          <h1 className="text-xl font-semibold text-gray-900">AI-Verified Listings</h1>
          {!loading && <span className="text-sm text-gray-500">{listings.length} items</span>}
        </div>
        {loading ? (
          <div className="flex justify-center py-24"><LoadingSpinner size="lg" message="Loading listings…" /></div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No listings found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((twin, i) => (
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
