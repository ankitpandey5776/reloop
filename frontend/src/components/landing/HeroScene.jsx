import { useEffect, useRef } from 'react'

/**
 * CINEMATIC CONVEYOR BELT — JavaScript animation, guaranteed to work.
 *
 * Uses requestAnimationFrame to move items pixel by pixel.
 * Items flow left → right. When they cross the center "scan zone"
 * their grade stamp appears (opacity transition). This tells the
 * ReLoop story: damaged product enters → AI scans → grade + value
 * emerges → routes to second life.
 *
 * All rendering is done on a single <canvas> element — zero DOM
 * manipulation per frame after mount, so it never blocks React.
 */

const ITEMS = [
  { label: 'Samsung\nPhone',    cat: 'electronics', grade: 'A', price: '₹62k',  route: 'P2P',     color: '#38bdf8', stamp: '#10b981' },
  { label: "Allen Solly\nShirt", cat: 'fashion',     grade: 'B', price: '₹910',  route: 'Renewed', color: '#f9a8d4', stamp: '#0ea5e9' },
  { label: 'HP Books\nBox Set', cat: 'books',        grade: 'A', price: '₹2.1k', route: 'P2P',     color: '#c4b5fd', stamp: '#10b981' },
  { label: 'Boat\nHeadphones',  cat: 'electronics',  grade: 'C', price: '₹450',  route: 'Refurb',  color: '#6ee7b7', stamp: '#8b5cf6' },
  { label: 'Prestige\nCooktop', cat: 'home',         grade: 'B', price: '₹1.7k', route: 'P2P',     color: '#fcd34d', stamp: '#10b981' },
  { label: 'Wipro\nBulbs',      cat: 'home',         grade: 'D', price: '—',     route: 'Recycle', color: '#94a3b8', stamp: '#06b6d4' },
]

// Draw a rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Draw one product card at (x, y)
function drawCard(ctx, item, x, y, W, scanned, scanProgress) {
  const S = 88  // card size
  const cx = x + S / 2
  const cy = y + S / 2

  // Card body
  ctx.save()
  roundRect(ctx, x, y, S, S, 14)
  const grad = ctx.createLinearGradient(x, y, x + S, y + S)
  grad.addColorStop(0, 'rgba(255,255,255,0.15)')
  grad.addColorStop(1, 'rgba(255,255,255,0.04)')
  ctx.fillStyle = grad
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()

  // Glow when in scan zone
  if (scanProgress > 0) {
    ctx.save()
    ctx.shadowColor = '#06b6d4'
    ctx.shadowBlur  = 28 * scanProgress
    roundRect(ctx, x, y, S, S, 14)
    ctx.strokeStyle = `rgba(6,182,212,${0.6 * scanProgress})`
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
  }

  // Product icon (category-aware simple shape)
  ctx.save()
  ctx.strokeStyle = item.color
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const cat = item.cat
  if (cat === 'electronics') {
    // Phone
    roundRect(ctx, cx - 11, cy - 18, 22, 36, 3)
    ctx.strokeStyle = item.color; ctx.stroke()
    ctx.beginPath(); ctx.arc(cx, cy + 14, 2, 0, Math.PI * 2)
    ctx.fillStyle = item.color; ctx.fill()
  } else if (cat === 'fashion') {
    // T-shirt
    ctx.beginPath()
    ctx.moveTo(cx - 12, cy - 10)
    ctx.lineTo(cx - 18, cy - 18); ctx.lineTo(cx - 8, cy - 14)
    ctx.quadraticCurveTo(cx, cy - 8, cx + 8, cy - 14)
    ctx.lineTo(cx + 18, cy - 18); ctx.lineTo(cx + 12, cy - 10)
    ctx.lineTo(cx + 12, cy + 18); ctx.lineTo(cx - 12, cy + 18)
    ctx.closePath(); ctx.stroke()
  } else if (cat === 'home') {
    // Circle appliance
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.stroke()
  } else if (cat === 'books') {
    // Book
    ctx.strokeRect(cx - 14, cy - 18, 11, 36)
    ctx.strokeRect(cx + 3, cy - 18, 11, 36)
    ctx.beginPath(); ctx.moveTo(cx - 9, cy - 8); ctx.lineTo(cx - 3, cy - 8); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx - 9, cy - 2); ctx.lineTo(cx - 3, cy - 2); ctx.stroke()
  } else {
    // Box
    ctx.beginPath()
    ctx.moveTo(cx, cy - 18); ctx.lineTo(cx + 18, cy - 8)
    ctx.lineTo(cx + 18, cy + 12); ctx.lineTo(cx, cy + 22)
    ctx.lineTo(cx - 18, cy + 12); ctx.lineTo(cx - 18, cy - 8); ctx.closePath()
    ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy - 18); ctx.lineTo(cx, cy + 2); ctx.stroke()
  }
  ctx.restore()

  // ── After scan: grade stamp + price + route ──────── //
  if (scanned) {
    const alpha = Math.min(scanProgress * 3, 1) // fade in quickly

    // Grade circle stamp
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = item.stamp
    ctx.beginPath(); ctx.arc(x + S, y, 14, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 13px "Space Grotesk", sans-serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(item.grade, x + S, y)
    ctx.restore()

    // Price tag below
    if (item.price !== '—') {
      ctx.save()
      ctx.globalAlpha = alpha * 0.9
      roundRect(ctx, x + S / 2 - 22, y + S + 2, 44, 16, 4)
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.fill()
      ctx.fillStyle = '#065f46'
      ctx.font = 'bold 9px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(item.price, x + S / 2, y + S + 10)
      ctx.restore()
    }

    // Route badge above
    ctx.save()
    ctx.globalAlpha = alpha * 0.85
    const routeW = 52, routeH = 16
    roundRect(ctx, x + S / 2 - routeW / 2, y - routeH - 4, routeW, routeH, 4)
    ctx.fillStyle = 'rgba(16,185,129,0.8)'
    ctx.fill()
    ctx.fillStyle = '#d1fae5'
    ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(`→ ${item.route}`, x + S / 2, y - routeH / 2 - 4)
    ctx.restore()
  }

  // Product name below card
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '8px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  const lines = item.label.split('\n')
  lines.forEach((line, li) => ctx.fillText(line, cx, y + S + (scanned ? 22 : 4) + li * 10))
  ctx.restore()
}

export default function HeroScene() {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // DPI-aware sizing
    const DPR = window.devicePixelRatio || 1
    let W, H

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      W = rect.width
      H = 240
      canvas.width  = W * DPR
      canvas.height = H * DPR
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.scale(DPR, DPR)
    }
    resize()
    window.addEventListener('resize', resize)

    const CARD_W = 88
    const SPACING = W / ITEMS.length       // even spread
    const SPEED   = 0.55                   // pixels per frame at 60fps
    const SCAN_X  = W / 2 - CARD_W / 2    // x position of center scan

    // Initialize items evenly pre-spread so conveyor is full immediately
    stateRef.current = ITEMS.map((item, i) => ({
      ...item,
      x: -CARD_W + (i * SPACING),   // pre-spread across width
      scanned: false,
      scanProgress: 0,
    }))

    let raf

    function frame() {
      if (!canvas) return
      ctx.clearRect(0, 0, W, H)

      const items = stateRef.current
      const Y = H / 2 - 44   // vertical center of cards

      // ── Draw belt track ─────────────────────────── //
      ctx.save()
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 12])
      ctx.beginPath(); ctx.moveTo(0, H / 2 + 48); ctx.lineTo(W, H / 2 + 48); ctx.stroke()
      ctx.setLineDash([])

      // Belt stripe (moving)
      const beltY = H / 2 + 42
      const beltH = 12
      ctx.fillStyle = 'rgba(16,185,129,0.06)'
      ctx.fillRect(0, beltY, W, beltH)
      // Animated belt texture
      const t = performance.now() / 1000
      for (let bx = (t * 40) % 24 - 24; bx < W + 24; bx += 24) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(16,185,129,0.18)'
        ctx.lineWidth = 1
        ctx.moveTo(bx, beltY); ctx.lineTo(bx + 12, beltY + beltH); ctx.stroke()
      }
      ctx.restore()

      // ── Scan beam ───────────────────────────────── //
      const scanCx = W / 2
      const beamAlpha = 0.4 + 0.3 * Math.sin(t * 4)
      const beamGrad = ctx.createLinearGradient(scanCx, 0, scanCx, H)
      beamGrad.addColorStop(0,   `rgba(6,182,212,0)`)
      beamGrad.addColorStop(0.3, `rgba(6,182,212,${beamAlpha})`)
      beamGrad.addColorStop(0.7, `rgba(6,182,212,${beamAlpha})`)
      beamGrad.addColorStop(1,   `rgba(6,182,212,0)`)
      ctx.save()
      ctx.fillStyle = beamGrad
      ctx.fillRect(scanCx - 2, 0, 4, H)

      // Scan glow
      ctx.shadowColor = '#06b6d4'; ctx.shadowBlur = 20
      ctx.fillRect(scanCx - 1, 0, 2, H)
      ctx.restore()

      // Scan label
      ctx.save()
      ctx.fillStyle = 'rgba(6,182,212,0.9)'
      ctx.font = 'bold 9px "Space Grotesk", monospace'
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
      ctx.letterSpacing = '0.15em'
      ctx.fillText('▼ AI SCAN', scanCx, 18)
      ctx.restore()

      // ── Entry / Exit labels ──────────────────────── //
      ctx.save()
      ctx.fillStyle = 'rgba(251,113,133,0.8)'
      ctx.font = 'bold 8px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('← RETURNED', 8, H / 2 - 56)

      ctx.fillStyle = 'rgba(52,211,153,0.9)'
      ctx.textAlign = 'right'
      ctx.fillText('SECOND LIFE →', W - 8, H / 2 - 56)
      ctx.restore()

      // ── Move + draw each item ────────────────────── //
      items.forEach((item) => {
        item.x += SPEED

        // Reset when it exits right side
        if (item.x > W + CARD_W + 40) {
          item.x = -CARD_W - 40
          item.scanned = false
          item.scanProgress = 0
        }

        // Detect entering scan zone
        const inScan = item.x >= SCAN_X - 10 && item.x <= SCAN_X + CARD_W + 10
        if (inScan) {
          item.scanProgress = Math.min(item.scanProgress + 0.025, 1)
          if (item.scanProgress > 0.4) item.scanned = true
        } else if (item.scanned) {
          // Keep scanned = true and full progress after leaving
          item.scanProgress = 1
        }

        drawCard(ctx, item, item.x, Y, W, item.scanned, item.scanProgress)
      })

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full select-none" style={{ userSelect: 'none' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', imageRendering: 'pixelated' }}
      />
    </div>
  )
}
