import ProtectedRoute from "../../utils/ProtectedRoute";
import { Outlet } from "react-router-dom";

const SettingsProtected = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

export default SettingsProtected;
