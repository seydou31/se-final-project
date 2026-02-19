import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from '../utils/socket';
import "../blocks/otherusers.css";

export default function OtherUsers({
  otherProfiles,
  setOtherProfiles,
  handleCheckoutModal,
  currentEvent,
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
      navigate("/events");
      return;
    }

    const eventId = currentEvent._id;
    socket.emit("join-event", { eventId });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("user-checked-out", ({ userId, eventId: outEventId }) => {
      if (outEventId === eventId) {
        setOtherProfiles((prev) => prev.filter((u) => u._id !== userId && u.owner !== userId));
      }
    });

    socket.on("user-checked-in", ({ user, eventId: inEventId }) => {
      if (inEventId === eventId) {
        setOtherProfiles((prev) => {
          if (prev.some(p => p._id === user._id)) return prev;
          return [...prev, user];
        });
      }
    });

    return () => {
      socket.off("user-checked-in");
      socket.off("user-checked-out");
      socket.off("connect_error");
      socket.off("error");
      socket.emit("leave-event", { eventId });
    };
  }, [currentEvent, navigate, setOtherProfiles]);

  return (
    <div className="others">
      <div className="others__event-info">
        <h1 className="others__title">{currentEvent?.name || "Event"}</h1>
        {currentEvent?.address && (
          <p className="others__location">{currentEvent.address}</p>
        )}
      </div>
      <h2 className="others__subtitle">People Checked In</h2>

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

                <p className="others__starter">{user.convoStarter}</p>
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
