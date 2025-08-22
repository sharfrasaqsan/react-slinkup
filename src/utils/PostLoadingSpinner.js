import { Spinner } from "react-bootstrap";

const PostLoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center my-2">
      <Spinner animation="border" role="status" variant="primary" />
    </div>
  );
};

export default PostLoadingSpinner;
