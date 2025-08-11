import Feed from "../components/feed/Feed";
import CreatePost from "../components/post/CreatePost";

const Home = () => {
  return (
    <section>
      <CreatePost />
      <Feed />
    </section>
  );
};

export default Home;
