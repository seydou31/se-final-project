import { useState } from "react";
import { useForm } from "../hooks/useForm.js";
import ModalWrapper from "./ModalWrapper.jsx";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onOverlayClick,
  handleForgotPasswordSubmit,
}) {
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
        setErrorMessage(
          err.message || "Failed to send reset link. Please try again.",
        );
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
      <form className="space-y-6 p-6" onSubmit={handleSubmit}>
        <fieldset className="space-y-5" disabled={isSubmitting}>
          <p className="text-slate-600 leading-relaxed text-center">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          <div className="space-y-2">
            <label
              htmlFor="forgot-email"
              className="text-sm font-semibold text-slate-900 block"
            >
              Email Address
            </label>

            <input
              type="email"
              id="forgot-email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {successMessage && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-700 text-center">
                {successMessage}
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`
          w-full rounded-2xl bg-primary px-6 py-3.5
          text-white font-semibold shadow-md
          transition-all duration-300
          hover:opacity-90 hover:shadow-lg
          active:scale-[0.98]
          disabled:cursor-not-allowed disabled:opacity-60
        `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </fieldset>
      </form>
    </ModalWrapper>
  );
}
