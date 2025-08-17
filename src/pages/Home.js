import Feed from "../components/feed/Feed";
import CreatePost from "../components/post/CreatePost";

const Home = () => {
  return (
    <section className="container">
      <div>
        <CreatePost />
        <Feed />
      </div>
    </section>
  );
};

export default Home;
