import FeedInfiniteScroll from "../../utils/FeedInfiniteScroll";
import PostCard from "./PostCard";

const UserFeed = ({ userPosts }) => {
  return (
    <FeedInfiniteScroll posts={userPosts}>
      {userPosts?.map((userPost) => (
        <PostCard key={userPost.id} post={userPost} />
      ))}
    </FeedInfiniteScroll>
  );
};

export default UserFeed;
