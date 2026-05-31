import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === undefined) {
    return <div className="loading-screen"><div className="loading-spinner" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
