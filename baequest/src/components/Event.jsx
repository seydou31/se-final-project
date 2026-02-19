import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';
import '../blocks/event.css'

export default function Event({ event, handleCheckin, handleImGoing }) {
  const [goingCount, setGoingCount] = useState(event.goingCount || 0);
  const [isGoing, setIsGoing] = useState(event.isUserGoing || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showGoingTooltip, setShowGoingTooltip] = useState(false);
  const [showCheckinTooltip, setShowCheckinTooltip] = useState(false);

  useEffect(() => {
    setGoingCount(event.goingCount || 0);
    setIsGoing(event.isUserGoing || false);
  }, [event.goingCount, event.isUserGoing, event._id]);

  const handleGoingClick = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const response = await handleImGoing(event);
      setIsGoing(response.isGoing);
      setGoingCount(response.goingCount);
    } catch (error) {
      toast.error(`Failed: ${error.message || "Please try again"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckinClick = async () => {
    if (isCheckingIn) return;
    try {
      setIsCheckingIn(true);
      await handleCheckin(event);
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const formatEventTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateStr = start.toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const startTime = start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime = end.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${dateStr} • ${startTime} - ${endTime}`;
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 0) return "In progress";
    if (diffMins < 60) return `Starts in ${diffMins} minutes`;
    if (diffHours < 24) return `Starts in ${diffHours} hours`;
    return `Starts in ${diffDays} days`;
  };

  const formatDistance = (km) => {
    if (km == null) return null;
    const miles = km * 0.621371;
    return miles < 0.1 ? "Nearby" : `${miles.toFixed(1)} mi away`;
  };

  const distanceLabel = formatDistance(event.distanceKm);

  return (
    <div className="event">
      <div className="event__image event__image--placeholder">
        <svg className="event__placeholder-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
        </svg>
        <span className="event__placeholder-text">Event</span>
      </div>

      <div className="event__content">
        <div className="event__title-row">
          <h2 className="event__title">{event.name}</h2>
          {distanceLabel && <span className="event__distance">{distanceLabel}</span>}
        </div>

        <p className="event__date">📅 {formatEventTime(event.startTime, event.endTime)}</p>

        {event.address && (
          <p className="event__location">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="event__map-link"
            >
              📍 {event.address}
            </a>
          </p>
        )}

        <p className="event__starts">{getRelativeTime(event.startTime)}</p>

        {goingCount > 0 && !(isGoing && goingCount === 1) && (
          <p className="event__attendees">
            {isGoing
              ? `${goingCount - 1} other ${goingCount - 1 === 1 ? 'person' : 'people'} going`
              : `${goingCount} ${goingCount === 1 ? 'person' : 'people'} going`}
          </p>
        )}

        <div className="event__actions">
          <div className="event__button-with-info">
            <span className={`event__tooltip ${showGoingTooltip ? 'event__tooltip--visible' : ''}`}>
              {isGoing ? "Click to remove from My Events" : "Save this event to your My Events list"}
            </span>
            <button
              onClick={handleGoingClick}
              className={`event__going ${isGoing ? 'event__going--active' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : (isGoing ? '✓ Going' : "I'm Going")}
            </button>
            <div className="event__info-wrapper">
              <Info size={16} className="event__info-icon" onClick={() => setShowGoingTooltip(!showGoingTooltip)} />
            </div>
          </div>

          <div className="event__button-with-info">
            <span className={`event__tooltip ${showCheckinTooltip ? 'event__tooltip--visible' : ''}`}>
              Check in when you arrive to see other attendees
            </span>
            <button
              onClick={handleCheckinClick}
              className="event__checkin"
              disabled={isCheckingIn}
            >
              {isCheckingIn ? "Checking in..." : "I'm here"}
            </button>
            <div className="event__info-wrapper">
              <Info size={16} className="event__info-icon" onClick={() => setShowCheckinTooltip(!showCheckinTooltip)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}