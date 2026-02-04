import { useState } from "react";
import { useForm } from "../hooks/useForm.js";
import ModalWrapper from "./ModalWrapper.jsx";

export default function ForgotPasswordModal({ isOpen, onClose, onOverlayClick, handleForgotPasswordSubmit }) {
  const { errors, values, handleChange, handleReset } = useForm({
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hasErrors = errors && Object.keys(errors).length > 0;
  const emptyFields = !values.email;
  const isSubmitDisabled = hasErrors || emptyFields || isSubmitting;

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    handleForgotPasswordSubmit(values.email)
      .then(() => {
        setSuccessMessage("Password reset link sent! Check your email.");
        handleReset();
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 3000);
      })
      .catch((err) => {
        setErrorMessage(err.message || "Failed to send reset link. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleModalClose() {
    handleReset();
    setSuccessMessage("");
    setErrorMessage("");
    onClose();
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleModalClose}
      onOverlayClick={onOverlayClick}
      title="Forgot Password"
    >
      <form className="modal__form" onSubmit={handleSubmit}>
        <fieldset className="modal__fieldset">
          <p style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "var(--text-secondary)",
            fontSize: "0.95rem"
          }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <label htmlFor="forgot-email" className="modal__label">
            Email
          </label>
          <input
            type="email"
            className="modal__input"
            id="forgot-email"
            placeholder="Enter your email"
            name="email"
            value={values.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="modal__validation">{errors.email}</p>
          )}

          <button
            type="submit"
            className="modal__submit-btn"
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>

          {successMessage && (
            <p className="modal__success-message">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="modal__login-error">{errorMessage}</p>
          )}
        </fieldset>
      </form>
    </ModalWrapper>
  );
}
