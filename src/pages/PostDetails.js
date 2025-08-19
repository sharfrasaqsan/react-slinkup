import { useParams } from "react-router";
import { useData } from "../contexts/DataContext";
import NotFound from "../utils/NotFound";
import LoadingSpinner from "../utils/LoadingSpinner";
import PostCard from "../components/feed/PostCard";

const PostDetails = () => {
  const { id } = useParams();
  const { posts, loading } = useData();

  if (loading) return <LoadingSpinner />;

  const post = posts?.find((post) => post.id === id);
  if (!post) return <NotFound text={"No post found!"} />;

  return (
    <section className="container mt-3">
      <PostCard post={post} />
    </section>
  );
};

export default PostDetails;
