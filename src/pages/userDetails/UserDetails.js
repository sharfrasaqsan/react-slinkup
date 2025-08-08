import { useParams } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { format } from "date-fns";
import { FaPlus } from "react-icons/fa";
import ButtonSpinner from "../../utils/ButtonSpinner";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";

const UserDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { users, setUsers, loading } = useData();

  const [followLoading, setFollowLoading] = useState(false);

  if (loading) return <LoadingSpinner />;

  const existUser = users.find((user) => user.id === id);

  if (!existUser) return <NotFound text={"No user found!"} />;

  const handleFollow = async (userId) => {
    setFollowLoading(true);

    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to follow a user.");
      return;
    }

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
        : [...existUser.followers, user.id];

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

      // Add or delete follower in firestore
      if (!alreadyFollowed) {
        const newFollower = {
          follower: user.id,
          following: existUser.id,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        await addDoc(collection(db, "followers"), newFollower);
      } else {
        const followerDoc = await getDocs(
          query(
            collection(db, "followers"),
            where("follower", "==", user.id),
            where("following", "==", existUser.id)
          )
        );
        followerDoc.forEach(
          async (singleDoc) =>
            await deleteDoc(doc(db, "followers", singleDoc.id))
        );
      }

      //------------------------------------------------------------------

      // Check if existing user has already following
      const alreadyFollowing = (currentUser.following || [])?.includes(
        existUser.id
      );

      // Update following in current user
      const updatedFollowing = alreadyFollowing
        ? (currentUser.following || [])?.filter((id) => id !== existUser.id)
        : [...currentUser.following, existUser.id];

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

      // Add or delete following in firestore
      if (!alreadyFollowing) {
        const newFollowing = {
          follower: user.id,
          following: existUser.id,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        await addDoc(collection(db, "following"), newFollowing);
      } else {
        const followingDoc = await getDocs(
          query(
            collection(db, "following"),
            where("follower", "==", user.id),
            where("following", "==", existUser.id)
          )
        );
        followingDoc.forEach(
          async (singleDoc) =>
            await deleteDoc(doc(db, "following", singleDoc.id))
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
    setFollowLoading(false);
  };

  const alreadyFollowed = (existUser.followers || []).includes(user.id);

  return (
    <div>
      <h2>@{existUser.username}</h2>
      <p>{existUser.email}</p>
      <button onClick={() => handleFollow(existUser.id)}>
        {followLoading ? (
          <>
            {alreadyFollowed ? "Unfollowing..." : "Following..."}{" "}
            <ButtonSpinner />
          </>
        ) : (
          <>
            {alreadyFollowed ? "Unfollow" : "Follow"} <FaPlus />
          </>
        )}
      </button>
    </div>
  );
};

export default UserDetails;
