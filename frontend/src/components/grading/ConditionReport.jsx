import { CheckCircle, AlertTriangle } from 'lucide-react'
import Badge from '../common/Badge.jsx'

const severityVariant = { minor: 'warning', moderate: 'danger', major: 'danger' }
const defectIcon = { scratch: '🔍', dent: '💢', stain: '🟤', missing_part: '❓', discoloration: '🎨', packaging_damage: '📦' }

export default function ConditionReport({ grading }) {
  if (!grading) return null
  const { condition_report, defects } = grading

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-emerald-400">
        <p className="text-sm text-gray-700 italic leading-relaxed">"{condition_report}"</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Defects Found</p>
        {defects && defects.length > 0 ? (
          <div className="space-y-2">
            {defects.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <span className="text-lg">{defectIcon[d.type] || '⚠️'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">{d.type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">{d.location}</p>
                </div>
                <Badge text={d.severity} variant={severityVariant[d.severity] || 'warning'} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg p-3">
            <CheckCircle size={16} />
            <p className="text-sm font-medium">No defects detected</p>
          </div>
        )}
      </div>
    </div>
  )
}
