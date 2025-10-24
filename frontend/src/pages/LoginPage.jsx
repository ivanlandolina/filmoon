import "../styles/login-video.css";
import { useToast } from "../state/ToastContext.jsx";
import { useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { useAuth } from "../state/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { showToast } = useToast();
  const [showPwd, setShowPwd] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userName = await login(email, password);
      showToast(`Bentornato, ${userName.name}!`, { variant: "success" });
      navigate(from, { replace: true });
    } catch (e) {
      setError("Credenziali non valide");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      {/* Video di sfondo */}
      <video
        className="login-video"
        src="/videos/login-bg.mp4"
        poster="/login-bg.jpg"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Contenuto centrato in primo piano */}
      <div className="login-center">
        <Card className="mx-auto login-card">
          <Card.Body className="p-4 p-md-5">
            <div className="mb-4 text-center">
              <Card.Title className="card-title fs-3 mb-1">Accedi</Card.Title>
              <div className="text-white">Bentornato su Filmoon</div>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={onSubmit} noValidate>
              {/* Email */}
              <InputGroup className="mb-3">
                <span className="input-icon">
                  {/* icona email */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M20 4H4a2 2 0 0 0-2 2v12a2 
            2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 
            6 8-6v10H4z"
                    />
                  </svg>
                </span>
                <Form.Control
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>

              {/* Password con toggle mostra/nascondi */}
              <InputGroup className="mb-2">
                <span className="input-icon">
                  {/* icona lucchetto */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 
            2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-6 0V6a3 3 0 0 1 6 0v2h-6z"
                    />
                  </svg>
                </span>
                <Form.Control
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? "Nascondi" : "Mostra"}
                </Button>
              </InputGroup>

              <div className="small-links mb-4">
                <Form.Check type="checkbox" label="Ricordami" defaultChecked />
                <a href="#" className="text-decoration-none">
                  Password dimenticata?
                </a>
              </div>

              <div className="d-grid">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient"
                >
                  {loading ? "..." : "Entra"}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              Non hai un account?{" "}
              <a href="/register" className="text-decoration-none">
                Registrati
              </a>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
