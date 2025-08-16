import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProfileDetails from "./ProfileDetails";

const UserInfo = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="profile-card">
      <h5>{user.username}</h5>

      <p className="mb-3">
        <Link to={`/my-profile/${user.id}/followers`}>
          {(user.followers || []).length || 0} Followers
        </Link>{" "}
        ·{" "}
        <Link to={`/my-profile/${user.id}/following`}>
          {(user.following || []).length || 0} Following
        </Link>
      </p>

      <ProfileDetails user={user} />
    </div>
  );
};

export default UserInfo;
