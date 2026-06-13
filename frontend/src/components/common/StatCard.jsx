export default function StatCard({ label, value, icon: Icon, trend, prefix = '' }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden card-hover animate-scale-in">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
          {trend && (
            <span className="inline-flex items-center mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            <Icon size={22} className="text-emerald-600" />
          </div>
        )}
      </div>
    </div>
  )
}
