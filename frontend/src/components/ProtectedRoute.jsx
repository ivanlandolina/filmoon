import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
