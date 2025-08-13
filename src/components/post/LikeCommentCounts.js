const LikeCommentCounts = ({ post }) => {
  if (!post) return null;

  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  return (
    <div
      className="d-flex gap-3 text-muted like-comment-counts"
      style={{ fontSize: "14px" }}
    >
      <span>
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </span>
      <span>
        {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
      </span>
    </div>
  );
};

export default LikeCommentCounts;
