import Badge from '../common/Badge.jsx'
import { stateVariant, decisionVariant, decisionLabel } from '../common/Badge.jsx'

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-IN')
}

export default function TwinFeed({ twins }) {
  if (!twins?.length) return <p className="text-sm text-gray-500 py-4 text-center">No recent activity.</p>

  return (
    <div className="divide-y divide-gray-50">
      {twins.map(t => (
        <div key={t.twin_id} className="flex items-center gap-3 py-3 animate-in fade-in duration-300">
          <span className="text-xs text-gray-400 w-20 shrink-0">{timeAgo(t.updated_at)}</span>
          <p className="text-sm text-gray-800 font-medium truncate flex-1">{t.item.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge text={t.state} variant={stateVariant(t.state)} />
            {t.grading?.grade && <Badge text={`Grade ${t.grading.grade}`} variant={{ A: 'success', B: 'info', C: 'warning', D: 'danger' }[t.grading.grade]} />}
            {t.routing?.decision && <Badge text={decisionLabel(t.routing.decision)} variant={decisionVariant(t.routing.decision)} />}
          </div>
          {t.routing?.savings?.cost_saved && (
            <span className="text-xs text-emerald-600 font-medium shrink-0">₹{t.routing.savings.cost_saved.toLocaleString('en-IN')} saved</span>
          )}
        </div>
      ))}
    </div>
  )
}
