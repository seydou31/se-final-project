import { useState } from 'react';
import '../blocks/admin.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.baequests.com';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [managerSearch, setManagerSearch] = useState('');
  const [eventSearches, setEventSearches] = useState({});
  const [eventDateFrom, setEventDateFrom] = useState({});
  const [eventDateTo, setEventDateTo] = useState({});

  async function handleFetch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/overview`, {
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) {
        setError('Invalid admin secret or server error.');
        setData(null);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setError('Failed to reach the server.');
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const filteredManagers = data
    ? data.filter(m => {
        const q = managerSearch.toLowerCase();
        return !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      })
    : [];

  function getFilteredEvents(manager) {
    const q = (eventSearches[manager._id] || '').toLowerCase();
    const from = eventDateFrom[manager._id] ? new Date(eventDateFrom[manager._id]) : null;
    const to = eventDateTo[manager._id] ? new Date(eventDateTo[manager._id]) : null;

    return manager.events.filter(event => {
      if (q && !event.name.toLowerCase().includes(q)) return false;
      const eventDate = new Date(event.startTime);
      if (from && eventDate < from) return false;
      if (to && eventDate > to) return false;
      return true;
    });
  }

  const totalEarnings = data ? data.reduce((sum, m) => sum + m.totalEarnings, 0).toFixed(2) : null;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">BaeQuest Admin</h1>
        <form className="admin-auth" onSubmit={handleFetch}>
          <input
            type="password"
            className="admin-secret-input"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
          />
          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Load Data'}
          </button>
        </form>
        {error && <p className="admin-error">{error}</p>}
      </div>

      {data && (
        <>
          <div className="admin-summary">
            <div className="admin-stat">
              <span className="admin-stat__label">Event Managers</span>
              <span className="admin-stat__value">{data.length}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__label">Total Events</span>
              <span className="admin-stat__value">{data.reduce((s, m) => s + m.totalEvents, 0)}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__label">Total Manager Earnings</span>
              <span className="admin-stat__value">${totalEarnings}</span>
            </div>
          </div>

          <div className="admin-search-bar">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search event managers by name or email..."
              value={managerSearch}
              onChange={(e) => setManagerSearch(e.target.value)}
            />
          </div>

          <div className="admin-managers">
            {filteredManagers.length === 0 && <p className="admin-empty">No event managers found.</p>}
            {filteredManagers.map(manager => {
              const filteredEvents = getFilteredEvents(manager);
              return (
                <div key={manager._id} className="admin-manager-card">
                  <div className="admin-manager-card__header" onClick={() => toggleExpand(manager._id)}>
                    <div className="admin-manager-card__info">
                      <span className="admin-manager-card__name">{manager.name}</span>
                      <span className="admin-manager-card__email">{manager.email}</span>
                      <span className={`admin-manager-card__stripe ${manager.stripeOnboardingComplete ? 'admin-manager-card__stripe--connected' : ''}`}>
                        {manager.stripeOnboardingComplete ? 'Stripe connected' : 'Stripe not connected'}
                      </span>
                    </div>
                    <div className="admin-manager-card__meta">
                      <span>{manager.totalEvents} event{manager.totalEvents !== 1 ? 's' : ''}</span>
                      <span className="admin-manager-card__earnings">${manager.totalEarnings.toFixed(2)} earned</span>
                      <span className="admin-manager-card__toggle">{expanded[manager._id] ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expanded[manager._id] && (
                    <div className="admin-manager-card__events">
                      <div className="admin-event-filters">
                        <input
                          type="text"
                          className="admin-search-input admin-search-input--sm"
                          placeholder="Search events by name..."
                          value={eventSearches[manager._id] || ''}
                          onChange={(e) => setEventSearches(prev => ({ ...prev, [manager._id]: e.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="date"
                          className="admin-date-input"
                          value={eventDateFrom[manager._id] || ''}
                          onChange={(e) => setEventDateFrom(prev => ({ ...prev, [manager._id]: e.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="admin-date-sep">to</span>
                        <input
                          type="date"
                          className="admin-date-input"
                          value={eventDateTo[manager._id] || ''}
                          onChange={(e) => setEventDateTo(prev => ({ ...prev, [manager._id]: e.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {filteredEvents.length === 0 ? (
                        <p className="admin-empty">No events match your search.</p>
                      ) : (
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Event</th>
                              <th>Location</th>
                              <th>Date</th>
                              <th>Paid Check-ins</th>
                              <th>Manager Earnings (30%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEvents.map(event => (
                              <tr key={event._id}>
                                <td>{event.name}</td>
                                <td>{event.city}, {event.state}</td>
                                <td>{formatDate(event.startTime)}</td>
                                <td>{event.paidCheckinCount}</td>
                                <td>${event.earnings.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
