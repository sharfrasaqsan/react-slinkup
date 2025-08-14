import { NavLink } from "react-router-dom";
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

        <li>
          <NavLink to="/all-users">All Users</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
