import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: "100vh", background: "#07080f",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "2px solid rgba(201,168,76,0.15)",
          borderTopColor: "#c9a84c",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}
