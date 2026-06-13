import { Leaf } from 'lucide-react'

export default function CreditBadge({ credits }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
      <Leaf size={14} />
      {credits?.toLocaleString('en-IN') || 0} credits
    </span>
  )
}
