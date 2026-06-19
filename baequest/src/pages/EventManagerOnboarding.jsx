import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { eventManagerGetOnboardingLink, eventManagerVerifyOnboarding } from "../utils/api.js";
import logo from "../assets/logo.png";

function StatusScreen({ icon, iconFill, title, subtitle, children }) {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm sm:max-w-md text-center bg-white rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.06)] p-8 sm:p-10">
        <div className="w-20 h-20 mx-auto mb-6 bg-surface-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-primary" style={iconFill ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
        </div>
        <h2 className="text-xl font-extrabold font-headline text-on-surface mb-3">{title}</h2>
        {subtitle && <p className="text-sm text-on-surface-variant">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

export default function EventManagerOnboarding() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isSuccess = searchParams.get("success") === "true";
  const isRefresh = searchParams.get("refresh") === "true";

  useEffect(() => {
    if (!isSuccess) return;
    setStatus("verifying");
    eventManagerVerifyOnboarding()
      .then(res => {
        if (res.onboardingComplete) {
          setStatus("complete");
          setTimeout(() => navigate("/event-manager/dashboard"), 2000);
        } else {
          setError("Onboarding is not fully complete. Please finish all required steps.");
          setStatus("error");
        }
      })
      .catch(() => {
        setError("Could not verify onboarding. Please try again.");
        setStatus("error");
      });
  }, [isSuccess, navigate]);

  async function handleStart() {
    setError("");
    try {
      const res = await eventManagerGetOnboardingLink();
      window.location.href = res.url;
    } catch {
      setError("Could not start onboarding. Please try again.");
    }
  }

  if (status === "verifying") {
    return (
      <StatusScreen icon="sync" title="Verifying your account…" subtitle="Please wait while we confirm your Stripe setup." />
    );
  }

  if (status === "complete") {
    return (
      <StatusScreen icon="check_circle" iconFill title="You're all set!" subtitle="Redirecting you to your dashboard…">
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </StatusScreen>
    );
  }

  /* ── Main onboarding screen: matches event_manger_conection_account.html ── */
  return (
    <div
      className="font-body text-on-surface min-h-screen flex flex-col"
      style={{
        backgroundColor: "#f6fafe",
        backgroundImage:
          "radial-gradient(at 0% 0%, rgba(189,12,59,0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(110,59,216,0.05) 0px, transparent 50%)",
      }}
    >
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <main className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          <div className="bg-white rounded-lg shadow-[0_20px_50px_rgba(42,52,57,0.06)] overflow-hidden relative border border-outline-variant/10">

            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

            <div className="p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col items-center text-center">

              {/* Icon */}
              <div className="mb-6 sm:mb-8 md:mb-10 relative">
                <div className="absolute -inset-3 sm:-inset-4 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-surface-container flex items-center justify-center rounded-full">
                  <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl md:text-5xl">account_balance</span>
                </div>
                <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center border-2 sm:border-4 border-white">
                  <span className="material-symbols-outlined text-white text-sm sm:text-base md:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
              </div>

              {/* Heading */}
              <h1 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mb-4 sm:mb-6 leading-tight">
                Connect Your Bank Account
              </h1>

              {/* Info card */}
              <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 md:mb-10 w-full">
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  As a Curated Encounter Host, you will receive{" "}
                  <span className="text-primary font-bold">30% of proceeds</span>
                  {" "}directly to your linked account for every successful event you manage.
                </p>
              </div>

              {/* Error */}
              {error && (
                <p className="w-full mb-4 text-error text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:gap-4 w-full">
                <button
                  onClick={handleStart}
                  className="bg-primary text-white font-headline font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 rounded-lg text-sm sm:text-base md:text-lg shadow-lg shadow-primary/20 hover:bg-primary-dim hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
                >
                  {isRefresh ? "Continue Onboarding" : "Connect Bank Account"}
                  <span className="material-symbols-outlined text-base sm:text-lg">arrow_forward</span>
                </button>
                <button
                  onClick={() => navigate("/event-manager/dashboard")}
                  className="bg-transparent text-on-surface-variant font-headline font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-sm sm:text-base hover:bg-surface-container-high/50 transition-colors duration-300"
                >
                  Skip for now
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
