import { useAuth } from "../../contexts/AuthContext";

const UserInfo = () => {
  const { user } = useAuth();

  return (
    <div>
      <p>{user.username}</p>
      <p>{user.email}</p>
      <p>{(user.followers || []).length || 0} followers</p>
      <p>{(user.following || []).length || 0} following</p>
      <p>{user.bio}</p>
    </div>
  );
};

export default UserInfo;
