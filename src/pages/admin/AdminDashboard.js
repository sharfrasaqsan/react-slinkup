import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import { Link } from "react-router-dom";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import ButtonSpinner from "../../utils/ButtonSpinner";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { users, setUsers, loading } = useData();

  const [deleteLoading, setDeleteLoading] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  const registeredUsers = users.filter((user) => user.role === "user");
  if (registeredUsers.length === 0)
    return <NotFound text={"No users found!"} />;

  const handleUserDelete = async (userId) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setDeleteLoading(false);
  };

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
                  <button
                    onClick={() => handleUserDelete(user.id)}
                    disabled={deleteLoading === user.id}
                  >
                    {deleteLoading ? (
                      <>
                        Deleting... <ButtonSpinner />
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
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
