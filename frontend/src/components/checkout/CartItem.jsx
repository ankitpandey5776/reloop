import { Package, X, Plus, Minus } from 'lucide-react'

export default function CartItem({ item, onRemove, onQtyChange, flagged }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border bg-white transition-all ${flagged ? 'border-l-4 border-l-amber-400 border-r border-t border-b border-gray-100' : 'border-gray-100'}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Package size={24} className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{item.variant && `Size: ${item.variant}`} {item.category}</p>
        <p className="text-emerald-600 font-semibold mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
        <button onClick={() => onQtyChange(item.id, item.qty + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <button onClick={() => onRemove(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}
