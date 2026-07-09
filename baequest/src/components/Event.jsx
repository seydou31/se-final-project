import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import getImageUrl from "../utils/getImageUrl";

function formatEventTime(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const day = start.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const startTime = start.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const endTime = end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const isSameDay = start.toDateString() === end.toDateString();
  return isSameDay
    ? `${day} · ${startTime} – ${endTime}`
    : `${day} ${startTime} – ${end.toLocaleString("en-US", { month: "short", day: "numeric" })} ${endTime}`;
}

function getBadge(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start <= now && end >= now) return { label: "Live Now", className: "bg-green-600 text-white" };
  const diffMs = start - now;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return { label: `Starts in ${diffMins}m`, className: "bg-blue-600 text-white" };
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return { label: `Starts in ${diffHours}h`, className: "bg-blue-600 text-white" };
  const diffDays = Math.floor(diffHours / 24);
  return { label: `Starts in ${diffDays}d`, className: "bg-blue-600 text-white" };
}

function formatDistance(km) {
  if (km == null) return null;
  const miles = km * 0.621371;
  return miles < 0.1 ? "Nearby" : `${miles.toFixed(1)} mi`;
}

export default function Event({ event, handleCheckin, handleImGoing, currentTime }) {
  const [goingCount, setGoingCount] = useState(event.goingCount || 0);
  const [isGoing, setIsGoing] = useState(event.isUserGoing || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    setGoingCount(event.goingCount || 0);
    setIsGoing(event.isUserGoing || false);
  }, [event.goingCount, event.isUserGoing, event._id]);

  // Calculate event status and time-based actions
  const startTime = new Date(event.startTime).getTime();
  const endTime = new Date(event.endTime).getTime();
  const checkinOpenTime = startTime - (2 * 60 * 60 * 1000);
  const canCheckIn = currentTime >= checkinOpenTime && currentTime < startTime;
  const canImHere = currentTime >= startTime && currentTime <= endTime;

  //const isLive = new Date(event.startTime) <= new Date() && new Date(event.endTime) >= new Date();
  const isFree = !event.ticketPrice || event.ticketPrice === 0;
  const badge = getBadge(event.startTime, event.endTime);
  const distance = formatDistance(event.distanceKm);
  const price = isFree ? "Free" : `$${(event.ticketPrice / 100).toFixed(2)}`;

  const handleGoingClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await handleImGoing(event);
      setIsGoing(response.isGoing);
      setGoingCount(response.goingCount);
      toast.success(response.isGoing ? "Added to My Events!" : "Removed from My Events");
    } catch (error) {
      toast.error(error.message || "Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckinClick = async () => {
    if (isCheckingIn) return;
    setIsCheckingIn(true);
    try { await handleCheckin(event); }
    catch (error) { console.error("Check-in failed:", error); }
    finally { setIsCheckingIn(false); }
  };

  const handleShareClick = async () => {
    const text = `Check out ${event.name} on BaeQuest! 🍸\n${formatEventTime(event.startTime, event.endTime)}${event.address ? `\n${event.address}` : ''}\n\nJoin the singles social → baequests.com`;
    if (navigator.share) {
      try { await navigator.share({ title: event.name, text, url: 'https://baequests.com' }); }
      catch (_) { /* user cancelled or share not supported */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(42,52,57,0.12)] shadow-sm">

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
        {event.photo ? (
          <img
            src={getImageUrl(event.photo ?? event.image)}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high transition-transform duration-500 group-hover:scale-110">
            <span className="material-symbols-outlined text-5xl text-outline-variant">event</span>
          </div>
        )}

        {/* Status badge */}
        <div className={`absolute top-3 left-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full ${badge.className}`}>
          {badge.label}
        </div>

        {/* Free badge */}
        {isFree && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
            Free
          </div>
        )}

        {/* Distance */}
        {distance && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm">
            {distance}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
          {event.name}
        </h3>

        {/* Date */}
        <p className="text-sm text-primary mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          {formatEventTime(event.startTime, event.endTime)}
        </p>

        {/* Location */}
        {event.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-on-surface-variant mb-3 flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            {event.address}
          </a>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-xs text-on-surface-variant mb-3 line-clamp-2 leading-relaxed">{event.description}</p>
        )}

        {/* Live count */}
        {(event.liveMen > 0 || event.liveWomen > 0) && (
          <p className="text-xs text-green-700 bg-green-50 rounded-full px-3 py-1 inline-flex items-center gap-1 mb-3 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            {event.liveMen + event.liveWomen} here now · {event.liveWomen}F · {event.liveMen}M
          </p>
        )}

        {/* Footer: price + count */}
        <div className="mt-auto pt-4 border-t border-surface-container flex justify-between items-center">
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Price</p>
            <p className={`text-lg font-black ${isFree ? "text-green-600" : "text-on-surface"}`}>{price}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Attending</p>
            <p className="text-sm font-semibold">{goingCount} {goingCount === 1 ? "person" : "people"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2">
          {/* Going */}
          <button
            onClick={handleGoingClick}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-200 active:scale-95 ${
              isGoing
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white"
            } disabled:opacity-60`}
          >
            {isSubmitting ? "..." : isGoing ? "✓ Going" : "I'm Going"}
          </button>

          {/* Check In enabled 2h before event starts */}
          {(canCheckIn || canImHere) && (
            <button
              onClick={handleCheckinClick}
              disabled={isCheckingIn}
              className="w-full py-3 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dim transition-all duration-200 active:scale-95 disabled:opacity-60"
            >
              {isCheckingIn
                ? "Checking in..."
                : canImHere
                ? "I'm Here"
                : "Check In"}
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShareClick}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant border border-surface-container-highest hover:bg-surface-container hover:text-on-surface transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            Share Event
          </button>

          {/* External link */}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs text-primary font-semibold hover:underline mt-1"
            >
              More Info ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
