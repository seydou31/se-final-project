import { useForm } from "../hooks/useForm.js";
import ModalWrapper from "./ModalWrapper.jsx";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginModal({ isOpen, onClose, onOverlayClick, handleLoginSubmit, handleGoogleLogin, loggingError, handleForgotPasswordModal, handleResendVerification }) {
  const { errors, values, handleChange, handleReset } = useForm({
    email: "",
    password: "",
  });

  const hasErrors = errors && Object.keys(errors).length > 0;
  const emptyFields = !values.email || !values.password;
  const isSubmitDisabled = hasErrors || emptyFields;

  function handleSubmit(e) {
    e.preventDefault();
    handleLoginSubmit(values).then((success) => {
      if (success) {
        handleReset();
      }
      // Don't reset on failure - keep the email so user can resend verification
    });
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={onOverlayClick}
      title="Login"
    >
      <form className="modal__form" onSubmit={handleSubmit}>
          <fieldset className="modal__fieldset">
            <label htmlFor="email" className="modal__label">
              Email
            </label>
            <input
              type="email"
              className="modal__input"
              id="loginemail"
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
              id="loginpassword"
              name="password"
              value={values.password}
              placeholder="Create Password"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="modal__validation">{errors.password}</p>
            )}

            <button
              type="button"
              className="modal__forgot-password"
              onClick={handleForgotPasswordModal}
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              className="modal__submit-btn"
              disabled={isSubmitDisabled}
            >
              Login
            </button>
           { loggingError && <p className="modal__login-error">{loggingError}</p>}

           {loggingError && loggingError.includes("verify your email") && (
             <button
               type="button"
               className="modal__resend-btn"
               onClick={() => handleResendVerification(values.email)}
             >
               Resend Verification Email
             </button>
           )}
          </fieldset>
        </form>

        <div className="modal__divider">
          <span>OR</span>
        </div>

        <div className="modal__google-btn">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => {
              console.error('Google Sign-In Error:', error);
              alert('Google Sign-In failed. Please try again or use email login.');
            }}
            text="signin_with"
            size="large"
            width="100%"
            use_fedcm_for_prompt={false}
          />
        </div>
    </ModalWrapper>
  );
}
