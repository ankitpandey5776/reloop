import { ShieldCheck, AlertTriangle } from 'lucide-react'
import GradeIndicator from '../common/GradeIndicator.jsx'
import ConditionReport from './ConditionReport.jsx'

export default function GradeResult({ grading, valuation, originalPrice }) {
  if (!grading) return null

  const isFraud    = grading.grade === 'F'
  const isRejected = isFraud || grading.is_authentic === false
  const conditionHash = grading.condition_hash

  return (
    <div className="relative space-y-6">
      {/* Flash effect */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-white rounded-2xl animate-flash" />

      {/* Grade display */}
      <div className="flex flex-col items-center py-6">
        <div className="animate-gradeReveal">
          <GradeIndicator grade={grading.grade} confidence={grading.confidence} size="lg" />
        </div>

        {/* Tamper-proof badge — plain English, not cryptic hex */}
        {conditionHash && !isRejected && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              AI-verified condition report — digitally sealed and tamper-proof
            </span>
          </div>
        )}

        {/* Fraud / rejection banner */}
        {isRejected && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 w-full max-w-sm">
            <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Return request declined</p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                {grading.fraud_reason || 'The item in the photo does not match the original purchase.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Condition report */}
      {!isRejected && (
        <div className="animate-fadeInUp" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          <ConditionReport grading={grading} typed />
        </div>
      )}

      {/* Value card — only for valid items */}
      {valuation && !isRejected && valuation.resale_price > 0 && (
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
