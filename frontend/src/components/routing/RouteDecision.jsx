import Badge from '../common/Badge.jsx'
import { decisionVariant, decisionLabel } from '../common/Badge.jsx'
import SavingsDisplay from './SavingsDisplay.jsx'
import { MapPin } from 'lucide-react'

export default function RouteDecision({ routing, credits }) {
  if (!routing) return null
  return (
    <div className="space-y-5">
      <div className="text-center">
        <span className={`inline-flex items-center px-5 py-2 rounded-full text-lg font-bold font-display ${
          { success: 'bg-emerald-100 text-emerald-800', info: 'bg-sky-100 text-sky-800', purple: 'bg-violet-100 text-violet-800', teal: 'bg-teal-100 text-teal-800', cyan: 'bg-cyan-100 text-cyan-800' }[decisionVariant(routing.decision)]
        }`}>
          {decisionLabel(routing.decision)}
        </span>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border-l-4 border-violet-400">
        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{routing.reasoning}"</p>
      </div>
      <SavingsDisplay savings={routing.savings} />
      {routing.destination && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
          <MapPin size={16} className="text-emerald-500" />
          <span><span className="font-medium">{routing.destination.name}</span> · {routing.destination.pincode}</span>
        </div>
      )}
      {credits?.earned > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-500/20">
          <p className="text-emerald-700 dark:text-emerald-300 font-semibold">+{credits.earned} Green Credits earned 🌿</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total lifetime: {credits.lifetime_credits} credits</p>
        </div>
      )}
    </div>
  )
}
