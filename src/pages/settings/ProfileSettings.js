import { useState } from "react";
import BasicProfileSettings from "../../components/settings/profileSettings/BasicProfileSettings";
import PersonalSettings from "../../components/settings/profileSettings/PersonalSettings";
import SocialPresence from "../../components/settings/profileSettings/SocialPresence";
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
    <section className="profile-settings-container container py-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Main Title */}
      <h4 className="mb-4">Profile Settings</h4>

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
                Basic Profile Settings
              </li>
              <li
                className={`list-group-item profile-settings-link ${
                  activeSection === "personal" ? "active" : ""
                }`}
                onClick={() => setActiveSection("personal")}
              >
                Personal Settings
              </li>
              <li
                className={`list-group-item profile-settings-link ${
                  activeSection === "social" ? "active" : ""
                }`}
                onClick={() => setActiveSection("social")}
              >
                Social Presence
              </li>
            </ul>
          </nav>
        </div>

        {/* Right Column for Content */}
        <div className="col-md-8">
          <div className="profile-settings-content p-3">
            {activeSection === "basic" && <BasicProfileSettings />}
            {activeSection === "personal" && <PersonalSettings />}
            {activeSection === "social" && <SocialPresence />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSettings;
