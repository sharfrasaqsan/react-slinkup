import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import NotFound from "../utils/NotFound";
import _ from "lodash";

const Expolore = () => {
  const { user } = useAuth();
  const { posts, loading } = useData();

  if (loading) return <LoadingSpinner />;

  if (!user) return <NotFound text={"No user found! Please log in."} />;
  if (posts.length === 0) return <NotFound text={"No posts found!"} />;

  const randomPosts = _.sampleSize(posts, 20);

  return (
    <section>
      {randomPosts.map((post) => (
        <div key={post.id}>
          <p>{post.body}</p>
        </div>
      ))}
    </section>
  );
};

export default Expolore;
