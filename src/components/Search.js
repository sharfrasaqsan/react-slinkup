import { IoSearchSharp } from "react-icons/io5";
import "../styles/Search.css";
import { useData } from "../contexts/DataContext";
import { IoMdClose } from "react-icons/io";

const Search = () => {
  const { searchInput, setSearchInput, handleSearch } = useData();

  return (
    <div className="search-container">
      <form className="d-flex align-items-center" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          className="form-control search-input"
          aria-label="Search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className="d-flex align-items-center">
          <button className="btn d-flex align-items-center">
            <IoSearchSharp size={20} />
          </button>
          {searchInput && (
            <button
              className="btn d-flex align-items-center"
              onClick={() => setSearchInput("")}
            >
              <IoMdClose size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Search;
