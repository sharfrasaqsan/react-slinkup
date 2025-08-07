import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <div>
      <p>Welcome @{user ? user.username : "Guest"}</p>
    </div>
  );
};

export default Header;
