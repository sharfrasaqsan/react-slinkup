import { useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";
import { Link } from "react-router";
import "../../styles/search/SearchedUsers.css";

const SearchedUsers = () => {
  const { user } = useAuth();
  const { users, search } = useData();

  const filteredUsers = useMemo(() => {
    return users?.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  if (filteredUsers?.length === 0) return <NotFound text={"No users found!"} />;
  if (!user) return null;

  return (
    <div className="container search-results-user-card">
      <h5 className="search-results-user-heading">Matched Users</h5>
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user.id} className="user-list-item">
            <Link to={`/my-profile/${user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchedUsers;
