const variants = {
  // Light pills (grades, generic)
  success: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500/20',
  warning: 'bg-amber-100 text-amber-800 ring-1 ring-amber-500/20',
  danger: 'bg-rose-100 text-rose-800 ring-1 ring-rose-500/20',
  info: 'bg-sky-100 text-sky-800 ring-1 ring-sky-500/20',
  purple: 'bg-violet-100 text-violet-800 ring-1 ring-violet-500/20',
  teal: 'bg-teal-100 text-teal-800 ring-1 ring-teal-500/20',
  cyan: 'bg-cyan-100 text-cyan-800 ring-1 ring-cyan-500/20',
  lime: 'bg-lime-100 text-lime-800 ring-1 ring-lime-500/20',
  gray: 'bg-gray-100 text-gray-700 ring-1 ring-gray-500/10',
  // Dark premium state pills
  'state-active': 'bg-gray-800 text-gray-200',
  'state-intent': 'bg-amber-900/80 text-amber-200',
  'state-graded': 'bg-sky-900/80 text-sky-200',
  'state-routed': 'bg-violet-900/80 text-violet-200',
  'state-listed': 'bg-emerald-900/80 text-emerald-200',
  'state-sold': 'bg-emerald-600 text-white',
  'state-donated': 'bg-teal-900/80 text-teal-200',
  'state-recycled': 'bg-cyan-900/80 text-cyan-200',
}

export default function Badge({ text, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variants[variant] || variants.gray} ${className}`}>
      {text}
    </span>
  )
}

export function gradeVariant(grade) {
  return { A: 'success', B: 'info', C: 'warning', D: 'danger' }[grade] || 'gray'
}

export function stateVariant(state) {
  const map = {
    ACTIVE: 'state-active', RETURN_INTENT: 'state-intent', GRADED: 'state-graded',
    ROUTED: 'state-routed', LISTED: 'state-listed', SOLD: 'state-sold',
    DONATED: 'state-donated', RECYCLED: 'state-recycled',
  }
  return map[state] || 'state-active'
}

export function decisionVariant(decision) {
  const map = {
    RESELL_P2P: 'success', RESELL_RENEWED: 'info',
    REFURBISH: 'purple', DONATE: 'teal', RECYCLE: 'cyan',
  }
  return map[decision] || 'gray'
}

export function decisionLabel(decision) {
  const map = {
    RESELL_P2P: 'Resell P2P', RESELL_RENEWED: 'Resell Renewed',
    REFURBISH: 'Refurbish', DONATE: 'Donate', RECYCLE: 'Recycle',
  }
  return map[decision] || decision
}
