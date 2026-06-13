import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = {
  RESELL_P2P: '#059669',
  RESELL_RENEWED: '#0ea5e9',
  REFURBISH: '#8b5cf6',
  DONATE: '#14b8a6',
  RECYCLE: '#06b6d4',
}

const LABELS = {
  RESELL_P2P: 'Resell P2P',
  RESELL_RENEWED: 'Resell Renewed',
  REFURBISH: 'Refurbish',
  DONATE: 'Donate',
  RECYCLE: 'Recycle',
}

export default function RouteDistribution({ data }) {
  const chartData = Object.entries(data || {}).map(([key, value]) => ({
    name: LABELS[key] || key,
    value,
    color: COLORS[key] || '#6B7280',
  }))
  const total = chartData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
      <h3 className="font-display text-base font-semibold text-gray-900 dark:text-white mb-4">Route Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [`${v} items`, n]} />
          <Legend iconType="circle" iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 -mt-2">{total} items routed</p>
    </div>
  )
}
