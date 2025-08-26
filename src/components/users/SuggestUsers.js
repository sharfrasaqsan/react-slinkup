import { useMemo } from "react";
import { Link } from "react-router"; // ✅ Correct import for latest version
import _ from "lodash";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import UserAvatar from "../UserAvatar";
import LoadingSpinner from "../../utils/LoadingSpinner";

const SuggestUsers = () => {
  const { user } = useAuth();
  const { users, loading } = useData();

  const isDataReady = Array.isArray(users) && users.length > 0;
  const currentUserId = user?.id;

  // Safe fallback for following list
  const userFollowingIds = Array.isArray(user?.following) ? user.following : [];

  // Filter users (not self, not already followed, role === "user")
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.id !== currentUserId &&
        u.role === "user" &&
        !userFollowingIds.includes(u.id)
    );
  }, [users, currentUserId, userFollowingIds]);

  // Select up to 8 random users
  const suggestedUsers = useMemo(() => {
    return _.sampleSize(filteredUsers, 8);
  }, [filteredUsers]);

  // Handle loading or empty state
  if (loading || !isDataReady || !currentUserId) return <LoadingSpinner />;

  if (suggestedUsers.length === 0) return null;

  return (
    <section>
      <div>
        <h4 className="mb-3 fw-bold">Suggested for you</h4>
        <ul className="list-group list-group-flush">
          {suggestedUsers.map((suggested) => (
            <Link to={`/user/${suggested.id}`} key={suggested.id}>
              <li className="list-group-item">
                <div className="d-flex align-items-center">
                  <UserAvatar
                    width="40px"
                    height="40px"
                    fontSize="40px"
                    user={suggested}
                  />
                  <div className="ms-3">
                    <p className="mb-0">{suggested.username}</p>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {suggested.email}
                    </p>
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
