import LikeButton from "../post/LikeButton";
import { formatDistanceToNow } from "date-fns";

const PostsList = ({ userPosts, postedBy }) => {
  const sortedUserPosts = [...userPosts]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
          <LikeButton post={post} />
        </div>
      ))}
    </>
  );
};

export default PostsList;
