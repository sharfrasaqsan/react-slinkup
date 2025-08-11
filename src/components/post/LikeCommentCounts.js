const LikeCommentCounts = ({ post }) => {
  if (!post) return null;

  return (
    <div>
      <span>
        {(post.likes || [])?.length ? (post.likes || [])?.length : 0}{" "}
        {(post.likes || [])?.length > 1 ? "likes" : "like"}
      </span>{" "}
      <span>
        {post.comments?.length ? (post.comments || [])?.length : 0}{" "}
        {post.comments?.length > 1 ? "comments" : "comment"}
      </span>
    </div>
  );
};

export default LikeCommentCounts;
