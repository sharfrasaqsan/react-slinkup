import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { format } from "date-fns";

const CommentLikeButton = ({ comment, post }) => {
  const { user } = useAuth();
  const { setComments, posts, setNotifications } = useData();

  const handleLikes = async (commentId) => {
    try {
      const alreadyLiked = (comment.likes || [])?.includes(user.id);

      const updatedLikes = alreadyLiked
        ? (comment.likes || [])?.filter((id) => id !== user.id)
        : [...(comment.likes || []), user.id];

      await updateDoc(doc(db, "comments", commentId), {
        likes: updatedLikes,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });

      setComments((prev) =>
        prev?.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: updatedLikes }
            : comment
        )
      );

      const currentPost = posts?.find((i) => i.id === post.id);

      // Notification update
      const newNotification = {
        postId: post.id,
        recieverId: currentPost.userId,
        senderId: user.id,
        type: "like",
        isRead: false,
        message: `${user.username} liked your comment.`,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      const res = await addDoc(
        collection(db, "notifications"),
        newNotification
      );

      setNotifications((prev) => [...prev, { id: res.id, ...newNotification }]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <button onClick={() => handleLikes(comment.id)} disabled={!user}>
        {(comment.likes || [])?.includes(user.id) ? "Unlike" : "Like"}
      </button>{" "}
      {(comment.likes || [])?.length ? (comment.likes || [])?.length : 0}{" "}
      {(comment.likes || [])?.length > 1 ? "likes" : "like"}
    </>
  );
};

export default CommentLikeButton;
