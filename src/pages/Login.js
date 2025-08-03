import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/Config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ButtonSpinner from "../utils/ButtonSpinner";
import { getAuthErrorMessage } from "../utils/authErrors";

const Login = () => {
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error("Invalid email format");
      return;
    }

    setLoginLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const res = await getDoc(doc(db, "users", user.uid));
      if (!res.exists()) {
        toast.error("User does not exist! Please try again.");
        return;
      }
      setUser({ id: user.uid, ...res.data() });
      toast.success("Login successful");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      toast.error(getAuthErrorMessage(err.code));
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <section>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          {" "}
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
            disabled={loginLoading}
          />
        </div>

        <div>
          {" "}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
            disabled={loginLoading}
          />
          <span>* Password must be at least 8 characters.</span>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loginLoading}
        >
          {loginLoading ? (
            <>
              <ButtonSpinner />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
