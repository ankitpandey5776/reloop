import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react'
import { checkRisk } from '../api/client.js'
import CartItem from '../components/checkout/CartItem.jsx'
import RiskNudge from '../components/checkout/RiskNudge.jsx'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'

const INITIAL_CART = [
  { id: 'c1', sku: 'SKU-ALLEN-SHIRT', title: "Allen Solly Men's Slim Fit Shirt (Size S)", category: 'fashion', price: 1299, qty: 1, variant: 'S' },
  { id: 'c2', sku: 'SKU-ALLEN-SHIRT', title: "Allen Solly Men's Slim Fit Shirt (Size M)", category: 'fashion', price: 1299, qty: 1, variant: 'M' },
  { id: 'c3', sku: 'SKU-ALLEN-SHIRT', title: "Allen Solly Men's Slim Fit Shirt (Size L)", category: 'fashion', price: 1299, qty: 1, variant: 'L' },
  { id: 'c4', sku: 'SKU-KINDLE-PW', title: 'Kindle Paperwhite (16GB)', category: 'electronics', price: 13999, qty: 1, variant: null },
]

export default function CheckoutPage() {
  const [cart, setCart] = useState(INITIAL_CART)
  const [riskData, setRiskData] = useState(null)
  const [riskLoading, setRiskLoading] = useState(false)
  const [nudgeAccepted, setNudgeAccepted] = useState(false)
  const [nudgeDismissed, setNudgeDismissed] = useState(false)
  const [orderModal, setOrderModal] = useState(false)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    document.title = 'ReLoop — Checkout'
  }, [])

  useEffect(() => {
    setRiskLoading(true)
    const items = cart.map(i => ({ sku: i.sku, category: i.category, size: i.variant, quantity: i.qty }))
    checkRisk(items, 'cust-001')
      .then(setRiskData)
      .catch(() => {})
      .finally(() => setRiskLoading(false))
  }, [])

  function removeItem(id) { setCart(c => c.filter(i => i.id !== id)) }
  function changeQty(id, qty) { setCart(c => c.map(i => i.id === id ? { ...i, qty } : i)) }

  function handleAccept() {
    setNudgeAccepted(true)
    setCart(c => c.map(i => i.id === 'c2' ? { ...i, title: "Allen Solly Men's Slim Fit Shirt (Size XL)", variant: 'XL' } : i)
      .filter(i => i.id !== 'c1' && i.id !== 'c3'))
  }

  async function handlePlaceOrder() {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1000))
    setPlacing(false)
    setOrderModal(true)
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const riskItems = cart.filter(i => i.category === 'fashion')
  const showNudge = !nudgeDismissed && riskData && riskData.risk_score >= 0.6

  return (
    <div className="animate-fadeInUp max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart size={24} className="text-emerald-600" />
        <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Your Cart</h1>
        {riskLoading && <span className="text-xs text-gray-400 animate-pulse">Analyzing cart…</span>}
      </div>

      {showNudge && (
        <RiskNudge
          riskData={riskData}
          onAccept={handleAccept}
          onDismiss={() => setNudgeDismissed(true)}
          accepted={nudgeAccepted}
        />
      )}

      <div className="space-y-3 mb-8">
        {cart.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={removeItem}
            onQtyChange={changeQty}
            flagged={item.category === 'fashion' && riskData?.risk_score >= 0.6 && !nudgeAccepted}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-lg border-t border-gray-100 dark:border-gray-800 pt-3 mb-5">
          <span>Total</span>
          <span className="font-display tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <Button className="w-full" size="lg" loading={placing} onClick={handlePlaceOrder}>
          Place Order
        </Button>
        <div className="text-center mt-4">
          <Link to="/return" className="text-sm text-emerald-600 hover:underline flex items-center justify-center gap-1">
            Continue to Return Demo <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <Modal isOpen={orderModal} onClose={() => setOrderModal(false)} title="Order Confirmed!">
        <div className="text-center">
          <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your order has been placed!</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Your items will arrive in 2-4 business days. Easy returns available if needed.</p>
          <div className="flex flex-col gap-3">
            <Link to="/return" onClick={() => setOrderModal(false)}>
              <Button className="w-full">Try Return Flow Demo <ArrowRight size={16} /></Button>
            </Link>
            <Button variant="secondary" className="w-full" onClick={() => setOrderModal(false)}>Continue Shopping</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
