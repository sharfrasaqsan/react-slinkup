import { formatDistanceToNow } from "date-fns";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";
import LikeButton from "../post/LikeButton";
import CommentModal from "../comments/CommentModal";
import { useState } from "react";
import LikeCommentCounts from "../post/LikeCommentCounts";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { users, loading } = useData();

  // Comment button states
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (loading) return <LoadingSpinner />;

  if (!user) return null;
  if (!post) return <NotFound text={"No post found!"} />;
  if (users.legnth === 0) return <NotFound text={"No users found!"} />;

  const postedby = users.find((user) => user.id === post.userId)?.username;

  return (
    <div
      style={{ margin: "1rem 0", backgroundColor: "#e0e0e0", padding: "1rem" }}
    >
      <p>{postedby ? postedby : "Unknown"}</p>
      <p>
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </p>
      <p>{post.body ? post.body : "No post body"}</p>

      <LikeCommentCounts post={post} />

      <LikeButton post={post} />
      <button onClick={handleShow}>Comments</button>
      <CommentModal show={show} handleClose={handleClose} post={post} />
    </div>
  );
};

export default PostCard;
