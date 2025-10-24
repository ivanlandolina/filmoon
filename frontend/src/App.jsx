import { ToastProvider } from "./state/ToastContext.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyNavbar from "./components/MyNavbar.jsx";
import { useAuth } from "./state/AuthContext.jsx";
import { Container } from "react-bootstrap";

// Pagine
import MovieDetails from "./pages/MovieDetails.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ListingPage from "./pages/ListingPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
//

export default function App() {
  const { user } = useAuth();
  
  return (
    <ToastProvider>
      <>
        <MyNavbar />
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="*"
            element={
              <Container className="my-4">
                <Routes>
                  <Route path="/" element={<ListingPage kind="popular" />} />
                  <Route
                    path="/now-playing"
                    element={<ListingPage kind="now_playing" />}
                  />
                  <Route
                    path="/upcoming"
                    element={<ListingPage kind="upcoming" />}
                  />
                  <Route
                    path="/top-rated"
                    element={<ListingPage kind="top_rated" />}
                  />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={user ? <Navigate to="/" /> : <RegisterPage />}
                  />
                </Routes>
              </Container>
            }
          />
        </Routes>
      </>
    </ToastProvider>
  );
}
