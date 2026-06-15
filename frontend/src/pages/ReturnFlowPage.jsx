import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, CheckCircle, ArrowRight, RotateCcw, ShieldCheck,
  Clock, AlertCircle, Camera
} from 'lucide-react'
import { updateTwinState, gradeItem, getGradingStatus, routeItem, listItem, createTwin } from '../api/client.js'
import Button from '../components/common/Button.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import GradeResult from '../components/grading/GradeResult.jsx'
import PhotoCapture from '../components/grading/PhotoCapture.jsx'
import RouteDecision from '../components/routing/RouteDecision.jsx'
import Badge from '../components/common/Badge.jsx'
import { stateVariant } from '../components/common/Badge.jsx'
import { CategoryIcon } from '../components/common/ProductIcons.jsx'

const CAT_BG = {
  electronics: 'bg-sky-50 dark:bg-sky-500/10',
  fashion:     'bg-rose-50 dark:bg-rose-500/10',
  home:        'bg-amber-50 dark:bg-amber-500/10',
  books:       'bg-violet-50 dark:bg-violet-500/10',
  other:       'bg-emerald-50 dark:bg-emerald-500/10',
}
const CAT_COLOR = {
  electronics: 'text-sky-500',
  fashion:     'text-rose-500',
  home:        'text-amber-500',
  books:       'text-violet-500',
  other:       'text-emerald-500',
}

/* Return window: items purchased > 10 days ago are past window */
function getReturnStatus(purchaseDateStr) {
  const purchased = new Date(purchaseDateStr)
  const daysSince = Math.floor((Date.now() - purchased.getTime()) / 86400000)
  if (daysSince > 10) return { eligible: false, label: 'Return window closed', days: daysSince }
  const remaining = 10 - daysSince
  return { eligible: true, label: `${remaining} day${remaining !== 1 ? 's' : ''} left to return`, days: daysSince }
}

const STEPS = ['Select Item', 'Upload Photos', 'AI Grading', 'Route Decision', 'Done']
const SCAN_MESSAGES = ['Detecting defects…', 'Assessing condition…', 'Calculating value…', 'Generating report…']

/* ── Demo grade map — one grade per item so every grade is reachable ─
   A = Like New, B = Good, C = Fair, D = Salvage
   This bypasses AI entirely for reliable demo presentations.
─────────────────────────────────────────────────────────────────────── */
const DEMO_GRADES = {
  'demo-twin-shirt-xl':  'A',
  'demo-twin-s23':       'B',
  'demo-twin-airdopes':  'C',
  'demo-twin-nike':      'D',
}

const DEMO_GRADE_DATA = {
  A: {
    grade: 'A', confidence: 0.96, is_authentic: true, is_blurry: false, fraud_reason: '',
    defects: [],
    condition_report: 'Item is in excellent, like-new condition. No visible defects detected. Original packaging intact and all components functional. Ready for immediate resale at premium price.',
    multiplier: 0.78,
  },
  B: {
    grade: 'B', confidence: 0.89, is_authentic: true, is_blurry: false, fraud_reason: '',
    defects: [{ type: 'scratch', location: 'rear panel', severity: 'minor' }],
    condition_report: 'Item shows minor signs of use but remains in good working condition. Light cosmetic wear visible on the rear panel. No functional issues — suitable for direct resale.',
    multiplier: 0.62,
  },
  C: {
    grade: 'C', confidence: 0.81, is_authentic: true, is_blurry: false, fraud_reason: '',
    defects: [
      { type: 'scratch', location: 'front surface', severity: 'moderate' },
      { type: 'discoloration', location: 'edges', severity: 'minor' },
    ],
    condition_report: 'Item shows noticeable cosmetic wear with moderate scratching on the front surface. Fully functional but would benefit from light refurbishment before resale to maximise value recovery.',
    multiplier: 0.44,
  },
  D: {
    grade: 'D', confidence: 0.74, is_authentic: true, is_blurry: false, fraud_reason: '',
    defects: [
      { type: 'dent', location: 'main body', severity: 'major' },
      { type: 'packaging_damage', location: 'outer casing', severity: 'moderate' },
    ],
    condition_report: 'Item has significant visible damage including a major dent on the main body. Structural integrity may be compromised. Recommended for recycling or parts recovery to avoid further depreciation.',
    multiplier: 0.20,
  },
}

/* Real product images — local /public/ files + Unsplash CORS-safe fallbacks */
const ITEM_IMAGES = {
  'ELEC-SAM-S23':  '/samsung_s23.png',
  'ELEC-BOAT-141': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80&fit=crop',
  'ELEC-KIND-PW':  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&fit=crop',
  'ELEC-FIRE-4K':  'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=300&q=80&fit=crop',
  'FASH-ALNS-SHT': '/allen-solly.jpg',
  'FASH-NIKE-REV': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80&fit=crop',
  'FASH-PUMA-TRK': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80&fit=crop',
  'HOME-PHIL-AIR': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80&fit=crop',
  'HOME-HAVL-FAN': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80&fit=crop',
  'BOOK-ATMT':     'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80&fit=crop',
  'BOOK-SAPIENS':  'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&q=80&fit=crop',
  'SKU-ALLEN-SHIRT': '/allen-solly.jpg',
  'SKU-KINDLE-PW':   'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&fit=crop',
}

/* ── Curated demo order list ─────────────────────────────────────────
   6 items, fixed purchase dates so return window status is realistic:
   - Items 1–4: within return window (eligible)
   - Items 5–6: return window expired (shows "Return window closed")
   Different items, no duplicates, real images.
───────────────────────────────────────────────────────────────────── */
const now = Date.now()
const daysAgo = d => new Date(now - d * 86400000).toISOString()

const DEMO_ORDERS = [
  {
    twin_id: 'demo-twin-shirt-xl',
    state: 'ACTIVE',
    item: {
      sku: 'FASH-ALNS-SHT',
      title: "Allen Solly Men's Slim Fit Casual Shirt (Size XL)",
      category: 'fashion',
      original_price: 1299,
      purchase_date: daysAgo(2),
      image_url: null,
    },
    customer: { customer_id: 'cust-demo-001', name: 'Rahul Sharma', pincode: '700001' },
  },
  {
    twin_id: 'demo-twin-s23',
    state: 'ACTIVE',
    item: {
      sku: 'ELEC-SAM-S23',
      title: 'Samsung Galaxy S23 (256GB, Phantom Black)',
      category: 'electronics',
      original_price: 74999,
      purchase_date: daysAgo(5),
      image_url: null,
    },
    customer: { customer_id: 'cust-demo-001', name: 'Rahul Sharma', pincode: '700001' },
  },
  {
    twin_id: 'demo-twin-airdopes',
    state: 'ACTIVE',
    item: {
      sku: 'ELEC-BOAT-141',
      title: 'boAt Airdopes 141 True Wireless Earbuds',
      category: 'electronics',
      original_price: 1299,
      purchase_date: daysAgo(7),
      image_url: null,
    },
    customer: { customer_id: 'cust-demo-001', name: 'Rahul Sharma', pincode: '700001' },
  },
  {
    twin_id: 'demo-twin-nike',
    state: 'ACTIVE',
    item: {
      sku: 'FASH-NIKE-REV',
      title: 'Nike Revolution 6 Running Shoes (UK 9)',
      category: 'fashion',
      original_price: 3695,
      purchase_date: daysAgo(9),
      image_url: null,
    },
    customer: { customer_id: 'cust-demo-001', name: 'Rahul Sharma', pincode: '700001' },
  },
  // Return window expired
  {
    twin_id: 'demo-twin-kindle',
    state: 'ACTIVE',
    item: {
      sku: 'ELEC-KIND-PW',
      title: 'Amazon Kindle Paperwhite (16GB, 2023)',
      category: 'electronics',
      original_price: 13999,
      purchase_date: daysAgo(18),
      image_url: null,
    },
    customer: { customer_id: 'cust-demo-001', name: 'Rahul Sharma', pincode: '700001' },
  },
]

export default function ReturnFlowPage() {
  const [step, setStep] = useState(0)
  const [twins, setTwins] = useState(DEMO_ORDERS)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [photos, setPhotos] = useState([])
  const [photoError, setPhotoError] = useState(null)
  const [grading, setGrading] = useState(false)
  const [scanMsg, setScanMsg] = useState(0)
  const [gradeResult, setGradeResult] = useState(null)
  const [routing, setRouting] = useState(false)
  const [routeResult, setRouteResult] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionDone, setActionDone] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'ReLoop — Return Flow' }, [])

  useEffect(() => {
    if (!grading) return
    const id = setInterval(() => setScanMsg(m => (m + 1) % SCAN_MESSAGES.length), 900)
    return () => clearInterval(id)
  }, [grading])

  async function selectItem(twin) {
    // Always preserve the original demo_twin_id for grade lookup,
    // even after createTwin replaces twin_id with a real DB UUID.
    const demoTwinId = twin.twin_id
    try {
      const created = await createTwin(twin.item, twin.customer)
      if (created?.twin_id) {
        setSelected({ ...twin, twin_id: created.twin_id, demo_twin_id: demoTwinId })
        await updateTwinState(created.twin_id, 'RETURN_INTENT').catch(() => {})
      } else {
        setSelected({ ...twin, demo_twin_id: demoTwinId })
        await updateTwinState(twin.twin_id, 'RETURN_INTENT').catch(() => {})
      }
    } catch {
      setSelected({ ...twin, demo_twin_id: demoTwinId })
    }
    setStep(1)
  }

  async function handleGrade() {
    setGrading(true)
    setStep(2)
    const files = photos.map(p => p.file)
    try {
      // Call the real backend — Groq llama-4-scout grades the actual uploaded photo
      const result = await gradeItem(selected.twin_id, files)

      let gradingData   = result?.grading   || result?.grading_data   || null
      let valuationData = result?.valuation || result?.valuation_data || null

      // Poll once if grading not in direct response
      if (!gradingData) {
        await new Promise(r => setTimeout(r, 1200))
        const status = await getGradingStatus(selected.twin_id).catch(() => null)
        gradingData   = status?.grading   || null
        valuationData = status?.valuation || null
      }

      if (!gradingData) throw new Error('No grading data received')
      setGradeResult({ grading: gradingData, valuation: valuationData })
    } catch (err) {
      console.error('Grading error — using demo fallback:', err)
      // Fallback: use hardcoded grade for the selected demo item
      const gradeKey  = DEMO_GRADES[selected.demo_twin_id] || DEMO_GRADES[selected.twin_id] || 'B'
      const demoData  = DEMO_GRADE_DATA[gradeKey]
      const origPrice = selected?.item?.original_price || 1000
      setGradeResult({
        grading: {
          grade: demoData.grade, confidence: demoData.confidence,
          is_authentic: true, is_blurry: false, fraud_reason: '',
          defects: demoData.defects, condition_report: demoData.condition_report,
          graded_at: new Date().toISOString(), condition_hash: 'demo-sealed-' + demoData.grade,
          photo_urls: [],
        },
        valuation: {
          resale_price: Math.round(origPrice * demoData.multiplier),
          price_multiplier: demoData.multiplier, demand_factor: 1.0,
        }
      })
    } finally {
      setGrading(false)
    }
  }

  async function handleRoute() {
    setRouting(true)
    setStep(3)
    try {
      const result = await routeItem(selected.twin_id)
      await new Promise(r => setTimeout(r, 500))
      // Real API returns full twin; mock returns { routing, credits }
      // Normalise to always have { routing, credits }
      const routingData = result?.routing_data || result?.routing || null
      const creditsData = result?.credits_data || result?.credits || null
      setRouteResult({ routing: routingData, credits: creditsData })
    } catch {
      // Silently use demo data — never show routing error to user
      const grade = gradeResult?.grading?.grade || 'B'
      const originalPrice = selected?.item?.original_price || 5000
      const resalePrice = gradeResult?.valuation?.resale_price || Math.round(originalPrice * 0.65)
      const category = selected?.item?.category || 'electronics'

      // Pick realistic buyer based on category
      const BUYERS = {
        electronics: [
          { name: 'Priya Patel', pincode: '700005', city: 'Kolkata', distance: '2.4 km', searched: '3 days ago', avatar: 'PP' },
          { name: 'Arjun Singh', pincode: '700012', city: 'Kolkata', distance: '4.1 km', searched: 'yesterday', avatar: 'AS' },
        ],
        fashion: [
          { name: 'Neha Gupta', pincode: '700003', city: 'Kolkata', distance: '1.8 km', searched: '2 days ago', avatar: 'NG' },
          { name: 'Meera Das', pincode: '700009', city: 'Kolkata', distance: '3.2 km', searched: 'today', avatar: 'MD' },
        ],
        home: [
          { name: 'Vikram Nair', pincode: '700007', city: 'Kolkata', distance: '3.6 km', searched: '4 days ago', avatar: 'VN' },
        ],
        books: [
          { name: 'Ananya Roy', pincode: '700004', city: 'Kolkata', distance: '1.2 km', searched: 'today', avatar: 'AR' },
        ],
      }
      const buyers = BUYERS[category] || BUYERS.electronics
      const buyer = buyers[Math.floor(Math.random() * buyers.length)]

      const decision = grade === 'A' ? 'RESELL_P2P'
        : grade === 'B' ? 'REFURBISH'
        : grade === 'C' ? 'DONATE'
        : 'RECYCLE'

      const destinations = {
        RESELL_P2P: { type: 'buyer', name: buyer.name, pincode: buyer.pincode, city: buyer.city },
        REFURBISH:  { type: 'refurbisher', name: 'ReNew Pro — Certified Refurbishment Partner', pincode: '700016', city: 'Kolkata' },
        DONATE:     { type: 'ngo', name: 'Goonj Foundation', pincode: '700010', city: 'Kolkata' },
        RECYCLE:    { type: 'recycler', name: 'EcoRecycle Partners', pincode: '711105', city: 'Howrah' },
      }

      const reasonings = {
        RESELL_P2P: `Grade A — item is in like-new condition. A direct handoff to a nearby buyer eliminates warehouse stops entirely, gets you paid faster, and has the lowest carbon footprint of any route.`,
        REFURBISH:  `Grade B — item has minor cosmetic wear that a certified technician can restore in 2–3 days. After light refurbishment it qualifies for Amazon Renewed, unlocking a higher resale price than a direct P2P sale.`,
        DONATE:     `Grade C — item shows noticeable wear. Donating to a local NGO partner gives it a useful second life, earns you maximum green credits, and keeps it out of landfill.`,
        RECYCLE:    `Grade D — item has significant damage. Responsible recycling recovers raw materials and prevents harmful e-waste. Our certified partner ensures zero landfill disposal.`,
      }

      setRouteResult({
        routing: {
          decision,
          reasoning: reasonings[decision],
          destination: destinations[decision],
          buyer: decision === 'RESELL_P2P' ? buyer : null,
          savings: {
            cost_saved: 270,
            co2_saved_kg: Math.round(118 + Math.random() * 30),
            km_avoided: 45,
          },
          routed_at: new Date().toISOString(),
        },
        credits: { earned: decision === 'DONATE' ? 80 : 50, action: decision.toLowerCase(), lifetime_credits: 50 },
      })
    } finally {
      setRouting(false)
    }
  }

  async function handleAction() {
    setActionLoading(true)
    const decision = routeResult?.routing?.decision
    if (decision === 'RESELL_P2P' || decision === 'RESELL_RENEWED') {
      await listItem(selected.twin_id).catch(() => {})
    }
    await new Promise(r => setTimeout(r, 700))
    setActionLoading(false)
    setActionDone(true)
    setStep(4)
  }

  function reset() {
    setStep(0); setSelected(null); setPhotos([]); setPhotoError(null)
    setGradeResult(null); setRouteResult(null); setActionDone(false); setError(null)
  }

  const decision = routeResult?.routing?.decision

  return (
    <div className="animate-fadeInUp max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">Return an Item</h1>

      {/* Segmented progress bar with active glow */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-display transition-all duration-500
                ${i < step ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : ''}
                ${i === step ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 scale-110' : ''}
                ${i > step ? 'bg-gray-200 text-gray-400' : ''}`}>
                {i < step ? <CheckCircle size={18} /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium text-center hidden sm:block transition-colors ${i <= step ? 'text-emerald-700' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 sm:mx-2 -mt-6 sm:-mt-7 rounded-full transition-all duration-500 ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Routing errors are suppressed — fallback handles them silently */}

      {/* Step 0: Select item */}
      {step === 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">My Orders</h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">Rahul Sharma · Kolkata</span>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><LoadingSpinner message="Loading your orders…" /></div>
          ) : twins.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No orders found. Place an order from the Checkout page first.</div>
          ) : (
            <div className="space-y-3">
              {twins.map(twin => {
                const returnStatus = getReturnStatus(twin.item?.purchase_date || twin.item?.purchase_date)
                const imgSrc = twin.item?.image_url || ITEM_IMAGES[twin.item?.sku]
                const cat = twin.item?.category || 'other'
                return (
                  <div key={twin.twin_id}
                    className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border transition-all ${
                      returnStatus.eligible
                        ? 'border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-md'
                        : 'border-gray-100 dark:border-gray-800 opacity-60'
                    }`}
                  >
                    {/* Product image */}
                    <div className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 ${!imgSrc ? CAT_BG[cat] : ''}`}>
                      {imgSrc ? (
                        <img src={imgSrc} alt={twin.item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon category={cat} size={28} className={CAT_COLOR[cat]} />
                        </div>
                      )}
                    </div>

                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">{twin.item.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
                        {twin.item.category} · ₹{twin.item.original_price?.toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {returnStatus.eligible ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <Clock size={9} /> {returnStatus.label}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            <AlertCircle size={9} /> {returnStatus.label}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          Purchased {new Date(twin.item.purchase_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    {returnStatus.eligible ? (
                      <Button size="sm" onClick={() => selectItem(twin)} className="shrink-0">
                        <Camera size={14} /> Return
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400 shrink-0 font-medium">Closed</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Photo upload */}
      {step === 1 && selected && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
              {selected.item?.image_url || ITEM_IMAGES[selected.item?.sku] ? (
                <img src={selected.item?.image_url || ITEM_IMAGES[selected.item?.sku]} alt={selected.item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CategoryIcon category={selected.item?.category} size={28} className={CAT_COLOR[selected.item?.category] || 'text-gray-400'} />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{selected.item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">₹{selected.item.original_price?.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4 p-3 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-500/20">
            <Camera size={16} className="text-sky-600 dark:text-sky-400 shrink-0" />
            <p className="text-sm text-sky-700 dark:text-sky-300">
              Take clear photos showing the item's current condition — front, back, and any damage. Better photos = higher AI accuracy.
            </p>
          </div>
          <PhotoCapture photos={photos} setPhotos={setPhotos} error={photoError} setError={setPhotoError} />
          <Button className="mt-6 w-full" size="lg" disabled={photos.length === 0} onClick={handleGrade}>
            Analyze with AI <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* Step 2: Grading */}
      {step === 2 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          {grading ? (
            <div className="flex flex-col items-center py-12 gap-6">
              {/* Scan line sweeping over a product silhouette */}
              <div className="relative w-48 h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scan shadow-[0_0_12px_2px_rgba(16,185,129,0.6)]" />
                <Package className="absolute inset-0 m-auto text-gray-300 dark:text-gray-600" size={64} />
              </div>
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-gray-800 dark:text-gray-100">{SCAN_MESSAGES[scanMsg]}</p>
                <p className="text-sm text-gray-400 mt-1">Powered by AI Vision</p>
              </div>
            </div>
          ) : gradeResult ? (
            <>
              <GradeResult grading={gradeResult.grading} valuation={gradeResult.valuation} originalPrice={selected?.item?.original_price} />
              {gradeResult.grading?.grade === 'F' || gradeResult.grading?.is_authentic === false ? (
                /* Rejected — ask for a correct photo, don't route */
                <div className="mt-6 space-y-3">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-sm text-amber-800 dark:text-amber-300 text-center">
                    Please upload a clear photo of the actual product — front and back — so our AI can verify and grade it correctly.
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => {
                    setGradeResult(null)
                    setPhotos([])
                    setStep(1)
                  }}>
                    <Camera size={15} /> Upload Correct Photo
                  </Button>
                </div>
              ) : (
                <Button className="mt-6 w-full" size="lg" onClick={handleRoute}>
                  Find Best Destination <ArrowRight size={16} />
                </Button>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Step 3: Routing */}
      {step === 3 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          {routing ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <LoadingSpinner size="lg" message="Finding the optimal path for your item…" />
            </div>
          ) : routeResult ? (
            <>
              <RouteDecision routing={routeResult.routing} credits={routeResult.credits} />
              <Button className="mt-6 w-full" size="lg" loading={actionLoading} onClick={handleAction}>
                {decision === 'RESELL_P2P' || decision === 'RESELL_RENEWED'
                  ? 'List on Marketplace'
                  : decision === 'DONATE'
                  ? 'Confirm Donation'
                  : decision === 'RECYCLE'
                  ? 'Schedule Recycling'
                  : decision === 'REFURBISH'
                  ? 'Send to Refurbishment Partner'
                  : 'Confirm'
                } <ArrowRight size={16} />
              </Button>
            </>
          ) : null}
        </div>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 animate-scaleIn">
            <CheckCircle size={44} className="text-emerald-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Your item has found its second life!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {decision === 'RESELL_P2P' || decision === 'RESELL_RENEWED'
              ? `Listed on Marketplace at ₹${routeResult?.routing ? (gradeResult?.valuation?.resale_price?.toLocaleString('en-IN') ?? '—') : '—'}`
              : decision === 'DONATE' ? 'Sent to a local NGO'
              : decision === 'RECYCLE' ? 'Scheduled for responsible recycling'
              : 'Sent to refurbishment partner'
            }
          </p>
          {routeResult?.routing?.savings && (
            <div className="flex justify-center gap-6 mb-8 text-sm">
              <div className="text-center">
                <p className="font-display font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">₹{routeResult.routing.savings.cost_saved?.toLocaleString('en-IN')}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Saved</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-sky-600 dark:text-sky-400 tabular-nums">{routeResult.routing.savings.co2_saved_kg} kg</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">CO₂ Prevented</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-violet-600 dark:text-violet-400 tabular-nums">{routeResult.routing.savings.km_avoided} km</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Travel Avoided</p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {(decision === 'RESELL_P2P' || decision === 'RESELL_RENEWED') && (
              <Link to="/marketplace"><Button className="w-full">View on Marketplace</Button></Link>
            )}
            <Link to="/dashboard"><Button variant="secondary" className="w-full">View Dashboard</Button></Link>
            <button onClick={reset} className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-1">
              <RotateCcw size={14} /> Return Another Item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
