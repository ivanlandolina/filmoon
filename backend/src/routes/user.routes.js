import { Router } from 'express';
import { z } from 'zod';
import User from '../models/User.js';
import { requireAuth  } from '../middleware/auth.js';

const router = Router();

// GET /api/user/profile -> Restituisce i dati dell'utente
router.get('/profile', requireAuth , async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    const { _id, name, email, watchlist, watched } = user;
    res.json({ id: _id, name, email, watchlist, watched });
  } catch (e) { next(e); }
});

// GET /api/user/watched/:filmId -> Verifica se il film è tra i "visti" e, se sì, ritorna i dati associati (rating, review e data).
router.get('/watched/:filmId', requireAuth , async (req, res, next) => {
  try {
    const filmId = Number(req.params.filmId);
    if (Number.isNaN(filmId)) return res.status(400).json({ error: 'Invalid filmId' });

    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const item = (user.watched || []).find(w => w.filmId === filmId);
    if (!item) return res.status(404).json({ exists: false });

    res.json({
      exists: true,
      filmId: item.filmId,
      rating: item.rating ?? null,
      review: item.review ?? '',
      watchedAt: item.watchedAt
    });
  } catch (e) { next(e); }
});

// GET /api/user/watchlist/:filmId -> Risponde solo se un film è presente nella watchlist.
router.get('/watchlist/:filmId', requireAuth, async (req, res, next) => {
  try {
    const filmId = Number(req.params.filmId)
    const user = await User.findById(req.user.id).lean()
    const exists = Array.isArray(user?.watchlist) && user.watchlist.includes(filmId)
    res.json({ exists })
  } catch (e) { next(e) }
})

// POST /api/user/watchlist -> Aggiunge un film in watchlist
router.post('/watchlist', requireAuth , async (req, res, next) => {
  try {
    const { filmId } = watchlistSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { watchlist: filmId } }, //evita le duplicazioni
      { new: true }
    );
    res.json({ watchlist: user.watchlist });
  } catch (e) { next(e); }
});

//DELETE /api/user/watchlist/:filmId -> Rimuove un film dalla watchlist
router.delete('/watchlist/:filmId', requireAuth , async (req, res, next) => {
  try {
    const filmId = Number(req.params.filmId);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { watchlist: filmId } },
      { new: true }
    );
    res.json({ watchlist: user.watchlist });
  } catch (e) { next(e); }
});

// DELETE /api/user/watched/:filmId -> rimuove il film dai "visti"
router.delete('/watched/:filmId', requireAuth, async (req, res, next) => {
  try {
    const filmId = Number(req.params.filmId);
    if (Number.isNaN(filmId)) return res.status(400).json({ error: 'Invalid filmId' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    user.watched = (user.watched || []).filter(w => w.filmId !== filmId);
    await user.save();

    return res.status(204).end(); // nessun contenuto
  } catch (e) { next(e); }
});


const watchlistSchema = z.object({ filmId: z.coerce.number() });

// Schema per film visto
const watchedSchema = z.object({
  filmId: z.coerce.number(), // filmId obbligatorio
  rating: z.coerce.number().min(0).max(5).optional(), // rating opzionale, da 0 a 5 
  review: z.string().max(2000).optional() // review opzionale, massimo 2000 caratteri
});

// POST /api/user/watched -> Crea/aggiorna lo stato "visto" per un film:
// - se è già presente: aggiorna rating, review e watchedAt
// - se non è presente: lo aggiunge e lo rimuove dalla watchlist 
router.post('/watched', requireAuth , async (req, res, next) => {
  try {
    const { filmId, rating, review } = watchedSchema.parse(req.body);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const idx = (user.watched || []).findIndex(w => w.filmId === filmId);

    if (idx >= 0) {
      // aggiorna parzialmente l'item esistente
      if (typeof rating === 'number') user.watched[idx].rating = rating;
      if (typeof review === 'string') user.watched[idx].review = review.trim();
      user.watched[idx].watchedAt = new Date();
    } else {
      // crea nuovo record (rating/review opzionali)
      const item = { filmId, watchedAt: new Date() };
      if (typeof rating === 'number') item.rating = rating;
      if (typeof review === 'string') item.review = review.trim();
      user.watched.push(item);

      // se il film era nella watchlist, lo rimuove
      if (Array.isArray(user.watchlist)) {
        user.watchlist = user.watchlist.filter(id => id !== filmId);
      }
    }

    await user.save();
    res.json({ ok: true, watched: user.watched });
  } catch (e) { next(e); }
});

export default router;