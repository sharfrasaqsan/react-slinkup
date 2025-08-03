import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import NotFound from "../utils/NotFound";

const Expolore = () => {
  const { posts, loading } = useData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!posts.length) {
    return <NotFound text="posts" />;
  }

  const post = posts.find((post) => post.id);

  return (
    <div>
      <h1>Explore</h1>
      <p>{post.id}</p>
      <p>{post.content}</p>
      <p>{post.createdAt}</p>
      <p>Likes: {post.likes.length}</p>
    </div>
  );
};

export default Expolore;
