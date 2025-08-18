import PostCard from "./PostCard";

const UserFeed = ({ userPosts }) => {
  const sortedUserPosts = [...userPosts]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {sortedUserPosts?.map((userPost) => (
        <PostCard key={userPost.id} post={userPost} />
      ))}
    </>
  );
};

export default UserFeed;
