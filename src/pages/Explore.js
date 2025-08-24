import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import NotFound from "../utils/NotFound";
import _ from "lodash";
import "../styles/Explore.css";
import { Link } from "react-router";
import PostCard from "../components/feed/PostCard";
import { useMemo } from "react";

const Explore = () => {
  const { user } = useAuth();
  const { posts, loading } = useData();

  // useMemo - Caches a value from a calculation (To avoid recalculating on every render)
  // useEffect - Runs a function after render for side effects (To do things outside React (API, DOM, subscriptions))

  const explorePosts = posts?.filter(
    (post) => post.userId !== user.id && !user.following.includes(post.userId)
  );

  const randomPosts = useMemo(() => {
    return _.sampleSize(explorePosts, 30);
  }, [explorePosts]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <NotFound text={"No user found! Please log in."} />;
  if (posts.length === 0) return <NotFound text={"No posts found!"} />;
  if (randomPosts.length === 0) return <NotFound text={"No posts found!"} />;

  return (
    <section className="container py-4">
      <div className="masonry">
        {randomPosts?.map((post) => (
          <div className="masonry-item" key={post.id}>
            <Link to={`/post/${post.id}`}>
              <PostCard post={post} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Explore;
