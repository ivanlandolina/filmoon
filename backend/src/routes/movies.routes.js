import { Router } from 'express'
import {
  tmdbPopular,
  tmdbDetails,
  tmdbNowPlaying,
  tmdbUpcoming,
  tmdbTopRated,
  tmdbSearchMovies,
  tmdbVideos,
  tmdbCredits,
  tmdbRecommendations 
} from '../lib/tmdb.js'

const router = Router()

// Lista film popolari
router.get('/popular', async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1)
    const data = await tmdbPopular(page)
    res.json(data)
  } catch (e) { next(e) }
})

// Lista film al cinema adesso
router.get('/now_playing', async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1)
    const region = req.query.region 
    const data = await tmdbNowPlaying(page, region)
    res.json(data)
  } catch (e) { next(e) }
})

// Lista film in arrivo al cinema prossimamente
router.get('/upcoming', async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1)
    const region = req.query.region
    const data = await tmdbUpcoming(page, region)
    res.json(data)
  } catch (e) { next(e) }
})

// Lista migliori film
router.get('/top_rated', async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1)
    const data = await tmdbTopRated(page)
    res.json(data)
  } catch (e) { next(e) }
})

// Ricerca
router.get('/search', async (req, res, next) => {
  try {
    const { query = '', page = 1 } = req.query
    if (!String(query).trim()) {
      return res.json({ page: 1, results: [], total_pages: 0, total_results: 0 })
    }
    const data = await tmdbSearchMovies(query, Number(page))
    res.json(data)
  } catch (e) { next(e) }
})

// Dettaglio + extra
router.get('/:id', async (req, res, next) => {
  try {
    const data = await tmdbDetails(req.params.id)
    res.json(data)
  } catch (e) { next(e) }
})

// Trailer del film
router.get('/:id/videos', async (req, res, next) => {
  try {
    const data = await tmdbVideos(req.params.id)
    res.json(data)
  } catch (e) { next(e) }
})

// Crediti 
router.get('/:id/credits', async (req, res, next) => {
  try {
    const data = await tmdbCredits(req.params.id)
    res.json(data)
  } catch (e) { next(e) }
})

// Film raccomandati 
router.get('/:id/recommendations', async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1)
    const data = await tmdbRecommendations(req.params.id, page)
    res.json(data)
  } catch (e) { next(e) }
})

export default router
