import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function RequireAuth({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <p style={{ textAlign: "center", marginTop: "4rem" }}>You don't have access to this page.</p>;
  }

  return children;
}

export default RequireAuth;