import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div
    
    >
      <div>Welcome back @{user ? user.username : "Guest"}</div>
    
    </div>
  );
};

export default Header;
