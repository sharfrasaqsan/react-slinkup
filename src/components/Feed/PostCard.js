import { formatDistanceToNow } from "date-fns";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";

import LoadingSpinner from "../../utils/LoadingSpinner";
import LikeButton from "./LikeButton";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { users, loading } = useData();

  if (loading) return <LoadingSpinner />;

  if (!user) return <NotFound text={"No user found!"} />;
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
      <LikeButton post={post} />
    </div>
  );
};

export default PostCard;
