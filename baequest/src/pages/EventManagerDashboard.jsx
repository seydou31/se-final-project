import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  eventManagerGetDashboard,
  eventManagerGetMe,
  eventManagerGetOnboardingLink,
  logout,
} from '../utils/api.js';
import EventManagerTermsModal from '../components/EventManagerTermsModal.jsx';
import '../blocks/event-manager.css';

const TERMS_KEY = 'em_terms_accepted';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function EventManagerDashboard() {
  const [data, setData] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(() => !localStorage.getItem(TERMS_KEY));
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([eventManagerGetDashboard(), eventManagerGetMe()])
      .then(([dashboard, manager]) => {
        setData(dashboard);
        setMe(manager);
      })
      .catch(() => {
        navigate('/event-manager/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleConnectStripe() {
    try {
      const res = await eventManagerGetOnboardingLink();
      window.location.href = res.url;
    } catch {
      setError('Could not start Stripe onboarding. Please try again.');
    }
  }

  async function handleLogout() {
    await logout().catch(() => {});
    navigate('/event-manager/login');
  }

  function handleAcceptTerms() {
    localStorage.setItem(TERMS_KEY, 'true');
    setShowTerms(false);
  }

  if (loading) {
    return (
      <div className="em-page">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="em-dashboard">
      {showTerms && <EventManagerTermsModal onAccept={handleAcceptTerms} />}
      <div className="em-dashboard__header">
        <h1 className="em-dashboard__title">{me?.name ? `${me.name}'s Dashboard` : 'Event Manager Dashboard'}</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="em-btn em-btn--primary" style={{ width: 'auto', padding: '8px 18px' }} onClick={() => navigate('/event-manager/create-event')}>+ Create Event</button>
          <button className="em-dashboard__logout" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      {me && !me.stripeOnboardingComplete && (
        <div className="em-onboarding-banner">
          <p>Connect your bank account to receive payouts when charging is enabled.</p>
          <button className="em-btn em-btn--primary" onClick={handleConnectStripe}>
            Connect Bank Account
          </button>
        </div>
      )}

      {error && <p className="em-error" style={{ maxWidth: 900, margin: '0 auto 16px' }}>{error}</p>}

      <div className="em-stats">
        <div className="em-stat-card">
          <p className="em-stat-card__label">Total Events</p>
          <p className="em-stat-card__value">{data?.events.length ?? 0}</p>
        </div>
        <div className="em-stat-card">
          <p className="em-stat-card__label">Total Check-ins</p>
          <p className="em-stat-card__value">{data?.totalCheckins ?? 0}</p>
        </div>
        <div className="em-stat-card">
          <p className="em-stat-card__label">Projected Earnings</p>
          <p className="em-stat-card__value">${data?.totalEarnings ?? '0.00'}</p>
        </div>
        <div className="em-stat-card">
          <p className="em-stat-card__label">Ticket Price</p>
          <p className="em-stat-card__value">${data?.ticketPrice?.toFixed(2) ?? '—'}</p>
        </div>
      </div>

      <div className="em-table-wrapper">
        <table className="em-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Check-ins</th>
              <th>Your Earnings (30%)</th>
            </tr>
          </thead>
          <tbody>
            {data?.events.length === 0 ? (
              <tr>
                <td colSpan={4} className="em-table__empty">
                  No events yet. Create your first event to get started.
                </td>
              </tr>
            ) : (
              data?.events.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{formatDate(event.startTime)}</td>
                  <td>{event.checkinCount}</td>
                  <td>${event.earnings}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
