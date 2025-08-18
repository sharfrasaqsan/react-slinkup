import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import NotFound from "../utils/NotFound";
import _ from "lodash";
import "../styles/Explore.css";
import { Link } from "react-router";

const Explore = () => {
  const { user } = useAuth();
  const { posts, loading } = useData();

  if (loading) return <LoadingSpinner />;
  if (!user) return <NotFound text={"No user found! Please log in."} />;
  if (posts.length === 0) return <NotFound text={"No posts found!"} />;

  const randomPosts = _.sampleSize(posts, 20);

  return (
    <section className="container py-4">
      <div className="row g-4">
        {randomPosts.map((post) => (
          <div className="col-md-6 col-lg-4" key={post.id}>
            <Link to={`/post/${post.id}`}>
              <div className="explore-card h-100">
                <div className="explore-card-body">
                  {post.body.length > 100
                    ? `${post.body.slice(0, 100)}...`
                    : post.body}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Explore;
