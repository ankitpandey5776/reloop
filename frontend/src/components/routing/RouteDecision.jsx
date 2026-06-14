import Badge from '../common/Badge.jsx'
import { decisionVariant, decisionLabel } from '../common/Badge.jsx'
import SavingsDisplay from './SavingsDisplay.jsx'
import { MapPin, User, Building2, Heart, Recycle, Wrench, ArrowRight } from 'lucide-react'

/* Pincode → city name lookup (covers major Indian cities from seed data) */
const PINCODE_CITY = {
  '700': 'Kolkata', '400': 'Mumbai', '560': 'Bangalore',
  '110': 'Delhi',   '600': 'Chennai','500': 'Hyderabad',
  '380': 'Ahmedabad','411': 'Pune',
}

function cityFromPin(pin = '') {
  if (!pin) return null
  const prefix3 = pin.slice(0, 3)
  const prefix2 = pin.slice(0, 2) + '0'
  return PINCODE_CITY[prefix3] || PINCODE_CITY[prefix2] || null
}

/* Decision → human explanation of what actually happens next */
const DECISION_COPY = {
  RESELL_P2P: {
    icon: User,
    title: 'Direct sale to a local buyer',
    what: 'Your item will be listed on ReLoop marketplace and matched with a nearby buyer. No warehouse. The buyer collects locally or ships short-distance.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
  },
  RESELL_RENEWED: {
    icon: Building2,
    title: 'Amazon Renewed programme',
    what: 'Item is inspected and certified at an Amazon Renewed fulfilment centre, then listed as a guaranteed refurbished product.',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    border: 'border-sky-200 dark:border-sky-500/20',
  },
  REFURBISH: {
    icon: Wrench,
    title: 'Sent to a repair partner',
    what: 'A certified technician near you will restore the item to working condition. Typically takes 2–3 days, then it enters the marketplace.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/20',
  },
  DONATE: {
    icon: Heart,
    title: 'Donated to a local NGO',
    what: 'Your item goes directly to a local partner NGO. Zero shipping cost, zero warehouse, and maximum green credits for you.',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    border: 'border-teal-200 dark:border-teal-500/20',
  },
  RECYCLE: {
    icon: Recycle,
    title: 'Responsible recycling',
    what: 'The item has reached end-of-life. A certified recycler near you will recover raw materials — keeping it out of landfill.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/20',
  },
}

export default function RouteDecision({ routing, credits }) {
  if (!routing) return null

  const decision  = routing.decision
  const copy      = DECISION_COPY[decision] || DECISION_COPY.RECYCLE
  const Icon      = copy.icon
  const dest      = routing.destination || {}
  const city      = cityFromPin(dest.pincode)
  const isP2P     = decision === 'RESELL_P2P'
  const isDonate  = decision === 'DONATE'

  /* Build a meaningful destination label */
  let destLabel = dest.name || 'Destination'
  if (city && isP2P)    destLabel = `Local buyer in ${city}`
  else if (city && isDonate) destLabel = `${dest.name} · ${city}`
  else if (city)        destLabel = `${dest.name} · ${city}`

  return (
    <div className="space-y-4">

      {/* Decision badge */}
      <div className="text-center">
        <span className={`inline-flex items-center px-5 py-2 rounded-full text-lg font-bold font-display ${
          { success: 'bg-emerald-100 text-emerald-800', info: 'bg-sky-100 text-sky-800',
            purple: 'bg-violet-100 text-violet-800', teal: 'bg-teal-100 text-teal-800',
            cyan: 'bg-cyan-100 text-cyan-800' }[decisionVariant(decision)]
        }`}>
          {decisionLabel(decision)}
        </span>
      </div>

      {/* What this decision means — plain English */}
      <div className={`rounded-xl p-4 border ${copy.bg} ${copy.border}`}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 shrink-0 ${copy.color}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${copy.color} mb-1`}>{copy.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{copy.what}</p>
          </div>
        </div>
      </div>

      {/* AI reasoning quote */}
      {routing.reasoning && (
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border-l-4 border-violet-400">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 font-medium">AI Reasoning</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{routing.reasoning}"</p>
        </div>
      )}

      {/* Savings */}
      <SavingsDisplay savings={routing.savings} />

      {/* Destination — meaningful, with city */}
      {dest.pincode && (
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{destLabel}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Pincode {dest.pincode}</p>
            </div>
          </div>
          {isP2P && routing.savings?.km_avoided && (
            <div className="text-right">
              <p className="text-sm font-bold text-violet-600 dark:text-violet-400">{routing.savings.km_avoided} km</p>
              <p className="text-xs text-gray-400">shipping saved</p>
            </div>
          )}
        </div>
      )}

      {/* Green credits */}
      {credits?.earned > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-500/20">
          <p className="text-emerald-700 dark:text-emerald-300 font-semibold">+{credits.earned} Green Credits earned 🌿</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lifetime total: {credits.lifetime_credits} credits</p>
        </div>
      )}
    </div>
  )
}
