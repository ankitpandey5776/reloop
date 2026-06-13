const gradeColors = {
  A: { bg: 'bg-emerald-500', text: 'text-emerald-500', ring: 'ring-emerald-200', label: 'Like New' },
  B: { bg: 'bg-sky-500', text: 'text-sky-500', ring: 'ring-sky-200', label: 'Good' },
  C: { bg: 'bg-amber-500', text: 'text-amber-500', ring: 'ring-amber-200', label: 'Fair' },
  D: { bg: 'bg-red-500', text: 'text-red-500', ring: 'ring-red-200', label: 'Salvage' },
}

export default function GradeIndicator({ grade, confidence, size = 'sm' }) {
  const c = gradeColors[grade] || gradeColors.D
  const isLg = size === 'lg'

  return (
    <div className={`flex flex-col items-center gap-2 ${isLg ? 'gap-3' : ''}`}>
      <div className={`flex items-center justify-center rounded-full font-bold ring-4 ${c.ring} ${isLg ? 'w-20 h-20 text-4xl' : 'w-10 h-10 text-xl'} ${c.bg} text-white`}>
        {grade}
      </div>
      {isLg && <p className={`text-lg font-semibold ${c.text}`}>{c.label}</p>}
      {confidence != null && (
        <div className={`${isLg ? 'w-24' : 'w-12'}`}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">{isLg ? 'Confidence' : ''}</span>
            <span className={`text-xs font-medium ${c.text}`}>{Math.round(confidence * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${confidence * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}
