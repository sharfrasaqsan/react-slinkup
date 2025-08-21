import UserInfo from "../components/profile/UserInfo";
import ProfileFeedSection from "../components/profile/ProfileFeedSection";
import "../styles/Profile.css";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router";

const Profile = () => {
  const { user } = useAuth();
  const { id } = useParams();

  const ownProfile = user?.id === id;

  return (
    <section className="container mt-3">
      <div className="row gx-5">
        <div className="col-lg-4">
          <UserInfo ownProfile={ownProfile} />
        </div>
        <div className="col-lg-8">
          <ProfileFeedSection />
        </div>
      </div>
    </section>
  );
};

export default Profile;
