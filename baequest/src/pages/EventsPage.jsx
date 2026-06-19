import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { getAllEvents, markAsGoing } from "../utils/api";
import Event from "../components/Event";
import OtherUsers from "../components/OtherUsers";
import useEventStore from "../store/useEventStore";
import toast from "react-hot-toast";
import SocketContext from "../context/SocketContext";


export default function EventsPage({
  handleCheckin,
  handleCheckoutModal,
  otherProfiles,
  setOtherProfiles,
}) {
  // NEW: read from Zustand store directly so UI reacts instantly after check-in
  const { isCheckedIn, currentEvent } = useEventStore();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [filters, setFilters] = useState({ state: "", city: "", zipcode: "", dateFrom: "", dateTo: "" });
  const { eventVersion } = useContext(SocketContext);

  const coordsRef = useRef(null);
  const prevIsCheckedIn = useRef(isCheckedIn);
  const location = useLocation(); // NEW

  // NEW: auto-refresh when navigated here with { state: { refresh: true } }
  // This fires when an event manager creates a new event and redirects to /events
  useEffect(() => {
    if (location.state?.refresh) {
      fetchEvents(coordsRef.current, {});
      // clear the flag so back-navigation doesn't re-trigger
      window.history.replaceState({}, "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.refresh]);

  // Re-fetch events list when user checks out (so live counts update)
  useEffect(() => {
    if (prevIsCheckedIn.current === true && !isCheckedIn) {
      fetchEvents(coordsRef.current, {});
    }
    prevIsCheckedIn.current = isCheckedIn;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckedIn]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        coordsRef.current = coords;
        fetchEvents(coords, {});
      },
      () => { fetchEvents(null, {}); }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async (coords, filterOverrides, silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const activeFilters = { ...filters, ...filterOverrides };
      const params = coords ? { ...activeFilters, lat: coords.lat, lng: coords.lng } : activeFilters;
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const data = await getAllEvents(params);
      setEvents(data);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFilterSubmit = (e) => { e.preventDefault(); fetchEvents(coordsRef.current, {}); };

  const handleClearFilters = () => {
    const cleared = { state: "", city: "", zipcode: "", dateFrom: "", dateTo: "" };
    setFilters(cleared);
    fetchEvents(coordsRef.current, cleared);
  };

  const handleImGoing = async (event) => {
    const response = await markAsGoing(event._id);
    setEvents(prev => prev.map(e =>
      e._id === event._id ? { ...e, isUserGoing: response.isGoing, goingCount: response.goingCount } : e
    ));
    return response;
  };

  useEffect(() => {
    if (!isCheckedIn) {
      fetchEvents(coordsRef.current, {}, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isCheckedIn,
    eventVersion
  ]);

  useEffect(() => {
    const currentTimeinterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(currentTimeinterval);
  }, []);

  // Show checked-in view — reads from store, so renders immediately after check-in
  // without needing a page refresh
  if (isCheckedIn && currentEvent) {
    return (
      <OtherUsers
        otherProfiles={otherProfiles}
        setOtherProfiles={setOtherProfiles}
        handleCheckoutModal={handleCheckoutModal}
        currentEvent={currentEvent}
      />
    );
  }

  return (
    <main className="pt-24 pb-28 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Search & Filter Bar */}
      <section className="mb-10 sm:mb-12">
        <div className="bg-surface-container-low rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
          <form onSubmit={handleFilterSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

              {/* State */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">State</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">map</span>
                  <input
                    name="state" value={filters.state} onChange={handleFilterChange}
                    className="w-full pl-10 bg-white rounded-lg text-sm py-3 outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/10"
                    placeholder="e.g. New York"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">City</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">location_city</span>
                  <input
                    name="city" value={filters.city} onChange={handleFilterChange}
                    className="w-full pl-10 bg-white rounded-lg text-sm py-3 outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/10"
                    placeholder="e.g. Manhattan"
                  />
                </div>
              </div>

              {/* Zip */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Zip Code</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">pin_drop</span>
                  <input
                    name="zipcode" value={filters.zipcode} onChange={handleFilterChange}
                    className="w-full pl-10 bg-white rounded-lg text-sm py-3 outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/10"
                    placeholder="10024"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">From</label>
                  <input
                    type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange}
                    className="w-full bg-white rounded-lg text-sm py-3 px-3 outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">To</label>
                  <input
                    type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange}
                    className="w-full bg-white rounded-lg text-sm py-3 px-3 outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/10"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-outline-variant/10">
              <button
                type="button" onClick={handleClearFilters}
                className="px-6 sm:px-8 py-3 text-sm font-semibold rounded-lg hover:bg-surface-container-highest text-on-surface-variant transition-colors"
              >
                Clear Filters
              </button>
              <button
                type="submit"
                className="px-8 sm:px-10 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary-dim active:scale-95 transition-all"
              >
                Search Events
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-on-surface font-headline">
            Curated Events
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1">
            {userCoords ? "Showing events closest to you" : "Explore the best happenings in your area."}
          </p>
        </div>
      </header>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(8)].map((_, i) => (
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
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-outline-variant">event_busy</span>
          </div>
          <h2 className="text-xl font-bold mb-2">No events found</h2>
          <p className="text-on-surface-variant max-w-sm">Try adjusting your filters or check back soon for new events.</p>
          <button onClick={handleClearFilters} className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-primary-dim transition-colors">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {events.map(event => (
              <Event
                key={event._id}
                event={event}
                handleCheckin={handleCheckin}
                handleImGoing={handleImGoing}
                currentTime={currentTime}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
