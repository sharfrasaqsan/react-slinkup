import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";

const UserPost = () => {
  const { user } = useAuth();
  const { users, posts } = useData();

  // Filter - 	When you want many results
  // Find - 	When you want only one result

  // Filter user posts
  const userPosts = posts.filter((post) => post.userId === user.id);

  // userPosts is an array. userId is a property of each object in the array.
  // so we need to use map to get the userId of the first object in the array.
  const postedBy = users.find(
    (user) => user.id === userPosts?.map((post) => post.userId)[0]
  )?.username;

  return (
    <div>
      <p>
        {(user.userPosts || []).length || 0}{" "}
        {(user.userPosts || []).length > 1 ? "posts" : "post"}
      </p>

      {userPosts.map((post) => (
        <div key={post.id}>
          <p>{postedBy}</p>
          <p>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default UserPost;
