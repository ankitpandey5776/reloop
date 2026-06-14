import { useNavigate } from 'react-router-dom'
import { Package, CheckCircle, ShieldCheck } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import { gradeVariant } from '../common/Badge.jsx'
import Button from '../common/Button.jsx'

export default function ListingCard({ twin }) {
  const navigate = useNavigate()
  const { item, grading, valuation } = twin
  const discount = valuation ? Math.round((1 - valuation.price_multiplier) * 100) : 0
  const conditionHash = grading?.condition_hash

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm card-hover overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <Package size={40} className="text-gray-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {grading?.grade && (
          <div className="absolute top-2 right-2">
            <Badge text={`Grade ${grading.grade}`} variant={gradeVariant(grading.grade)} />
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 left-0 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-r-full shadow-md">
            −{discount}%
          </div>
        )}
        {/* AI Verified badge — reveals on hover */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-emerald-700 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CheckCircle size={12} />
          AI Verified{grading?.confidence ? ` · ${Math.round(grading.confidence * 100)}%` : ''}
        </div>
        {/* SHA-256 hash mini-badge — top-left on hover */}
        {conditionHash && (
          <div className="absolute top-10 left-3 bg-sky-900/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-[9px] font-mono text-sky-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-[120px] truncate">
            <ShieldCheck size={9} />
            {conditionHash.slice(0, 10)}…
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{item.title}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">₹{valuation?.resale_price?.toLocaleString('en-IN')}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 line-through">₹{item.original_price?.toLocaleString('en-IN')}</span>
        </div>
        {grading?.condition_report && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">{grading.condition_report}</p>
        )}
        <div className="mt-auto">
          <Button className="w-full" size="sm" onClick={() => navigate(`/marketplace/${twin.twin_id}`)}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
