import Feed from "../components/feed/Feed";
import CreatePost from "../components/post/CreatePost";

const Home = () => {
  return (
    <section className="container py-4">
      <div className="row">
        <div className="col-12 col-lg-4 mb-4">
          <CreatePost />
        </div>
        <div className="col-12 col-lg-8">
          <Feed />
        </div>
      </div>
    </section>
  );
};

export default Home;
