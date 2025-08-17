import { Link, Outlet } from "react-router";
import "../../styles/settings/Settings.css";

const Settings = () => {
  return (
    <div className="settings-container container py-4">
      <h3 className="text-primary mb-4">Settings</h3>
      <div className="settings-menu card p-4 shadow-sm">
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

      <Outlet />
    </div>
  );
};

export default Settings;
