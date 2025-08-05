import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { getAuthErrorMessage } from "../utils/authErrors";
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
import { db } from "../firebase/Config";
import { useData } from "../contexts/DataContext";
import { format, formatDistanceToNow } from "date-fns";

const PostCard = ({ post, postedUser }) => {
  const { user } = useAuth();
  const { setPosts } = useData();

  const handleLikes = async (postId) => {
    if (!user || !user.id || !postedUser) return;

    try {
      // Check if the user has already liked this post
      const checkUserLiked = query(
        collection(db, "likes"),
        where("userId", "==", user.id),
        where("postId", "==", postId)
      );
      const matchingLikes = await getDocs(checkUserLiked);

      if (!matchingLikes.empty) {
        // Already liked
        const likeDocId = matchingLikes.docs[0].id;

        // Remove like document form Lieks collection
        await deleteDoc(doc(db, "likes", likeDocId));

        // Remove user ID from post.likes array
        const updatedLikes = post.likes.filter((id) => id !== user.id);
        await updateDoc(doc(db, "posts", postId), {
          likes: updatedLikes,
        });

        // Update local UI state
        setPosts((prev) =>
          prev.map((i) => (i.id === postId ? { ...i, likes: updatedLikes } : i))
        );
      } else {
        const newLike = {
          userId: user.id,
          postId,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };

        // Add new liek doc to Likes collection
        await addDoc(collection(db, "likes"), newLike);

        // Add user ID to post.likes collection
        const updatedLikes = [...post.likes, user.id];
        await updateDoc(doc(db, "posts", postId), { likes: updatedLikes });

        // Update local UI state
        setPosts((prev) =>
          prev.map((i) => (i.id === postId ? { ...i, likes: updatedLikes } : i))
        );
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err.code) || "Failed to update like.");
    }
  };

  const handleDelete = async (postId) => {
    try {
      if (user.id === post.userId) {
        await deleteDoc(doc(db, "posts", postId));
        toast.success("Post deleted successfully!");
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      } else {
        toast.error("You can only delete your own posts!");
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err.code) || "Failed to delete post.");
    }
  };

  const postLikeCount = (post.likes || []).length;

  return (
    <div style={{ marginBottom: "1rem", backgroundColor: "lightgray" }}>
      <p>{postedUser?.username}</p>

      <p>{post.content}</p>

      <p>
        {post.createdAt
          ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
          : "No date"}
      </p>

      <p onClick={() => handleLikes(post.id)} style={{ cursor: "pointer" }}>
        {(post.likes || []).includes(user?.id) ? "❤️" : "🤍"} {postLikeCount}
      </p>
      
      <button onClick={() => handleDelete(post.id)}>Delete</button>
    </div>
  );
};

export default PostCard;
