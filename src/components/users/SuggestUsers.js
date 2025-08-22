import _ from "lodash";
import { useData } from "../../contexts/DataContext";
import UserAvatar from "../UserAvatar";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";
import { useMemo } from "react";
import LoadingSpinner from "../../utils/LoadingSpinner";

const SuggestUsers = () => {
  const { user } = useAuth();
  const { users, loading } = useData();

  const currentUserId = user?.id;
  const userFollowingIds = user?.following?.map((userId) => userId);

  const filteredUsers = users?.filter(
    (user) =>
      user.id !== currentUserId &&
      user.role === "user" &&
      !userFollowingIds?.includes(user.id)
  );

  const randomUser = useMemo(() => {
    return _.sampleSize(filteredUsers, 8);
  }, [filteredUsers]);

  if (loading) return <LoadingSpinner />;
  if (!currentUserId) return null;
  if (users?.length === 0) return null;

  return (
    <section>
      <div>
        <h4 className="mb-3 fw-bold">Suggested for you</h4>
        <ul className="list-group list-group-flush">
          {randomUser?.map((user) => (
            <Link to={`/user/${user.id}`} key={user.id}>
              <li className="list-group-item">
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
