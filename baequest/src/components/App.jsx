import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./ProtectedRoute.jsx";
import "../blocks/app.css";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Main from "./Main.jsx";
import Profile from "./Profile.jsx";
import EventsPage from "../pages/EventsPage.jsx";
import MyEvents from "./MyEvents.jsx";
import Loading from "./Loading.jsx";
import ProfileModal from "./ProfileModal.jsx";
import CheckoutModal from "./CheckoutModal.jsx";
import DeleteAccountModal from "./DeleteAccountModal.jsx";
import ForgotPasswordModal from "./ForgotPasswordModal.jsx";
import ResetPasswordPage from "./ResetPasswordPage.jsx";
import VerifyEmailPage from "./VerifyEmailPage.jsx";
import AboutUs from "../pages/AboutUs.jsx";
import Contact from "../pages/Contact.jsx";
import Careers from "../pages/Careers.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";
import TermsOfService from "../pages/TermsOfService.jsx";
import CookiePolicy from "../pages/CookiePolicy.jsx";
import WelcomeLanding from "./WelcomeLanding.jsx";
import EventManagerCreateEvent from "../pages/AddEvent.jsx";
import EventManagerMyEvents from "../pages/EventManagerMyEvents.jsx";
import EventFeedbackPage from "./EventFeedbackPage.jsx";
import EventManagerLogin from "../pages/EventManagerLogin.jsx";
import EventManagerSignup from "../pages/EventManagerSignup.jsx";
import EventManagerDashboard from "../pages/EventManagerDashboard.jsx";
import EventManagerOnboarding from "../pages/EventManagerOnboarding.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import SignInPage from "../pages/SignInPage.jsx";
import SignUpPage from "../pages/SignUpPage.jsx";
import EditProfilePage from "../pages/EditProfilePage.jsx";
import {
  createProfile,
  createUser,
  getProfile,
  login,
  logout,
  updateProfile,
  checkinAtEvent,
  heartbeat,
  getUsersAtEvent,
  checkoutFromEvent,
  deleteUser,
  deleteProfile,
  googleAuth,
  googleAuthWithToken,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  sendEmailVerification,
  getCheckinStatus,
} from "../utils/api.js";
import AppContext from "../context/AppContext.js";
import { trackPageView } from "../utils/analytics.js";
import { SocketProvider } from "../context/SocketProvider.jsx";
import RequireEventManagerAuth from "./RequireEventManagerAuth.jsx";
import { useEventManagerAuth } from "../context/EventManagerAuthContext.jsx";
import useEventStore from "../store/useEventStore.js";
import NotFound from "../pages/NotFound.jsx";
import AuthRedirectRoute from "../routes/AuthRedirectRoute.jsx";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    name: "", age: 0, gender: "", profession: "", interests: [], convoStarter: "",
  });

  const [isLoggedInLoading, setIsLoggedInLoading] = useState(checkTokenExists());
  const [loggingError, setLoggingError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { isAuthenticated: isEMAuthenticated, logoutLocal } = useEventManagerAuth();
  const location = useLocation();
  const {
    currentEvent,
    otherProfiles,
    isCheckedIn,
    checkInSuccess,
    setOtherProfiles,
    clearEventState,
  } = useEventStore();

  useEffect(() => { trackPageView(location.pathname + location.search); }, [location]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && activeModal) {
        if (activeModal === "createprofilemodal") return;
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [activeModal]);

  const navigate = useNavigate();

  function storeTokenExists() { localStorage.setItem("tokenExists", "true"); }
  function checkTokenExists() { return Boolean(localStorage.getItem("tokenExists")); }
  function removeTokenExists() { localStorage.removeItem("tokenExists"); }

  useEffect(() => {
    if (!checkTokenExists()) {
      setIsLoggedInLoading(false);
      return;
    }

    getProfile()
      .then(async (res) => {
        console.log("Fetched profile on app load:", res);
        setCurrentProfile(res);
        setIsLoggedIn(true);
        storeTokenExists();

        const savedEvent = localStorage.getItem("currentEvent");

        if (savedEvent) {
          let event = null;

          try {
            event = JSON.parse(savedEvent);
          } catch {
            localStorage.removeItem("currentEvent");
          }

          if (event?._id) {
            try {
              const users = await getUsersAtEvent(event._id);

              // SINGLE ATOMIC STORE UPDATE
              checkInSuccess(event, users || []);

            } catch (err) {
              console.error("Failed to restore event:", err);

              clearEventState();
              localStorage.removeItem("currentEvent");
            }
          }
        }
      })
      .then(() => {
        const savedEvent = localStorage.getItem("currentEvent");
        if (savedEvent) {
          navigate("/events");
        } 
        
        // EVENT MANAGER ROUTES
        if (location.pathname.startsWith("/event-manager")) {
          navigate("/event-manager/dashboard");
          return;
        }

        // NORMAL USER ROUTES
        if (
          location.pathname === "/signin" ||
          location.pathname === "/signup" ||
          location.pathname === "/"
        ) {
          navigate("/profile");
        }
      })
      .catch(() => {
        removeTokenExists();
        setIsLoggedIn(false);

        clearEventState();
      })
      .finally(() => {
        setIsLoggedInLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isCheckedIn || !currentEvent?._id) return;
    const eventLng = currentEvent.lng;
    const eventLat = currentEvent.lat;
    if (!eventLat || !eventLng) return;

    function haversineKm(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    const interval = setInterval(() => {
      if (currentEvent.endTime && new Date() > new Date(currentEvent.endTime)) {
        checkoutFromEvent(currentEvent._id).catch(() => {});
        clearEventState();
        toast('The event has ended. You have been checked out.', { icon: '🎉' });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const distanceKm = haversineKm(latitude, longitude, eventLat, eventLng);
          if (distanceKm > 0.80467) {
            checkoutFromEvent(currentEvent._id).catch(() => {});    
            clearEventState();
            toast('You have been checked out — you left the event area.', { icon: '📍' });
          } else {
            heartbeat(currentEvent._id).catch((err) => {
              if (err === 'Session expired. Please login again.' || err?.includes?.('401')) {        
              clearEventState();
              }
            });
          }
        },
        () => {
          heartbeat(currentEvent._id).catch((err) => {
            if (err === 'Session expired. Please login again.' || err?.includes?.('401')) {      
              clearEventState();
            }
          });
        }
      );
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isCheckedIn, currentEvent?._id, currentEvent?.endTime, currentEvent?.lat, currentEvent?.lng]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // only continue if stripe success exists
    if (!params.get("checkin_success")) return;

    const stored = sessionStorage.getItem("pendingCheckinEvent");

    if (!stored) {
      toast.error("No pending event found.");
      return;
    }

    let eventData = null;

    try {
      eventData = JSON.parse(stored);
    } catch {
      sessionStorage.removeItem("pendingCheckinEvent");
      toast.error("Invalid event data.");
      return;
    }

    // cleanup
    sessionStorage.removeItem("pendingCheckinEvent");

    // remove query params
    window.history.replaceState(
      {},
      "",
      window.location.pathname
    );

    toast.loading(
      "Payment successful. Completing check-in...",
      { id: "payment-checkin" }
    );

    let attempts = 0;

    const retry = () => {
      if (++attempts < 15) {
        setTimeout(poll, 1000);
      } else {
        toast.dismiss("payment-checkin");
        toast.error(
          "Check-in confirmation timed out."
        );
      }
    };

    const poll = async () => {
      try {
        const { checkedIn } =
          await getCheckinStatus(
            eventData._id
          );

        if (!checkedIn) {
          return retry();
        }

        const users =
          await getUsersAtEvent(
            eventData._id
          );

        checkInSuccess(
          eventData,
          users || []
        );

        toast.dismiss(
          "payment-checkin"
        );

        toast.success(
          "Checked in successfully"
        );

        navigate("/events");
      } catch (err) {
        console.error(err);
        retry();
      }
    };

    poll();

  }, [checkInSuccess, clearEventState, navigate]);

  function handleCreateProfileModal() { setActiveModal("createprofilemodal"); }
  function handleCloseModal() { setActiveModal(""); }
  const handleModalOverlayClick = (e) => { if (e.target === e.currentTarget) handleCloseModal(); };

  function handleForgotPasswordModal() {
    handleCloseModal();
    setActiveModal("forgotpasswordmodal");
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      if (currentEvent?._id) {
        try { 
          await checkoutFromEvent(currentEvent._id); 
        } 
        catch (err) {
          console.error(err);
        }
      }
      await logout();
      setIsLoggedIn(false);
      removeTokenExists();
      setCurrentProfile({ name: "", age: 0, gender: "", interests: [], convoStarter: "" });
      clearEventState();
      toast.success("Logged out successfully!");
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  }

  function handleDeleteAccountModal() { setActiveModal("deleteaccountmodal"); }

  async function handleCreateProfile(formdata) {
    try {
      const res = await createProfile(formdata);
      setCurrentProfile(res);
      setIsLoggedIn(true);
      storeTokenExists();
      navigate("/profile");
    } catch (err) {
      toast.error(`Failed to create profile: ${err.message || err}`);
      throw err;
    }
  }

  async function handleCreateAccountSubmit(values) {
    try {
      await createUser(values);
      setIsLoggedIn(true);
      storeTokenExists();
      setLoggingError("");
    } catch (err) {
      setLoggingError(typeof err === "string" ? err : (err.message || "Failed to create account"));
      throw err;
    }
  }

  async function handleLoginSubmit(values) {
    try {
      // If an event manager session is active in memory, clear it —
      // the user login will overwrite the shared jwt cookie server-side anyway.
      if (isEMAuthenticated) {
        logoutLocal();
      }
      await login(values);
      setIsLoggedIn(true);
      storeTokenExists();
      let res;
      try {
        res = await getProfile();
      } catch {
        res = null;
      }
      setLoggingError("");
      toast.success("Signed in successfully!");
      if (res && res.name) {
        setCurrentProfile(res);
        navigate("/profile");
      } else {
        setCurrentProfile({ name: "", age: 0, gender: "", profession: "", interests: [], convoStarter: "" });
        handleCreateProfileModal();
        navigate("/");
      }
      return true;
    } catch (err) {
      const message = typeof err === "string" ? err : err.message;
      setLoggingError(message || "Invalid email or password");
      return false;
    }
  }

  function handleGoogleSignup(credentialResponse) {
    googleAuth(credentialResponse.credential)
      .then(() => { setIsLoggedIn(true); storeTokenExists(); return getProfile().catch(() => null); })
      .then((res) => {
        if (res && res.name) { setCurrentProfile(res); navigate("/profile"); }
        else { setCurrentProfile({ name: "", age: 0, gender: "", profession: "", interests: [], convoStarter: "" }); handleCreateProfileModal(); navigate("/"); }
      })
      .catch(() => { setLoggingError("Google sign-up failed. Please try again."); });
  }

  function handleGoogleLogin(credentialResponse) {
    googleAuth(credentialResponse.credential)
      .then(() => getProfile())
      .then((res) => { setCurrentProfile(res); setIsLoggedIn(true); storeTokenExists(); setLoggingError(""); navigate("/profile"); })
      .catch(() => { setLoggingError("Google login failed"); });
  }

  function handleGoogleLoginWithToken(accessToken) {
    googleAuthWithToken(accessToken)
      .then(() => getProfile())
      .then((res) => { setCurrentProfile(res); setIsLoggedIn(true); storeTokenExists(); setLoggingError(""); navigate("/profile"); })
      .catch(() => { setLoggingError("Google login failed"); });
  }

  function handleGoogleSignupWithToken(accessToken) {
    googleAuthWithToken(accessToken)
      .then(async () => { setIsLoggedIn(true); storeTokenExists(); try {
        return await getProfile();
      } catch {
        return null;
      } })
      .then((res) => {
        if (res && res.name) { setCurrentProfile(res); navigate("/profile"); }
        else { setCurrentProfile({ name: "", age: 0, gender: "", profession: "", interests: [], convoStarter: "" }); handleCreateProfileModal(); navigate("/"); }
      })
      .catch(() => { setLoggingError("Google sign-up failed. Please try again."); });
  }

  async function handleProfileUpdateSubmit(values) {
    try {
      const res = await updateProfile(values);
      setCurrentProfile(res);
    } catch (err) {
      toast.error(`Failed to update profile: ${err.message || err}`); throw err;
    }
  }

  async function handleRefreshProfile() {
    const res = await getProfile();
    setCurrentProfile(res);
  }

const handleCheckin = async (eventData) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;

          const result = await checkinAtEvent(
            eventData._id,
            lat,
            lng
          );

          // Stripe redirect
          if (result.requiresPayment && result.checkoutUrl) {
            sessionStorage.setItem(
              "pendingCheckinEvent",
              JSON.stringify(eventData)
            );

            window.location.href = result.checkoutUrl;
            return;
          }

          console.log("CHECKIN USERS:", result.users);

          // SINGLE ATOMIC STORE UPDATE
          checkInSuccess(
            eventData,
            result.users || []
          );

          toast.success("Checked in successfully");

          resolve(result);

        } catch (err) {
          const message =
            typeof err === "string"
              ? err
              : err.message;

          toast.error(message || "Check-in failed");

          reject(err);
        }
      },
      () => {
        toast.error(
          "Location access is required to check in"
        );

        reject(new Error("Geolocation denied"));
      }
    );
  });
};

  const handleCheckout = async () => {
    if (!currentEvent?._id) return;
    setIsCheckingOut(true); 
    const eventId = currentEvent._id;

    try {
      await checkoutFromEvent(eventId);

      clearEventState();

      handleCloseModal();

      toast.success(
        "Checked out successfully"
      );
    } catch (err) {
      console.error(
        "Checkout failed:",
        err
      );

      toast.error(
        "Failed to check out"
      );
    } finally {
      setIsCheckingOut(false);  // ← ADD THIS
    }
  };

  function handleCheckoutModal() { setActiveModal("checkoutmodal"); }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      if (isCheckedIn && currentEvent?._id) {
        try { 
          await checkoutFromEvent(currentEvent._id); clearEventState(); 
        } 
        catch (err) {
          console.error(err);
        }
      }
      await Promise.all([deleteProfile(), deleteUser()]);
      handleCloseModal();
      setCurrentProfile({ name: "", age: 0, gender: "", interests: [], convoStarter: "" });
      removeTokenExists();
      setIsLoggedIn(false);
      navigate("/");
      toast.success("Account deleted successfully");
    } catch (err) {
      toast.error(`Failed to delete account: ${err.message || "Please try again later"}`);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  function handleForgotPasswordSubmit(email) { return requestPasswordReset(email).catch(err => { throw err; }); }
  function handleResetPassword(token, newPassword) { return resetPassword(token, newPassword).catch(err => { throw err; }); }
  function handleEmailVerification(token) { return verifyEmail(token).catch(err => { throw err; }); }
  function handleResendVerification(email) {
    return sendEmailVerification(email)
      .then(() => { setLoggingError("Verification email sent! Please check your inbox (including spam folder)."); })
      .catch(err => { setLoggingError(err.message || "Failed to send verification email. Please try again."); });
  }

  if (isLoggedInLoading) return <Loading fullScreen message="Loading please wait..." />;
  if (isLoggingOut) {
  return (
    <Loading
      fullScreen
      message="Logging out..."
    />
  );
}

  // Pages that hide the shared header/footer
  const isEMPage = location.pathname.startsWith('/event-manager');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  // Edit profile now shows shared Header + Footer (per HTML design)
  const hideSharedChrome = isEMPage || isAdminPage || isAuthPage;

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <SocketProvider
        isLoggedIn={isLoggedIn}
      >
        <AppContext.Provider value={{ currentProfile, isLoggedIn }}>
          <div className="app-content">
            {!hideSharedChrome && (
              <Header
                isLoggedIn={isLoggedIn}
                handleLoginModal={() => navigate("/signin")}
                handleLogout={handleLogout}
                isLoggingOut={isLoggingOut}
                handleDeleteAccountModal={handleDeleteAccountModal}
              />
            )}
            <Routes>
              <Route path="/" element={<Main onClick={() => navigate("/signup")} />} />
              <Route path="/welcome/:campaign" element={<WelcomeLanding onClick={() => navigate("/signup")} />} />
              <Route path="/signin" element={
                <AuthRedirectRoute
                  isLoggedIn={isLoggedIn}
                  redirectTo="/profile"
                >
                  <SignInPage
                      handleLoginSubmit={handleLoginSubmit}
                      handleGoogleLogin={handleGoogleLogin}
                      handleGoogleLoginWithToken={handleGoogleLoginWithToken}
                      loggingError={loggingError}
                      handleForgotPasswordModal={handleForgotPasswordModal}
                      handleResendVerification={handleResendVerification}
                    />
                </AuthRedirectRoute>
              } />
              <Route path="/signup" element={
                <AuthRedirectRoute
                  isLoggedIn={isLoggedIn}
                  redirectTo="/profile"
                >
                  <SignUpPage
                    handleCreateAccountSubmit={handleCreateAccountSubmit}
                    handleGoogleSignup={handleGoogleSignup}
                    handleGoogleSignupWithToken={handleGoogleSignupWithToken}
                    loggingError={loggingError}
                    onSwitchToCreateProfile={handleCreateProfileModal}
                  />
                </AuthRedirectRoute>
              } />
              <Route path="/reset-password" element={<ResetPasswordPage handleResetPassword={handleResetPassword} />} />
              <Route path="/verify-email" element={<VerifyEmailPage handleEmailVerification={handleEmailVerification} />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />

               {/* Protected */}
              <Route element={<RequireEventManagerAuth />}>
                <Route path="/event-manager/dashboard" element={<EventManagerDashboard />} />
                <Route path="/event-manager/onboarding" element={<EventManagerOnboarding />} />
                <Route path="/event-manager/create-event" element={<EventManagerCreateEvent />} />
                <Route path="/event-manager/my-events" element={<EventManagerMyEvents />} />
              </Route>
              <Route path="/event-feedback" element={<EventFeedbackPage />} />
              <Route path="/event-manager" 
                element={
                  <AuthRedirectRoute
                    isLoggedIn={isEMAuthenticated}
                    redirectTo="/event-manager/dashboard"
                  >
                    <EventManagerSignup />
                  </AuthRedirectRoute>
                  } 
                />
              <Route path="/event-manager/login"
                element={
                  <AuthRedirectRoute
                    isLoggedIn={isEMAuthenticated}
                    redirectTo="/event-manager/dashboard"
                  >
                    <EventManagerLogin />
                  </AuthRedirectRoute>
                } 
              />
              
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/profile" element={
                <ProtectedRoute isLoggedInLoading={isLoggedInLoading} isLoggedIn={isLoggedIn}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/edit-profile" element={
                <ProtectedRoute isLoggedInLoading={isLoggedInLoading} isLoggedIn={isLoggedIn}>
                  <EditProfilePage
                    onSubmit={handleProfileUpdateSubmit}
                    onPictureUpload={handleRefreshProfile}
                  />
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute isLoggedInLoading={isLoggedInLoading} isLoggedIn={isLoggedIn}>
                  <EventsPage
                    handleCheckin={handleCheckin}
                    handleCheckoutModal={handleCheckoutModal}
                    otherProfiles={otherProfiles}
                    setOtherProfiles={setOtherProfiles}
                  />
                </ProtectedRoute>
              } />
              <Route path="/my-events" element={
                <ProtectedRoute isLoggedInLoading={isLoggedInLoading} isLoggedIn={isLoggedIn}>
                  <MyEvents handleCheckin={handleCheckin} />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Create Profile Modal (still a modal — no separate design provided) */}
            <ProfileModal
              mode="create"
              isOpen={activeModal === "createprofilemodal"}
              onClose={handleCloseModal}
              onOverlayClick={handleModalOverlayClick}
              onSubmit={handleCreateProfile}
              onPictureUpload={handleRefreshProfile}
            />

            <ForgotPasswordModal
              isOpen={activeModal === "forgotpasswordmodal"}
              onClose={handleCloseModal}
              onOverlayClick={handleModalOverlayClick}
              handleForgotPasswordSubmit={handleForgotPasswordSubmit}
            />
            <CheckoutModal
              handleCheckout={handleCheckout}
              isCheckingOut={isCheckingOut}
              isOpen={activeModal === "checkoutmodal"}
              onClose={handleCloseModal}
              onOverlayClick={handleModalOverlayClick}
            />
            <DeleteAccountModal
              handleDeleteAccount={handleDeleteAccount}
              isOpen={activeModal === "deleteaccountmodal"}
              onClose={handleCloseModal}
              onOverlayClick={handleModalOverlayClick}
              isDeletingAccount={isDeletingAccount}
            />
            {!hideSharedChrome && <Footer />}
          </div>
        </AppContext.Provider>
      </SocketProvider>
    </div>
  );
}

export default App;