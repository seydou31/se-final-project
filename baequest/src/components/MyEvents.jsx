import Event from "./Event";
import { markAsGoing } from "../utils/api";
import "../blocks/my-events.css";

export default function MyEvents({ events, handleCheckin }) {
  const handleImGoing = async (event) => {
    try {
      const result = await markAsGoing(event._id);
      return result;
    } catch (error) {
      console.error('Error marking as going:', error);
      throw error;
    }
  };

  // Filter to show only events the user is going to
  const myEvents = events.filter((event) => event.isUserGoing);

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
