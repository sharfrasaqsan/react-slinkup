import CreatePost from "../components/CreatePost";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <section>
      <h2>Home</h2>

      {user && <CreatePost />}
    </section>
  );
};

export default Home;
