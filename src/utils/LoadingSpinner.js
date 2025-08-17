import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" role="status" variant="primary" />
    </div>
  );
};

export default LoadingSpinner;
