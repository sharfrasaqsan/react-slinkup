import { Link, useParams } from "react-router";
import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import UsersPosts from "./UsersPosts";
import ProfileDetails from "../../components/profile/ProfileDetails";
import FollowButton from "./FollowButton";

const UsersInfo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { users, loading } = useData();

  const [alreadyFollowed, setAlreadyFollowed] = useState(false);

  const existUser = users.find((user) => user.id === id);

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
    <div>
      <p>{existUser.username}</p>

      {existUser.followCountShow === "show" && (
        <p>
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

      <ProfileDetails user={existUser} />

      <UsersPosts existUser={existUser} />
    </div>
  );
};

export default UsersInfo;
