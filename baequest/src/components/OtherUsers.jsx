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

  useEffect(() => {
    if (!currentEvent?._id) {
      console.warn("No current event on OtherUsers page");
      navigate("/meet");
      return;
    }

    socket.emit("join-event", { eventId: currentEvent._id });
    console.log("🔵 Joining room:", currentEvent._id);

    // Listen for users checking OUT
    socket.on("user-checked-out", ({ userId, eventId }) => {
      console.log("RECEIVED user-checked-out:", { userId, eventId });
      
      if (eventId === currentEvent._id) {
        console.log("Event ID matches! Filtering user:", userId);
        setOtherProfiles((prev) => prev.filter((user) => user._id !== userId));
      }
    });

    // Listen for users checking IN
    socket.on("user-checked-in", ({ user, eventId }) => {
      console.log(" RECEIVED user-checked-in:", { user, eventId });
      
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

    // ✅ Listen for event expiration / force checkout (OUTSIDE other listeners!)
    socket.on("force-checkout", ({ message, eventId }) => {
      console.log(" Force checkout:", message, eventId);
      
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
      socket.off("force-checkout"); // ✅ Clean up force-checkout
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
              <h2 className="others__name">
                {user.name}, {user.age}
              </h2>
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
          ))}
        </div>
      )}
      <button onClick={handleCheckoutModal} type="button" className="others__checkout">
        Check Out
      </button>
    </div>
  );
}