import { Link, Outlet } from "react-router";
import "../../styles/settings/Settings.css";
import Breadcrumbs from "../../utils/Breadcrumbs";

const Settings = () => {
  const breadcrumbs = [{ label: "Home", link: "/" }, { label: "Settings" }];

  return (
    <div className="settings-container container py-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Main Title */}
      <h3 className="settings-title mb-4">Settings</h3>

      {/* Settings Menu */}
      <div className="settings-menu shadow-sm">
        <ul className="list-group list-group-flush">
          <Link to="/settings/profile" className="settings-link">
            <li className="list-group-item">Profile Settings</li>
          </Link>
          <Link to="/settings/account" className="settings-link">
            <li className="list-group-item">Account Settings</li>
          </Link>
          <li className="list-group-item">Change Password</li>
          <li className="list-group-item">Notifications</li>
          <li className="list-group-item">Privacy</li>
          <li className="list-group-item">Security</li>
          <li className="list-group-item">Language</li>
        </ul>
      </div>

      {/* Outlet */}
      <Outlet />
    </div>
  );
};

export default Settings;
