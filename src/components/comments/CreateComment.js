import { useState } from "react";
import { TiArrowRightOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { format } from "date-fns";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { useRef } from "react";

const CreateComment = ({ post }) => {
  const { user } = useAuth();
  const { setComments, setPosts, setNotifications } = useData();

  const [comment, setComment] = useState("");

  const [commentLoading, setCommentLoading] = useState(false);

  const commentRef = useRef(null);

  if (!user) return null;

  const handleCommentSubmit = async (postId) => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    setCommentLoading(true);
    try {
      const newComment = {
        body: comment.trim(),
        postId,
        postUserId: post.userId,
        commentUserId: user.id,
        likes: [],
        isUpdated: false,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      const res = await addDoc(collection(db, "comments"), newComment);

      setComments((prev) => [...prev, { id: res.id, ...newComment }]);
      setComment("");

      // Update the comments in posts->comments
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion(res.id), // Safely add without overwriting existing comments, even if multiple users comment at once
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });

      setPosts((prev) =>
        prev?.map((post) =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), res.id] }
            : post
        )
      );

      // Create a notification for the post author
      const newNotification = {
        postId,
        recieverId: post.userId,
        senderId: user.id,
        type: "comment",
        isRead: false,
        message: `${user.username} commented on your post.`,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      const resNotification = await addDoc(
        collection(db, "notifications"),
        newNotification
      );

      setNotifications((prev) => [
        ...prev,
        { id: resNotification.id, ...newNotification },
      ]);
    } catch (err) {
      toast.error("Failed to create comment!");
    }
    setCommentLoading(false);
    commentRef.current.focus();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCommentSubmit(post.id);
      }}
    >
      <input
        type="text"
        id="comment"
        name="comment"
        placeholder="Enter your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        autoFocus
        ref={commentRef}
      />
      <button type="submit">
        {commentLoading ? <ButtonSpinner /> : <TiArrowRightOutline />}
      </button>
    </form>
  );
};

export default CreateComment;
