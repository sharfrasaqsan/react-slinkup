import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { FaUserCircle, FaBell, FaCog } from "react-icons/fa";
import Logout from "../components/Logout";
import "../styles/Header.css";
import { useData } from "../contexts/DataContext";
import Notifications from "../components/Notifications";
import { useState, useEffect } from "react";

const Header = () => {
  const { user } = useAuth();
  const { notifications } = useData();

  const [unReadNotificationCount, setUnReadNotificationCount] = useState(0);

  useEffect(() => {
    const userNotifications = (notifications || [])?.filter(
      (notification) => notification.recieverId === user?.id
    );
    const unreadCount = (userNotifications || [])?.filter(
      (i) => i.isRead === false
    ).length;
    setUnReadNotificationCount(unreadCount);
  }, [notifications, user?.id]);

  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
      <div className="d-flex align-items-center ">
        <Link to="/" className="text-decoration-none">
          <h3 className="text-primary m-0 fw-bold">SLINKUP</h3>
        </Link>
      </div>

      <div className="d-flex align-items-center primary-color">
        {user ? (
          <>
            <div className="d-flex align-items-center me-3">
              <FaUserCircle size={30} className="me-2" />
              <span className="text-dark">Welcome, {user.username}</span>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-link text-primary dropdown-toggle"
                type="button"
                id="dropdownNotificationButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center">
                  <FaBell size={20} className="text-primary" />
                  <span className="notification-count">
                    {unReadNotificationCount}
                  </span>
                </div>
              </button>

              <div
                className="dropdown-menu dropdown-menu-notifications"
                aria-labelledby="dropdownNotificationButton"
              >
                <Notifications />
              </div>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-link text-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaCog size={20} className="text-primary" />
              </button>

              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <Link to={`/my-profile/${user.id}`} className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="dropdown-item">
                    Settings
                  </Link>
                </li>
                <li>
                  <Logout />
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="d-flex align-items-center login-register">
            <Link to="/login" className="btn btn-primary me-2">
              Login
            </Link>

            <Link to="/register" className="btn btn-outline-secondary me-2">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
