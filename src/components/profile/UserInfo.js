import {
  FaFacebookF,
  FaGithub,
  FaHeart,
  FaInstagram,
  FaLinkedin,
  FaRegUser,
  FaTwitter,
  FaUserFriends,
  FaUserPlus,
  FaUserSlash,
  FaUserTimes,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { MdOutlineEmail } from "react-icons/md";
import {
  BsCalendar2Date,
  BsGenderFemale,
  BsGenderMale,
  BsGenderNeuter,
  BsSuitcaseLg,
} from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { RiGraduationCapLine } from "react-icons/ri";
import { IoLanguage } from "react-icons/io5";

const UserInfo = () => {
  const { user } = useAuth();

  if (!user) return null;

  const genderIcons = {
    male: <BsGenderMale />,
    female: <BsGenderFemale />,
    other: <BsGenderNeuter />,
  };

  const socialIcons = {
    facebook: <FaFacebookF />,
    twitter: <FaTwitter />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedin />,
    github: <FaGithub />,
  };

  const statusIcons = {
    Single: <FaUserPlus />,
    "In a relationship": <FaHeart />,
    Married: <FaUserFriends />,
    Divorced: <FaUserSlash />,
    Widowed: <FaUserTimes />,
  };

  return (
    <div style={{ padding: "1rem", backgroundColor: "#d5d5d5ff" }}>
      <p>{user.username}</p>
      <p>
        {(user.followers || []).length || 0} followers |{" "}
        {(user.following || []).length || 0} following
      </p>

      <p>{user.bio}</p>

      <p>
        <span>
          <FaRegUser /> {user.firstname} {user.lastname}
        </span>
      </p>

      <p>
        <MdOutlineEmail /> {user.email}
      </p>

      {user.occupation && (
        <div>
          {(user.occupation || [])?.map((occ, index) => (
            <p key={index}>
              <BsSuitcaseLg /> {occ}
            </p>
          ))}
        </div>
      )}

      {user.education && (
        <div>
          {(user.education || [])?.map((edu, index) => (
            <p key={index}>
              <RiGraduationCapLine /> {edu}
            </p>
          ))}
        </div>
      )}

      <p>
        <BsCalendar2Date /> {user.birthday || "Not specified"}
      </p>

      <p>
        {genderIcons[user.gender] || null} {user.gender || "Not specified"}
      </p>

      <p>
        <FaLocationDot /> {user.location || "Not specified"}
      </p>

      {user.relationship && (
        <p>
          {statusIcons[user.relationship] || null}{" "}
          {user.relationship || "Not specified"}
        </p>
      )}

      {user.website && <p>Website: {user.website}</p>}

      {user.languages && user.languages?.length > 0 && (
        <div>
          {(user.languages || [])?.map((lang, index) => (
            <p key={index}>
              <IoLanguage /> {lang}
            </p>
          ))}
        </div>
      )}

      {user.social && Object.keys(user.social).length > 0 && (
        <div>
          {Object.entries(user.social || {})?.map(([platform, url]) => (
            <p key={platform}>
              {socialIcons[platform.toLowerCase()] || null} :{" "}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
