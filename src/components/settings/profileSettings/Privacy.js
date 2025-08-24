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

  const [isShow, setIsShow] = useState("show");
  const [updateLoading, setUpdateLoading] = useState(false);

  if (loading) return <LoadingSpinner />;

  const handleUpdate = async (userId) => {
    setUpdateLoading(true);
    try {
      const updateUser = {
        followCountShow: isShow ? "show" : "hide",
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await updateDoc(doc(db, "users", userId), updateUser);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updateUser } : user
        )
      );

      setUser((prev) => ({ ...prev, ...updateUser }));

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
    setUpdateLoading(false);
  };

  return (
    <div className="container profile-settings-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id);
        }}
        className="privacy-form"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="privacy-text m-0">Follower/Following Visibility</p>

          <Form.Check
            type="switch"
            id="followCount"
            label={isShow ? "Show" : "Hide"}
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
