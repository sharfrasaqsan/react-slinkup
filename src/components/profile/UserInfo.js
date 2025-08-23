import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import ProfileDetails from "./ProfileDetails";
import "../../styles/UserInfo.css";
import { format, parse } from "date-fns";
import AvatarUpdates from "./AvatarUpdates";

const UserInfo = ({ ownProfile }) => {
  const { user } = useAuth();
  if (!user) return null;

  const joinedLabel = format(
    parse(user.createdAt, "yyyy-MM-dd HH:mm:ss", new Date()),
    "yyyy MMMM"
  );

  return (
    <div className="profile-card z-1">
      <AvatarUpdates user={user} ownProfile={ownProfile} />

      <h5 className="text-color">{user.username}</h5>

      <p className="mb-3">
        <Link to={`/profile/${user.id}/followers`}>
          {(user.followers || []).length || 0} Followers
        </Link>{" "}
        ·{" "}
        <Link to={`/profile/${user.id}/following`}>
          {(user.following || []).length || 0} Following
        </Link>
      </p>

      <p className="form-text">Joined on {joinedLabel}</p>

      <ProfileDetails user={user} />
    </div>
  );
};

export default UserInfo;
