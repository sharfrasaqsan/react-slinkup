import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isOnRegisterDetails = location.pathname === "/register-details";

  if (!user.profileCompletion && !isOnRegisterDetails) {
    return <Navigate to="/register-details" replace />;
  }

  if (user.profileCompletion && isOnRegisterDetails) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
