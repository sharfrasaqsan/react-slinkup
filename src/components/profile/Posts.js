import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const Posts = () => {
  const { user } = useAuth();

  return (
    <div>
      <p>{user.posts.length || []} posts</p>
      <div>{user.posts}</div>
    </div>
  );
};

export default Posts;
