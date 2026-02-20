import { useState, useEffect, useContext } from "react";
import toast from 'react-hot-toast';
import { useForm } from "../hooks/useForm";
import AppContext from "../context/AppContext";
import ModalWrapper from "./ModalWrapper.jsx";
import { uploadProfilePicture } from "../utils/api";

export default function ProfileModal({
  isOpen,
  mode, // "create" or "edit"
  onClose,
  onOverlayClick,
  onSubmit,
  onPictureUpload, // Callback after picture upload
}) {
  // Prevent closing when in create mode
  const handleClose = () => {
    if (mode === "create") {
      return; // Don't allow closing in create mode
    }
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (mode === "create") {
      return; // Don't allow closing via overlay click in create mode
    }
    onOverlayClick(e);
  };
  const { currentProfile } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const { values, handleChange, handleReset, setValues } = useForm({
    name: "",
    age: "",
    gender: "",
    sexualOrientation: "",
    profession: "",
    bio: "",
    interests: [],
    convoStarter: "",
    phoneNumber: "",
    profilePicture: null,
  });

  // Populate form with current profile data in edit mode
  useEffect(() => {
    if (mode === "edit" && isOpen && currentProfile) {
      setValues({
        name: currentProfile.name || "",
        age: currentProfile.age || "",
        gender: currentProfile.gender || "",
        sexualOrientation: currentProfile.sexualOrientation || "",
        profession: currentProfile.profession || "",
        bio: currentProfile.bio || "",
        interests: currentProfile.interests || [],
        convoStarter: currentProfile.convoStarter || "",
        phoneNumber: currentProfile.phoneNumber || "",
      });
    } else if (mode === "create" && !isOpen) {
      // Reset form when create modal closes
      handleReset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isOpen, currentProfile, setValues]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...values.interests, value]
      : values.interests.filter((i) => i !== value);

    if (updated.length > 3) {
      toast.error("You can select up to 3 interests only!");
      return;
    }

    setValues({ ...values, interests: updated });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setValues({ ...values, profilePicture: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // First, submit the profile data (without the file)
      const profileData = {
        name: values.name,
        age: values.age,
        gender: values.gender,
        sexualOrientation: values.sexualOrientation,
        profession: values.profession,
        bio: values.bio,
        interests: values.interests,
        convoStarter: values.convoStarter,
        phoneNumber: values.phoneNumber,
      };

      await onSubmit(profileData);

      // Then, if there's a profile picture, upload it separately
      if (values.profilePicture) {
        await uploadProfilePicture(values.profilePicture);
        // Call the callback to refetch profile with updated picture
        if (onPictureUpload) {
          // Small delay to ensure file is fully written (development mode)
          await new Promise(resolve => setTimeout(resolve, 100));
          await onPictureUpload();
        }
      }

      if (mode === "create") {
        handleReset();
      }
      // Call the original onClose to bypass the create mode restriction
      onClose();
    } catch (_err) {
      // error is thrown from onSubmit and handled by the caller
    } finally {
      setIsLoading(false);
    }
  };

  const interestOptions = [
    "gaming",
    "travel",
    "photography",
    "cooking",
    "fitness",
    "music",
    "reading",
    "art",
    "movies",
    "dancing",
    "hiking",
    "coffee",
    "wine",
    "yoga",
    "running",
    "swimming",
    "cycling",
    "camping",
    "meditation",
    "fashion",
  ];

  const title = mode === "create" ? "Create Profile" : "Edit Profile";
  const buttonText = mode === "create" ? "Create Profile" : "Save Changes";

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      onOverlayClick={handleOverlayClick}
      title={title}
      showCloseButton={mode !== "create"}
    >
      <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__fieldset">
            <label htmlFor={`${mode}-picture`} className="modal__label">
              Profile Picture
            </label>
            <input
              type="file"
              id={`${mode}-picture`}
              className="modal__input modal__input--file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
            {values.profilePicture && (
              <p className="modal__file-name">Selected: {values.profilePicture.name}</p>
            )}
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-name`} className="modal__label">
              Name
            </label>
            <input
              type="text"
              id={`${mode}-name`}
              className="modal__input"
              placeholder="First name. Last name optional"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-age`} className="modal__label">
              Age
            </label>
            <input
              type="number"
              id={`${mode}-age`}
              className="modal__input"
              placeholder="Enter your age"
              name="age"
              value={values.age}
              onChange={handleChange}
              required
              min="18"
              max="99"
            />
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-gender`} className="modal__label">
              Gender
            </label>
            <select
              id={`${mode}-gender`}
              className="modal__input"
              name="gender"
              value={values.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-sexualOrientation`} className="modal__label">
              Sexual Orientation
            </label>
            <select
              id={`${mode}-sexualOrientation`}
              className="modal__input"
              name="sexualOrientation"
              value={values.sexualOrientation}
              onChange={handleChange}
              required
            >
              <option value="">Select your sexual orientation</option>
              <option value="straight">Straight</option>
              <option value="gay">Gay</option>
              <option value="bisexual">Bisexual</option>
            </select>
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-profession`} className="modal__label">
              Profession
            </label>
            <input
              type="text"
              id={`${mode}-profession`}
              className="modal__input"
              placeholder="e.g., Software Engineer, Teacher, Artist"
              name="profession"
              value={values.profession}
              onChange={handleChange}
              required
              minLength="2"
              maxLength="50"
            />
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-bio`} className="modal__label">
              Bio
            </label>
            <textarea
              id={`${mode}-bio`}
              className="modal__input"
              placeholder="Tell us about yourself"
              name="bio"
              value={values.bio}
              onChange={handleChange}
              required
              minLength="6"
              maxLength="280"
            />
          </div>

          <div className="modal__fieldset">
            <label className="modal__label">Interests</label>
            <div className="interests-list">
              {interestOptions.map((interest) => {
                const value = interest.toLowerCase();
                const isSelected = values.interests.includes(value);
                return (
                  <label
                    key={interest}
                    className={`interest-option ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={value}
                      checked={isSelected}
                      onChange={handleCheckboxChange}
                    />
                    {interest}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-convostarter`} className="modal__label">
              Conversation Starter
            </label>
            <input
              type="text"
              id={`${mode}-convostarter`}
              className="modal__input"
              placeholder="Enter a conversation starter"
              name="convoStarter"
              value={values.convoStarter}
              onChange={handleChange}
              required
              minLength="10"
              maxLength="160"
            />
          </div>

          <div className="modal__fieldset">
            <label htmlFor={`${mode}-phone`} className="modal__label modal__label--with-hint">
              Phone Number
              <span className="modal__hint" title="We send you a text when someone compatible checks in at the same event as you.">?</span>
            </label>
            <input
              type="tel"
              id={`${mode}-phone`}
              className="modal__input"
              placeholder="+12025551234"
              name="phoneNumber"
              value={values.phoneNumber || ''}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={`modal__submit-btn ${isLoading ? "modal__submit-btn--loading" : ""}`} disabled={isLoading}>
            {isLoading ? (mode === "create" ? "Creating profile..." : "Saving...") : buttonText}
          </button>
        </form>
    </ModalWrapper>
  );
}
