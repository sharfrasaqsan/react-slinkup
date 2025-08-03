import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/Config";
import { doc, setDoc } from "firebase/firestore";
import { useData } from "../contexts/DataContext";
import { useNavigate } from "react-router-dom";
import ButtonSpinner from "../utils/ButtonSpinner";

const Register = () => {
  const { setUsers } = useData();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all the required fields!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error("Invalid email format!");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters!");
      return;
    }

    if (username.length > 20) {
      toast.error("Username must be less than 20 characters!");
      return;
    }

    setRegisterLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { userId } = userCredential.user;
      const userData = {
        id: userId,
        username,
        email,
        profilePic: "",
        bio: "",
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        role: "user",
      };
      const res = await setDoc(doc(db, "users", userId), userData);
      if (!res) {
        toast.error("Failed to register, please try again!");
      }
      setUsers((prev) => [...prev, userData]);
      toast.success("Registered successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      toast.error(`Failed to register, ${err.message}`);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <section>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            autoFocus
            autoComplete="off"
            placeholder="Username"
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
            required
            autoComplete="off"
            placeholder="Email"
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
            required
            placeholder="Password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            autoComplete="off"
            minLength="8"
            maxLength="20"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          {registerLoading ? (
            <>
              <ButtonSpinner /> Creating account...
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
