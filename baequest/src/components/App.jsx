import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import "../blocks/app.css";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Main from "./Main.jsx";
import Profile from "./Profile.jsx";
import Meet from "./Meet.jsx";
import CreateAccountModal from "./CreateAccountModal.jsx";
import ProfileModal from "./ProfileModal.jsx";
import LoginModal from "./LoginModal.jsx";
import OtherUsers from "./OtherUsers.jsx";
import CheckoutModal from "./CheckoutModal.jsx";
import NavigationModal from "./NavigationModal.jsx";
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
} from "../utils/api.js";
import AppContext from "../context/AppContext.js";

function App() {
  // track which modal is open; empty string means no modal
  const [activeModal, setActiveModal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    name: "",
    age: 0,
    gender: "",
    interests: [],
    convoStarter: "",
  });
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(() => {
    try {
      const saved = localStorage.getItem("currentEvent");
      if (saved) {
        console.log("📦 Restored currentEvent from localStorage");
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error("Failed to restore currentEvent:", err);
    }
    return null;
  });
  const [otherProfiles, setOtherProfiles] = useState([]);
  const [isLoggedInLoading, setIsLoggedInLoading] = useState(
    checkTokenExists()
  );
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const location = useLocation();

  // Handle escape key for all modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && activeModal) {
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

        // ✅ After getting profile, check if we have a saved event
        const savedEvent = localStorage.getItem("currentEvent");
        if (savedEvent) {
          const event = JSON.parse(savedEvent);
          console.log("🔵 Restored event, fetching users...");

          return getUsersAtEvent(event._id)
            .then((users) => {
              console.log("✅ Fetched users:", users);
              setOtherProfiles(users);
            })
            .catch((err) => {
              console.error("Failed to fetch users for saved event:", err);
            });
        }
      })
      .then(() => {
        // Navigate after everything is loaded
        if (location.pathname === "/") {
          navigate("/profile");
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoggedInLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentEvent) {
      localStorage.setItem("currentEvent", JSON.stringify(currentEvent));
      console.log("💾 Saved currentEvent to localStorage:", currentEvent._id);
    } else {
      localStorage.removeItem("currentEvent");
      console.log("🗑️ Removed currentEvent from localStorage");
    }
  }, [currentEvent]);

  function handleSignupModal() {
    setActiveModal("createaccountmodal");
  }

  function handleCreateProfileModal() {
    setActiveModal("createprofilemodal");
  }

  function handleLoginModal() {
    setActiveModal("loginmodal");
  }

  function handleEditModal() {
    setActiveModal("editprofilemodal");
  }

  // Add this useEffect in App.jsx
  useEffect(() => {
    // Listen for expired events
    socket.on("event-expired", ({ eventId }) => {
      console.log("⏰ Event expired:", eventId);

      // Remove expired event from list immediately
      setEvents((prev) => prev.filter((evt) => evt._id !== eventId));

      // If user is checked into this event, show alert
      if (currentEvent?._id === eventId) {
        alert("This event has ended");
        setCurrentEvent(null);
        setOtherProfiles([]);
        setIsCheckedIn(false);
      }
    });

    return () => {
      socket.off("event-expired");
    };
  }, [currentEvent]);

  function handleLogout() {
    // ✅ Check if user is checked into an event
    const checkoutPromise = currentEvent?._id
      ? checkout({ eventId: currentEvent._id })
          .then(() => console.log("✅ Auto-checkout successful"))
          .catch((err) => console.error("⚠️ Auto-checkout failed:", err))
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
      .catch(console.error);
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
        console.error("Failed to create profile:", err);
      });
  }

  function handleCreateAccountSubmit(values) {
    return createUser(values)
      .then(() => {
        return login(values);
      })
      .then(() => {
        handleCloseModal();
        handleCreateProfileModal();
      })
      .catch(console.error);
  }

  function handleLoginSubmit(values) {
    return login(values)
      .then(() => {
        return getProfile();
      })
      .then((res) => {
        setCurrentProfile(res);
        setIsLoggedIn(true);
        storeTokenExists();

        handleCloseModal();
        navigate("/profile");
      })
      .catch(console.err);
  }

  function handleProfileUpdateSubmit(values) {
    updateProfile(values)
      .then((res) => {
        setCurrentProfile(res);
        handleCloseModal();
      })
      .catch(console.error);
  }

  function handleFindEvents() {
    getEvents()
      .then((res) => {
        setEvents(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleCheckin = async (event) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Geolocation options
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

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
          const data = await checkin(payload);

          if (
            data.message ===
            "User is too far away from the event, and must get directions."
          ) {
            setCurrentEvent(data.newEvent);
            throw new Error("You are too far from the event to check in");
          }

          const users = await getUsersAtEvent(event._id);
          setCurrentEvent(event);
          setOtherProfiles(users);
          setIsCheckedIn(true);
        } catch (err) {
          if (err.message === "You are too far from the event to check in") {
            setActiveModal("navigationmodal");
          }
          console.error("Check-in failed:", err);
        }
      },
      (error) => {
        // Handle location errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
          default:
            alert("An unknown geolocation error occurred.");
            break;
        }
      },
      geoOptions
    );
  };

  const handleCheckout = async () => {
    try {
      await checkout({ eventId: currentEvent._id });
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

  function handleNavigate() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (!currentEvent || !currentEvent.location) {
          alert("Event location not available.");
          return;
        }

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${currentEvent.location.lat},${currentEvent.location.lng}`;

        window.open(mapsUrl, "_blank");
      },
      (err) => {
        console.error("Failed to get location:", err);
        alert("Could not get your location. Please try again.");
      }
    );
  }

  return (
    <div className="app">
      <AppContext.Provider value={{ currentProfile }}>
        <div className="app-content">
          <Header
            isLoggedIn={isLoggedIn}
            handleLoginModal={handleLoginModal}
            handleLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<Main onClick={handleSignupModal} />} />
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
                  />
                </ProtectedRoute>
              }
            />
          </Routes>

          <CreateAccountModal
            isOpen={activeModal === "createaccountmodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            handleCreateAccountSubmit={handleCreateAccountSubmit}
          />
          <ProfileModal
            mode="create"
            isOpen={activeModal === "createprofilemodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            onSubmit={handleCreateProfile}
          />
          <ProfileModal
            mode="edit"
            isOpen={activeModal === "editprofilemodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
            onSubmit={handleProfileUpdateSubmit}
          />
          <LoginModal
            handleLoginSubmit={handleLoginSubmit}
            isOpen={activeModal === "loginmodal"}
            onClose={handleCloseModal}
            onOverlayClick={handleModalOverlayClick}
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
          <Footer />
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
