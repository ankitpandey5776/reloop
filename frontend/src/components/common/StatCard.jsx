export default function StatCard({ label, value, icon: Icon, trend, prefix = '' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
          {trend && (
            <span className="inline-flex items-center mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Icon size={22} className="text-emerald-600" />
          </div>
        )}
      </div>
    </div>
  )
}
