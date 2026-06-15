import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart, CheckCircle, ArrowRight, AlertTriangle,
  Ruler, Star, TrendingDown, Tag, RefreshCw, X,
  ChevronDown, ChevronUp, Info, Leaf, MapPin
} from 'lucide-react'
import { checkRisk, createTwin, recordPrevention } from '../api/client.js'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'

/* ─── Product images — local files in /public/ + Unsplash fallbacks ─ */
/* Save images to frontend/public/ to use local ones.
   Unsplash CDN serves with proper CORS headers as fallback. */
const ITEM_IMAGES = {
  'SKU-ALLEN-SHIRT': '/allen-solly.jpg',
  'SKU-KINDLE-PW':   'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80&fit=crop',
  'SKU-NIKE-REV6':   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80&fit=crop',
  'SKU-BOAT-141':    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80&fit=crop',
  'SKU-SAM-M34':     '/samsung_s23.png',
  'ELEC-SAM-S23':    '/samsung_s23.png',
  'ELEC-BOAT-141':   'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80&fit=crop',
  'ELEC-KIND-PW':    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80&fit=crop',
  'FASH-ALNS-SHT':   '/allen-solly.jpg',
  'FASH-NIKE-REV':   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80&fit=crop',
  'FASH-LEV-JNS':    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&q=80&fit=crop',
  'HOME-PRES-IND':   'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80&fit=crop',
  'BOOK-ATMT':       'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80&fit=crop',
  'BOOK-SAPIENS':    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&q=80&fit=crop',
}

const CAT_COLORS = {
  fashion:     { bg: 'bg-rose-100 dark:bg-rose-500/15',     text: 'text-rose-500' },
  electronics: { bg: 'bg-sky-100 dark:bg-sky-500/15',       text: 'text-sky-500' },
  home:        { bg: 'bg-amber-100 dark:bg-amber-500/15',    text: 'text-amber-500' },
  books:       { bg: 'bg-violet-100 dark:bg-violet-500/15',  text: 'text-violet-500' },
  other:       { bg: 'bg-emerald-100 dark:bg-emerald-500/15',text: 'text-emerald-500' },
}

/* SVG product silhouettes — visible, clean, realistic */
function ProductSVG({ category, size = 36 }) {
  const color = CAT_COLORS[category]?.text || 'text-gray-400'
  if (category === 'fashion') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={color}>
      <path d="M15 9 L9 13 L13 21 L17 19 V39 H31 V19 L35 21 L39 13 L33 9 L27 12 Q24 15 21 12 Z" />
    </svg>
  )
  if (category === 'electronics') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={color}>
      <rect x="14" y="6" width="20" height="36" rx="3" />
      <rect x="17" y="10" width="14" height="22" rx="1" fill="currentColor" opacity="0.15" />
      <circle cx="24" cy="37" r="1.5" />
      <line x1="21" y1="8" x2="27" y2="8" strokeWidth="2.5" />
    </svg>
  )
  if (category === 'books') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={color}>
      <path d="M8 10 H24 Q26 10 26 12 V40 Q26 38 24 38 H8 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M40 10 H24 Q26 10 26 12 V40 Q26 38 24 38 H40 Z" fill="currentColor" fillOpacity="0.08" />
      <line x1="11" y1="17" x2="21" y2="17" /><line x1="11" y1="22" x2="21" y2="22" />
      <line x1="29" y1="17" x2="37" y2="17" /><line x1="29" y1="22" x2="37" y2="22" />
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={color}>
      <rect x="10" y="12" width="28" height="28" rx="3" fill="currentColor" fillOpacity="0.1" />
      <circle cx="24" cy="26" r="7" />
      <circle cx="24" cy="26" r="3" fill="currentColor" fillOpacity="0.3" />
      <circle cx="34" cy="16" r="1.5" fill="currentColor" />
    </svg>
  )
}

/* ─── Cart item row ───────────────────────────────────────────────── */
function CartItem({ item, onRemove, onQtyChange, flagged }) {
  const cat = item.category || 'other'
  const colors = CAT_COLORS[cat] || CAT_COLORS.other
  const imgSrc = ITEM_IMAGES[item.sku]
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border transition-all ${
      flagged
        ? 'border-l-[3px] border-l-amber-400 border-amber-100 dark:border-amber-500/20'
        : 'border-gray-100 dark:border-gray-800'
    }`}>
      {/* Product image */}
      <div className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 ${!imgSrc || imgError ? colors.bg : ''} flex items-center justify-center`}>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ProductSVG category={cat} size={30} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">{item.title}</p>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">
          {item.variant ? `Size ${item.variant} · ` : ''}{item.category}
        </p>
        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-0.5">₹{item.price?.toLocaleString('en-IN')}</p>
      </div>

      {/* Qty */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}
          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold">−</button>
        <span className="w-5 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">{item.qty}</span>
        <button onClick={() => onQtyChange(item.id, item.qty + 1)}
          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold">+</button>
      </div>

      <button onClick={() => onRemove(item.id)}
        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-colors shrink-0">
        <X size={14} />
      </button>
    </div>
  )
}

/* ─── Prevention nudge card ───────────────────────────────────────── */
function PreventionCard({ nudge, onAction, onDismiss }) {
  const [expanded, setExpanded] = useState(false)
  const { type, icon: Icon, color, bg, border, title, message, detail, actionLabel, actionResult } = nudge

  return (
    <div className={`rounded-2xl border-2 ${bg} ${border} overflow-hidden animate-slideDown mb-3`}>
      {/* Top accent line */}
      <div className={`h-1 w-full ${nudge.accentBar}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl ${nudge.iconBg} shrink-0`}>
            <Icon size={16} className={color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-sm font-bold ${color}`}>{title}</p>
              <button onClick={() => setExpanded(e => !e)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{message}</p>

            {/* Risk bar for size bracketing */}
            {type === 'size_bracketing' && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Return probability</span><span className="font-semibold text-rose-500">87%</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
            )}

            {/* Expandable detail */}
            {expanded && detail && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{detail}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => onAction(type, actionResult)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 ${nudge.btnBg}`}
              >
                {actionLabel}
              </button>
              <button
                onClick={() => onDismiss(type)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── All prevention nudge definitions ───────────────────────────── */
function buildNudges(cart) {
  const nudges = []
  const fashionItems = cart.filter(i => i.category === 'fashion')
  const skus = cart.map(i => i.sku)
  const hasBracketing = skus.length !== new Set(skus).size

  /* Nudge 1: Size bracketing — multiple sizes of same item */
  if (hasBracketing) {
    nudges.push({
      id: 'size_bracketing',
      type: 'size_bracketing',
      icon: Ruler,
      color: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100 dark:bg-rose-500/20',
      bg: 'bg-rose-50 dark:bg-rose-500/5',
      border: 'border-rose-200 dark:border-rose-500/30',
      accentBar: 'bg-gradient-to-r from-rose-400 to-orange-400',
      btnBg: 'bg-rose-500 hover:bg-rose-600',
      title: 'Size Bracketing Detected',
      message: '87% of buyers who order multiple sizes return 2 of them. This creates unnecessary waste and costs Amazon ₹800+ to process.',
      detail: 'Bracketing is when customers order multiple sizes intending to keep one and return the rest. Allen Solly shirts typically run true to size. Based on purchase history of 12,847 buyers, Size M is the most kept size for this product.',
      actionLabel: 'Keep only Size M (Best match)',
      actionResult: { keepSize: 'M' },
    })
  }

  /* Nudge 2: High return rate for this product category */
  if (fashionItems.length > 0) {
    nudges.push({
      id: 'high_return_category',
      type: 'high_return_category',
      icon: TrendingDown,
      color: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-500/20',
      bg: 'bg-amber-50 dark:bg-amber-500/5',
      border: 'border-amber-200 dark:border-amber-500/30',
      accentBar: 'bg-gradient-to-r from-amber-400 to-yellow-400',
      btnBg: 'bg-amber-500 hover:bg-amber-600',
      title: 'High Return Category',
      message: 'Men\'s slim fit shirts have a 34% return rate on Amazon India — one of the highest categories. Most returns are due to fit issues after delivery.',
      detail: 'Allen Solly slim fit shirts have 847 recent reviews mentioning "runs small" or "too tight in shoulders". Checking the size guide before ordering can save you 7–10 days of return processing time.',
      actionLabel: 'View size guide + virtual try-on',
      actionResult: { action: 'size_guide' },
    })
  }

  /* Nudge 3: "Keep it" discount offer */
  if (fashionItems.length > 0) {
    nudges.push({
      id: 'keep_discount',
      type: 'keep_discount',
      icon: Tag,
      color: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
      bg: 'bg-emerald-50 dark:bg-emerald-500/5',
      border: 'border-emerald-200 dark:border-emerald-500/30',
      accentBar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
      btnBg: 'bg-emerald-500 hover:bg-emerald-600',
      title: 'Commit & Save ₹130',
      message: 'Commit to keeping this item and get an instant ₹130 discount applied at checkout. If you still want to return it after delivery, you can — no questions asked.',
      detail: 'This is Amazon\'s "Keep It" program. Customers who commit upfront return 68% less often. You save ₹130 now, and Amazon saves reverse logistics costs. Win-win.',
      actionLabel: 'Apply ₹130 keep-it discount',
      actionResult: { action: 'discount', amount: 130 },
    })
  }

  /* Nudge 4: Review insights */
  if (fashionItems.length > 0) {
    nudges.push({
      id: 'review_insights',
      type: 'review_insights',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',
      bg: 'bg-yellow-50 dark:bg-yellow-500/5',
      border: 'border-yellow-200 dark:border-yellow-500/30',
      accentBar: 'bg-gradient-to-r from-yellow-400 to-amber-400',
      btnBg: 'bg-yellow-500 hover:bg-yellow-600',
      title: 'Buyer Reviews Warn About Fit',
      message: '"Runs 1 size small" appears in 312 reviews. "Shoulder width is narrow for size L" mentioned in 89 reviews this month.',
      detail: 'ReLoop\'s AI analyzed 2,847 reviews for this product. Common return reasons: too tight in chest (41%), shorter than expected length (28%), different colour in person (18%). Ordering Size XL instead of L reduces return probability from 87% to 23%.',
      actionLabel: 'Switch to Size XL (Recommended)',
      actionResult: { action: 'switch_size', newSize: 'XL' },
    })
  }

  /* Nudge 5: Environmental impact framing */
  nudges.push({
    id: 'eco_impact',
    type: 'eco_impact',
    icon: Leaf,
    color: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-500/20',
    bg: 'bg-teal-50 dark:bg-teal-500/5',
    border: 'border-teal-200 dark:border-teal-500/30',
    accentBar: 'bg-gradient-to-r from-teal-400 to-cyan-400',
    btnBg: 'bg-teal-500 hover:bg-teal-600',
    title: 'Your Return Would Generate CO₂',
    message: 'If returned, this order would travel ~600km round-trip by truck — releasing 126kg of CO₂ and costing ₹400 in logistics. Keeping it (or resolving size issues now) prevents all of that.',
    detail: 'Amazon India processes 3 million returns per month. If even 10% were prevented at checkout, that\'s 37,800 tonnes of CO₂ prevented annually — equivalent to planting 1.8 million trees. Your choice at checkout matters at scale.',
    actionLabel: 'Get green credits for keeping it',
    actionResult: { action: 'green_credits', credits: 30 },
  })

  return nudges
}

/* ─── Main page ──────────────────────────────────────────────────── */
const INITIAL_CART = [
  { id: 'c1', sku: 'SKU-ALLEN-SHIRT', title: "Allen Solly Men's Slim Fit Shirt (Size S)", category: 'fashion', price: 1299, qty: 1, variant: 'S' },
  { id: 'c2', sku: 'SKU-ALLEN-SHIRT', title: "Allen Solly Men's Slim Fit Shirt (Size M)", category: 'fashion', price: 1299, qty: 1, variant: 'M' },
  { id: 'c3', sku: 'SKU-ALLEN-SHIRT', title: "Allen Solly Men's Slim Fit Shirt (Size L)", category: 'fashion', price: 1299, qty: 1, variant: 'L' },
  { id: 'c4', sku: 'SKU-KINDLE-PW',   title: 'Kindle Paperwhite (16GB)',                  category: 'electronics', price: 13999, qty: 1, variant: null },
]

export default function CheckoutPage() {
  const [cart, setCart] = useState(INITIAL_CART)
  const [dismissedNudges, setDismissedNudges] = useState(new Set())
  const [resolvedNudges, setResolvedNudges] = useState({})
  const [orderModal, setOrderModal] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [greenCredits, setGreenCredits] = useState(0)

  useEffect(() => { document.title = 'Amazon — Checkout (ReLoop Demo)' }, [])

  function removeItem(id) { setCart(c => c.filter(i => i.id !== id)) }
  function changeQty(id, qty) { setCart(c => c.map(i => i.id === id ? { ...i, qty } : i)) }

  function handleNudgeAction(type, result) {
    setResolvedNudges(r => ({ ...r, [type]: result }))

    if (type === 'size_bracketing' && result.keepSize) {
      setCart(c => c
        .filter(i => i.sku !== 'SKU-ALLEN-SHIRT' || i.variant === result.keepSize)
      )
    }
    if (type === 'keep_discount' && result.amount) {
      setDiscount(d => d + result.amount)
    }
    if (type === 'eco_impact' && result.credits) {
      setGreenCredits(g => g + result.credits)
    }
    if (type === 'review_insights' && result.newSize) {
      setCart(c => c.map(i =>
        i.sku === 'SKU-ALLEN-SHIRT'
          ? { ...i, title: `Allen Solly Men's Slim Fit Shirt (Size ${result.newSize})`, variant: result.newSize }
          : i
      ).filter((item, _, arr) =>
        // Remove duplicate sizes after switching
        arr.findIndex(x => x.sku === item.sku && x.variant === item.variant) === arr.indexOf(item)
      ))
    }
  }

  function handleNudgeDismiss(type) {
    setDismissedNudges(d => new Set([...d, type]))
  }

  const nudges = buildNudges(cart)
  const activeNudges = nudges.filter(n => !dismissedNudges.has(n.id) && !resolvedNudges[n.id])
  const resolvedCount = Object.keys(resolvedNudges).length
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const finalTotal = Math.max(0, subtotal - discount)
  const flaggedIds = new Set(cart.filter(i => i.category === 'fashion').map(i => i.id))

  async function handlePlaceOrder() {
    setPlacing(true)
    try {
      const customer = { customer_id: 'cust-demo-001', pincode: '700001', name: 'Rahul Sharma', city: 'Kolkata' }
      for (const cartItem of cart) {
        for (let i = 0; i < cartItem.qty; i++) {
          await createTwin({ sku: cartItem.sku, title: cartItem.title, category: cartItem.category, original_price: cartItem.price, purchase_date: new Date().toISOString() }, customer).catch(() => {})
        }
      }
    } catch (e) { console.error(e) }
    setPlacing(false)
    setOrderModal(true)
  }

  return (
    <div className="animate-fadeInUp max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Amazon simulation banner */}
      <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shrink-0 font-black text-white text-sm">A</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">Amazon Checkout — ReLoop Prevention Active</p>
          <p className="text-xs text-orange-600 dark:text-orange-400">AI has detected {nudges.length} return risk signals in your cart</p>
        </div>
        {resolvedCount > 0 && (
          <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-bold">
            {resolvedCount} prevented
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

        {/* ── LEFT: Cart items — always visible ────────── */}
        <div className="lg:sticky lg:top-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-xl flex items-center gap-2">
              <ShoppingCart size={20} className="text-gray-400" />
              Your Cart
            </h2>
            <span className="text-sm text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Cart items */}
          <div className="space-y-2 mb-6">
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQtyChange={changeQty}
                flagged={flaggedIds.has(item.id) && activeNudges.length > 0}
              />
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery</span><span className="text-emerald-600 font-medium">FREE</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Keep-It Discount</span><span>−₹{discount}</span>
                </div>
              )}
              {greenCredits > 0 && (
                <div className="flex justify-between text-teal-600 text-xs font-medium">
                  <span className="flex items-center gap-1"><Leaf size={10} />Green Credits</span>
                  <span>+{greenCredits} credits</span>
                </div>
              )}
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-3 mb-4">
              <span>Total</span>
              <span className="font-display tabular-nums text-lg">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Risk bar */}
            {activeNudges.length > 0 && (
              <div className="mb-3 p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20">
                <div className="flex justify-between text-xs text-rose-600 mb-1">
                  <span className="font-semibold">Return risk</span>
                  <span className="font-bold">{Math.max(20, 87 - resolvedCount * 18)}%</span>
                </div>
                <div className="h-1.5 bg-rose-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(20, 87 - resolvedCount * 18)}%` }} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
              <MapPin size={11} /><span>Rahul Sharma · Kolkata 700001</span>
            </div>

            <Button className="w-full" size="lg" loading={placing} onClick={handlePlaceOrder}>
              Place Order · ₹{finalTotal.toLocaleString('en-IN')}
            </Button>
            <div className="text-center mt-3">
              <Link to="/return" className="text-xs text-emerald-600 hover:underline flex items-center justify-center gap-1">
                Skip to Return Demo <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Prevention nudges — scrollable ────── */}
        <div>
          {/* Prevention header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-xl flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              ReLoop Prevention
            </h2>
            {resolvedCount > 0 && (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-bold">
                {resolvedCount}/{nudges.length} resolved
              </span>
            )}
          </div>

          {resolvedCount > 0 && (
            <div className="mb-3 flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <CheckCircle size={13} />
              {resolvedCount} risk{resolvedCount > 1 ? 's' : ''} resolved
              {discount > 0 && ` · ₹${discount} discount applied`}
              {greenCredits > 0 && ` · +${greenCredits} green credits`}
            </div>
          )}

          {/* Active nudge cards */}
          {activeNudges.map(nudge => (
            <PreventionCard key={nudge.id} nudge={nudge} onAction={handleNudgeAction} onDismiss={handleNudgeDismiss} />
          ))}

          {activeNudges.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-medium text-sm">All return risks resolved!</p>
              <p className="text-xs mt-1">Your return probability is now low.</p>
            </div>
          )}
        </div>

      </div>

      {/* Order confirmed modal */}
      <Modal isOpen={orderModal} onClose={() => setOrderModal(false)} title="Order Confirmed!">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your order has been placed!</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Arriving in 2–4 business days · Kolkata, 700001</p>
          {resolvedCount > 0 && (
            <div className="my-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              {resolvedCount} return risk{resolvedCount > 1 ? 's' : ''} resolved — nice work saving the planet
            </div>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/return" onClick={() => setOrderModal(false)}>
              <Button className="w-full">Try Return Flow Demo <ArrowRight size={15} /></Button>
            </Link>
            <Button variant="secondary" className="w-full" onClick={() => setOrderModal(false)}>Continue Shopping</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
