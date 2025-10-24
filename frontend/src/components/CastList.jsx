import { Card } from "react-bootstrap";

export default function CastList({ cast = [], max = 16 }) {
  if (!Array.isArray(cast) || cast.length === 0) {
    return <div className="text-muted">Cast non disponibile</div>;
  }
  return (
    <div
      className="d-flex gap-3 overflow-auto pb-2"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {cast.slice(0, max).map((person) => (
        <Card
          key={person.id}
          className="bg-transparent border-0"
          style={{ minWidth: 140, scrollSnapAlign: "start" }}
        >
          <div
            className="rounded overflow-hidden"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "2 / 3",
              background: "#0b0e11",
            }}
          >
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                alt={person.name}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center text-warning"
                style={{ width: "100%", height: "100%" }}
              >
                N/A
              </div>
            )}
          </div>

          <Card.Body className="px-0">
            <div className="fw-semibold small">{person.name}</div>
            <div className="text-primary small">{person.character}</div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
