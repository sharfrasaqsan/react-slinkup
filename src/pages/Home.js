import Feed from "../components/feed/Feed";
import CreatePost from "../components/post/CreatePost";

const Home = () => {
  return (
    <section className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="card-body">
            <CreatePost />
            <Feed />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
