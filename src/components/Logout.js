import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/Config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import ButtonSpinner from "../utils/ButtonSpinner";
import { useData } from "../contexts/DataContext";

const Logout = () => {
  const { user, setUser } = useAuth();
  const { setSearch } = useData();

  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  if (!user === null) {
    return null;
  }

  const handleLogout = async () => {
    if (user === null) {
      toast.error("You are not logged in!");
      return;
    }

    setLoggingOut(true);

    setTimeout(async () => {
      try {
        await signOut(auth);
        setSearch("");
        setUser(null);
        toast.success("Logged out successfully");
        navigate("/login");
      } catch (err) {
        toast.error(`Failed to logout, ${err.message}`);
      } finally {
        setLoggingOut(false);
      }
    }, 1000);
  };

  return (
    <>
      <button
        className="dropdown-item text-danger"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        <>
          {loggingOut ? (
            <>
              <ButtonSpinner />
              Loggin out...
            </>
          ) : (
            "Logout"
          )}
        </>
      </button>
    </>
  );
};

export default Logout;
