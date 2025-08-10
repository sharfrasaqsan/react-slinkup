import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import { format } from "date-fns";

const PersonalSettings = () => {
  const { user } = useAuth();
  const { setUsers, loading } = useData();

  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  // Arrays with separate "new" inputs
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

    if (!gender) {
      toast.error("Please select a gender.");
      return;
    }

    if (!birthday) {
      toast.error("Please select a birthday.");
      return;
    }

    try {
      const updatedUser = {
        gender,
        birthday,
        occupation,
        education,
        relationship,
        languages,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
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
            <option selected>Select Gender</option>
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
            required
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
            <option selected>Select Status</option>
            <option value="Single">Single</option>
            <option value="In a relationship">In a Relationship</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
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
