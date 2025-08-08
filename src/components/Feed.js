import { useData } from "../contexts/DataContext";
import PostCard from "./post/PostCard";

const Feed = () => {
  const { posts } = useData();

  if (posts.length === 0) return null;

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
