import { toast } from "react-toastify";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
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
    if (!user) {
      toast.error("You must be logged in to follow a user.");
      return;
    }

    if (user.id === userId) {
      toast.error("You cannot follow yourself.");
      return;
    }

    setFollowLoading(true);
    // ✅ immediate toggle (same as your raw file)
    setAlreadyFollowed((prev) => !prev);

    try {
      const existUser = users.find((i) => i.id === userId);
      const currentUser = users.find((i) => i.id === user.id);
      if (!existUser || !currentUser) return null;

      const alreadyFollowed = (existUser.followers || [])?.includes(user.id);

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

      const alreadyFollowing = (currentUser.following || [])?.includes(userId);
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

      // Add - remove notification
      if (!alreadyFollowed) {
        const newNotification = {
          recieverId: userId,
          senderId: currentUser.id,
          type: "follow",
          isRead: false,
          message: `${currentUser.username} followed you.`,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        const res = await addDoc(
          collection(db, "notifications"),
          newNotification
        );
        setNotifications((prev) => [
          ...prev,
          { id: res.id, ...newNotification },
        ]);
      } else {
        const existNotifications = await getDocs(
          query(
            collection(db, "notifications"),
            where("recieverId", "==", userId),
            where("senderId", "==", currentUser.id),
            where("type", "==", "follow")
          )
        );

        existNotifications?.forEach(async (notification) => {
          await deleteDoc(doc(db, "notifications", notification.id));
        });

        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.recieverId === userId &&
                notification.senderId === currentUser.id &&
                notification.type === "follow"
              )
          )
        );
      }
    } catch (err) {
      toast.error(err.message);
      setAlreadyFollowed((prev) => !prev); // rollback toggle if error
    }
    setFollowLoading(false);
  };

  return (
    <div className="mb-3">
      {user.id !== existUser.id && (
        <button
          className={`btn ${
            alreadyFollowed ? "btn-outline-primary" : "btn-primary"
          } btn-sm`}
          type="button"
          style={{ minWidth: "90px" }}
          onClick={() => handleFollow(existUser.id)}
          disabled={followLoading || !user || user.id === existUser.id}
        >
          {followLoading ? (
            <>{alreadyFollowed ? <ButtonSpinner /> : <ButtonSpinner />} </>
          ) : (
            <>{alreadyFollowed ? "Unfollow" : "Follow"}</>
          )}
        </button>
      )}
    </div>
  );
};

export default FollowButton;
