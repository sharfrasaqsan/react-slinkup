import SearchedPosts from "./SearchedPosts";
import SearchedUsers from "./SearchedUsers";
import "../../styles/search/SearchedResults.css";

const SearchedResults = ({ search, selected, setSelected }) => {
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

  return null;
};

export default SearchedResults;
