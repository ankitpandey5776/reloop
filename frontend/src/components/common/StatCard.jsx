import { TrendingUp } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, trend, prefix = '' }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden card-hover animate-scaleIn">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="font-display text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight tabular-nums">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
          {trend && (
            <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={14} />{trend}
            </span>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-100 group-hover:scale-110 group-hover:-rotate-6">
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}
