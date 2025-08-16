import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";
import UserPostsList from "../post/UserPostsList";
import CreatePost from "../post/CreatePost";

const UserPosts = () => {
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

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
      }}
    >
      {user && (
        <>
          <CreatePost />
          <p>
            {(user.userPosts || []).length || 0}{" "}
            {(user.userPosts || []).length > 1 ? "posts" : "post"} since{" "}
            {user.createdAt?.slice(0, 4) || ""}
          </p>

          <UserPostsList userPosts={userPosts} postedBy={user.username} />
        </>
      )}
    </div>
  );
};

export default UserPosts;
