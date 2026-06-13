import { useNavigate } from 'react-router-dom'
import { Package, CheckCircle } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import { gradeVariant } from '../common/Badge.jsx'
import Button from '../common/Button.jsx'

export default function ListingCard({ twin }) {
  const navigate = useNavigate()
  const { item, grading, valuation } = twin
  const discount = valuation ? Math.round((1 - valuation.price_multiplier) * 100) : 0

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gray-100 flex items-center justify-center">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <Package size={40} className="text-gray-300" />
        )}
        {grading?.grade && (
          <div className="absolute top-2 right-2">
            <Badge text={`Grade ${grading.grade}`} variant={gradeVariant(grading.grade)} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{item.title}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-emerald-600">₹{valuation?.resale_price?.toLocaleString('en-IN')}</span>
          <span className="text-xs text-gray-400 line-through">₹{item.original_price?.toLocaleString('en-IN')}</span>
        </div>
        {discount > 0 && <p className="text-xs text-emerald-600 font-medium mb-2">Save {discount}%</p>}
        <div className="flex items-center gap-1 text-xs text-sky-600 mb-2">
          <CheckCircle size={12} />
          <span>AI Verified · {grading?.confidence ? `${Math.round(grading.confidence * 100)}% confidence` : ''}</span>
        </div>
        {grading?.condition_report && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-3">{grading.condition_report}</p>
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
