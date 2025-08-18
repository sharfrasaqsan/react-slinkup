import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { FaHome, FaTachometerAlt } from "react-icons/fa";
import "../styles/Navbar.css";
import { TiWorld } from "react-icons/ti";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav
      className="navbar navbar-light"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Navbar links */}
        <div className="d-flex flex-wrap justify-content-center w-100">
          <ul className="navbar-nav d-flex w-100 justify-content-center mb-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-white">
                <FaHome className="icon-size" />
                <span className="ms-2 link-text">Home</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/explore" className="nav-link text-white">
                <TiWorld className="icon-size" />
                <span className="ms-2 link-text">Explore</span>
              </NavLink>
            </li>

            {user && user.role === "admin" && (
              <li className="nav-item">
                <NavLink
                  to={`/admin/dashboard/${user.id}`}
                  className="nav-link text-white"
                >
                  <FaTachometerAlt className="icon-size" />{" "}
                  <span className="ms-2 link-text">Admin</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
