import { useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../utils/NotFound";

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
    <div>
      {user && (
        <ul>
          {(filteredUsers || [])?.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchedUsers;
