import { useState } from "react";
import BasicProfileSettings from "../../components/settings/profileSettings/BasicProfileSettings";
import PersonalSettings from "../../components/settings/profileSettings/PersonalSettings";
import SocialPresence from "../../components/settings/profileSettings/SocialPresence";

const ProfileSettings = () => {
  const [activeSection, setActiveSection] = useState("basic");

  return (
    <section>
      <h3>Profile Settings</h3>

      <nav style={{ marginBottom: "1rem" }}>
        <ul>
          <li onClick={() => setActiveSection("basic")}>
            Basic Profile Settings
          </li>
          <li onClick={() => setActiveSection("personal")}>
            Personal Settings
          </li>
          <li onClick={() => setActiveSection("social")}>Social Presence</li>
        </ul>
      </nav>

      <div>
        {activeSection === "basic" && <BasicProfileSettings />}
        {activeSection === "personal" && <PersonalSettings />}
        {activeSection === "social" && <SocialPresence />}
      </div>
    </section>
  );
};

export default ProfileSettings;
