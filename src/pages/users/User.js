import UserFeedSection from "../../components/users/UserFeedSection";
import UsersInfo from "../../components/users/UsersInfo";
import "../../styles/Profile.css";
import { useParams } from "react-router";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import LoadingSpinner from "../../utils/LoadingSpinner";

const User = () => {
  const { users, loading } = useData();
  const { id } = useParams();

  const existUser = users.find((user) => user.id === id);

  if (loading) return <LoadingSpinner />;
  if (!existUser) return <NotFound text={"No user found!"} />;

  return (
    <section className="container mt-3">
      <div className="row gx-5">
        <div className="col-lg-4">
          <UsersInfo existUser={existUser} />
        </div>
        <div className="col-lg-8">
          <UserFeedSection existUser={existUser} />
        </div>
      </div>
    </section>
  );
};

export default User;
