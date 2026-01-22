import { useState, useEffect } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { getUsersAtEvent } from '../utils/api';
import '../blocks/event.css'

export default function Event({ event, handleCheckin, handleImGoing }) {
  const [attendeeCount, setAttendeeCount] = useState(event.goingCount || 0);
  const [isGoing, setIsGoing] = useState(event.isUserGoing || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoingTooltip, setShowGoingTooltip] = useState(false);
  const [showCheckinTooltip, setShowCheckinTooltip] = useState(false);

  // Initialize attendeeCount and isGoing from the event data
  useEffect(() => {
    setAttendeeCount(event.goingCount || 0);
    setIsGoing(event.isUserGoing || false);
  }, [event.goingCount, event.isUserGoing, event._id]);

  const handleGoingClick = async () => {
    if (isSubmitting || isGoing) return; // Prevent double-clicks

    try {
      setIsSubmitting(true);
      const response = await handleImGoing(event);
      setIsGoing(true);
      // Immediately update the count with the response from the server
      if (response && response.count !== undefined) {
        setAttendeeCount(response.count);
      }
    } catch (error) {
      console.error('Error marking as going:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="event__content">
        <h2 className="event__title">{event.title}</h2>
        <p className="event__date">📅 {formatEventTime(event.date, event.endTime)}</p>
        <p className="event__location">
      
          {event.location.address && (
            <>
              <br />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="event__map-link"
              >
                View on Map
              </a>
            </>
          )}
        </p>
        <p className="event__starts">{getRelativeTime(event.date)}</p>
       
        {event.url && (
          <p className="event__link">
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="event__external-link"
            >
              Event Website
              <ExternalLink size={16} />
            </a>
          </p>
        )}
        {attendeeCount > 0 && !(isGoing && attendeeCount === 1) && (
          <p className="event__attendees">
            {isGoing ? (
              // You're going, show others count (total - 1)
              `${attendeeCount - 1} other ${attendeeCount - 1 === 1 ? 'person' : 'people'} going`
            ) : (
              // You're not going, show total count
              `${attendeeCount} ${attendeeCount === 1 ? 'person' : 'people'} going`
            )}
          </p>
        )}
        <div className="event__actions">
          <div className="event__button-with-info">
            <span className={`event__tooltip ${showGoingTooltip ? 'event__tooltip--visible' : ''}`}>
              Save this event to your My Events list so you can check in later
            </span>
            <button
              onClick={handleGoingClick}
              className={`event__going ${isGoing ? 'event__going--active' : ''}`}
              disabled={isGoing || isSubmitting}
            >
              {isSubmitting ? 'Loading...' : (isGoing ? 'Going' : "I'm Going")}
            </button>
            <div className="event__info-wrapper">
              <Info
                size={16}
                className="event__info-icon"
                onClick={() => setShowGoingTooltip(!showGoingTooltip)}
              />
            </div>
          </div>
          <div className="event__button-with-info">
            <span className={`event__tooltip ${showCheckinTooltip ? 'event__tooltip--visible' : ''}`}>
              Check in when you arrive at the event to see other attendees
            </span>
            <button onClick={() => handleCheckin(event)} className="event__checkin">
              I'm here
            </button>
            <div className="event__info-wrapper">
              <Info
                size={16}
                className="event__info-icon"
                onClick={() => setShowCheckinTooltip(!showCheckinTooltip)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}