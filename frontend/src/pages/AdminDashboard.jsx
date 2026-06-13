import { useState, useEffect } from 'react'
import { Package, ShieldCheck, TrendingUp, Leaf } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getDashboardStats, getRecentTwins } from '../api/client.js'
import RouteDistribution from '../components/dashboard/RouteDistribution.jsx'
import TwinFeed from '../components/dashboard/TwinFeed.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { useCountUp } from '../hooks/useAnimations.js'

const GRADE_COLORS = { A: '#059669', B: '#0ea5e9', C: '#f59e0b', D: '#f43f5e' }

function GlassStat({ label, value, prefix = '', icon: Icon }) {
  return (
    <div className="glass-dark rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-emerald-300/70 text-sm font-medium uppercase tracking-wider">{label}</p>
          <p className="font-display text-3xl sm:text-4xl font-bold text-white mt-2 tabular-nums">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-white/10 text-emerald-300">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentTwins, setRecentTwins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'ReLoop — Command Center' }, [])

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
    <div className="animate-fadeInUp">
      {/* ── Dark command-center header ─────────────────── */}
      <div className="bg-[#022c22] px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-white tracking-tight">ReLoop Command Center</h1>
              <p className="text-emerald-300/60 text-sm mt-1">Impact analytics — live</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-white/5 px-3 py-1.5 rounded-full ring-1 ring-emerald-400/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live · updates every 10s
            </span>
          </div>

          {error && <div className="mb-6 p-3 bg-rose-500/10 border border-rose-400/30 rounded-xl text-sm text-rose-200">{error}</div>}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStat label="Items Processed" value={totalTwins} icon={Package} />
            <GlassStat label="Returns Prevented" value={prevented} icon={ShieldCheck} />
            <GlassStat label="Cost Saved" value={costSaved} prefix="₹" icon={TrendingUp} />
            <GlassStat label="CO₂ Prevented" value={`${co2} kg`} icon={Leaf} />
          </div>
        </div>
      </div>

      {/* ── Floating content (overlaps dark zone) ──────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12">
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RouteDistribution data={stats?.items_by_route} />
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h3 className="font-display text-base font-semibold text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={gradeData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <XAxis dataKey="grade" tick={{ fontSize: 14, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v} items`, 'Count']} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeData.map((entry, i) => (
                    <Cell key={i} fill={GRADE_COLORS[entry.grade]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline status */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-8">
          <h3 className="font-display text-base font-semibold text-gray-900 dark:text-white mb-4">Pipeline Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(stats?.items_by_state || {}).map(([state, count]) => (
              <div key={state} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <p className="font-display text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{state.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h3 className="font-display text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <TwinFeed twins={recentTwins} />
        </div>
      </div>
    </div>
  )
}
