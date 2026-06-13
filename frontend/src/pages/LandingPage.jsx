import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ScanSearch, Recycle, ArrowRight, Leaf, Package, BarChart3, Sparkles } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import { useScrollReveal } from '../hooks/useAnimations.js'

const PILLARS = [
  { icon: ShieldCheck, title: 'Prevent', desc: 'AI nudges stop returns before they happen — size suggestions, fit predictions, bracketing alerts.', accent: 'text-emerald-300' },
  { icon: ScanSearch, title: 'Grade & Route', desc: 'Phone camera grades items in seconds. AI routes each item to its optimal destination.', accent: 'text-cyan-300' },
  { icon: Recycle, title: 'Second Life', desc: 'Every item finds its next best owner — P2P resale, refurbishment, donation, or responsible recycling.', accent: 'text-violet-300' },
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

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  useEffect(() => { document.title = 'ReLoop — Second Life Commerce' }, [])

  return (
    <div className="animate-fadeInUp overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-bg px-4 py-28 sm:py-36">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 glass-dark text-emerald-200 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fadeInUp">
            <Sparkles size={14} className="text-emerald-300" /> HackOn with Amazon Season 6.0
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight animate-fadeInUp delay-100">
            Every Product Deserves<br />
            <span className="text-gradient">a Second Life</span>
          </h1>
          <p className="text-lg text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-200">
            AI-powered returns ecosystem that prevents waste, recovers value, and builds trust — so every item travels once, to exactly where it creates the most value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-300">
            <Link to="/checkout">
              <Button size="lg" className="gap-2 !bg-white !text-[#022c22] !shadow-lg hover:!bg-emerald-50 hover:!from-white hover:!to-white">
                Start Customer Demo <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 !bg-transparent !border-2 !border-emerald-400/30 !text-emerald-200 !shadow-none hover:!bg-emerald-900/30 hover:!from-transparent hover:!to-transparent">
                View Admin Dashboard <BarChart3 size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pillars (glass on dark) ──────────────────────── */}
      <section className="px-4 py-20 bg-gradient-to-b from-[#047857] to-[#022c22]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-3">How ReLoop Works</h2>
          <p className="text-emerald-200/70 text-center mb-14">Three principles that turn returns into a second chance.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map(({ icon: Icon, title, desc, accent }, i) => (
              <Reveal key={title} delay={i * 120}>
                <div className="group glass-dark rounded-2xl p-8 text-center h-full hover:bg-white/15 transition-all duration-300">
                  <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon size={28} className={accent} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-3">{title}</h3>
                  <p className="text-emerald-100/70 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact stats ─────────────────────────────────── */}
      <section className="px-4 py-16 bg-[#f9fafb]">
        <div className="max-w-5xl mx-auto rounded-3xl p-10 bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 shadow-xl shadow-emerald-500/20">
          <p className="text-center text-white/80 text-sm font-medium uppercase tracking-wider mb-8">Real impact, measured</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white divide-x divide-white/15">
            {STATS.map(({ value, label }, i) => (
              <Reveal key={label} delay={i * 100}>
                <div>
                  <p className="font-display text-4xl font-bold mb-1 tracking-tight tabular-nums">{value}</p>
                  <p className="text-white/80 text-sm">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Customer journey ─────────────────────────────── */}
      <section className="px-4 py-20 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-14">The Customer Journey</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-7 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-0.5 bg-gradient-to-r from-emerald-200 via-sky-200 to-violet-200" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {JOURNEY.map(({ n, title, desc, icon: Icon }, i) => (
                <Reveal key={n} delay={i * 120}>
                  <div className="flex flex-col items-center text-center relative">
                    <div className="font-display w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg font-bold mb-4 z-10 shadow-lg shadow-emerald-500/30 ring-4 ring-white">
                      {n}
                    </div>
                    <Icon size={20} className="text-emerald-500 mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="px-4 py-20 bg-[#f9fafb]">
        <div className="relative max-w-3xl mx-auto rounded-3xl p-12 text-center overflow-hidden shadow-2xl" style={{ background: 'var(--gradient-dark)' }}>
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '6s' }} />
          <div className="relative">
            <Leaf size={36} className="text-emerald-400 mx-auto mb-5 animate-float" />
            <h2 className="font-display text-3xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">Walk through the full demo — from checkout prevention to marketplace resale.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/return">
                <Button size="lg" className="gap-2">Start Return Flow <ArrowRight size={18} /></Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" className="!bg-white !text-[#022c22] !shadow-lg hover:!bg-emerald-50 hover:!from-white hover:!to-white">Browse Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
