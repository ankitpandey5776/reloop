import GradeIndicator from '../common/GradeIndicator.jsx'
import ConditionReport from './ConditionReport.jsx'

export default function GradeResult({ grading, valuation, originalPrice }) {
  if (!grading) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-6">
        <GradeIndicator grade={grading.grade} confidence={grading.confidence} size="lg" />
      </div>

      <ConditionReport grading={grading} />

      {valuation && (
        <div className="bg-emerald-50 rounded-xl p-5 text-center border border-emerald-100">
          <p className="text-sm text-gray-600 mb-1">Your item is worth</p>
          <p className="text-3xl font-bold text-emerald-600 mb-1">₹{valuation.resale_price?.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500">
            {Math.round(valuation.price_multiplier * 100)}% of original{' '}
            <span className="line-through">₹{originalPrice?.toLocaleString('en-IN')}</span>
          </p>
        </div>
      )}
    </div>
  )
}
