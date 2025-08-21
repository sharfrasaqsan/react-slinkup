import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If the user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isOnRegisterDetails = location.pathname === "/register-details";

  // Redirect to the homepage if the profile is complete and trying to access the register-details page
  if (user.profileCompletion && isOnRegisterDetails) {
    return <Navigate to="/" replace />;
  }

  // If the profile is not complete and not on the register-details page, redirect to register-details
  if (!user.profileCompletion && !isOnRegisterDetails) {
    return <Navigate to="/register-details" replace />;
  }

  return children;
};

export default ProtectedRoute;
