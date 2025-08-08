import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";

const AllUsers = () => {
  const { users } = useData();

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users
          ?.filter((user) => user.role === "user")
          ?.map((user) => (
            <li key={user.id}>
              <Link to={`/user/${user.id}`}>{user.username}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AllUsers;
