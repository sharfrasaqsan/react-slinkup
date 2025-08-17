import { useState } from "react";
import Feed from "../components/feed/Feed";
import CreatePost from "../components/post/CreatePost";
import SearchedPosts from "../components/search/SearchedPosts";
import SearchedUsers from "../components/search/SearchedUsers";
import { useData } from "../contexts/DataContext";
import "../styles/Home.css";

const Home = () => {
  const { search } = useData();

  const [selected, setSelected] = useState("users");

  if (search.trim()?.length > 0) {
    return (
      <section className="searched-container">
        <div className="searched-toggle">
          <button
            className={`searched-tab ${selected === "users" ? "active" : ""}`}
            onClick={() => setSelected("users")}
          >
            Users
          </button>
          <button
            className={`searched-tab ${selected === "posts" ? "active" : ""}`}
            onClick={() => setSelected("posts")}
          >
            Posts
          </button>
        </div>

        <div className="searched-results">
          {selected === "users" && <SearchedUsers />}
          {selected === "posts" && <SearchedPosts />}
        </div>
      </section>
    );
  }

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
