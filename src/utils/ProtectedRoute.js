import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    user.profileCompletion === false &&
    location.pathname !== "/register-details"
  ) {
    return <Navigate to="/register-details" replace />;
  }

  return children;
};

export default ProtectedRoute;
