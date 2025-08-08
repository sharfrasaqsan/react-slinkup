import { useData } from "../contexts/DataContext";
import PostCard from "./post/PostCard";

const Feed = () => {
  const { posts } = useData();

  if (posts.length === 0) return null;

  return (
    <>
      {[...posts].reverse().map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default Feed;
