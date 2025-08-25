import { formatDistanceToNow } from "date-fns";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import UserAvatar from "../../UserAvatar";
import FollowButton from "../../users/FollowButton";
import { Link } from "react-router";
import { FaEllipsisH } from "react-icons/fa";

const CardTop = ({
  user,
  post,
  postedBy,
  alreadyFollowed,
  setAlreadyFollowed,
  setShowEditPost,
  handleDeletePost,
  deleteLoading,
  location,
}) => {

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center">
          <UserAvatar
            width="40px"
            height="40px"
            fontSize="40px"
            user={postedBy}
          />

          <div>
            <p className="card-title mb-0">
              {user.id === postedBy.id ? (
                <Link to={`/profile/${user.id}`}>
                  {postedBy.username || "Unknown User"}
                </Link>
              ) : (
                <Link to={`/user/${postedBy.id}`}>
                  {postedBy.username || "Unknown User"}
                </Link>
              )}
            </p>

            <p className="text-muted" style={{ fontSize: "0.9rem", margin: 0 }}>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          {user.id === postedBy.id && (
            <div className="dropdown">
              <button
                className="btn btn-link text-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaEllipsisH />
              </button>

              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setShowEditPost(true)}
                  >
                    Edit post
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    {deleteLoading ? (
                      <>
                        Deleting... <ButtonSpinner />
                      </>
                    ) : (
                      "Delete post"
                    )}
                  </button>
                </li>
              </ul>
            </div>
          )}

          {user.followers?.includes(postedBy.id) &&
            location.pathname !== `/user/${postedBy.id}` &&
            user.id !== postedBy.id &&
            !alreadyFollowed && (
              <FollowButton
                user={user}
                existUser={postedBy}
                alreadyFollowed={alreadyFollowed}
                setAlreadyFollowed={setAlreadyFollowed}
              />
            )}
        </div>
      </div>
    </>
  );
};

export default CardTop;
