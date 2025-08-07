import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <p>Welcome back @{user ? user.username : "Guest"}</p>
    </div>
  );
};

export default Header;
