import { useState } from "react";
import ButtonSpinner from "../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Config";
import { doc, setDoc } from "firebase/firestore";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { user } = useAuth();
  const { setUsers } = useData();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { uid } = userCredentials.user;

      const newUser = {
        id: uid,
        username,
        email,
        password,
        bio: "",
        followers: [],
        following: [],
        userPosts: [],
        role: "user",
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
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
