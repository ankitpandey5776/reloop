const gradeColors = {
  A: { bg: 'bg-emerald-500', text: 'text-emerald-600', glow: 'shadow-emerald-500/40', ring: 'ring-emerald-500/20', bar: 'bg-emerald-500', label: 'Like New',    desc: 'No defects — ready for immediate resale' },
  B: { bg: 'bg-sky-500',     text: 'text-sky-600',     glow: 'shadow-sky-500/40',     ring: 'ring-sky-500/20',     bar: 'bg-sky-500',     label: 'Good',         desc: 'Minor cosmetic wear — fully functional' },
  C: { bg: 'bg-amber-500',   text: 'text-amber-600',   glow: 'shadow-amber-500/40',   ring: 'ring-amber-500/20',   bar: 'bg-amber-500',   label: 'Fair',          desc: 'Visible wear — works but may need light refurb' },
  D: { bg: 'bg-rose-500',    text: 'text-rose-600',    glow: 'shadow-rose-500/40',    ring: 'ring-rose-500/20',    bar: 'bg-rose-500',    label: 'Salvage',       desc: 'Significant damage — parts or recycling only' },
  F: { bg: 'bg-rose-600',    text: 'text-rose-700',    glow: 'shadow-rose-600/40',    ring: 'ring-rose-600/20',    bar: 'bg-rose-600',    label: 'Rejected',      desc: 'Item did not match — return request declined' },
}

export default function GradeIndicator({ grade, confidence, size = 'sm' }) {
  const c = gradeColors[grade] || gradeColors.D
  const isLg = size === 'lg'

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative flex items-center justify-center rounded-2xl font-display font-bold text-white shadow-lg ${c.glow} ${c.bg} ${isLg ? 'w-24 h-24 text-5xl' : 'w-11 h-11 text-2xl rounded-xl'}`}
      >
        {grade}
        <span className={`absolute inset-0 rounded-2xl ring-4 ${c.ring} ${isLg ? '' : 'rounded-xl'}`} />
      </div>
      {isLg && (
        <div className="text-center">
          <p className={`text-lg font-semibold ${c.text}`}>{c.label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-[180px]">{c.desc}</p>
        </div>
      )}
      {confidence != null && (
        <div className={isLg ? 'w-36' : 'w-12'}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">{isLg ? 'AI Confidence' : ''}</span>
            <span className={`text-xs font-semibold font-mono ${c.text}`}>{Math.round(confidence * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${confidence * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}
