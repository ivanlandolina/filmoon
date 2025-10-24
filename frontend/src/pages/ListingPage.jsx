import { useEffect, useRef, useState } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import MovieCard from '../components/MovieCard.jsx'
import '../styles/movie-card.css'

const TITLES = {
  popular: 'Popolari',
  now_playing: 'Al cinema',
  upcoming: 'Prossime uscite',
  top_rated: 'Più votati',
}

export default function ListingPage({ kind = 'popular' }) {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef(null)

  // reset quando cambia categoria
  useEffect(() => {
    setPage(1); setItems([]); setHasMore(true); setError(''); setLoading(true)
  }, [kind])

  useEffect(() => {
    let cancel = false
    setLoading(true)
    fetch(`/api/movies/${kind}?page=${page}`)
      .then(r => r.ok ? r.json() : r.text().then(Promise.reject))
      .then(json => {
        if (cancel) return
        setItems(prev => [...prev, ...json.results])
        setHasMore(page < (json.total_pages || 1))
        setError('')
      })
      .catch(() => setError('Errore nel caricamento'))
      .finally(() => !cancel && setLoading(false))
    return () => { cancel = true }
  }, [kind, page])

  // scroll infinito
  useEffect(() => {
    if (!hasMore || loading) return
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setPage(p => p + 1)
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, loading])

  return (
    <div>
      <h1 className="h4 mb-3">{TITLES[kind]}</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="row g-4">
        {items.map(m => (
          <div className="col-4 col-sm-4 col-md-3 col-lg-2" key={`${kind}-${m.id}`}>
            <MovieCard
              movie={m}
            />
          </div>
        ))}
      </div>

      {/* sentinella per scroll infinito */}
      <div ref={sentinelRef} />

      {loading && (
        <div className="d-flex justify-content-center py-4">
          <Spinner animation="border" />
        </div>
      )}
      {!hasMore && !loading && items.length > 0 && (
        <div className="text-center text-muted py-3">Fine risultati</div>
      )}
    </div>
  )
}
