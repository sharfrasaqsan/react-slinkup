import Feed from "../components/feed/Feed";
import CreatePost from "../components/post/CreatePost";
import SuggestUsers from "../components/users/SuggestUsers";

const Home = () => {
  return (
    <section className="container mt-3">
      <div className="row">
        <div className="col-md-8">
          <CreatePost />
          <Feed />
        </div>
        <div className="col-md-4 d-none d-md-block">
          <SuggestUsers />
        </div>
      </div>
    </section>
  );
};

export default Home;
