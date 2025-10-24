import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useAuth } from "../state/AuthContext.jsx";
import { useToast } from "../state/ToastContext.jsx";
import "../styles/register-video.css";

export default function RegisterPage() {
  const { register, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Compila tutti i campi.");
      return;
    }

    setLoading(true);
    try {
      // Registra l'utente
      await register(name.trim(), email.trim(), password);

      // Effettua automaticamente il login
      await login(email.trim(), password);

      // Mostra un messaggio e reindirizza
      showToast(`Benvenuto su Filmoon, ${name}!`, { variant: "success" });
      navigate("/profile"); // oppure "/" se vuoi portarlo alla home
    } catch (err) {
      console.error("Errore registrazione/login:", err);
      setError("Registrazione non riuscita. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      {/* Video di sfondo */}
      <video autoPlay loop muted playsInline className="register-bg-video">
        <source src="/videos/register-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay scuro sopra il video */}
      <div className="register-overlay" />

      {/* Contenuto del form */}
      <div className="register-content d-flex align-items-center vh-100">
        <div className="register-form-wrapper">
          <Card className="register-card text-light p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4 logo-text">Registrati</h2>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  disabled={loading}
                  type="submit"
                  className="w-100 btn-nav-glow btn-nav-filled"
                >
                  {loading ? "Registrazione..." : "Crea account"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                Hai già un account?{" "}
                <Link to="/login" className="text-info text-decoration-none">
                  Accedi
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
