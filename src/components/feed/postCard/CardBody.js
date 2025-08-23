import { useState } from "react";

const CardBody = ({ post, location }) => {
  const [expanded, setExpanded] = useState(false);

  // Show first 280 chars only if not expanded
  const shortText =
    post.body && post.body.length > 280
      ? post.body.slice(0, 280) + "..."
      : post.body;

  const toggleText = () => setExpanded(!expanded);

  return (
    <>
      {location.pathname === `/post/${post.id}` ? (
        <>
          <p
            className="card-text p-3 m-0"
            style={{
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
        <>
          <p className="card-text p-3 m-0 cursor">
            {expanded ? post.body : shortText}
            <span onClick={toggleText} style={{ cursor: "pointer" }}>
              {post.body && post.body.length > 280 && (
                <span className="text-primary ms-2">
                  {expanded ? "See Less" : "See More"}
                </span>
              )}
            </span>
          </p>
          {post.bodyImage && (
            <img src={post.bodyImage} alt="post" className="w-100" />
          )}
        </>
      )}
    </>
  );
};

export default CardBody;
