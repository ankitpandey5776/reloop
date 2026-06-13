import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import Button from '../common/Button.jsx'

export default function RiskNudge({ riskData, onAccept, onDismiss, accepted }) {
  if (!riskData || riskData.risk_score < 0.6) return null

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border-2 mb-4 animate-slideDown ${accepted ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
      {!accepted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 animate-pulse" />
      )}
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg ${accepted ? 'bg-emerald-100' : 'bg-amber-100'}`}>
          {accepted
            ? <CheckCircle size={18} className="text-emerald-600" />
            : <AlertTriangle size={18} className="text-amber-600" />
          }
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold mb-1 ${accepted ? 'text-emerald-800' : 'text-amber-800'}`}>
            {accepted ? 'Great choice! Return prevented.' : 'Smart Shopping Tip'}
          </p>
          <p className={`text-sm ${accepted ? 'text-emerald-700' : 'text-amber-700'}`}>
            {accepted
              ? 'You earned 20 green credits for choosing the right size.'
              : riskData.nudge_message}
          </p>
          {!accepted && (
            <>
              <div className="mt-2 mb-3">
                <div className="flex justify-between text-xs text-amber-700 mb-1">
                  <span>Return risk</span>
                  <span>{Math.round(riskData.risk_score * 100)}%</span>
                </div>
                <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${riskData.risk_score * 100}%` }} />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={onAccept}>Switch to Recommended Size</Button>
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  <X size={14} /> Keep My Selection
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
