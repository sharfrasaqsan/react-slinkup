import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <section>
      <h2>Home</h2>

      {user && <CreatePost />}
      <Feed />
    </section>
  );
};

export default Home;
