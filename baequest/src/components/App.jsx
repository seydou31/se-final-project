import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
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
import Meet from "./Meet.jsx";
import MyEvents from "./MyEvents.jsx";
import Loading from "./Loading.jsx";
import CreateAccountModal from "./CreateAccountModal.jsx";
import ProfileModal from "./ProfileModal.jsx";
import LoginModal from "./LoginModal.jsx";
import OtherUsers from "./OtherUsers.jsx";
import CheckoutModal from "./CheckoutModal.jsx";
import NavigationModal from "./NavigationModal.jsx";
import DeleteAccountModal from "./DeleteAccountModal.jsx";
import ForgotPasswordModal from "./ForgotPasswordModal.jsx";
import ResetPasswordPage from "./ResetPasswordPage.jsx";
import VerifyEmailPage from "./VerifyEmailPage.jsx";
import EventFeedbackPage from "./EventFeedbackPage.jsx";
import socket from "../utils/socket.js";
import {
  createProfile,
  createUser,
  getEvents,
  getProfile,
  login,
  logout,
  updateProfile,
  checkin,
  getUsersAtEvent,
  checkout,
  deleteUser,
  deleteProfile,
  googleAuth,
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
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(() => {
    try {
      const saved = localStorage.getItem("currentEvent");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
    }
    return null;
  });
  const [otherProfiles, setOtherProfiles] = useState([]);
  const [isLoggedInLoading, setIsLoggedInLoading] = useState(
    checkTokenExists()
  );
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [navigationEvent, setNavigationEvent] = useState(null);
  const [loggingError, setLoggingError] = useState("");
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
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

        // After getting profile, check if we have a saved event
        const savedEvent = localStorage.getItem("currentEvent");
        if (savedEvent) {
          const event = JSON.parse(savedEvent);
          setCurrentEvent(event);
          setIsCheckedIn(true);

          return getUsersAtEvent(event._id)
            .then((users) => {
              setOtherProfiles(users);
            })
            .catch((err) => {
              console.error("Failed to load users at event:", err);
              // Clear the event if we can't load users
              setCurrentEvent(null);
              setIsCheckedIn(false);
            });
        }
      })
      .then(() => {
        // Navigate after everything is loaded
        const savedEvent = localStorage.getItem("currentEvent");
        if (savedEvent) {
          // If user is checked in, redirect to Meet page
          navigate("/meet");
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

  useEffect(() => {
    socket.on("event-expired", ({ eventId }) => {
      // Remove expired event from list immediately
      setEvents((prev) => prev.filter((evt) => evt._id !== eventId));

      // If user is checked into this event, show notification
      if (currentEvent?._id === eventId) {
        toast.error("This event has ended");
        setCurrentEvent(null);
        setOtherProfiles([]);
        setIsCheckedIn(false);
      }
    });

    return () => {
      socket.off("event-expired");
    };
  }, [currentEvent]);

  // Listen for when current user marks an event as going
  useEffect(() => {
    socket.on("event-going-updated", ({ eventId, count, userId }) => {
      // Only update isUserGoing if this is the current user
      // Compare as strings since MongoDB IDs can be objects
      const currentUserId = currentProfile.owner?.toString() || currentProfile.owner;
      if (currentUserId === userId) {
        setEvents((prev) =>
          prev.map((evt) =>
            evt._id === eventId
              ? { ...evt, isUserGoing: true, goingCount: count }
              : evt
          )
        );
      } else {
        // Just update the count for other users
        setEvents((prev) =>
          prev.map((evt) =>
            evt._id === eventId ? { ...evt, goingCount: count } : evt
          )
        );
      }
    });

    return () => {
      socket.off("event-going-updated");
    };
  }, [currentProfile.owner]);

  function handleLogout() {
    // Check if user is checked into an event
    const checkoutPromise = currentEvent?._id
      ? checkout({ eventId: currentEvent._id })
      : Promise.resolve(); // No event to checkout from

    checkoutPromise
      .finally(() => {
        // Continue with normal logout flow
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
        setCurrentEvent(null); //
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
    createProfile(formdata)
      .then((res) => {
        setCurrentProfile(res);
        setIsLoggedIn(true);
        storeTokenExists();
        handleCloseModal();
        navigate("/profile");
      })
      .catch((err) => {
        toast.error(`Failed to create profile: ${err.message || err}`);
      });
  }

  function handleCreateAccountSubmit(values) {
    return createUser(values)
      .then(() => {
        handleCloseModal();
        setLoggingError("Account created! Please check your email to verify your account before logging in.");
        handleLoginModal(true); // Keep the success message
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
      .catch((err) => {
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
      .catch((err) => {
        setLoggingError("Google login failed");
      });
  }

  function handleProfileUpdateSubmit(values) {
    updateProfile(values)
      .then((res) => {
        setCurrentProfile(res);
        handleCloseModal();
      })
  }

  function handleRefreshProfile() {
    return getProfile()
      .then((res) => {
        setCurrentProfile(res);
      })
  }

  function handleFindEvents(state = "", city = "") {
    setIsLoadingEvents(true);
    getEvents(state, city)
      .then((res) => {
        setEvents(res);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        toast.error(`Failed to load events: ${err.message || "Please try again"}`);
      })
      .finally(() => {
        setIsLoadingEvents(false);
      });
  }

  const handleCheckin = async (event) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    // Geolocation options - allow 30s cached position for faster checkin
    const geoOptions = {
      //enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const payload = {
            eventId: event._id,
            lat,
            lng,
          };

          try {
            await checkin(payload);
            const users = await getUsersAtEvent(event._id);

            setCurrentEvent(event);
            setOtherProfiles(users);
            setIsCheckedIn(true);
            navigate("/meet");
            resolve();
          } catch (err) {
            const message = typeof err === "string" ? err : err.message;
            if (message === "User is too far away from the event, and must get directions.") {
              setNavigationEvent(event);
              setActiveModal("navigationmodal");
            }
            reject(err);
          }
        },
        (error) => {
          // Handle location errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error("Location permission denied.");
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              toast.error("Location request timed out.");
              break;
            default:
              toast.error("An unknown geolocation error occurred.");
              break;
          }
          reject(error);
        },
        geoOptions
      );
    });
  };

  const handleCheckout = async () => {
    try {
      await checkout({ eventId: currentEvent._id });
      setCurrentEvent(null);
      setOtherProfiles([]);
      handleCloseModal();
      setIsCheckedIn(false);
    } catch (err) {
    }
  };

  function handleCheckoutModal() {
    setActiveModal("checkoutmodal");
  }

  function handleNavigate() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const targetEvent = navigationEvent || currentEvent;
        if (!targetEvent || !targetEvent.location) {
          toast.error("Event location not available.");
          return;
        }

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${targetEvent.location.lat},${targetEvent.location.lng}`;

        window.open(mapsUrl, "_blank");
      },
      (err) => {
        toast.error("Could not get your location. Please try again.");
      }
    );
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      if (isCheckedIn) {
        try {
          await checkout({ eventId: currentEvent._id });
          setCurrentEvent(null);
          setOtherProfiles([]);
          setIsCheckedIn(false);
        } catch (err) {
          console.error("Failed to checkout before deleting account:", err);
          // Continue with deletion even if checkout fails
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
            <Route
              path="/reset-password"
              element={<ResetPasswordPage handleResetPassword={handleResetPassword} />}
            />
            <Route
              path="/verify-email"
              element={<VerifyEmailPage handleEmailVerification={handleEmailVerification} />}
            />
            <Route
              path="/event-feedback"
              element={<EventFeedbackPage />}
            />
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
              path="/meet"
              element={
                <ProtectedRoute
                  isLoggedInLoading={isLoggedInLoading}
                  isLoggedIn={isLoggedIn}
                >
                  <Meet
                    events={events}
                    handleFindEvents={handleFindEvents}
                    handleCheckin={handleCheckin}
                    handleCheckoutModal={handleCheckoutModal}
                    otherProfiles={otherProfiles}
                    setOtherProfiles={setOtherProfiles}
                    currentEvent={currentEvent}
                    isCheckedIn={isCheckedIn}
                    setCurrentEvent={setCurrentEvent}
                    setIsCheckedIn={setIsCheckedIn}
                    isLoadingEvents={isLoadingEvents}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute
                  isLoggedInLoading={isLoggedInLoading}
                  isLoggedIn={isLoggedIn}
                >
                  <MyEvents events={events} handleCheckin={handleCheckin} />
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
          <NavigationModal
            handleNavigate={handleNavigate}
            isOpen={activeModal === "navigationmodal"}
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
