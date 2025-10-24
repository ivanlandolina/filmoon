import { Link } from "react-router-dom";
import "../styles/movie-card.css";
import { posterUrl } from "../lib/img.js";

export default function MovieCard({ movie, onAddWatchlist }) {
  const year = movie.release_date?.slice(0, 4);
  return (
    <div className="movie-card">
      <div className="mc-frame">
        <div className="poster-wrap">
          <img
            className="poster"
            src={posterUrl(movie.poster_path)}
            alt={movie.title}
          />
          <div className="overlay" />
        </div>
        <div className="meta">
          <span className="rating">
            {movie.vote_average?.toFixed(1) ?? "—"}
          </span>
          <span className="year">{year}</span>
        </div>
        <div className="title">
          <Link
            to={`/movie/${movie.id}`}
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            {movie.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
