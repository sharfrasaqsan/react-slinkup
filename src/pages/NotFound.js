import { useNavigate } from "react-router";
import "../styles/NotFound.css"

const NotFound = ({ message = "Page Not Found", redirectTo = "/" }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(redirectTo);
  };

  return (
    <div className="not-found-container d-flex justify-content-center align-items-center bg-light">
      <div className="not-found-card card p-4 rounded-3 shadow-sm">
        <h2 className="text-danger">{message}</h2>
        <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
          The page you're looking for might have been moved or doesn't exist.
        </p>
        <button onClick={handleRedirect} className="btn btn-primary mt-3 w-100">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
