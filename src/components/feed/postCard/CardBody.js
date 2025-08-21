import { Link } from "react-router";

const CardBody = ({ post, location, setShowComment }) => {
  return (
    <>
      {location.pathname === `/post/${post.id}` ? (
        <>
          <p
            className="card-text p-3 m-0"
            style={{
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc, borderBottom: 1px solid #ccc",
            }}
          >
            {post.body || "No content"}
          </p>
          {post.bodyImage && (
            <img src={post.bodyImage} alt="post" className="w-100" />
          )}
        </>
      ) : (
        <Link
          to={`/post/${post.id}`}
          onClick={() => {
            setShowComment(false);
          }}
        >
          <p
            className="card-text p-3 m-0 cursor"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            {post.body ? post.body.slice(0, 100) + "..." : "No content"}
          </p>

          {post.bodyImage && (
            <img src={post.bodyImage} alt="post" className="w-100" />
          )}
        </Link>
      )}
    </>
  );
};

export default CardBody;
