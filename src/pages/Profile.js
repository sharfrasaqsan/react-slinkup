import UserInfo from "../components/profile/UserInfo";
import UserPosts from "../components/profile/UserPosts";
import "../styles/Profile.css";

const Profile = () => {
  return (
    <section className="container mt-3">
      <div className="row gx-5">
        <div className="col-lg-4">
          <UserInfo />
        </div>
        <div className="col-lg-8">
          <UserPosts />
        </div>
      </div>
    </section>
  );
};

export default Profile;
