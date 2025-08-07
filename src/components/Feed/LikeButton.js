import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

const LikeButton = ({ post }) => {
  const { user } = useAuth();
  const { handleLikes } = useData();

  if (!post) return null;
  if (!user) return null;

  return (
    <button onClick={() => handleLikes(post.id)} disabled={!user}>
      {(post.likes || [])?.includes(user.id) ? "Unlike" : "Like"}
    </button>
  );
};

export default LikeButton;
