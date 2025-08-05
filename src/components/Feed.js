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

  return (
    <div>
      {[...posts].reverse().map((post) => {
        const postedUser = users.find((user) => user.id === post.userId);
        return (
          <PostCard
            key={post.id}
            post={post}
            postedUser={postedUser}
          />
        );
      })}
    </div>
  );
};

export default Feed;
