import { Link, Outlet } from "react-router-dom";

const Settings = () => {
  return (
    <div>
      <h2>Settings</h2>
      <ul>
        <li>
          <Link to="/settings/profile">Profile Settings</Link>
        </li>
        <li>
          <Link to="/settings/account">Account Settings</Link>
        </li>
        <li>Change Password</li>
        <li>Notifications</li>
        <li>Privacy</li>
        <li>Security</li>
        <li>Language</li>
      </ul>

      <Outlet />
    </div>
  );
};

export default Settings;
