import { useNavigate } from 'react-router-dom'
import { CheckCircle, ShieldCheck } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import { gradeVariant } from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import { CategoryIcon } from '../common/ProductIcons.jsx'

/* Category → soft tinted gradient backgrounds for the image area */
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

export default function ListingCard({ twin }) {
  const navigate = useNavigate()
  const { item, grading, valuation } = twin
  const discount = valuation ? Math.round((1 - valuation.price_multiplier) * 100) : 0
  const conditionHash = grading?.condition_hash
  const cat = item?.category || 'other'

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm card-hover overflow-hidden flex flex-col">
      <div className={`relative h-44 bg-gradient-to-br ${CAT_BG[cat] || CAT_BG.other} flex items-center justify-center overflow-hidden`}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <CategoryIcon
            category={cat}
            size={84}
            className={`${CAT_COLOR[cat] || CAT_COLOR.other} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
          />
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
        {/* Category pill — visible always */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 dark:bg-gray-900/70 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
            {cat}
          </span>
        </div>
        {/* AI verified badge — shows on hover */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CheckCircle size={11} />
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
