import { useParams } from "react-router";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import UserList from "../../components/search/UserList";

const Followers = () => {
  const { users } = useData();
  const { id } = useParams();

  const user = users?.find((user) => user.id === id);
  const followers = user?.followers
    ?.map((followerId) => users.find((user) => user.id === followerId))
    .filter(Boolean); // remove any not found

  if (followers.length === 0)
    return <NotFound text={"You have no followers!"} />;

  return (
    <div className="container search-results-user-card">
      <h5 className="mt-3">Followers</h5>
      <ul className="user-list">
        {followers?.map((follower) => (
          <li key={follower.id}>
            <UserList key={follower.id} searchedUser={follower} user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Followers;
