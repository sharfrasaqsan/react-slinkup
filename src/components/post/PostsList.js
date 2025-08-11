import { useState } from "react";
import LikeButton from "./LikeButton";
import { formatDistanceToNow } from "date-fns";
import CommentModal from "../comments/CommentModal";
import LikeCommentCounts from "./LikeCommentCounts";

const PostsList = ({ userPosts, postedBy }) => {
  const sortedUserPosts = [...userPosts]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Comment button states
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {sortedUserPosts?.map((post) => (
        <div
          key={post.id}
          style={{
            margin: "1rem 0",
            padding: "1rem",
            backgroundColor: "#e0e0e0",
          }}
        >
          <p>{postedBy}</p>
          <p>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
          <p>{post.body}</p>

          <LikeCommentCounts post={post} />

          <LikeButton post={post} />
          <button onClick={handleShow}>Comments</button>
          <CommentModal show={show} handleClose={handleClose} post={post} />
        </div>
      ))}
    </>
  );
};

export default PostsList;
