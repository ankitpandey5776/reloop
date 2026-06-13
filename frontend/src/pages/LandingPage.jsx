import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ScanSearch, Recycle, ArrowRight, Leaf, Package, BarChart3, Sparkles } from 'lucide-react'
import Button from '../components/common/Button.jsx'

const PILLARS = [
  { icon: ShieldCheck, title: 'Prevent', desc: 'AI nudges stop returns before they happen — size suggestions, fit predictions, bracketing alerts.', ring: 'from-emerald-400 to-teal-500', tint: 'bg-emerald-100 text-emerald-600' },
  { icon: ScanSearch, title: 'Grade & Route', desc: 'Phone camera grades items in seconds. AI routes each item to its optimal destination.', ring: 'from-sky-400 to-blue-500', tint: 'bg-sky-100 text-sky-600' },
  { icon: Recycle, title: 'Second Life', desc: 'Every item finds its next best owner — P2P resale, refurbishment, donation, or responsible recycling.', ring: 'from-violet-400 to-purple-500', tint: 'bg-violet-100 text-violet-600' },
]

const STATS = [
  { value: '₹48,500', label: 'Logistics Cost Saved' },
  { value: '187 kg', label: 'CO₂ Prevented' },
  { value: '23', label: 'Returns Stopped' },
  { value: '150', label: 'Items Processed' },
]

const JOURNEY = [
  { n: 1, title: 'Shop on Amazon', desc: 'Normal shopping experience', icon: Package },
  { n: 2, title: 'AI Risk Check', desc: 'Smart nudge at checkout if return risk is high', icon: ShieldCheck },
  { n: 3, title: 'Photo Grading', desc: 'Photograph item → instant AI grading', icon: ScanSearch },
  { n: 4, title: 'Direct Routing', desc: 'Item goes to next best owner — zero warehouse stops', icon: Recycle },
]

export default function LandingPage() {
  useEffect(() => { document.title = 'ReLoop — Second Life Commerce' }, [])

  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-mesh py-24 sm:py-32 px-4">
        {/* animated blobs */}
        <div className="absolute top-10 -left-20 w-72 h-72 bg-emerald-300/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-32 right-0 w-80 h-80 bg-sky-300/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-violet-300/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '8s' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 glass border border-emerald-200/70 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm animate-fade-up">
            <Sparkles size={14} className="text-emerald-500" /> HackOn with Amazon Season 6.0
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight animate-fade-up delay-100">
            Every Product Deserves<br />
            <span className="text-gradient">a Second Life</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200">
            AI-powered returns ecosystem that prevents waste, recovers value, and builds trust — so every item travels once, to exactly where it creates the most value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
            <Link to="/checkout">
              <Button size="lg" className="gap-2 shadow-lg shadow-emerald-500/30">
                Start Customer Demo <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="gap-2 glass">
                View Admin Dashboard <BarChart3 size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pillars ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">How ReLoop Works</h2>
          <p className="text-gray-500 text-center mb-14">Three principles that turn returns into a second chance.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map(({ icon: Icon, title, desc, ring, tint }, i) => (
              <div
                key={title}
                className="group relative bg-white rounded-3xl p-8 text-center border border-gray-100 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r ${ring} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`inline-flex p-4 rounded-2xl ${tint} mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact stats ─────────────────────────────────── */}
      <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_40%)]" />
        <div className="relative max-w-5xl mx-auto">
          <p className="text-center text-emerald-100 text-sm font-medium uppercase tracking-wider mb-8">Real impact, measured</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="text-4xl font-bold mb-1 tracking-tight">{value}</p>
                <p className="text-emerald-100 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Customer journey ─────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">The Customer Journey</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-7 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-0.5 bg-gradient-to-r from-emerald-200 via-sky-200 to-violet-200" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {JOURNEY.map(({ n, title, desc, icon: Icon }, i) => (
                <div key={n} className="flex flex-col items-center text-center relative animate-fade-up" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg font-bold mb-4 z-10 shadow-lg shadow-emerald-500/30 ring-4 ring-white">
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

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="relative max-w-3xl mx-auto rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-sky-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '6s' }} />
          <div className="relative">
            <Leaf size={36} className="text-emerald-400 mx-auto mb-5 animate-float" />
            <h2 className="text-3xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">Walk through the full demo — from checkout prevention to marketplace resale.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/return">
                <Button size="lg" className="gap-2 shadow-lg shadow-emerald-500/30">Start Return Flow <ArrowRight size={18} /></Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="secondary" size="lg">Browse Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
