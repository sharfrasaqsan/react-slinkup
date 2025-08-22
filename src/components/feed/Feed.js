import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import PostCard from "./PostCard";
import PostLoadingSpinner from "../../utils/PostLoadingSpinner";

const Feed = () => {
  const { user } = useAuth();
  const { posts, loading, fetchMorePosts, hasMore } = useData();

  if (loading || !user) return <LoadingSpinner />;

  if (posts.length === 0) return <NotFound text={"No posts found!"} />;

  const followingIds = user?.following || [];

  const feedPosts = posts?.filter(
    (post) => followingIds.includes(post.userId) || post.userId === user.id
  );

  if (followingIds.length > 0 && feedPosts.length === 0)
    return <NotFound text={"No posts from people you follow yet."} />;

  if (feedPosts.length === 0 && followingIds.length === 0)
    return <NotFound text={"You are not following any users."} />;

  const sortedFeedPosts = [...feedPosts]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <InfiniteScroll
      dataLength={sortedFeedPosts.length}
      next={fetchMorePosts}
      hasMore={hasMore}
      loader={<PostLoadingSpinner />}
      endMessage={<p className="text-center my-3">No more posts to load</p>}
    >
      {sortedFeedPosts.map((post) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default Feed;
