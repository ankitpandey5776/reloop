import { MapPin, Leaf, TrendingUp, CheckCircle, ArrowRight, Heart, Recycle, Wrench, Building2, Clock, Navigation } from 'lucide-react'

const PINCODE_CITY = {
  '700': 'Kolkata', '400': 'Mumbai', '560': 'Bangalore',
  '110': 'Delhi', '600': 'Chennai', '500': 'Hyderabad',
  '380': 'Ahmedabad', '411': 'Pune',
}
function cityFromPin(pin = '') {
  return PINCODE_CITY[pin?.slice(0, 3)] || PINCODE_CITY[pin?.slice(0, 2) + '0'] || 'your city'
}

/* ── Non-P2P decisions — compact card ────────────────────────────── */
const OTHER_DECISIONS = {
  RESELL_RENEWED: {
    icon: Building2, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-500/10',
    title: 'Amazon Renewed Programme',
    desc: 'Professionally certified at an Amazon FC, then listed as a verified refurbished product nationally.',
    badge: 'bg-sky-100 text-sky-800',
  },
  REFURBISH: {
    icon: Wrench, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-500/10',
    title: 'Certified Refurbishment Partner',
    desc: 'A nearby certified technician will restore cosmetic wear in 2–3 days. Once refurbished, your item qualifies for Amazon Renewed — unlocking a higher resale price than a direct P2P sale.',
    badge: 'bg-violet-100 text-violet-800',
  },
  DONATE: {
    icon: Heart, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-500/10',
    title: 'Donated to Local NGO',
    desc: 'Goes directly to GreenHands Foundation nearby — zero shipping, maximum social impact.',
    badge: 'bg-teal-100 text-teal-800',
  },
  RECYCLE: {
    icon: Recycle, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    title: 'Responsible Recycling',
    desc: 'EcoRecycle India recovers raw materials responsibly, preventing e-waste from reaching landfill.',
    badge: 'bg-cyan-100 text-cyan-800',
  },
}

/* ── Avatar initials circle ───────────────────────────────────────── */
function Avatar({ initials, size = 'lg' }) {
  const s = size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm'
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg`}>
      {initials}
    </div>
  )
}

export default function RouteDecision({ routing, credits }) {
  if (!routing) return null

  const { decision, destination = {}, savings = {}, buyer, reasoning } = routing
  const city = destination.city || cityFromPin(destination.pincode)
  const isP2P = decision === 'RESELL_P2P'

  /* ── P2P — the hero card ──────────────────────────────────────── */
  if (isP2P) {
    const buyerName    = buyer?.name || destination.name || 'Local Buyer'
    const buyerInitials = buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const distance     = buyer?.distance || `${Math.round((savings.km_avoided || 30) * 0.6)} km`
    const searched     = buyer?.searched || '2 days ago'
    const earnAmount   = Math.round((savings.cost_saved || 270) + 30)

    return (
      <div className="space-y-4">

        {/* Hero: Buyer Match */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-900/80 to-teal-900/80 p-5 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          {/* Background pulse */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Buyer Matched
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {distance} away
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Avatar initials={buyerInitials} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-white text-lg leading-tight">{buyerName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin size={11} className="text-emerald-400 shrink-0" />
                  <p className="text-emerald-300 text-xs">{city} · Pincode {destination.pincode}</p>
                </div>
                <p className="text-emerald-400/70 text-xs mt-1">Searched for this item {searched}</p>
              </div>
            </div>

            {/* Journey line */}
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300/60">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-medium text-emerald-200">You (Kolkata 700001)</span>
              </div>
              <div className="flex-1 flex items-center gap-1">
                <div className="flex-1 h-px border-t border-dashed border-emerald-500/40" />
                <Navigation size={10} className="text-emerald-400" />
                <div className="flex-1 h-px border-t border-dashed border-emerald-500/40" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                <span className="font-medium text-emerald-200">{buyerName} ({city} {destination.pincode})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact row — 3 clean stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 text-center">
            <p className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">₹{earnAmount}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">You Earn</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 text-center">
            <p className="font-display text-xl font-bold text-sky-600 dark:text-sky-400 tabular-nums">{savings.co2_saved_kg} kg</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">CO₂ Saved</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 text-center">
            <p className="font-display text-xl font-bold text-violet-600 dark:text-violet-400 tabular-nums">0</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Warehouses</p>
          </div>
        </div>

        {/* What happens next */}
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-50 dark:divide-gray-800">
          {[
            { icon: CheckCircle, text: 'Item listed with AI-verified condition report', color: 'text-emerald-500' },
            { icon: Clock,       text: `${buyerName} is notified immediately`,          color: 'text-sky-500' },
            { icon: MapPin,      text: `Direct handoff — no warehouse, no truck`,       color: 'text-violet-500' },
          ].map(({ icon: Icon, text, color }, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Icon size={14} className={`${color} shrink-0`} />
              <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
            </div>
          ))}
        </div>

        {/* Green credits */}
        {credits?.earned > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <Leaf size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">+{credits.earned} Green Credits earned</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lifetime: {credits.lifetime_credits} credits</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  /* ── Other decisions — compact ────────────────────────────────── */
  const cfg = OTHER_DECISIONS[decision] || OTHER_DECISIONS.DONATE
  const Icon = cfg.icon
  const partnerName = destination.name || null
  const partnerCity = city && destination.pincode ? `${city} · Pincode ${destination.pincode}` : null

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-5 ${cfg.bg} border border-gray-100 dark:border-gray-800`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white dark:bg-gray-900 shrink-0">
            <Icon size={20} className={cfg.color} />
          </div>
          <div>
            <p className={`font-bold text-base ${cfg.color}`}>{cfg.title}</p>
            {partnerName && (
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={11} className={`${cfg.color} shrink-0 opacity-70`} />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{partnerName}{partnerCity ? ` · ${partnerCity}` : ''}</p>
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{reasoning || cfg.desc}</p>
          </div>
        </div>
      </div>

      {savings.cost_saved && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 text-center">
            <p className="font-display text-xl font-bold text-emerald-600 tabular-nums">₹{savings.cost_saved}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Cost Saved</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 text-center">
            <p className="font-display text-xl font-bold text-sky-600 tabular-nums">{savings.co2_saved_kg} kg</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">CO₂ Saved</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 text-center">
            <p className="font-display text-xl font-bold text-violet-600 tabular-nums">{savings.km_avoided}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">km Avoided</p>
          </div>
        </div>
      )}

      {credits?.earned > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
          <Leaf size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">+{credits.earned} Green Credits earned</p>
        </div>
      )}
    </div>
  )
}
