import { formatDistanceToNow } from "date-fns";
import { useData } from "../../contexts/DataContext";
import { Link } from "react-router-dom";
import CommentLikeButton from "./CommentLikeButton";

const CommentCard = ({ comment }) => {
  const { users } = useData();

  const commentUser = users?.find((user) => user.id === comment.commentUserId);
  if (!commentUser) return null;

  return (
    <>
      <div
        style={{
          margin: "1rem 0",
          padding: "1rem",
          border: "1px solid #eee",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Link to={`/user/${commentUser.id}`}>
          {commentUser ? commentUser.username : "Unknown User"}
        </Link>
        <br />
        {comment.body}
        <br />
        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        <br />
        <CommentLikeButton />
      </div>
    </>
  );
};

export default CommentCard;
