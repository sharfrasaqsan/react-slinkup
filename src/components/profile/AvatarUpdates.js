import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import UserAvatar from "../UserAvatar";
import { IoCameraReverseSharp, IoTrashBinOutline } from "react-icons/io5";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { useState } from "react";
import { toast } from "react-toastify";

const AvatarUpdates = ({ user, ownProfile }) => {
  const { setUser } = useAuth();
  const { setUsers } = useData();
  const [uploadLoading, setUploadLoading] = useState(false);

  if (!user) return;

  const handleImageUpload = async (file, userId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "slinkup_avatar");

    setUploadLoading(true);
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/sharfras/image/upload",
        formData
      );

      const imageURL = res.data.secure_url;

      await updateDoc(doc(db, "users", userId), { avatar: imageURL });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, avatar: imageURL } : u))
      );
      setUser((prev) => ({ ...prev, avatar: imageURL }));

      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.error("Upload error:", err.message);
      toast.error("Upload failed. Please try again.");
    }
    setUploadLoading(false);
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id) return;

    try {
      await updateDoc(doc(db, "users", user.id), { avatar: "" });

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, avatar: "" } : u))
      );
      setUser((prev) => ({ ...prev, avatar: "" }));

      toast.success("Avatar removed");
    } catch (err) {
      console.error("Error removing avatar:", err.message);
      toast.error("Failed to remove avatar");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mb-4">
      {user && (
        <div className="position-relative">
          <UserAvatar
            width="200px"
            height="200px"
            fontSize="200px"
            user={user}
          />

          {ownProfile && (
            <label style={{ cursor: "pointer" }}>
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(file, user.id);
                  }
                }}
              />

              {uploadLoading ? (
                <span className="camera-icon">
                  <ButtonSpinner />
                </span>
              ) : (
                <IoCameraReverseSharp
                  size={35}
                  className="camera-icon"
                  title="Upload avatar"
                />
              )}
            </label>
          )}
        </div>
      )}

      {user && user.avatar && ownProfile && (
        <span
          type="button"
          onClick={handleRemoveAvatar}
          disabled={uploadLoading}
          className="position-absolute border-0 rounded-circle camera-icon remove-avatar"
          title="Remove avatar"
          aria-label="Remove avatar"
          style={{
            opacity: uploadLoading ? 0.6 : 1,
            cursor: uploadLoading ? "not-allowed" : "pointer",
          }}
        >
          <IoTrashBinOutline size={20} className="text-danger" />
        </span>
      )}
    </div>
  );
};

export default AvatarUpdates;
