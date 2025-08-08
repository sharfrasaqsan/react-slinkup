import Feed from "../components/Feed";
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
