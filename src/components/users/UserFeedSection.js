import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import UserFeed from "../feed/UserFeed";
import CreatePost from "../post/CreatePost";

const UserFeedSection = ({ existUser }) => {
  const { posts } = useData();

  if (existUser?.userPosts?.length === 0)
    return <NotFound text={"No posts found!"} />;
  if (!existUser) return <NotFound text={"No user found!"} />;

  const userPosts = posts?.filter((post) => post.userId === existUser.id);
  if (userPosts?.length === 0) return <NotFound text={"No posts found!"} />;

  return (
    <div className="p-3 bg-light rounded-3 shadow-sm">
      {!existUser && <CreatePost user={existUser} />}
      <p>
        {(existUser?.userPosts || []).length || 0}{" "}
        {(existUser?.userPosts || []).length > 1 ? "posts" : "post"} since{" "}
        {existUser.createdAt?.slice(0, 4) || ""}
      </p>

      <UserFeed userPosts={userPosts} postedBy={existUser.username} />
    </div>
  );
};

export default UserFeedSection;
