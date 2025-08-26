import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import FeedInfiniteScroll from "../../utils/FeedInfiniteScroll";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import PostCard from "./PostCard";

const Feed = () => {
  const { user } = useAuth();
  const { posts, loading } = useData();

  const isUserReady = !!user?.id && Array.isArray(user?.following);
  const isDataReady = Array.isArray(posts) && posts.length > 0;

  if (loading || !isUserReady || !isDataReady) {
    return <LoadingSpinner />;
  }

  const userId = user.id;
  const followingIds = user.following;

  const feedPosts = posts.filter(
    (post) => followingIds.includes(post.userId) || post.userId === userId
  );

  if (feedPosts.length === 0) {
    return (
      <NotFound
        text={
          "Your feed is empty. Start by following users or creating your first post!"
        }
      />
    );
  }

  return (
    <FeedInfiniteScroll posts={feedPosts}>
      {feedPosts.map((post) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </FeedInfiniteScroll>
  );
};

export default Feed;
