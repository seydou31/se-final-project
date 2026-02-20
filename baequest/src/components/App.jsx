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
import CreateAccountModal from "./CreateAccountModal.jsx";
import ProfileModal from "./ProfileModal.jsx";
import LoginModal from "./LoginModal.jsx";
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
import AddEvent from "../pages/AddEvent.jsx";
import EventFeedbackPage from "./EventFeedbackPage.jsx";
import {
  createProfile,
  createUser,
  getProfile,
  login,
  logout,
  updateProfile,
  checkinAtEvent,
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
} from "../utils/api.js";
import AppContext from "../context/AppContext.js";
import { trackPageView } from "../utils/analytics.js";

function App() {
  // track which modal is open; empty string means no modal
  const [activeModal, setActiveModal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    name: "",
    age: 0,
    gender: "",
    profession: "",
    interests: [],
    convoStarter: "",
  });
  const [currentEvent, setCurrentEvent] = useState(() => {
    try {
      const saved = localStorage.getItem("currentEvent");
      if (saved) return JSON.parse(saved);
    } catch {
      // Invalid JSON in localStorage, ignore
    }
    return null;
  });
  const [otherProfiles, setOtherProfiles] = useState([]);
  const [isLoggedInLoading, setIsLoggedInLoading] = useState(
    checkTokenExists()
  );
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loggingError, setLoggingError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Handle escape key for all modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && activeModal) {
        // Prevent closing the profile creation modal
        if (activeModal === "createprofilemodal") {
          return;
        }
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [activeModal]);

  // open the create-account modal

  const navigate = useNavigate();

  function storeTokenExists() {
    localStorage.setItem("tokenExists", "true");
  }

  function checkTokenExists() {
    return Boolean(localStorage.getItem("tokenExists"));
  }

  function removeTokenExists() {
    localStorage.removeItem("tokenExists");
  }

  useEffect(() => {
    getProfile()
      .then((res) => {
        setCurrentProfile(res);
        setIsLoggedIn(true);
        storeTokenExists();

        // After getting profile, check if we have a saved event check-in
        const savedEvent = localStorage.getItem("currentEvent");
        if (savedEvent) {
          const event = JSON.parse(savedEvent);
          setCurrentEvent(event);
          setIsCheckedIn(true);

          return getUsersAtEvent(event._id)
            .then((users) => {
              setOtherProfiles(users);
            })
            .catch(() => {
              setCurrentEvent(null);
              setIsCheckedIn(false);
            });
        }
      })
      .then(() => {
        const savedEvent = localStorage.getItem("currentEvent");
        if (savedEvent) {
          navigate("/events");
        } else if (location.pathname === "/") {
          navigate("/profile");
        }
      })
      .catch(() => {
        // User is not authenticated – stay on landing page
      })
      .finally(() => {
        setIsLoggedInLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentEvent) {
      localStorage.setItem("currentEvent", JSON.stringify(currentEvent));
    } else {
      localStorage.removeItem("currentEvent");
    }
  }, [currentEvent]);

  function handleSignupModal() {
    setLoggingError("");
    setActiveModal("createaccountmodal");
  }

  function handleCreateProfileModal() {
    setActiveModal("createprofilemodal");
  }

  function handleLoginModal(keepError = false) {
    if (!keepError) {
      setLoggingError("");
    }
    setActiveModal("loginmodal");
  }

  function handleEditModal() {
    setActiveModal("editprofilemodal");
  }

  function handleDeleteAccountModal() {
    setActiveModal("deleteaccountmodal");
  }

  function handleForgotPasswordModal() {
    handleCloseModal();
    setActiveModal("forgotpasswordmodal");
  }


  function handleLogout() {
    // Check if user is checked into a place
    const checkoutPromise = currentEvent?._id
      ? checkoutFromEvent(currentEvent._id)
      : Promise.resolve();

    checkoutPromise
      .finally(() => {
        return logout();
      })
      .then(() => {
        setIsLoggedIn(false);
        removeTokenExists();
        setCurrentProfile({
          name: "",
          age: 0,
          gender: "",
          interests: [],
          convoStarter: "",
        });
        setCurrentEvent(null);
        setOtherProfiles([]);
        setIsCheckedIn(false);
        navigate("/");
      })
  }

  // close any open modal
  function handleCloseModal() {
    setActiveModal("");
  }

  // Handle overlay click for all modals
  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  function handleCreateProfile(formdata) {
    return createProfile(formdata)
      .then((res) => {
        setCurrentProfile(res);
        setIsLoggedIn(true);
        storeTokenExists();
        navigate("/profile");
      })
      .catch((err) => {
        toast.error(`Failed to create profile: ${err.message || err}`);
        throw err;
      });
  }

  function handleCreateAccountSubmit(values) {
    return createUser(values)
      .then(() => {
        // Signup now auto-logs in (sets JWT cookie)
        setIsLoggedIn(true);
        storeTokenExists();
        setLoggingError("");
        // Direct swap to profile modal (no close animation needed)
        setActiveModal("createprofilemodal");
      })
      .catch((err) => {
        setLoggingError(err.message || "Failed to create account");
        throw err;
      });
  }

  function handleLoginSubmit(values) {
    return login(values)
      .then(() => {
        setIsLoggedIn(true);
        storeTokenExists();

        // Try to get profile, but don't fail if it doesn't exist
        return getProfile().catch(() => {
          return null; // Return null if profile doesn't exist
        });
      })
      .then((res) => {
        handleCloseModal();
        setLoggingError("");

        // If profile exists (has name), go to profile page. Otherwise, show create profile modal
        if (res && res.name) {
          setCurrentProfile(res);
          navigate("/profile");
        } else {
          setCurrentProfile({
            name: "",
            age: 0,
            gender: "",
            profession: "",
            interests: [],
            convoStarter: "",
          });
          handleCreateProfileModal();
        }
        return true;
      })
      .catch((err) => {
         const message = typeof err === "string" ? err : err.message;
         setLoggingError(message || "Invalid email or password");
         return false;
      });
  }

  function handleGoogleSignup(credentialResponse) {
    googleAuth(credentialResponse.credential)
      .then(() => {
        setIsLoggedIn(true);
        storeTokenExists();

        // Try to get profile, but don't fail if it doesn't exist
        return getProfile().catch(() => {
          return null; // Return null if profile doesn't exist
        });
      })
      .then((res) => {
        handleCloseModal();

        // If profile exists (has name), go to profile page. Otherwise, show create profile modal
        if (res && res.name) {
          setCurrentProfile(res);
          navigate("/profile");
        } else {
          setCurrentProfile({
            name: "",
            age: 0,
            gender: "",
            profession: "",
            interests: [],
            convoStarter: "",
          });
          handleCreateProfileModal();
        }
      })
      .catch(() => {
        setLoggingError("Google sign-up failed. Please try again.");
      });
  }

  function handleGoogleLogin(credentialResponse) {
    googleAuth(credentialResponse.credential)
      .then(() => {
        return getProfile();
      })
      .then((res) => {
        setCurrentProfile(res);
        setIsLoggedIn(true);
        storeTokenExists();
        setLoggingError("");
        handleCloseModal();
        navigate("/profile");
      })
      .catch(() => {
        setLoggingError("Google login failed");
      });
  }

  // Mobile Google auth handlers (using access token from implicit flow)
  function handleGoogleLoginWithToken(accessToken) {
    googleAuthWithToken(accessToken)
      .then(() => {
        return getProfile();
      })
      .then((res) => {
        setCurrentProfile(res);
        setIsLoggedIn(true);
        storeTokenExists();
        setLoggingError("");
        handleCloseModal();
        navigate("/profile");
      })
      .catch(() => {
        setLoggingError("Google login failed");
      });
  }

  function handleGoogleSignupWithToken(accessToken) {
    googleAuthWithToken(accessToken)
      .then(() => {
        setIsLoggedIn(true);
        storeTokenExists();

        // Try to get profile, but don't fail if it doesn't exist
        return getProfile().catch(() => {
          return null;
        });
      })
      .then((res) => {
        handleCloseModal();

        // If profile exists (has name), go to profile page. Otherwise, show create profile modal
        if (res && res.name) {
          setCurrentProfile(res);
          navigate("/profile");
        } else {
          setCurrentProfile({
            name: "",
            age: 0,
            gender: "",
            profession: "",
            interests: [],
            convoStarter: "",
          });
          handleCreateProfileModal();
        }
      })
      .catch(() => {
        setLoggingError("Google sign-up failed. Please try again.");
      });
  }

  function handleProfileUpdateSubmit(values) {
    return updateProfile(values)
      .then((res) => {
        setCurrentProfile(res);
      })
      .catch((err) => {
        toast.error(`Failed to update profile: ${err.message || err}`);
        throw err;
      });
  }

  function handleRefreshProfile() {
    return getProfile()
      .then((res) => {
        setCurrentProfile(res);
      })
  }

  const handleCheckin = async (eventData) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude: lat, longitude: lng } = pos.coords;
            const result = await checkinAtEvent(eventData._id, lat, lng);
            setCurrentEvent(eventData);
            setOtherProfiles(result.users || []);
            setIsCheckedIn(true);
            resolve(result);
          } catch (err) {
            const message = typeof err === "string" ? err : err.message;
            toast.error(message || "Check-in failed");
            reject(err);
          }
        },
        () => {
          toast.error("Location access is required to check in");
          reject(new Error("Geolocation denied"));
        }
      );
    });
  };

  const handleCheckout = async () => {
    try {
      await checkoutFromEvent(currentEvent._id);
      setCurrentEvent(null);
      setOtherProfiles([]);
      handleCloseModal();
      setIsCheckedIn(false);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  function handleCheckoutModal() {
    setActiveModal("checkoutmodal");
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      if (isCheckedIn && currentEvent?._id) {
        try {
          await checkoutFromEvent(currentEvent._id);
          setCurrentEvent(null);
          setOtherProfiles([]);
          setIsCheckedIn(false);
        } catch (err) {
          console.error("Failed to checkout before deleting account:", err);
        }
      }

      await Promise.all([deleteProfile(), deleteUser()]);
      handleCloseModal();
      setCurrentProfile({
        name: "",
        age: 0,
        gender: "",
        interests: [],
        convoStarter: "",
      });
      removeTokenExists();
      setIsLoggedIn(false);
      navigate("/");
      toast.success("Account deleted successfully");
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error(`Failed to delete account: ${err.message || "Please try again later"}`);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  function handleForgotPasswordSubmit(email) {
    return requestPasswordReset(email)
      .catch((err) => {
        throw err;
      });
  }

  function handleResetPassword(token, newPassword) {
    return resetPassword(token, newPassword)
      .catch((err) => {
        throw err;
      });
  }

  function handleEmailVerification(token) {
    return verifyEmail(token)
      .catch((err) => {
        throw err;
      });
  }

  function handleResendVerification(email) {
    return sendEmailVerification(email)
      .then(() => {
        setLoggingError("Verification email sent! Please check your inbox (including spam folder).");
      })
      .catch((err) => {
        setLoggingError(err.message || "Failed to send verification email. Please try again.");
      });
  }

  if (isLoggedInLoading) {
    return <Loading fullScreen message="Loading your profile..." />;
  }

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppContext.Provider value={{ currentProfile }}>
        <div className="app-content">
          <Header
            isLoggedIn={isLoggedIn}
            handleLoginModal={handleLoginModal}
            handleLogout={handleLogout}
            handleDeleteAccountModal={handleDeleteAccountModal}
          />
          <Routes>
            <Route path="/" element={<Main onClick={handleSignupModal} />} />
            <Route path="/welcome/:campaign" element={<WelcomeLanding onClick={handleSignupModal} />} />
            <Route
              path="/reset-password"
              element={<ResetPasswordPage handleResetPassword={handleResetPassword} />}
            />
            <Route
              path="/verify-email"
              element={<VerifyEmailPage handleEmailVerification={handleEmailVerification} />}
            />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/event-feedback" element={<EventFeedbackPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  isLoggedInLoading={isLoggedInLoading}
                  isLoggedIn={isLoggedIn}
                >
                  <Profile handleEditModal={handleEditModal} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute isLoggedInLoading={isLoggedInLoading} isLoggedIn={isLoggedIn}>
                  <EventsPage
                    handleCheckin={handleCheckin}
                    handleCheckoutModal={handleCheckoutModal}
                    currentEvent={currentEvent}
                    otherProfiles={otherProfiles}
                    setOtherProfiles={setOtherProfiles}
                    isCheckedIn={isCheckedIn}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute isLoggedInLoading={isLoggedInLoading} isLoggedIn={isLoggedIn}>
                  <MyEvents handleCheckin={handleCheckin} />
                </ProtectedRoute>
              }
            />
          </Routes>

          <CreateAccountModal
            isOpen={activeModal === "createaccountmodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            handleCreateAccountSubmit={handleCreateAccountSubmit}
            handleGoogleSignup={handleGoogleSignup}
            handleGoogleSignupWithToken={handleGoogleSignupWithToken}
            loggingError={loggingError}
          />
          <ProfileModal
            mode="create"
            isOpen={activeModal === "createprofilemodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            onSubmit={handleCreateProfile}
            onPictureUpload={handleRefreshProfile}
          />
          <ProfileModal
            mode="edit"
            isOpen={activeModal === "editprofilemodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            onSubmit={handleProfileUpdateSubmit}
            onPictureUpload={handleRefreshProfile}
          />
          <LoginModal
            handleLoginSubmit={handleLoginSubmit}
            handleGoogleLogin={handleGoogleLogin}
            handleGoogleLoginWithToken={handleGoogleLoginWithToken}
            isOpen={activeModal === "loginmodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            loggingError={loggingError}
            handleForgotPasswordModal={handleForgotPasswordModal}
            handleResendVerification={handleResendVerification}
          />
          <ForgotPasswordModal
            isOpen={activeModal === "forgotpasswordmodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            handleForgotPasswordSubmit={handleForgotPasswordSubmit}
          />
          <CheckoutModal
            handleCheckout={handleCheckout}
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
          <Footer />
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
