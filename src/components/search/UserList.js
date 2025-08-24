import { Link } from "react-router";
import UserAvatar from "../UserAvatar";
import "../../styles/search/UserList.css";
import FollowButton from "../users/FollowButton";
import { useEffect, useState } from "react";

const UserList = ({ searchedUser, user }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const following = searchedUser.followers?.includes(user.id);
    setIsFollowing(following);
  }, [searchedUser, user.id]);

  return (
    <>
      <li key={searchedUser.id} className="user-list-item">
        <div className="d-flex align-items-center justify-content-between w-100">
          {user.id === searchedUser.id ? (
            <Link to={`/profile/${user.id}`}>
              <UserAvatar
                width="40px"
                height="40px"
                fontSize="40px"
                user={user}
              />
              {searchedUser.username}
            </Link>
          ) : (
            <Link to={`/user/${searchedUser.id}`}>
              <div className="d-flex align-items-center">
                <UserAvatar
                  width="40px"
                  height="40px"
                  fontSize="40px"
                  user={searchedUser}
                />
                <div>
                  {searchedUser?.username}
                  <br />
                  <span className="text-muted form-text">
                    {!searchedUser?.followers ||
                    searchedUser.followers.length === 0 ? (
                      <span>New User</span>
                    ) : (
                      <>
                        {searchedUser.followers.length}{" "}
                        {searchedUser.followers.length === 1
                          ? "follower"
                          : "followers"}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </Link>
          )}

          <FollowButton
            user={user}
            existUser={searchedUser}
            alreadyFollowed={isFollowing}
            setAlreadyFollowed={setIsFollowing}
          />
        </div>
      </li>
    </>
  );
};

export default UserList;
