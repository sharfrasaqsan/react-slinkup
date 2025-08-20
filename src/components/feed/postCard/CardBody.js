import { Link } from "react-router";

const CardBody = ({ post, location, setShowComment }) => {
  return (
    <>
      {location.pathname === `/post/${post.id}` ? (
        <p
          className="card-text mt-3 p-3 border text-muted"
          style={{ border: "1px solid #ddd", cursor: "default" }}
        >
          {post.body || "No content"}
        </p>
      ) : (
        <Link
          to={`/post/${post.id}`}
          onClick={() => {
            setShowComment(false);
          }}
        >
          <p
            className="card-text py-3 px-2"
            style={{ backgroundColor: "#f5f5f5ff" }}
          >
            {post.body ? post.body.slice(0, 100) + "..." : "No content"}
          </p>
        </Link>
      )}
    </>
  );
};

export default CardBody;
