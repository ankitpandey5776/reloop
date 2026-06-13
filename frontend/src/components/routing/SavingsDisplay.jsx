import { TrendingUp, Leaf, MapPin } from 'lucide-react'

export default function SavingsDisplay({ savings }) {
  if (!savings) return null
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: TrendingUp, label: 'Cost Saved', value: `₹${savings.cost_saved?.toLocaleString('en-IN')}`, color: 'emerald' },
        { icon: Leaf, label: 'CO₂ Prevented', value: `${savings.co2_saved_kg} kg`, color: 'sky' },
        { icon: MapPin, label: 'Travel Avoided', value: `${savings.km_avoided} km`, color: 'violet' },
      ].map(({ icon: Icon, label, value, color }) => (
        <div key={label} className={`bg-${color}-50 rounded-xl p-4 text-center border border-${color}-100`}>
          <Icon size={20} className={`text-${color}-500 mx-auto mb-2`} />
          <p className={`text-lg font-bold text-${color}-700`}>{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
