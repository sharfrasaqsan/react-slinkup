import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { Form } from "react-bootstrap"; // Using Bootstrap for form control
import LoadingSpinner from "../../../utils/LoadingSpinner";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import "../../../styles/settings/SocialPresence.css"; // Import the updated CSS file

const SocialPresence = () => {
  const { user, setUser } = useAuth();
  const { setUsers, loading } = useData();

  const [isShow, setIsShow] = useState(""); // State for showing the count visibility
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsShow(user.followCountShow === "show");
    }
  }, [user]);

  if (!user) return null; // If user data isn't available
  if (loading) return <LoadingSpinner />; // Show loading spinner while loading

  const handleUpdate = async (userId) => {
    setUpdateLoading(true); // Start loading state
    try {
      const updateUser = {
        followCountShow: isShow ? "show" : "hide", // Toggling the follow count visibility
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await updateDoc(doc(db, "users", userId), updateUser); // Update user data in Firestore

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updateUser } : user
        )
      );

      setUser((prev) => ({ ...prev, ...updateUser })); // Update context user data

      toast.success("Profile updated successfully"); // Show success message
    } catch (err) {
      toast.error(err.message); // Show error if update fails
    }
    setUpdateLoading(false); // End loading state
  };

  return (
    <div className="container social-presence-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id); // Handle form submit
        }}
        className="social-presence-form"
      >
        <div className="social-presence-section">
          <p className="social-presence-text">
            Manage followers/following counts
          </p>

          <Form.Check
            type="switch"
            id="followCount"
            label={isShow ? "On" : "Off"} // Show current state ("On" or "Off")
            checked={isShow}
            onChange={() => setIsShow(!isShow)} // Toggle state on change
            className="social-presence-switch"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-4">
          {updateLoading ? (
            <>
              Updating... <ButtonSpinner />
            </>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default SocialPresence;
