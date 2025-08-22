import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import FeedInfiniteScroll from "../../utils/FeedInfiniteScroll";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import PostCard from "./PostCard";

const Feed = () => {
  const { user } = useAuth();
  const { posts, loading } = useData();

  if (loading || !user) return <LoadingSpinner />;

  if (posts.length === 0) return <NotFound text={"No posts found!"} />;

  const followingIds = user?.following || [];

  const feedPosts = posts?.filter(
    (post) => followingIds.includes(post.userId) || post.userId === user.id
  );
  // no sorting required. firestore does it when fetch. orderBy createdAt

  if (followingIds.length > 0 && feedPosts.length === 0)
    return <NotFound text={"No posts from people you follow yet."} />;

  if (feedPosts.length === 0 && followingIds.length === 0)
    return <NotFound text={"You are not following any users."} />;

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
