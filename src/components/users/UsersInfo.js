import { Link } from "react-router";
import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import ProfileDetails from "../profile/ProfileDetails";
import FollowButton from "./FollowButton";
import "../../styles/UserInfo.css";

const UsersInfo = ({ existUser }) => {
  const { user } = useAuth();
  const { loading } = useData();

  const [alreadyFollowed, setAlreadyFollowed] = useState(false);

  // Check if user is already followed
  useEffect(() => {
    if (existUser && (existUser.followers || [])) {
      setAlreadyFollowed((existUser.followers || [])?.includes(user?.id));
    } else {
      setAlreadyFollowed(false);
    }
  }, [existUser, user?.id]);

  if (loading) return <LoadingSpinner />;
  if (!existUser) return <NotFound text={"No user found!"} />;

  return (
    <div className="profile-card z-0 sticky">
      <h5>{existUser.username}</h5>

      <div className="d-flex justify-content-between align-items-center">
        {existUser.followCountShow === "show" && (
          <p className="mb-3">
            <Link to={`/user/${existUser.id}/followers`}>
              {(existUser.followers || []).length || 0} followers
            </Link>{" "}
            |{" "}
            <Link to={`/user/${existUser.id}/following`}>
              {(existUser.following || []).length || 0} following
            </Link>
          </p>
        )}

        <FollowButton
          user={user}
          existUser={existUser}
          alreadyFollowed={alreadyFollowed}
          setAlreadyFollowed={setAlreadyFollowed}
        />
      </div>

      <ProfileDetails user={existUser} />
    </div>
  );
};

export default UsersInfo;
