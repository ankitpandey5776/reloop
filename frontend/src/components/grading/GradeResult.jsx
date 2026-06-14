import { ShieldCheck } from 'lucide-react'
import GradeIndicator from '../common/GradeIndicator.jsx'
import ConditionReport from './ConditionReport.jsx'

export default function GradeResult({ grading, valuation, originalPrice }) {
  if (!grading) return null

  const conditionHash = grading.condition_hash

  return (
    <div className="relative space-y-6">
      {/* Frame 1: white flash as the AI "wakes up" */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-white rounded-2xl animate-flash" />

      {/* Frame 2: grade scales in with a bounce + glow */}
      <div className="flex flex-col items-center py-6">
        <div className="animate-gradeReveal">
          <GradeIndicator grade={grading.grade} confidence={grading.confidence} size="lg" />
        </div>

        {/* SHA-256 trust badge — shown right under the grade */}
        {conditionHash && (
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-xs text-sky-700 dark:text-sky-300">
            <ShieldCheck size={12} />
            <span className="font-mono tracking-tight">SHA-256: {conditionHash.slice(0, 12)}…</span>
            <span className="text-sky-500 dark:text-sky-400">Tamper-proof</span>
          </div>
        )}
      </div>

      {/* Frame 3: condition report types in letter by letter */}
      <div className="animate-fadeInUp" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
        <ConditionReport grading={grading} typed />
      </div>

      {/* Frame 4: price slides in from the right */}
      {valuation && (
        <div
          className="bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-500/10 dark:to-lime-500/10 rounded-2xl p-5 text-center border border-emerald-100 dark:border-emerald-500/20 animate-fadeInUp"
          style={{ animationDelay: '1.4s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your item is worth</p>
          <p className="font-display text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 tracking-tight tabular-nums">
            ₹{valuation.resale_price?.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(valuation.price_multiplier * 100)}% of original{' '}
            <span className="line-through">₹{originalPrice?.toLocaleString('en-IN')}</span>
          </p>
        </div>
      )}
    </div>
  )
}
