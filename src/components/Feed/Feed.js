import { useData } from "../../contexts/DataContext";
import PostCard from "./PostCard";
import LikeButton from "./LikeButton";

const Feed = () => {
  const { posts } = useData();

  if (posts.length === 0) return null;

  return (
    <>
      {[...posts].reverse().map((post) => (
        <PostCard key={post.id} post={post} LikeButton={LikeButton} />
      ))}
    </>
  );
};

export default Feed;
