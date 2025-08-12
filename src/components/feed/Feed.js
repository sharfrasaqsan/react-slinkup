import { useData } from "../../contexts/DataContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import PostCard from "./PostCard";

const Feed = () => {
  const { posts, loading } = useData();

  if (loading) return <LoadingSpinner />;

  if (posts.length === 0) return <NotFound text={"No posts found!"} />;

  // Sort posts by date. b - a means, b is after a. so b is newer; and comes first.
  const sortedPosts = [...posts]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {sortedPosts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default Feed;
