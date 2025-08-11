import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, loading } = useData();

  if (loading) return <LoadingSpinner />;

  if (notifications.length === 0)
    return <NotFound text={"No notifications found!"} />;

  const sortedNotifications = [...(notifications || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const userNotificcations = (sortedNotifications || [])?.filter(
    (notification) => notification.recieverId === user.id
  );

  if (userNotificcations.length === 0)
    return (
      <>
        <h2>Notifications</h2>
        <NotFound text={"No notifications found!"} />
      </>
    );

  return (
    <div>
      <h2>Notifications</h2>
      <table>
        <tbody>
          {(userNotificcations || [])?.slice(-10)?.map((notification) => (
            <tr key={notification.id}>
              <td
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  backgroundColor: "#e0e0e0",
                }}
              >
                {notification.type === "like" ? (
                  <Link to={`/post/${notification.postId}`}>
                    <>
                      {notification.message}
                      <br />
                      <small>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                    </>
                  </Link>
                ) : notification.type === "follow" ? (
                  <Link to={`/user/${notification.senderId}`}>
                    <>
                      {notification.message}
                      <br />
                      <small>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                    </>
                  </Link>
                ) : notification.type === "comment" ? (
                  <Link to={`/post/${notification.postId}`}>
                    <>
                      {notification.message}
                      <br />
                      <small>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                    </>
                  </Link>
                ) : (
                  <>
                    {notification.message}
                    <br />
                    <small>
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </small>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
