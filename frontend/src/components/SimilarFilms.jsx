import MovieCard from "./MovieCard.jsx";

export default function SimilarFilms({ movies = [] }) {
  if (!Array.isArray(movies) || movies.length === 0) {
    return <div className="text-muted">Nessun suggerimento disponibile</div>;
  }

  return (
    <div className="row g-4">
      {movies.slice(0, 12).map((m) => (
        <div className="col-4 col-sm-4 col-md-3 col-lg-2" key={m.id}>
          <MovieCard movie={m} />
        </div>
      ))}
    </div>
  );
}
