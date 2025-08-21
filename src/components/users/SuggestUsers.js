import _ from "lodash";
import { useData } from "../../contexts/DataContext";
import UserAvatar from "../UserAvatar";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";

const SuggestUsers = () => {
  const { user } = useAuth();
  const { users } = useData();

  const currentUserId = user?.id;
  if (!currentUserId) return null;
  if (users?.length === 0) return null;

  const filteredUsers = users?.filter(
    (user) => user.id !== currentUserId && user.role === "user"
  );

  const randomUser = _.sampleSize(filteredUsers, 8);

  console.log(users);
  console.log(randomUser);

  return (
    <section>
      <div>
        <h4 className="mb-3">Suggested Users</h4>
        <ul className="list-group list-group-flush">
          {randomUser.map((user) => (
            <Link to={`/user/${user.id}`}>
              <li className="list-group-item" key={user.id}>
                <div className="d-flex align-items-center">
                  <UserAvatar
                    width="40px"
                    height="40px"
                    fontSize="40px"
                    user={user}
                  />
                  <div className="ms-3">
                    <p className="mb-0">{user.username}</p>
                    <p className="mb-0">{user.email}</p>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SuggestUsers;
