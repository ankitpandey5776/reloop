import { useState, useEffect } from 'react'
import { getTwin } from '../api/client.js'

export function useTwin(twinId) {
  const [twin, setTwin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!twinId) return
    setLoading(true)
    getTwin(twinId)
      .then(setTwin)
      .catch(e => setError(e.message || 'Failed to load twin'))
      .finally(() => setLoading(false))
  }, [twinId])

  return { twin, loading, error }
}
