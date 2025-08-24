import { useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";
import "../../styles/search/SearchedUsers.css";
import UserList from "./UserList";

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
      <h5>Matched Users</h5>
      <ul className="user-list">
        {filteredUsers.map((searchedUser) => (
          <UserList
            key={searchedUser.id}
            searchedUser={searchedUser}
            user={user}
          />
        ))}
      </ul>
    </div>
  );
};

export default SearchedUsers;
