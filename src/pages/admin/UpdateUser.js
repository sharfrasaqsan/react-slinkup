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

const UpdateUser = () => {
  const { user } = useAuth();
  const { users, setUsers, loading } = useData();

  const [editUsername, setEditUsername] = useState("");
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [cencelLoading, setCencelLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const updatedUser = users?.find((user) => user.id === id);

  useEffect(() => {
    if (updatedUser) {
      setEditUsername(updatedUser.username);
      setEditFirstname(updatedUser.firstname);
      setEditLastname(updatedUser.lastname);
      setEditPassword(updatedUser.password);
    }
  }, [
    updatedUser,
    setEditUsername,
    setEditFirstname,
    setEditLastname,
    setEditPassword,
  ]);

  // Handle errors
  if (loading) return <LoadingSpinner />;
  if (!updatedUser) return <NotFound text={"User not found!"} />;
  if (users.length === 0) return <NotFound text={"No users found!"} />;
  if (updatedUser.role !== "user") return <NotFound text={"User not found!"} />;
  if (!user) return <NotFound text={"User not found!"} />;

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

    // Check if username already exists
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
      // Create updated user
      const updatedUser = {
        username: editUsername,
        firstname: editFirstname,
        lastname: editLastname,
        password: editPassword,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      // Update user in database
      await updateDoc(doc(db, "users", userId), updatedUser);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );
      toast.success("User updated successfully!");
      navigate(`/admin/dashboard/${user.id}`);
    } catch (err) {
      toast.error(err.message);
    }
    setUpdateLoading(false);
  };

  const handleCancelUpdate = () => {
    setCencelLoading(true);

    setTimeout(() => {
      navigate(`/admin/dashboard/${user.id}`);
      toast.warning("Update canceled!");
      setCencelLoading(false);
    }, 2000);
  };

  return (
    <section>
      <h2>Update Registered User</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="Username"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="firstname">Firstname</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={editFirstname}
            onChange={(e) => setEditFirstname(e.target.value)}
            required
            placeholder="Firstname"
          />
        </div>
        <div>
          <label htmlFor="lastname">Lastname</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            required
            value={editLastname}
            onChange={(e) => setEditLastname(e.target.value)}
            placeholder="Lastname"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
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
          type="submit"
          disabled={cencelLoading}
          onClick={handleCancelUpdate}
        >
          {cencelLoading ? (
            <>
              Cenceling... <ButtonSpinner />
            </>
          ) : (
            "Cencel"
          )}
        </button>
      </form>
    </section>
  );
};

export default UpdateUser;
