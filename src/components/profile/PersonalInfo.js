import { useAuth } from "../../contexts/AuthContext";

const PersonalInfo = () => {
  const { user } = useAuth();

  return (
    <div>
      <p>{user.username}</p>
      <p>
        <span>{user.followers.length || []} followers</span>{" "}
        <span>{user.following.length || []} following</span>
      </p>
      <p>{user.bio}</p>
    </div>
  );
};

export default PersonalInfo;
