import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";

const LikeButton = () => {
  const { user } = useAuth();
  const { handleLikes, post } = useData();
  return (
    <button onClick={() => handleLikes(post.id)} disabled={!user}>
      {(post.likes || [])?.includes(user.id) ? "Unlike" : "Like"}
    </button>
  );
};

export default LikeButton;
