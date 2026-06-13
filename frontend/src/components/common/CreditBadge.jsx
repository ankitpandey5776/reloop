import { Leaf } from 'lucide-react'

export default function CreditBadge({ credits }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime-400/15 text-lime-300 rounded-full text-sm font-semibold ring-1 ring-lime-400/30">
      <Leaf size={14} className="animate-float text-lime-400" style={{ animationDuration: '4s' }} />
      <span className="tabular-nums font-mono">{credits?.toLocaleString('en-IN') || 0}</span> credits
    </span>
  )
}
