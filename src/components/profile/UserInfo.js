import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import ProfileDetails from "./ProfileDetails";
import "../../styles/UserInfo.css";

const UserInfo = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="profile-card z-0 sticky">
      <h5>{user.username}</h5>

      <p className="mb-3">
        <Link to={`/profile/${user.id}/followers`}>
          {(user.followers || []).length || 0} Followers
        </Link>{" "}
        ·{" "}
        <Link to={`/profile/${user.id}/following`}>
          {(user.following || []).length || 0} Following
        </Link>
      </p>

      <ProfileDetails user={user} />
    </div>
  );
};

export default UserInfo;
