import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm.js";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.png";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function SignUpPage({
  handleCreateAccountSubmit,
  handleGoogleSignup,
  handleGoogleSignupWithToken,
  loggingError,
  onSwitchToCreateProfile,
}) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const mobileGoogleSignup = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleSignupWithToken(tokenResponse.access_token),
    onError: () => alert("Google Sign-Up failed. Please try again or use email signup."),
    flow: "implicit",
  });

  const { errors, values, handleChange, handleReset } = useForm({ email: "", password: "" });

  const hasErrors = errors && Object.keys(errors).length > 0;
  const isSubmitDisabled = hasErrors || !values.email || !values.password || confirmPassword.length === 0 || isLoading || !agreedToTerms;

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    handleCreateAccountSubmit(values)
      .then(() => { handleReset(); setConfirmPassword(""); setConfirmError(""); onSwitchToCreateProfile(); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <main className="flex-1 pt-12 sm:pt-16 pb-10 px-4 sm:px-6">
        <div className="min-h-screen flex items-stretch">

          {/* LEFT form */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-10 md:py-12">
            <div className="max-w-md mx-auto w-full">

              <div className="flex justify-center mb-8 sm:mb-10">
                <Link to="/"><img src={logo} alt="BaeQuest" className="w-32 sm:w-36" /></Link>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(42,52,57,0.06)] border border-outline-variant/10">

                <div className="mb-6 sm:mb-8 text-center lg:text-left">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2 font-headline">Create your account</h1>
                  <p className="text-sm sm:text-base text-on-surface-variant">Join BaeQuest and start discovering events.</p>
                </div>

                {/* Google */}
                <div className="space-y-3 mb-6">
                  {isMobile ? (
                    <button type="button" onClick={() => mobileGoogleSignup()}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-sm transition-colors border border-outline-variant/10">
                      <GoogleSVG /> Google
                    </button>
                  ) : (
                    <div className="flex justify-center">
                      <GoogleLogin onSuccess={handleGoogleSignup} text="signup_with" size="large" width="100%" use_fedcm_for_prompt={false}
                        onError={() => alert("Google Sign-Up failed.")} />
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/20" /></div>
                  <span className="relative px-4 bg-white text-sm text-outline">Or sign up with email</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider">Email Address</label>
                    <input type="email" name="email" id="email" value={values.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-surface-container rounded-lg px-4 py-3 text-sm placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30" />
                    {errors.email && <p className="text-error text-xs">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" id="password"
                        value={values.password} onChange={handleChange} placeholder="Create password"
                        className="w-full bg-surface-container rounded-lg px-4 py-3 pr-16 text-sm placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30" />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-outline hover:text-primary">
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="text-error text-xs">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider">Confirm Password</label>
                    <input type="password" value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmError(values.password !== e.target.value ? "Passwords do not match" : "");
                      }}
                      placeholder="Repeat password"
                      className="w-full bg-surface-container rounded-lg px-4 py-3 text-sm placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30" />
                    {confirmError && <p className="text-error text-xs">{confirmError}</p>}
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded border-outline-variant" />
                    <span className="text-xs text-on-surface-variant leading-relaxed">
                      By creating an account you agree to our{" "}
                      <Link to="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>.
                    </span>
                  </label>

                  {loggingError && <p className="text-error text-sm bg-red-50 px-4 py-3 rounded-lg">{loggingError}</p>}

                  <button type="submit" disabled={isSubmitDisabled}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary font-bold ml-1 hover:underline">Sign In</Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT image — desktop only */}
          <div className="hidden lg:flex lg:w-[45%] xl:w-[55%] p-6">
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl">
              <img className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATVv8LNSCq9MyjlUWc1Z9ci1dGsIwLSD_3CcsCxFaaN0O9f-bfqCYk7x5-oKclbL1utK5mYT1me3Vn6-TpCsTsdYh43SvN2Uc1-VhPqi6R2rnP_lk58gplw4K40U4NRzjZURbFlRkar_gEieqzFzRHrG5qozQnAxHyCvHqFpLVGA68zayJVp-ujPgrEnqWifX8EmuRkCbYR1Ox5MKIhOLbJrbHNb3hYE4ICUWbugGiSjYg_OwMdWnPfy-GUGRNn4iemRJktrM_Ag"
                alt="People at a social event" />
            </div>
          </div>

        </div>
      </main>

      {/* Mobile footer image */}
      <div className="lg:hidden w-full px-6 py-8 flex justify-center">
        <div className="w-full max-w-md h-40 rounded-xl overflow-hidden relative">
          <img alt="Social Community" className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxYX0yu37l8gENkVf0zcal229L0HHNdWIUuLyir2-P9a9wffVQhp57LX1edRQyss8b9YtkyVil7c-Qn8PAFqDGL7sd2-u8mneCZVgo222m5FIS4oeg-vxYGIaRpUkuXqq7T_YcugkOgTUZLHs9oYJ3bo4moJ_JdjQlp-fMf4NiEeKfiEcNvURkZDcWsloWoYsO5wWy-XNUDN2sUTlxOmIQNeQre915_6DflL-L9vZWs1kmUMVnoGlU_Weecbpe3yEGXw-1eNPltQ" />
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
