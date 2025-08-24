import { useParams } from "react-router";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import UserList from "../../components/search/UserList";

const Following = () => {
  const { users } = useData();
  const { id } = useParams();

  const user = users?.find((user) => user.id === id);
  const followings = user?.following
    ?.map((followingId) => users.find((user) => user.id === followingId))
    .filter(Boolean); // remove any not found

  if (followings.length === 0)
    return <NotFound text={"You are not following anyone!"} />;

  return (
    <div className="container search-results-user-card">
      <h5 className="mt-3">Following</h5>
      <ul className="user-list">
        {followings?.map((following) => (
          <UserList key={following.id} searchedUser={following} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default Following;
