import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "../hooks/useForm.js";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.png";
import community from "../assets/community.png";
import SocialCommunity from "../assets/SocialCommunity.png";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function SignInPage({
  handleLoginSubmit,
  handleGoogleLogin,
  handleGoogleLoginWithToken,
  loggingError,
  handleForgotPasswordModal,
  handleResendVerification,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const mobileGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleLoginWithToken(tokenResponse.access_token),
    onError: () => alert("Google Sign-In failed. Please try again or use email login."),
    flow: "implicit",
  });

  const { errors, values, handleChange, handleReset } = useForm({ email: "", password: "" });

  const hasErrors = errors && Object.keys(errors).length > 0;
  const isSubmitDisabled = hasErrors || !values.email || !values.password;

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    handleLoginSubmit(values)
      .then((success) => { if (success) { handleReset(); } })
      .finally(() => setIsSubmitting(false));  // ← always clear
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <main className="flex-1 pt-12 sm:pt-16 pb-10 px-4 sm:px-6">

        {/* Logo */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <Link to="/"><img src={logo} alt="BaeQuest" className="w-32 sm:w-36 md:w-40" /></Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex flex-col lg:flex-row max-w-5xl w-full gap-8 md:gap-10 lg:gap-12 items-center">

            {/* Left panel — desktop only */}
            <div className="hidden lg:flex flex-col flex-1 space-y-6 md:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-headline">
                  Meet new people in a space that feels easy.
                </h2>
                <p className="text-base md:text-lg text-on-surface-variant max-w-md leading-relaxed">
                  Join over 10,000 people discovering meaningful connections through local curated events.
                </p>
              </div>
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl">
                <img className="w-full h-full object-cover"
                  src={community}
                  alt="People connecting at an event" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                  <p className="font-bold text-lg sm:text-xl italic">"I found my best friends here."</p>
                  <p className="text-xs sm:text-sm opacity-90">— Sarah J., Member since 2023</p>
                </div>
              </div>
            </div>

            {/* Right — form card */}
            <div className="w-full max-w-md">
              <div className="bg-white rounded-xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(42,52,57,0.06)] border border-outline-variant/10">

                <div className="mb-6 sm:mb-8 md:mb-10 text-center lg:text-left">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2 font-headline">
                    Welcome back to <span className="text-primary uppercase">BaeQuest</span>
                  </h1>
                  <p className="text-sm sm:text-base text-on-surface-variant">Sign in to find your next community event.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                      <input
                        type="email" name="email" id="loginemail"
                        value={values.email} onChange={handleChange}
                        placeholder="name@example.com"
                        className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-surface-container rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    {errors.email && <p className="text-error text-xs">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <label className="font-semibold uppercase tracking-wider">Password</label>
                      <button type="button" onClick={handleForgotPasswordModal} className="text-primary hover:underline">Forgot?</button>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                      <input
                        type={showPassword ? "text" : "password"} name="password" id="loginpassword"
                        value={values.password} onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-11 sm:pl-12 pr-16 py-3 sm:py-4 bg-surface-container rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-outline hover:text-primary">
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="text-error text-xs">{errors.password}</p>}
                  </div>

                  <button type="submit" disabled={isSubmitDisabled || isSubmitting}
                    className="w-full py-3 sm:py-4 bg-primary text-white font-bold rounded-lg text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                    {isSubmitting ? "Signing in…" : "Sign In"}
                  </button>

                  {loggingError && (
                    <div className="text-error text-sm bg-red-50 px-4 py-3 rounded-lg">
                      {loggingError}
                      {loggingError.includes("verify your email") && (
                        <button type="button" onClick={() => handleResendVerification(values.email)}
                          className="ml-2 font-bold underline">Resend verification</button>
                      )}
                    </div>
                  )}
                </form>

                {/* Divider */}
                <div className="relative my-6 sm:my-8 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/20" />
                  </div>
                  <span className="relative px-3 sm:px-4 bg-white text-xs sm:text-sm text-outline">Or continue with</span>
                </div>

                {/* Google */}
                <div className="grid grid-cols-1 gap-3">
                  {isMobile ? (
                    <button type="button" onClick={() => mobileGoogleLogin()}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
                      <GoogleSVG /> Google
                    </button>
                  ) : (
                    <div className="flex justify-center">
                      <GoogleLogin onSuccess={handleGoogleLogin} text="signin_with" size="large" width="100%" use_fedcm_for_prompt={false}
                        onError={() => alert("Google Sign-In failed.")} />
                    </div>
                  )}
                </div>

                <div className="mt-6 sm:mt-8 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="text-primary font-bold ml-1 hover:underline">Sign up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile footer image */}
      <div className="lg:hidden w-full px-6 py-8 flex justify-center">
        <div className="w-full max-w-md h-40 rounded-xl overflow-hidden relative">
          <img alt="Social Community" className="w-full h-full object-cover"
            src={SocialCommunity} />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
}

function GoogleSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
      <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
    </svg>
  );
}
