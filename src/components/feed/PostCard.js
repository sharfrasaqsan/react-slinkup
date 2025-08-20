import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";
import LikeButton from "../post/LikeButton";
import CommentModal from "../comments/CommentModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/Config";
import EditPost from "../post/EditPost";
import "../../styles/post/PostCard.css";
import { useLocation } from "react-router";
import { TbPencilCheck } from "react-icons/tb";
import CardTop from "./postCard/CardTop";
import CardBody from "./postCard/CardBody";
import CardBottom from "./postCard/CardBottom";

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
  } = useData();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);

  const location = useLocation();

  const [alreadyFollowed, setAlreadyFollowed] = useState(false);

  const postedBy = users.find((user) => user.id === post.userId);

  // Check if user is already followed
  useEffect(() => {
    if (postedBy && (postedBy.followers || [])) {
      setAlreadyFollowed((postedBy.followers || [])?.includes(user?.id));
    } else {
      setAlreadyFollowed(false);
    }
  }, [postedBy, user?.id]);

  if (loading) return <LoadingSpinner />;
  if (!user || !post) return <NotFound text={"No post found!"} />;
  if (users?.length === 0) return <NotFound text={"No users found!"} />;

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
    <div className="card mb-3 border rounded-3">
      <div className="card-body p-0">
        <CardTop
          user={user}
          post={post}
          postedBy={postedBy}
          alreadyFollowed={alreadyFollowed}
          setAlreadyFollowed={setAlreadyFollowed}
          setShowEditPost={setShowEditPost}
          handleDeletePost={handleDeletePost}
          deleteLoading={deleteLoading}
          location={location}
        />

        {post.isUpdated && (
          <div className="d-flex align-items-center text-warning form-text mt-0 mb-3 ms-3">
            <TbPencilCheck
              style={{ fontSize: "1rem", marginRight: "0.5rem" }}
            />
            <span>Edited</span>
          </div>
        )}

        <CardBody
          post={post}
          location={location}
          setShowComment={setShowComment}
        />

        <CardBottom
          post={post}
          setShowComment={setShowComment}
          setPosts={setPosts}
          LikeButton={LikeButton}
        />
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
