import { toast } from "react-toastify";
import { collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { format } from "date-fns";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { useData } from "../../contexts/DataContext";
import { useState } from "react";

const FollowButton = ({
  user,
  existUser,
  alreadyFollowed,
  setAlreadyFollowed,
}) => {
  const { users, setUsers, setNotifications } = useData();

  const [followLoading, setFollowLoading] = useState(false);

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
      // const existUser = users.find((user) => user.id === id); userParams(id)
      const existUser = users.find((i) => i.id === userId);
      const currentUser = users.find((i) => i.id === user.id);
      if (!existUser || !currentUser) return null;

      // Check if current user is the user to follow
      if (userId === currentUser.id) return null;

      // Check if current user has already followed
      const alreadyFollowed = (existUser.followers || [])?.includes(user.id);

      // Update followers in user to follow
      const updatedFollowers = alreadyFollowed
        ? (existUser.followers || [])?.filter((id) => id !== user.id)
        : [...(existUser.followers || []), user.id];

      await updateDoc(doc(db, "users", userId), {
        followers: updatedFollowers,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });

      setUsers((prev) =>
        prev.map((i) =>
          i.id === userId
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
      const alreadyFollowing = (currentUser.following || [])?.includes(userId);

      // Update following in current user
      const updatedFollowing = alreadyFollowing
        ? (currentUser.following || [])?.filter((id) => id !== userId)
        : [...(currentUser.following || []), userId];

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
        recieverId: userId,
        senderId: currentUser.id,
        type: "follow",
        isRead: false,
        message: `${currentUser.username} followed you.`,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
      if (!alreadyFollowed || currentUser.id === userId) {
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
    <>
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
    </>
  );
};

export default FollowButton;
