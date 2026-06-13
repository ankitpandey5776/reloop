import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ScanSearch, Recycle, ArrowRight, Leaf, TrendingUp, Package, BarChart3 } from 'lucide-react'
import Button from '../components/common/Button.jsx'

export default function LandingPage() {
  useEffect(() => { document.title = 'ReLoop — Second Life Commerce' }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Leaf size={14} /> HackOn with Amazon Season 6.0
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Every Product Deserves<br />
            <span className="text-emerald-600">a Second Life</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            AI-powered returns ecosystem that prevents waste, recovers value, and builds trust — so every item travels once, to exactly where it creates the most value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/checkout">
              <Button size="lg" className="gap-2">
                Start Customer Demo <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="gap-2">
                View Admin Dashboard <BarChart3 size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">How ReLoop Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Prevent', desc: 'AI nudges stop returns before they happen — size suggestions, fit predictions, bracketing alerts.', color: 'emerald' },
              { icon: ScanSearch, title: 'Grade & Route', desc: "Phone camera grades items in seconds. AI routes each item to its optimal destination.", color: 'sky' },
              { icon: Recycle, title: 'Second Life', desc: 'Every item finds its next best owner — P2P resale, refurbishment, donation, or responsible recycling.', color: 'violet' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-shadow">
                <div className={`inline-flex p-4 rounded-2xl bg-${color}-100 mb-5`}>
                  <Icon size={28} className={`text-${color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-emerald-600 py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { value: '₹48,500', label: 'Logistics Cost Saved' },
            { value: '187 kg', label: 'CO₂ Prevented' },
            { value: '23', label: 'Returns Stopped' },
            { value: '150', label: 'Items Processed' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold mb-1">{value}</p>
              <p className="text-emerald-100 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works steps */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">The Customer Journey</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-0.5 bg-emerald-200" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { n: 1, title: 'Shop on Amazon', desc: 'Normal shopping experience', icon: Package },
                { n: 2, title: 'AI Risk Check', desc: 'Smart nudge at checkout if return risk is high', icon: ShieldCheck },
                { n: 3, title: 'Photo Grading', desc: 'Photograph item → instant AI grading', icon: ScanSearch },
                { n: 4, title: 'Direct Routing', desc: 'Item goes to next best owner — zero warehouse stops', icon: Recycle },
              ].map(({ n, title, desc, icon: Icon }) => (
                <div key={n} className="flex flex-col items-center text-center relative">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold mb-4 z-10">
                    {n}
                  </div>
                  <Icon size={20} className="text-emerald-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">See It In Action</h2>
          <p className="text-gray-600 mb-8">Walk through the full demo — from checkout prevention to marketplace resale.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/return">
              <Button size="lg">Start Return Flow <ArrowRight size={18} /></Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="secondary" size="lg">Browse Marketplace</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
