import { Link } from "react-router-dom";
import { posterUrl } from "../lib/img.js";

export default function MiniCard({ movie, footer }) {
  return (
    <div className="mini-card">
      <Link to={`/movie/${movie.id}`} className="mini-thumb">
        {movie.poster_path ? (
          <img
            src={posterUrl(movie.poster_path, "w185")}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="mini-noimg">N/A</div>
        )}
      </Link>
      <div className="mini-info">
        <Link to={`/movie/${movie.id}`} className="mini-title">
          {movie.title}
        </Link>
        <div className="mini-meta">
          {movie.release_date?.slice(0, 4) || "—"}
        </div>
        {footer}
      </div>
    </div>
  );
}