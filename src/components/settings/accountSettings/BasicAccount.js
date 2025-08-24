import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import "../../../styles/settings/Setting.css";

const BasicAccount = () => {
  const { user, setUser } = useAuth();
  const { setUsers, loading } = useData();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const [updateLoading, setUpdateLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPassword(user.password);
    }
  }, [user]);

  const handleUpdate = async (userId) => {
    // setUpdateLoading(true);

    if (!username || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const updatedUser = {
        username,
        email,
        password,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await updateDoc(doc(db, "users", userId), updatedUser);

      setUsers((prev) =>
        prev?.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      setUser((prev) => ({ ...prev, ...updatedUser }));

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    // setUpdateLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="container profile-settings-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id);
        }}
        className="form"
      >
        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            disabled
            readOnly
            className="form-control"
            placeholder="Username"
            value={username}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled
            readOnly
            className="form-control"
            placeholder="Email"
            value={email}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password *
          </label>
          <div className="d-flex align-items-baseline">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              disabled
              readOnly
              className="form-control"
              placeholder="Password"
              value={password}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              style={{ minHeight: "50px" }}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="form-text">
            Please do not share your password with anyone. Reset you password{" "}
            <Link to="reset-password">here.</Link>
          </p>
        </div>

        {/* <button type="submit" className="btn btn-primary w-100 mt-4">
          {updateLoading ? (
            <>
              Updating... <ButtonSpinner />{" "}
            </>
          ) : (
            "Update"
          )}
        </button> */}
      </form>
    </div>
  );
};

export default BasicAccount;
