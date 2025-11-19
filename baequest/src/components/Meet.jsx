import Event from "./Event";
import OtherUsers from "./OtherUsers";
import "../blocks/meetup.css";

export default function Meet({
  events,
  handleFindEvents,
  handleCheckin,
  otherProfiles,
  setOtherProfiles,
  handleCheckoutModal,
  currentEvent,
  isCheckedIn,
  setCurrentEvent,
  setIsCheckedIn,
}) {
  function handleClick() {
    handleFindEvents();
  }

  return (
    <>
      {isCheckedIn ? (
        <OtherUsers
          handleCheckoutModal={handleCheckoutModal}
          otherProfiles={otherProfiles}
          setOtherProfiles={setOtherProfiles}
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent} 
          setIsCheckedIn={setIsCheckedIn} 
        />
      ) : (
        <div className="meet">
          <h1 className="meet__title">Find events near you</h1>
          <button onClick={handleClick} type="button" className="meet__btn">
            Find
          </button>
          {events &&
            events.map((event) => {
              return (
                <Event
                  key={event._id}
                  event={event}
                  handleCheckin={handleCheckin}
                />
              );
            })}
        </div>
      )}
    </>
  );
}
