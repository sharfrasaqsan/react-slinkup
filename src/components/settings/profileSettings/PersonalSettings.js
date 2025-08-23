import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import { format } from "date-fns";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import "../../../styles/settings/ProfileSetting.css";

const PersonalSettings = () => {
  const { user, setUser } = useAuth();
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

  const occupationRef = useRef(null);
  const educationRef = useRef(null);
  const languageRef = useRef(null);

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
    occupationRef.current.focus();
  };

  const removeOccupation = (index) => {
    setOccupation((prev) => prev.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setEducation((prev) => [...prev, newEducation.trim()]);
      setNewEducation("");
    }
    educationRef.current.focus();
  };

  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setLanguages((prev) => [...prev, newLanguage.trim()]);
      setNewLanguage("");
    }
    languageRef.current.focus();
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

      await updateDoc(doc(db, "users", userId), updatedUser);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      setUser((prev) => ({ ...prev, ...updatedUser }));

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setUpdateLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="personal-settings-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id);
        }}
      >
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            autoFocus
            required
            className="form-select"
          >
            <option>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="birthday" className="form-label">
            Birthday
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="relationship" className="form-label">
            Relationship Status
          </label>
          <select
            id="relationship"
            name="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="form-select"
          >
            <option>Select Status</option>
            <option value="Single">Single</option>
            <option value="In a relationship">In a Relationship</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {/* Occupation */}
        <div className="mb-3">
          <label htmlFor="newOccupation" className="form-label">
            Occupation
          </label>
          <input
            type="text"
            id="newOccupation"
            name="newOccupation"
            value={newOccupation}
            onChange={(e) => setNewOccupation(e.target.value)}
            placeholder="Enter an occupation"
            className="form-control"
            ref={occupationRef}
          />
          <button
            type="button"
            onClick={addOccupation}
            className="btn btn-primary"
          >
            <AiOutlinePlus />
          </button>

          <table className="table mt-3">
            <tbody>
              {occupation.map((occ, index) => (
                <tr key={index}>
                  <td className="w-75">{occ}</td>
                  <td className="w-25">
                    <button
                      type="button"
                      onClick={() => removeOccupation(index)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Education */}
        <div className="mb-3">
          <label htmlFor="newEducation" className="form-label">
            Education
          </label>
          <input
            type="text"
            id="newEducation"
            name="newEducation"
            value={newEducation}
            onChange={(e) => setNewEducation(e.target.value)}
            placeholder="Enter education"
            className="form-control"
            ref={educationRef}
          />
          <button
            type="button"
            onClick={addEducation}
            className="btn btn-primary"
          >
            <AiOutlinePlus />
          </button>

          <table className="table mt-3">
            <tbody>
              {education.map((edu, index) => (
                <tr key={index}>
                  <td className="w-75">{edu}</td>
                  <td className="w-25">
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Languages */}
        <div className="mb-3">
          <label htmlFor="newLanguage" className="form-label">
            Languages
          </label>
          <input
            type="text"
            id="newLanguage"
            name="newLanguage"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Enter a language"
            className="form-control"
            ref={languageRef}
          />
          <button
            type="button"
            onClick={addLanguage}
            className="btn btn-primary"
          >
            <AiOutlinePlus />
          </button>

          <table className="table mt-3">
            <tbody>
              {languages.map((lang, index) => (
                <tr key={index}>
                  <td className="w-75">{lang}</td>
                  <td className="w-25">
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-4"
          disabled={updateLoading}
        >
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
