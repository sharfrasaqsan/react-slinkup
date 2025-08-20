import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useNavigate } from "react-router";
import LoadingSpinner from "../utils/LoadingSpinner";
import ButtonSpinner from "../utils/ButtonSpinner";
import "../styles/RegisterDetails.css";

const RegisterDetails = () => {
  const { user, setUser } = useAuth();
  const { setUsers, loading } = useData();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [location, setLocation] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  const handleUpdateDetails = async (userId) => {
    if (!firstname || !lastname || !gender || !birthday || !location) {
      toast.error("Please fill in all fields.");
      return;
    }

    setUpdateLoading(true);
    try {
      const updatedUser = {
        firstname,
        lastname,
        gender,
        birthday,
        location,
        profileCompletion: true,
      };

      await updateDoc(doc(db, "users", userId), updatedUser);

      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      setUsers((prev) =>
        prev?.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      toast.success("Details updated successfully!");
      setFirstname("");
      setLastname("");
      setGender("");
      setBirthday("");
      setLocation("");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <section className="register-details-container container">
      <h2 className="register-details-title mb-4 text-center">
        Complete Your Profile
      </h2>
      <form
        className="register-details-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateDetails(user.id);
        }}
      >
        <div className="register-details-field mb-3">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            className="form-control"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            autoFocus
            placeholder="First Name"
          />
        </div>

        <div className="register-details-field mb-3">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            className="form-control"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            placeholder="Last Name"
          />
        </div>

        <div className="register-details-field mb-3">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <select
            id="gender"
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="register-details-field mb-3">
          <label htmlFor="birthday" className="form-label">
            Birthday
          </label>
          <input
            type="date"
            id="birthday"
            className="form-control"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </div>

        <div className="register-details-field mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="City, State, Country"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 register-details-submit mt-3"
          disabled={
            updateLoading ||
            !firstname ||
            !lastname ||
            !gender ||
            !birthday ||
            !location
          }
        >
          {updateLoading ? (
            <>
              Submitting... <ButtonSpinner />
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </section>
  );
};

export default RegisterDetails;
