import { useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import StarRating from "./StarRating.jsx";

export default function RatingBox({
  rating = 0,
  review = "",
  loading = false,
  saving = false,
  onChangeRating,
  onChangeReview,
  onSave,
  onClear,
}) {
  const canSave = useMemo(
    () => !saving && (rating > 0 || review.trim().length > 0),
    [saving, rating, review]
  );

  return (
    <div className="rating-box mt-4">
      <h3 className="h6 mb-2">La tua valutazione</h3>

      <div className="d-flex align-items-center gap-3 mb-3">
        <StarRating value={rating} onChange={onChangeRating} />
        <span className="small">
          {loading ? "Caricamento…" : rating ? `${rating} / 5` : "Nessun voto"}
        </span>
      </div>

      <Form.Group className="mb-3">
        <Form.Label className="small">Recensione (opzionale)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={review}
          onChange={(e) => onChangeReview(e.target.value)}
          placeholder="Che ne pensi?"
          disabled={loading || saving}
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button className="btn-nav-filled" disabled={!canSave} onClick={onSave}>
          {saving ? "Salvo…" : "Salva valutazione"}
        </Button>
        <Button
          className="btn-nav-glow"
          disabled={saving || (rating === 0 && !review)}
          onClick={onClear}
        >
          Cancella
        </Button>
      </div>
    </div>
  );
}
