import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Event from "./Event";
import { getAllEvents, markAsGoing } from "../utils/api";

export default function MyEvents({ handleCheckin }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleCheckinAndRedirect = async (event) => {
    await handleCheckin(event); // throws on failure — no redirect if check-in failed
    navigate("/events");
  };

  const myEvents = events.filter((event) => event.isUserGoing);

  return (
    <main className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Page Header */}
      <header className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-on-surface font-headline">
            My Events
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant font-medium">
            Events you&apos;re planning to attend
          </p>
        </div>
      </header>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[4/3] bg-surface-container" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-surface-container rounded w-3/4" />
                <div className="h-4 bg-surface-container rounded w-1/2" />
                <div className="h-4 bg-surface-container rounded w-2/3" />
                <div className="h-10 bg-surface-container rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : myEvents.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant">bookmark_border</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-on-surface">No saved events yet</h2>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-sm leading-relaxed mb-8">
            Explore events and click &ldquo;I&apos;m Going&rdquo; to save them here for easy access.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dim active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-base">search</span>
            Browse Events
          </Link>
        </div>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {myEvents.map((event) => (
            <Event
              key={event._id}
              event={event}
              handleCheckin={handleCheckinAndRedirect}
              handleImGoing={handleImGoing}
            />
          ))}
        </div>
      )}
    </main>
  );
}
