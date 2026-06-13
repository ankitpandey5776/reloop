const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

export default function LoadingSpinner({ size = 'md', message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin`} />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  )
}
