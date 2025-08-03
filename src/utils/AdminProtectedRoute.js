import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  return user && user.role === "admin" ? children : <Navigate to="/" replace />;
};

export default AdminProtectedRoute;
