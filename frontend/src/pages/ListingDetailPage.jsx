import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, ArrowLeft, CheckCircle, Leaf, MapPin, ShieldCheck } from 'lucide-react'
import { getListing, buyItem } from '../api/client.js'
import GradeIndicator from '../components/common/GradeIndicator.jsx'
import ConditionReport from '../components/grading/ConditionReport.jsx'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import Badge from '../components/common/Badge.jsx'
import { gradeVariant } from '../components/common/Badge.jsx'
import { CategoryIcon } from '../components/common/ProductIcons.jsx'

const CAT_BG = {
  electronics: 'from-sky-100 to-cyan-100 dark:from-sky-500/15 dark:to-cyan-500/10',
  fashion:     'from-rose-100 to-pink-100 dark:from-rose-500/15 dark:to-pink-500/10',
  home:        'from-amber-100 to-orange-100 dark:from-amber-500/15 dark:to-orange-500/10',
  books:       'from-violet-100 to-fuchsia-100 dark:from-violet-500/15 dark:to-fuchsia-500/10',
  other:       'from-emerald-100 to-teal-100 dark:from-emerald-500/15 dark:to-teal-500/10',
}
const CAT_COLOR = {
  electronics: 'text-sky-600 dark:text-sky-300',
  fashion:     'text-rose-600 dark:text-rose-300',
  home:        'text-amber-600 dark:text-amber-300',
  books:       'text-violet-600 dark:text-violet-300',
  other:       'text-emerald-600 dark:text-emerald-300',
}

export default function ListingDetailPage() {
  const { twinId } = useParams()
  const [twin, setTwin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [bought, setBought] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'ReLoop — Listing Detail' }, [])

  useEffect(() => {
    getListing(twinId)
      .then(setTwin)
      .catch(() => setError('Could not load this listing.'))
      .finally(() => setLoading(false))
  }, [twinId])

  async function handleBuy() {
    setBuying(true)
    try {
      await buyItem(twinId, 'cust-buyer-001')
      setBought(true)
    } catch {
      setError('Purchase failed. Please try again.')
    } finally {
      setBuying(false)
    }
  }

  if (loading) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" message="Loading listing…" /></div>
  if (!twin) return <div className="text-center py-24 text-gray-500">{error || 'Listing not found.'}</div>

  const { item, grading, valuation, routing } = twin
  const discount = valuation ? Math.round((1 - valuation.price_multiplier) * 100) : 0
  const conditionHash = grading?.condition_hash || twin?.condition_hash
  const nearbyBuyer   = twin?.nearby_buyer

  return (
    <div className="animate-fadeInUp max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6">
        <ArrowLeft size={16} /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: image + grade */}
        <div>
          <div className={`bg-gradient-to-br ${CAT_BG[item.category] || CAT_BG.other} rounded-2xl h-72 flex items-center justify-center mb-4 overflow-hidden`}>
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <CategoryIcon
                category={item.category}
                size={140}
                className={`${CAT_COLOR[item.category] || CAT_COLOR.other} drop-shadow-md`}
              />
            )}
          </div>
          {grading?.grade && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">AI-Verified Condition</p>
              <GradeIndicator grade={grading.grade} confidence={grading.confidence} size="lg" />
              <p className="text-xs text-gray-400 mt-4">Graded on {new Date(grading.graded_at).toLocaleDateString('en-IN')}</p>
            </div>
          )}
        </div>

        {/* Right: details */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider mb-1 capitalize">{item.category}</p>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{item.title}</h1>
            <p className="font-mono text-xs text-gray-400 dark:text-gray-500 mb-3">{twin.twin_id}</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">₹{valuation?.resale_price?.toLocaleString('en-IN')}</span>
              <span className="text-gray-400 dark:text-gray-500 line-through text-lg">₹{item.original_price?.toLocaleString('en-IN')}</span>
              {discount > 0 && <Badge text={`Save ${discount}%`} variant="success" />}
            </div>
          </div>

          {/* Trust section */}
          <div className="bg-sky-50 dark:bg-sky-500/10 rounded-xl p-4 border border-sky-100 dark:border-sky-500/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-sky-600 dark:text-sky-400" />
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">AI-Verified Condition Report</p>
            </div>
            <ConditionReport grading={grading} />

            {/* SHA-256 tamper-evident fingerprint */}
            {conditionHash && (
              <div className="mt-3 flex items-center gap-2 pt-3 border-t border-sky-100 dark:border-sky-500/20">
                <ShieldCheck size={13} className="text-sky-500 dark:text-sky-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-sky-700 dark:text-sky-300 font-medium">Tamper-evident fingerprint</p>
                  <p className="font-mono text-xs text-sky-600 dark:text-sky-400 truncate">{conditionHash}</p>
                </div>
              </div>
            )}
          </div>

          {/* Nearby buyer card — only shown for P2P listings */}
          {nearbyBuyer && (
            <div className="bg-violet-50 dark:bg-violet-500/10 rounded-xl p-4 border border-violet-100 dark:border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={15} className="text-violet-600 dark:text-violet-400" />
                <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">Local Buyer Found Nearby</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{nearbyBuyer.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pincode {nearbyBuyer.pincode}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-violet-600 dark:text-violet-400">{nearbyBuyer.distance_km} km</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">away</p>
                </div>
              </div>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-2">
                P2P handoff saves {routing?.savings?.km_avoided} km of shipping 🌿
              </p>
            </div>
          )}

          {/* Environmental impact */}
          {routing?.savings && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={16} className="text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Environmental Impact</p>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Buying this saves <strong>{routing.savings.co2_saved_kg} kg CO₂</strong> and{' '}
                <strong>₹{routing.savings.cost_saved?.toLocaleString('en-IN')}</strong> in logistics.
              </p>
            </div>
          )}

          <Button className="w-full" size="lg" loading={buying} onClick={handleBuy}>
            Buy Now · ₹{valuation?.resale_price?.toLocaleString('en-IN')}
          </Button>
        </div>
      </div>

      <Modal isOpen={bought} onClose={() => setBought(false)} title="Purchase Successful!">
        <div className="text-center">
          <CheckCircle size={52} className="text-emerald-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">You've secured this item!</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">The seller will be notified. Expect delivery in 2-3 days.</p>
          <div className="flex flex-col gap-3">
            <Link to="/marketplace" onClick={() => setBought(false)}>
              <Button className="w-full">Back to Marketplace</Button>
            </Link>
            <Link to="/dashboard" onClick={() => setBought(false)}>
              <Button variant="secondary" className="w-full">View Dashboard</Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}
