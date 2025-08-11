import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import ButtonSpinner from "../../../utils/ButtonSpinner";

const SocialPresence = () => {
  const { user, setUser } = useAuth();
  const { setUsers, loading } = useData();

  const [isShow, setIsShow] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsShow(user.followCountShow === "show");
    }
  }, [user]);

  if (!user) return null;
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
        prev?.map((user) =>
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
    <div>
      <h4>Social Presence</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id);
        }}
      >
        <div>
          <p>Manage followers/following counts</p>
          <Form.Check
            type="switch"
            id="followCount"
            label={isShow ? "On" : "Off"}
            checked={isShow}
            onChange={() => setIsShow(!isShow)}
          />
        </div>

        <button type="submit">
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
