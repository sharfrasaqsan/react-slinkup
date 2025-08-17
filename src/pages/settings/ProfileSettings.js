import { useState } from "react";
import BasicProfileSettings from "../../components/settings/profileSettings/BasicProfileSettings";
import PersonalSettings from "../../components/settings/profileSettings/PersonalSettings";
import SocialPresence from "../../components/settings/profileSettings/SocialPresence";
import "../../styles/settings/ProfileSettings.css";

const ProfileSettings = () => {
  const [activeSection, setActiveSection] = useState("basic");

  return (
    <section className="container settings-container py-4">
      <h4 className="text-primary mb-4">Profile Settings</h4>

      <div className="row">
        {/* Left Column for Menu (4 parts) */}
        <div className="col-md-4">
          <nav className="mb-5">
            <ul className="list-group list-group-flush settings-menu">
              <li
                className={`list-group-item settings-link ${
                  activeSection === "basic" ? "active" : ""
                }`}
                onClick={() => setActiveSection("basic")}
              >
                Basic Profile Settings
              </li>
              <li
                className={`list-group-item settings-link ${
                  activeSection === "personal" ? "active" : ""
                }`}
                onClick={() => setActiveSection("personal")}
              >
                Personal Settings
              </li>
              <li
                className={`list-group-item settings-link ${
                  activeSection === "social" ? "active" : ""
                }`}
                onClick={() => setActiveSection("social")}
              >
                Social Presence
              </li>
            </ul>
          </nav>
        </div>

        {/* Right Column for Content (8 parts) */}
        <div className="col-md-8">
          <div className="settings-content">
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
