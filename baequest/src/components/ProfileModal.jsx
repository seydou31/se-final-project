import { useEffect, useContext } from "react";
import { useForm } from "../hooks/useForm";
import AppContext from "../context/AppContext";
import ModalWrapper from "./ModalWrapper.jsx";

export default function ProfileModal({
  isOpen,
  mode, // "create" or "edit"
  onClose,
  onOverlayClick,
  onSubmit,
}) {
  const { currentProfile } = useContext(AppContext);

  const { values, handleChange, handleReset, setValues } = useForm({
    name: "",
    age: "",
    gender: "",
    bio: "",
    interests: [],
    convoStarter: "",
  });

  // Populate form with current profile data in edit mode
  useEffect(() => {
    if (mode === "edit" && isOpen && currentProfile) {
      setValues({
        name: currentProfile.name || "",
        age: currentProfile.age || "",
        gender: currentProfile.gender || "",
        bio: currentProfile.bio || "",
        interests: currentProfile.interests || [],
        convoStarter: currentProfile.convoStarter || "",
      });
    } else if (mode === "create" && !isOpen) {
      // Reset form when create modal closes
      handleReset();
    }
  }, [mode, isOpen, currentProfile, setValues]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...values.interests, value]
      : values.interests.filter((i) => i !== value);

    if (updated.length > 3) {
      alert("You can select up to 3 interests only!");
      return;
    }

    setValues({ ...values, interests: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(values);
      if (mode === "create") {
        handleReset();
      }
      onClose();
    } catch (err) {
      console.error(`Profile ${mode} error:`, err);
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
      onClose={onClose}
      onOverlayClick={onOverlayClick}
      title={title}
    >
      <form className="modal__form" onSubmit={handleSubmit}>
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

          <button type="submit" className="modal__submit-btn">
            {buttonText}
          </button>
        </form>
    </ModalWrapper>
  );
}
