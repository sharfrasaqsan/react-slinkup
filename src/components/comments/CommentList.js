import React, { useState, useEffect } from "react";
import CreateComment from "./CreateComment";
import CommentCard from "./CommentCard";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";

const CommentList = ({ post }) => {
  const { comments, loading } = useData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const postComments = comments?.filter((comment) =>
    post.comments?.includes(comment.id)
  );

  const sortedComments = [...(postComments || [])]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <CreateComment post={post} />

      {isLoading ? (
        <LoadingSpinner />
      ) : postComments?.length > 0 ? (
        sortedComments?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} post={post} />
        ))
      ) : (
        <NotFound text={"No comments yet!"} />
      )}
    </div>
  );
};

export default CommentList;
