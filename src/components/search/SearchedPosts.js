import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import PostCard from "../feed/PostCard";
import { useMemo } from "react";
import "../../styles/search/SearchedPosts.css";

const SearchedPosts = () => {
  const { user } = useAuth();
  const { search, posts } = useData();

  // Reactively re-filters posts when search or post data changes.
  // not used states here.
  const filteredPosts = useMemo(() => {
    return posts?.filter((post) =>
      post.body.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search]);

  if (filteredPosts?.length === 0) return <NotFound text={"No posts found!"} />;
  if (!user) return null;

  return (
    <div className="container search-results-post-card">
      <h5 className="search-results-post-heading">Matched Posts</h5>
      <ul className="post-list">
        {filteredPosts.map((post) => (
          <li key={post.id} className="post-list-item">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchedPosts;
