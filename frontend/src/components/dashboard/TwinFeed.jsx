import Badge from '../common/Badge.jsx'
import { stateVariant, decisionVariant, decisionLabel } from '../common/Badge.jsx'

const BORDER = {
  ACTIVE: 'border-gray-300', RETURN_INTENT: 'border-amber-400', GRADED: 'border-sky-400',
  ROUTED: 'border-violet-400', LISTED: 'border-emerald-400', SOLD: 'border-emerald-500',
  DONATED: 'border-teal-400', RECYCLED: 'border-cyan-400',
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-IN')
}

export default function TwinFeed({ twins }) {
  if (!twins?.length) return <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">No recent activity.</p>

  return (
    <div className="space-y-2">
      {twins.map(t => (
        <div key={t.twin_id} className={`flex items-center gap-3 p-3 rounded-xl border-l-4 bg-gray-50/60 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors animate-fadeIn ${BORDER[t.state] || 'border-gray-300'}`}>
          <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-16 shrink-0">{timeAgo(t.updated_at)}</span>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate flex-1">{t.item.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge text={t.state.replace('_', ' ')} variant={stateVariant(t.state)} />
            {t.grading?.grade && <Badge text={`Grade ${t.grading.grade}`} variant={{ A: 'success', B: 'info', C: 'warning', D: 'danger' }[t.grading.grade]} />}
            {t.routing?.decision && <Badge text={decisionLabel(t.routing.decision)} variant={decisionVariant(t.routing.decision)} />}
          </div>
          {t.routing?.savings?.cost_saved && (
            <span className="font-mono text-xs text-emerald-600 font-semibold shrink-0">₹{t.routing.savings.cost_saved.toLocaleString('en-IN')}</span>
          )}
        </div>
      ))}
    </div>
  )
}
