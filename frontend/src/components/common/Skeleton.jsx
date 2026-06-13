export default function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-lg ${className}`} />
}

/** Skeleton placeholder shaped like a marketplace listing card. */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  )
}
