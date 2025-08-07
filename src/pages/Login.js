import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Config";
import { doc, getDoc } from "firebase/firestore";
import ButtonSpinner from "../utils/ButtonSpinner";

const Login = () => {
  const { user, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (user) {
      toast.error("You are already logged in.");
      return;
    }

    setRegisterLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      const res = await getDoc(doc(db, "users", user.uid));
      if (!res.exists()) {
        toast.error("User does not exist");
      }
      setUser(res.data());
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
    setRegisterLoading(false);
  };

  return (
    <section>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit">
          {registerLoading ? (
            <>
              Logging in... <ButtonSpinner />
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </section>
  );
};

export default Login;
