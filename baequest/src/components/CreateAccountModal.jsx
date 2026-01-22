import React, { useState } from "react";
import { useForm } from "../hooks/useForm.js";
import ModalWrapper from "./ModalWrapper.jsx";
import { GoogleLogin } from '@react-oauth/google';

export default function CreateAccountModal({
  isOpen,
  onClose,
  onOverlayClick,
  handleCreateAccountSubmit,
  handleGoogleSignup,
}) {
  const { errors, values, handleChange, handleReset } = useForm({
    email: "",
    password: "",
  });

  const [confirmError, setConfirmError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const hasErrors = errors && Object.keys(errors).length > 0;
  const emptyFields =
    !values.email || !values.password || confirmPassword.length === 0;
  const isSubmitDisabled = hasErrors || emptyFields;

  function handleSubmit(e) {
    e.preventDefault();

    handleCreateAccountSubmit(values)
      .then(() => {
        handleReset();
        setConfirmPassword("");
        setConfirmError("");
      })
      .catch(console.error);
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={onOverlayClick}
      title="Create Account"
    >
      <form className="modal__form" onSubmit={handleSubmit}>
          <fieldset className="modal__fieldset">
            <label htmlFor="email" className="modal__label">
              Email
            </label>
            <input
              type="email"
              className="modal__input"
              id="email"
              placeholder="Enter email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="modal__validation">{errors.email}</p>
            )}
            <label htmlFor="password" className="modal__label">
              Password
            </label>
            <input
              type="password"
              className="modal__input"
              id="password"
              name="password"
              value={values.password}
              placeholder="Create Password"
              onChange={handleChange}
            />
            <label htmlFor="confirmpassword" className="modal__label">
              Confirm Password
            </label>
            <input
              type="password"
              className="modal__input"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (values.password !== e.target.value) {
                  setConfirmError("Passwords do not match");
                  return;
                } else {
                  setConfirmError("")
                }
              }}
            />
            {confirmError && (
              <p className="modal__validation">{confirmError}</p>
            )}
            {errors.password && (
              <p className="modal__validation">{errors.password}</p>
            )}
            <button
              type="submit"
              className="modal__submit-btn"
              disabled={isSubmitDisabled}
            >
              Continue
            </button>
          </fieldset>
        </form>

        <div className="modal__divider">
          <span>OR</span>
        </div>

        <div className="modal__google-btn">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => {
              console.error('Google Sign-Up Failed');
            }}
            text="signup_with"
            size="large"
            width="100%"
          />
        </div>
    </ModalWrapper>
  );
}
