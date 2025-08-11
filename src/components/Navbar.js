import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <NavLink to="/explore">Explore</NavLink>
        </li>

        <li>
          <NavLink to={`/my-profile/${user?.id}`}>Profile</NavLink>
        </li>
        <li>
          <NavLink to="/settings">Settings</NavLink>
        </li>
        <li>
          <NavLink to="/notifications">Notifications</NavLink>
        </li>

        {user && user.role === "admin" && (
          <li>
            <NavLink to={`/admin/dashboard/${user.id}`}>Admin</NavLink>
          </li>
        )}

        {user && (
          <li>
            <Logout />
          </li>
        )}

        {!user && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          </>
        )}

        <li>
          <NavLink to="/all-users">All Users</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
