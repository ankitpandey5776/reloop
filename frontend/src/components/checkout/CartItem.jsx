import { Package, X, Plus, Minus } from 'lucide-react'

/* Real Amazon product images for demo cart items */
const ITEM_IMAGES = {
  'SKU-ALLEN-SHIRT': 'https://m.media-amazon.com/images/I/81ib3x3M1QL._UY400_.jpg',
  'SKU-KINDLE-PW':   'https://m.media-amazon.com/images/I/61bCiVJbCsL._SY355_.jpg',
  'SKU-NIKE-REV6':   'https://m.media-amazon.com/images/I/71K96V+b5uL._UY400_.jpg',
  'SKU-BOAT-141':    'https://m.media-amazon.com/images/I/61mZDYMHkNL._SY355_.jpg',
  'SKU-SAM-M34':     'https://m.media-amazon.com/images/I/71NybWDVrBL._SY355_.jpg',
}

export default function CartItem({ item, onRemove, onQtyChange, flagged }) {
  const imgSrc = item.image_url || ITEM_IMAGES[item.sku]

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border bg-white dark:bg-gray-900 transition-all ${flagged ? 'border-l-4 border-l-amber-400 border-r border-t border-b border-gray-100 dark:border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}>
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
        {imgSrc ? (
          <img src={imgSrc} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={24} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{item.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{item.variant && `Size: ${item.variant} · `}{item.category}</p>
        <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))} className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-medium text-gray-700 dark:text-gray-200">{item.qty}</span>
        <button onClick={() => onQtyChange(item.id, item.qty + 1)} className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <button onClick={() => onRemove(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}
