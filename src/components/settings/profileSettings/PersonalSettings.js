import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";

const PersonalSettings = () => {
  const { user } = useAuth();
  const { setUsers, loading } = useData();

  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  // Arrays with separate "new" inputs
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState("");

  const [occupation, setOccupation] = useState([]);
  const [newOccupation, setNewOccupation] = useState("");

  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState("");

  const [relationship, setRelationship] = useState("");

  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setGender(user.gender || "");
      setBirthday(user.birthday || "");

      // convert to array if string, else use empty array if falsy
      setHobbies(
        Array.isArray(user.hobbies)
          ? user.hobbies
          : user.hobbies
          ? user.hobbies.split(",").map((item) => item.trim())
          : []
      );

      setOccupation(
        Array.isArray(user.occupation)
          ? user.occupation
          : user.occupation
          ? user.occupation.split(",").map((item) => item.trim())
          : []
      );

      setEducation(
        Array.isArray(user.education)
          ? user.education
          : user.education
          ? user.education.split(",").map((item) => item.trim())
          : []
      );

      setRelationship(user.relationship || "");

      setLanguages(
        Array.isArray(user.languages)
          ? user.languages
          : user.languages
          ? user.languages.split(",").map((item) => item.trim())
          : []
      );
    }
  }, [user]);

  // Add item helpers for arrays
  const addHobby = () => {
    if (newHobby.trim()) {
      setHobbies((prev) => [...prev, newHobby.trim()]);
      setNewHobby("");
    }
  };

  const removeHobby = (index) => {
    setHobbies((prev) => prev.filter((_, i) => i !== index));
  };

  const addOccupation = () => {
    if (newOccupation.trim()) {
      setOccupation((prev) => [...prev, newOccupation.trim()]);
      setNewOccupation("");
    }
  };

  const removeOccupation = (index) => {
    setOccupation((prev) => prev.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setEducation((prev) => [...prev, newEducation.trim()]);
      setNewEducation("");
    }
  };

  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setLanguages((prev) => [...prev, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index) => {
    setLanguages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async (userId) => {
    setUpdateLoading(true);
    try {
      const updatedUser = {
        gender,
        birthday,
        hobbies,
        occupation,
        education,
        relationship,
        languages,
      };

      await updateDoc(doc(db, "users", userId), { ...updatedUser });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setUpdateLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div>
      <h4>Basic Profile Settings</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id);
        }}
      >
        <div>
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            autoFocus
            required
            placeholder="Gender"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="birthday">Birthday</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            placeholder="Birthday"
          />
        </div>

        <div>
          <label htmlFor="relationship">Relationship Status</label>
          <select
            id="relationship"
            name="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="Relationship Status"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="in_a_relationship">In a Relationship</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <div>
          <label htmlFor="newHobby">Hobbies</label>
          <input
            type="text"
            id="newHobby"
            name="newHobby"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            placeholder="Enter a hobby"
          />
          <button type="button" onClick={addHobby}>
            Add
          </button>

          <table>
            <tbody>
              {hobbies?.map((hobby, index) => (
                <tr key={index}>
                  <td>{hobby}</td>
                  <td>
                    <button type="button" onClick={() => removeHobby(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <label htmlFor="newOccupation">Occupation</label>
          <input
            type="text"
            id="newOccupation"
            name="newOccupation"
            value={newOccupation}
            onChange={(e) => setNewOccupation(e.target.value)}
            placeholder="Enter an occupation"
          />
          <button type="button" onClick={addOccupation}>
            Add
          </button>

          <table>
            <tbody>
              {occupation?.map((occ, index) => (
                <tr key={index}>
                  <td>{occ}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeOccupation(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <label htmlFor="newEducation">Education</label>
          <input
            type="text"
            id="newEducation"
            name="newEducation"
            value={newEducation}
            onChange={(e) => setNewEducation(e.target.value)}
            placeholder="Enter education"
          />
          <button type="button" onClick={addEducation}>
            Add
          </button>

          <table>
            <tbody>
              {education?.map((edu, index) => (
                <tr key={index}>
                  <td>{edu}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <label htmlFor="newLanguage">Languages</label>
          <input
            type="text"
            id="newLanguage"
            name="newLanguage"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Enter a language"
          />
          <button type="button" onClick={addLanguage}>
            Add
          </button>

          <table>
            <tbody>
              {languages?.map((lang, index) => (
                <tr key={index}>
                  <td>{lang}</td>
                  <td>
                    <button type="button" onClick={() => removeLanguage(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" disabled={updateLoading}>
          {updateLoading ? (
            <>
              Updating... <ButtonSpinner />{" "}
            </>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default PersonalSettings;
