import { useState } from "react";
import ButtonSpinner from "../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router";
import "../styles/Register.css";

// Regular Expression for email validation
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const Register = () => {
  const { user } = useAuth();
  const { setUsers } = useData();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setRegisterLoading(true);
    try {
      if (
        !firstname ||
        !lastname ||
        !username ||
        !email ||
        !password ||
        !confirmPassword ||
        !gender ||
        !birthday
      ) {
        toast.error("Please fill in all fields.");
        return;
      }

      if (user) {
        toast.error("You are already logged in.");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }

      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const userDocs = await getDocs(
        query(collection(db, "users"), where("username", "==", username))
      );
      if (userDocs.docs.length > 0) {
        toast.error("Username already exists. Please choose another username.");
        return;
      }

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredentials.user;

      const newUser = {
        id: uid,
        username: username.replace(/[^a-z0-9]/gi, "").toLowerCase(),
        firstname,
        lastname,
        email,
        password,
        bio: "",
        followers: [],
        following: [],
        userPosts: [],
        role: "user",
        location: "",
        website: "",
        social: {},
        birthday,
        gender,
        occupation: [],
        education: [],
        relationship: "",
        languages: [],
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await setDoc(doc(db, "users", uid), newUser);
      setUsers((prev) => [...prev, newUser]);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success("Registration successful!");
      navigate("/register-details");
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="row w-100">
        <div className="col-md-6 text-center text-md-start d-flex flex-column justify-content-center">
          <div className="my-3 fw-bold ls-tight">
            Create Your Account on <br />
            <span className="text-primary">Slinkup</span>
          </div>

          <p p className="text-muted" style={{ fontSize: "1rem" }}>
            Join Slinkup to connect with others, share ideas, and build your
            network in a social community.
          </p>
        </div>

        <div className="col-md-6">
          <div className="card my-5">
            <div className="card-body">
              <h4 className="mb-4 text-center">Register for an Account</h4>

              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div className="mb-3">
                  <label htmlFor="firstname" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    className="form-control"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    autoFocus
                    placeholder="First Name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="lastname" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    className="form-control"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="register-details-field mb-3">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  id="gender"
                  className="form-select form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="register-details-field mb-3">
                <label htmlFor="birthday" className="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="birthday"
                  className="form-control"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <span className="text-muted">
                * Password must be at least 8 characters
              </span>

              <button
                type="submit"
                className="btn btn-primary w-100 my-3"
                onClick={handleRegister}
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <>
                    Registering... <ButtonSpinner />
                  </>
                ) : (
                  "Register"
                )}
              </button>

              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
