import { Alert, Spinner, Badge } from "react-bootstrap";
import { useApi } from "../services/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useEffect, useState } from "react";
import MiniCard from "../components/MiniCard.jsx";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const api = useApi();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // dettagli TMDb per watchlist e visti
  const [wlMovies, setWlMovies] = useState([]);     
  const [wtMovies, setWtMovies] = useState([]);    

  const [loadingWL, setLoadingWL] = useState(false);
  const [loadingWT, setLoadingWT] = useState(false);

  useEffect(() => {
    let cancel = false;
    async function load() {
      if (!user || !token) return;
      try {
        setLoading(true);
        const p = await api.get("/api/user/profile");
        if (!cancel) {
          setProfile(p);
          setError("");
        }
      } catch {
        if (!cancel) setError("Impossibile caricare il profilo");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    load();
    return () => {
      cancel = true;
    };
  }, [user?.id, token]);

  // Helper: carica molti dettagli TMDb
  async function fetchMany(ids) {
    const unique = [...new Set(ids)].slice(0, 60); // safety cap
    const res = await Promise.all(
      unique.map((id) =>
        fetch(`/api/movies/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );
    return res.filter(Boolean);
  }

  // Quando ho il profilo, carico dettagli per watchlist e visti
  useEffect(() => {
    if (!profile) return;
    let cancel = false;

    // Watchlist
    (async () => {
      try {
        setLoadingWL(true);
        const wl = Array.isArray(profile.watchlist) ? profile.watchlist : [];
        const movies = wl.length ? await fetchMany(wl) : [];
        if (!cancel) setWlMovies(movies);
      } finally {
        if (!cancel) setLoadingWL(false);
      }
    })();

    // Visti
    (async () => {
      try {
        setLoadingWT(true);
        const wt = Array.isArray(profile.watched) ? profile.watched : [];
        const ids = wt.map((x) => x.filmId);
        const movies = ids.length ? await fetchMany(ids) : [];
        // arricchisco con rating/review/date
        const byId = new Map(wt.map((x) => [x.filmId, x]));
        const enriched = movies.map((m) => ({
          ...m,
          rating: byId.get(m.id)?.rating ?? null,
          review: byId.get(m.id)?.review ?? "",
          date: byId.get(m.id)?.date ?? null,
        }));
        if (!cancel) setWtMovies(enriched);
      } finally {
        if (!cancel) setLoadingWT(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [profile]);

  if (!user) return <Alert variant="warning">Devi effettuare il login.</Alert>;
  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="vstack gap-4">
      <div>
        <h2 className="h4 mb-1">Ciao, {profile.name}</h2>
      </div>

      {/* WATCHLIST */}
      <section>
        <h3 className="h6 d-flex align-items-center gap-2">
          La tua Watchlist <Badge bg="secondary">{profile.watchlist?.length || 0}</Badge>
        </h3>

        {loadingWL ? (
          <div className="d-flex justify-content-center py-3">
            <Spinner animation="border" />
          </div>
        ) : wlMovies.length ? (
          <div className="mini-grid">
            {wlMovies.map((m) => (
              <MiniCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <div className="text-primary">Nessun film in watchlist</div>
        )}
      </section>

      {/* VISTI */}
      <section>
        <h3 className="h6 d-flex align-items-center gap-2">
          I film che hai visto <Badge bg="secondary">{profile.watched?.length || 0}</Badge>
        </h3>

        {loadingWT ? (
          <div className="d-flex justify-content-center py-3">
            <Spinner animation="border" />
          </div>
        ) : wtMovies.length ? (
          <div className="mini-grid">
            {wtMovies.map((m) => (
              <MiniCard
                key={m.id}
                movie={m}
                footer={
                  <div className="mini-footer">
                    <span className="mini-rating">
                      {m.rating ? `★ ${m.rating}/5` : "—"}
                    </span>
                    {m.date && (
                      <span className="mini-date">
                        {new Date(m.date).toLocaleDateString("it-IT")}
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-primary">Nessun film visto</div>
        )}
      </section>
    </div>
  );
}


