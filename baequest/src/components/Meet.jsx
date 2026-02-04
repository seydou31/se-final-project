import { useState, useEffect } from "react";
import Event from "./Event";
import OtherUsers from "./OtherUsers";
import Calendar from "./Calendar";
import Loading from "./Loading";
import { markAsGoing } from "../utils/api";
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
  "Washington DC", "West Virginia", "Wisconsin", "Wyoming"
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
  isLoadingEvents = false,
}) {
  // Initialize from localStorage
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem("selectedState") || "";
  });
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("selectedCity") || "";
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : null;
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (selectedState) {
      localStorage.setItem("selectedState", selectedState);
    } else {
      localStorage.removeItem("selectedState");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("selectedCity", selectedCity);
    } else {
      localStorage.removeItem("selectedCity");
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem("selectedDate", selectedDate.toISOString());
    } else {
      localStorage.removeItem("selectedDate");
    }
  }, [selectedDate]);

  // Automatically load events on mount if filters exist
  useEffect(() => {
    if (selectedState || selectedCity) {
      handleFindEvents(selectedState, selectedCity);
    }
  }, []); // Only run once on mount

  function handleClick() {
    handleFindEvents(selectedState, selectedCity);
  }

  const handleImGoing = async (event) => {
    try {
      const result = await markAsGoing(event._id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Filter events by selected date
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : events;

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

            <label htmlFor="city-input" className="meet__label">
              City (optional):
            </label>
            <input
              id="city-input"
              type="text"
              className="meet__input"
              placeholder="Enter city name"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            />

            <div className="meet__calendar-container">
              <label className="meet__label">Select Date:</label>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                events={events}
              />
            </div>
          </div>
          <button onClick={handleClick} type="button" className="meet__btn">
            Find
          </button>
          {isLoadingEvents ? (
            <Loading message="Loading events..." />
          ) : (
            filteredEvents &&
            filteredEvents.map((event) => {
              return (
                <Event
                  key={event._id}
                  event={event}
                  handleCheckin={handleCheckin}
                  handleImGoing={handleImGoing}
                />
              );
            })
          )}
        </div>
      )}
    </>
  );
}
