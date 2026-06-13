export default function Card({ children, className = '', header, hoverable = false }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 ${hoverable ? 'card-hover cursor-pointer' : ''} ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{header}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
