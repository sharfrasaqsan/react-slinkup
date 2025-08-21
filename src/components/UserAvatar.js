import {
  PiUserCircleDuotone,
  PiUserCircleFill,
  PiUserCircleLight,
} from "react-icons/pi";

const UserAvatar = ({ fontSize, width, height, user }) => {
  return (
    <>
      {user?.avatar ? (
        <img
          src={user?.avatar}
          alt={user?.username}
          className="me-2 rounded-circle"
          style={{
            width: width,
            height: height,
          }}
        />
      ) : user?.gender === "Male" ? (
        <PiUserCircleDuotone className="me-2" style={{ fontSize: fontSize }} />
      ) : user?.gender === "Female" ? (
        <PiUserCircleFill className="me-2" style={{ fontSize: fontSize }} />
      ) : (
        <PiUserCircleLight className="me-2" style={{ fontSize: fontSize }} />
      )}
    </>
  );
};

export default UserAvatar;
