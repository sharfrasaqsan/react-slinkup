import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { toast } from "react-toastify";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import "../../../styles/settings/Setting.css";

const BasicProfile = () => {
  const { user, setUser } = useAuth();
  const { setUsers, loading } = useData();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  const [social, setSocial] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState();
  const [link, setLink] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);

  const socialRef = useRef();

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setSocial(user.social || {});
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  const socialBaseUrls = {
    Facebook: "https://facebook.com/",
    Instagram: "https://instagram.com/",
    Twitter: "https://twitter.com/",
    Linkedin: "https://linkedin.com/in/",
    Github: "https://github.com/",
  };

  const handleAddSocial = () => {
    if (!link.trim()) {
      toast.error("Please enter a username.");
      return;
    }

    if (!selectedPlatform) {
      toast.error("Please select a platform.");
      return;
    }

    const baseUrl = socialBaseUrls[selectedPlatform];
    const fullUrl = baseUrl + link.trim();

    setSocial((prev) => ({
      ...prev,
      [selectedPlatform]: fullUrl,
    }));

    setLink("");
    socialRef.current.focus();
  };

  const handleRemoveSocial = (platform) => {
    setSocial((prev) => {
      const newSocial = { ...prev };
      delete newSocial[platform];
      return newSocial;
    });
  };

  const handleUpdate = async (userId) => {
    setUpdateLoading(true);

    try {
      const updatedUser = {
        firstname,
        lastname,
        bio,
        location,
        website,
        social,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await updateDoc(doc(db, "users", userId), updatedUser);

      setUsers((prev) =>
        prev?.map((user) =>
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

  return (
    <div className="container profile-settings-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(user.id);
        }}
        className="form"
      >
        {/* Firstname */}
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            required
            className="form-control"
            placeholder="Firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>

        {/* Lastname */}
        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            required
            className="form-control"
            placeholder="Lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="form-control"
            placeholder="User Bio"
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>

        {/* Website */}
        <div className="mb-3">
          <label htmlFor="websitelink" className="form-label">
            Website Link
          </label>
          <input
            type="url"
            id="websitelink"
            name="websitelink"
            className="form-control"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website Link"
          />
        </div>

        {/* Social Media */}
        <div className="mb-3">
          <label htmlFor="social" className="form-label">
            Social Platform
          </label>
          <select
            id="social"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="form-select"
          >
            <option>Select a platform</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="Linkedin">LinkedIn</option>
            <option value="Github">Github</option>
          </select>

          <input
            type="url"
            id="sociallink"
            className="form-control"
            placeholder="Enter username only"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            ref={socialRef}
          />
          <button
            type="button"
            onClick={handleAddSocial}
            className="btn btn-primary"
          >
            <AiOutlinePlus scale={16} />
          </button>

          <table className="table mt-3">
            <tbody>
              {Object.entries(social || {}).map(([platform, url]) => (
                <tr key={platform}>
                  <td className="w-75">
                    {platform}:{" "}
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </td>
                  <td className="w-25">
                    <button
                      onClick={() => handleRemoveSocial(platform)}
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-4">
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

export default BasicProfile;
