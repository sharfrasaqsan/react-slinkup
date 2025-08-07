import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { users, loading } = useData();

  if (loading) return <LoadingSpinner />;

  const registeredUsers = users.filter((user) => user.role === "user");

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <p>Welcome, @{user.username}!</p>

      <div>
        <h3>Registered Users</h3>
        <p>{registeredUsers.length} registered users</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Email</th>
              <th>Role</th>
              <th>Manage</th>
            </tr>
          </thead>

          <tbody>
            {registeredUsers.map((user) => (
              <tr key={user.id}>
                <td>{registeredUsers.indexOf(user) + 1}</td>
                <td>{user.username}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/admin/update-user/${user.id}`}>
                    <button>Update</button>
                  </Link>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminDashboard;
