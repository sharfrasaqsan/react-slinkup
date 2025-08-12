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

const LikeButton = ({ post, setPosts }) => {
  const { user } = useAuth();
  const { posts, setNotifications } = useData();

  if (!post) return null;
  if (!user) return null;

  const handleLikes = async (postId) => {
    try {
      // Check if user is logged in
      if (!user) {
        toast.error("You must be logged in to like a post.");
        return;
      }

      // Find the current post
      const currentPost = posts.find((post) => post.id === postId);
      if (!currentPost) return;

      // Check if user has already liked the post
      const alreadyLiked = (currentPost.likes || [])?.includes(user.id);

      // Add or remove like
      const updatedLikes = alreadyLiked
        ? currentPost.likes?.filter((userId) => userId !== user.id)
        : [...(currentPost.likes || []), user.id];

      await updateDoc(doc(db, "posts", postId), { likes: updatedLikes });

      // Update post local UI
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: updatedLikes } : post
        )
      );

      // Add notification if user has not already liked the post and the post is not by the user
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

      // Add or remove like used only firestore. not local states.
      // so it should be used query to get the updated data from firestore
      // Check if user has already liked the post
      if (!alreadyLiked) {
        // Add like to likes collection
        const newLike = {
          postId,
          userId: user.id,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        await addDoc(collection(db, "likes"), newLike);
      } else {
        // Find the like document
        const likeDocs = await getDocs(
          query(
            collection(db, "likes"),
            where("postId", "==", postId),
            where("userId", "==", user.id)
          )
        );

        // Delete like
        likeDocs.forEach(
          async (singleDoc) => await deleteDoc(doc(db, "likes", singleDoc.id))
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <button onClick={() => handleLikes(post.id)} disabled={!user}>
        {(post.likes || [])?.includes(user.id) ? "Unlike" : "Like"}
      </button>
    </>
  );
};

export default LikeButton;
