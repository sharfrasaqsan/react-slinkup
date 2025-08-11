import { Link, useParams } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { format } from "date-fns";
import ButtonSpinner from "../../utils/ButtonSpinner";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import UsersPosts from "./UsersPosts";
import ProfileDetails from "../../components/profile/ProfileDetails";

const UsersInfo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { users, setUsers, loading, setNotifications } = useData();

  const [followLoading, setFollowLoading] = useState(false);
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

  const handleFollow = async (userId) => {
    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to follow a user.");
      return;
    }

    if (user.id === userId) {
      toast.error("You cannot follow yourself.");
      return;
    }

    setFollowLoading(true);
    // toggle true - followed
    setAlreadyFollowed((prev) => !prev);
    try {
      // Get current user and user to follow
      // Exist user already find in outer scope
      const currentUser = users.find((i) => i.id === user.id);
      if (!existUser || !currentUser) return;

      // Check if current user is the user to follow
      if (existUser.id === currentUser.id) return;

      // Check if current user has already followed
      const alreadyFollowed = (existUser.followers || [])?.includes(user.id);

      // Update followers in user to follow
      const updatedFollowers = alreadyFollowed
        ? (existUser.followers || [])?.filter((id) => id !== user.id)
        : [...(existUser.followers || []), user.id];

      await updateDoc(doc(db, "users", existUser.id), {
        followers: updatedFollowers,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });

      setUsers((prev) =>
        prev.map((i) =>
          i.id === existUser.id
            ? {
                ...i,
                followers: updatedFollowers,
                updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
              }
            : i
        )
      );

      //------------------------------------------------------------------

      // Check if existing user has already following
      const alreadyFollowing = (currentUser.following || [])?.includes(
        existUser.id
      );

      // Update following in current user
      const updatedFollowing = alreadyFollowing
        ? (currentUser.following || [])?.filter((id) => id !== existUser.id)
        : [...(currentUser.following || []), existUser.id];

      await updateDoc(doc(db, "users", user.id), {
        following: updatedFollowing,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });

      setUsers((prev) =>
        prev.map((i) =>
          i.id === user.id
            ? {
                ...i,
                following: updatedFollowing,
                updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
              }
            : i
        )
      );

      // Add notification if not already followed or current user is the user to follow (own profile)
      const newNotification = {
        recieverId: existUser.id,
        senderId: currentUser.id,
        type: "follow",
        isRead: false,
        message: `${currentUser.username} followed you.`,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
      if (!alreadyFollowed || currentUser.id === existUser.id) {
        const res = await addDoc(
          collection(db, "notifications"),
          newNotification
        );
        setNotifications((prev) => [
          ...prev,
          { id: res.id, ...newNotification },
        ]);
      }
    } catch (err) {
      toast.error(err.message);
      setAlreadyFollowed((prev) => !prev);
    }
    setFollowLoading(false);
  };

  return (
    <div>
      <p>{existUser.username}</p>

      {user.followCountShow === "show" && (
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

      {user.id !== existUser.id && (
        <button
          onClick={() => handleFollow(existUser.id)}
          disabled={followLoading || !user || user.id === existUser.id}
        >
          {followLoading ? (
            <>
              {alreadyFollowed ? "Following..." : "Unfollowing..."}{" "}
              <ButtonSpinner />
            </>
          ) : (
            <>{alreadyFollowed ? "Unfollow" : "Follow"}</>
          )}
        </button>
      )}

      <ProfileDetails user={existUser} />

      <UsersPosts existUser={existUser} />
    </div>
  );
};

export default UsersInfo;
