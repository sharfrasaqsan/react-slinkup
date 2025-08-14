import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Config";
import { doc, getDoc } from "firebase/firestore";
import ButtonSpinner from "../utils/ButtonSpinner";
import "../styles/Login.css";

const Login = () => {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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

    setLoginLoading(true);
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
    setLoginLoading(false);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "50vh" }}
    >
      <div className="row w-100">
        <div className="col-md-6 text-center text-md-start d-flex flex-column justify-content-center px-5">
          <div className="my-5 display-6 fw-bold ls-tight">
            Connect and Grow <br />
            <span className="text-primary">
              with <span style={{ textTransform: "uppercase" }}>Slinkup</span>
            </span>
          </div>

          <p
            className="text-muted"
            style={{ fontSize: "1.2rem", color: "hsl(217, 10%, 50.8%)" }}
          >
            Slinkup brings people together, making social connections
            effortless. Build your network, share ideas, and grow your
            community—all in one place.
          </p>
        </div>

        {/* Right Column: Login Form */}
        <div className="col-md-6">
          <div className="card my-5">
            <div className="card-body p-5">
              <h4 className="mb-4 text-center">Login to Your Account</h4>

              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                className="btn btn-primary w-100 mb-4"
                onClick={handleLogin}
                disabled={loginLoading || user}
              >
                {loginLoading ? (
                  <>
                    Logging in... <ButtonSpinner />
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
