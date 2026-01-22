import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from '../utils/socket';
import "../blocks/otherusers.css";

export default function OtherUsers({
  otherProfiles,
  setOtherProfiles,
  handleCheckoutModal,
  currentEvent,
  setCurrentEvent,
  setIsCheckedIn
}) {
  const navigate = useNavigate();

  const baseUrl = import.meta.env.PROD
    ? "https://api.baequests.com"
    : "http://localhost:3001";

  const getImageUrl = (pictureUrl) => {
    if (!pictureUrl) return null;
    if (pictureUrl.startsWith('http://') || pictureUrl.startsWith('https://')) {
      return pictureUrl;
    }
    return `${baseUrl}${pictureUrl}`;
  }; 

  useEffect(() => {
    if (!currentEvent?._id) {
      navigate("/meet");
      return;
    }

    socket.emit("join-event", { eventId: currentEvent._id });

    // Listen for users checking OUT
    socket.on("user-checked-out", ({ userId, eventId }) => {
      if (eventId === currentEvent._id) {
        setOtherProfiles((prev) => prev.filter((user) => user._id !== userId));
      }
    });

    // Listen for users checking IN
    socket.on("user-checked-in", ({ user, eventId }) => {
      if (eventId === currentEvent._id) {
        setOtherProfiles((prev) => {
          // Check if user is already in the list (avoid duplicates)
          if (prev.some(p => p._id === user._id)) {
            return prev;
          }
          return [...prev, user];
        });
      }
    });

    // Listen for event expiration / force checkout
    socket.on("force-checkout", ({ message, eventId }) => {
      if (eventId === currentEvent._id) {
        alert(message);
        setCurrentEvent(null);
        setOtherProfiles([]);
        setIsCheckedIn(false);
        navigate("/meet");
      }
    });

    // Cleanup
    return () => {
      socket.off("user-checked-in");
      socket.off("user-checked-out");
      socket.off("force-checkout");
      socket.emit("leave-event", { eventId: currentEvent._id });
    };
  }, [currentEvent, navigate, setOtherProfiles, setCurrentEvent, setIsCheckedIn]);

  return (
    <div className="others">
      <h1 className="others__title">People Checked In at the event</h1>

      {otherProfiles.length === 0 ? (
        <p className="others__empty">No one else has checked in yet</p>
      ) : (
        <div className="others__grid">
          {otherProfiles.map((user) => (
            <div className="others__card" key={user._id}>
              <div className="others__header">
                <div className="others__avatar">
                  {user.profilePicture ? (
                    <img
                      key={user.profilePicture}
                      src={getImageUrl(user.profilePicture)}
                      alt={`${user.name}'s profile`}
                      className="others__avatar-image"
                    />
                  ) : (
                    <div className="others__avatar-placeholder">
                      {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
                </div>
              </div>

              <div className="others__content">
                <h2 className="others__name">
                  {user.name}, {user.age}
                </h2>
                {user.profession && (
                  <p className="others__profession">{user.profession}</p>
                )}
                <p className="others__bio">{user.bio}</p>

                <div className="others__interests">
                  {user.interests.map((interest, i) => (
                    <span className="others__interest" key={i}>
                      {interest}
                    </span>
                  ))}
                </div>

                <p className="others__starter">💬 {user.convoStarter}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleCheckoutModal} type="button" className="others__checkout">
        Check Out
      </button>
    </div>
  );
}