import { useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";
import { Link } from "react-router";
import UserAvatar from "../UserAvatar";
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
        {filteredUsers.map((searchedUser) => (
          <li key={searchedUser.id} className="user-list-item">
            {user.id === searchedUser.id ? (
              <Link to={`/profile/${user.id}`}>
                <UserAvatar width="40px" height="40px" fontSize="40px" />
                {searchedUser.username}
              </Link>
            ) : (
              <Link to={`/user/${searchedUser.id}`}>
                <div className="d-flex align-items-center">
                  <UserAvatar width="40px" height="40px" fontSize="40px" />
                  <div>
                    {searchedUser?.username}
                    <br />
                    <span className="text-muted form-text">
                      {!searchedUser?.followers ||
                      searchedUser.followers.length === 0 ? (
                        <span>New User</span>
                      ) : (
                        <>
                          {searchedUser.followers.length}{" "}
                          {searchedUser.followers.length === 1
                            ? "follower"
                            : "followers"}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchedUsers;
