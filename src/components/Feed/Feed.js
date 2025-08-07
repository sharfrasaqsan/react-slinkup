import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import PostCard from "./PostCard";

const Feed = () => {
  const { posts } = useData();

  if (posts.length === 0)
    return <NotFound text={"No posts found. Please create a post!"} />;

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default Feed;
