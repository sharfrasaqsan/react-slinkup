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
import { IoIosLink } from "react-icons/io";
import {
  BsCalendar2Date,
  BsGenderFemale,
  BsGenderMale,
  BsGenderNeuter,
  BsSuitcaseLg,
} from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { RiGraduationCapLine } from "react-icons/ri";
import { IoLanguage } from "react-icons/io5";

const ProfileDetails = ({ user }) => {
  const genderIcons = {
    Male: <BsGenderMale />,
    Female: <BsGenderFemale />,
    Other: <BsGenderNeuter />,
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

  if (!user) return null;

  return (
    <div className="profile-details">
      <div className="mb-3 text-center">{user.bio}</div>

      <p>
        <FaRegUser /> {user.firstname} {user.lastname}
      </p>

      <p>
        <MdOutlineEmail /> {user.email}
      </p>

      {(user.occupation || []).map((occ, i) => (
        <p key={i}>
          <BsSuitcaseLg /> {occ}
        </p>
      ))}

      {(user.education || []).map((edu, i) => (
        <p key={i}>
          <RiGraduationCapLine /> {edu}
        </p>
      ))}

      {user.birthday && (
        <p>
          <BsCalendar2Date /> {user.birthday}
        </p>
      )}

      {user.gender && (
        <p>
          {genderIcons[user.gender]} {user.gender}
        </p>
      )}

      {user.location && (
        <p>
          <FaLocationDot /> {user.location}
        </p>
      )}

      {user.relationship && (
        <p>
          {statusIcons[user.relationship]} {user.relationship}
        </p>
      )}

      {user.website && (
        <p>
          <IoIosLink />{" "}
          <a href={user.website} target="_blank" rel="noreferrer">
            {user.website}
          </a>
        </p>
      )}

      {(user.languages || []).map((lang, i) => (
        <p key={i}>
          <IoLanguage /> {lang}
        </p>
      ))}

      {user.social &&
        Object.entries(user.social).map(([platform, url]) => {
          const username = url.split("/").pop(); // extract username from the URL
          return (
            <p key={platform}>
              {socialIcons[platform.toLowerCase()]}{" "}
              <a href={url} target="_blank" rel="noreferrer">
                @{username}
              </a>
            </p>
          );
        })}
    </div>
  );
};

export default ProfileDetails;
