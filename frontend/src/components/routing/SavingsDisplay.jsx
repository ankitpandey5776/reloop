import { TrendingUp, Leaf, MapPin } from 'lucide-react'

const CARDS = [
  { key: 'cost', icon: TrendingUp, label: 'Cost Saved', wrap: 'from-emerald-50 to-emerald-100/50 border-emerald-200/50', icon_c: 'text-emerald-500', value_c: 'text-emerald-700' },
  { key: 'co2', icon: Leaf, label: 'CO₂ Prevented', wrap: 'from-sky-50 to-sky-100/50 border-sky-200/50', icon_c: 'text-sky-500', value_c: 'text-sky-700' },
  { key: 'km', icon: MapPin, label: 'Travel Avoided', wrap: 'from-violet-50 to-violet-100/50 border-violet-200/50', icon_c: 'text-violet-500', value_c: 'text-violet-700' },
]

export default function SavingsDisplay({ savings }) {
  if (!savings) return null
  const values = {
    cost: `₹${savings.cost_saved?.toLocaleString('en-IN')}`,
    co2: `${savings.co2_saved_kg} kg`,
    km: `${savings.km_avoided} km`,
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      {CARDS.map(({ key, icon: Icon, label, wrap, icon_c, value_c }) => (
        <div key={key} className={`bg-gradient-to-br ${wrap} rounded-2xl p-4 text-center border`}>
          <Icon size={22} className={`${icon_c} mx-auto mb-2`} />
          <p className={`font-display text-xl font-bold tabular-nums ${value_c}`}>{values[key]}</p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}
