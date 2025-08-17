import Feed from "../components/feed/Feed";
import CreatePost from "../components/post/CreatePost";
import SearchedPosts from "../components/search/SearchedPosts";
import SearchedUsers from "../components/search/SearchedUsers";
import { useData } from "../contexts/DataContext";

const Home = () => {
  const { search } = useData();

  if (search.trim()?.length > 0) {
    return (
      <section className="container">
        <div className="row">
          <div className="col-md-6">
            <SearchedUsers />
          </div>
          <div className="col-md-6">
            <SearchedPosts />
          </div>
        </div>
      </section>
    );
  }

  if (search.trim()?.length === 0) {
    return (
      <section className="container">
        <div className="row">
          <div className="col-12">
            <CreatePost />
            <Feed />
          </div>
        </div>
      </section>
    );
  }

  return;
};

export default Home;
