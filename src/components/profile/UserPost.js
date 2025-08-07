import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import LikeButton from "../feed/LikeButton";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";

const UserPost = () => {
  const { user } = useAuth();
  const { users, posts, loading } = useData();

  // Error handling
  if (loading) return <LoadingSpinner />;
  if (!user) return <NotFound text={"No user found! Please log in."} />;
  if (users.length === 0) return <NotFound text={"No users found!"} />;
  if (posts.length === 0) return <NotFound text={"No posts found!"} />;

  // Filter - 	When you want many results
  // Find - 	When you want only one result

  // Filter user posts
  const userPosts = posts.filter((post) => post.userId === user.id);
  if (userPosts.length === 0) return <NotFound text={"No posts found!"} />;

  // userPosts is an array. userId is a property of each object in the array.
  // so we need to use map to get the userId of the first object in the array.
  const postedBy = users.find(
    (user) => user.id === userPosts?.map((post) => post.userId)[0]
  )?.username;
  if (!postedBy) return <NotFound text={"No user found!"} />;

  return (
    <div>
      <p>
        {(user.userPosts || []).length || 0}{" "}
        {(user.userPosts || []).length > 1 ? "posts" : "post"}
      </p>

      {userPosts.map((post) => (
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
    </div>
  );
};

export default UserPost;
