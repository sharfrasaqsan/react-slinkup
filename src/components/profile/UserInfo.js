import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";

const UserInfo = () => {
  const { user } = useAuth();

  const [followLoading, setFollowLoading] = useState(false);

  if (!user) return null;

  const handleFollow = async (userId) => {
    setFollowLoading(true);
    try {
    } catch (err) {
      toast.error(err.message);
    }
    setFollowLoading(false);
  };

  return (
    <div>
      <p>@{user.username}</p>
      <button ooclick={() => handleFollow(user.id)}>
        {followLoading ? (
          <>
            Following... <ButtonSpinner />
          </>
        ) : (
          <>
            Follow <FaPlus />
          </>
        )}
      </button>
      <p>
        <span>
          {user.firstname} {user.lastname}
        </span>
      </p>
      <p>{user.email}</p>
      <p>{(user.followers || []).length || 0} followers</p>
      <p>{(user.following || []).length || 0} following</p>
      <p>{user.bio}</p>
    </div>
  );
};

export default UserInfo;
