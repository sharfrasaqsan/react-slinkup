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
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { user } = useAuth();
  const { setUsers } = useData();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setRegisterLoading(true);
    try {
      if ((!username, !email, !password)) {
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

      if (!email.includes("@")) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      // Check if username already exists in the database
      const userDocs = await getDocs(
        query(collection(db, "users"), where("username", "==", username))
      );
      if (userDocs.docs.length > 0) {
        toast.error("Username already exists. Please choose another username.");
        return;
      }

      // Create a new user
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the user ID from the userCredentials
      const { uid } = userCredentials.user;

      // Create a new user document
      const newUser = {
        id: uid,
        username: username.trim().toLowerCase(),
        firstname,
        lastname,
        email,
        password,
        bio: "",
        followers: [],
        following: [],
        userPosts: [],
        role: "user",
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
      // Add the new user document to the "users" collection
      await setDoc(doc(db, "users", uid), newUser);
      setUsers((prev) => [...prev, newUser]);
      setUsername("");
      setEmail("");
      setPassword("");
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
    setRegisterLoading(false);
  };

  return (
    <section>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">Firstname</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Enter your firstname"
            required
            autoFocus
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Lastname</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Enter your lastname"
            required
            autoFocus
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>* Password must be at least 8 characters</span>
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          {registerLoading ? (
            <>
              Registering... <ButtonSpinner />
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </section>
  );
};

export default Register;
