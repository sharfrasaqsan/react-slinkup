import React from "react";
import { useNavigate } from "react-router-dom"; // Updated for React Router v6

const NotFound = ({ message = "Page Not Found", redirectTo = "/" }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleRedirect = () => {
    navigate(redirectTo); // Navigate to the specified path
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 text-center bg-light"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div
        className="card p-4 rounded-3 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-danger">{message}</h2>
        <p className="text-muted" style={{ fontSize: "1.1rem" }}>
          The page you're looking for might have been moved or doesn't exist.
        </p>
        <button
          onClick={handleRedirect}
          className="btn btn-primary mt-3 w-100"
          style={{
            backgroundColor: "#3498db",
            color: "white",
            borderRadius: "4px",
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
