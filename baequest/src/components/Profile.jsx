import { useContext } from "react";
import AppContext from "../context/AppContext";
import "../blocks/profile.css";
import { Pencil } from "lucide-react";

export default function Profile({handleEditModal}) {
  const { currentProfile } = useContext(AppContext);
  const {
    name,
    age,
    gender,
    profession,
    bio,
    interests = [],
    convoStarter,
    profilePicture,
  } = currentProfile;

  const baseUrl = import.meta.env.PROD
    ? "https://api.baequests.com"
    : "http://localhost:3001";

  // Determine if profilePicture is a full URL (S3) or a relative path (local)
  const getImageUrl = (pictureUrl) => {
    if (!pictureUrl) return null;
    // Check if it's already a full URL (starts with http:// or https://)
    if (pictureUrl.startsWith('http://') || pictureUrl.startsWith('https://')) {
      return pictureUrl; // S3 URL
    }
    // Otherwise, it's a local path - prepend the base URL
    return `${baseUrl}${pictureUrl}`;
  };

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__header">
          <Pencil onClick={handleEditModal} size={16} className="profile__edit-btn"/>
          <div className="profile__avatar">
            {profilePicture ? (
              <img
                key={profilePicture}
                src={getImageUrl(profilePicture)}
                alt={`${name}'s profile`}
                className="profile__avatar-image"
              />
            ) : (
              <div className="profile__avatar-placeholder">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
        </div>

        <div className="profile__content">
          <h2 className="profile__name">{name}</h2>
        <p className="profile__subtitle">
          {age} • {gender}
        </p>
        {profession && (
          <p className="profile__profession">{profession}</p>
        )}
        <h3 className="profile__bio-title">Bio</h3>
        <p className="profile__bio">{bio}</p>

        <div className="profile__section">
          <h3 className="profile__label">Interests</h3>
          <div className="profile__interests">
            {interests.map((interest) => (
              <span key={interest} className="profile__tag">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="profile__section">
          <h3 className="profile__label">Conversation Starter</h3>
          <div className="profile__quote">"{convoStarter}"</div>
        </div>
        </div>
      </div>
    </div>
  );
}
