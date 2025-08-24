import { useState } from "react";
import Breadcrumbs from "../../utils/Breadcrumbs";
import BasicAccount from "../../components/settings/accountSettings/BasicAccount";
import Appearance from "../../components/settings/accountSettings/Appearance";

const AccountSettings = () => {
  const [activeSection, setActiveSection] = useState("basic");
  const breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Settings", link: "/settings" },
    { label: "Account" },
  ];

  return (
    <section className="profile-settings container py-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <h4 className="mb-4">Account Settings</h4>

      <div className="row">
        <div className="col-md-4 ">
          <nav className="profile-settings-nav">
            <ul className="list-group list-group-flush">
              <li
                className={`list-group-item profile-settings-link ${
                  activeSection === "basic" ? "active" : ""
                }`}
                onClick={() => setActiveSection("basic")}
              >
                Basic Account
              </li>
              <li
                className={`list-group-item profile-settings-link ${
                  activeSection === "appearance" ? "active" : ""
                }`}
                onClick={() => setActiveSection("appearance")}
              >
                Appearance
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-md-8">
          <div className="profile-settings-content p-3">
            {activeSection === "basic" && <BasicAccount />}
            {activeSection === "appearance" && <Appearance />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;
