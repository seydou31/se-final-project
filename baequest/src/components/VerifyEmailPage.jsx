import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../blocks/reset-password.css";

export default function VerifyEmailPage({ handleEmailVerification }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing verification token.");
      return;
    }

    // Automatically verify on page load
    setIsVerifying(true);
    handleEmailVerification(token)
      .then(() => {
        setSuccessMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        setErrorMessage(err.message || "Failed to verify email. The link may have expired.");
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token, handleEmailVerification, navigate]);

  return (
    <div className="reset-password">
      <div className="reset-password__container">
        <h1 className="reset-password__title">Email Verification</h1>

        {isVerifying && (
          <div className="reset-password__info">
            <p>Verifying your email address...</p>
          </div>
        )}

        {successMessage && (
          <div className="reset-password__success-box">
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="reset-password__error-box">
            <p>{errorMessage}</p>
            <button
              className="reset-password__button"
              onClick={() => navigate("/")}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
