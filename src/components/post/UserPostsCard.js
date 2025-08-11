import { useState } from "react";
import LikeButton from "./LikeButton";
import { formatDistanceToNow } from "date-fns";
import CommentModal from "../comments/CommentModal";
import LikeCommentCounts from "./LikeCommentCounts";

const UserPostsCard = ({ userPost, postedBy }) => {
  // Comment button states
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "1rem",
        margin: "1rem 0",
        backgroundColor: "#f9f9f9",
      }}
    >
      <p>{postedBy}</p>

      <p>
        {formatDistanceToNow(new Date(userPost.createdAt), {
          addSuffix: true,
        })}
      </p>

      <p>{userPost.body}</p>

      <LikeCommentCounts post={userPost} />
      <LikeButton post={userPost} />

      <button onClick={handleShow}>Comments</button>
      <CommentModal show={show} handleClose={handleClose} post={userPost} />
    </div>
  );
};

export default UserPostsCard;
