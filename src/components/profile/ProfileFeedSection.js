import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";
import UserFeed from "../feed/UserFeed";
import CreatePost from "../post/CreatePost";

const ProfileFeedSection = () => {
  const { user } = useAuth();
  const { posts, loading } = useData();

  const isUserReady = !!user?.id && typeof user?.createdAt === "string";

  if (loading || !isUserReady) return <LoadingSpinner />;
  if (!user) return <NotFound text={"No user found! Please log in."} />;

  const userPosts = posts.filter((post) => post.userId === user.id);

  if (userPosts.length === 0) {
    return (
      <>
        <CreatePost user={user} />
        <NotFound text={"No posts found!"} />
      </>
    );
  }

  return (
    <div className="p-3 bg-light rounded-3 shadow-sm">
      <CreatePost user={user} />
      <p>
        {userPosts.length} {userPosts.length > 1 ? "posts" : "post"} since{" "}
        {user.createdAt?.slice(0, 4) || ""}
      </p>
      <UserFeed userPosts={userPosts} postedBy={user.username} />
    </div>
  );
};

export default ProfileFeedSection;
