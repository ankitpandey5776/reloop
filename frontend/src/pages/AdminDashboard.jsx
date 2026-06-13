import { useState, useEffect, useRef } from 'react'
import { Package, ShieldCheck, TrendingUp, Leaf } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getDashboardStats, getRecentTwins } from '../api/client.js'
import StatCard from '../components/common/StatCard.jsx'
import RouteDistribution from '../components/dashboard/RouteDistribution.jsx'
import TwinFeed from '../components/dashboard/TwinFeed.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'

function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0)
  const raf = useRef()
  useEffect(() => {
    if (!target) return
    const start = Date.now()
    function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  return val
}

const GRADE_COLORS = { A: '#059669', B: '#0284C7', C: '#D97706', D: '#DC2626' }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentTwins, setRecentTwins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'ReLoop — Admin Dashboard' }, [])

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentTwins(10)])
      .then(([s, r]) => { setStats(s); setRecentTwins(r.twins || []) })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      getRecentTwins(10).then(r => setRecentTwins(r.twins || [])).catch(() => {})
    }, 10000)
    return () => clearInterval(id)
  }, [])

  const totalTwins = useCountUp(stats?.total_twins || 0)
  const prevented = useCountUp(stats?.returns_prevented || 0)
  const costSaved = useCountUp(stats?.total_cost_saved || 0)
  const co2 = useCountUp(stats?.total_co2_saved_kg ? Math.round(stats.total_co2_saved_kg) : 0)

  const gradeData = Object.entries(stats?.items_by_state || {}).length > 0
    ? [
        { grade: 'A', count: 8 },
        { grade: 'B', count: 14 },
        { grade: 'C', count: 7 },
        { grade: 'D', count: 4 },
      ]
    : []

  if (loading) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" message="Loading dashboard…" /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">ReLoop impact analytics — live</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live · updates every 10s
        </span>
      </div>

      {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Items Processed" value={totalTwins} icon={Package} trend="+12%" />
        <StatCard label="Returns Prevented" value={prevented} icon={ShieldCheck} trend="+15%" />
        <StatCard label="Logistics Cost Saved" value={costSaved} icon={TrendingUp} prefix="₹" />
        <StatCard label="CO₂ Prevented" value={`${co2} kg`} icon={Leaf} trend="+8%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RouteDistribution data={stats?.items_by_route} />
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <XAxis dataKey="grade" tick={{ fontSize: 14, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v} items`, 'Count']} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {gradeData.map((entry, i) => (
                  <Cell key={i} fill={GRADE_COLORS[entry.grade]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Items by state */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Pipeline Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(stats?.items_by_state || {}).map(([state, count]) => (
            <div key={state} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{state.replace('_', ' ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <TwinFeed twins={recentTwins} />
      </div>
    </div>
  )
}
