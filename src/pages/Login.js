import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/Config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logining, setLogining] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // if (!isValidEmail) {
    //   toast.error("Invalid email format");
    //   return;
    // }

    setLogining(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const res = await getDoc(doc(db, "users", user.uid));
      if (!res.exists()) {
        toast.error("User does not exist");
        return;
      }
      setUser({ id: user.uid, ...res.data() });
      toast.success("Login successful");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      toast.error(`Failed to login, ${err.message}`);
    } finally {
      setLogining(false);
    }
  };

  return (
    <section>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          autoFocus
          required
          disabled={logining}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          required
          disabled={logining}
        />

        <button type="submit" className="btn btn-primary" disabled={logining}>
          {logining ? "Logging in ..." : "Login"}
        </button>
      </form>
    </section>
  );
};

export default Login;
