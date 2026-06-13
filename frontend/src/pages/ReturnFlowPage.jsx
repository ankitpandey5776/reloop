import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { getTwins, updateTwinState, gradeItem, routeItem, listItem } from '../api/client.js'
import Button from '../components/common/Button.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import GradeResult from '../components/grading/GradeResult.jsx'
import PhotoCapture from '../components/grading/PhotoCapture.jsx'
import RouteDecision from '../components/routing/RouteDecision.jsx'
import Badge from '../components/common/Badge.jsx'
import { stateVariant } from '../components/common/Badge.jsx'

const STEPS = ['Select Item', 'Upload Photos', 'AI Grading', 'Route Decision', 'Done']

const SCAN_MESSAGES = ['Detecting defects…', 'Assessing condition…', 'Calculating value…', 'Generating report…']

export default function ReturnFlowPage() {
  const [step, setStep] = useState(0)
  const [twins, setTwins] = useState([])
  const [loading, setLoading] = useState(true)
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
    getTwins({ state: 'ACTIVE' })
      .then(r => setTwins(r.twins || []))
      .catch(() => setError('Could not load your orders. Showing demo data.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!grading) return
    const id = setInterval(() => setScanMsg(m => (m + 1) % SCAN_MESSAGES.length), 900)
    return () => clearInterval(id)
  }, [grading])

  async function selectItem(twin) {
    setSelected(twin)
    await updateTwinState(twin.twin_id, 'RETURN_INTENT').catch(() => {})
    setStep(1)
  }

  async function handleGrade() {
    setGrading(true)
    setStep(2)
    const files = photos.map(p => p.file)
    try {
      const result = await gradeItem(selected.twin_id, files)
      await new Promise(r => setTimeout(r, 500))
      setGradeResult(result)
    } catch {
      setError('Grading failed. Using demo data.')
      setGradeResult({
        grading: { grade: 'B', confidence: 0.88, defects: [], condition_report: 'Demo: Item is in good condition.', graded_at: new Date().toISOString() },
        valuation: { resale_price: Math.round((selected?.item?.original_price || 1000) * 0.6), price_multiplier: 0.6, demand_factor: 1.0 }
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
      setRouteResult(result)
    } catch {
      setError('Routing failed. Using demo data.')
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Return an Item</h1>

      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 shrink-0">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${i === step ? 'bg-emerald-600 text-white' : i < step ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
              {i < step ? <CheckCircle size={12} /> : <span>{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={`w-4 h-0.5 ${i < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">{error}</div>
      )}

      {/* Step 0: Select item */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Which item would you like to return?</h2>
          {loading ? (
            <div className="flex justify-center py-16"><LoadingSpinner message="Loading your orders…" /></div>
          ) : twins.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No active orders found.</div>
          ) : (
            <div className="space-y-3">
              {twins.map(twin => (
                <div key={twin.twin_id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={22} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{twin.item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">₹{twin.item.original_price?.toLocaleString('en-IN')} · Purchased {new Date(twin.item.purchase_date).toLocaleDateString('en-IN')}</p>
                    <Badge text={twin.state} variant={stateVariant(twin.state)} className="mt-1" />
                  </div>
                  <Button size="sm" onClick={() => selectItem(twin)}>Initiate Return</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Photo upload */}
      {step === 1 && selected && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package size={20} className="text-emerald-600" />
            <p className="font-medium text-gray-900">{selected.item.title}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">Upload 1–4 clear photos showing the item's condition</p>
          <PhotoCapture photos={photos} setPhotos={setPhotos} error={photoError} setError={setPhotoError} />
          <Button
            className="mt-6 w-full"
            size="lg"
            disabled={photos.length === 0}
            onClick={handleGrade}
          >
            Analyze Condition <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* Step 2: Grading */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {grading ? (
            <div className="flex flex-col items-center py-12 gap-6">
              <div className="relative w-24 h-24">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <Package size={36} className="text-gray-400" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-emerald-400/30 rounded-b-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 mb-1">AI is analyzing your item…</p>
                <p className="text-sm text-gray-500 animate-pulse">{SCAN_MESSAGES[scanMsg]}</p>
              </div>
            </div>
          ) : gradeResult ? (
            <>
              <GradeResult grading={gradeResult.grading} valuation={gradeResult.valuation} originalPrice={selected?.item?.original_price} />
              <Button className="mt-6 w-full" size="lg" onClick={handleRoute}>
                Find Best Destination <ArrowRight size={16} />
              </Button>
            </>
          ) : null}
        </div>
      )}

      {/* Step 3: Routing */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
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
                  : 'Send to Repair Partner'
                } <ArrowRight size={16} />
              </Button>
            </>
          ) : null}
        </div>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50">
            <CheckCircle size={44} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your item has found its second life!</h2>
          <p className="text-gray-600 text-sm mb-6">
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
                <p className="font-bold text-emerald-600">₹{routeResult.routing.savings.cost_saved?.toLocaleString('en-IN')}</p>
                <p className="text-gray-500 text-xs">Saved</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-sky-600">{routeResult.routing.savings.co2_saved_kg} kg</p>
                <p className="text-gray-500 text-xs">CO₂ Prevented</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-violet-600">{routeResult.routing.savings.km_avoided} km</p>
                <p className="text-gray-500 text-xs">Travel Avoided</p>
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
