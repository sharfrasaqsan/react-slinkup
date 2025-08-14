import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaHome,
  FaSearch,
  FaCogs,
  FaBell,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa"; // Importing React Icons

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <div className="container-fluid">
        {/* Navbar without the toggle button */}
        <div className="navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-white">
                <FaHome /> {/* Home Icon */}
                <span className="ms-2 link-text">Home</span> {/* Text */}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/explore" className="nav-link text-white">
                <FaSearch /> {/* Explore Icon */}
                <span className="ms-2 link-text">Explore</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/settings" className="nav-link text-white">
                <FaCogs /> {/* Settings Icon */}
                <span className="ms-2 link-text">Settings</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/notifications" className="nav-link text-white">
                <FaBell /> {/* Notifications Icon */}
                <span className="ms-2 link-text">Notifications</span>
              </NavLink>
            </li>

            {user && user.role === "admin" && (
              <li className="nav-item">
                <NavLink
                  to={`/admin/dashboard/${user.id}`}
                  className="nav-link text-white"
                >
                  <FaTachometerAlt /> {/* Admin Icon */}
                  <span className="ms-2 link-text">Admin</span>
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink to="/all-users" className="nav-link text-white">
                <FaUsers /> {/* All Users Icon */}
                <span className="ms-2 link-text">All Users</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
