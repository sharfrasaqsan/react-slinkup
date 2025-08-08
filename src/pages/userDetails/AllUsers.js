import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataContext";

const AllUsers = () => {
  const { users } = useData();

  return (
    <div>
      <h2>All Users</h2>
      {users.map((user) => (
        <ul key={user.id}>
          <Link to={`/user/${user.id}`}>
            <li>{user.username}</li>
            <li>{user.email}</li>
          </Link>
        </ul>
      ))}
    </div>
  );
};

export default AllUsers;
