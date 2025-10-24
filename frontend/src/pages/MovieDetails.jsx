import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Badge,
  Ratio,
} from "react-bootstrap";
import { useAuth } from "../state/AuthContext.jsx";
import { useApi } from "../services/api.js";
import { apiFetch } from '../services/http.js'
import { posterUrl } from "../lib/img.js";
import { useToast } from "../state/ToastContext.jsx";
import RatingBox from "../components/RatingBox.jsx";
import CastList from "../components/CastList.jsx";
import SimilarFilms from "../components/SimilarFilms.jsx";


export default function MovieDetails() {
  const { id } = useParams();
  const api = useApi();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [saving, setSaving] = useState(false);

  const [isWatched, setIsWatched] = useState(false);
  const [loadingUserRating, setLoadingUserRating] = useState(false);

  const [inWatchlist, setInWatchlist] = useState(false);

  // Caricamento dati film + extra
  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [m, v, c] = await Promise.all([
          apiFetch(`/api/movies/${id}`).then((r) => r.json()),
          apiFetch(`/api/movies/${id}/videos`).then((r) => r.json()),
          apiFetch(`/api/movies/${id}/credits`).then((r) => r.json()),
        ]);
        if (cancel) return;
        setMovie(m);
        setVideos(v?.results || []);
        setCredits({ cast: c?.cast || [], crew: c?.crew || [] });

        // raccomandati
        apiFetch(`/api/movies/${id}/recommendations`)
          .then((r) => (r.ok ? r.json() : Promise.resolve({ results: [] })))
          .then((json) => !cancel && setRecs(json.results || []))
          .catch(() => {});
      } catch (e) {
        if (!cancel) setError("Errore nel caricamento");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    load();
    return () => {
      cancel = true;
    };
  }, [id]);

  // Carica rating/recensione dell’utente (se loggato)
  useEffect(() => {
    let cancel = false;

    async function loadUserRating() {
      if (!user) return;
      try {
        setLoadingUserRating(true);

        // prova endpoint dedicato /watched/:id
        let found = false;
        try {
          const data = await api.get(`/api/user/watched/${id}`);
          if (!cancel && data?.exists) {
            setMyRating(Number(data.rating || 0));
            setMyReview(String(data.review || ""));
            setIsWatched(true);
            found = true;
          }
        } catch {
          // 404/401/endpoint assente → ignora
        }
        if (found) return;

        // fallback: profilo completo
        try {
          const profile = await api.get("/api/user/profile");
          if (cancel) return;
          const item = (profile?.watched || []).find(
            (w) => Number(w.filmId) === Number(id)
          );
          if (item) {
            setMyRating(Number(item.rating || 0));
            setMyReview(String(item.review || ""));
            setIsWatched(true);
          } else {
            setMyRating(0);
            setMyReview("");
            setIsWatched(false);
          }
        } catch {
          // ignora errori di profilo
        }
      } finally {
        if (!cancel) setLoadingUserRating(false);
      }
    }

    loadUserRating();
    return () => {
      cancel = true;
    };
  }, [id, user?.id]);

  // verifica se il film è in watchlist
  useEffect(() => {
    let cancel = false;

    async function checkWatchlist() {
      if (!user) return;
      try {
        const res = await api.get(`/api/user/watchlist/${id}`);
        if (!cancel) setInWatchlist(Boolean(res?.exists));
      } catch {
        if (!cancel) setInWatchlist(false);
      }
    }

    checkWatchlist();
    return () => {
      cancel = true;
    };
  }, [id, user?.id]);

  const trailerKey = useMemo(() => {
    if (!videos?.length) return null;
    const official = videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    );
    const anyTrailer = videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );
    return (official || anyTrailer)?.key || null;
  }, [videos]);

  const directors = useMemo(
    () => credits.crew.filter((p) => p.job === "Director").map((p) => p.name),
    [credits.crew]
  );

  // Toggle watchlist
  async function toggleWatchlist() {
    try {
      if (!inWatchlist) {
        await api.post("/api/user/watchlist", { filmId: Number(id) });
        showToast(`"${movie.title}" aggiunto alla watchlist`, {
          variant: "success",
        });
        setInWatchlist(true);
      } else {
        await api.delete(`/api/user/watchlist/${id}`);
        showToast(`"${movie.title}" rimosso dalla watchlist`, {
          variant: "info",
        });
        setInWatchlist(false);
      }
    } catch (err) {
      console.error("Errore toggle watchlist:", err);
      showToast("Errore durante l'operazione", { variant: "danger" });
    }
  }

  // Toggle visto
  async function toggleWatched() {
    try {
      setSaving(true);
      if (!isWatched) {
        await api.post("/api/user/watched", {
          filmId: Number(id),
          review: myReview.trim() || undefined,
          ...(myRating > 0 ? { rating: myRating } : {}),
        });
        setIsWatched(true);
        setInWatchlist(false);
        showToast(`"${movie.title}" segnato come visto`, {
          variant: "success",
        });
      } else {
        await api.delete(`/api/user/watched/${id}`);
        setIsWatched(false);
        setMyRating(0);
        setMyReview("");
        showToast(`"${movie.title}" rimosso dai visti`, { variant: "success" });
      }
    } catch (e) {
      console.error("toggleWatched failed:", e);
      showToast("Operazione non riuscita", { variant: "danger" });
    } finally {
      setSaving(false);
    }
  }

  // Salva/aggiorna valutazione
  async function saveMyRating() {
    try {
      setSaving(true);
      await api.post("/api/user/watched", {
        filmId: Number(id),
        ...(myRating > 0 ? { rating: myRating } : {}),
        review: myReview.trim() || undefined,
      });
      const wasWatched = isWatched;
      setIsWatched(true);
      if (!wasWatched) setInWatchlist(false); // se prima non era visto, ora sì quindi viene tolto dalla watchlist
      showToast(
        wasWatched
          ? myRating > 0
            ? "Valutazione aggiornata"
            : "Aggiornato"
          : myRating > 0
          ? "Valutazione salvata e segnato come visto"
          : "Segnato come visto",
        { variant: "success" }
      );
    } catch {
      showToast("Errore nel salvataggio", { variant: "danger" });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!movie) return null;

  return (
    <div className="vstack gap-4">
      {/* intestazione */}
      <Row className="g-4">
        <Col md={4} lg={3}>
          <img
            src={posterUrl(movie.poster_path, "w500")}
            alt={movie.title}
            className="img-fluid rounded"
          />
          {user && (
            <>
              <div className="d-grid gap-2 mt-3">
                {/* Watchlist (toggle) */}
                <Button
                  className={`btn-md btn-nav-glow ${
                    inWatchlist ? "watchlist-active" : ""
                  }`}
                  onClick={toggleWatchlist}
                  disabled={saving}
                >
                  {inWatchlist ? "✓ In Watchlist" : "+ Aggiungi alla Watchlist"}
                </Button>

                {/* Visto (toggle) */}
                <Button
                  className={`btn-md btn-nav-glow ${isWatched ? "active" : ""}`}
                  onClick={toggleWatched}
                  disabled={saving}
                >
                  {isWatched ? "✓ Visto" : "Segna come visto"}
                </Button>
              </div>

              <RatingBox
                rating={myRating}
                review={myReview}
                loading={loadingUserRating}
                saving={saving}
                onChangeRating={setMyRating}
                onChangeReview={setMyReview}
                onSave={saveMyRating}
                onClear={() => {
                  setMyRating(0);
                  setMyReview("");
                }}
              />
            </>
          )}
        </Col>
        <Col md={8} lg={9}>
          <h1 className="h3 mb-1">
            {movie.title}{" "}
            {movie.release_date && (
              <Badge bg="secondary">{movie.release_date.slice(0, 4)}</Badge>
            )}
          </h1>
          <div className="mb-2">
            {directors.length > 0 && (
              <>
                di <strong>{directors.join(", ")}</strong> •{" "}
              </>
            )}
            {movie.runtime ? `${movie.runtime} min • ` : ""}⭐{" "}
            {movie.vote_average?.toFixed(1)} (
            {movie.vote_count?.toLocaleString("it-IT")})
          </div>
          <div className="mb-2">
            {movie.genres?.map((g) => (
              <Badge key={g.id} bg="dark" className="me-2">
                {g.name}
              </Badge>
            ))}
          </div>
          <p style={{ maxWidth: "70ch" }}>{movie.overview}</p>

          {/* trailer */}
          {trailerKey && (
            <div className="mt-4">
              <h2 className="h5 mb-3">Trailer</h2>
              <Ratio aspectRatio="16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </Ratio>
            </div>
          )}
        </Col>
      </Row>

      {/* cast */}
      <section>
        <h2 className="h5 mb-3">Cast principale</h2>
        <CastList cast={credits.cast} max={16} />
      </section>

      {/* film simili */}
      <section>
        <h2 className="h5 mb-3">Film simili</h2>
        <SimilarFilms
          movies={recs}
        />
      </section>
    </div>
  );
}
