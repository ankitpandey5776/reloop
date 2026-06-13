import { Leaf } from 'lucide-react'

export default function CreditBadge({ credits }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100/80 shadow-sm">
      <Leaf size={14} className="animate-float" style={{ animationDuration: '4s' }} />
      <span className="tabular-nums">{credits?.toLocaleString('en-IN') || 0}</span> credits
    </span>
  )
}
