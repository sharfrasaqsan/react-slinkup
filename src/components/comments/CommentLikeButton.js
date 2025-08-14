import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { format } from "date-fns";
import { FaThumbsUp } from "react-icons/fa";
import "../../styles/post/LikeButton.css";

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
        recieverId: currentPost?.userId,
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

  const likesCount = comment.likes?.length || 0;

  return (
    <>
      <div
        className="d-flex gap-3 text-muted like-comment-counts"
        style={{ fontSize: "14px" }}
      >
        <span>
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </span>
      </div>

      <button
        className={`btn btn-outline-primary btn-sm d-flex align-items-center gap-2 like-btn ${
          comment.likes?.includes(user.id) ? "liked" : ""
        }`}
        onClick={() => handleLikes(comment.id)}
        disabled={!user}
      >
        <FaThumbsUp
          className={`thumb-icon ${
            comment.likes?.includes(user.id) ? "liked-icon" : ""
          }`}
        />
        <span>Like</span>
      </button>
    </>
  );
};

export default CommentLikeButton;
