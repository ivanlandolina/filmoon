import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Spinner, Alert } from 'react-bootstrap'
import MovieCard from '../components/MovieCard.jsx'

export default function SearchPage(){
  const [sp] = useSearchParams()
  const q = sp.get('q') || ''
  const [data, setData] = useState({ results: [] })
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(()=>{
    if(!q) { setData({results:[]}); setLoading(false); return }
    setLoading(true)
    fetch(`/api/movies/search?query=${encodeURIComponent(q)}`)
      .then(r=> r.ok ? r.json() : r.text().then(Promise.reject))
      .then(json=> { setData(json); setErr('') })
      .catch(()=> setErr('Errore nella ricerca'))
      .finally(()=> setLoading(false))
  }, [q])

  if (loading) return <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
  if (err) return <Alert variant="danger">{err}</Alert>

  return (
    <div>
      <h1 className="h6 mb-3">Risultati per: “{q}”</h1>
      {data.results.length === 0 && <div className="text-muted">Nessun risultato</div>}
      <div className="row g-4">
        {data.results.map(m => (
          <div className="col-4 col-sm-4 col-md-3 col-lg-2" key={m.id}>
            <MovieCard
              movie={m}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
