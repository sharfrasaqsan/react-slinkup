import UserPostsCard from "./UserPostsCard";

const UserPostsList = ({ userPosts, postedBy }) => {
  const sortedUserPosts = [...userPosts]?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {sortedUserPosts?.map((userPost) => (
        <UserPostsCard userPost={userPost} postedBy={postedBy} />
      ))}
    </>
  );
};

export default UserPostsList;
