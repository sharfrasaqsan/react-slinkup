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

const PostCard = ({ post }) => {
  const { user, setUser } = useAuth();
  const {
    users,
    setUsers,
    loading,
    setPosts,
    likes,
    setLikes,
    comments,
    setComments,
  } = useData();

  const [deleteLoading, setDeleteLoading] = useState(false);

  // Comment button states
  const [showComment, setShowComment] = useState(false);
  const handleCloseComment = () => {
    setShowComment(false);
  };
  const handleShowComment = () => {
    setShowComment(true);
  };

  const [showEditPost, setShowEditPost] = useState(false);
  const handleCloseEditPost = () => {
    setShowEditPost(false);
  };
  const handleShowEditPost = () => {
    setShowEditPost(true);
  };

  if (loading) return <LoadingSpinner />;

  if (!user) return null;
  if (!post) return <NotFound text={"No post found!"} />;
  if (users?.length === 0) return <NotFound text={"No users found!"} />;

  const postedby = users.find((user) => user.id === post.userId);
  if (!postedby) {
    toast.error("User not found for this post");
    return;
  }
  const deletePost = async (postId) => {
    setDeleteLoading(true);
    try {
      if (user.id === postedby.id) {
        if (!postedby) throw new Error("User not found for this post");

        // writeBatch — which deletes multiple docs in one request.
        const batch = writeBatch(db);

        // Delete post
        batch.delete(doc(db, "posts", postId));
        setPosts((prev) => prev.filter((post) => post.id !== postId));

        // Delete likes
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

        // Update user's posts
        const updatedUserPosts =
          postedby.userPosts?.filter((id) => id !== postId) || [];
        batch.update(doc(db, "users", postedby.id), {
          userPosts: updatedUserPosts,
        });
        setUsers((prev) =>
          prev?.map((user) =>
            user.id === postedby.id
              ? { ...user, userPosts: updatedUserPosts }
              : user
          )
        );
        setUser &&
          setUser((prev) =>
            prev?.id === postedby.id
              ? { ...prev, userPosts: updatedUserPosts }
              : prev
          );

        // writeBatch — which deletes multiple docs in one request.
        await batch.commit();

        toast.success("Post deleted successfully");
      } else {
        toast.error("You can only delete your own posts!");
      }
    } catch (err) {
      toast.error("Error deleting post");
    }
    setDeleteLoading(false);
  };

  return (
    <div
      style={{ margin: "1rem 0", backgroundColor: "#e0e0e0", padding: "1rem" }}
    >
      <p>{postedby.username ? postedby.username : "Unknown"}</p>
      {post?.isUpdated && <span className="badge bg-info">Edited</span>}
      <p>
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </p>
      <p>{post.body ? post.body : "No post body"}</p>

      <LikeCommentCounts post={post} />

      <LikeButton post={post} setPosts={setPosts} />
      <button onClick={handleShowComment}>Comments</button>

      {user.id === postedby.id && (
        <>
          <button onClick={handleShowEditPost}>Edit</button>
          <button type="button" onClick={() => deletePost(post.id)}>
            {deleteLoading ? (
              <>
                Deleting... <ButtonSpinner />
              </>
            ) : (
              "Delete"
            )}
          </button>
        </>
      )}

      <EditPost
        showEditPost={showEditPost}
        handleCloseEditPost={handleCloseEditPost}
        post={post}
        setPosts={setPosts}
      />

      <CommentModal
        showComment={showComment}
        handleCloseComment={handleCloseComment}
        post={post}
      />
    </div>
  );
};

export default PostCard;
