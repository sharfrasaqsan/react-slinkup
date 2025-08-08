import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ margin: "auto", maxHeight: "100vh" }}
    >
      <Spinner animation="border" role="status" variant="primary" />
      <p className="mt-3 fs-5 fw-medium text-primary"></p>
    </div>
  );
};

export default LoadingSpinner;
