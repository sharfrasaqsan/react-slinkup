import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProfileDetails from "./ProfileDetails";

const UserInfo = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{ padding: "1rem", backgroundColor: "#d5d5d5ff" }}>
      <p>{user.username}</p>

      <p>
        <Link to={`/my-profile/${user.id}/followers`}>
          {(user.followers || []).length || 0} followers
        </Link>{" "}
        |{" "}
        <Link to={`/my-profile/${user.id}/following`}>
          {(user.following || []).length || 0} following
        </Link>
      </p>

      <ProfileDetails user={user} />
    </div>
  );
};

export default UserInfo;
