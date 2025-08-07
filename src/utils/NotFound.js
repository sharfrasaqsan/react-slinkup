const NotFound = ({ text }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "300px" }}
    >
      <p className="text-center text-muted fs-5">{text}</p>
    </div>
  );
};

export default NotFound;
