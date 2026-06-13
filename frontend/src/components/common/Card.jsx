export default function Card({ children, className = '', header, hoverable = false }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${hoverable ? 'card-hover cursor-pointer' : ''} ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{header}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
