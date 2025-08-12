import { formatDistanceToNow } from "date-fns";
import { useData } from "../../contexts/DataContext";
import { Link } from "react-router-dom";
import CommentLikeButton from "./CommentLikeButton";
import { useState } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useAuth } from "../../contexts/AuthContext";

const CommentCard = ({ comment, post }) => {
  const { user } = useAuth();
  const { users, posts, setComments, setPosts } = useData();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const commentUser = users?.find((user) => user.id === comment.commentUserId);
  if (!commentUser) return null;

  const handleDeleteComment = async (commentId) => {
    setDeleteLoading(true);
    try {
      if (commentUser.id === user.id) {
        const batch = writeBatch(db);

        batch.delete(doc(db, "comments", commentId));
        setComments((prev) =>
          prev?.filter((comment) => comment.id !== commentId)
        );

        posts
          ?.filter((post) => post.comments?.includes(commentId))
          .forEach((post) => {
            batch.update(doc(db, "posts", post.id), {
              comments: post.comments.filter((id) => id !== commentId),
            });
          });
        setPosts((prev) =>
          prev?.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  comments: post.comments?.filter((id) => id !== commentId),
                }
              : p
          )
        );

        await batch.commit();
        toast.success("Comment deleted successfully");
      } else {
        toast.error("You can only delete your own comments");
      }
    } catch (err) {
      toast.error("Error deleting comment");
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <div
        style={{
          margin: "1rem 0",
          padding: "1rem",
          border: "1px solid #eee",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Link to={`/user/${commentUser.id}`}>
          {commentUser ? commentUser.username : "Unknown User"}
        </Link>
        <br />
        {comment.body}
        <br />
        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        <br />
        <CommentLikeButton comment={comment} post={post} />
        {commentUser.id === user.id && (
          <button type="button" onClick={() => handleDeleteComment(comment.id)}>
            {deleteLoading ? (
              <>
                Deleting... <ButtonSpinner />
              </>
            ) : (
              "Delete"
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default CommentCard;
