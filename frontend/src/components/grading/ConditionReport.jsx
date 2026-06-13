import { CheckCircle } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import { useTypewriter } from '../../hooks/useAnimations.js'

const severityVariant = { minor: 'warning', moderate: 'danger', major: 'danger' }
const defectIcon = { scratch: '🔍', dent: '💢', stain: '🟤', missing_part: '❓', discoloration: '🎨', packaging_damage: '📦' }

function ReportQuote({ text, typed }) {
  const [displayed, done] = useTypewriter(typed ? text : '', 18)
  const content = typed ? displayed : text
  return (
    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border-l-4 border-emerald-400">
      <p className={`text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed ${typed && !done ? 'cursor-blink' : ''}`}>"{content}"</p>
    </div>
  )
}

export default function ConditionReport({ grading, typed = false }) {
  if (!grading) return null
  const { condition_report, defects } = grading

  return (
    <div className="space-y-4">
      <ReportQuote text={condition_report} typed={typed} />
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Defects Found</p>
        {defects && defects.length > 0 ? (
          <div className="space-y-2">
            {defects.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                <span className="text-lg">{defectIcon[d.type] || '⚠️'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{d.type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{d.location}</p>
                </div>
                <Badge text={d.severity} variant={severityVariant[d.severity] || 'warning'} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3">
            <CheckCircle size={16} />
            <p className="text-sm font-medium">No defects detected</p>
          </div>
        )}
      </div>
    </div>
  )
}
