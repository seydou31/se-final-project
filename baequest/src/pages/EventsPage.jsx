import { useState, useEffect, useRef } from "react";
import { getAllEvents, markAsGoing } from "../utils/api";
import Event from "../components/Event";
import OtherUsers from "../components/OtherUsers";
import toast from "react-hot-toast";
import "../blocks/events-page.css";

export default function EventsPage({
  handleCheckin,
  handleCheckoutModal,
  currentEvent,
  otherProfiles,
  setOtherProfiles,
  isCheckedIn,
}) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [filters, setFilters] = useState({ state: "", city: "", zipcode: "", dateFrom: "", dateTo: "" });

  const coordsRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        coordsRef.current = coords;
        fetchEvents(coords, {});
      },
      () => {
        // Permission denied — fetch without coords
        fetchEvents(null, {});
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async (coords, filterOverrides) => {
    setIsLoading(true);
    try {
      const activeFilters = { ...filters, ...filterOverrides };
      const params = coords ? { ...activeFilters, lat: coords.lat, lng: coords.lng } : activeFilters;
      // Remove empty string values
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const data = await getAllEvents(params);
      setEvents(data);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchEvents(coordsRef.current, {});
  };

  const handleClearFilters = () => {
    const cleared = { state: "", city: "", zipcode: "", dateFrom: "", dateTo: "" };
    setFilters(cleared);
    fetchEvents(coordsRef.current, cleared);
  };

  const handleImGoing = async (event) => {
    const response = await markAsGoing(event._id);
    // Update local state optimistically
    setEvents(prev => prev.map(e =>
      e._id === event._id
        ? { ...e, isUserGoing: response.isGoing, goingCount: response.goingCount }
        : e
    ));
    return response;
  };

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
    <main className="events-page">
      <div className="events-page__header">
        <h1 className="events-page__title">Events</h1>
        <p className="events-page__subtitle">
          {userCoords ? "Showing events closest to you" : "Browse upcoming events"}
        </p>
      </div>

      <form className="events-page__filters" onSubmit={handleFilterSubmit}>
        <div className="events-page__filter-row">
          <input
            className="events-page__filter-input"
            type="text"
            name="state"
            placeholder="State (e.g. DC)"
            value={filters.state}
            onChange={handleFilterChange}
          />
          <input
            className="events-page__filter-input"
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <input
            className="events-page__filter-input"
            type="text"
            name="zipcode"
            placeholder="Zip code"
            value={filters.zipcode}
            onChange={handleFilterChange}
          />
        </div>
        <div className="events-page__filter-row">
          <label className="events-page__filter-label">
            From
            <input
              className="events-page__filter-input events-page__filter-input--date"
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </label>
          <label className="events-page__filter-label">
            To
            <input
              className="events-page__filter-input events-page__filter-input--date"
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </label>
          <button type="submit" className="events-page__filter-btn">Search</button>
          <button type="button" className="events-page__clear-btn" onClick={handleClearFilters}>Clear</button>
        </div>
      </form>

      {isLoading ? (
        <div className="events-page__loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="events-page__empty">
          <div className="events-page__empty-icon">📅</div>
          <h2 className="events-page__empty-title">No events found</h2>
          <p className="events-page__empty-text">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="events-page__grid">
          {events.map(event => (
            <Event
              key={event._id}
              event={event}
              handleCheckin={handleCheckin}
              handleImGoing={handleImGoing}
            />
          ))}
        </div>
      )}
    </main>
  );
}
