import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navbar, Nav, Container, Form, InputGroup, Button } from "react-bootstrap";
import { useAuth } from "../state/AuthContext.jsx";
import LogoutModal from "./LogoutModal.jsx";

export default function NavbarMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();

  function onSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
  }

  function confirmLogout() {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  }

  return (
    <>
      <Navbar expand="md" className="navbar-transparent">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo-text">
            FILMOON
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-item-text">
                Popolari
              </Nav.Link>
              <Nav.Link as={Link} to="/now-playing" className="nav-item-text">
                Al cinema
              </Nav.Link>
              <Nav.Link as={Link} to="/upcoming" className="nav-item-text">
                Prossime uscite
              </Nav.Link>
              <Nav.Link as={Link} to="/top-rated" className="nav-item-text">
                Più votati
              </Nav.Link>
            </Nav>

            <Form className="me-3" onSubmit={onSearchSubmit}>
              <InputGroup>
                <Form.Control
                  size="sm"
                  type="search"
                  placeholder="Cerca film..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Cerca film"
                />
                <Button size="sm" type="submit" className="btn-nav-glow">
                  Cerca
                </Button>
              </InputGroup>
            </Form>

            <div className="d-flex gap-2">
              {user ? (
                <>
                  <Button as={Link} to="/profile" className="btn-nav-glow">
                    Profilo
                  </Button>
                  <Button
                    className="btn-nav-glow btn-nav-logout"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/login" className="btn-nav-glow">
                    Login
                  </Button>
                  <Button as={Link} to="/register" className="btn-nav-glow btn-nav-filled">
                    Registrati
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
