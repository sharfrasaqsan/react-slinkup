import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../../utils/NotFound";
import { Link } from "react-router";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { AiOutlineDelete } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { users, setUsers, loading } = useData();

  const [deleteLoading, setDeleteLoading] = useState(null);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  const registeredUsers = users.filter((user) => user.role === "user");
  if (registeredUsers.length === 0)
    return <NotFound text={"No users found!"} />;

  const sortedRegisteredUsers = [...registeredUsers].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleUserDelete = async (userId) => {
    setDeleteLoading(userId);
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setDeleteLoading(null);
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
            {sortedRegisteredUsers?.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/admin/update-user/${user.id}`}>
                    <span type="button">
                      <RiEditBoxLine />
                    </span>
                  </Link>
                  <span
                    onClick={() => handleUserDelete(user.id)}
                    disabled={deleteLoading === user.id}
                  >
                    {deleteLoading === user.id ? (
                      <>
                        <ButtonSpinner />
                      </>
                    ) : (
                      <AiOutlineDelete />
                    )}
                  </span>
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
