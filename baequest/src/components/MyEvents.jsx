import { useState, useEffect } from "react";
import Event from "./Event";
import { getAllEvents, markAsGoing } from "../utils/api";
import "../blocks/my-events.css";

export default function MyEvents({ handleCheckin }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllEvents()
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleImGoing = async (event) => {
    const result = await markAsGoing(event._id);
    setEvents((prev) =>
      prev.map((e) =>
        e._id === event._id
          ? { ...e, isUserGoing: result.isGoing, goingCount: result.goingCount }
          : e
      )
    );
    return result;
  };

  const myEvents = events.filter((event) => event.isUserGoing);

  if (isLoading) {
    return (
      <div className="my-events">
        <p className="my-events__loading">Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="my-events">
      <h1 className="my-events__title">My Events</h1>
      <p className="my-events__subtitle">
        Events you're planning to attend
      </p>

      {myEvents.length === 0 ? (
        <div className="my-events__empty">
          <div className="my-events__empty-icon">📅</div>
          <h2 className="my-events__empty-title">No events yet</h2>
          <p className="my-events__empty-text">
            Browse events and click "I'm Going" to add them here
          </p>
        </div>
      ) : (
        <div className="my-events__grid">
          {myEvents.map((event) => (
            <Event
              key={event._id}
              event={event}
              handleCheckin={handleCheckin}
              handleImGoing={handleImGoing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
