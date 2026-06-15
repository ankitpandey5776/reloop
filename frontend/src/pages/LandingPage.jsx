import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion, useScroll, useTransform, useMotionValue,
  useSpring, AnimatePresence
} from 'framer-motion'
import {
  ShieldCheck, ScanSearch, Recycle, ArrowRight, Leaf,
  BarChart3, Sparkles, TrendingUp, MapPin, Zap, Users, Globe
} from 'lucide-react'
import { useScrollReveal, useCountUp } from '../hooks/useAnimations.js'

/* ─── Framer Motion variants ──────────────────────────── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

/* ─── Word-by-word animated headline ─────────────────── */
function AnimatedWords({ text, className = '', delay = 0 }) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 60, skewY: 4 },
            show:   { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* ─── Magnetic button ─────────────────────────────────── */
function MagneticButton({ children, className = '', to, style }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  function handleMouseLeave() { x.set(0); y.set(0) }

  return (
    <Link to={to}>
      <motion.button
        ref={ref}
        style={{ x: sx, y: sy, ...style }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={className}
      >
        {children}
      </motion.button>
    </Link>
  )
}

/* ─── Floating stat card ──────────────────────────────── */
function FloatCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`hidden lg:flex absolute z-20 items-center gap-3 rounded-2xl px-4 py-3
        bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/30 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center gap-3 w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ─── 3D tilt card ────────────────────────────────────── */
function PillarCard({ icon: Icon, title, desc, gradient, step, delay }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  function handleMouse(e) {
    const r = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top)  / r.height - 0.5)
  }
  function resetMouse() { x.set(0); y.set(0) }

  return (
    <motion.div variants={staggerItem} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseLeave={resetMouse}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative h-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-default"
      >
        <motion.div
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${gradient}`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: delay / 1000 + 0.2 }}
          viewport={{ once: true }}
        />
        <span className="absolute top-4 right-5 font-display text-7xl font-black text-gray-100 dark:text-gray-800 select-none">
          {step}
        </span>
        <motion.div
          className={`inline-flex p-4 rounded-2xl mb-5 bg-gradient-to-br ${gradient}`}
          style={{ opacity: 0.15 }}
          whileHover={{ scale: 1.12, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Icon size={28} className="text-gray-700 dark:text-gray-200" style={{ opacity: 1 }} />
        </motion.div>
        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
        <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          Learn more <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Animated counter ────────────────────────────────── */
function StatNum({ target, prefix = '', suffix = '', label }) {
  const [ref, visible] = useScrollReveal(0.3)
  const [started, setStarted] = useState(false)
  useEffect(() => { if (visible) setStarted(true) }, [visible])
  const val = useCountUp(started ? target : 0, 1800)
  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="text-center px-4 py-6 rounded-2xl hover:bg-white/5 transition-colors cursor-default"
    >
      <p className="font-display text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
        {prefix}{val.toLocaleString('en-IN')}{suffix}
      </p>
      <p className="text-emerald-300/70 text-sm font-medium mt-1">{label}</p>
    </motion.div>
  )
}

/* ─── Scrolling ticker ────────────────────────────────── */
const TICKER_ITEMS = [
  '📦 Samsung Galaxy graded B → P2P Resale · ₹270 saved',
  '👟 Nike Shoes graded A → Listed · 118 kg CO₂ saved',
  '📚 HP Book Set graded C → Donated · 8 returns prevented',
  '💡 Wipro Bulbs graded D → Recycled · ₹320 saved',
  '👔 Allen Solly Shirt → Return prevented at checkout · +20 credits',
  '📱 Boat Airdopes 141 graded B → Marketplace · Buyer 2.4 km away',
]

function Ticker() {
  return (
    <div className="w-full overflow-hidden bg-emerald-950/50 border-y border-emerald-800/30 py-2.5">
      <motion.div
        className="flex gap-14 whitespace-nowrap"
        style={{ width: 'max-content' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="text-xs text-emerald-300/70 font-medium flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Scroll reveal wrapper ───────────────────────────── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Data ────────────────────────────────────────────── */
const PILLARS = [
  {
    icon: ShieldCheck, step: '01', title: 'Prevent Returns',
    gradient: 'from-emerald-400 to-teal-500',
    desc: 'AI nudges at checkout detect bracketing behaviour, size mismatches, and impulse purchases before the order is placed.',
  },
  {
    icon: ScanSearch, step: '02', title: 'Grade in Seconds',
    gradient: 'from-sky-400 to-cyan-500',
    desc: 'Customer photographs the item. Claude on Bedrock grades it A–D with a SHA-256 tamper-proof condition report in seconds.',
  },
  {
    icon: Recycle, step: '03', title: 'Route to Best Owner',
    gradient: 'from-violet-400 to-purple-500',
    desc: 'Rules + LLM reasoning decide: Resell P2P, Renewed, Refurbish, Donate, or Recycle — and route directly, zero warehouse stop.',
  },
]

const JOURNEY = [
  { n: 1, title: 'Shop',        desc: 'Normal checkout experience',            icon: '🛒', gradient: 'from-emerald-500 to-teal-600' },
  { n: 2, title: 'AI Nudge',   desc: 'Smart intervention catches return risk', icon: '⚡', gradient: 'from-amber-500 to-orange-600' },
  { n: 3, title: 'Camera Grade', desc: 'Photo → instant AI grade + report',  icon: '📷', gradient: 'from-sky-500 to-cyan-600' },
  { n: 4, title: 'Second Life', desc: 'Direct to next best owner',             icon: '♻️', gradient: 'from-violet-500 to-purple-600' },
]

/* ─── Main ────────────────────────────────────────────── */
export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  useEffect(() => { document.title = 'ReLoop — Second Life Commerce' }, [])

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #030f09 0%, #02180f 35%, #041c25 70%, #070d1a 100%)' }}
      >
        {/* Animated glows */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[20%] right-[5%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          />
        </div>

        {/* Floating stat cards */}
        <FloatCard className="top-[18%] left-[4%]" delay={1.2}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-display font-black text-white text-lg">A</div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">Like New</p>
            <p className="text-emerald-300 text-xs font-mono">92% confidence</p>
          </div>
        </FloatCard>

        <FloatCard className="top-[30%] right-[4%]" delay={1.5}>
          <TrendingUp size={18} className="text-lime-300 shrink-0" />
          <div>
            <p className="text-white text-sm font-bold font-display">₹48,500</p>
            <p className="text-lime-300/70 text-xs">cost saved today</p>
          </div>
        </FloatCard>

        <FloatCard className="bottom-[30%] left-[4%]" delay={1.8}>
          <span className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center shrink-0">
            <MapPin size={14} className="text-violet-200" />
          </span>
          <p className="text-white text-sm font-medium">Routed → <span className="text-violet-300">Resell P2P</span></p>
        </FloatCard>

        <FloatCard className="bottom-[24%] right-[5%]" delay={2.0}>
          <Leaf size={18} className="text-cyan-300 shrink-0" />
          <div>
            <p className="text-white text-sm font-bold font-display">4,712 kg</p>
            <p className="text-cyan-300/70 text-xs">CO₂ prevented</p>
          </div>
        </FloatCard>

        {/* Hero content */}
        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center pt-16"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-white/8 backdrop-blur border border-white/15 text-emerald-200 px-5 py-2 rounded-full text-sm font-medium">
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles size={13} className="text-emerald-300" />
              </motion.span>
              HackOn with Amazon Season 6.0 · Second Life Commerce
            </span>
          </motion.div>

          <h1 className="font-display font-black text-white leading-[1.05] tracking-tighter mb-6 overflow-hidden">
            <span className="block text-5xl sm:text-7xl lg:text-[88px]">
              <AnimatedWords text="Every Product" delay={0.2} />
            </span>
            <span className="block text-5xl sm:text-7xl lg:text-[88px]">
              <AnimatedWords text="Deserves a" delay={0.5} />
            </span>
            <span className="block text-5xl sm:text-7xl lg:text-[88px]">
              <AnimatedWords text="Second Life" delay={0.8} className="text-gradient" />
            </span>
          </h1>

          <motion.p
            className="text-gray-300/80 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          >
            Amazon spends billions moving items to warehouses just to find out what they are.
            <br />
            <span className="text-emerald-300 font-semibold">ReLoop finds out before they move</span> — so every item travels once, to exactly where it creates the most value.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
          >
            <MagneticButton
              to="/checkout"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-bold text-base text-white"
              style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
            >
              <Zap size={18} />
              Try Customer Demo
              <ArrowRight size={18} />
            </MagneticButton>
            <MagneticButton
              to="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-bold text-base text-white border-2 border-white/20 hover:border-emerald-400/50 hover:bg-white/5 transition-colors"
            >
              <BarChart3 size={18} />
              Admin Dashboard
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-20 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <span className="text-white/25 text-xs uppercase tracking-widest">scroll to explore</span>
            <motion.div
              className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950 pointer-events-none" />
      </section>

      <Ticker />

      {/* ══ THE PROBLEM ═══════════════════════════════════ */}
      <section className="px-4 py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal><span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-500 mb-4">The Problem</span></Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Returns are a{' '}
              <span className="text-rose-500 relative">
                data death
                <motion.svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }}>
                  <motion.path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="#f43f5e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </motion.svg>
              </span>
              {' '}problem.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              When a customer opens the box, the item loses its digital identity. Amazon must physically ship it 600+ km just to find out what it is. At millions of returns per month, that's a <strong className="text-gray-900 dark:text-white">multi-thousand-crore annual drain</strong>.
            </p>
          </Reveal>
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { n: 400, prefix: '₹', suffix: '+', label: 'per return in logistics', bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
              { n: 50, suffix: '%', label: 'value lost from delay alone', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
              { n: 600, suffix: ' km', label: 'average return round-trip', bg: 'bg-sky-50 dark:bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400' },
            ].map(({ n, prefix = '', suffix, label, bg, text }, i) => (
              <motion.div key={label} variants={staggerItem} className={`${bg} rounded-2xl p-6`}>
                <InlineStat n={n} prefix={prefix} suffix={suffix} label={label} textClass={text} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ HOW IT ACTUALLY WORKS — Plugin story ═════════ */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">How It Actually Works</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                ReLoop runs inside Amazon — not beside it
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                Customers never leave Amazon. ReLoop is middleware that plugs into the existing return flow, grades items at the customer's location, and routes them to the next best owner automatically.
              </p>
            </div>
          </Reveal>

          {/* 3-column flow: Amazon Checkout → ReLoop Engine → Amazon Second Hand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Col 1: Amazon Checkout */}
            <Reveal delay={0}>
              <div className="rounded-2xl border-2 border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/8 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">Amazon Checkout</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5 shrink-0">→</span>
                    <span>Customer adds 3 sizes of same shirt</span>
                  </div>
                  <div className="flex items-start gap-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg p-2">
                    <span className="text-amber-600 mt-0.5 shrink-0">⚡</span>
                    <span className="font-medium text-amber-800 dark:text-amber-300">ReLoop nudge appears: "87% of buyers your size found this runs small"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <span>Customer switches to one size → <strong>1 return prevented</strong></span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center pt-16">
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl text-gray-300 dark:text-gray-600"
              >→</motion.div>
            </div>

            {/* Col 2: ReLoop grading engine */}
            <Reveal delay={100}>
              <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/8 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">ReLoop Engine</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5 shrink-0">→</span>
                    <span>Customer still returns item</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">📷</span>
                    <span>"Take 2 photos. Get faster refund + green credits."</span>
                  </div>
                  <div className="flex items-start gap-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg p-2">
                    <span className="text-emerald-600 mt-0.5 shrink-0">🤖</span>
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">AI grades: <strong>Grade B, ₹910</strong>. Routes to buyer 2.4km away in Kolkata.</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Second row: buyer flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-4">
            <div className="hidden md:block" />
            <div className="hidden md:flex items-center justify-center">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl text-gray-300 dark:text-gray-600"
              >↓</motion.div>
            </div>
            <Reveal delay={200}>
              <div className="rounded-2xl border-2 border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/8 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Buyer on Amazon</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-500 mt-0.5 shrink-0">🔍</span>
                    <span>Searches "Allen Solly Shirt" on Amazon</span>
                  </div>
                  <div className="flex items-start gap-2 bg-sky-100 dark:bg-sky-500/20 rounded-lg p-2">
                    <span className="text-sky-600 mt-0.5 shrink-0">🏷️</span>
                    <span className="font-medium text-sky-800 dark:text-sky-300">"AI-Verified Grade B — ₹910. Seller 2.4 km away. <strong>No shipping needed.</strong>"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <span>Buys it. Item never went to warehouse. <strong>₹270 saved. 118kg CO₂ prevented.</strong></span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={300}>
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
              * This demo simulates the Amazon integration. In production, ReLoop runs as middleware inside Amazon's return and product discovery flows.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ HOW IT WORKS — 3 pillars ══════════════════════ */}
      <section className="px-4 py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">The Solution</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                ReLoop keeps the <span className="text-gradient">living twin</span> alive
              </h2>
            </div>
          </Reveal>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
            {PILLARS.map((p, i) => <PillarCard key={p.title} {...p} delay={i * 120} />)}
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════ */}
      <section
        className="relative px-4 py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)' }}
      >
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(16,185,129,0.3) 0 1px, transparent 1px 20px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-5xl mx-auto">
          <Reveal><div className="text-center mb-12"><h2 className="font-display text-3xl font-black text-white">The numbers speak</h2></div></Reveal>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-2" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <StatNum target={48500} prefix="₹" label="Logistics Cost Saved" />
            <StatNum target={4712}  suffix=" kg" label="CO₂ Prevented" />
            <StatNum target={23}    label="Returns Prevented" />
            <StatNum target={128}   label="Items Processed" />
          </motion.div>
        </div>
      </section>

      {/* ══ JOURNEY ═══════════════════════════════════════ */}
      <section className="px-4 py-24 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">The Journey</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                Purchase to <span className="text-gradient">second life</span>
              </h2>
            </div>
          </Reveal>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {JOURNEY.map(({ n, title, desc, icon, gradient }, i) => (
              <motion.div key={n} className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}>
                {i < JOURNEY.length - 1 && (
                  <motion.div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-0.5"
                    style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.4), rgba(16,185,129,0.1))' }}
                    initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.15 + 0.4 }} />
                )}
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} text-white text-2xl flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-900 mb-4 z-10`}
                  whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 400 }}
                >
                  {icon}
                </motion.div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[150px]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY RELOOP ════════════════════════════════════ */}
      <section className="px-4 py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-4">Built Different</span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Why ReLoop wins</h2>
            </div>
          </Reveal>
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { icon: Zap,   title: 'AI-First',         desc: 'Claude on Bedrock grades items from photos in seconds — no warehouse, no delay.',     bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-500' },
              { icon: Globe, title: 'Zero Waste Route',  desc: 'Items go directly from seller to next owner. One trip, maximum value.',               bg: 'bg-sky-50 dark:bg-sky-500/10',   color: 'text-sky-500' },
              { icon: Users, title: 'Trusted by Design', desc: 'SHA-256 condition fingerprint on every grade. Tamper-evident proof for every buyer.', bg: 'bg-violet-50 dark:bg-violet-500/10', color: 'text-violet-500' },
            ].map(({ icon: Icon, title, desc, bg, color }, i) => (
              <motion.div key={title} variants={staggerItem} className={`${bg} rounded-2xl p-7 cursor-default`}
                whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <motion.div className={`${color} mb-4`} whileHover={{ scale: 1.2, rotate: -5 }}><Icon size={28} /></motion.div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════ */}
      <section className="px-4 py-24 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <motion.div
              className="relative rounded-3xl p-12 sm:p-16 text-center overflow-hidden"
              style={{ background: 'linear-gradient(150deg, #030f09 0%, #022c22 50%, #041c25 100%)' }}
              whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
              <motion.div className="absolute -top-20 -right-20 w-60 h-60 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity }} />
              <motion.div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />
              <div className="relative">
                <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-6 border border-emerald-500/30"
                  animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <Leaf size={30} className="text-emerald-400" />
                </motion.div>
                <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                  See ReLoop <span className="text-gradient">in action</span>
                </h2>
                <p className="text-gray-300/80 mb-10 max-w-md mx-auto text-lg">
                  Walk through the full demo — from checkout prevention to P2P resale.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton to="/return"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-bold text-base text-white"
                    style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}>
                    Start Return Flow <ArrowRight size={18} />
                  </MagneticButton>
                  <MagneticButton to="/marketplace"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-bold text-base text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all">
                    Browse Marketplace
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}

function InlineStat({ n, prefix = '', suffix, label, textClass }) {
  const [ref, visible] = useScrollReveal(0.3)
  const [started, setStarted] = useState(false)
  useEffect(() => { if (visible) setStarted(true) }, [visible])
  const val = useCountUp(started ? n : 0, 1500)
  return (
    <div ref={ref}>
      <p className={`font-display text-3xl font-black ${textClass} mb-1 tabular-nums`}>
        {prefix}{val.toLocaleString('en-IN')}{suffix}
      </p>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
    </div>
  )
}
