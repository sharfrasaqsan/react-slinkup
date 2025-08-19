import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import PostCard from "./PostCard";

const Feed = () => {
  const { user } = useAuth();
  const { posts, loading } = useData();

  if (loading) return <LoadingSpinner />;

  if (posts.length === 0) return <NotFound text={"No posts found!"} />;

  const followingIds = user?.following || [];

  const feedPosts = posts?.filter((post) => followingIds.includes(post.userId));

  if (followingIds.length > 0 && feedPosts.length === 0)
    return <NotFound text={"No posts from people you follow yet."} />;

  if (feedPosts.length === 0)
    return (
      <NotFound
        text={"You are not following any users. Please follow for posts."}
      />
    );

  const sortedFeedPosts = [...feedPosts]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {sortedFeedPosts.map((post) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </>
  );
};

export default Feed;
