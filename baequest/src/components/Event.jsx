import '../blocks/event.css'

export default function Event({ event, handleCheckin }) {

  const formatEventTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const dateStr = start.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    
    const startTime = start.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const endTime = end.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr} • ${startTime} - ${endTime}`;
  };

  const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 0) return "Started";
  if (diffMins < 60) return `Starts in ${diffMins} minutes`;
  if (diffHours < 24) return `Starts in ${diffHours} hours`;
  return `Starts in ${diffDays} days`;
};

  return (
    <div className="event">
      <img src={event.image} alt={event.title} className="event__image" />
      <h2 className="event__title">{event.title}</h2>
      <p className="event__date">📅 {formatEventTime(event.date, event.endTime)}</p>
      <p className="event__location">📍 {event.location.name}</p>
      <p className="event__starts">{getRelativeTime(event.date)}</p>
      <p className="event__description">{event.description}</p>
      <button onClick={() => handleCheckin(event)} className="event__checkin">
        Check In
      </button>
    </div>
  );
}