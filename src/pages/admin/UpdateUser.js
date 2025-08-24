import { useNavigate, useParams } from "react-router";
import { useData } from "../../contexts/DataContext";
import LoadingSpinner from "../../utils/LoadingSpinner";
import NotFound from "../NotFound";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { format } from "date-fns";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { useAuth } from "../../contexts/AuthContext";
import Breadcrumbs from "../../utils/Breadcrumbs";

const UpdateUser = () => {
  const { user } = useAuth();
  const { users, setUsers, loading } = useData();

  const [editUsername, setEditUsername] = useState("");
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const updatedUser = users?.find((u) => u.id === id);

  useEffect(() => {
    if (updatedUser) {
      setEditUsername(updatedUser.username);
      setEditFirstname(updatedUser.firstname);
      setEditLastname(updatedUser.lastname);
      setEditPassword(updatedUser.password);
    }
  }, [updatedUser]);

  if (loading) return <LoadingSpinner />;
  if (
    !updatedUser ||
    users.length === 0 ||
    updatedUser.role !== "user" ||
    !user
  )
    return <NotFound text={"User not found!"} />;

  const breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Admin Dashboard", link: `/admin/dashboard/${user.id}` },
    { label: "Update User" },
  ];

  const handleUpdateUser = async (userId) => {
    if (!editUsername || !editFirstname || !editLastname || !editPassword) {
      toast.error("Please fill in all the fields!");
      return;
    }

    if (editPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    if (editPassword !== updatedUser.password) {
      toast.error("Passwords do not match!");
      return;
    }

    const userDocs = await getDocs(
      query(
        collection(db, "users"),
        where("role", "==", "user"),
        where("username", "==", editUsername)
      )
    );
    const userDoc = userDocs.docs[0];
    if (userDoc && userDoc.id !== userId) {
      toast.error("Username already exists!");
      return;
    }

    setUpdateLoading(true);
    try {
      const updatedData = {
        username: editUsername,
        firstname: editFirstname,
        lastname: editLastname,
        password: editPassword,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await updateDoc(doc(db, "users", userId), updatedData);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
      );
      toast.success("User updated successfully!");
      navigate(`/admin/dashboard/${user.id}`);
    } catch (err) {
      toast.error(err.message);
    }
    setUpdateLoading(false);
  };

  const handleCancelUpdate = () => {
    setCancelLoading(true);
    setTimeout(() => {
      navigate(`/admin/dashboard/${user.id}`);
      toast.warning("Update canceled!");
      setCancelLoading(false);
    }, 1500);
  };

  return (
    <section className="settings-container container my-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <h3 className="settings-title mb-3">Update Registered User</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            className="form-control"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">
            Firstname
          </label>
          <input
            id="firstname"
            className="form-control"
            value={editFirstname}
            onChange={(e) => setEditFirstname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">
            Lastname
          </label>
          <input
            id="lastname"
            className="form-control"
            value={editLastname}
            onChange={(e) => setEditLastname(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-flex gap-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateLoading}
            onClick={() => handleUpdateUser(updatedUser.id)}
          >
            {updateLoading ? (
              <>
                Updating... <ButtonSpinner />
              </>
            ) : (
              "Update User"
            )}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={cancelLoading}
            onClick={handleCancelUpdate}
          >
            {cancelLoading ? (
              <>
                Canceling... <ButtonSpinner />
              </>
            ) : (
              "Cancel"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateUser;
