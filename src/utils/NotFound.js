import "../styles/utils/NotFound.css";

const NotFound = ({ text }) => {
  if (!text) return null;

  return (
    <div className="not-found-wrapper d-flex justify-content-center align-items-center text-center min-vh">
      <p className="not-found-text text-muted fs-5">{text}</p>
    </div>
  );
};

export default NotFound;
