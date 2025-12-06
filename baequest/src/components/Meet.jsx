import { useState } from "react";
import Event from "./Event";
import OtherUsers from "./OtherUsers";
import "../blocks/meetup.css";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

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
  const [selectedState, setSelectedState] = useState("");

  function handleClick() {
    handleFindEvents(selectedState);
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
          <div className="meet__filter">
            <label htmlFor="state-select" className="meet__label">
              Select State:
            </label>
            <select
              id="state-select"
              className="meet__select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">All States</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
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
