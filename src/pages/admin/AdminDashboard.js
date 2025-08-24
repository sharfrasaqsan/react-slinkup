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
import Breadcrumbs from "../../utils/Breadcrumbs";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { users, setUsers, loading } = useData();
  const breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Admin Dashboard" },
  ];

  const [deleteLoading, setDeleteLoading] = useState(null);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  const registeredUsers = users.filter((u) => u.role === "user");
  if (registeredUsers.length === 0)
    return <NotFound text={"No users found!"} />;

  const sortedUsers = [...registeredUsers].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleUserDelete = async (userId) => {
    setDeleteLoading(userId);
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setDeleteLoading(null);
  };

  return (
    <section className="settings-container container py-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h3 className="settings-title mb-3">Admin Dashboard</h3>
      <p className="mb-3 text-end">
        Welcome, <span className="fw-bold">@{user.username}!</span>
      </p>
      <h4 className="mb-3">{registeredUsers.length} Registered Users</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Email</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Register Date</th>
              <th>Role</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.username}</td>
                <td>{u.firstname}</td>
                <td>{u.lastname}</td>
                <td>{u.email}</td>
                <td>{u.gender}</td>
                <td>{u.birthday}</td>
                <td>{u.createdAt?.slice(0, 10)}</td>
                <td>{u.role}</td>
                <td className="d-flex align-items-center gap-2">
                  <Link to={`/admin/update-user/${u.id}`}>
                    <button className="btn btn-sm btn-outline-primary border-0">
                      <RiEditBoxLine size={20} />
                    </button>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleUserDelete(u.id)}
                    disabled={deleteLoading === u.id}
                  >
                    {deleteLoading === u.id ? (
                      <ButtonSpinner />
                    ) : (
                      <AiOutlineDelete size={20} />
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
