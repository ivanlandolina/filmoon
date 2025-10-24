import fetch from 'node-fetch'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 60 }) // cache 60s
const TMDB_BASE = 'https://api.themoviedb.org/3'

async function tmdb(path, params = {}) {
  const url = new URL(`${TMDB_BASE}/${path}`)
  url.searchParams.set('api_key', process.env.TMDB_API_KEY)
  url.searchParams.set('language', 'it-IT')

  for (const [k, v] of Object.entries(params)) {
    if (v != null) url.searchParams.set(k, String(v))
  }

  const key = url.toString()
  const cached = cache.get(key)
  if (cached) return cached

  const res = await fetch(key)
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`TMDb error ${res.status}: ${txt || 'bad response'}`)
  }
  const data = await res.json()
  cache.set(key, data)
  return data
}

// Liste
export const tmdbPopular    = (page = 1) => tmdb('movie/popular',    { page })
export const tmdbNowPlaying = (page = 1, region) => tmdb('movie/now_playing', { page, region: 'IT' }) // carica i film al cinema in Italia
export const tmdbUpcoming   = (page = 1, region) => tmdb('movie/upcoming',    { page, region: 'IT' }) // carica i film prossimamente al cinema in Italia
export const tmdbTopRated   = (page = 1) => tmdb('movie/top_rated',  { page })
export const tmdbRecommendations = (id, page = 1) => tmdb(`movie/${id}/recommendations`, { page })

// Ricerca
export const tmdbSearchMovies = (query, page = 1) =>
  tmdb('search/movie', { query, page, include_adult: false })

// Dettagli film
export const tmdbDetails  = (id) => tmdb(`movie/${id}`)
// Trailer del film e crediti
export const tmdbVideos   = (id) => tmdb(`movie/${id}/videos`)
export const tmdbCredits  = (id) => tmdb(`movie/${id}/credits`)

export default tmdb
