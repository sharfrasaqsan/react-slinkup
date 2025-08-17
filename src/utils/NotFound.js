
const NotFound = ({ text }) => {
  return (
    <div className="not-found-wrapper d-flex justify-content-center align-items-center text-center">
      <p className="not-found-text text-muted fs-5">{text}</p>
    </div>
  );
};

export default NotFound;
