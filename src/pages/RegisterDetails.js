import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner";
import ButtonSpinner from "../utils/ButtonSpinner";

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

      await updateDoc(doc(db, "users", userId), {
        ...updatedUser,
      });

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
    }
    setUpdateLoading(false);
  };

  return (
    <section>
      <h2>Register Details</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateDetails(user.id);
        }}
      >
        <div>
          <label labelfor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            autoFocus
            placeholder="First Name"
          />
        </div>

        <div>
          <label labelfor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            placeholder="Last Name"
          />
        </div>

        <div>
          <label labelfor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Gender"
            required
          >
            <option selected>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label labelfor="birthday">Birthday</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            placeholder="Birthday"
          />
        </div>

        <div>
          <label labelfor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Location"
          />
        </div>

        <button
          type="submit"
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
              Submiting... <ButtonSpinner />
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
