import { useState } from "react";
import BasicProfile from "../../components/settings/profileSettings/BasicProfile";
import Personal from "../../components/settings/profileSettings/Personal";
import Privacy from "../../components/settings/profileSettings/Privacy";
import "../../styles/settings/ProfileSettings.css";
import Breadcrumbs from "../../utils/Breadcrumbs";

const ProfileSettings = () => {
  const [activeSection, setActiveSection] = useState("basic");

  const breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Settings", link: "/settings" },
    { label: "Profile Settings" },
  ];

  return (
    <section className="profile-settings container py-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Main Title */}
      <h4 className="mb-4  text-center">Profile Settings</h4>

      <div className="row">
        {/* Left Column for Menu */}
        <div className="col-md-4 ">
          <nav className="profile-settings-nav">
            <ul className="list-group list-group-flush">
              <li
                className={`list-group-item profile-settings-link ${
                  activeSection === "basic" ? "active" : ""
                }`}
                onClick={() => setActiveSection("basic")}
              >
                Basic Profile
              </li>
              <li
                className={`list-group-item profile-settings-link ${
                  activeSection === "personal" ? "active" : ""
                }`}
                onClick={() => setActiveSection("personal")}
              >
                Personal
              </li>
              <li
                className={`list-group-item profile-settings-link ${
                  activeSection === "privacy" ? "active" : ""
                }`}
                onClick={() => setActiveSection("privacy")}
              >
                Privacy
              </li>
            </ul>
          </nav>
        </div>

        {/* Right Column for Content */}
        <div className="col-md-8">
          <div className="profile-settings-content p-3">
            {activeSection === "basic" && <BasicProfile />}
            {activeSection === "personal" && <Personal />}
            {activeSection === "privacy" && <Privacy />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSettings;
