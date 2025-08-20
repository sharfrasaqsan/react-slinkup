import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase/Config";
import { toast } from "react-toastify";
import Breadcrumbs from "../utils/Breadcrumbs";
import { collection, getDocs, query, where } from "firebase/firestore";
import LoadingSpinner from "../utils/LoadingSpinner";
import ButtonSpinner from "../utils/ButtonSpinner";
import { useData } from "../contexts/DataContext";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const { loading } = useData();
  const [email, setEmail] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <LoadingSpinner />;

  const breadcrumbs = [
    { label: "Home", link: "/" },
    { label: "Settings", link: "/settings" },
    { label: "Profile Settings", link: "/settings/profile" },
    { label: "Reset Password" },
  ];

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSendLoading(true);

    try {
      const existEmail = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (!existEmail.empty) {
        await sendPasswordResetEmail(auth, email);
        toast.success(
          "Password reset email sent successfully. Check your email."
        );
        setError("");
        setEmail("");
      } else {
        setError("User not found with this email.");
      }
    } catch (err) {
      toast.error(err.message);
      sendLoading(false);
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="reset-password-container container py-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <h3 className="settings-title mb-4 text-center">Reset Password</h3>

      <div
        className="settings-menu shadow-sm mx-auto"
        style={{ maxWidth: "450px" }}
      >
        <div className="card-body padding-form">
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Enter your registered email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={sendLoading}
            >
              {sendLoading ? (
                <>
                  Sending... <ButtonSpinner />
                </>
              ) : (
                "Send Reset Email"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
