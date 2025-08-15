const Search = () => {
  return (
    <div className="search-container">
      <form className="d-flex">
        <input
          type="text"
          placeholder="Search..."
          className="form-control form-control-sm"
        />
        <button type="submit" className="btn btn-primary btn-sm ms-2">
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
