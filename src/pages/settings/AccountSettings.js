import React, { useState } from "react";
import Breadcrumbs from "../../utils/Breadcrumbs";
import BasicAccountSettings from "../../components/settings/accountSettings/BasicAccountSettings";

const AccountSettings = () => {
  const [activeSection, setActiveSection] = useState("basic");
  const breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Settings", link: "/settings" },
    { label: "Account Settings" },
  ];

  return (
    <section className="profile-settings-container container py-4">
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
                Basic Account Settings
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-md-8">
          <div className="profile-settings-content p-3">
            {activeSection === "basic" && <BasicAccountSettings />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;
