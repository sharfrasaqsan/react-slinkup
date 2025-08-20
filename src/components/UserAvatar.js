import { useAuth } from "../contexts/AuthContext";
import { PiUserCircleDuotone, PiUserCircleFill } from "react-icons/pi";

const UserAvatar = ({ fontSize, width, height }) => {
  const { user } = useAuth();

  return (
    <>
      {user.avatar ? (
        <img
          src={user?.avatar}
          alt={user?.username}
          className="me-3 rounded-circle"
          style={{
            width: width,
            height: height,
            backgroundColor: "red",
          }}
        />
      ) : user.gender === "Male" ? (
        <PiUserCircleDuotone className="me-2" style={{ fontSize: fontSize }} />
      ) : (
        <PiUserCircleFill className="me-2" style={{ fontSize: fontSize }} />
      )}
    </>
  );
};

export default UserAvatar;
