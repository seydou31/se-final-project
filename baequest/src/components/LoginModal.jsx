import { useForm } from "../hooks/useForm.js";
import ModalWrapper from "./ModalWrapper.jsx";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

// Detect mobile devices
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function LoginModal({ isOpen, onClose, onOverlayClick, handleLoginSubmit, handleGoogleLogin, handleGoogleLoginWithToken, loggingError, handleForgotPasswordModal, handleResendVerification }) {
  // Custom Google login for mobile using implicit flow
  const mobileGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleLoginWithToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Google Sign-In Error:', error);
      alert('Google Sign-In failed. Please try again or use email login.');
    },
    flow: 'implicit',
  });
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
          {isMobile ? (
            <button
              type="button"
              onClick={() => mobileGoogleLogin()}
              className="modal__google-custom-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          ) : (
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
          )}
        </div>
    </ModalWrapper>
  );
}
