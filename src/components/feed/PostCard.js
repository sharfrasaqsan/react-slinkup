import { formatDistanceToNow } from "date-fns";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";
import LikeButton from "../post/LikeButton";
import CommentModal from "../comments/CommentModal";
import { useState } from "react";
import LikeCommentCounts from "../post/LikeCommentCounts";
import { toast } from "react-toastify";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/Config";
import ButtonSpinner from "../../utils/ButtonSpinner";
import EditPost from "../post/EditPost";
import { FaCommentDots, FaEllipsisH } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import "../../styles/post/PostCard.css";
import { Link, useLocation } from "react-router";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const {
    users,
    setUsers,
    loading,
    setPosts,
    likes,
    setLikes,
    comments,
    setComments,
    notifications,
    setNotifications,
    setSearch,
  } = useData();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);

  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user || !post) return <NotFound text={"No post found!"} />;
  if (users?.length === 0) return <NotFound text={"No users found!"} />;

  const postedBy = users.find((user) => user.id === post.userId);
  if (!postedBy) {
    toast.error("User not found for this post");
    return null;
  }

  const handleDeletePost = async (postId) => {
    setDeleteLoading(true);
    try {
      if (user.id !== postedBy.id) {
        toast.error("You can only delete your own posts!");
        return;
      }

      const batch = writeBatch(db);

      // Delete the post
      batch.delete(doc(db, "posts", postId));
      setPosts((prev) => prev.filter((post) => post.id !== postId));

      // Delete Likes
      likes
        ?.filter((like) => like.postId === postId)
        .forEach((like) => {
          batch.delete(doc(db, "likes", like.id));
        });
      setLikes((prev) => prev.filter((like) => like.postId !== postId));

      // Delete comments
      comments
        ?.filter((comment) => comment.postId === postId)
        .forEach((comment) => {
          batch.delete(doc(db, "comments", comment.id));
        });
      setComments((prev) =>
        prev.filter((comment) => comment.postId !== postId)
      );

      // Delete notifications
      notifications
        ?.filter((notification) => notification.postId === postId)
        .forEach((notification) => {
          batch.delete(doc(db, "notifications", notification.id));
        });
      setNotifications((prev) =>
        prev.filter((notification) => notification.postId !== postId)
      );

      // Update user posts list
      const updatedUserPosts = postedBy.userPosts.filter((id) => id !== postId);
      batch.update(doc(db, "users", postedBy.id), {
        userPosts: updatedUserPosts,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === postedBy.id
            ? { ...user, userPosts: updatedUserPosts }
            : user
        )
      );

      // Commit the batch
      await batch.commit();

      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Error deleting post");
    }
    setDeleteLoading(false);
  };

  return (
    <div className="card mb-3 border-0 rounded-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="card-title mb-0">
              {user.id === postedBy.id ? (
                <Link to={`/profile/${user.id}`} onClick={() => setSearch("")}>
                  {postedBy.username || "Unknown User"}
                </Link>
              ) : (
                <Link to={`/user/${postedBy.id}`} onClick={() => setSearch("")}>
                  {postedBy.username || "Unknown User"}
                </Link>
              )}
            </p>

            <p className="text-muted" style={{ fontSize: "0.9rem", margin: 0 }}>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>

            {post.isUpdated && (
              <div
                className="d-flex align-items-center text-warning mt-1"
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  color: "#f39c12",
                }}
              >
                <LuPencilLine
                  style={{ fontSize: "1rem", marginRight: "0.5rem" }}
                />
                <span>Edited</span>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end">
            {user.id === postedBy.id && (
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

                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setShowEditPost(true)}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleDeletePost(post.id)}
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
        </div>

        {location.pathname === `/post/${post.id}` ? (
          <p
            className="card-text mt-3 p-3 border text-muted"
            style={{ border: "1px solid #ddd", cursor: "default" }}
          >
            {post.body || "No content"}
          </p>
        ) : (
          <Link
            to={`/post/${post.id}`}
            onClick={() => {
              setShowComment(false);
              setSearch("");
            }}
          >
            <p
              className="card-text mt-3 p-3 border"
              style={{ border: "1px solid #ddd" }}
            >
              {post.body || "No content"}
            </p>
          </Link>
        )}

        <LikeCommentCounts post={post} />

        <div className="d-flex gap-3 mt-3">
          <LikeButton post={post} setPosts={setPosts} />

          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
            onClick={() => setShowComment(true)}
          >
            <FaCommentDots />
            {post.comments?.length} Comments
          </button>
        </div>
      </div>

      <EditPost
        showEditPost={showEditPost}
        handleCloseEditPost={() => setShowEditPost(false)}
        post={post}
        setPosts={setPosts}
      />

      <CommentModal
        showComment={showComment}
        handleCloseComment={() => setShowComment(false)}
        post={post}
      />
    </div>
  );
};

export default PostCard;
