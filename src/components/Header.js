import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { FaBell } from "react-icons/fa";
import Logout from "../components/Logout";
import { useData } from "../contexts/DataContext";
import Notifications from "../components/Notifications";
import { useState, useEffect } from "react";
import Search from "./search/Search";
import UserAvatar from "./UserAvatar";
import "../styles/Header.css";
import Darkmode from "../utils/Darkmode";

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
    <section className="sticky-top bg-light shadow-sm">
      <div className="d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center ">
          <Link to="/" className="text-decoration-none">
            <h3 className="text-primary m-0 fw-bold">SLINKUP</h3>
          </Link>
        </div>

        {user && (
          <div className="responsive-hide-search">
            <Search />
          </div>
        )}

        <div className="d-flex align-items-center primary-color">
          {user && (
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
          )}

          {user ? (
            <>
              <div className="dropdown">
                <div
                  className="d-flex align-items-center ms-3 dropdown-toggle cursor-pointer"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <UserAvatar
                    fontSize={35}
                    width={35}
                    height={35}
                    user={user}
                    style={{ marginRight: 0 }}
                  />
                  <span className="user-select-none">{user.username}</span>
                </div>

                <ul
                  className="dropdown-menu dropdown-menu-profile"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <Link to={`/profile/${user.id}`} className="dropdown-item">
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

              <Darkmode />
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
      <div className="d-flex justify-content-center pb-3 bg-light responsive-show-search">
        <Search />
      </div>
    </section>
  );
};

export default Header;
