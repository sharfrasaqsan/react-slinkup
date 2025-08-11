import { Link, useParams } from "react-router-dom";
import { useData } from "../../contexts/DataContext";

const Followers = () => {
  const { users } = useData();
  const { id } = useParams();

  const user = users?.find((user) => user.id === id);
  const followers = user?.followers
    ?.map((followerId) => users.find((user) => user.id === followerId))
    .filter(Boolean); // remove any not found

  return (
    <div>
      <h3>Followers</h3>
      <ul>
        {followers?.map((follower) => (
          <li key={follower.id}>
            <Link to={`/user/${follower.id}`}>{follower.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Followers;
