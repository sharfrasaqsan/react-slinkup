import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { Form } from "react-bootstrap";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import "../../../styles/settings/Setting.css";

const Privacy = () => {
  const { user, setUser } = useAuth();
  const { setUsers, loading } = useData();

  const [isShow, setIsShow] = useState(""); // State for showing the count visibility
  const [updateLoading, setUpdateLoading] = useState(false);

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
    <div className="container profile-settings-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id); // Handle form submit
        }}
        className="privacy-form"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="privacy-text m-0">Follower/Following Visibility</p>

          <Form.Check
            type="switch"
            id="followCount"
            label={isShow ? "On" : "Off"}
            checked={isShow}
            onChange={() => setIsShow(!isShow)}
            className="privacy-switch"
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

export default Privacy;
