import axios from 'axios'
import {
  MOCK_TWINS, MOCK_DASHBOARD_STATS, MOCK_RISK_RESPONSE, MOCK_CREDITS
} from '../mocks/twins.js'

const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE })

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

let mockTwins = [...MOCK_TWINS]

function findTwin(twin_id) {
  return mockTwins.find(t => t.twin_id === twin_id) || null
}

// --- Prevention ---
export async function checkRisk(items, customerId) {
  if (MOCK_MODE) {
    await delay()
    const hasMultipleSizes = items.some(i => i.quantity >= 3 || i.category === 'fashion')
    if (hasMultipleSizes) return MOCK_RISK_RESPONSE
    return { risk_score: 0.35, risk_factors: [], nudge_type: 'none', nudge_message: '' }
  }
  const { data } = await api.post('/api/v1/prevention/check-risk', { items, customer_id: customerId })
  return data
}

// --- Twin CRUD ---
export async function createTwin(item, customer) {
  if (MOCK_MODE) {
    await delay()
    const twin = {
      twin_id: `twin-${Date.now()}`,
      item, customer,
      state: 'ACTIVE',
      prevention: { risk_score: 0, risk_factors: [], nudge_shown: false, nudge_type: 'none', prevented: false },
      grading: null, valuation: null, routing: null,
      credits: { earned: 0, action: null, lifetime_credits: 0 },
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
    mockTwins.unshift(twin)
    return twin
  }
  const { data } = await api.post('/api/v1/twins/', { item, customer })
  return data
}

export async function getTwin(twinId) {
  if (MOCK_MODE) {
    await delay(300)
    return findTwin(twinId)
  }
  const { data } = await api.get(`/api/v1/twins/${twinId}`)
  return data
}

export async function getTwins(params = {}) {
  if (MOCK_MODE) {
    await delay(400)
    let twins = [...mockTwins]
    if (params.state) twins = twins.filter(t => t.state === params.state)
    const page = params.page || 1
    const limit = params.limit || 20
    const start = (page - 1) * limit
    return { twins: twins.slice(start, start + limit), total: twins.length, page }
  }
  const { data } = await api.get('/api/v1/twins/', { params })
  return Array.isArray(data) ? { twins: data } : data
}

export async function updateTwinState(twinId, state) {
  if (MOCK_MODE) {
    await delay(400)
    const twin = findTwin(twinId)
    if (twin) { twin.state = state; twin.updated_at = new Date().toISOString() }
    return twin
  }
  const { data } = await api.patch(`/api/v1/twins/${twinId}/state`, { state })
  return data
}

// --- Grading ---
export async function gradeItem(twinId, photos) {
  if (MOCK_MODE) {
    await delay(2500)
    const twin = findTwin(twinId)
    const grades = ['A', 'B', 'C']
    const grade = grades[Math.floor(Math.random() * grades.length)]
    const gradeData = {
      grade,
      confidence: 0.85 + Math.random() * 0.12,
      defects: grade === 'A' ? [] : [{ type: 'scratch', location: 'Surface area', severity: grade === 'B' ? 'minor' : 'moderate' }],
      photo_urls: [],
      condition_report: grade === 'A'
        ? 'Item is in excellent condition with no visible defects. All components functional. Ready for immediate resale.'
        : grade === 'B'
        ? 'Item shows minor signs of use but remains in good condition. No structural damage. Suitable for resale with minor cosmetic notes.'
        : 'Item shows moderate wear and some cosmetic damage. Functional but may benefit from light refurbishment before resale.',
      graded_at: new Date().toISOString()
    }
    const multiplier = grade === 'A' ? 0.78 : grade === 'B' ? 0.62 : 0.44
    const valuation = {
      resale_price: Math.round((twin?.item?.original_price || 1000) * multiplier),
      price_multiplier: multiplier,
      demand_factor: 0.9 + Math.random() * 0.3
    }
    if (twin) {
      twin.grading = gradeData
      twin.valuation = valuation
      twin.state = 'GRADED'
      twin.updated_at = new Date().toISOString()
    }
    return { twin_id: twinId, grading: gradeData, valuation }
  }
  const formData = new FormData()
  formData.append('twin_id', twinId)
  photos.forEach(p => formData.append('photos', p))
  const { data } = await api.post('/api/v1/grading/grade', formData)
  return data
}

// --- Routing ---
export async function routeItem(twinId) {
  if (MOCK_MODE) {
    await delay(1800)
    const twin = findTwin(twinId)
    const grade = twin?.grading?.grade || 'B'
    const decisions = {
      A: 'RESELL_P2P', B: 'RESELL_P2P', C: 'REFURBISH', D: 'RECYCLE'
    }
    const decision = decisions[grade]
    const destinations = {
      RESELL_P2P: { type: 'buyer', name: 'Local P2P Buyer', pincode: '400002' },
      RESELL_RENEWED: { type: 'fulfillment_center', name: 'Amazon Renewed Hub', pincode: '560010' },
      REFURBISH: { type: 'refurbisher', name: 'TechCare Refurbishers', pincode: '110020' },
      DONATE: { type: 'ngo', name: 'Goonj Foundation', pincode: '700010' },
      RECYCLE: { type: 'recycler', name: 'EcoRecycle Partners', pincode: '711105' }
    }
    const savings = {
      cost_saved: Math.round(100 + Math.random() * 400),
      co2_saved_kg: parseFloat((0.5 + Math.random() * 2).toFixed(1)),
      km_avoided: Math.round(200 + Math.random() * 700)
    }
    const routingData = {
      decision,
      reasoning: `Grade ${grade} condition and local demand analysis indicates ${decision === 'RESELL_P2P' ? 'direct P2P sale will maximise value recovery' : 'this route provides the best balance of value and sustainability'}.`,
      destination: destinations[decision],
      savings,
      routed_at: new Date().toISOString()
    }
    const credits = { earned: 50, action: 'p2p_local_handoff', lifetime_credits: (twin?.credits?.lifetime_credits || 0) + 50 }
    if (twin) {
      twin.routing = routingData
      twin.credits = credits
      twin.state = 'ROUTED'
      twin.updated_at = new Date().toISOString()
    }
    return { twin_id: twinId, routing: routingData, credits }
  }
  const { data } = await api.post('/api/v1/routing/route', { twin_id: twinId })
  return data
}

// --- Marketplace ---
export async function getListings(params = {}) {
  if (MOCK_MODE) {
    await delay(400)
    let listings = mockTwins.filter(t => t.state === 'LISTED')
    if (params.category && params.category !== 'all') listings = listings.filter(t => t.item.category === params.category)
    if (params.grade && params.grade !== 'all') listings = listings.filter(t => t.grading?.grade === params.grade)
    if (params.search) {
      const q = params.search.toLowerCase()
      listings = listings.filter(t => t.item.title.toLowerCase().includes(q))
    }
    const page = params.page || 1
    const limit = params.limit || 20
    const start = (page - 1) * limit
    return { listings: listings.slice(start, start + limit), total: listings.length, page }
  }
  const { data } = await api.get('/api/v1/marketplace/listings', { params })
  return data
}

export async function getListing(twinId) {
  if (MOCK_MODE) {
    await delay(300)
    return findTwin(twinId)
  }
  const { data } = await api.get(`/api/v1/marketplace/listings/${twinId}`)
  return data
}

export async function listItem(twinId) {
  if (MOCK_MODE) {
    await delay(500)
    const twin = findTwin(twinId)
    if (twin) { twin.state = 'LISTED'; twin.updated_at = new Date().toISOString() }
    return twin
  }
  const { data } = await api.post('/api/v1/marketplace/list', { twin_id: twinId })
  return data
}

export async function buyItem(twinId, buyerId) {
  if (MOCK_MODE) {
    await delay(500)
    const twin = findTwin(twinId)
    if (twin) { twin.state = 'SOLD'; twin.updated_at = new Date().toISOString() }
    return twin
  }
  const { data } = await api.post('/api/v1/marketplace/buy', { twin_id: twinId, buyer_id: buyerId })
  return data
}

// --- Dashboard ---
export async function getDashboardStats() {
  if (MOCK_MODE) {
    await delay(500)
    return MOCK_DASHBOARD_STATS
  }
  const { data } = await api.get('/api/v1/dashboard/stats')
  return data
}

export async function getRecentTwins(limit = 10) {
  if (MOCK_MODE) {
    await delay(300)
    const sorted = [...mockTwins].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    return { twins: sorted.slice(0, limit) }
  }
  const { data } = await api.get('/api/v1/dashboard/recent-twins', { params: { limit } })
  return data
}

// --- Grading status polling ---
export async function getGradingStatus(twinId) {
  if (MOCK_MODE) {
    await delay(300)
    const twin = findTwin(twinId)
    const ready = twin?.state && ['GRADED','ROUTED','LISTED','SOLD','DONATED','RECYCLED'].includes(twin.state)
    return {
      twin_id: twinId,
      state: twin?.state || 'ACTIVE',
      ready,
      pending: !ready,
      rejected: twin?.grading?.grade === 'F',
      grading: twin?.grading || null,
      valuation: twin?.valuation || null,
      condition_hash: twin?.grading?.condition_hash || null,
    }
  }
  const { data } = await api.get(`/api/v1/grading/status/${twinId}`)
  return data
}

// --- Marketplace recommendations ---
export async function getRecommendations(customerId, limit = 6) {
  if (MOCK_MODE) {
    await delay(400)
    const listed = mockTwins.filter(t => t.state === 'LISTED').slice(0, limit)
    return { customer_id: customerId, preferred_categories: ['electronics'], recommendations: listed, total: listed.length }
  }
  const { data } = await api.get('/api/v1/marketplace/recommendations', { params: { customer_id: customerId, limit } })
  return data
}

// --- Record prevention outcome ---
export async function recordPrevention(twinId, riskScore, riskFactors, nudgeShown, nudgeType, prevented) {
  if (MOCK_MODE) {
    await delay(300)
    const twin = findTwin(twinId)
    if (twin) {
      twin.prevention = { risk_score: riskScore, risk_factors: riskFactors, nudge_shown: nudgeShown, nudge_type: nudgeType, prevented }
      twin.updated_at = new Date().toISOString()
    }
    return { twin_id: twinId, prevented, message: prevented ? 'Return prevented!' : 'Prevention outcome recorded.' }
  }
  const { data } = await api.post('/api/v1/prevention/record', {
    twin_id: twinId,
    risk_score: riskScore,
    risk_factors: riskFactors,
    nudge_shown: nudgeShown,
    nudge_type: nudgeType,
    prevented,
  })
  return data
}

// --- Credits ---
export async function getCredits(customerId) {
  if (MOCK_MODE) {
    await delay(300)
    return MOCK_CREDITS
  }
  const { data } = await api.get(`/api/v1/credits/${customerId}`)
  return data
}
