import { formatDistanceToNow } from "date-fns";
import { useData } from "../../contexts/DataContext";
import { Link } from "react-router";
import CommentLikeButton from "./CommentLikeButton";
import { useState } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useAuth } from "../../contexts/AuthContext";
import EditComment from "./EditComment";
import { FaEllipsisH } from "react-icons/fa";

const CommentCard = ({ comment, post }) => {
  const { user } = useAuth();
  const { users, posts, setComments, setPosts } = useData();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);

  const commentUser = users?.find((user) => user.id === comment.commentUserId);

  const handleCloseComment = () => setShowEditComment(false);
  const handleOpenComment = () => setShowEditComment(true);

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
      } else {
        toast.error("You can only delete your own comments");
      }
    } catch (err) {
      toast.error("Error deleting comment");
    }
    setDeleteLoading(false);
  };

  if (!commentUser) return null;

  return (
    <div
      className="comment-card p-3 my-3 rounded-3 border shadow-sm"
      style={{ backgroundColor: "#f9f9f9" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <Link to={`/user/${commentUser.id}`}>
          <p className="mb-0" style={{ fontWeight: "bold" }}>
            {commentUser ? commentUser.username : "Unknown User"}
          </p>
        </Link>

        {commentUser.id === user.id && (
          <div className="dropdown">
            <button
              className="btn btn-link text-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaEllipsisH />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button className="dropdown-item" onClick={handleOpenComment}>
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  {deleteLoading ? (
                    <>
                      <ButtonSpinner /> Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <p className="mt-2" style={{ fontSize: "1rem" }}>
        {comment.body}
      </p>

      {comment.isUpdated && (
        <span
          style={{
            fontSize: "0.8rem",
            color: "#f39c12",
            display: "inline-block",
            marginTop: "5px",
          }}
        >
          (Edited)
        </span>
      )}

      {user.id === commentUser.id && (
        <EditComment
          comment={comment}
          setComments={setComments}
          showEditComment={showEditComment}
          handleCloseComment={handleCloseComment}
        />
      )}

      <p className="text-muted" style={{ fontSize: "0.8rem" }}>
        {formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
        })}
      </p>

      <CommentLikeButton comment={comment} post={post} />
    </div>
  );
};

export default CommentCard;
