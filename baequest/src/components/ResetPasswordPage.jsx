import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "../hooks/useForm.js";
import "../blocks/reset-password.css";

export default function ResetPasswordPage({ handleResetPassword }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { errors, values, handleChange, handleReset } = useForm({
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing reset token.");
    }
  }, [token]);

  const hasErrors = errors && Object.keys(errors).length > 0;
  const emptyFields = !values.password || !values.confirmPassword;
  const passwordMismatch = values.password !== values.confirmPassword;
  const isSubmitDisabled = hasErrors || emptyFields || passwordMismatch || isSubmitting || !token;

  function handleSubmit(e) {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    handleResetPassword(token, values.password)
      .then(() => {
        setSuccessMessage("Password reset successful! Redirecting to login...");
        handleReset();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        console.error("Password reset failed:", err);
        setErrorMessage(err.message || "Failed to reset password. The link may have expired.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="reset-password">
      <div className="reset-password__container">
        <h1 className="reset-password__title">Reset Your Password</h1>

        {!token ? (
          <div className="reset-password__error-box">
            <p>Invalid or missing reset token. Please request a new password reset link.</p>
            <button
              className="reset-password__button"
              onClick={() => navigate("/")}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form className="reset-password__form" onSubmit={handleSubmit}>
            <fieldset className="reset-password__fieldset">
              <label htmlFor="password" className="reset-password__label">
                New Password
              </label>
              <input
                type="password"
                className="reset-password__input"
                id="password"
                placeholder="Enter new password"
                name="password"
                value={values.password}
                onChange={handleChange}
                disabled={isSubmitting}
                minLength="8"
              />
              {errors.password && (
                <p className="reset-password__validation">{errors.password}</p>
              )}

              <label htmlFor="confirmPassword" className="reset-password__label">
                Confirm New Password
              </label>
              <input
                type="password"
                className="reset-password__input"
                id="confirmPassword"
                placeholder="Confirm new password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                minLength="8"
              />
              {errors.confirmPassword && (
                <p className="reset-password__validation">{errors.confirmPassword}</p>
              )}
              {passwordMismatch && values.confirmPassword && (
                <p className="reset-password__validation">Passwords do not match</p>
              )}

              <button
                type="submit"
                className="reset-password__button"
                disabled={isSubmitDisabled}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>

              {successMessage && (
                <p className="reset-password__success">{successMessage}</p>
              )}

              {errorMessage && (
                <p className="reset-password__error">{errorMessage}</p>
              )}
            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
}
