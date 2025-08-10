import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { toast } from "react-toastify";
import ButtonSpinner from "../../../utils/ButtonSpinner";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";
import LoadingSpinner from "../../../utils/LoadingSpinner";

const BasicProfileSettings = () => {
  const { user } = useAuth();
  const { setUsers, loading } = useData();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  const [social, setSocial] = useState({}); // stores all platforms + links
  const [selectedPlatform, setSelectedPlatform] = useState("twitter"); // dropdown selection
  const [link, setLink] = useState(""); // current link input

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPassword(user.password);
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

  const handleUpdate = async (userId) => {
    setUpdateLoading(true);

    if (!username || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    

    try {
      const updatedUser = {
        username,
        email,
        password,
        firstname,
        lastname,
        bio,
        location,
        website,
        social,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };

      await updateDoc(doc(db, "users", userId), { ...updatedUser });

      setUsers((prev) =>
        prev?.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
    setUpdateLoading(false);
  };

  const handleAddSocial = () => {
    if (!link.trim()) return;

    try {
      new URL(link.trim()); // throws if invalid
    } catch {
      toast.error("Please enter a valid URL.");
      return;
    }

    if (!selectedPlatform) {
      toast.error("Please select a platform.");
      return;
    }

    setSocial((prev) => ({
      ...prev,
      [selectedPlatform]: link.trim(),
    }));

    setLink("");
  };

  const handleRemoveSocial = (platform) => {
    setSocial((prev) => {
      const newSocial = { ...prev };
      delete newSocial[platform];
      return newSocial;
    });
  };

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
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            disabled
            readOnly
            placeholder="Username"
            value={username}
          />
        </div>

        <div>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled
            readOnly
            placeholder="Email"
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            disabled
            readOnly
            placeholder="Password"
            value={password}
          />
        </div>

        <div>
          <label htmlFor="firstname">Firstname</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            required
            placeholder="Firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="lastname">Lastname</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            required
            placeholder="Lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="User Bio"
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>

        <div>
          <label htmlFor="websitelink">Website Link</label>
          <input
            type="url"
            id="websitelink"
            name="websitelink"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website Link"
          />
        </div>

        <div>
          <label htmlFor="social">Social Platform</label>
          <select
            id="social"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Linkedin">LinkedIn</option>
            <option value="Github">Github</option>
          </select>

          <input
            type="url"
            id="sociallink"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <button type="button" onClick={handleAddSocial}>
            Add
          </button>

          <table>
            <tbody>
              {Object.entries(social || {}).map(([platform, url]) => (
                <tr key={platform}>
                  <td>
                    {platform}: {url}
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveSocial(platform)}
                      type="button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit">
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

export default BasicProfileSettings;
