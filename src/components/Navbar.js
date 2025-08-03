import { Link } from "react-router-dom";
import Logout from "./Logout";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/explore">Explore</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin/dashboard">Admin</Link>
              </li>
            )}
            <li>
              <Logout />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
