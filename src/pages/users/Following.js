import { Link, useParams } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";

const Following = () => {
  const { users } = useData();
  const { id } = useParams();

  const user = users?.find((user) => user.id === id);
  const followings = user?.following
    ?.map((followingId) => users.find((user) => user.id === followingId))
    .filter(Boolean); // remove any not found

  if (followings.length === 0) return <NotFound text={"No following users found!"} />;

  return (
    <div>
      <h3>Following</h3>
      <ul>
        {followings?.map((following) => (
          <li key={following.id}>
            <Link to={`/user/${following.id}`}>{following.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Following;
