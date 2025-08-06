import { useAuth } from "../../contexts/AuthContext";

const UserPost = () => {
  const { user } = useAuth();

  return (
    <div>
      <p>
        {(user.userPosts || []).length || 0}{" "}
        {(user.userPosts || []).length > 1 ? "posts" : "post"}
      </p>

      {(user.userPosts || []).map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default UserPost;
