import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { getAuthErrorMessage } from "../utils/authErrors";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useData } from "../contexts/DataContext";

const PostCard = ({ post, postedUser }) => {
  const { user } = useAuth();
  const { setPosts } = useData();

  const handleLikes = async (postId) => {
    if (!user || !user.uid) return;

    const hasLiked = post.likes.includes(user.uid); // Check if already liked
    let updatedLikes;

    try {
      if (hasLiked) {
        // Remove user ID from likes
        updatedLikes = post.likes.filter((id) => id !== user.uid);
        await updateDoc(doc(db, "posts", postId), {
          likes: updatedLikes,
        });
        toast.info("Like removed.");
      } else {
        // Add user ID to likes
        updatedLikes = [...post.likes, user.uid];
        await updateDoc(doc(db, "posts", postId), {
          likes: updatedLikes,
        });
        toast.success("Post liked!");
      }

      // Update local state
      setPosts((prev) =>
        prev.map((i) => (i.id === postId ? { ...i, likes: updatedLikes } : i))
      );
    } catch (err) {
      toast.error(getAuthErrorMessage(err.code) || "Failed to update like.");
    }
  };

  return (
    <div>
      <p>{postedUser.username}</p>
      <p>{post.content}</p>
      <p>{post.createdAt}</p>
      <p onClick={() => handleLikes(post.id)}>Likes: {post.likes.length}</p>
    </div>
  );
};

export default PostCard;
