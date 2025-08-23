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
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { toast } from "react-toastify";
import { db } from "../../firebase/Config";
import { format } from "date-fns";
import { FaThumbsUp } from "react-icons/fa";
import "../../styles/post/LikeButton.css";

const LikeButton = ({ post, setPosts }) => {
  const { user } = useAuth();
  const { posts, setNotifications } = useData();

  if (!post || !user) return null;

  const handleLikes = async (postId) => {
    try {
      // Check if user is logged in
      if (!user) {
        toast.error("You must be logged in to like a post.");
        return;
      }

      const currentPost = posts.find((post) => post.id === postId);
      if (!currentPost) return;

      const alreadyLiked = (currentPost.likes || []).includes(user.id);

      const updatedLikes = alreadyLiked
        ? currentPost.likes.filter((userId) => userId !== user.id)
        : [...(currentPost.likes || []), user.id];

      // Optimistically update the UI
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: updatedLikes } : post
        )
      );

      // Update likes in Firestore
      await updateDoc(doc(db, "posts", postId), { likes: updatedLikes });

      // Handle notifications for liked post
      if (!alreadyLiked && currentPost.userId !== user.id) {
        const newNotification = {
          postId,
          recieverId: currentPost.userId,
          senderId: user.id,
          type: "like",
          isRead: false,
          message: `${user.username} liked your post.`,
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
      }

      // Manage likes collection in Firestore
      if (!alreadyLiked) {
        const newLike = {
          postId,
          userId: user.id,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        await addDoc(collection(db, "likes"), newLike);
      } else {
        // Remove like from the Firestore likes collection
        const likeDocs = await getDocs(
          query(
            collection(db, "likes"),
            where("postId", "==", postId),
            where("userId", "==", user.id)
          )
        );
        likeDocs.forEach(
          async (singleDoc) => await deleteDoc(doc(db, "likes", singleDoc.id))
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <button
      className={`btn btn-outline-primary btn-sm d-flex align-items-center gap-2 ${
        post.likes?.includes(user.id) ? "liked" : ""
      }`}
      onClick={() => handleLikes(post.id)}
      disabled={!user}
    >
      <FaThumbsUp
        className={`like-icon ${
          post.likes?.includes(user.id) ? "liked-icon" : ""
        }`}
      />
      <span>Like</span>
    </button>
  );
};

export default LikeButton;
