import CreateComment from "./CreateComment";
import CommentCard from "./CommentCard";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";

const CommentList = ({ post }) => {
  const { comments } = useData();

  const postComments = comments?.filter((comment) =>
    post.comments?.includes(comment.id)
  );

  const sortedComments = [...(postComments || [])]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <CreateComment post={post} />

      {(postComments || []).length > 0 ? (
        sortedComments?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      ) : (
        <NotFound text={"No comments!"} />
      )}
    </div>
  );
};

export default CommentList;
