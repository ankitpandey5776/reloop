import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ScanSearch, Recycle, ArrowRight, Leaf, Package, BarChart3, Sparkles, TrendingUp, MapPin } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import { useScrollReveal } from '../hooks/useAnimations.js'

const PILLARS = [
  { icon: ShieldCheck, title: 'Prevent', desc: 'AI nudges stop returns before they happen — size suggestions, fit predictions, bracketing alerts.',
    tint: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400', bar: 'from-emerald-400 to-teal-500' },
  { icon: ScanSearch, title: 'Grade & Route', desc: 'Phone camera grades items in seconds. AI routes each item to its optimal destination.',
    tint: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400', bar: 'from-sky-400 to-cyan-500' },
  { icon: Recycle, title: 'Second Life', desc: 'Every item finds its next best owner — P2P resale, refurbishment, donation, or responsible recycling.',
    tint: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400', bar: 'from-violet-400 to-purple-500' },
]

const STATS = [
  { value: '₹48,500', label: 'Logistics Cost Saved' },
  { value: '187 kg', label: 'CO₂ Prevented' },
  { value: '23', label: 'Returns Stopped' },
  { value: '150', label: 'Items Processed' },
]

const JOURNEY = [
  { n: 1, title: 'Shop on Amazon', desc: 'Normal shopping experience', icon: Package, ring: 'from-emerald-500 to-teal-600' },
  { n: 2, title: 'AI Risk Check', desc: 'Smart nudge at checkout if return risk is high', icon: ShieldCheck, ring: 'from-amber-500 to-orange-600' },
  { n: 3, title: 'Photo Grading', desc: 'Photograph item → instant AI grading', icon: ScanSearch, ring: 'from-sky-500 to-cyan-600' },
  { n: 4, title: 'Direct Routing', desc: 'Item goes to next best owner — zero warehouse stops', icon: Recycle, ring: 'from-violet-500 to-purple-600' },
]

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  )
}

/* Small glassy cards that float around the hero. */
function FloatCard({ className = '', delay = '0s', children }) {
  return (
    <div
      className={`hidden lg:flex absolute z-20 items-center gap-2.5 rounded-2xl px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 shadow-xl shadow-black/20 animate-float ${className}`}
      style={{ animationDelay: delay }}
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
      <section
        className="relative px-4 py-28 sm:py-36 overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #0b1120 0%, #03241c 45%, #06303a 100%)' }}
      >
        {/* multi-color glow orbs */}
        <div className="absolute -top-10 left-[10%] w-80 h-80 rounded-full bg-emerald-500/25 blur-3xl animate-blob" />
        <div className="absolute top-20 right-[8%] w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl animate-blob" style={{ animationDelay: '9s' }} />
        <div className="absolute -bottom-10 right-1/4 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

        {/* floating components */}
        <FloatCard className="top-24 left-[7%]" delay="0s">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 text-white font-display font-bold">A</span>
          <div className="text-left">
            <p className="text-white text-sm font-semibold leading-none">Like New</p>
            <p className="text-emerald-300 text-xs font-mono mt-1">92% confidence</p>
          </div>
        </FloatCard>

        <FloatCard className="top-32 right-[6%]" delay="1.2s">
          <TrendingUp size={18} className="text-lime-300" />
          <div className="text-left">
            <p className="text-white text-sm font-semibold leading-none font-display">₹48,500</p>
            <p className="text-lime-300/80 text-xs mt-1">cost saved</p>
          </div>
        </FloatCard>

        <FloatCard className="bottom-28 left-[12%]" delay="2.1s">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/30 text-violet-200"><MapPin size={15} /></span>
          <p className="text-white text-sm font-medium">Routed → <span className="text-violet-300">Resell P2P</span></p>
        </FloatCard>

        <FloatCard className="bottom-32 right-[11%]" delay="0.6s">
          <Leaf size={18} className="text-cyan-300" />
          <div className="text-left">
            <p className="text-white text-sm font-semibold leading-none font-display">187 kg</p>
            <p className="text-cyan-300/80 text-xs mt-1">CO₂ prevented</p>
          </div>
        </FloatCard>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 glass-dark text-emerald-200 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fadeInUp">
            <Sparkles size={14} className="text-emerald-300" /> HackOn with Amazon Season 6.0
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight animate-fadeInUp delay-100">
            Every Product Deserves<br />
            <span className="text-gradient">a Second Life</span>
          </h1>
          <p className="text-lg text-gray-300/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-200">
            AI-powered returns ecosystem that prevents waste, recovers value, and builds trust — so every item travels once, to exactly where it creates the most value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-300">
            <Link to="/checkout">
              <Button size="lg" className="gap-2 !bg-white !text-[#04150f] !shadow-lg hover:!bg-emerald-50 hover:!from-white hover:!to-white">
                Start Customer Demo <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 !bg-white/5 !border-2 !border-white/20 !text-white !shadow-none hover:!bg-white/10 hover:!from-transparent hover:!to-transparent">
                View Admin Dashboard <BarChart3 size={18} />
              </Button>
            </Link>
          </div>
        </div>

        {/* fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950" />
      </section>

      {/* ── Pillars (adaptive, multi-color) ──────────────── */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">How ReLoop Works</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-14">Three principles that turn returns into a second chance.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map(({ icon: Icon, title, desc, tint, bar }, i) => (
              <Reveal key={title} delay={i * 120}>
                <div className="group relative h-full bg-white dark:bg-gray-900 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-800 card-hover overflow-hidden">
                  <div className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r ${bar} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className={`inline-flex p-4 rounded-2xl ${tint} mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact stats (multi-color band) ──────────────── */}
      <section className="px-4 pb-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto rounded-3xl p-10 shadow-xl shadow-emerald-500/10 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">
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

      {/* ── Customer journey (adaptive) ──────────────────── */}
      <section className="px-4 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white text-center mb-14">The Customer Journey</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-7 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-0.5 bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {JOURNEY.map(({ n, title, desc, icon: Icon, ring }, i) => (
                <Reveal key={n} delay={i * 120}>
                  <div className="flex flex-col items-center text-center relative">
                    <div className={`font-display w-14 h-14 rounded-full bg-gradient-to-br ${ring} text-white flex items-center justify-center text-lg font-bold mb-4 z-10 shadow-lg ring-4 ring-white dark:ring-gray-900`}>
                      {n}
                    </div>
                    <Icon size={20} className="text-gray-400 dark:text-gray-500 mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="px-4 py-20 bg-white dark:bg-gray-900">
        <div className="relative max-w-3xl mx-auto rounded-3xl p-12 text-center overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(150deg, #0b1120 0%, #022c22 60%, #06303a 100%)' }}>
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '6s' }} />
          <div className="relative">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-5">
              <Leaf size={28} className="text-emerald-400 animate-float" />
            </span>
            <h2 className="font-display text-3xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">Walk through the full demo — from checkout prevention to marketplace resale.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/return">
                <Button size="lg" className="gap-2">Start Return Flow <ArrowRight size={18} /></Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" className="!bg-white !text-[#04150f] !shadow-lg hover:!bg-emerald-50 hover:!from-white hover:!to-white">Browse Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
