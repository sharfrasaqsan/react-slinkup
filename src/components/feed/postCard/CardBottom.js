import React from "react";
import { FaCommentDots } from "react-icons/fa";
import LikeCommentCounts from "../../post/LikeCommentCounts";

const CardBottom = ({ post, setShowComment, setPosts, LikeButton }) => {
  return (
    <>
      <div className="p-3">
        <LikeCommentCounts post={post} />

        <div className="d-flex gap-3 mt-3">
          <LikeButton post={post} setPosts={setPosts} />

          <button
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
            onClick={() => setShowComment(true)}
          >
            <FaCommentDots />
            {post.comments?.length} Comments
          </button>
        </div>
      </div>
    </>
  );
};

export default CardBottom;
