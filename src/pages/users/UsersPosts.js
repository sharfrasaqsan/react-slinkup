import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import PostsList from "../../components/post/PostsList";

const UsersPosts = ({ existUser }) => {
  const { posts } = useData();

  if (existUser.userPosts.length === 0)
    return <NotFound text={"No posts found!"} />;
  if (!existUser) return <NotFound text={"No user found!"} />;

  const userPosts = posts?.filter((post) => post.userId === existUser.id);
  if (userPosts.length === 0) return <NotFound text={"No posts found!"} />;

  return (
    <div>
      <p>
        {(existUser.userPosts || []).length || 0}{" "}
        {(existUser.userPosts || []).length > 1 ? "posts" : "post"}
      </p>

      <PostsList userPosts={userPosts} postedBy={existUser.username} />
    </div>
  );
};

export default UsersPosts;
