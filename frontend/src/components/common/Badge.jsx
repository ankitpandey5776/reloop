const variants = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-sky-100 text-sky-800',
  purple: 'bg-violet-100 text-violet-800',
  teal: 'bg-teal-100 text-teal-800',
  cyan: 'bg-cyan-100 text-cyan-800',
  gray: 'bg-gray-100 text-gray-700',
}

export default function Badge({ text, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {text}
    </span>
  )
}

export function gradeVariant(grade) {
  return { A: 'success', B: 'info', C: 'warning', D: 'danger' }[grade] || 'gray'
}

export function stateVariant(state) {
  const map = {
    ACTIVE: 'gray', RETURN_INTENT: 'warning', GRADED: 'info',
    ROUTED: 'purple', LISTED: 'success', SOLD: 'success',
    DONATED: 'teal', RECYCLED: 'cyan'
  }
  return map[state] || 'gray'
}

export function decisionVariant(decision) {
  const map = {
    RESELL_P2P: 'success', RESELL_RENEWED: 'info',
    REFURBISH: 'purple', DONATE: 'teal', RECYCLE: 'cyan'
  }
  return map[decision] || 'gray'
}

export function decisionLabel(decision) {
  const map = {
    RESELL_P2P: 'Resell P2P', RESELL_RENEWED: 'Resell Renewed',
    REFURBISH: 'Refurbish', DONATE: 'Donate', RECYCLE: 'Recycle'
  }
  return map[decision] || decision
}
