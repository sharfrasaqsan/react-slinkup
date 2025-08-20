import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import NotFound from "../utils/NotFound";
import LoadingSpinner from "../utils/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { FcInfo } from "react-icons/fc";

const Notifications = () => {
  // Pass down the count update function
  const { user } = useAuth();
  const { notifications, setNotifications, loading } = useData();

  const sortedNotifications = [...(notifications || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const userNotificcations = (sortedNotifications || [])?.filter(
    (notification) => notification.recieverId === user.id
  );

  const handleReadNotification = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        isRead: true,
      });

      // Update local state as well
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (notifications.length === 0)
    return <NotFound text={"No notifications found!"} />;
  if (userNotificcations.length === 0)
    return <NotFound text={"No notifications found!"} />;

  return (
    <ul className="list-group">
      {userNotificcations.slice(-15).map((notification) => (
        <Link
          to={
            notification.type === "like"
              ? `/post/${notification.postId}`
              : notification.type === "follow"
              ? `/user/${notification.senderId}`
              : notification.type === "comment"
              ? `/post/${notification.postId}`
              : "#"
          }
          className="text-decoration-none"
          key={notification.id}
          onClick={() => handleReadNotification(notification.id)}
        >
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: notification.isRead ? "#f8f9faff" : "#e9ecef",
            }}
          >
            <div>
              <strong>{notification.message}</strong>
              <br />
              <small className="text-muted">
                {formatDistanceToNow(new Date(notification.createdAt))}
              </small>
            </div>
            {notification.isRead === false && (
              <div>
                <FcInfo />
              </div>
            )}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default Notifications;
