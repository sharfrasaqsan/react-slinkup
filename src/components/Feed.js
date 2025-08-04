import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import NotFound from "../utils/NotFound";
import PostCard from "./PostCard";

const Feed = () => {
  const { users, posts, loading } = useData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!posts.length) {
    return <NotFound text="posts" />;
  }

  const post = posts.find((post) => post.id);
  const postedUser = users.find((user) => user.id === post.userId);

  return (
    <div>
      {posts.reverse().map((post) => (
        <PostCard key={post.id} post={post} postedUser={postedUser} />
      ))}
    </div>
  );
};

export default Feed;
